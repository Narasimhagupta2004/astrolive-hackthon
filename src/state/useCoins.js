import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  credited, spent, awardCleared, coinsReset,
  selectBalance, selectExpiringSoon, selectHistory, selectLastAward,
  selectFreeMuhuratUsed, checkCredit
} from '../store/coinsSlice';
import { maxRedeemable } from '../data/coins';

/**
 * Same surface the pages already used, now backed by the Redux store.
 * Eligibility is checked against live store state before dispatching, so callers
 * still get a synchronous { ok, coins } and the reducer re-checks it anyway.
 */
export function useCoins() {
  const dispatch = useDispatch();
  const store = useStore();
  const balance = useSelector(selectBalance);
  const expiringSoon = useSelector(selectExpiringSoon);
  const history = useSelector(selectHistory);
  const lastAward = useSelector(selectLastAward);
  const freeMuhuratUsed = useSelector(selectFreeMuhuratUsed);

  const credit = ({ source, coins, ref, dedupeKey, selfKey }) => {
    if (selfKey && dedupeKey && selfKey === dedupeKey) return { ok: false, reason: 'self-referral' };
    const check = checkCredit(store.getState().coins, { source, coins, dedupeKey, at: Date.now() });
    if (!check.ok) return check;
    dispatch(credited({ source, coins, ref, dedupeKey }));
    return check;
  };

  return {
    balance,
    expiringSoon,
    history,
    lastAward,
    freeMuhuratUsed,
    credit,
    awardReveal: (partnerUid, ref, selfUid) =>
      credit({ source: 'reveal', ref, dedupeKey: partnerUid, selfKey: selfUid }),
    awardReferral: (ref) => credit({ source: 'referral', ref }),
    // One free muhurat, ever — the dedupe key is fixed so a repeat cannot pay out.
    awardMuhurat: (ref) => credit({ source: 'muhurat', ref, dedupeKey: 'muhurat:free' }),
    // Deduped on the payment id, so each paid term earns exactly once.
    awardPlan: (paymentId, ref) => credit({ source: 'plan', ref, dedupeKey: paymentId }),
    spend: (coins, ref) => {
      if (!coins || coins <= 0) return { ok: false, reason: 'nothing-to-spend' };
      if (coins > balance) return { ok: false, reason: 'insufficient' };
      dispatch(spent({ coins, ref }));
      return { ok: true, coins };
    },
    maxRedeemableFor: (rupees) => maxRedeemable(rupees, balance),
    clearLastAward: () => dispatch(awardCleared()),
    resetCoins: () => dispatch(coinsReset())
  };
}
