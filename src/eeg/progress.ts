'use client';

// Per-browser progress for the EEG curriculum (no accounts). Stored in localStorage and
// read only after mount, so server and first client render always agree.

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface QuizAttempt { score: number; total: number; at: string; missed: number[] }
export interface Flag { module: string; section: number; text: string; at: string }
export interface MissedItem { module: string; section: number; at: string } // inline questions answered wrong

export interface EegStore {
  read: Record<string, number[]>;          // moduleId → section indexes read
  quiz: Record<string, QuizAttempt>;       // moduleId → last attempt
  flags: Record<string, Flag>;             // `${moduleId}:${section}:${kp}` → flag
  missed: Record<string, MissedItem>;      // `${moduleId}:${section}` → inline question missed
  signOff: Record<string, boolean>;        // moduleId → self-reported faculty sign-off
  lastModule?: string;
}

const KEY = 'pons.eeg.v1'; // historical key from the site's first name; changing it would reset everyone's progress
const EMPTY: EegStore = { read: {}, quiz: {}, flags: {}, missed: {}, signOff: {} };

function load(): EegStore {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch { return EMPTY; }
}
function save(s: EegStore) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode etc. */ }
}

const listeners = new Set<() => void>();
let cache: EegStore | null = null;
function getStore(): EegStore { if (!cache) cache = load(); return cache; }
function setStore(next: EegStore) {
  if (next === cache) return; // no-op update: don't notify, or effects that depend on it loop
  cache = next; save(next); listeners.forEach(l => l());
}

export function useEegProgress() {
  const [store, setLocal] = useState<EegStore>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setLocal({ ...getStore() });
    sync(); setHydrated(true);
    listeners.add(sync);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; sync(); } };
    window.addEventListener('storage', onStorage);
    return () => { listeners.delete(sync); window.removeEventListener('storage', onStorage); };
  }, []);

  const update = useCallback((fn: (s: EegStore) => EegStore) => setStore(fn(getStore())), []);

  // Mutators are memoised on `update` (itself stable), so effects may list them as deps.
  const api = useMemo(() => ({
    markRead: (module: string, section: number) => update(s => {
      const cur = s.read[module] ?? [];
      if (cur.includes(section)) return s;
      return { ...s, read: { ...s.read, [module]: [...cur, section].sort((a, b) => a - b) }, lastModule: module };
    }),
    touch: (module: string) => update(s => (s.lastModule === module ? s : { ...s, lastModule: module })),
    saveQuiz: (module: string, attempt: QuizAttempt) => update(s => ({ ...s, quiz: { ...s.quiz, [module]: attempt } })),
    toggleFlag: (module: string, section: number, kp: number, text: string) => update(s => {
      const k = `${module}:${section}:${kp}`; const flags = { ...s.flags };
      if (flags[k]) delete flags[k]; else flags[k] = { module, section, text, at: new Date().toISOString() };
      return { ...s, flags };
    }),
    recordInline: (module: string, section: number, correct: boolean) => update(s => {
      const k = `${module}:${section}`; const missed = { ...s.missed };
      if (correct) delete missed[k]; else missed[k] = { module, section, at: new Date().toISOString() };
      return { ...s, missed };
    }),
    setSignOff: (module: string, done: boolean) => update(s => ({ ...s, signOff: { ...s.signOff, [module]: done } })),
    reset: () => setStore({ ...EMPTY }),
  }), [update]);

  return { store, hydrated, ...api };
}

export function moduleProgress(store: EegStore, moduleId: string, sectionCount: number): number {
  const read = (store.read[moduleId] ?? []).length;
  const quizDone = store.quiz[moduleId] ? 1 : 0;
  return sectionCount ? (read + quizDone) / (sectionCount + 1) : 0;
}
