# AstroLive

A mobile-web astrology consultation app built with Vite + React 19. Client-only — there is no
backend server of our own.

**Live:** <https://astrolive-hackthon.web.app>

**HLD document** — what was built, why, and how: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.
The same document downloads as a PDF in-app from **Settings → HLD Document**.

## What's in it

| Feature | Where |
|---|---|
| My Astrologer — astrologer-side follow-up, 3 connects per user, 2-minute free call | Settings → Astrologer mode → My Users |
| Continue where you left — resume your last 2 astrologers | Home |
| Shubh Kart — intent filter, rashi ranking, astrologer product suggestions | Shubh Kart tab |
| Problem-based categories + Life Coach | Chat tab |
| Referrals & coins — earn, expire, redeem against a recharge | Header wallet icon |
| Muhurat AI — 1 free reading, then AstroLive Plus | AstroHub → Muhurat AI |

## Running locally

```bash
npm install
npm run dev        # dev server (also exposed on your LAN, see vite.config.js)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and fill it in there.

> `.env.example` is **committed**. Never put a real key in it — GitHub push protection will block
> the push. Real values belong in `.env`, which is git-ignored.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | yes | Cosmic Chemistry live sync |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes | " |
| `VITE_FIREBASE_PROJECT_ID` | yes | " |
| `VITE_FIREBASE_APP_ID` | yes | " |
| `VITE_FIREBASE_STORAGE_BUCKET` | no | unused today |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | no | unused today |
| `VITE_GEMINI_API_KEY` | no | Muhurat AI answers; without it the local rules engine answers |
| `VITE_GEMINI_MODEL` | no | defaults to `gemini-2.5-flash` |

Vite reads `.env` **only at startup** and inlines values at build time, so restart the dev server
after editing it, and populate it before `npm run build`.

### A note on which keys are safe to ship

Vite inlines every `VITE_*` value into the JS bundle, where anyone can read it.

- **Firebase config and the Razorpay key id are public by design.** Access is controlled by
  `firestore.rules` and by Razorpay's server-side verification, not by secrecy.
- **The Gemini key is not.** It is billable to whoever owns it. The production build is currently
  deployed *without* it, so Muhurat AI runs on the rules engine in production. Before shipping it
  for real, the Gemini call has to move behind a server endpoint that holds the key.

## Payments — Razorpay

Two screens take a payment: **Shubh Kart** checkout, and **AstroLive Plus** on the Muhurat page.
The key id lives in `src/config/razorpay.js`; `src/utils/razorpay.js` loads the checkout script on
first use and disables the button if no key is set.

Razorpay is in **test mode** — nothing is charged. Use:

```
Card    4386 2894 0766 0153
Expiry  any future date      # e.g. 12 / 30
CVV     any 3 digits         # e.g. 123
OTP     any digits
```

There is no server-side order creation or signature verification yet. That is required before real
money — see section 11 of the HLD.

To reset the demo to a fresh user, clear `astro:coins` and `astro:subscription` from the browser's
local storage.

## Firebase setup

Firebase is optional. Without it the app still works — the **Cosmic Chemistry** two-player flow
falls back to passing results through the invite link and `localStorage`, and shows an
"Offline mode — live sync unavailable" banner. Configure Firebase to get live sync instead.

Only two Firebase products are used:

- **Anonymous Auth** — no email/password, phone, or social sign-in.
- **Cloud Firestore** — a single `rooms/{code}` collection, one document per Cosmic Chemistry pair.

All Firebase code lives in `src/config/firebase.js` (config) and `src/utils/cosmicRoom.js`
(the only file that imports `firebase/*`).

### 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and create a project (Analytics can be skipped).
2. **Build → Firestore Database → Create database** — pick production mode and a region. The rules
   are replaced in step 3 below, so the starting mode doesn't matter much.
3. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
   This provider is **off by default**. If you skip it, sign-in fails with
   `auth/operation-not-allowed` and the app stays in offline mode.
4. **Project settings → General → Your apps → Web (`</>`)** — register a web app and copy the
   `firebaseConfig` values into `.env`.
5. **Authentication → Settings → Authorized domains** — `localhost` is already listed. Because
   `vite.config.js` sets `server: { host: true }`, add your machine's LAN IP too if you want to open
   the dev server from a phone on the same network.

### 2. Deploy the security rules

Writes are rejected until `firestore.rules` is deployed. `firebase-tools` is not a dependency of
this project, so run it via `npx`:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

`.firebaserc` already aliases `astrolive` → `astrolive-hackthon`. To target a different project,
run `npx firebase-tools use --add` (or pass `--project <id>` on every command).

### 3. Verify it's connected

1. Start a Cosmic Chemistry reading as the host.
2. The share screen should show a 6-character **ROOM CODE** and **no** offline-mode banner.
3. In the Firebase console, **Firestore → Data** should contain a `rooms/<CODE>` document with
   `status: "waiting"` and `b: null`, and **Authentication → Users** should show an anonymous user.
4. Open the invite link in a second browser and submit as the guest — the host's tab should flip to
   the reveal without a refresh, and the document should become `status: "complete"` with `b` filled.

## Deploying

`firebase.json` serves `dist/` as a single-page app.

```bash
npm run build
npx firebase-tools deploy --only hosting
```

To deploy **without** the Gemini key in the bundle (how the live site is currently built), blank
`VITE_GEMINI_API_KEY` in `.env` before `npm run build`, then restore it afterwards.

### Regenerating the HLD PDF

`public/AstroLive-HLD.pdf` is a build artifact, printed from a styled HTML version of
`docs/ARCHITECTURE.md`. That HTML is not kept in the tree — the last committed copy is in git
history at `public/astrolive-architecture.html`:

```bash
git show 43d6406:public/astrolive-architecture.html > /tmp/hld.html
# open /tmp/hld.html in a browser and Print → Save as PDF → public/AstroLive-HLD.pdf
```

If the document changes often, it is worth keeping that HTML in `docs/` instead.

## Known gaps

No tests, no CI, no TypeScript. All astrologer, user and product data is mock data in
`src/data/appData.js`. Chat and calls are simulated. Coins and subscriptions are client-side and
therefore editable in devtools — the full list and the migration order are in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Team

- **Bandaru Narasimhagupta** — SDE1, Infinite Locus
- **Karri Naveen** — SDE1, Jungleworks
