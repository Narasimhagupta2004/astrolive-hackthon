# Five changes I made to AstroLive, and why

Each one started from something I noticed — either using the app, reading about how these apps make
money, or just watching what my friends actually do. This document explains the thinking first, then
how it is built.

**Built for** mobile web (mweb) · **Stack** React 19 · Vite · Firebase
**Team** Bandaru Narasimhagupta (SDE1, Infinite Locus) · Karri Naveen (SDE1, Jungleworks)
**In the app:** Settings → **HLD Document** downloads a formatted copy of this.

---

## 01 · Before you read the features

Two things worth knowing up front, because they shape everything below.

**This is a mobile-web prototype, not the app.** I built it as mweb because it is the fastest way to
put a working thing in someone's hand — you send a link, it opens, no install. But I want to be
clear that I know where the money actually is: **the app will always out-earn the web.** Push
notifications, a home-screen icon, saved payment methods, and sessions that don't end when a tab
closes — those are what drive repeat consultations, and the browser gives us weak versions of all
four. So treat everything here as a design proven on mweb and meant to move to the app. Nothing in
it is web-specific.

**I could not see the astrologer's side of the product.** I have only ever used AstroLive as a
customer, so for the first feature I had to guess what an astrologer's panel looks like. I have
marked that assumption clearly rather than hiding it.

---

## 02 · What it is built with

| Tool | Used for | Why this one |
|---|---|---|
| React 19 | The whole interface | Standard, well understood, easy to hand over |
| Vite | Build and dev server | Instant reload, and it opens on a real phone over Wi-Fi while you work |
| Redux Toolkit | The coins ledger only | Coins turn into money, so they need stricter handling than the rest |
| React Context | Cart, recent sessions | Lighter than Redux, right for data that is short-lived |
| Firebase | Live sync for Cosmic Chemistry | Real-time updates with no server to run |
| Razorpay | Checkout in Shubh Kart | Standard Indian gateway; loads only at checkout |
| lucide-react | Icons | One consistent set, ships only the icons used |

### How the folders are laid out

```
src/
├── pages/        one file per screen — 21 screens
├── components/   reusable pieces, grouped by area
├── data/         every business rule and price, in one place
├── state/        shared memory: cart, sessions
├── store/        the coins ledger
├── utils/        anything that talks outside (Firebase, Razorpay)
└── styles/       one stylesheet
```

One rule holds it together: **pages arrange, components display, data decides, state remembers,
utils connect.** Every cap, price and rule sits in [`data/`](../src/data/) rather than buried inside
a screen — so changing "3 connects" to "5 connects" is one line in one file, not a hunt through
twenty.

---

## 03 · My Astrologer

> A consultation happens once. The user asks, the astrologer answers, the session ends, and then
> nothing. There is no follow-up at all — so every relationship starts again from zero.

### What I built

A view of the app from the astrologer's side. Turn on **Astrologer Mode** and the menu gains
**My Users** — the people they have already consulted — with three follow-up actions: pick the chat
back up, ring them, or suggest a remedy from Shubh Kart.

> **A note on this one.** I have never seen the astrologer panel, so I built this as a proposal for
> what should sit inside it rather than a copy of something that exists. If the panel already works
> differently, the idea still holds — it just needs to be placed there instead.

### Why it works

A message from the person who just read your chart is the most persuasive thing in the app, and it
costs nothing to send. It also makes the user feel remembered, which is what actually brings people
back.

The obvious risk is that it turns into spam. So this is a **quota, not a broadcast**: three connects
per user, ever. The astrologer sees "2 of 3 connects left" before spending one, which pushes them to
use it on the users who genuinely matter. And because every follow-up is recorded, nobody can
quietly abuse it.

### The follow-up call is capped at 2 minutes

A follow-up call has to be a nudge, not a free reading. Two minutes is long enough to say "I've been
thinking about your chart, shall we book a proper session" and not long enough to give away a
consultation. It protects paid minutes while still feeling personal, and it makes the intent
unambiguous on both sides — the astrologer knows it is an opener, and the user knows they are not
about to be sold to for twenty minutes.

