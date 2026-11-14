'use client';

// Guided step-through on a licensed tracing. Each step outlines regions of the real image and
// says what to look at. Overlays are positioned in percentages, so they scale with the image.
// On a phone, "Zoom" doubles the image width inside a scroll box and centers the current step.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { EegFigure } from '@/src/eeg/types';
import { KIND_NAME, stepFocus, type FigureTour as Tour, type TourRegion } from '@/src/eeg/annotations';

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/** Small glyph that repeats the region's shape next to its text, so shape and text both carry it. */
function KindGlyph({ kind, color }: { kind: TourRegion['kind']; color: string }) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" aria-hidden="true" className="inline-block shrink-0">
      {kind === 'box' && <rect x="1" y="1" width="10" height="8" fill="none" stroke={color} strokeWidth="1.6" />}
      {kind === 'rows' && <><line x1="0" x2="12" y1="2" y2="2" stroke={color} strokeWidth="1.4" strokeDasharray="2 1.5" /><line x1="0" x2="12" y1="8" y2="8" stroke={color} strokeWidth="1.4" strokeDasharray="2 1.5" /></>}
      {kind === 'time' && <><rect x="3" y="0" width="6" height="10" fill={color} opacity="0.25" /><line x1="3" x2="3" y1="0" y2="10" stroke={color} strokeWidth="1.4" /><line x1="9" x2="9" y1="0" y2="10" stroke={color} strokeWidth="1.4" /></>}
    </svg>
  );
}

function Region({ r, n, accent }: { r: TourRegion; n: number; accent: string }) {
  const box: React.CSSProperties = { position: 'absolute', left: pct(r.x), top: pct(r.y), width: pct(r.width), height: pct(r.height), pointerEvents: 'none' };
  const shape: React.CSSProperties =
    r.kind === 'box' ? { ...box, border: `2.5px solid ${accent}`, borderRadius: 4, boxShadow: '0 0 0 1.5px #fff' }
      : r.kind === 'rows' ? { ...box, borderTop: `2px dashed ${accent}`, borderBottom: `2px dashed ${accent}`, background: accent + '14' }
        : { ...box, borderLeft: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, background: accent + '22' };
  // Label placement: time windows label at their top; rows label above their right end;
  // boxes label above their left corner, or inside when they sit at the top edge.
  // Channel rows label at their left end, next to the channel names. Other regions in the right
  // part of the image anchor their label to the right edge so it stays on the image.
  const atTop = r.y < 0.06;
  const right = r.kind !== 'rows' && r.x + r.width / 2 > 0.6;
  const left = pct(right ? r.x + r.width : r.x);
  const dx = right ? '-100%' : '0px';
  const dy = r.kind === 'time' || atTop ? '2px' : 'calc(-100% - 2px)';
  // Row labels sit inside their band, vertically centered, so each label is on its own row.
  const label: React.CSSProperties = r.kind === 'rows'
    ? { position: 'absolute', left: `calc(${pct(r.x)} + 4px)`, top: pct(r.y + r.height / 2), transform: 'translateY(-50%)' }
    : { position: 'absolute', left, top: pct(r.y), transform: `translate(${dx}, ${dy})` };
  return (
    <>
      <div style={shape} />
      <div style={{ ...label, pointerEvents: 'none', borderColor: accent }}
        className="whitespace-nowrap rounded-md border bg-white/95 px-1.5 py-[1px] text-[11px] leading-[16px] font-semibold text-slate-800 shadow-sm flex items-center gap-1">
        <span className="font-mono text-[10px]" style={{ color: accent }}>{n}</span>
        <KindGlyph kind={r.kind} color={accent} />
        {r.label}
      </div>
    </>
  );
}

export function FigureTour({ fig, tour, accent = '#2563eb' }: { fig: EegFigure; tour: Tour; accent?: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const step = tour.steps[i];
  const last = tour.steps.length - 1;
  const go = (d: number) => setI(v => Math.max(0, Math.min(last, v + d)));

  useEffect(() => { setI(0); }, [tour.figureId]);

  // Keyboard: left and right arrows step, unless focus is in a text field or select.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last]);

  // When zoomed, bring the current step's regions into view.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !zoom) return;
    const f = stepFocus(step);
    const inner = el.scrollWidth;
    // Channel rows span the page, so show their start, where the channel names are.
    const rowsOnly = step.regions.length > 0 && step.regions.every(r => r.kind === 'rows');
    const target = f && !rowsOnly ? f.x * inner - el.clientWidth / 2 : 0;
    el.scrollTo({ left: Math.max(0, Math.min(inner - el.clientWidth, target)), behavior: 'smooth' });
  }, [i, zoom, step]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>Guided</span>
        <span className="text-[13px] font-semibold text-slate-800 leading-snug">{fig.title}</span>
      </div>

      <div ref={scroller} className="overflow-x-auto overscroll-x-contain bg-slate-50 border-y border-slate-100" style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
        <div className="relative" style={{ width: zoom ? '200%' : '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fig.file} alt={`${fig.title}. Step ${i + 1} highlights ${step.regions.map(r => r.label).join(', ') || 'no region'}.`}
            width={fig.width} height={fig.height} className="block w-full h-auto select-none" draggable={false} />
          {step.regions.map((r, k) => <Region key={`${i}-${k}`} r={r} n={k + 1} accent={accent} />)}
        </div>
      </div>
      <div className="px-4 pt-1.5 text-[10.5px] text-slate-400 leading-snug">
        {fig.credit} · <a href="/eeg/ATTRIBUTIONS.md" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accent }}>{fig.licence}</a>
      </div>

      <div className="px-4 pt-3 pb-3">
        <p className="text-[14px] text-slate-700 leading-relaxed min-h-[66px]" aria-live="polite">{step.caption}</p>
        {step.regions.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-slate-500 list-none p-0" aria-label="Highlighted on the tracing">
            {step.regions.map((r, k) => (
              <li key={k} className="flex items-center gap-1">
                <span className="font-mono text-[10px]" style={{ color: accent }}>{k + 1}</span>
                <KindGlyph kind={r.kind} color={accent} />
                <span><span className="text-slate-700 font-semibold">{r.label}</span> ({KIND_NAME[r.kind]})</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => go(-1)} disabled={i === 0} aria-label="Previous step"
            className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border border-slate-200 bg-white text-slate-700 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: accent }}>Back</button>
          <button onClick={() => go(1)} disabled={i === last} aria-label="Next step"
            className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: accent, borderColor: accent, outlineColor: accent }}>Next</button>
          <span className="text-[12px] text-slate-500 tabular-nums" aria-live="polite">Step {i + 1} of {tour.steps.length}</span>
          <button onClick={() => setZoom(z => !z)} aria-pressed={zoom}
            className="ml-auto px-2.5 py-2 rounded-lg text-[12px] font-semibold border border-slate-200 bg-white text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: accent }}>{zoom ? 'Fit width' : 'Zoom'}</button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Arrow keys also step. When zoomed, drag the tracing sideways to pan.</p>
      </div>
    </div>
  );
}
