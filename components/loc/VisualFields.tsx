'use client';

// Visual pathway lesion board. Click a site on the pathway; both eyes' fields are computed by
// routing each quadrant through the pathway (src/loc/models/visual.ts).

import { useMemo, useState } from 'react';
import { fieldsFor, SITES, sparesMacula, type LesionSite } from '@/src/loc/models/visual';
import { WidgetFrame } from './ui';

function FieldDisc({ lost, macula, accent, label }: { lost: Record<string, boolean>; macula: boolean; accent: string; label: string }) {
  const r = 46, c = 52;
  // Quadrant paths in the patient's view: upper-left etc.
  const q = (v: 'upper' | 'lower', h: 'left' | 'right') => {
    const sx = h === 'left' ? -1 : 1, sy = v === 'upper' ? -1 : 1;
    return `M${c} ${c} L${c + sx * r} ${c} A${r} ${r} 0 0 ${sx * sy > 0 ? 1 : 0} ${c} ${c + sy * r} Z`;
  };
  return (
    <figure className="m-0 text-center">
      <svg viewBox="0 0 104 104" className="w-[104px] h-[104px] block mx-auto" role="img" aria-label={label}>
        {(['upper', 'lower'] as const).flatMap(v => (['left', 'right'] as const).map(h => (
          <path key={`${v}-${h}`} d={q(v, h)} fill={lost[`${v}-${h}`] ? '#1e293b' : '#fff'} stroke="#94a3b8" strokeWidth="0.8" />
        )))}
        {macula && <circle cx={c} cy={c} r="9" fill="#fff" stroke={accent} strokeWidth="1" />}
        <line x1={c} y1={c - r} x2={c} y2={c + r} stroke="#cbd5e1" strokeWidth="0.6" />
        <line x1={c - r} y1={c} x2={c + r} y2={c} stroke="#cbd5e1" strokeWidth="0.6" />
      </svg>
      <figcaption className="text-[11px] text-slate-500 mt-1">{label}</figcaption>
    </figure>
  );
}

// Pathway schematic, viewed from above (patient's left on the viewer's left, as in the fields).
const NODES: Record<LesionSite, { x: number; y: number }> = {
  'optic-nerve-L': { x: 92, y: 52 }, 'optic-nerve-R': { x: 228, y: 52 }, chiasm: { x: 160, y: 86 },
  'tract-L': { x: 122, y: 118 }, 'tract-R': { x: 198, y: 118 },
  'meyer-L': { x: 70, y: 168 }, 'meyer-R': { x: 250, y: 168 },
  'parietal-L': { x: 124, y: 178 }, 'parietal-R': { x: 196, y: 178 },
  'occipital-L': { x: 128, y: 232 }, 'occipital-R': { x: 192, y: 232 },
};

export function VisualFields({ accent }: { accent: string }) {
  const [site, setSite] = useState<LesionSite>('chiasm');
  const f = useMemo(() => fieldsFor(site), [site]);
  const info = SITES.find(s => s.id === site)!;
  const N = NODES;
  return (
    <WidgetFrame accent={accent} label="Visual pathway" subtitle="Tap a point on the pathway. Each eye's field is worked out by following its fibres: only nasal fibres cross at the chiasm."
      footnote="Fields are drawn as the patient sees them, left field on the left. Black is lost. Macular sparing in occipital lesions reflects the occipital pole's dual blood supply.">
      <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr] items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg viewBox="0 0 320 260" className="w-full block" role="img" aria-label="Visual pathway from the eyes to the occipital lobes">
            <g fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
              <path d={`M92 30 L${N.chiasm.x - 6} ${N.chiasm.y}`} /><path d={`M228 30 L${N.chiasm.x + 6} ${N.chiasm.y}`} />
              <path d={`M${N.chiasm.x - 6} ${N.chiasm.y} L120 140`} /><path d={`M${N.chiasm.x + 6} ${N.chiasm.y} L200 140`} />
              <path d="M120 140 C 50 150, 60 205, 126 236" /><path d="M200 140 C 270 150, 260 205, 194 236" />
              <path d="M120 140 L126 236" /><path d="M200 140 L194 236" />
            </g>
            <circle cx="92" cy="22" r="12" fill="#f8fafc" stroke="#64748b" /><circle cx="228" cy="22" r="12" fill="#f8fafc" stroke="#64748b" />
            <text x="66" y="26" fontSize="9" fill="#64748b" textAnchor="end">left eye</text>
            <text x="254" y="26" fontSize="9" fill="#64748b">right eye</text>
            <text x="60" y="208" fontSize="8" fill="#94a3b8" textAnchor="middle">Meyer&apos;s</text>
            <text x="60" y="217" fontSize="8" fill="#94a3b8" textAnchor="middle">loop</text>
            <text x="160" y="255" fontSize="8.5" fill="#94a3b8" textAnchor="middle">occipital cortex</text>
            {(Object.keys(NODES) as LesionSite[]).map(id => (
              <g key={id} onClick={() => setSite(id)} style={{ cursor: 'pointer' }} role="button" aria-label={SITES.find(s => s.id === id)!.name} aria-pressed={site === id}>
                <circle cx={NODES[id].x} cy={NODES[id].y} r="13" fill="transparent" />
                <circle cx={NODES[id].x} cy={NODES[id].y} r="7" fill={site === id ? accent : '#fff'} stroke={accent} strokeWidth="2" />
              </g>
            ))}
          </svg>
          <p className="text-[10.5px] text-slate-400 px-1">Seen from above, patient&apos;s left on the left.</p>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {SITES.map(s => (
              <button key={s.id} onClick={() => setSite(s.id)} aria-pressed={site === s.id}
                className="rounded-lg border px-2 py-1 text-[11.5px] font-medium"
                style={{ background: site === s.id ? accent : '#fff', color: site === s.id ? '#fff' : '#334155', borderColor: site === s.id ? accent : '#e2e8f0' }}>{s.name}</button>
            ))}
          </div>
          <div className="flex gap-6 justify-center rounded-xl border border-slate-200 bg-white py-3">
            <FieldDisc lost={f.L} macula={sparesMacula(site)} accent={accent} label="Left eye" />
            <FieldDisc lost={f.R} macula={sparesMacula(site)} accent={accent} label="Right eye" />
          </div>
          <p className="mt-2 text-[13px] text-slate-800"><b>{info.name}:</b> {info.defect}.</p>
        </div>
      </div>
    </WidgetFrame>
  );
}
