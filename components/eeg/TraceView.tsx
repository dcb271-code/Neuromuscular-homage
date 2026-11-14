'use client';

// Reusable EEG page renderer. Draws one 10 s page of channels from src/eeg/synth.ts (or any
// Page with the same shape) at a 30 mm/s equivalent time base, with a time scale bar, a
// voltage scale bar for the chosen sensitivity, and optional calipers. Negative is drawn up.
//
// Geometry is in "figure millimeters": the 10 s page is 300 mm wide, and sensitivity (µV/mm)
// maps voltage to the same millimeters, so the scale bars are always self-consistent. On a
// narrow screen the page keeps a minimum width and scrolls horizontally.

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { Page } from '@/src/eeg/synth';
import { peakToPeak } from '@/src/eeg/synth';

const PX = 3;                  // viewBox units per figure millimeter
const MM_PER_S = 30;           // time base
const LABEL_W = 64;            // channel label column
const RIGHT = 10;
const TOP = 20;                // second labels
const ROW_MM = 9;              // channel spacing
const GROUP_GAP = 6;           // extra space between chains
const BOTTOM = 52;             // scale bars

export interface TraceViewProps {
  page: Page;
  sensitivity: number;         // µV/mm
  accent?: string;
  calipers?: boolean;
  /** Short description for screen readers, e.g. the preset title. */
  label?: string;
  /** Minimum rendered width in CSS px before the page scrolls horizontally. */
  minWidth?: number;
}

interface Pt { ch: number; t: number }

function scaleBarMicrovolts(sens: number): number {
  const choices = [20, 50, 100, 200, 500];
  return choices.reduce((best, v) => (Math.abs(v / sens - 10) < Math.abs(best / sens - 10) ? v : best), choices[0]);
}

