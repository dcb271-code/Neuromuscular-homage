'use client';

// Computed figure for Module 1: move a source along the Fp1–O1 chain and watch the same scalp
// potentials rendered as referential and bipolar channels. "Compute, don't draw."

import { useMemo, useState } from 'react';
import { CHAIN, computeMontages, transientShape, type SourceSpec } from '@/src/eeg/montage-model';

const W = 320, ROW = 36, PAD_L = 62, PAD_T = 14;
const SHAPE = transientShape(64);

function Trace({ value, y, scale, accent }: { value: number; y: number; scale: number; accent: string }) {
  // Negative up: a negative channel value draws upward.
  const pts = SHAPE.map((s, i) => `${PAD_L + 8 + (i / (SHAPE.length - 1)) * (W - PAD_L - 16)},${y + value * scale * s}`).join(' ');
  return (
    <g>
      <line x1={PAD_L} x2={W - 6} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
      <polyline points={pts} fill="none" stroke={Math.abs(value) < 0.5 ? '#94a3b8' : accent} strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
}

function Panel({ title, channels, accent, note }: {
  title: string; channels: { label: string; value: number }[]; accent: string; note: React.ReactNode;
}) {
  const H = PAD_T + channels.length * ROW + 6;
  const maxAbs = Math.max(...channels.map(c => Math.abs(c.value)), 1);
  const scale = (ROW * 0.42) / maxAbs; // px per microvolt, so the largest channel fills its row
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" role="img" aria-label={`${title} channels`}>
        {channels.map((c, i) => {
          const y = PAD_T + i * ROW + ROW / 2;
          return (
            <g key={c.label}>
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="10.5" fontFamily="ui-monospace, monospace" fill="#475569">{c.label}</text>
              <Trace value={c.value} y={y} scale={scale} accent={accent} />
            </g>
          );
        })}
      </svg>
      <div className="px-3 py-2 border-t border-slate-100 text-[12px] text-slate-600 leading-snug min-h-[40px]">{note}</div>
    </div>
  );
}

export function MontageLab({ accent = '#2563eb' }: { accent?: string }) {
  const [position, setPosition] = useState(2);
  const [polarity, setPolarity] = useState<-1 | 1>(-1);
  const [spread, setSpread] = useState(0.8);
  const src: SourceSpec = useMemo(() => ({ position, polarity, spread }), [position, polarity, spread]);
  const r = useMemo(() => computeMontages(src), [src]);

  const bipolarNote = r.reversal
    ? <><b>{r.reversal.kind === 'negative' ? 'Negative' : 'Positive'} phase reversal at {CHAIN[r.reversal.at]}.</b> The two channels that share {CHAIN[r.reversal.at]} point {r.reversal.kind === 'negative' ? 'toward' : 'away from'} each other.</>
    : r.endOfChain
      ? <><b>No phase reversal.</b> The maximum is at {CHAIN[r.maxElectrode]}, the end of the chain, so there is no second channel to reverse against. Only the last channel shows it.</>
      : <>No reversal found.</>;
  const refNote = <><b>Largest amplitude at {CHAIN[r.maxElectrode]}</b> ({Math.round(Math.abs(r.potentials[r.maxElectrode]))} µV, {polarity < 0 ? 'negative, drawn up' : 'positive, drawn down'}). Amplitude, not reversal, does the localizing here.</>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>Montage lab</span>
        <span className="text-[12px] text-slate-500">One source, two montages, the same potentials. Move it and watch which channels change.</span>
      </div>

      <div className="grid gap-3 mb-3 sm:grid-cols-[auto_auto_1fr] sm:items-end">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Source at</div>
          <div className="flex gap-1">
            {CHAIN.map((e, i) => (
              <button key={e} onClick={() => setPosition(i)}
                className="px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border font-mono"
                style={{ background: position === i ? accent : '#fff', color: position === i ? '#fff' : '#334155', borderColor: position === i ? accent : '#e2e8f0' }}>{e}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Polarity</div>
          <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 gap-0.5">
            {([-1, 1] as const).map(p => (
              <button key={p} onClick={() => setPolarity(p)} className="px-2.5 py-1 rounded-md text-[12px] font-semibold"
                style={{ background: polarity === p ? '#fff' : 'transparent', color: polarity === p ? '#0f172a' : '#64748b', boxShadow: polarity === p ? '0 1px 2px rgba(0,0,0,.08)' : 'none' }}>
                {p < 0 ? 'Negative' : 'Positive'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Field width: {spread < 0.6 ? 'tight' : spread < 1.1 ? 'moderate' : 'broad'}</div>
          <input type="range" min={0.35} max={1.8} step={0.05} value={spread} onChange={e => setSpread(Number(e.target.value))}
            className="w-full" style={{ accentColor: accent }} aria-label="Field width" />
        </div>
      </div>

      <div className="nm-2col">
        <Panel title="Referential (each electrode minus a quiet reference)" channels={r.referential} accent={accent} note={refNote} />
        <Panel title="Longitudinal bipolar (each electrode minus the next)" channels={r.bipolar} accent={accent} note={bipolarNote} />
      </div>
      <p className="mt-3 text-[11px] text-slate-400 leading-snug">
        Illustrative model: a single Gaussian field on one chain with a perfectly quiet reference. Real references are never perfectly quiet (see the next section), and real fields are three-dimensional, which is why a transverse chain is the second check.
      </p>
    </div>
  );
}
