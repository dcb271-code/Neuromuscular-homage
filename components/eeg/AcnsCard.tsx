'use client';

// Figure for Module 11: an ACNS 2021 critical care EEG quick card with a name builder that names a
// pattern and places it as interictal, ictal-interictal continuum, seizure or status.
// All terms and cutoffs come from src/eeg/acns-model.ts (Hirsch LJ 2021, PMID 33475321).

import { useState, type ReactNode } from 'react';
import {
  MAIN_TERM_1, MAIN_TERM_2, PLUS_MODIFIERS, PREVALENCE, DURATION, FREQUENCIES, SHARPNESS, AMPLITUDE,
  IIC_CRITERIA, IIC_EXCLUSION, CATEGORY_LABEL, BELOW_HALF, VERY_BRIEF_ONLY_ABOVE_HZ,
  buildName, classifyChoice, plusAllowed, freqLabel,
  type Loc, type Pattern, type Plus, type Prevalence, type Change, type DurationCat, type Category,
} from '@/src/eeg/acns-model';

const PUBMED = 'https://pubmed.ncbi.nlm.nih.gov/33475321/';

const CAT_STYLE: Record<Category, { bg: string; fg: string; border: string }> = {
  interictal: { bg: '#f1f5f9', fg: '#334155', border: '#cbd5e1' },
  iic: { bg: '#fef3c7', fg: '#92400e', border: '#fcd34d' },
  seizure: { bg: '#ffedd5', fg: '#9a3412', border: '#fdba74' },
  status: { bg: '#fee2e2', fg: '#991b1b', border: '#fca5a5' },
};

// ── Quick card

function Group({ title, children, open, onToggle, id }: { title: string; children: ReactNode; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
        <span>{title}</span>
        <span aria-hidden="true" className="text-slate-400 text-[12px] font-mono">{open ? '−' : '+'}</span>
      </button>
      {open && <div id={id} className="px-3 pb-3 text-[12.5px] text-slate-700 leading-snug">{children}</div>}
    </div>
  );
}