export function TraceView({ page, sensitivity, accent = '#2563eb', calipers = true, label = 'EEG page', minWidth = 720 }: TraceViewProps) {
  const traceW = page.seconds * MM_PER_S * PX;
  const W = LABEL_W + traceW + RIGHT;
  const n = page.channels.length;

  // Row baselines, with a small gap at the start of each chain.
  const rowY = useMemo(() => {
    let y = TOP + (ROW_MM * PX) / 2, out: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i > 0 && page.groupStarts.includes(i)) y += GROUP_GAP;
      out.push(y);
      y += ROW_MM * PX;
    }
    return out;
  }, [n, page.groupStarts]);
  const traceBottom = rowY[n - 1] + (ROW_MM * PX) / 2;
  const H = traceBottom + BOTTOM;

  const xOf = useCallback((t: number) => LABEL_W + (t / page.seconds) * traceW, [page.seconds, traceW]);
  const yScale = PX / sensitivity; // units per µV. Positive µV draws down (negative up).

  const paths = useMemo(() => page.channels.map((c, i) => {
    const step = traceW / c.data.length, y0 = rowY[i];
    let d = '';
    for (let k = 0; k < c.data.length; k++) d += `${k ? 'L' : 'M'}${(LABEL_W + k * step).toFixed(1)} ${(y0 + c.data[k] * yScale).toFixed(1)}`;
    return d;
  }), [page, rowY, traceW, yScale]);

  // ── Calipers
  const [pts, setPts] = useState<Pt[]>([]);
  const [cursor, setCursor] = useState<Pt | null>(null);
  const [focused, setFocused] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const snap = (t: number) => Math.max(0, Math.min(page.seconds - 1 / page.fs, Math.round(t * page.fs) / page.fs));
  const place = useCallback((p: Pt) => {
    setPts(prev => {
      if (prev.length === 1) return [prev[0], { ch: prev[0].ch, t: p.t }]; // second point measures on the first channel
      return [p];
    });
  }, []);

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!calipers || !svgRef.current) return;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    if (p.x < LABEL_W || p.x > LABEL_W + traceW || p.y < TOP - 4 || p.y > traceBottom + 4) return;
    let ch = 0;
    rowY.forEach((y, i) => { if (Math.abs(y - p.y) < Math.abs(rowY[ch] - p.y)) ch = i; });
    const t = snap(((p.x - LABEL_W) / traceW) * page.seconds);
    place({ ch, t });
    setCursor({ ch, t });
  };

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!calipers) return;
    const c = cursor ?? { ch: 0, t: page.seconds / 2 };
    let next: Pt | null = null;
    const dt = e.shiftKey ? 0.1 : 0.01;
    if (e.key === 'ArrowLeft') next = { ch: c.ch, t: snap(c.t - dt) };
    else if (e.key === 'ArrowRight') next = { ch: c.ch, t: snap(c.t + dt) };
    else if (e.key === 'ArrowUp') next = { ch: Math.max(0, c.ch - 1), t: c.t };
    else if (e.key === 'ArrowDown') next = { ch: Math.min(n - 1, c.ch + 1), t: c.t };
    else if (e.key === 'Enter' || e.key === ' ') { place(c); e.preventDefault(); return; }
    else if (e.key === 'Escape') { setPts([]); return; }
    if (next) { setCursor(next); e.preventDefault(); }
  };

  const measured = useMemo(() => {
    if (pts.length < 2) return null;
    const [a, b] = pts[0].t <= pts[1].t ? [pts[0], pts[1]] : [pts[1], pts[0]];
    const c = page.channels[a.ch];
    if (!c) return null;
    const ms = (b.t - a.t) * 1000;
    const n0 = Math.round(a.t * page.fs), n1 = Math.round(b.t * page.fs) + 1;
    return { ch: a.ch, label: c.label, t0: a.t, t1: b.t, ms, hz: ms > 0 ? 1000 / ms : null, pp: peakToPeak(c.data, n0, n1) };
  }, [pts, page]);

  const barUV = scaleBarMicrovolts(sensitivity);
  const valueAt = (p: Pt) => page.channels[p.ch]?.data[Math.round(p.t * page.fs)] ?? 0;
  const capCh = pts[0]?.ch;
  const clipId = `tv-clip-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ minWidth, cursor: calipers ? 'crosshair' : 'default', ['--tw-ring-color' as string]: accent }}
          role="group" tabIndex={calipers ? 0 : -1}
          aria-label={`${label}. Synthetic schematic tracing, ${page.channels.length} channels, ${page.seconds} seconds, ${sensitivity} microvolts per millimeter, negative up.${calipers ? ' To use the calipers with a keyboard, move the cursor with the arrow keys, press Enter to place a point, and Escape to clear.' : ''}`}
          onClick={onClick} onKeyDown={onKeyDown} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <defs>
            <clipPath id={clipId}><rect x={LABEL_W} y={0} width={traceW} height={traceBottom + 6} /></clipPath>
          </defs>

          {/* One-second grid with labels */}
          {Array.from({ length: page.seconds + 1 }, (_, s) => (
            <g key={s}>
              <line x1={xOf(s)} x2={xOf(s)} y1={TOP - 4} y2={traceBottom} stroke={s % 5 === 0 ? '#cbd5e1' : '#e2e8f0'} strokeWidth="1" />
              <text x={xOf(s)} y={TOP - 8} textAnchor="middle" fontSize="11" fill="#94a3b8">{s} s</text>
            </g>
          ))}

          {/* Caliper band behind the traces */}
          {measured && (
            <rect x={xOf(measured.t0)} width={Math.max(1, xOf(measured.t1) - xOf(measured.t0))}
              y={rowY[measured.ch] - (ROW_MM * PX) / 2} height={ROW_MM * PX} fill={accent} fillOpacity="0.1" />
          )}

          {/* Channels */}
          {page.channels.map((c, i) => (
            <g key={c.label}>
              <text x={LABEL_W - 6} y={rowY[i] + 4} textAnchor="end" fontSize="12" fontFamily="ui-monospace, monospace"
                fill={capCh === i ? accent : '#475569'} fontWeight={capCh === i ? 700 : 400}>{c.label}</text>
              <path d={paths[i]} fill="none" stroke={capCh === i ? accent : '#1e293b'} strokeWidth="1" strokeLinejoin="round" clipPath={`url(#${clipId})`} />
            </g>
          ))}

          {/* Caliper lines and points */}
          {pts.map((p, k) => (
            <g key={k} pointerEvents="none">
              <line x1={xOf(p.t)} x2={xOf(p.t)} y1={TOP - 4} y2={traceBottom} stroke={accent} strokeWidth="1.2" strokeDasharray="4 3" />
              <circle cx={xOf(p.t)} cy={rowY[p.ch] + valueAt(p) * yScale} r="4" fill="#fff" stroke={accent} strokeWidth="2" />
              <text x={xOf(p.t) + 4} y={traceBottom - 4} fontSize="11" fontWeight="700" fill={accent}>{k === 0 ? 'A' : 'B'}</text>
            </g>
          ))}

          {/* Keyboard cursor */}
          {focused && cursor && (
            <g pointerEvents="none">
              <line x1={xOf(cursor.t)} x2={xOf(cursor.t)} y1={rowY[cursor.ch] - (ROW_MM * PX) / 2} y2={rowY[cursor.ch] + (ROW_MM * PX) / 2} stroke="#0f172a" strokeWidth="1.5" />
              <rect x={LABEL_W - 62} y={rowY[cursor.ch] - 9} width={60} height={18} fill="none" stroke="#0f172a" strokeWidth="1" rx="3" />
            </g>
          )}

          {/* Scale bars and conventions */}
          {(() => {
            const y = traceBottom + 32, x0 = LABEL_W + 8;
            const hBar = MM_PER_S * PX, vBar = (barUV / sensitivity) * PX;
            return (
              <g fontSize="12" fill="#334155">
                <line x1={x0} x2={x0 + hBar} y1={y} y2={y} stroke="#0f172a" strokeWidth="2" />
                <text x={x0 + hBar / 2} y={y + 15} textAnchor="middle">1 s</text>
                <line x1={x0 + hBar + 16} x2={x0 + hBar + 16} y1={y} y2={y - vBar} stroke="#0f172a" strokeWidth="2" />
                <text x={x0 + hBar + 22} y={y - vBar / 2 + 4}>{barUV} µV</text>
                <text x={x0 + hBar + 90} y={y - 2}>Negative up. 30 mm/s, {sensitivity} µV/mm.</text>
                <text x={W - RIGHT} y={y - 2} textAnchor="end" fill="#94a3b8">Synthetic schematic tracing</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {calipers && (
        <div className="mt-2 flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-[220px] text-[12.5px] text-slate-700 leading-snug" aria-live="polite">
            {pts.length === 0 && <>Tap or click two points on one channel to measure the interval and the amplitude between them.</>}
            {pts.length === 1 && <>Point A at {pts[0].t.toFixed(2)} s on <span className="font-mono">{page.channels[pts[0].ch]?.label}</span>. Tap a second point.</>}
            {measured && (
              <dl className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Interval</dt>
                  <dd className="font-semibold tabular-nums">{Math.round(measured.ms)} ms</dd>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Frequency</dt>
                  <dd className="font-semibold tabular-nums">{measured.hz ? `${measured.hz.toFixed(1)} Hz` : 'n/a'}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Peak to peak</dt>
                  <dd className="font-semibold tabular-nums">{Math.round(measured.pp)} µV</dd>
                </div>
                <div className="col-span-3 text-[11.5px] text-slate-500">
                  On <span className="font-mono">{measured.label}</span>, {measured.t0.toFixed(2)} to {measured.t1.toFixed(2)} s.
                </div>
              </dl>
            )}
          </div>
          <button type="button" onClick={() => setPts([])} disabled={pts.length === 0}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-slate-200 bg-white text-slate-700 disabled:opacity-40 focus-visible:outline focus-visible:outline-2"
            style={{ outlineColor: accent }}>
            Clear calipers
          </button>
        </div>
      )}
    </div>
  );
}
