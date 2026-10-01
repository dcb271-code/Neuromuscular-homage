'use client';

// Per-browser progress for a curriculum (no accounts). Stored in localStorage under a key per
// curriculum, read only after mount, so server and first client render always agree.

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface QuizAttempt { score: number; total: number; at: string; missed: number[] }
export interface Flag { module: string; section: number; text: string; at: string }
export interface MissedItem { module: string; section: number; at: string } // inline questions answered wrong

export interface CurriculumStore {
  read: Record<string, number[]>;          // moduleId → section indexes read
  quiz: Record<string, QuizAttempt>;       // moduleId → last attempt
  flags: Record<string, Flag>;             // `${moduleId}:${section}:${kp}` → flag
  missed: Record<string, MissedItem>;      // `${moduleId}:${section}` → inline question missed
  signOff: Record<string, boolean>;        // moduleId → self-reported faculty sign-off
  lastModule?: string;
}
/** @deprecated name kept for existing imports */
export type EegStore = CurriculumStore;

const EMPTY: CurriculumStore = { read: {}, quiz: {}, flags: {}, missed: {}, signOff: {} };

// One cache + listener set per storage key, so two curricula never share state.
const caches = new Map<string, CurriculumStore>();
const listeners = new Map<string, Set<() => void>>();

function load(key: string): CurriculumStore {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch { return EMPTY; }
}
function getStore(key: string): CurriculumStore {
  let s = caches.get(key);
  if (!s) { s = load(key); caches.set(key, s); }
  return s;
}
function setStore(key: string, next: CurriculumStore) {
  if (next === caches.get(key)) return; // no-op update: don't notify, or effects that depend on it loop
  caches.set(key, next);
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* private mode etc. */ }
  listeners.get(key)?.forEach(l => l());
}

export function useCurriculumProgress(key: string) {
  const [store, setLocal] = useState<CurriculumStore>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setLocal({ ...getStore(key) });
    sync(); setHydrated(true);
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(sync);
    const onStorage = (e: StorageEvent) => { if (e.key === key) { caches.delete(key); sync(); } };
    window.addEventListener('storage', onStorage);
    return () => { listeners.get(key)?.delete(sync); window.removeEventListener('storage', onStorage); };
  }, [key]);

  const update = useCallback((fn: (s: CurriculumStore) => CurriculumStore) => setStore(key, fn(getStore(key))), [key]);

  // Mutators are memoised on `update` (itself stable per key), so effects may list them as deps.
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
    reset: () => setStore(key, { ...EMPTY }),
  }), [update, key]);

  return { store, hydrated, ...api };
}

// Storage keys. The EEG key is historical (the site's first name); changing it would reset
// everyone's EEG progress.
export const STORAGE_KEYS = { eeg: 'pons.eeg.v1', loc: 'wbw.loc.v1' } as const;

export const useEegProgress = () => useCurriculumProgress(STORAGE_KEYS.eeg);

export function moduleProgress(store: CurriculumStore, moduleId: string, sectionCount: number): number {
  const read = (store.read[moduleId] ?? []).length;
  const quizDone = store.quiz[moduleId] ? 1 : 0;
  return sectionCount ? (read + quizDone) / (sectionCount + 1) : 0;
}
