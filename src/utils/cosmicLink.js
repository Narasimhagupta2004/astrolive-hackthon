import { readStored, writeStored, removeStored } from './storage';

const PENDING_KEY = 'astro:cc-pending';
const LAST_KEY = 'astro:cc-last';
const PENDING_TTL = 6 * 60 * 60 * 1000;

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeRoomCode() {
  let code = '';
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  return code;
}

export function encodeToken(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeToken(token) {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function toPayload(person) {
  return [1, person.name, person.ymd, person.answers[0], person.answers[1], person.answers[2]];
}

export function readPayload(arr) {
  if (!Array.isArray(arr) || arr[0] !== 1 || arr.length < 6) return null;
  const name = String(arr[1] || '').replace(/[<>]/g, '').trim().slice(0, 24);
  const ymd = Number(arr[2]);
  const answers = [arr[3], arr[4], arr[5]].map(Number);
  if (!name) return null;
  if (!Number.isInteger(ymd) || ymd < 19000101 || ymd > 21001231) return null;
  if (answers.some((v) => !Number.isInteger(v) || v < 0 || v > 3)) return null;
  return { name, ymd, answers };
}

function origin() {
  return window.location.origin + window.location.pathname;
}

export function buildRoomUrl(code) {
  return `${origin()}#room=${code}`;
}

export function buildInviteUrl(person) {
  return `${origin()}#cc1=${encodeToken(toPayload(person))}`;
}

export function buildResultUrl(a, b) {
  return `${origin()}#cc2=${encodeToken(toPayload(a))}.${encodeToken(toPayload(b))}`;
}

export function parsePastedLink(text) {
  const raw = String(text || '').trim();
  const hash = raw.includes('#') ? raw.slice(raw.indexOf('#') + 1) : raw;
  const roomMatch = hash.match(/^(?:room=)?([A-Z2-9]{6})$/i);
  if (roomMatch) return { kind: 'room', code: roomMatch[1].toUpperCase() };
  const body = hash.replace(/^cc2=/, '');
  const parts = body.split('.');
  if (parts.length === 2) {
    try {
      const a = readPayload(decodeToken(parts[0]));
      const b = readPayload(decodeToken(parts[1]));
      if (a && b) return { kind: 'result', a, b };
    } catch {
      return null;
    }
  }
  return null;
}

function clearHash() {
  try {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  } catch {
    return;
  }
}

function parseHash(hash) {
  if (hash.startsWith('#room=')) {
    const code = hash.slice(6).toUpperCase();
    clearHash();
    if (!/^[A-Z2-9]{6}$/.test(code)) return { route: 'cc-join', broken: true };
    writeStored(PENDING_KEY, { code, savedAt: Date.now() });
    return { route: 'cc-join', code };
  }
  if (hash.startsWith('#cc1=')) {
    clearHash();
    const a = readPayload(decodeToken(hash.slice(5)));
    if (!a) return { route: 'cc-join', broken: true };
    writeStored(PENDING_KEY, { a, savedAt: Date.now() });
    return { route: 'cc-join', a };
  }
  if (hash.startsWith('#cc2=')) {
    clearHash();
    const parts = hash.slice(5).split('.');
    const a = readPayload(decodeToken(parts[0]));
    const b = parts[1] ? readPayload(decodeToken(parts[1])) : null;
    if (!a || !b) return { route: 'cc-join', broken: true };
    return { route: 'cc-reveal', a, b };
  }
  if (hash.startsWith('#cc')) {
    clearHash();
    return { route: 'cc-join', broken: true };
  }
  return null;
}

export function isCosmicHash(hash) {
  return /^#(room=|cc1=|cc2=)/.test(hash || '');
}

function readHashNow() {
  try {
    return parseHash(window.location.hash || '');
  } catch {
    clearHash();
    return { route: 'cc-join', broken: true };
  }
}

let bootCache;

export function getBootLink() {
  if (bootCache !== undefined) return bootCache;
  bootCache = readHashNow();
  if (!bootCache) {
    const pending = readStored(PENDING_KEY, () => null);
    if (pending && Date.now() - pending.savedAt < PENDING_TTL) {
      bootCache = { route: 'cc-join', code: pending.code, a: pending.a };
    }
  }
  return bootCache;
}

export function clearPending() {
  removeStored(PENDING_KEY);
}

export function saveLastResult(a, b) {
  writeStored(LAST_KEY, { a, b });
}

export function readLastResult() {
  return readStored(LAST_KEY, () => null);
}