function Rows({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {rows.map(([a, b], i) => (
          <tr key={i} className="border-t border-slate-100 first:border-t-0 align-top">
            <th scope="row" className="py-1 pr-3 text-left font-semibold text-slate-800 whitespace-nowrap">{a}</th>
            <td className="py-1 text-slate-600">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const GROUPS: { key: string; title: string; body: ReactNode }[] = [
  {
    key: 'mt1', title: 'Main term 1 (where)',
    body: <Rows rows={MAIN_TERM_1.map(m => [<span key="a" className="font-mono">{m.abbr}</span>, <><b className="font-semibold text-slate-700">{m.name}.</b> {m.meaning}</>])} />,
  },
  {
    key: 'mt2', title: 'Main term 2 (what)',
    body: <>
      <Rows rows={MAIN_TERM_2.map(m => [<span key="a" className="font-mono">{m.abbr}</span>, <><b className="font-semibold text-slate-700">{m.name}.</b> {m.meaning}</>])} />
      <p className="mt-2 text-slate-500">A pattern must run at least 6 cycles to count as rhythmic or periodic.</p>
    </>,
  },
  {
    key: 'plus', title: 'Plus modifiers',
    body: <>
      <Rows rows={PLUS_MODIFIERS.map(p => [<span key="a" className="font-mono">{p.code}</span>, <>{p.meaning} <span className="text-slate-400">({p.appliesTo.join(' or ')} only)</span></>])} />
      <p className="mt-2 text-slate-500">No plus modifier applies to SW.</p>
    </>,
  },
  {
    key: 'prev', title: 'Prevalence and duration',
    body: <div className="grid gap-3 sm:grid-cols-2">
      <div><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Prevalence, share of the epoch</div>
        <Rows rows={PREVALENCE.map(p => [p.term, p.range])} /></div>
      <div><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Typical duration</div>
        <Rows rows={DURATION.map(d => [d.term, d.range])} /></div>
    </div>,
  },
  {
    key: 'freq', title: 'Frequency, sharpness and amplitude',
    body: <>
      <p className="mb-2">Frequency categories are under 0.5, 0.5, 1, 1.5, 2 and 2.5 Hz. The values 3, 3.5 and 4 Hz are used only for very brief patterns. PDs or SW above 2.5 Hz for 10 seconds or more are a seizure. No rhythmic or periodic pattern is faster than 4 Hz.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Sharpness (PDs and SW)</div>
          <Rows rows={SHARPNESS.map(s => [s.term, s.meaning])} /></div>
        <div><div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Absolute amplitude</div>
          <Rows rows={AMPLITUDE.map(a => [a.term, a.range])} />
          <p className="mt-1 text-slate-500">PDs also get a relative amplitude, 2 or less, or more than 2, against the background.</p></div>
      </div>
    </>,
  },
  {
    key: 'evo', title: 'Evolution and fluctuation',
    body: <Rows rows={[
      ['Evolving', 'At least 2 unequivocal, sequential changes in one feature. Frequency must step at least 0.5 Hz in the same direction each time, or the morphology must change twice, or the pattern must spread, one step after another, into or out of at least 2 different 10-20 electrode positions. Each state lasts at least 3 cycles, and the feature never stays unchanged for 5 minutes or more.'],
      ['Fluctuating', '3 or more changes, no more than 1 minute apart, in frequency (by 0.5 Hz or more), morphology or location (by one electrode distance or more), that do not meet the evolution criteria.'],
      ['Static', 'Neither evolving nor fluctuating.'],
      ['Amplitude', 'A change in amplitude alone is neither.'],
      ['Under 10 s', 'An evolving pattern at 4 Hz or less is called evolving (for example, evolving LRDA). Above 4 Hz it is a definite BIRD. At 10 seconds or more, evolution makes it a seizure.'],
    ]} />,
  },
  {
    key: 'sz', title: 'Seizure and status',
    body: <Rows rows={[
      ['Electrographic seizure', 'Epileptiform discharges averaging more than 2.5 Hz (more than 25 in 10 seconds) for 10 seconds or more, or any pattern with definite evolution lasting 10 seconds or more. Sharply contoured discharges too long to be epileptiform still count.'],
      ['Electrographic status', 'An electrographic seizure lasting 10 continuous minutes or more, or seizures totaling 20% or more of any 60-minute period.'],
      ['Electroclinical seizure', 'Any pattern, of any duration, with a definite clinical correlate time-locked to it, or with EEG and clinical improvement after a parenteral antiseizure medication.'],
      ['Electroclinical status', 'The same 10 minutes or 20% of an hour, or 5 continuous minutes for a seizure with bilateral tonic-clonic activity.'],
      ['Possible status', 'Possible electroclinical status is a continuum pattern lasting 10 continuous minutes or 20% of an hour that improves on EEG after a parenteral antiseizure medication, without clinical improvement.'],
    ]} />,
  },
  {
    key: 'bird', title: 'BIRDs',
    body: <>
      <p className="mb-2">Brief potentially ictal rhythmic discharges are focal or generalized rhythmic activity faster than 4 Hz, at least 6 waves, lasting from 0.5 to under 10 seconds, with no definite clinical correlate. They must not be a normal variant or part of burst suppression, and they need one more feature.</p>
      <Rows rows={[
        ['Definite', 'Evolution, or a similar morphology and location to the patient\'s epileptiform discharges or seizures.'],
        ['Possible', 'Sharply contoured, without either of those.'],
      ]} />
    </>,
  },
  {
    key: 'iic', title: 'Ictal-interictal continuum',
    body: <>
      <p className="mb-1">A pattern is on the continuum if it meets any one of these.</p>
      <ol className="list-decimal pl-5 space-y-1">{IIC_CRITERIA.map(c => <li key={c}>{c}</li>)}</ol>
      <p className="mt-2">{IIC_EXCLUSION}</p>
    </>,
  },
];

function QuickCard() {
  const [open, setOpen] = useState<Record<string, boolean>>({ iic: true });
  const all = GROUPS.every(g => open[g.key]);
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Quick card</span>
        <button type="button" onClick={() => setOpen(all ? {} : Object.fromEntries(GROUPS.map(g => [g.key, true])))}
          className="text-[11px] font-semibold text-slate-500 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
          {all ? 'Close all' : 'Open all'}
        </button>
      </div>
      {GROUPS.map(g => (
        <Group key={g.key} id={`acns-${g.key}`} title={g.title} open={!!open[g.key]} onToggle={() => setOpen(o => ({ ...o, [g.key]: !o[g.key] }))}>
          {g.body}
        </Group>
      ))}
    </div>
  );
}

// ── Name builder

function Seg<T extends string | number>({ label, options, value, onChange, accent, render, disabled }: {
  label: string; options: readonly T[]; value: T; onChange: (v: T) => void; accent: string;
  render?: (v: T) => string; disabled?: (v: T) => boolean;
}) {
  return (
    <div role="group" aria-label={label}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map(o => {
          const on = o === value, off = disabled?.(o) ?? false;
          return (
            <button key={String(o)} type="button" onClick={() => onChange(o)} disabled={off} aria-pressed={on}
              className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border min-w-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-400 disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ background: on ? accent : '#fff', color: on ? '#fff' : '#334155', borderColor: on ? accent : '#e2e8f0' }}>
              {render ? render(o) : String(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const LOCS = MAIN_TERM_1.map(m => m.abbr);
const PATTERNS = MAIN_TERM_2.map(m => m.abbr);
const PLUSES: Plus[] = ['', '+F', '+R', '+S', '+FR', '+FS'];
const PREVS = PREVALENCE.map(p => p.term);
const DURS = [...DURATION.map(d => d.term)].reverse(); // shortest first
const CHANGES: Change[] = ['static', 'fluctuating', 'evolving'];
const CHANGE_LABEL: Record<Change, string> = { static: 'Static', fluctuating: 'Fluctuating', evolving: 'Evolving' };

function freqAllowed(pattern: Pattern, dur: DurationCat, hz: number) {
  if (pattern === 'RDA' && hz < 0.5) return false;
  if (pattern === 'RDA' && hz > VERY_BRIEF_ONLY_ABOVE_HZ && dur !== 'Very brief') return false;
  return true;
}

function Builder({ accent }: { accent: string }) {
  const [loc, setLoc] = useState<Loc>('G');
  const [pattern, setPatternRaw] = useState<Pattern>('PDs');
  const [plus, setPlus] = useState<Plus>('');
  const [prevalence, setPrevalence] = useState<Prevalence>('Abundant');
  const [hz, setHzRaw] = useState<number>(1.5);
  const [change, setChange] = useState<Change>('static');
  const [duration, setDurationRaw] = useState<DurationCat>('Long');
  const [burden, setBurden] = useState(5);

  // Keep the choices consistent: drop a plus or a frequency the new pattern or duration cannot take.
  const fixFreq = (p: Pattern, d: DurationCat) => { if (!freqAllowed(p, d, hz)) setHzRaw(p === 'RDA' && hz < 0.5 ? 0.5 : Math.min(Math.max(hz, 0.5), 2.5)); };
  const setPattern = (p: Pattern) => { setPatternRaw(p); if (!plusAllowed(p, plus)) setPlus(''); fixFreq(p, duration); };
  const setDuration = (d: DurationCat) => { setDurationRaw(d); fixFreq(pattern, d); };

  const choice = { loc, pattern, plus, prevalence, hz, change, duration };
  const name = buildName(choice);
  const result = classifyChoice(choice, burden);
  const st = CAT_STYLE[result.category];
  const isSz = result.category === 'seizure' || result.category === 'status';
  const continuousStatus = isSz && (duration === 'Long' || duration === 'Very long');

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Name builder</div>
      <div className="p-3 grid gap-3">
        <Seg label="Main term 1" options={LOCS} value={loc} onChange={setLoc} accent={accent} />
        <Seg label="Main term 2" options={PATTERNS} value={pattern} onChange={setPattern} accent={accent} />
        <Seg label="Plus modifier" options={PLUSES} value={plus} onChange={setPlus} accent={accent}
          render={p => (p === '' ? 'None' : p)} disabled={p => !plusAllowed(pattern, p)} />
        <Seg label="Prevalence" options={PREVS} value={prevalence} onChange={setPrevalence} accent={accent} />
        <Seg label="Frequency" options={FREQUENCIES} value={hz} onChange={setHzRaw} accent={accent}
          render={f => (f === BELOW_HALF ? '<0.5' : String(f))} disabled={f => !freqAllowed(pattern, duration, f)} />
        <Seg label="Change over time" options={CHANGES} value={change} onChange={setChange} accent={accent} render={c => CHANGE_LABEL[c]} />
        <Seg label="Typical run duration" options={DURS} value={duration} onChange={setDuration} accent={accent} />
        {pattern === 'SW' && <p className="text-[11px] text-slate-500 -mt-1">Plus modifiers do not apply to SW.</p>}
        {pattern === 'RDA' && <p className="text-[11px] text-slate-500 -mt-1">RDA runs from 0.5 to 4 Hz, and 3 to 4 Hz is listed only for very brief runs.</p>}
      </div>

      <div className="border-t border-slate-100 p-3" aria-live="polite">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Name</div>
        <div className="text-[17px] font-bold text-slate-900 font-mono break-words">{name}</div>
        <div className="text-[12px] text-slate-500 mt-0.5">{hz < 0.5 ? 'Under 0.5 Hz' : freqLabel(hz)}, {CHANGE_LABEL[change].toLowerCase()}, typical run {DURATION.find(d => d.term === duration)!.range.toLowerCase()}</div>

        <div className="mt-3 rounded-lg border px-3 py-2" style={{ background: st.bg, borderColor: st.border }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-bold" style={{ color: st.fg }}>{CATEGORY_LABEL[result.category]}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/70" style={{ color: st.fg }}>{result.criterion}</span>
          </div>
          <p className="text-[12.5px] mt-1 leading-snug" style={{ color: st.fg }}>{result.reason}</p>
        </div>

        {isSz && !continuousStatus && (
          <div className="mt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1" id="acns-burden-label">Total seizure time in the worst hour</div>
            <div className="flex items-center gap-2" role="group" aria-labelledby="acns-burden-label">
              <button type="button" onClick={() => setBurden(b => Math.max(0, b - 1))} aria-label="One minute less"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-[16px] font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">−</button>
              <span className="min-w-[96px] text-center text-[13px] font-semibold text-slate-800 tabular-nums">{burden} min ({Math.round((burden / 60) * 100)}%)</span>
              <button type="button" onClick={() => setBurden(b => Math.min(60, b + 1))} aria-label="One minute more"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-[16px] font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">+</button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Status begins at 12 minutes, which is 20% of the hour.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AcnsCard({ accent = '#4f46e5' }: { accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>ACNS 2021 card</span>
        <span className="text-[12px] text-slate-500">The terms and cutoffs on one card, and a builder that names a pattern and places it.</span>
      </div>
      <div className="nm-2col">
        <QuickCard />
        <Builder accent={accent} />
      </div>
      <p className="mt-3 text-[11px] text-slate-400 leading-snug">
        Electrographic criteria only, for children and adults. A definite clinical correlate, or EEG and clinical improvement after a parenteral antiseizure medication, makes an electroclinical seizure, which the builder does not judge. Neonatal definitions differ (Module 7). Terms and cutoffs follow{' '}
        <a href={PUBMED} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: accent }}>Hirsch LJ 2021</a>.
      </p>
    </div>
  );
}
