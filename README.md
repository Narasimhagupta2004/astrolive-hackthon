# AstroLive mobile recreation

A mobile-styled web app built with Vite + React 19. Client-only — there is no backend server.

**HLD document** — what was built, why, and how:
**[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.
A formatted copy downloads in-app from **Settings -> HLD Document**.

## Running locally

```bash
npm install
npm run dev        # dev server (also exposed on your LAN, see vite.config.js)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

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
   `firebaseConfig` values.
5. **Authentication → Settings → Authorized domains** — `localhost` is already listed. Because
   `vite.config.js` sets `server: { host: true }`, add your machine's LAN IP too if you want to open
   the dev server from a phone on the same network.

### 2. Add the credentials

Copy `.env.example` to `.env` in the repo root and fill in the values from step 1.4:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=1:<sender-id>:web:<hash>
```

`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, and `APP_ID` are required; the other two are optional.
These values are public by design — access is controlled by `firestore.rules`, not by secrecy.

Then **restart the dev server**. Vite reads `.env` only at startup, and inlines `import.meta.env`
at build time — so `.env` must also be populated before `npm run build`.

### 3. Deploy the security rules

Writes are rejected until `firestore.rules` is deployed. `firebase-tools` is not a dependency of
this project, so run it via `npx`:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

`.firebaserc` in the repo already aliases `astrolive` → `astrolive-hackthon`. To target a different
project, run `npx firebase-tools use --add` (or pass `--project <id>` on every command).

### 4. Verify it's connected

1. Start a Cosmic Chemistry reading as the host.
2. The share screen should show a 6-character **ROOM CODE** and **no** offline-mode banner.
3. In the Firebase console, **Firestore → Data** should contain a `rooms/<CODE>` document with
   `status: "waiting"` and `b: null`, and **Authentication → Users** should show an anonymous user.
4. Open the invite link in a second browser and submit as the guest — the host's tab should flip to
   the reveal without a refresh, and the document should become `status: "complete"` with `b` filled.

### Deploying to Firebase Hosting (optional)

`firebase.json` serves the `dist/` directory as a single-page app.

```bash
npm run build
npx firebase-tools deploy --only hosting
```
