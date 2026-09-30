'use client';

// Pattern gallery: every licensed tracing as a flashcard. Front shows the image; tapping
// reveals the name, caption and the module that teaches it. Filter by module.

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { EegFigure, EegModule } from '@/src/eeg/types';
import { FigureCard } from './Figure';

export function GalleryPage({ figures, modules }: { figures: EegFigure[]; modules: EegModule[] }) {
  // Which module/section uses each figure.
  const usedBy = useMemo(() => {
    const map: Record<string, { module: EegModule; section: number }[]> = {};
    for (const m of modules) m.sections.forEach((s, i) => (s.figures ?? []).forEach(id => { (map[id] ??= []).push({ module: m, section: i }); }));
    return map;
  }, [modules]);
  const [filter, setFilter] = useState<string>('all');
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const list = figures.filter(f => filter === 'all' ? true : filter === 'unassigned' ? !usedBy[f.id] : (usedBy[f.id] ?? []).some(u => u.module.id === filter));
  const modulesWithFigs = modules.filter(m => m.sections.some(s => s.figures?.length));

  return (
    <div>
      <nav className="text-[12px] text-slate-400 mb-5 flex gap-1.5 items-center"><Link href="/eeg" className="text-slate-500 no-underline hover:underline">EEG</Link><span>/</span><span className="text-slate-800 font-semibold">Pattern gallery</span></nav>
      <h1 className="font-mono font-extrabold tracking-tight text-slate-900 mb-2" style={{ fontSize: 'clamp(24px, 5.5vw, 34px)' }}>Pattern gallery</h1>
      <p className="text-[14px] text-slate-600 mb-5 leading-relaxed max-w-[680px]">
        {figures.length} tracings: from the AES introductory text and atlas (St. Louis and Frey, 2016, Creative Commons) and from Jaime Shoup, MD, University of Louisville (used with permission). In quiz mode the caption is hidden until you tap the card: name the pattern first, then check.
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 gap-0.5">
          {(['browse', 'quiz'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setRevealed({}); }} className="px-3 py-1 rounded-md text-[12px] font-semibold"
              style={{ background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#0f172a' : '#64748b', boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,.08)' : 'none' }}>{m === 'browse' ? 'Browse' : 'Quiz me'}</button>
          ))}
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="text-[12px] font-semibold rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700">
          <option value="all">All modules</option>
          {modulesWithFigs.map(m => <option key={m.id} value={m.id}>{String(m.number).padStart(2, '0')} · {m.short}</option>)}
          <option value="unassigned">Not yet placed in a module</option>
        </select>
        <span className="text-[12px] text-slate-400">{list.length} shown</span>
      </div>

      <div className="nm-2col">
        {list.map(f => {
          const uses = usedBy[f.id] ?? [];
          const accent = uses[0]?.module.color ?? '#475569';
          if (mode === 'browse') {
            return (
              <div key={f.id}>
                <FigureCard fig={f} accent={accent} />
                {uses.length > 0 && (
                  <div className="mt-1.5 text-[11px] text-slate-500 flex gap-2 flex-wrap">
                    {uses.map(u => <Link key={`${u.module.id}-${u.section}`} href={`/eeg/${u.module.id}#s${u.section + 1}`} className="no-underline font-semibold" style={{ color: u.module.color }}>Module {u.module.number} · {u.module.sections[u.section].title} →</Link>)}
                  </div>
                )}
              </div>
            );
          }
          const on = !!revealed[f.id];
          return (
            <button key={f.id} onClick={() => setRevealed(r => ({ ...r, [f.id]: !r[f.id] }))} className="text-left rounded-2xl border bg-white overflow-hidden" style={{ borderColor: on ? accent : '#e2e8f0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.file} alt="EEG tracing, pattern hidden" width={f.width} height={f.height} loading="lazy" className="block w-full h-auto bg-slate-50" />
              <div className="px-4 py-3 text-[12.5px] leading-relaxed min-h-[52px]">
                {on ? (
                  <><span className="font-semibold text-slate-800">{f.title}.</span> <span className="text-slate-600">{f.caption.slice(f.title.length).replace(/^[.\s]+/, '')}</span>
                    {uses[0] && <div className="mt-1 text-[11px] font-semibold" style={{ color: accent }}>Module {uses[0].module.number} · {uses[0].module.sections[uses[0].section].title}</div>}</>
                ) : <span className="text-slate-400">What is this? Tap to reveal.</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
        Sources: St. Louis EK, Frey LC, eds. Electroencephalography: An Introductory Text and Atlas of Normal and Abnormal Findings in Adults, Children, and Infants. American Epilepsy Society; 2016, CC BY-NC-SA 4.0; and Jaime Shoup, MD, University of Louisville, used with permission (not for further copying). Images resized and captions shortened; full credits in <a href="/eeg/ATTRIBUTIONS.md" target="_blank" rel="noopener noreferrer" className="underline">ATTRIBUTIONS.md</a>. Figures the book marks with a separate copyright were not reproduced.
      </p>
    </div>
  );
}
