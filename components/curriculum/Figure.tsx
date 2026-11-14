'use client';

// A figure from the registry: image, caption, credit, and a tap-to-enlarge lightbox. EEG
// tracings are plain images on a light ground. Scans are shown on black at a limited width,
// and a figure with an overlay gets numbered pins and a key (AnnotatedImage).

import { useEffect, useState } from 'react';
import type { EegFigure } from '@/src/eeg/types';
import { AnnotatedImage, MarkKey } from './AnnotatedImage';

export function FigureCard({ fig, accent, compact = false }: { fig: EegFigure; accent: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const dark = fig.dark || !!fig.overlay;
  const attribution = fig.attribution ?? '/eeg/ATTRIBUTIONS.md';
  const picture = (large: boolean) => fig.overlay ? (
    <AnnotatedImage src={fig.file} overlay={fig.overlay} alt={fig.title} className={large ? 'rounded-lg' : ''} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fig.file} alt={fig.title} width={fig.width} height={fig.height} loading={large ? undefined : 'lazy'}
      className={`block w-full h-auto ${large ? `rounded-lg ${dark ? 'bg-black' : 'bg-white'}` : ''}`}
      style={!large && compact ? { maxHeight: 220, objectFit: 'cover', objectPosition: 'top' } : undefined} />
  );

  return (
    <>
      <figure className="rounded-2xl border border-slate-200 bg-white overflow-hidden m-0">
        <button onClick={() => setOpen(true)} className={`block w-full cursor-zoom-in ${dark ? 'bg-black' : 'bg-slate-50'}`} aria-label={`Enlarge: ${fig.title}`}>
          <span className="block mx-auto" style={dark ? { maxWidth: fig.maxWidth ?? 420 } : undefined}>{picture(false)}</span>
        </button>
        <figcaption className="px-4 py-3 text-[12.5px] leading-relaxed text-slate-600">
          {fig.overlay && !compact && <MarkKey overlay={fig.overlay} className="mb-2.5" />}
          <span className="font-semibold text-slate-800">{fig.title}.</span>{' '}
          {!compact && fig.caption.slice(fig.title.length).replace(/^[.\s]+/, '')}
          <div className="mt-1.5 text-[10.5px] text-slate-400">
            {fig.credit} · <a href={attribution} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accent }}>{fig.licence}</a> · tap to enlarge
          </div>
        </figcaption>
      </figure>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={fig.title} onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-3 cursor-zoom-out">
          <div className="w-full max-h-full overflow-auto mx-auto" style={{ maxWidth: dark ? Math.max(760, (fig.maxWidth ?? 420) * 1.8) : 1600 }}>
            {picture(true)}
            {fig.overlay && <MarkKey overlay={fig.overlay} tone="dark" className="mt-3" />}
            <p className="text-white/80 text-[12px] mt-2 leading-relaxed">{fig.caption} <span className="text-white/50">({fig.credit}, {fig.licence})</span></p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 text-white/80 text-[22px] w-10 h-10 rounded-full bg-black/40">×</button>
        </div>
      )}
    </>
  );
}

export function FigureStrip({ figs, accent, label = 'Tracings' }: { figs: EegFigure[]; accent: string; label?: string }) {
  if (!figs.length) return null;
  return (
    <div className="mt-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">{label}</p>
      <div className={figs.length > 1 ? 'nm-2col' : ''}>
        {figs.map(f => <FigureCard key={f.id} fig={f} accent={accent} />)}
      </div>
    </div>
  );
}
