import { useDispatch, useSelector } from 'react-redux';
import {
  subscribed, subscriptionCleared, PLANS,
  selectSubscription, selectIsSubscribed, selectSubscriptionLapsed
} from '../store/subscriptionSlice';
import { openCheckout, isConfigured } from '../utils/razorpay';
import { useCoins } from './useCoins';
import { MUHURAT_PLAN_PRICE, MUHURAT_PLAN_BONUS } from '../data/coins';

const PRICES = { plus: MUHURAT_PLAN_PRICE };

/**
 * Buying a term is payment-then-record: the plan is only written after Razorpay
 * hands back a payment id, so a dismissed or failed checkout leaves the user
 * exactly where they were.
 */
export function useSubscription() {
  const dispatch = useDispatch();
  const { awardPlan } = useCoins();
  const subscription = useSelector(selectSubscription);
  const isSubscribed = useSelector(selectIsSubscribed);
  const lapsed = useSelector(selectSubscriptionLapsed);

  const buy = async (plan = 'plus', prefill = {}) => {
    const rules = PLANS[plan];
    if (!rules) return { ok: false, reason: 'unknown-plan' };
    if (!isConfigured()) return { ok: false, reason: 'not-configured' };

    try {
      const { paymentId } = await openCheckout({
        amount: PRICES[plan],
        orderId: `SUB-${Date.now().toString(36).toUpperCase()}`,
        prefill,
        notes: { plan, days: String(rules.days) }
      });
      dispatch(subscribed({ plan, paymentId }));
      // The term and its coin bonus are one purchase, so both land off the same
      // payment id — and neither can happen without it.
      const award = awardPlan(paymentId, rules.label);
      return { ok: true, paymentId, coins: award.ok ? award.coins : 0 };
    } catch (err) {
      return {
        ok: false,
        reason: err?.code === 'dismissed' ? 'cancelled' : 'failed',
        message: err?.message
      };
    }
  };

  return {
    subscription,
    isSubscribed,
    lapsed,
    expiresAt: subscription.expiresAt,
    planLabel: PLANS[subscription.plan]?.label ?? null,
    canPay: isConfigured(),
    price: PRICES.plus,
    termDays: PLANS.plus.days,
    planBonus: MUHURAT_PLAN_BONUS,
    buy,
    cancel: () => dispatch(subscriptionCleared())
  };
}
