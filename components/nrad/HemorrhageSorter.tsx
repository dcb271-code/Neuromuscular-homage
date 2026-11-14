'use client';

// Hemorrhage by shape and site: explore the five compartments on a schematic axial head, then
// sort six schematic cases. Shapes are drawn here in SVG. Model: src/nrad/hemorrhage.ts.

import { useState } from 'react';
import Link from 'next/link';
import { BLEEDS, ORDER, QUIZ, checkAnswer, type BleedType, type CaseDrawing } from '@/src/nrad/hemorrhage';
import { WidgetFrame, Segmented } from '@/components/loc/ui';

// ── Geometry (viewBox 200 x 240, center 100,120; image right = patient left) ──────────────
const C = { x: 100, y: 120 }, OUT = { a: 78, b: 98 }, IN = { a: 70, b: 90 };
const SUTURES = [-58, 55, 125, 238]; // coronal and lambdoid, both sides (parametric angles)
const rad = (d: number) => (d * Math.PI) / 180;
const onInner = (deg: number, inset = 0) => {
  const x = IN.a * Math.cos(rad(deg)), y = IN.b * Math.sin(rad(deg));
  const len = Math.hypot(x, y);
  return { x: C.x + x * (1 - inset / len), y: C.y + y * (1 - inset / len) };
};
const pt = (p: { x: number; y: number }) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;

/** Closed path between the inner table and an inner edge whose depth follows `thick` (0..1 across the span). */
function extraAxial(from: number, to: number, max: number, thick: (u: number) => number): string {
  const n = 40, outer: string[] = [], inner: string[] = [];
  for (let k = 0; k <= n; k++) {
    const u = k / n, deg = from + (to - from) * u;
    outer.push(pt(onInner(deg, -0.6)));
    inner.push(pt(onInner(deg, max * thick(u))));
  }
  return `M${outer.join(' L')} L${inner.reverse().join(' L')} Z`;
}
const lens = (u: number) => Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2));
const crescent = (u: number) => Math.min(1, Math.min(u, 1 - u) / 0.1);

const BLOOD = '#f8fafc', BLOOD_EDGE = '#ef4444', BRAIN = '#525b67', CSF = '#1f2630', BONE = '#e7e9ec';

function sideSign(side?: 'left' | 'right') { return side === 'right' ? -1 : 1; } // patient left draws on image right

