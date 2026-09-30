'use client';

// Review: flagged key points plus missed questions, with a flashcard mode. Per browser.

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { EegModule } from '@/src/eeg/types';
import { useEegProgress } from '@/src/eeg/progress';

type Card = { front: string; back: string; module: EegModule; href: string; kind: 'key point' | 'missed question' };

export function ReviewPage({ modules }: { modules: EegModule[] }) {
  const { store, hydrated, toggleFlag, reset } = useEegProgress();
  const byId = useMemo(() => Object.fromEntries(modules.map(m => [m.id, m])), [modules]);
  const [mode, setMode] = useState<'list' | 'cards'>('list');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const cards: Card[] = useMemo(() => {
    const out: Card[] = [];
    for (const [k, f] of Object.entries(store.flags)) {
      const m = byId[f.module]; if (!m) continue;
      out.push({ kind: 'key point', front: `Module ${m.number} · ${m.sections[f.section]?.title ?? ''}`, back: f.text, module: m, href: `/eeg/${m.id}#s${f.section + 1}` });
      void k;
    }
    for (const [mid, a] of Object.entries(store.quiz)) {
      const m = byId[mid]; if (!m) continue;
      for (const qi of a.missed) { const q = m.quiz[qi]; if (q) out.push({ kind: 'missed question', front: q.question, back: `${q.options[q.answer]}\n\n${q.explanation}`, module: m, href: `/eeg/${m.id}#quiz` }); }
    }
    for (const [, miss] of Object.entries(store.missed)) {
      const m = byId[miss.module]; const q = m?.sections[miss.section]?.question; if (!m || !q) continue;
      out.push({ kind: 'missed question', front: q.question, back: `${q.options[q.answer]}\n\n${q.explanation}`, module: m, href: `/eeg/${m.id}#s${miss.section + 1}` });
    }
    return out;
  }, [store, byId]);

  const card = cards[idx % Math.max(cards.length, 1)];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <nav className="text-[12px] text-slate-400 mb-5 flex gap-1.5 items-center"><Link href="/eeg" className="text-slate-500 no-underline hover:underline">EEG</Link><span>/</span><span className="text-slate-800 font-semibold">Review</span></nav>
      <h1 className="font-mono font-extrabold tracking-tight text-slate-900 mb-2" style={{ fontSize: 'clamp(24px, 5.5vw, 34px)' }}>Review</h1>
      <p className="text-[14px] text-slate-600 mb-6 leading-relaxed">Key points you flagged and questions you missed, from every module, stored on this device.</p>

      {!hydrated ? null : cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-[14px] text-slate-500">
          Nothing here yet. Flag a key point with the ⚑ button, or miss a question, and it will appear here.
          <div className="mt-3"><Link href="/eeg" className="font-semibold no-underline text-blue-600">Go to the curriculum →</Link></div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 gap-0.5">
              {(['list', 'cards'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setFlipped(false); }} className="px-3 py-1 rounded-md text-[12px] font-semibold"
                  style={{ background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#0f172a' : '#64748b', boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,.08)' : 'none' }}>{m === 'list' ? 'List' : 'Flashcards'}</button>
              ))}
            </div>
            <span className="text-[12px] text-slate-400">{cards.length} item{cards.length === 1 ? '' : 's'}</span>
            <button onClick={() => setConfirmReset(true)} className="ml-auto text-[11px] text-slate-400 hover:text-slate-600">Reset all progress</button>
          </div>
          {confirmReset && (
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 flex items-center gap-3 flex-wrap">
              This clears sections read, quiz scores, flags and sign-offs on this device.
              <button onClick={() => { reset(); setConfirmReset(false); }} className="px-3 py-1 rounded-md text-[12px] font-semibold text-white bg-slate-800">Clear</button>
              <button onClick={() => setConfirmReset(false)} className="px-3 py-1 rounded-md text-[12px] font-semibold border border-slate-300 bg-white">Keep</button>
            </div>
          )}

          {mode === 'list' ? (
            <ul className="space-y-2">
              {cards.map((c, i) => (
                <li key={i} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px]" style={{ borderLeft: `3px solid ${c.module.color}` }}>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: c.module.color }}>
                    {c.kind}<Link href={c.href} className="ml-auto no-underline font-semibold normal-case tracking-normal text-[11px]" style={{ color: c.module.color }}>Module {c.module.number} →</Link>
                  </div>
                  {c.kind === 'key point' ? <p className="text-slate-800 leading-relaxed">{c.back}</p> : (
                    <details><summary className="cursor-pointer text-slate-800 leading-relaxed">{c.front}</summary><p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line">{c.back}</p></details>
                  )}
                </li>
              ))}
            </ul>
          ) : card && (
            <div>
              <button onClick={() => setFlipped(f => !f)} className="w-full text-left rounded-2xl border bg-white p-6 min-h-[200px] flex flex-col" style={{ borderColor: card.module.color + '66' }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: card.module.color }}>{card.kind} · Module {card.module.number} · {flipped ? 'answer' : 'tap to flip'}</span>
                <span className="text-[15px] text-slate-800 leading-relaxed whitespace-pre-line">{flipped ? card.back : card.front}</span>
              </button>
              <div className="flex items-center gap-2 mt-3 text-[12px]">
                <button onClick={() => { setIdx(i => (i - 1 + cards.length) % cards.length); setFlipped(false); }} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-600">← Prev</button>
                <span className="text-slate-400">{(idx % cards.length) + 1} / {cards.length}</span>
                <button onClick={() => { setIdx(i => (i + 1) % cards.length); setFlipped(false); }} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-600">Next →</button>
                {card.kind === 'key point' && (
                  <button onClick={() => { const key = Object.keys(store.flags).find(k => store.flags[k].text === card.back); if (key) { const [mid, s, kp] = key.split(':'); toggleFlag(mid, Number(s), Number(kp), card.back); } }}
                    className="ml-auto text-slate-400 hover:text-slate-600">Unflag</button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