The timer runs on the call screen and ends the call at 2:00, the same way the connect counter works:
the limit lives in the data ([`FOLLOWUP_CALL_SECS`](../src/data/appData.js)), not just in the button.

```
Astrologer Mode on → My Users → Connects left? → Chat · Call (2 min) · Suggest → Counter −1
```

### How it is built

- One on/off setting swaps a tab into the menu — no duplicate screens, no second app.
- The three actions run off a single lookup table, so a fourth action is one line.
- The counter and the call cap both live in stored data, so the rules hold even if a button is missed.
- A suggested product arrives *as a message, not an order*. The user can ignore it, which is exactly
  why they trust it.

---

## 04 · Continue where you left

> Every visit starts at a grid of astrologers. So people pick a different one each time, get the
> same question answered three different ways, and end up more confused than when they arrived.

> **Where this came from.** In real life nobody shops around like this. You go back to the same
> astrologer, year after year, because they already know your situation. The app was doing the
> opposite of what people actually do — and when three readings contradict each other, the user
> doesn't conclude that one of them was wrong. They conclude the whole thing is nonsense, and they
> leave.

### What I built

The home screen now opens with the last astrologers you spoke to — chat or call, how long ago, and a
**Resume** button.

### Why it works

Continuity is what makes advice feel credible. Putting the last person you spoke to at the top makes
going back the easy choice and starting over the deliberate one.

And trust travels. Once someone has stayed with the same astrologer long enough to believe in them,
they stop recommending the app and start recommending the person — "go to this astrologer, they were
right about my job." That is a much stronger referral than a generic invite, because the new user
arrives already knowing who to book. It also gives us something to build on: a share card for a
specific astrologer, sent by someone who has actually consulted them.

The list stops at **two** on purpose. A resume list exists to remove a decision. A list of ten just
recreates the paralysis it was built to fix.

### How it is built

- Only the astrologer's ID and the time are saved. The live profile is fetched fresh every time, so
  the rate and the online dot are never stale.
- Newest first, duplicates removed, trimmed to two.
- Saving is wrapped safely so private-browsing mode degrades quietly instead of breaking the page.

**Next:** hold the history on the account so it follows the user to a new phone, and reopen the
actual conversation rather than the profile.

---

## 05 · Shubh Kart recommendations

> The store is a flat grid with no recommendations at all. Someone who has just been told they have
> Shani dosh has to work out for themselves which of nine products relates to that.

> **Where this came from.** I went through a few competitor apps and some write-ups on how this
> category makes money, and the pattern is consistent: a large share of the revenue comes from
> suggesting the right product at the right moment, not from the consultation itself. We already
> have the strongest possible salesperson — the astrologer the user just paid to trust — and we were
> not using them.

### What I built

Two ways to reach the right product, for two different moments:

- **The user filters by intent** — Peace, Love, Career, Wealth, Protection, Growth — and picks their
  rashi to see suitable items first, marked *For You*.
- **The astrologer suggests directly.** After a reading they can send one specific remedy to that user.

### Why it works

The second path is the valuable one, and it costs nothing to run. One design decision is worth
calling out: **intent narrows the list, but rashi only reorders it.** If rashi filtered too, most of
the catalogue would disappear and browsing would die. Personalisation should reorder a shop, never
shrink it.

```
Intent chip → narrows the list → Rashi reorders → Cart → Free gift at ₹1,500
```

The astrologer's suggestion feeds the same cart from the other direction.

### How it is built

- Each product carries its own targeting — which intents and rashis it suits — so merchandising is a
  data change, not a code change.
- Totals, item count and the free-gift progress bar are always recalculated from the cart, so a
  total can never disagree with its items.
- Razorpay only loads at checkout, and switches off cleanly if no key is configured.

**Next — the affiliate idea.** If a product we don't stock is one the astrologer has, we can list it
in Shubh Kart after verifying it, and pay the astrologer a commission. Two things have to exist
first: a verification step for authenticity, stock and returns, and attribution — recording which
astrologer suggested the sale — because you cannot split a commission you cannot trace. Beyond that,
ranking should use real signals: what the consultation was about, past purchases, and the user's
kundli.

