'use client';

// Rule-of-4 brainstem simulator: choose a level, medial or lateral, and a side. The cross-
// section shows which of the four Ms and four Ss are hit; findings are split into same side
// and opposite side. Model: src/loc/models/brainstem.ts (Gates 2005, 2011).

import { useMemo, useState } from 'react';
import { brainstemLesion, type BsLevel, type BsSide, type Zone } from '@/src/loc/models/brainstem';
import { Label, Segmented, WidgetFrame } from './ui';

const MEDIAL = ['Motor pathway', 'Medial lemniscus', 'Medial longitudinal fasciculus', 'Motor nucleus (3, 6, 12)'];
const LATERAL = ['Spinocerebellar', 'Spinothalamic', 'Sensory nucleus of 5', 'Sympathetic'];

export function BrainstemSim({ accent }: { accent: string }) {
  const [level, setLevel] = useState<BsLevel>('medulla');
  const [zone, setZone] = useState<Zone>('lateral');
  const [side, setSide] = useState<BsSide>('L');
  const r = useMemo(() => brainstemLesion(level, zone, side), [level, zone, side]);
  const same = r.findings.filter(f => f.side === 'same');
  const opp = r.findings.filter(f => f.side === 'opposite');
  const sideName = side === 'L' ? 'left' : 'right';
  const other = side === 'L' ? 'right' : 'left';

  // Cross-section drawn as seen in a textbook section (patient's left on the viewer's right).
  const cx = 160, w = 200;
  const lesionX = zone === 'medial' ? (side === 'L' ? cx : cx - 60) : (side === 'L' ? cx + 60 : cx - 100);
  const hit = (s: string) => (zone === 'medial' ? MEDIAL : LATERAL).includes(s) && !(level === 'midbrain' && s === 'Sensory nucleus of 5');

  return (
    <WidgetFrame accent={accent} label="Rule of four" subtitle="The rule of four groups the brainstem into four medial structures beginning with M, four lateral ones beginning with S, and four cranial nerves at each level. Place a lesion to see what follows."
      footnote="A teaching heuristic (Gates 2005; Gates 2011), not a law. Its known exceptions are listed with each result.">
      <div className="flex flex-wrap gap-3 mb-3">
        <div><Label>Level</Label><Segmented accent={accent} value={level} onChange={setLevel} options={[{ id: 'midbrain', label: 'Midbrain' }, { id: 'pons', label: 'Pons' }, { id: 'medulla', label: 'Medulla' }]} /></div>
        <div><Label>Where in the section</Label><Segmented accent={accent} value={zone} onChange={setZone} options={[{ id: 'medial', label: 'Medial' }, { id: 'lateral', label: 'Lateral' }]} /></div>
        <div><Label>Side</Label><Segmented accent={accent} value={side} onChange={setSide} options={[{ id: 'L', label: 'Left' }, { id: 'R', label: 'Right' }]} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr] items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg viewBox="0 0 320 210" className="w-full block" role="img" aria-label={`${level} cross-section, ${zone} lesion on the ${sideName}`}>
            <ellipse cx={cx} cy="100" rx={w / 2} ry="80" fill="#f8fafc" stroke="#94a3b8" />
            <line x1={cx} y1="20" x2={cx} y2="180" stroke="#cbd5e1" strokeDasharray="3 3" />
            <rect x={lesionX} y="28" width={zone === 'medial' ? 60 : 40} height="144" rx="10" fill={accent + '30'} stroke={accent} strokeWidth="1.5" />
            {/* medial column: Ms (near midline), lateral: Ss; drawn on both sides */}
            {[-1, 1].map(dir => (
              <g key={dir}>
                {MEDIAL.map((m, k) => <circle key={m} cx={cx + dir * 22} cy={48 + k * 34} r="7" fill={hit(m) && ((dir === 1) === (side === 'L')) ? accent : '#fff'} stroke="#64748b" />)}
                {LATERAL.map((s, k) => <circle key={s} cx={cx + dir * 78} cy={48 + k * 34} r="7" fill={hit(s) && ((dir === 1) === (side === 'L')) ? accent : '#fff'} stroke="#64748b" />)}
              </g>
            ))}
            {MEDIAL.map((m, k) => <text key={m} x={cx + 33} y={51 + k * 34} fontSize="7.5" fill="#475569">M{k + 1}</text>)}
            {LATERAL.map((s, k) => <text key={s} x={cx + 89} y={51 + k * 34} fontSize="7.5" fill="#475569">S{k + 1}</text>)}
            <text x="16" y="200" fontSize="9" fill="#64748b">patient&apos;s right</text>
            <text x="246" y="200" fontSize="9" fill="#64748b">patient&apos;s left</text>
            <text x={cx} y="14" textAnchor="middle" fontSize="9" fill="#64748b">back (dorsal)</text>
          </svg>
          <ol className="grid grid-cols-2 gap-x-3 px-1 text-[10.5px] text-slate-500 leading-snug">
            <li>M1 {MEDIAL[0]}</li><li>S1 {LATERAL[0]}</li><li>M2 {MEDIAL[1]}</li><li>S2 {LATERAL[1]}</li>
            <li>M3 {MEDIAL[2]}</li><li>S3 {LATERAL[2]}</li><li>M4 {MEDIAL[3]}</li><li>S4 {LATERAL[3]}</li>
          </ol>
        </div>
        <div className="min-w-0">
          {r.syndrome && <p className="text-[14px] font-semibold text-slate-900 mb-2">{r.syndrome}</p>}
          <div className="nm-2col">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: accent }}>Same side ({sideName})</div>
              <ul className="space-y-1.5 text-[12.5px] text-slate-700 leading-snug">{same.map(f => <li key={f.structure}><b>{f.text}.</b> <span className="text-slate-400">{f.structure}</span></li>)}</ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: accent }}>Opposite side ({other})</div>
              <ul className="space-y-1.5 text-[12.5px] text-slate-700 leading-snug">{opp.map(f => <li key={f.structure}><b>{f.text}.</b> <span className="text-slate-400">{f.structure}</span></li>)}</ul>
            </div>
          </div>
          {r.notes.length > 0 && <div className="mt-2 space-y-1">{r.notes.map((n, k) => <p key={k} className="text-[11.5px] text-slate-500 leading-snug"><span className="font-semibold text-slate-600">Where the rule bends:</span> {n}</p>)}</div>}
        </div>
      </div>
    </WidgetFrame>
  );
}
