'use client';

// Two figures built on TraceView and the synthetic page model in src/eeg/synth.ts.
//   TraceLab ('trace-lab'): every preset, with montage, sensitivity, filter and line-noise
//     controls. Module 1, "Filters, sensitivity and time base".
//   PatternViewer ('pattern-viewer'): the syndrome presets with calipers. Module 9,
//     "Childhood onset: absence, SeLECTS and SeLEAS".

import { useMemo, useState } from 'react';
import { TraceView } from './TraceView';
import {
  PRESETS, presetById, renderPage, MONTAGES, LFF_OPTIONS, HFF_OPTIONS, SENSITIVITY_OPTIONS, DEFAULT_FILTERS,
  type PresetId, type MontageId,
} from '@/src/eeg/synth';
import { SOURCES, sourceUrl } from '@/src/eeg/sources';

const SOURCE_LABEL: Record<string, string> = {
  currentPractice: 'Current Practice chapter',
  hirschE2022: 'Hirsch E 2022',
  specchio2022: 'Specchio 2022',
  zuberi2022: 'Zuberi 2022',
};

function Cite({ k }: { k?: string }) {
  if (!k || !SOURCES[k]) return null;
  const url = sourceUrl(SOURCES[k]);
  const text = SOURCE_LABEL[k] ?? k;
  return <> ({url ? <a href={url} target="_blank" rel="noopener noreferrer" className="underline">{text}</a> : text})</>;
}

