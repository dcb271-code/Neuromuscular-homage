'use client';

// Exam video clips for a module section. Each card shows a locally stored poster; Utah's Kaltura
// player loads only after the reader presses play, so no third-party content loads on page view.

import { useState } from 'react';
import { VIDEO_BY_ID, kalturaEmbedUrl, posterUrl, utahPageUrl, type ExamVideo } from '@/src/loc/videos';

function Clip({ v, accent }: { v: ExamVideo; accent: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="rounded-xl border border-slate-200 bg-white overflow-hidden m-0">
      <div className="relative w-full bg-slate-900" style={{ aspectRatio: '4 / 3' }}>
        {playing ? (
          <iframe src={`${kalturaEmbedUrl(v)}&flashvars[autoPlay]=true`} title={v.title} className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen; encrypted-media" allowFullScreen />
        ) : (
          <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full group" aria-label={`Play video: ${v.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterUrl(v)} alt="" loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: accent }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
            {!v.sound && <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-black/60 text-white">no sound</span>}
          </button>
        )}
      </div>
      <figcaption className="px-3 py-2.5">
        <div className="text-[13px] font-semibold text-slate-900 leading-snug">{v.title}</div>
        <p className="text-[12.5px] text-slate-600 leading-snug mt-0.5">{v.caption}</p>
        <p className="text-[10.5px] text-slate-400 leading-snug mt-1.5">
          {v.site === 'pediatric' ? 'Pediatric' : ''} NeuroLogic Exam, Larsen &amp; Stensaas{v.courtesy ? `; courtesy of ${v.courtesy}` : ''}. CC BY-NC-SA.{' '}
          <a href={utahPageUrl(v)} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: accent }}>Source</a>{' · '}
          <a href="/credits/" className="underline" style={{ color: accent }}>Credits</a>
        </p>
      </figcaption>
    </figure>
  );
}

export function ExamVideos({ ids, accent }: { ids: string[]; accent: string }) {
  const vids = ids.map(id => VIDEO_BY_ID[id]).filter(Boolean);
  if (!vids.length) return null;
  return (
    <div className="mb-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: accent }}>Watch it at the bedside</div>
      <div className={vids.length === 1 ? 'max-w-[420px]' : 'grid gap-3 sm:grid-cols-2'}>
        {vids.map(v => <Clip key={v.id} v={v} accent={accent} />)}
      </div>
    </div>
  );
}
