'use client';

// The module path as an SVG: foundations first, then the neonatal and abnormal-EEG tracks,
// ending in critical care, with Module 12 running alongside. Boxes fill as modules complete.

import type { EegModule } from '@/src/eeg/types';
import { moduleProgress, type EegStore } from '@/src/eeg/progress';

const W = 208, H = 44;

export function CurriculumMap({ modules, store }: { modules: EegModule[]; store: EegStore }) {
  const by = (n: number) => modules.find(m => m.number === n);
  const cA = 140, cB = 380, cC = 620, c4 = 260, c5 = 500;
  const yA = 70, yB = 150, yC = 240, yD = 320, yE = 410;
  const pos: Record<number, [number, number]> = { 1: [cA, yA], 2: [cB, yA], 3: [cC, yA], 4: [c4, yB], 5: [c5, yB], 6: [cA, yC], 7: [cA, yD], 8: [cB, yC], 9: [cC, yC], 10: [cC, yD], 11: [cB, yE] };
  const edges: [number, number][] = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 8], [6, 7], [8, 9], [9, 10], [7, 11], [10, 11]];
  const edge = '#cbd5e1';

  const path = (a: number, b: number) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    if (y1 === y2) return `M${x1 + W / 2} ${y1}H${x2 - W / 2}`;
    if (x1 === x2) return `M${x1} ${y1 + H / 2}V${y2 - H / 2}`;
    const ym = (y1 + y2) / 2 + (y1 < y2 ? 0 : 0);
    return `M${x1} ${y1 + H / 2}V${ym}H${x2}V${y2 - H / 2}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <svg viewBox="0 0 760 470" className="w-full block" role="img" aria-label="Foundations first, then a neonatal and an abnormal-EEG track, ending in critical care">
        <defs><marker id="eeg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={edge} /></marker></defs>
        <rect x="12" y="12" width="736" height="446" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="26" y="34" fontSize="12" fontWeight="600" fill="#475569">Module 12 runs alongside all of it: pre-read real studies from week one</text>
        <g fill="none" stroke={edge} strokeWidth="1.5">
          {edges.map(([a, b]) => <path key={`${a}-${b}`} d={path(a, b)} markerEnd="url(#eeg-arrow)" />)}
        </g>
        {Object.entries(pos).map(([n, [x, y]]) => {
          const m = by(Number(n)); if (!m) return null;
          const pct = moduleProgress(store, m.id, m.sections.length);
          const done = !!store.quiz[m.id];
          return (
            <a key={n} href={`/eeg/${m.id}/`}>
              <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx="8" fill="#fff" stroke={m.color} strokeWidth={done ? 2.5 : 1.5} />
              {pct > 0 && <rect x={x - W / 2} y={y + H / 2 - 4} width={W * Math.min(pct, 1)} height="4" fill={m.color} opacity="0.8" />}
              <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0f172a">
                <tspan fill={m.color} fontFamily="ui-monospace, monospace">{String(m.number).padStart(2, '0')}</tspan> · {m.short}
              </text>
            </a>
          );
        })}
        <text x={cA} y={yE + 4} textAnchor="middle" fontSize="11" fill="#64748b">neonatal track</text>
        <text x={cC} y={yE + 4} textAnchor="middle" fontSize="11" fill="#64748b">abnormal-EEG track</text>
      </svg>
    </div>
  );
}
