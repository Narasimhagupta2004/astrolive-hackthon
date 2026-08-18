import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  makeRoomCode, buildRoomUrl, buildInviteUrl, buildResultUrl,
  getBootLink, clearPending, saveLastResult, readLastResult
} from '../utils/cosmicLink';
import {
  firebaseAvailable, createRoom, joinRoom, fetchRoom, watchRoom
} from '../utils/cosmicRoom';

const CosmicContext = createContext(null);

export function CosmicProvider({ children }) {
  const boot = getBootLink();

  const [me, setMe] = useState(null);
  const [partner, setPartner] = useState(boot?.a || null);
  const [code, setCode] = useState(boot?.code || null);
  const [degraded, setDegraded] = useState(!firebaseAvailable());
  const [broken, setBroken] = useState(Boolean(boot?.broken));
  const [roomStatus, setRoomStatus] = useState(boot?.code ? 'loading' : 'idle');
  const unsubRef = useRef(null);

  const bootPair = boot?.route === 'cc-reveal' ? { a: boot.a, b: boot.b } : null;
  const [pair, setPair] = useState(bootPair);

  const stopWatching = useCallback(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
  }, []);

  const startAsHost = useCallback(async (person) => {
    setMe(person);
    if (!firebaseAvailable()) {
      setDegraded(true);
      return { link: buildInviteUrl(person), code: null };
    }
    try {
      const next = makeRoomCode();
      await createRoom(next, person);
      setCode(next);
      setRoomStatus('waiting');
      setDegraded(false);
      return { link: buildRoomUrl(next), code: next };
    } catch {
      setDegraded(true);
      return { link: buildInviteUrl(person), code: null };
    }
  }, []);

  const watch = useCallback((roomCode, onComplete) => {
    stopWatching();
    if (!firebaseAvailable() || !roomCode) return;
    unsubRef.current = watchRoom(
      roomCode,
      (data) => {
        if (!data) return;
        setRoomStatus(data.status);
        if (data.status === 'complete' && data.a && data.b) {
          setPair({ a: data.a, b: data.b });
          saveLastResult(data.a, data.b);
          onComplete && onComplete();
        }
      },
      () => setDegraded(true)
    );
  }, [stopWatching]);

  const loadRoom = useCallback(async (roomCode) => {
    if (!firebaseAvailable()) {
      setBroken(true);
      setRoomStatus('missing');
      return null;
    }
    try {
      const data = await fetchRoom(roomCode);
      if (!data) {
        setBroken(true);
        setRoomStatus('missing');
        return null;
      }
      setPartner(data.a);
      setRoomStatus(data.status);
      return data;
    } catch {
      setDegraded(true);
      setBroken(true);
      setRoomStatus('missing');
      return null;
    }
  }, []);

  const submitAsGuest = useCallback(async (person) => {
    setMe(person);
    if (code && firebaseAvailable()) {
      try {
        const data = await joinRoom(code, person);
        setPair({ a: data.a, b: data.b });
        saveLastResult(data.a, data.b);
        clearPending();
        return { ok: true };
      } catch (err) {
        if (err.message === 'room-full') return { ok: false, reason: 'room-full' };
        setDegraded(true);
        return { ok: false, reason: 'join-failed' };
      }
    }
    if (partner) {
      setPair({ a: partner, b: person });
      saveLastResult(partner, person);
      clearPending();
      return { ok: true };
    }
    return { ok: false, reason: 'no-partner' };
  }, [code, partner]);

  const restoreLast = useCallback(() => {
    const last = readLastResult();
    if (last && last.a && last.b) {
      setPair(last);
      return true;
    }
    return false;
  }, []);

  const value = useMemo(() => ({
    me, setMe, partner, code, pair, setPair, degraded, broken, setBroken, roomStatus,
    startAsHost, submitAsGuest, loadRoom, watch, stopWatching, restoreLast,
    resultLink: pair ? buildResultUrl(pair.a, pair.b) : null,
    clearPending
  }), [me, partner, code, pair, degraded, broken, roomStatus,
    startAsHost, submitAsGuest, loadRoom, watch, stopWatching, restoreLast]);

  return <CosmicContext.Provider value={value}>{children}</CosmicContext.Provider>;
}

export function useCosmic() {
  const ctx = useContext(CosmicContext);
  if (!ctx) throw new Error('useCosmic must be used inside <CosmicProvider>');
  return ctx;
}
