import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  REVEAL_BONUS, REVEAL_DAILY_CAP, REVEAL_LIFETIME_CAP, REFERRAL_BONUS,
  MUHURAT_BONUS, MUHURAT_FREE_LIMIT, MUHURAT_PLAN_BONUS, EXPIRY_MS, maxRedeemable
} from '../data/coins';

/**
 * Every way coins can enter the ledger. Adding a new source later — a campaign,
 * a support credit, a partner integration — means adding one entry here, not new
 * logic: the reducer reads the rules off the source.
 *
 *   coins       fixed award, or omit to let the caller pass an amount
 *   dailyCap    max credits from this source per calendar day
 *   lifetimeCap max coins this source may ever grant
 *   dedupe      credits are unique per dedupeKey (e.g. a partner uid)
 */
export const COIN_SOURCES = {
  reveal: {
    label: 'Share reward',
    coins: REVEAL_BONUS,
    dailyCap: REVEAL_DAILY_CAP,
    lifetimeCap: REVEAL_LIFETIME_CAP,
    dedupe: true
  },
  referral: { label: 'Referral bonus', coins: REFERRAL_BONUS },
  muhurat: {
    label: 'Muhurat AI reward',
    coins: MUHURAT_BONUS,
    lifetimeCap: MUHURAT_BONUS * MUHURAT_FREE_LIMIT,
    dedupe: true
  },
  // No lifetime cap: every genuine paid term earns. The dedupe key is the
  // payment id, so a replayed dispatch of the same payment credits once.
  plan: { label: 'Plus subscription bonus', coins: MUHURAT_PLAN_BONUS, dedupe: true },
  promo: { label: 'Promotional credit' },
  support: { label: 'Support adjustment' }
};

const initialState = {
  lots: [],
  spends: [],
  earnedBySource: {},
  dedupeKeys: [],
  lastAward: null
};

const isLive = (lot, now) => lot.remaining > 0 && lot.expiresAt > now;
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

/**
 * Pure eligibility check, shared by the reducer and the UI so the two can never
 * disagree about whether a credit is allowed. A server can call this too.
 */
export function checkCredit(state, { source, coins, dedupeKey, at }) {
  const rules = COIN_SOURCES[source];
  if (!rules) return { ok: false, reason: 'unknown-source' };

  const amount = rules.coins ?? coins;
  if (!amount || amount <= 0) return { ok: false, reason: 'no-amount' };

  if (rules.dedupe) {
    if (!dedupeKey) return { ok: false, reason: 'missing-dedupe-key' };
    if (state.dedupeKeys.includes(dedupeKey)) return { ok: false, reason: 'already-rewarded' };
  }

  const earned = state.earnedBySource[source] || 0;
  if (rules.lifetimeCap && earned >= rules.lifetimeCap) return { ok: false, reason: 'lifetime-cap' };

  if (rules.dailyCap) {
    const today = state.lots.filter((l) => l.source === source && sameDay(l.at, at)).length;
    if (today >= rules.dailyCap) return { ok: false, reason: 'daily-cap' };
  }

  const granted = rules.lifetimeCap ? Math.min(amount, rules.lifetimeCap - earned) : amount;
  return { ok: true, coins: granted };
}

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    // Timestamps arrive in the payload so reducers stay pure and replayable —
    // which is what makes syncing a server ledger later straightforward.
    credited: {
      reducer(state, action) {
        const { source, ref, dedupeKey, at } = action.payload;
        const check = checkCredit(state, action.payload);
        if (!check.ok) return;
        state.lots.push({
          id: `${source}-${at}`,
          source,
          coins: check.coins,
          remaining: check.coins,
          ref: ref ?? null,
          at,
          expiresAt: at + EXPIRY_MS
        });
        state.earnedBySource[source] = (state.earnedBySource[source] || 0) + check.coins;
        if (COIN_SOURCES[source]?.dedupe && dedupeKey) state.dedupeKeys.push(dedupeKey);
        state.lastAward = { source, coins: check.coins, at };
      },
      prepare({ source, coins, ref, dedupeKey }) {
        return { payload: { source, coins, ref, dedupeKey, at: Date.now() } };
      }
    },

    spent: {
      reducer(state, action) {
        const { coins, ref, at } = action.payload;
        const balance = state.lots.reduce((s, l) => (isLive(l, at) ? s + l.remaining : s), 0);
        if (coins <= 0 || coins > balance) return;
        let left = coins;
        // oldest-expiring first, so coins nearest their expiry are used up first
        [...state.lots]
          .sort((a, b) => a.expiresAt - b.expiresAt)
          .forEach((sorted) => {
            if (left <= 0) return;
            const lot = state.lots.find((l) => l.id === sorted.id);
            if (!isLive(lot, at)) return;
            const take = Math.min(lot.remaining, left);
            lot.remaining -= take;
            left -= take;
          });
        state.spends.push({ id: `spend-${at}`, coins, ref: ref ?? null, at });
      },
      prepare({ coins, ref }) {
        return { payload: { coins, ref, at: Date.now() } };
      }
    },

    awardCleared(state) { state.lastAward = null; },
    coinsReset: () => initialState
  }
});

export const { credited, spent, awardCleared, coinsReset } = coinsSlice.actions;
export default coinsSlice.reducer;

const selectCoins = (s) => s.coins;
export const selectLots = (s) => s.coins.lots;
export const selectLastAward = (s) => s.coins.lastAward;

export const selectBalance = createSelector([selectLots], (lots) => {
  const now = Date.now();
  return lots.reduce((sum, l) => (isLive(l, now) ? sum + l.remaining : sum), 0);
});

export const selectExpiringSoon = createSelector([selectLots], (lots) => {
  const now = Date.now();
  const cutoff = now + 14 * 24 * 60 * 60 * 1000;
  return lots.reduce((sum, l) => (isLive(l, now) && l.expiresAt <= cutoff ? sum + l.remaining : sum), 0);
});

export const selectHistory = createSelector([selectCoins], (c) => {
  const earns = c.lots.map((l) => ({
    id: l.id, type: l.source, coins: l.coins, ref: l.ref, at: l.at, expiresAt: l.expiresAt
  }));
  const outs = c.spends.map((s) => ({
    id: s.id, type: 'spend_recharge', coins: -s.coins, ref: s.ref, at: s.at
  }));
  return [...earns, ...outs].sort((a, b) => b.at - a.at);
});

export const selectMaxRedeemable = (rupees) => (s) => maxRedeemable(rupees, selectBalance(s));

/**
 * Free muhurats already taken. Derived from the ledger rather than tracked in
 * its own counter: crediting the reward and spending the free ask are the same
 * event, so a second source of truth could only ever disagree with this one.
 */
export const selectMuhuratsUsed = (s) =>
  Math.round((s.coins.earnedBySource.muhurat || 0) / MUHURAT_BONUS);

/** Free allowance only — a subscription is a separate slice, checked alongside. */
export const selectFreeMuhuratUsed = (s) => selectMuhuratsUsed(s) >= MUHURAT_FREE_LIMIT;
