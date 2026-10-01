'use client';

// A tracing from the figure registry: image, caption, credit, and a tap-to-enlarge lightbox.

import { useEffect, useState } from 'react';
import type { EegFigure } from '@/src/eeg/types';

export function FigureCard({ fig, accent, compact = false }: { fig: EegFigure; accent: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <figure className="rounded-2xl border border-slate-200 bg-white overflow-hidden m-0">
        <button onClick={() => setOpen(true)} className="block w-full bg-slate-50 cursor-zoom-in" aria-label={`Enlarge: ${fig.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fig.file} alt={fig.title} width={fig.width} height={fig.height} loading="lazy"
            className="block w-full h-auto" style={compact ? { maxHeight: 220, objectFit: 'cover', objectPosition: 'top' } : undefined} />
        </button>
        <figcaption className="px-4 py-3 text-[12.5px] leading-relaxed text-slate-600">
          <span className="font-semibold text-slate-800">{fig.title}.</span>{' '}
          {!compact && fig.caption.slice(fig.title.length).replace(/^[.\s]+/, '')}
          <div className="mt-1.5 text-[10.5px] text-slate-400">
            {fig.credit} · <a href="/eeg/ATTRIBUTIONS.md" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accent }}>{fig.licence}</a> · tap to enlarge
          </div>
        </figcaption>
      </figure>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={fig.title} onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-3 cursor-zoom-out">
          <div className="max-w-[1600px] w-full max-h-full overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fig.file} alt={fig.title} className="block w-full h-auto rounded-lg bg-white" />
            <p className="text-white/80 text-[12px] mt-2 leading-relaxed">{fig.caption} <span className="text-white/50">({fig.credit}, {fig.licence})</span></p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 text-white/80 text-[22px] w-10 h-10 rounded-full bg-black/40">×</button>
        </div>
      )}
    </>
  );
}

export function FigureStrip({ figs, accent }: { figs: EegFigure[]; accent: string }) {
  if (!figs.length) return null;
  return (
    <div className="mt-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Tracings</p>
      <div className={figs.length > 1 ? 'nm-2col' : ''}>
        {figs.map(f => <FigureCard key={f.id} fig={f} accent={accent} />)}
      </div>
    </div>
  );
}
