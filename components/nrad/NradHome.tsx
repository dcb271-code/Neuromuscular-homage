'use client';

// Neuroradiology section home: why imaging is read against the exam, the MRI atlas card, the
// six-module map (live modules link, planned ones are shown but not clickable), and resources.

import Link from 'next/link';
import type { EegModule } from '@/src/eeg/types';
import { NRAD_PLAN, NRAD_RESOURCES, NRAD_TRACKS } from '@/src/nrad/curriculum';
import { moduleProgress, STORAGE_KEYS, useCurriculumProgress } from '@/src/curriculum/progress';
import { Ring } from '@/components/eeg/CurriculumHome';

const ACCENT = '#7c3aed';
const TRACK_ORDER = ['first', 'mri', 'special'];

export function NradHome({ modules }: { modules: EegModule[] }) {
  const { store, hydrated } = useCurriculumProgress(STORAGE_KEYS.nrad);
  const byId = Object.fromEntries(modules.map(m => [m.id, m]));
  const last = store.lastModule ? byId[store.lastModule] : undefined;
  const lastPct = last ? Math.round(moduleProgress(store, last.id, last.sections.length) * 100) : 0;

  return (
    <div>
      {hydrated && last && lastPct < 100 && (
        <Link href={`/neuroradiology/${last.id}`} className="no-underline mb-8 rounded-2xl border px-5 py-4 flex items-center gap-4" style={{ borderColor: last.color + '55', background: last.color + '08' }}>
          <Ring pct={lastPct} color={last.color} size={40} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: last.color }}>Continue where you left off</div>
            <div className="text-[14px] font-semibold text-slate-900 truncate">{String(last.number).padStart(2, '0')} · {last.title}</div>
          </div>
          <span className="ml-auto text-[13px] font-semibold" style={{ color: last.color }}>Resume</span>
        </Link>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
        <p className="text-[15px] text-slate-700 leading-relaxed max-w-[720px]">
          A scan answers the question you bring to it. The examination tells you <b>where</b> the lesion ought to be, and the image tells you whether something is there and <b>what</b> it looks like. These modules teach pediatric imaging in that order. Every finding is traced back to the deficit it would produce, with links into the <Link href="/localization" className="font-semibold no-underline hover:underline" style={{ color: '#0d9488' }}>Localization</Link> modules, so that reading a scan and examining a child become the same habit.
        </p>
      </div>

      <Link href="/neuroradiology/atlas/" className="nm-card-link no-underline mb-8 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border p-5"
        style={{ borderColor: ACCENT + '66', background: `linear-gradient(135deg, ${ACCENT}10, #ffffff 70%)` }}>
        <AtlasGlyph />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: ACCENT }}>Companion tool</div>
          <div className="text-[18px] font-bold text-slate-900 leading-tight">Pediatric brain MRI atlas</div>
          <p className="text-[13px] text-slate-600 leading-relaxed mt-1">Scroll through T1 and T2 templates from 36 weeks postmenstrual age to 18 years, and switch on structure labels for the newborn and the 1 and 2 year templates. Use it to see myelination advance and to find any structure named in a module.</p>
        </div>
        <span className="sm:ml-auto shrink-0 text-[13px] font-semibold" style={{ color: ACCENT }}>Open the atlas</span>
      </Link>

      {TRACK_ORDER.map(track => {
        const t = NRAD_TRACKS[track];
        const items = NRAD_PLAN.filter(p => p.track === track);
        return (
          <div key={track} className="mb-9">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{t.name}</div>
            </div>
            <p className="text-[13px] text-slate-500 mb-4">{t.blurb}</p>
            <div className="nm-2col">
              {items.map(p => {
                const m = byId[p.id];
                if (p.status === 'live' && m) {
                  const pct = hydrated ? Math.round(moduleProgress(store, m.id, m.sections.length) * 100) : 0;
                  const q = store.quiz[m.id];
                  const widgets = m.sections.filter(s => s.figure).length;
                  return (
                    <Link key={p.id} href={`/neuroradiology/${m.id}`} className="nm-card-link no-underline flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5" style={{ borderTop: `3px solid ${m.color}` }}>
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
                }
                return (
                  <div key={p.id} aria-disabled="true" className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[22px] font-extrabold tracking-tight text-slate-300">{String(p.number).padStart(2, '0')}</span>
                      <span className="text-[16px] font-bold text-slate-500 leading-tight">{p.title}</span>
                      <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-[2px] rounded-full border border-slate-200 bg-white text-slate-400">Planned</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{p.blurb}</p>
                    {p.note && <div className="text-[11px] text-slate-400">{p.note}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Free references</div>
      <div className="grid gap-2 mb-8">
        {NRAD_RESOURCES.map(r => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="no-underline rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px]">
            <span className="font-semibold text-slate-900">{r.name} ↗</span>
            <span className="block text-[12px] text-slate-500 mt-0.5">{r.note}</span>
          </a>
        ))}
      </div>
      <p className="text-[11px] text-slate-400">
        <Link href="/neuroradiology/review" className="text-slate-500 underline">Review flagged points and missed questions</Link>. The CT images are real, from the CQ500 dataset and from open-access pediatric articles, with sources listed on the <Link href="/credits" className="text-slate-500 underline">credits</Link> page. For education. Not for clinical decision-making.
      </p>
    </div>
  );
}

function AtlasGlyph() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" className="shrink-0">
      <rect width="56" height="56" rx="12" fill="#0b0f14" />
      <ellipse cx="28" cy="29" rx="17" ry="21" fill="#4b5563" />
      <ellipse cx="28" cy="29" rx="14" ry="18" fill="#9ca3af" />
      <path d="M28 12 V46" stroke="#4b5563" strokeWidth="1.2" />
      <ellipse cx="24" cy="27" rx="2.4" ry="7" fill="#1f2937" transform="rotate(12 24 27)" />
      <ellipse cx="32" cy="27" rx="2.4" ry="7" fill="#1f2937" transform="rotate(-12 32 27)" />
      <circle cx="21" cy="37" r="3" fill="#a78bfa" opacity="0.9" />
    </svg>
  );
}
