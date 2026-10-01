'use client';

// EEG section home: how to use, the module path, module cards with progress, milestones,
// sign-off checklist, resource map, textbooks. Progress is per browser.

import Link from 'next/link';
import type { EegModule, EegTrack } from '@/src/eeg/types';
import { HOW_TO_USE, MILESTONES, READING_TARGETS, RESOURCE_MAP, TEXTBOOKS, TRACKS } from '@/src/eeg/curriculum';
import { moduleProgress, useEegProgress } from '@/src/curriculum/progress';
import { CurriculumMap } from './CurriculumMap';

const ORDER: EegTrack[] = ['foundation', 'neonatal', 'abnormal', 'icu', 'longitudinal'];

export function CurriculumHome({ modules }: { modules: EegModule[] }) {
  const { store, hydrated } = useEegProgress();
  const byId = Object.fromEntries(modules.map(m => [m.id, m]));
  const last = store.lastModule ? byId[store.lastModule] : undefined;
  const lastPct = last ? Math.round(moduleProgress(store, last.id, last.sections.length) * 100) : 0;
  const modulesDone = modules.filter(m => store.quiz[m.id]).length;

  return (
    <div>
      {/* Continue banner */}
      {hydrated && last && lastPct < 100 && (
        <Link href={`/eeg/${last.id}`} className="no-underline block mb-8 rounded-2xl border px-5 py-4 flex items-center gap-4"
          style={{ borderColor: last.color + '55', background: last.color + '08' }}>
          <Ring pct={lastPct} color={last.color} size={40} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: last.color }}>Continue where you left off</div>
            <div className="text-[14px] font-semibold text-slate-900 truncate">{String(last.number).padStart(2, '0')} · {last.title}</div>
          </div>
          <span className="ml-auto text-[13px] font-semibold" style={{ color: last.color }}>→</span>
        </Link>
      )}

      <Link href="/eeg/gallery" className="nm-card-link no-underline block mb-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 flex items-center gap-4">
        <span className="font-mono text-[20px] font-extrabold text-slate-400">≋</span>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-slate-900">Pattern gallery</div>
          <div className="text-[12.5px] text-slate-500">Licensed tracings from the AES atlas, browsable or as a name-the-pattern quiz. Each one links to the section that teaches it.</div>
        </div>
        <span className="ml-auto text-[13px] font-semibold text-slate-400">→</span>
      </Link>

      {/* How to use */}
      <SectionLabel>How to use this curriculum</SectionLabel>
      <div className="nm-2col mb-9">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ol className="list-decimal list-outside ml-5 space-y-2 text-[14px] text-slate-700 leading-relaxed">
            {HOW_TO_USE.map((h, i) => <li key={i}>{h}</li>)}
          </ol>
          <p className="text-[12px] text-slate-500 mt-4 leading-relaxed">
            Each module takes roughly 2 to 4 hours of self-study, plus reading real records. These are estimates, not tested times. Every module has the same parts: objectives, teaching sections with key points and a decision question each, a quiz, what to read and watch, and what a faculty reader checks before the module counts as done.
          </p>
          {hydrated && <p className="text-[12px] text-slate-400 mt-3">Progress on this device: <b className="text-slate-600">{modulesDone}</b> of {modules.length} quizzes done.</p>}
        </div>
        <CurriculumMap modules={modules} store={store} />
      </div>

      {/* Modules by track */}
      {ORDER.map(track => {
        const ms = modules.filter(m => m.track === track); if (!ms.length) return null;
        const t = TRACKS[track];
        return (
          <div key={track} className="mb-9">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />
              <SectionLabel inline>{t.name}</SectionLabel>
            </div>
            <p className="text-[13px] text-slate-500 mb-4">{t.blurb}</p>
            <div className="nm-2col">
              {ms.map(m => {
                const pct = hydrated ? Math.round(moduleProgress(store, m.id, m.sections.length) * 100) : 0;
                const q = store.quiz[m.id];
                return (
                  <Link key={m.id} href={`/eeg/${m.id}`} className="nm-card-link no-underline flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5"
                    style={{ borderTop: `3px solid ${m.color}` }}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[22px] font-extrabold tracking-tight" style={{ color: m.color }}>{String(m.number).padStart(2, '0')}</span>
                      <span className="text-[16px] font-bold text-slate-900 leading-tight">{m.title}</span>
                      <span className="ml-auto shrink-0"><Ring pct={pct} color={m.color} size={34} /></span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{m.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 mt-1">
                      <span>{m.sections.length} sections</span><span>·</span><span>{m.quiz.length} quiz</span><span>·</span><span>{m.duration}</span>
                      {q && <span className="ml-auto font-semibold" style={{ color: m.color }}>Quiz {q.score}/{q.total}</span>}
                      {store.signOff[m.id] && <span className="font-semibold text-green-700">Signed off</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Milestones */}
      <SectionLabel>ACGME milestones this curriculum maps to</SectionLabel>
      <div className="mb-9 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-[13px]">
          <thead><tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="text-left px-4 py-2 font-semibold">Level</th><th className="text-left px-4 py-2 font-semibold">Wording (ACGME child neurology milestones, 2020)</th><th className="text-left px-4 py-2 font-semibold">Modules</th>
          </tr></thead>
          <tbody>
            {MILESTONES.map(r => (
              <tr key={r.level} className="border-b border-slate-100 last:border-0 align-top">
                <td className="px-4 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{r.level}</td>
                <td className="px-4 py-2.5 text-slate-600 leading-snug">{r.wording}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1 flex-wrap">
                    {r.modules.map(n => { const m = modules.find(x => x.number === n); return m ? <Link key={n} href={`/eeg/${m.id}`} className="no-underline font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md" style={{ color: m.color, background: m.color + '14' }}>{String(n).padStart(2, '0')}</Link> : null; })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-slate-500 mb-9 -mt-6 leading-relaxed">
        In a 2024 survey of US and Canadian child neurology program directors, 62% used no objective EEG competency measure and 93% set no minimum number of reads (<a href="https://pubmed.ncbi.nlm.nih.gov/39360148/" target="_blank" rel="noopener noreferrer" className="text-slate-600 underline-offset-2 hover:underline">Katyal 2024</a>). The ILAE competency roadmap puts the same skills at its Level 2 (<a href="https://pubmed.ncbi.nlm.nih.gov/30892268/" target="_blank" rel="noopener noreferrer" className="text-slate-600 underline-offset-2 hover:underline">Blümcke 2019</a>).
      </p>

      {/* Sign-off checklist */}
      <SectionLabel>Sign-off checklist</SectionLabel>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-9">
        <ul className="space-y-2">
          {modules.map(m => (
            <li key={m.id} className="flex items-start gap-3 text-[13px] leading-relaxed">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-[11px]"
                style={{ borderColor: store.signOff[m.id] ? '#16a34a' : '#e2e8f0', background: store.signOff[m.id] ? '#16a34a' : '#fff', color: '#fff' }}>{store.signOff[m.id] ? '✓' : ''}</span>
              <span><Link href={`/eeg/${m.id}`} className="font-mono font-bold no-underline mr-2" style={{ color: m.color }}>{String(m.number).padStart(2, '0')}</Link><span className="text-slate-700">{m.signOff}</span></span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-slate-500 mt-4 leading-relaxed">A suggested local reading mix, offered as a suggestion rather than a standard: {READING_TARGETS.join(' ')} Sign-offs here are self-reported; the faculty log in Module 12 is the record that counts.</p>
      </div>

      {/* Resource map */}
      <SectionLabel>Resource map</SectionLabel>
      <p className="text-[13px] text-slate-500 mb-3">All three core sites are free, but each has a different strength: Learning EEG for pediatric and neonatal content, eeg-training.com for interactive technical and ICU drills, and EEGmaster for tracked testing. None grants a reuse licence, so this curriculum links to their pages rather than copying figures.</p>
      <div className="grid gap-2 mb-9">
        {RESOURCE_MAP.map(r => (
          <div key={r.name} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px]">
            <div className="flex items-baseline gap-2 flex-wrap">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 no-underline hover:underline">{r.name} ↗</a>
              <span className="text-[11px] text-slate-400">{r.owner}</span>
              <span className="ml-auto text-[11px] font-semibold text-slate-500">Modules {r.modules}</span>
            </div>
            <div className="text-slate-500 text-[12px] mt-0.5 leading-snug"><span className="text-slate-700">{r.access}.</span> {r.note}</div>
          </div>
        ))}
      </div>

      <SectionLabel>Reference texts</SectionLabel>
      <ul className="list-disc list-outside ml-5 text-[12.5px] text-slate-500 space-y-1 mb-6">{TEXTBOOKS.map(t => <li key={t}>{t}</li>)}</ul>
      <p className="text-[11px] text-slate-400">For education. Not for clinical decision-making. Content follows the ACNS, IFCN and ILAE terminology named in each module, with every PubMed citation checked before publication.</p>
    </div>
  );
}

export function Ring({ pct, color, size = 36 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pct >= 100 ? '#16a34a' : color} strokeWidth="3"
        strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dy="0.35em" textAnchor="middle" fontSize={size * 0.28} fontWeight="700" fill={pct >= 100 ? '#16a34a' : '#475569'}>{pct >= 100 ? '✓' : pct}</text>
    </svg>
  );
}

function SectionLabel({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return <div className={`text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ${inline ? '' : 'mb-3'}`}>{children}</div>;
}
