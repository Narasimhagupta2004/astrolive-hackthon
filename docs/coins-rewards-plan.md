# AstroLive Coins — share rewards that can't shrink the business

## Context

The ask: every share earns coins in the user's profile; coins act as money during recharge;
conditions must be stated; and the business must not lose money because of it.

Those goals conflict if taken literally, so this plan resolves them. Two decisions were made with
the user: coins are credited on a **split trigger** (tiny on a completed reveal, real value only when
a referred person recharges), and coins may cover **at most 10% of a recharge of ₹100 or more**.

---

## 1. The blocking problem — read this first

**Cosmic Chemistry authenticates with anonymous Firebase sign-in**
([cosmicRoom.js:32](../src/utils/cosmicRoom.js#L32)). A fresh incognito window is a brand-new user
with a brand-new `uid`. Verified live earlier: the app cannot tell two incognito windows apart.

So "coins per share" is farmable in seconds — open incognito, join your own room, bank coins, repeat.

**Worse, there is no backend.** The app is a client-only SPA: no server, no `firebase-admin`, no
Cloud Functions. A coin balance written by the client — whether in `localStorage` or in Firestore —
can be edited by anyone who opens devtools and sets their balance to 1,000,000. No Firestore rule
can prevent this, because the client is the one doing the writing.

**Conclusion: this is a backend feature, not a UI feature.** Shipping a client-side coin balance
would be worse than not shipping it, because coins convert to real money at recharge. Phase 0 below
is not optional.

## 2. The model

Coin value: **10 coins = ₹1**.

### Earning

| Event | Reward | Limits |
|---|---|---|
| A reveal completes with a **new** partner | **+5 coins** (₹0.50) | 3/day, **100 coins (₹10) lifetime**, and only for phone-verified accounts |
| A person you referred makes their **first recharge ≥ ₹200** | **+500 coins** (₹50) | none — it is funded by that revenue |

### Redeeming

- Coins cover **at most 10%** of a recharge, and only on recharges of **₹100 or more**.
- Coins are a discount. Never withdrawable, never transferable, no cash value.
- Coins **expire 90 days** after being earned, burned FIFO.

### Why this cannot lose money

The 10% cap is the whole defence. To release value, the user must spend roughly ten times that value:

| Coins held | Value | Recharge needed to fully redeem |
|---|---|---|
| 200 | ₹20 | ₹200 |
| 500 (one referral) | ₹50 | ₹500 |
| 1,000 | ₹100 | ₹1,000 |

So the ₹50 referral bonus only converts if that user brings ₹500 of recharges — on top of the ≥₹200
the referred person already paid. **Every coin redeemed is attached to revenue that is at least
10× larger.** The programme is self-funding by construction, not by forecast.

Worst-case farming exposure, with the reveal bonus gated to verified accounts and capped at 100 coins
lifetime: **₹10 per real phone number, once, ever** — and even that only converts against ₹100 of
recharges. An attacker needs a working phone number per ₹10, which costs more than it yields.

## 3. Server-side rules (all of this must be server-authoritative)

Award and redeem only in Cloud Functions. The client may **read** its balance and **never write** it.

- Award only when the room doc reads `status === 'complete'`, read server-side — never trust a client claim.
- Require `b.uid !== a.uid`. Self-referral earns nothing.
- Dedupe on partner: `rewards/{uid}/partners/{partnerUid}` — a given partner pays out **once**, ever.
- Enforce the daily and lifetime caps in the function, keyed on the server clock.
- Redemption recomputes the 10% cap from the recharge amount server-side, then writes the spend and
  the recharge in **one transaction** so a failed payment cannot burn coins.
- Idempotency key on every award and spend, so a retried call cannot double-credit.

### Data shape

```
users/{uid}
  coins: { balance, lifetimeEarned, lifetimeSpent, revealEarned }
  verifiedPhone: bool
  firstRechargeAt: timestamp | null
  referredBy: uid | null

ledger/{uid}/entries/{entryId}      // append-only, client read-only
  type: 'earn_reveal' | 'earn_referral' | 'spend_recharge' | 'expire' | 'reversal'
  coins: +5 | +500 | -N
  ref: roomCode | rechargeId
  createdAt, expiresAt

rewards/{uid}/partners/{partnerUid} // dedupe marker
```

Keep it a **ledger, not a counter**. `balance` is a cached projection of the entries. Without the
ledger there is no way to expire coins, audit a dispute, or reverse fraud.

## 4. Terms to display

Surface these on the wallet screen and beside the redeem toggle — this is the "conditions" requirement:

> - Coins have no cash value. They cannot be withdrawn, transferred, or exchanged for cash.
> - Coins can cover up to 10% of a recharge of ₹100 or more. The rest must be paid normally.
> - Coins expire 90 days after they are earned.
> - Coins are credited only for genuine completed shares with a new person, and for referred users
>   who complete their first recharge. Duplicate, self-referred, or automated activity is reversed.
> - AstroLive may change, pause, or withdraw the programme at any time. Abuse may forfeit the balance.

## 5. UI surfaces

- **Header wallet icon** — currently a dead button
  ([AppHeader.jsx:19](../src/components/layout/AppHeader.jsx#L19)). Make it open a new Wallet screen:
  balance, expiring-soon warning, ledger history, terms link.
- **New Recharge screen** — does not exist yet. Amount picker, a "Use N coins (−₹X)" toggle showing
  the capped amount and *why* it is capped, then payment.
- **Reveal and Share screens** — a small "+5 coins" confirmation after a completed reveal, and a
  referral status line ("2 friends joined · 1 recharged").
- Reuse `.sg-tick` / `.order-success` confirmation patterns and the existing `--tangerine` accent for
  the coin motif so nothing new is invented visually.

## 6. Phases

**Phase 0 — prerequisites (blocking).** Real auth (phone OTP) replacing anonymous sign-in for anyone
who can hold coins; a Cloud Functions backend; Firestore rules making `users.coins` and `ledger`
client-read-only. Nothing else can start safely.

**Phase 1 — ledger.** Schema, award/redeem/expire functions, idempotency, the daily expiry sweep.

**Phase 2 — earn hooks.** Reveal-complete award; referral attribution carried through the invite link
(`#room=CODE` already carries the host's identity, so `referredBy` can be captured at join); payout on
the referred user's first recharge.

**Phase 3 — spend.** Recharge screen with the capped redeem toggle, transactional spend.

**Phase 4 — wallet & terms.** Wallet screen, ledger history, expiry warnings, terms copy.

## 7. Verification

- **Unit:** cap arithmetic at ₹99 (no redeem), ₹100 (₹10 max), ₹500 (₹50 max); FIFO expiry ordering.
- **Abuse tests, the important ones:** self-referral earns 0; the same partner twice earns once;
  a 4th reveal in one day earns 0; a client write to `users/{uid}.coins` is **rejected by rules**;
  a replayed award call credits once.
- **Transactional:** force a payment failure mid-redeem and confirm coins are not burned.
- **Economic replay:** simulate 1,000 users at real recharge rates and confirm coin cost stays under
  the intended share of revenue before launch.

## 8. Recommendation

Ship the reveal bonus **display-only** (a "you earned coins" badge, balance shown, nothing
spendable) if something is needed for a demo. Do not let coins touch a real payment until Phase 0
exists. The gap between "coins shown in profile" and "coins reduce a payment" is the entire risk, and
it is a backend gap, not a UI one.
