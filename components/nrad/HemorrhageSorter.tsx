'use client';

// Hemorrhage by shape and site: explore the five compartments on real CT slices, then sort six
// real images. Model and quiz: src/nrad/hemorrhage.ts. Images, marks and credits:
// src/nrad/ctFigures.ts and src/nrad/ctMarks.ts.

import { useState } from 'react';
import Link from 'next/link';
import { BLEEDS, EXPLORE_IMAGE, ORDER, QUIZ, checkAnswer, type BleedType } from '@/src/nrad/hemorrhage';
import { NRAD_ATTRIBUTIONS, ctImage, type CtImage } from '@/src/nrad/ctFigures';
import { shortCite } from '@/src/nrad/sources';
import { AnnotatedImage, MarkKey } from '@/components/curriculum/AnnotatedImage';
import { WidgetFrame, Segmented } from '@/components/loc/ui';

/** Who the image shows, where it comes from and its licence. */
function ImageCredit({ im, accent }: { im: CtImage; accent: string }) {
  return (
    <p className="mt-1.5 text-[10.5px] leading-snug text-slate-400">
      Image: {im.who}. {im.credit} · <a href={NRAD_ATTRIBUTIONS} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accent }}>{im.licence}</a>
    </p>
  );
}

export function HemorrhageSorter({ accent }: { accent: string }) {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [type, setType] = useState<BleedType>('epidural');
  const [marks, setMarks] = useState(true);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<BleedType | null>(null);
  const [second, setSecond] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const b = BLEEDS[type];
  const q = QUIZ[qi];

  const choose = (t: BleedType) => { if (picked) return; setPicked(t); if (checkAnswer(q.id, t)) setScore(s => s + 1); };
  const next = () => { setSecond(false); if (qi + 1 >= QUIZ.length) setDone(true); else { setQi(qi + 1); setPicked(null); } };
  const restart = () => { setQi(0); setPicked(null); setSecond(false); setScore(0); setDone(false); };

  const exploreIm = ctImage(EXPLORE_IMAGE[type]);
  const quizIm = ctImage(picked && second && q.after ? q.after.image : q.image);
  const quizHasMarks = quizIm.overlay.marks.length > 0 || !!quizIm.overlay.outline;

  return (
    <WidgetFrame accent={accent} label="Hemorrhage by shape" subtitle="Real head CT images. Acute blood is brighter than brain."
      footnote={<>Real CT images. The slices with numbered pins come from the CQ500 dataset ({shortCite('chilamkurthy2018')}), whose files carry no ages and whose patients are mostly adults. The amber line on those slices was traced by threshold around the blood. The pediatric images are panels from open-access articles, shown as printed with their own arrows. The case stems are teaching scenarios, and each image comes from a different patient, described in the line under it. R and L follow the radiological convention, so the patient&apos;s right is on the image left. Sources: Heit 2017, Huisman 2009, Kemp 2011.</>}>
      <div className="mb-3"><Segmented value={mode} onChange={setMode} accent={accent} options={[{ id: 'explore', label: 'Explore' }, { id: 'quiz', label: `Sort ${QUIZ.length} cases` }]} /></div>

      {mode === 'explore' ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
          <div className="mx-auto w-full max-w-[320px]">
            <AnnotatedImage key={exploreIm.id} src={exploreIm.file} overlay={exploreIm.overlay} reveal={marks} className="rounded-xl"
              alt={`Axial head CT with ${b.name.toLowerCase()} hemorrhage`} />
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">{marks && <MarkKey overlay={exploreIm.overlay} />}</div>
              <button onClick={() => setMarks(m => !m)} aria-pressed={marks}
                className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11.5px] font-semibold text-slate-600">{marks ? 'Hide marks' : 'Show marks'}</button>
            </div>
            <ImageCredit im={exploreIm} accent={accent} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Hemorrhage type">
              {ORDER.map(t => (
                <button key={t} onClick={() => setType(t)} aria-pressed={type === t}
                  className="rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold"
                  style={{ background: type === t ? accent : '#fff', color: type === t ? '#fff' : '#334155', borderColor: type === t ? accent : '#e2e8f0' }}>{BLEEDS[t].name}</button>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[13px] leading-relaxed text-slate-600">
              <div className="text-[15px] font-bold text-slate-900">{b.name}</div>
              <div className="text-[12px] text-slate-500 mb-2">{b.space} · {b.shapeLabel}</div>
              <ul className="list-disc ml-4 space-y-1 mb-2">{b.features.map(f => <li key={f}>{f}</li>)}</ul>
              <p className="mb-1.5"><b className="text-slate-800">Where the rule bends.</b> {b.pitfall}</p>
              <p className="mb-2"><b className="text-slate-800">In children.</b> {b.children}</p>
              <Link href={b.localization.href} className="text-[12.5px] font-semibold no-underline hover:underline" style={{ color: accent }}>{b.localization.label}</Link>
            </div>
          </div>
        </div>
      ) : done ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700">
          You sorted <b>{score} of {QUIZ.length}</b> correctly.
          <button onClick={restart} className="ml-3 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-slate-200 bg-white text-slate-600">Start again</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
          <div className="mx-auto w-full max-w-[320px]">
            <AnnotatedImage key={quizIm.id} src={quizIm.file} overlay={quizIm.overlay} reveal={!!picked} className="rounded-xl"
              alt={`Case ${qi + 1}: axial head CT`} />
            {picked && q.after && (
              <div className="mt-2"><Segmented value={second ? 'after' : 'first'} onChange={v => setSecond(v === 'after')} accent={accent}
                options={[{ id: 'first', label: 'Brain window' }, { id: 'after', label: q.after.label }]} /></div>
            )}
            {picked && quizHasMarks && <MarkKey overlay={quizIm.overlay} className="mt-2" />}
            {quizIm.note && <p className="mt-2 text-[11.5px] leading-snug text-slate-500">{quizIm.note}</p>}
            <ImageCredit im={quizIm} accent={accent} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Case {qi + 1} of {QUIZ.length} · score {score}</div>
            <p className="text-[13.5px] text-slate-800 leading-relaxed mb-3">{q.stem}</p>
            <div className="grid gap-1.5 mb-3">
              {ORDER.map(t => {
                const right = picked && t === q.answer, wrong = picked === t && t !== q.answer;
                return (
                  <button key={t} onClick={() => choose(t)} disabled={!!picked}
                    className={`text-left rounded-lg border px-3 py-2 text-[13px] ${right ? 'border-green-500/60 bg-green-50 text-green-900' : wrong ? 'border-red-400/60 bg-red-50 text-red-900' : picked ? 'border-slate-200 opacity-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                    {BLEEDS[t].name}
                  </button>
                );
              })}
            </div>
            {picked && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 mb-3" aria-live="polite">
                <b>{picked === q.answer ? 'Correct. ' : `It is ${BLEEDS[q.answer].name.toLowerCase()}. `}</b>{q.explanation}
              </div>
            )}
            {picked && <button onClick={next} className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: accent }}>{qi + 1 < QUIZ.length ? 'Next case' : 'See score'}</button>}
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