function HeadSvg({ d, title }: { d: CaseDrawing; title: string }) {
  const s = sideSign(d.side);
  const lensFrom = s > 0 ? -48 : 180 - 47, lensTo = s > 0 ? 46 : 180 + 48;
  const crFrom = s > 0 ? -95 : 98, crTo = s > 0 ? 85 : 278;
  const sulcusAngles = Array.from({ length: 20 }, (_, k) => -171 + k * 18);
  const norm = (deg: number) => Math.abs(((deg + 540) % 360) - 180); // 0 = image right, 180 = image left
  const sahAngles = (deg: number) => (s > 0 ? norm(deg) < 60 : norm(deg) > 120);
  const sylvian = s > 0 ? -12 : 192;
  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={title} className="block w-full h-auto rounded-xl" style={{ background: '#0b0f14' }}>
      <title>{title}</title>
      {/* scalp, skull, brain */}
      <ellipse cx={C.x} cy={C.y} rx={OUT.a + 3} ry={OUT.b + 3} fill="#3a3f46" />
      <ellipse cx={C.x} cy={C.y} rx={OUT.a} ry={OUT.b} fill={BONE} />
      <ellipse cx={C.x} cy={C.y} rx={IN.a} ry={IN.b} fill={CSF} />
      <ellipse cx={C.x} cy={C.y} rx={IN.a - 1.6} ry={IN.b - 1.6} fill={BRAIN} />
      {/* sutures: gaps through the skull */}
      {SUTURES.map(a => { const p = onInner(a, -0.5), q = { x: C.x + (OUT.a + 0.5) * Math.cos(rad(a)), y: C.y + (OUT.b + 0.5) * Math.sin(rad(a)) }; return <line key={a} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#0b0f14" strokeWidth={1.4} />; })}
      {/* sulci and sylvian fissures */}
      {sulcusAngles.map(a => { const p = onInner(a, 1.5), q = onInner(a, 9); const bright = d.bleed === 'sulcal' && sahAngles(a); return <line key={a} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={bright ? BLOOD : CSF} strokeWidth={bright ? 1.8 : 1.3} strokeLinecap="round" />; })}
      {[-12, 192].map(a => { const p = onInner(a, 1.5), q = onInner(a, 26); const bright = d.bleed === 'sulcal' && a === sylvian; return <line key={a} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={bright ? BLOOD : CSF} strokeWidth={bright ? 2.4 : 1.8} strokeLinecap="round" />; })}
      {/* falx */}
      <line x1={C.x} y1={C.y - IN.b + 2} x2={C.x} y2={C.y - 30} stroke="#8b939e" strokeWidth={0.9} />
      <line x1={C.x} y1={C.y + 46} x2={C.x} y2={C.y + IN.b - 2} stroke="#8b939e" strokeWidth={0.9} />
      {/* ventricles */}
      {[-1, 1].map(k => (
        <g key={k}>
          <ellipse cx={C.x + k * 7.5} cy={C.y - 8} rx={5} ry={21} fill={CSF} transform={`rotate(${k * -14} ${C.x + k * 7.5} ${C.y - 8})`} />
          <ellipse cx={C.x + k * 15} cy={C.y + 30} rx={5} ry={11} fill={CSF} transform={`rotate(${k * 25} ${C.x + k * 15} ${C.y + 30})`} />
          {d.bleed === 'ventricular' && <ellipse cx={C.x + k * 17} cy={C.y + 35} rx={3.6} ry={5.2} fill={BLOOD} stroke={BLOOD_EDGE} strokeWidth={0.7} transform={`rotate(${k * 25} ${C.x + k * 17} ${C.y + 35})`} />}
        </g>
      ))}
      {/* lesions */}
      {d.bleed === 'lens' && <path d={extraAxial(lensFrom, lensTo, 15, lens)} fill={BLOOD} stroke={BLOOD_EDGE} strokeWidth={0.8} />}
      {d.bleed === 'crescent' && <path d={extraAxial(crFrom, crTo, 5.5, crescent)} fill={BLOOD} stroke={BLOOD_EDGE} strokeWidth={0.8} />}
      {d.bleed === 'interhemispheric' && <path d={`M${C.x + s * -0.6},${C.y + 44} Q${C.x + s * -6.5},${C.y + 75} ${C.x + s * -0.6},${C.y + IN.b - 4} Z`} fill={BLOOD} stroke={BLOOD_EDGE} strokeWidth={0.8} />}
      {d.bleed === 'rounded' && (
        <g>
          <ellipse cx={C.x + s * 28} cy={C.y - 45} rx={16} ry={13} fill="#3d444e" />
          <ellipse cx={C.x + s * 28} cy={C.y - 45} rx={10} ry={8} fill={BLOOD} stroke={BLOOD_EDGE} strokeWidth={0.8} />
        </g>
      )}
      {d.fracture && (() => { const a = s > 0 ? -2 : 182; const p = onInner(a, -0.5), q = { x: C.x + (OUT.a + 1) * Math.cos(rad(a + s * 3)), y: C.y + (OUT.b + 1) * Math.sin(rad(a + s * 3)) }; return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#0b0f14" strokeWidth={1.2} />; })()}
      <text x={6} y={124} fontSize={10} fontWeight={700} fill="#fbbf24">R</text>
      <text x={186} y={124} fontSize={10} fontWeight={700} fill="#fbbf24">L</text>
      <text x={96} y={11} fontSize={9} fontWeight={700} fill="#fbbf24">A</text>
    </svg>
  );
}

const EXPLORE: Record<BleedType, CaseDrawing> = {
  epidural: { bleed: 'lens', side: 'left', fracture: true },
  subdural: { bleed: 'crescent', side: 'right' },
  subarachnoid: { bleed: 'sulcal', side: 'left' },
  intraparenchymal: { bleed: 'rounded', side: 'left' },
  intraventricular: { bleed: 'ventricular' },
};

export function HemorrhageSorter({ accent }: { accent: string }) {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [type, setType] = useState<BleedType>('epidural');
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<BleedType | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const b = BLEEDS[type];
  const q = QUIZ[qi];

  const choose = (t: BleedType) => { if (picked) return; setPicked(t); if (checkAnswer(q.id, t)) setScore(s => s + 1); };
  const next = () => { if (qi + 1 >= QUIZ.length) setDone(true); else { setQi(qi + 1); setPicked(null); } };
  const restart = () => { setQi(0); setPicked(null); setScore(0); setDone(false); };

  return (
    <WidgetFrame accent={accent} label="Hemorrhage by shape" subtitle="Schematic axial slices. Bright on CT is drawn white with a red edge."
      footnote="Schematic drawings, not patient images. The small dark gaps through the skull are sutures. R and L follow the radiological convention, so the patient's right is on the image left. Sources: Heit 2017, Huisman 2009, Kemp 2011.">
      <div className="mb-3"><Segmented value={mode} onChange={setMode} accent={accent} options={[{ id: 'explore', label: 'Explore' }, { id: 'quiz', label: `Sort ${QUIZ.length} cases` }]} /></div>

      {mode === 'explore' ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr] md:items-start">
          <div className="mx-auto w-full max-w-[260px]"><HeadSvg d={EXPLORE[type]} title={`Schematic ${b.name.toLowerCase()} hemorrhage`} /></div>
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
        <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr] md:items-start">
          <div className="mx-auto w-full max-w-[260px]"><HeadSvg d={q.drawing} title={`Case ${qi + 1}: schematic axial slice`} /></div>
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
