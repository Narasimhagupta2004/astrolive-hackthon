import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot, runTransaction, serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig, isConfigured } from '../config/firebase';

const CONNECT_TIMEOUT = 5000;

let app;
let db;
let authReady;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

export function firebaseAvailable() {
  return isConfigured();
}

export async function ensureAuth() {
  if (!isConfigured()) throw new Error('not-configured');
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  if (!authReady) {
    authReady = withTimeout(signInAnonymously(getAuth(app)), CONNECT_TIMEOUT).catch((err) => {
      authReady = null;
      throw err;
    });
  }
  const cred = await authReady;
  return cred.user.uid;
}

export async function createRoom(code, person) {
  const uid = await ensureAuth();
  await withTimeout(
    setDoc(doc(db, 'rooms', code), {
      v: 1,
      createdAt: serverTimestamp(),
      status: 'waiting',
      a: { ...person, uid },
      b: null
    }),
    CONNECT_TIMEOUT
  );
  return code;
}

export async function fetchRoom(code) {
  await ensureAuth();
  const snap = await withTimeout(getDoc(doc(db, 'rooms', code)), CONNECT_TIMEOUT);
  return snap.exists() ? snap.data() : null;
}

export async function joinRoom(code, person) {
  const uid = await ensureAuth();
  const ref = doc(db, 'rooms', code);
  return withTimeout(
    runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error('no-room');
      const data = snap.data();
      if (data.b) {
        if (data.b.uid === uid) return { ...data };
        throw new Error('room-full');
      }
      tx.update(ref, { b: { ...person, uid }, status: 'complete' });
      return { ...data, b: { ...person, uid }, status: 'complete' };
    }),
    CONNECT_TIMEOUT
  );
}

export function watchRoom(code, onData, onError) {
  if (!db) return () => {};
  return onSnapshot(
    doc(db, 'rooms', code),
    (snap) => onData(snap.exists() ? snap.data() : null),
    (err) => onError && onError(err)
  );
}