function Segmented<T extends string | number>({ label, options, value, onChange, accent, format }: {
  label: string; options: readonly T[]; value: T; onChange: (v: T) => void; accent: string; format?: (v: T) => string;
}) {
  return (
    <div role="group" aria-label={label}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
        {/* Units stay in normal case so µV is not uppercased to MV. */}
        {label.includes('(') ? <>{label.slice(0, label.indexOf('('))}<span className="normal-case">{label.slice(label.indexOf('('))}</span></> : label}
      </div>
      <div className="inline-flex flex-wrap rounded-lg bg-slate-200/70 p-0.5 gap-0.5">
        {options.map(o => (
          <button key={String(o)} type="button" onClick={() => onChange(o)} aria-pressed={value === o}
            className="px-2.5 py-1 rounded-md text-[12px] font-semibold focus-visible:outline focus-visible:outline-2"
            style={{ background: value === o ? '#fff' : 'transparent', color: value === o ? '#0f172a' : '#64748b', boxShadow: value === o ? '0 1px 2px rgba(0,0,0,.08)' : 'none', outlineColor: accent }}>
            {format ? format(o) : String(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, on, onChange, accent }: { label: string; on: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border focus-visible:outline focus-visible:outline-2"
      style={{ background: on ? accent : '#fff', color: on ? '#fff' : '#334155', borderColor: on ? accent : '#e2e8f0', outlineColor: accent }}>
      <span aria-hidden className="inline-block w-2 h-2 rounded-full" style={{ background: on ? '#fff' : '#cbd5e1' }} />
      {label} {on ? 'on' : 'off'}
    </button>
  );
}

function PresetButtons({ ids, value, onChange, accent }: { ids: PresetId[]; value: PresetId; onChange: (id: PresetId) => void; accent: string }) {
  return (
    <div role="group" aria-label="Pattern">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Pattern</div>
      <div className="flex flex-wrap gap-1">
        {ids.map(id => (
          <button key={id} type="button" onClick={() => onChange(id)} aria-pressed={value === id}
            className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border focus-visible:outline focus-visible:outline-2"
            style={{ background: value === id ? accent : '#fff', color: value === id ? '#fff' : '#334155', borderColor: value === id ? accent : '#e2e8f0', outlineColor: accent }}>
            {presetById(id).label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Frame({ tag, blurb, accent, children }: { tag: string; blurb: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>{tag}</span>
        <span className="text-[12px] text-slate-500">{blurb}</span>
      </div>
      {children}
    </div>
  );
}

const fmtHz = (v: number) => `${v} Hz`;

export function TraceLab({ accent = '#2563eb' }: { accent?: string }) {
  const [presetId, setPresetId] = useState<PresetId>('normal-child');
  const [montage, setMontage] = useState<MontageId>('bipolar');
  const [sens, setSens] = useState<number>(presetById('normal-child').sensitivity);
  const [lff, setLff] = useState<number>(DEFAULT_FILTERS.lff);
  const [hff, setHff] = useState<number>(DEFAULT_FILTERS.hff);
  const [notchOn, setNotch] = useState(false);
  const [mains, setMains] = useState(false);
  const preset = presetById(presetId);
  const page = useMemo(() => renderPage(presetId, { montage, mains, filters: { lff, hff, notch: notchOn } }), [presetId, montage, mains, lff, hff, notchOn]);

  const choosePreset = (id: PresetId) => { setPresetId(id); setSens(presetById(id).sensitivity); };

  return (
    <Frame tag="Trace lab" blurb="A synthetic, schematic 10 s page. Change one setting at a time and watch what it does to the tracing." accent={accent}>
      <div className="grid gap-3 mb-3">
        <PresetButtons ids={PRESETS.map(p => p.id)} value={presetId} onChange={choosePreset} accent={accent} />
        <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
          <Segmented label="Montage" options={MONTAGES.map(m => m.id)} value={montage} onChange={setMontage} accent={accent}
            format={id => (id === 'bipolar' ? 'Bipolar' : 'Average')} />
          <Segmented label="Sensitivity (µV/mm)" options={SENSITIVITY_OPTIONS} value={sens as (typeof SENSITIVITY_OPTIONS)[number]} onChange={setSens} accent={accent} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
          <Segmented label="Low-frequency filter" options={LFF_OPTIONS} value={lff as (typeof LFF_OPTIONS)[number]} onChange={setLff} accent={accent} format={fmtHz} />
          <Segmented label="High-frequency filter" options={HFF_OPTIONS} value={hff as (typeof HFF_OPTIONS)[number]} onChange={setHff} accent={accent} format={fmtHz} />
          <Toggle label="60 Hz notch" on={notchOn} onChange={setNotch} accent={accent} />
          <Toggle label="Line noise at T4" on={mains} onChange={setMains} accent={accent} />
        </div>
      </div>

      <div className="text-[12.5px] font-semibold text-slate-700 mb-1.5">{preset.title} <span className="font-normal text-slate-400">(synthetic)</span></div>
      <TraceView page={page} sensitivity={sens} accent={accent} label={preset.title} />

      <p className="mt-3 text-[12.5px] text-slate-600 leading-snug">
        {preset.note}<Cite k={preset.sourceKey} />
      </p>
      <p className="mt-2 text-[12.5px] text-slate-600 leading-snug">
        On the slow spike-wave page, raise the low-frequency filter from 0.3 to 5 Hz and the slow waves shrink. On the centrotemporal page, measure a spike with the calipers, then lower the high-frequency filter to 15 Hz and measure it again.
      </p>
      <p className="mt-3 text-[11px] text-slate-400 leading-snug">
        Synthetic, schematic tracing built from a few model scalp fields with seeded noise. It is not a patient recording. Filters are a first-order high-pass, a second-order low-pass and a narrow 60 Hz notch.
      </p>
    </Frame>
  );
}

const SYNDROME_IDS = PRESETS.filter(p => p.syndrome).map(p => p.id);

export function PatternViewer({ accent = '#2563eb' }: { accent?: string }) {
  const [presetId, setPresetId] = useState<PresetId>(SYNDROME_IDS[0]);
  const [montage, setMontage] = useState<MontageId>('bipolar');
  const [sens, setSens] = useState<number>(presetById(SYNDROME_IDS[0]).sensitivity);
  const preset = presetById(presetId);
  // 0.5 Hz LFF: the ACNS pediatric guideline (Kuratani 2016) favors 0.3 to 0.6 Hz in young infants, and 0.5 Hz suits every age shown here.
  const page = useMemo(() => renderPage(presetId, { montage, filters: { lff: 0.5, hff: 70, notch: false } }), [presetId, montage]);
  const choosePreset = (id: PresetId) => { setPresetId(id); setSens(presetById(id).sensitivity); };

  return (
    <Frame tag="Pattern viewer" blurb="Synthetic, schematic pages of four syndrome patterns. Measure them with the calipers." accent={accent}>
      <div className="grid gap-3 mb-3">
        <PresetButtons ids={SYNDROME_IDS} value={presetId} onChange={choosePreset} accent={accent} />
        <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
          <Segmented label="Montage" options={MONTAGES.map(m => m.id)} value={montage} onChange={setMontage} accent={accent}
            format={id => (id === 'bipolar' ? 'Bipolar' : 'Average')} />
          <Segmented label="Sensitivity (µV/mm)" options={SENSITIVITY_OPTIONS} value={sens as (typeof SENSITIVITY_OPTIONS)[number]} onChange={setSens} accent={accent} />
        </div>
      </div>
      <div className="text-[12.5px] font-semibold text-slate-700 mb-1.5">{preset.title} <span className="font-normal text-slate-400">(synthetic)</span></div>
      <TraceView page={page} sensitivity={sens} accent={accent} label={preset.title} />
      <p className="mt-3 text-[12.5px] text-slate-600 leading-snug">
        {preset.note}<Cite k={preset.sourceKey} />
      </p>
      <p className="mt-3 text-[11px] text-slate-400 leading-snug">
        Synthetic, schematic tracing with filters at 0.5 and 70 Hz. It is not a patient recording, and real discharges vary more in shape, field and timing.
      </p>
    </Frame>
  );
}
