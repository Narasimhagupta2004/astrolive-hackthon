// AstroLive Coins — single source of truth for the reward economics.
// Keep every rule here so a Cloud Function can enforce identical numbers later
// (see docs/coins-rewards-plan.md, Phase 0). Nothing below reads app state.

export const COINS_PER_RUPEE = 10;

// Earning
export const REVEAL_BONUS = 5;            // a completed reveal with a NEW partner
export const REVEAL_DAILY_CAP = 3;        // rewarded reveals per day
export const REVEAL_LIFETIME_CAP = 100;   // = Rs 10, the total farmable ceiling
export const REFERRAL_BONUS = 500;        // = Rs 50, on a referred user's first recharge
// The referral payout keeps its own, higher qualifying bar: paying out Rs 50
// against a Rs 100 recharge would invert the economics.
export const REFERRAL_QUALIFY_RECHARGE = 200;

// Redeeming — the 10% cap is the main protection on margin.
export const REDEEM_MAX_PCT = 0.10;
export const REDEEM_MIN_RECHARGE = 100;

export const COIN_EXPIRY_DAYS = 90;
export const EXPIRY_MS = COIN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const RECHARGE_AMOUNTS = [100, 200, 500, 1000, 2000];

export function coinsToRupees(coins) {
  return coins / COINS_PER_RUPEE;
}

export function rupeesToCoins(rupees) {
  return Math.round(rupees * COINS_PER_RUPEE);
}

/**
 * Most coins that may be applied to one recharge.
 * Zero below the minimum recharge; otherwise the lesser of the balance and 10%.
 */
export function maxRedeemable(rechargeRupees, balance) {
  if (!rechargeRupees || rechargeRupees < REDEEM_MIN_RECHARGE) return 0;
  const capRupees = Math.floor(rechargeRupees * REDEEM_MAX_PCT);
  return Math.max(0, Math.min(balance, rupeesToCoins(capRupees)));
}

/** Why the redeem control is limited, in words the user can act on. */
export function redeemHint(rechargeRupees, balance) {
  if (!rechargeRupees) return 'Pick an amount to see how many coins you can use.';
  if (rechargeRupees < REDEEM_MIN_RECHARGE) {
    return `Coins apply from \u20b9${REDEEM_MIN_RECHARGE} upward. Add \u20b9${REDEEM_MIN_RECHARGE - rechargeRupees} more to use them.`;
  }
  const max = maxRedeemable(rechargeRupees, balance);
  if (max === 0) return 'No coins available yet — share a reading to earn some.';
  const capped = max < balance;
  return capped
    ? `Capped at 10% of this recharge, so ${max} coins (\u20b9${coinsToRupees(max)}) of your ${balance}.`
    : `Using all ${max} coins (\u20b9${coinsToRupees(max)}).`;
}

export const COIN_TERMS = [
  'Coins have no cash value. They cannot be withdrawn, transferred, or exchanged for cash.',
  `Coins can cover up to 10% of a recharge of \u20b9${REDEEM_MIN_RECHARGE} or more. The rest is paid normally.`,
  `Coins expire ${COIN_EXPIRY_DAYS} days after they are earned.`,
  'Coins are credited only for genuine completed shares with a new person, and for referred users who complete their first recharge. Duplicate, self-referred, or automated activity is reversed.',
  'AstroLive may change, pause, or withdraw the programme at any time. Abuse may forfeit the balance.'
];
