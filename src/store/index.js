import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';
import { readStored, writeStored } from '../utils/storage';

const COINS_KEY = 'astro:coins';

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

export const store = configureStore({
  reducer: { coins: coinsReducer },
  preloadedState: migrate(readStored(COINS_KEY, () => null))
});

// Persist the ledger. When a server ledger arrives this is the seam to replace:
// swap this subscriber for a sync that pushes and pulls the same action shapes.
let lastSaved;
store.subscribe(() => {
  const { coins } = store.getState();
  if (coins === lastSaved) return;
  lastSaved = coins;
  writeStored(COINS_KEY, coins);
});
