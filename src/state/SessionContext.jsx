import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { astrologers, shubhKartProducts } from '../data/appData';

const SessionContext = createContext(null);

const SESSION_KEY = 'astro:recent-sessions';
const RECENT_KEY = 'astro:recent-products';

const MAX_RECENT = 8;
const MAX_SESSIONS = 2;

const seededSessions = () => [
  { astrologerId: 'as-01', mode: 'chat', startedAt: Date.now() - 12 * 60 * 1000 },
  { astrologerId: 'as-03', mode: 'chat', startedAt: Date.now() - 2 * 60 * 60 * 1000 }
];

const seededRecent = () => ['sk-01', 'sk-04', 'sk-05', 'sk-02'];

function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback();
    return JSON.parse(raw);
  } catch {
    return fallback();
  }
}

function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => readStored(SESSION_KEY, seededSessions));
  const [recentIds, setRecentIds] = useState(() => readStored(RECENT_KEY, seededRecent));

  useEffect(() => { writeStored(SESSION_KEY, sessions); }, [sessions]);
  useEffect(() => { writeStored(RECENT_KEY, recentIds); }, [recentIds]);

  const startSession = (astrologer, mode = 'chat') => {
    if (!astrologer) return;
    const entry = { astrologerId: astrologer.id, mode, startedAt: Date.now() };
    setSessions((prev) => [
      entry,
      ...(prev || []).filter((s) => s.astrologerId !== astrologer.id)
    ].slice(0, MAX_SESSIONS));
  };

  const clearSessions = () => setSessions([]);

  const viewProduct = (product) => {
    if (!product) return;
    setRecentIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, MAX_RECENT));
  };

  const value = useMemo(() => {
    const recentSessions = (sessions || [])
      .map((s) => {
        const astrologer = astrologers.find((a) => a.id === s.astrologerId);
        return astrologer ? { ...s, astrologer } : null;
      })
      .filter(Boolean)
      .slice(0, MAX_SESSIONS);
    const recentProducts = (recentIds || [])
      .map((id) => shubhKartProducts.find((p) => p.id === id))
      .filter(Boolean);
    return {
      recentSessions,
      startSession,
      clearSessions,
      recentProducts,
      viewProduct
    };
  }, [sessions, recentIds]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