---

## 06 · Categories by problem, and Life Coach

> The old tabs were All · Vedic · Tarot · Numerology. Nobody opens the app thinking "I need
> Numerology today." They open it thinking "will I get this job." We were labelling our method when
> the user is buying an outcome.

> **Where this came from.** I messaged some friends asking where they were. They said they'd gone to
> a yoga session and to hear a talk from a Vedic priest. I found that genuinely funny — these are
> people who never listened to a single word their parents said, and now they're sitting through
> this voluntarily. It's a good thing, though. Somewhere in an hour like that, one point lands and
> actually changes something. That's when it struck me: the appetite here is for *guidance*, not
> specifically for astrology. So why aren't we offering life coaching properly?

### What I built

Categories are now the problems people actually have, and Life Coach is one of them:

| Category | What the user is really asking |
|---|---|
| Auspicious Timing | When should I do this? |
| Love & Marriage | Is this the right person? |
| Career & Money | Will this job or investment work out? |
| Health & Peace | Why do I feel like this? |
| Life Coach | What should I do with my life? |

### Why it works

A user reads the tab bar and immediately finds themselves in it. That is the entire job of a
category list, and the old one wasn't doing it.

Life Coach also opens a market with no religious prerequisite, which is a much wider funnel — and we
already have the supply, because several astrologers already counsel this way.

It is the one category that suits a **subscription**. Astrology is episodic: you consult when
something is wrong. Coaching is continuous. Give one or two sessions free for a month, let the habit
form, then charge monthly — that matches how people actually use it.

### How it is built

- An astrologer keeps their *skills* (how they work) and gains *categories* (what they solve). One
  astrologer can serve several problems.
- The category list is defined once and drives the tabs, the card labels and search together — a new
  category is one line.
- Each category has a long name for tabs and a short one for cards, so nothing gets cut off on a
  small screen.
- If a category has nobody free, the user gets a clear message and a one-tap way back to everyone.

**Next — the part that needs care.** The hard question is **who decides an astrologer's categories**.
Get it wrong and every astrologer claims every category, and the filter is useless again. The plan:
astrologers self-declare at onboarding, we check that against what their consultations were actually
about, and cap each one at three categories. For the Life Coach subscription we also need trial and
renewal tracking, which is a backend piece.

---

## 07 · Referrals, sharing and coins

> Paid installs are expensive. The cheapest real growth is one user telling another — but only if
> there is a reason to. And the trap on the other side is just as real: reward sharing carelessly
> and you end up funding fraud instead of growth.

> **Where this came from.** In college my friends were forever passing around referral links to make
> a bit of money. I once put in a solid fifty minutes of effort for a single signup — and yes, there
> was a shorter route from my hostel to theirs, but let's not get into that. The point survives the
> joke: people will go to genuinely absurd lengths for a small reward, as long as the reward is real
> and they can see it. That is a growth channel you cannot buy.

### What I built

Users share a Cosmic Chemistry reading with a friend and earn coins, which come off their next
wallet recharge.

| Rule | Value |
|---|---|
| Coin value | 10 coins = ₹1 |
| A reading completed with someone new | +5 coins · max 3/day · 100 lifetime |
| A referred friend's first recharge of ₹200+ | +500 coins (₹50) |
| Coins can cover | up to 10% of a recharge of ₹100+ |
| Coins expire | 90 days, oldest used first |

### Why this cannot lose the business money

The **10% cap is the whole defence.** To use ₹50 of coins, a user has to recharge ₹500. Every coin
redeemed is attached to revenue at least ten times bigger, so the programme funds itself by design —
that is arithmetic, not optimism.

| Coins held | Worth | Recharge needed to use them all |
|---|---|---|
| 200 | ₹20 | ₹200 |
| 500 (one referral) | ₹50 | ₹500 |
| 1,000 | ₹100 | ₹1,000 |

Abuse is capped as well. The share bonus stops at 100 coins for life — **₹10 per person, once,
ever** — and even that only converts against ₹100 of spend. Gaming it costs more than it pays.

