'use client';

// Localization section home: the argument in three lines, a playable localizer, module cards
// by track with progress, resources and reference texts.

import Link from 'next/link';
import type { EegModule } from '@/src/eeg/types';
import { LOC_RESOURCES, LOC_TEXTS, LOC_TRACKS } from '@/src/loc/curriculum';
import { moduleProgress, STORAGE_KEYS, useCurriculumProgress } from '@/src/curriculum/progress';
import { Ring } from '@/components/eeg/CurriculumHome';
import { Localizer } from './Localizer';

const ORDER = ['doctrine', 'periphery', 'axis', 'hemispheres', 'synthesis'];

export function LocHome({ modules }: { modules: EegModule[] }) {
  const { store, hydrated } = useCurriculumProgress(STORAGE_KEYS.loc);
  const last = store.lastModule ? modules.find(m => m.id === store.lastModule) : undefined;
  const lastPct = last ? Math.round(moduleProgress(store, last.id, last.sections.length) * 100) : 0;
  const accent = '#0d9488';

  return (
    <div>
      {hydrated && last && lastPct < 100 && (
        <Link href={`/localization/${last.id}`} className="no-underline mb-8 rounded-2xl border px-5 py-4 flex items-center gap-4" style={{ borderColor: last.color + '55', background: last.color + '08' }}>
          <Ring pct={lastPct} color={last.color} size={40} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: last.color }}>Continue where you left off</div>
            <div className="text-[14px] font-semibold text-slate-900 truncate">{String(last.number).padStart(2, '0')} · {last.title}</div>
          </div>
          <span className="ml-auto text-[13px] font-semibold" style={{ color: last.color }}>→</span>
        </Link>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
        <p className="text-[15px] text-slate-700 leading-relaxed max-w-[720px]">
          A weak hand, a lost reflex, a child who stopped walking: each is an <b>address</b> before it is a diagnosis. The exam tells you <b>where</b>; the story tells you <b>when</b>; together they tell you <b>what</b>. These twelve modules teach that order, with figures you can push on: every one is computed from a model of the anatomy, not copied from a book.
        </p>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Try it before you read anything</div>
      <Localizer accent={accent} variant="intro" />

      {ORDER.map(track => {
        const ms = modules.filter(m => m.track === track); if (!ms.length) return null;
        const t = LOC_TRACKS[track];
        return (
          <div key={track} className="mb-9">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{t.name}</div>
            </div>
            <p className="text-[13px] text-slate-500 mb-4">{t.blurb}</p>
            <div className="nm-2col">
              {ms.map(m => {
                const pct = hydrated ? Math.round(moduleProgress(store, m.id, m.sections.length) * 100) : 0;
                const q = store.quiz[m.id];
                const widgets = m.sections.filter(s => s.figure).length;
                return (
                  <Link key={m.id} href={`/localization/${m.id}`} className="nm-card-link no-underline flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5" style={{ borderTop: `3px solid ${m.color}` }}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[22px] font-extrabold tracking-tight" style={{ color: m.color }}>{String(m.number).padStart(2, '0')}</span>
                      <span className="text-[16px] font-bold text-slate-900 leading-tight">{m.title}</span>
                      <span className="ml-auto shrink-0"><Ring pct={pct} color={m.color} size={34} /></span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{m.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 mt-1">
                      <span>{m.sections.length} sections</span><span>·</span><span>{widgets} interactive</span><span>·</span><span>{m.duration}</span>
                      {q && <span className="ml-auto font-semibold" style={{ color: m.color }}>Quiz {q.score}/{q.total}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Watch the exam</div>
      <div className="grid gap-2 mb-8">
        {LOC_RESOURCES.map(r => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="no-underline rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px]">
            <span className="font-semibold text-slate-900">{r.name} ↗</span>
            <span className="block text-[12px] text-slate-500 mt-0.5">{r.note}</span>
          </a>
        ))}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">The books behind it</div>
      <ul className="list-disc list-outside ml-5 text-[12.5px] text-slate-500 space-y-1 mb-6">{LOC_TEXTS.map(t => <li key={t}>{t}</li>)}</ul>
      <p className="text-[11px] text-slate-400">Written in our own words, citing these texts by page. For education; not for clinical decision-making.</p>
    </div>
  );
}
