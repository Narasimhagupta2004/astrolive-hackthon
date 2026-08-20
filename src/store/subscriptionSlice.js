import { createSlice } from '@reduxjs/toolkit';
import { MUHURAT_PLAN_DAYS } from '../data/coins';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Plans a user can hold. One today; a second is an entry here, not new logic.
 * `days` is the term bought by a single payment — there is no auto-renewal,
 * so an expiry timestamp is the whole model.
 */
export const PLANS = {
  plus: { label: 'AstroLive Plus', days: MUHURAT_PLAN_DAYS, unlocks: ['muhurat'] }
};

const initialState = { plan: null, startedAt: null, expiresAt: null, paymentId: null };

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Timestamps arrive in the payload, same as the coin ledger, so the reducer
    // stays pure and a server can replay the identical action later.
    subscribed: {
      reducer(state, action) {
        const { plan, paymentId, at } = action.payload;
        const rules = PLANS[plan];
        if (!rules) return;
        // Renewing early extends the term rather than throwing away what is left.
        const from = state.expiresAt && state.expiresAt > at ? state.expiresAt : at;
        state.plan = plan;
        state.startedAt = state.startedAt ?? at;
        state.expiresAt = from + rules.days * DAY_MS;
        state.paymentId = paymentId ?? null;
      },
      prepare({ plan, paymentId }) {
        return { payload: { plan, paymentId, at: Date.now() } };
      }
    },
    subscriptionCleared: () => initialState
  }
});

export const { subscribed, subscriptionCleared } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

/* ---------- selectors ---------- */

export const selectSubscription = (s) => s.subscription;

export const selectIsSubscribed = (s) => {
  const { expiresAt } = s.subscription;
  return !!expiresAt && expiresAt > Date.now();
};

/** True once a plan has lapsed, so the UI can say "renew" instead of "subscribe". */
export const selectSubscriptionLapsed = (s) => {
  const { expiresAt } = s.subscription;
  return !!expiresAt && expiresAt <= Date.now();
};

export const selectUnlocks = (feature) => (s) =>
  selectIsSubscribed(s) && !!PLANS[s.subscription.plan]?.unlocks.includes(feature);