```
Share the link → friend completes it → +5 coins (expire in 90 days) → recharge ₹500 → pay ₹450
```

### How it is built

- **Every coin batch is tracked separately**, each with its own expiry date — so coins can expire, be
  audited, or be reversed. A single running total could do none of those.
- **Coins nearest expiry are spent first**, so users never lose value they could have used.
- **The same eligibility check runs twice** — once when the button is drawn, once when the coins are
  written — so the screen and the ledger can never disagree.
- **Every reward type is a config entry** with its own caps, so a festival campaign is a settings
  change, not new code.
- **The 10% cap is recalculated live** from the selected amount, so it can never fall out of step.
- The rules and the customer-facing terms come from **one file**
  ([`data/coins.js`](../src/data/coins.js)), so what we enforce and what we promise stay identical.

**Next — required before this touches real money.** Coins become a discount on a payment, so the
balance has to be held and awarded on a server, not on the phone. That means phone-number sign-in, a
server-side ledger, and awards tied to a verified recharge. Until that exists my recommendation is to
show coins in the profile but not let them reduce a payment. The full write-up is in
[docs/coins-rewards-plan.md](./coins-rewards-plan.md).

---

## 08 · How we would know if any of this worked

Every feature above is a hypothesis. None of them should stay in the product just because they sound
reasonable — including mine. Here is how I would measure them.

### Run them as experiments, not launches

**GrowthBook** for A/B testing: it is open-source, self-hostable, and does feature flags and
experiments in one place — so a feature can be switched off without a release. Each of the five has
an obvious test:

| Experiment | What we would measure |
|---|---|
| Resume section on / off | Repeat consultations per user, and whether they go back to the same astrologer |
| Problem categories vs. old skill tabs | Browse-to-chat conversion, and time to first chat |
| Connect quota of 3 vs. 5 | Follow-up conversion against block and report rate — the point where helpful turns annoying |
| Follow-up call at 2 min vs. 5 min | How many short calls convert into a paid session |
| Astrologer suggestion on / off | Shubh Kart revenue per consultation |
| Coin cap at 10% vs. 15% | Recharge frequency against margin per recharge |

### Watch what people actually do

- **Microsoft Clarity** — session recordings and heatmaps. This is the one that answers "why did
  nobody tap that": rage clicks, dead clicks, where people stop scrolling. It is free, and it catches
  things a funnel chart never will.
- **GA4, deployed through GTM** — the funnel numbers. GTM matters here because we can add or fix a
  tag without waiting for a release, which is the difference between measuring a launch and measuring
  it three weeks late.
- **Segment** as a CDP, if and when we need it. Not on day one. It earns its cost once several tools
  all need the same clean event stream and we are tired of instrumenting each one separately.

### The events I would define first

`resume_card_tapped` · `category_selected` · `astrologer_connect_used` · `followup_call_ended` (with
duration, so we can see whether 2 minutes is the right cap) · `product_suggested` ·
`suggestion_purchased` · `share_completed` · `coins_redeemed`.

Six of those eight are things we currently cannot see at all.

---

## 09 · What moves to a backend, in order

| # | Feature | What it needs |
|---|---|---|
| 1 | Everything | Phone-number sign-in — unblocks all of the below |
| 2 | Coins | Server-held balance, awarding and redemption |
| 3 | Shubh Kart | Order creation and payment verification on the server |
| 4 | My Astrologer | Real consultation records, server-side connect quota and call cap |
| 5 | Continue where you left | History on the account so it survives a new phone |
| 6 | Categories | Verified category assignment on astrologer profiles |

The code was written with this move in mind. The coins ledger in particular has one clearly marked
place where saving happens ([`store/index.js`](../src/store/index.js)), so switching it to a server
is a swap rather than a rewrite.

---

## Team

- **Bandaru Narasimhagupta** — SDE1, Infinite Locus
- **Karri Naveen** — SDE1, Jungleworks

**Code:** <https://github.com/Narasimhagupta2004/astrolive-hackthon>
