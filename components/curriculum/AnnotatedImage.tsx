'use client';

// A real image with numbered pins, an optional outline and measurement lines drawn over it.
// The pins sit in a black margin around the picture so they never cover anatomy. Geometry:
// src/figureOverlay.ts. Used by the figure cards and by the neuroradiology widgets.

import { OVERLAY_PAD, PIN_R, pinFor, type FigureOverlay } from '@/src/figureOverlay';

const AMBER = '#ffb454';

export function AnnotatedImage({ src, overlay, alt, reveal = true, className = '' }: {
  src: string; overlay: FigureOverlay; alt: string;
  /** False hides the outline, lines and pins and leaves the bare image in the same frame. */
  reveal?: boolean; className?: string;
}) {
  const k = overlay.scale ?? 1, pad = OVERLAY_PAD * k, { w, h } = overlay;
  const letter = { fontSize: 10 * k, fontWeight: 700, fill: '#cbd5e1' } as const;
  return (
    <svg viewBox={`${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}`} role="img" aria-label={alt}
      className={`block w-full h-auto ${className}`} style={{ background: '#000' }}>
      <title>{alt}</title>
      <rect x={-pad} y={-pad} width={w + 2 * pad} height={h + 2 * pad} fill="#000" />
      <image href={src} x={0} y={0} width={w} height={h} preserveAspectRatio="none" />
      {overlay.orient !== false && (
        <g aria-hidden="true">
          <text x={-pad + 6 * k} y={-pad + 14 * k} {...letter}>R</text>
          <text x={w + pad - 6 * k} y={-pad + 14 * k} textAnchor="end" {...letter}>L</text>
        </g>
      )}
      {reveal && (
        <g>
          {overlay.outline && <path d={overlay.outline} fill="none" stroke={AMBER} strokeWidth={1.3 * k} strokeLinejoin="round" opacity={0.92} />}
          {(overlay.lines ?? []).map((l, i) => (
            <g key={i}>
              {l.dash
                ? <line x1={l.from[0]} y1={l.from[1]} x2={l.to[0]} y2={l.to[1]} stroke="#fff" strokeWidth={1 * k} strokeDasharray={`${5 * k} ${5 * k}`} opacity={0.82} />
                : <line x1={l.from[0]} y1={l.from[1]} x2={l.to[0]} y2={l.to[1]} stroke={AMBER} strokeWidth={1.4 * k} />}
              {l.label && l.labelAt && (
                <text x={l.labelAt[0]} y={l.labelAt[1]} fontSize={10.5 * k} fontWeight={700} fill={AMBER} dominantBaseline="central"
                  stroke="#000" strokeWidth={2.4 * k} strokeOpacity={0.55} paintOrder="stroke">{l.label}</text>
              )}
            </g>
          ))}
          {overlay.marks.map(m => { const p = pinFor(overlay, m); return (
            <g key={`l${m.n}`}>
              <line x1={p.x} y1={p.y} x2={m.at[0]} y2={m.at[1]} stroke="#000" strokeWidth={2.2 * k} opacity={0.6} />
              <line x1={p.x} y1={p.y} x2={m.at[0]} y2={m.at[1]} stroke="#fff" strokeWidth={0.9 * k} opacity={0.86} />
              <circle cx={m.at[0]} cy={m.at[1]} r={2.4 * k} fill="none" stroke="#fff" strokeWidth={0.9 * k} />
            </g>
          ); })}
          {overlay.marks.map(m => { const p = pinFor(overlay, m); return (
            <g key={`p${m.n}`}>
              <circle cx={p.x} cy={p.y} r={PIN_R * k} fill="rgb(12,14,18)" stroke="#fff" strokeWidth={1 * k} />
              <text x={p.x} y={p.y} fontSize={(m.n > 9 ? 9.2 : 10.5) * k} fontWeight={700} fill="#fff" textAnchor="middle" dominantBaseline="central">{m.n}</text>
            </g>
          ); })}
        </g>
      )}
    </svg>
  );
}

/** The numbered key for an overlay, as a compact two-column list. */
export function MarkKey({ overlay, tone = 'light', className = '' }: { overlay: FigureOverlay; tone?: 'light' | 'dark'; className?: string }) {
  if (!overlay.marks.length) return null;
  const dark = tone === 'dark';
  return (
    <ol className={`list-none m-0 p-0 grid gap-x-4 gap-y-1 ${overlay.marks.length > 3 ? 'grid-cols-2' : 'grid-cols-1'} ${className}`}>
      {overlay.marks.map(m => (
        <li key={m.n} className={`flex items-baseline gap-1.5 text-[12px] leading-snug ${dark ? 'text-white/85' : 'text-slate-700'}`}>
          <span className={`shrink-0 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold ${dark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`} style={{ transform: 'translateY(2px)' }}>{m.n}</span>
          <span>{m.label}</span>
        </li>
      ))}
    </ol>
  );
}
