import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';
import subscriptionReducer from './subscriptionSlice';
import { readStored, writeStored } from '../utils/storage';

const COINS_KEY = 'astro:coins';
const SUB_KEY = 'astro:subscription';

/**
 * Bring a persisted ledger up to the current shape. The pre-Redux ledger used
 * { revealEarned, partners } and tagged lots with `type`; migrate rather than
 * discard, so nobody loses a balance on upgrade.
 */
function migrate(saved) {
  if (!saved || !Array.isArray(saved.lots)) return undefined;

  const lots = saved.lots.map((l) => ({
    ...l,
    source: l.source ?? (l.type === 'earn_referral' ? 'referral' : 'reveal')
  }));

  const earnedBySource = saved.earnedBySource ?? {
    ...(saved.revealEarned ? { reveal: saved.revealEarned } : {})
  };

  const dedupeKeys = saved.dedupeKeys ?? saved.partners ?? [];

  return {
    coins: {
      lots,
      spends: Array.isArray(saved.spends) ? saved.spends : [],
      earnedBySource,
      dedupeKeys,
      lastAward: null
    }
  };
}

/** Kept in its own key so the coin ledger's migration path stays untouched. */
function loadSubscription() {
  const saved = readStored(SUB_KEY, () => null);
  if (!saved || typeof saved.expiresAt !== 'number') return undefined;
  return { subscription: saved };
}

function preloaded() {
  const slices = { ...migrate(readStored(COINS_KEY, () => null)), ...loadSubscription() };
  return Object.keys(slices).length ? slices : undefined;
}

export const store = configureStore({
  reducer: { coins: coinsReducer, subscription: subscriptionReducer },
  preloadedState: preloaded()
});

// Persist the ledger. When a server ledger arrives this is the seam to replace:
// swap this subscriber for a sync that pushes and pulls the same action shapes.
let lastCoins;
let lastSub;
store.subscribe(() => {
  const { coins, subscription } = store.getState();
  if (coins !== lastCoins) {
    lastCoins = coins;
    writeStored(COINS_KEY, coins);
  }
  if (subscription !== lastSub) {
    lastSub = subscription;
    writeStored(SUB_KEY, subscription);
  }
});
