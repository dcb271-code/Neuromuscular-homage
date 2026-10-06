'use client';

// Rule-of-four brainstem map. Three levels (midbrain, pons, medulla), each split into right
// lateral, right medial, left medial and left lateral, drawn as if facing the patient. Each box
// shows the cranial nerves the rule places there. Tap a box to place a lesion, or switch to
// "Find the lesion" and work backward from the findings. Model: src/loc/models/brainstem.ts
// (Gates 2005, 2011; exceptions from Pearl 2014 and Brazis 2011).

import { useMemo, useState } from 'react';
import { brainstemLesion, M_STRUCTURES, RULE_CN, S_STRUCTURES, structuresHit, type BsLevel, type BsSide, type Zone } from '@/src/loc/models/brainstem';
import { Segmented, WidgetFrame } from './ui';

type Box = { level: BsLevel; zone: Zone; side: BsSide };
const LEVELS: { id: BsLevel; name: string; y: number; h: number; x0: number; x1: number }[] = [
  { id: 'midbrain', name: 'Midbrain', y: 58, h: 78, x0: 116, x1: 454 },
  { id: 'pons', name: 'Pons', y: 142, h: 96, x0: 104, x1: 466 },
  { id: 'medulla', name: 'Medulla', y: 244, h: 78, x0: 136, x1: 434 },
];
const COLS: { zone: Zone; side: BsSide }[] = [{ zone: 'lateral', side: 'R' }, { zone: 'medial', side: 'R' }, { zone: 'medial', side: 'L' }, { zone: 'lateral', side: 'L' }];
const MED = '#0f766e', LAT = '#7c3aed';
const same = (a: Box | null, b: Box | null) => !!a && !!b && a.level === b.level && a.zone === b.zone && a.side === b.side;
const sideWord = (s: BsSide) => (s === 'L' ? 'left' : 'right');
const randomBox = (): Box => ({ level: LEVELS[Math.floor(Math.random() * 3)].id, zone: Math.random() < 0.5 ? 'medial' : 'lateral', side: Math.random() < 0.5 ? 'L' : 'R' });

export function BrainstemSim({ accent }: { accent: string }) {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [sel, setSel] = useState<Box | null>({ level: 'medulla', zone: 'lateral', side: 'L' });
  const [quiz, setQuiz] = useState<Box>({ level: 'pons', zone: 'medial', side: 'R' });
  const [guess, setGuess] = useState<Box | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const shown = mode === 'explore' ? sel : guess ? quiz : null;
  const r = useMemo(() => (shown ? brainstemLesion(shown.level, shown.zone, shown.side) : null), [shown]);
  const q = useMemo(() => brainstemLesion(quiz.level, quiz.zone, quiz.side), [quiz]);
  const hit = shown ? structuresHit(shown.level, shown.zone) : [];
  const PREFIX: Record<string, string> = { 'Motor pathway': 'Motor pathway', 'Medial lemniscus': 'Medial lemniscus', 'Medial longitudinal fasciculus': 'Medial longitudinal', 'Motor nucleus and nerve': 'Cranial nerve', 'Spinocerebellar pathways': 'Spinocerebellar', 'Spinothalamic tract': 'Spinothalamic', 'Sensory nucleus of 5': 'Sensory nucleus', 'Sympathetic pathway': 'Sympathetic' };
  const sideOf = (s: string) => r?.findings.find(f => f.structure.startsWith(PREFIX[s]))?.side;

  const tap = (b: Box) => {
    if (mode === 'explore') { setSel(same(sel, b) ? null : b); return; }
    if (guess) return;
    setGuess(b); setScore(s => ({ right: s.right + (same(b, quiz) ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => { setGuess(null); setQuiz(randomBox()); };

  const fill = (b: Box) => {
    if (mode === 'quiz' && guess) { if (same(b, quiz)) return '#16a34a'; if (same(b, guess)) return '#dc2626'; return '#fff'; }
    return same(b, sel) && mode === 'explore' ? accent : '#fff';
  };

  return (
    <WidgetFrame accent={accent} label="Rule of four" subtitle="The brainstem drawn as if you are facing the patient, with each level split into medial and lateral halves. Tap a box to place a lesion there, or switch to Find the lesion and work backward from the findings."
      footnote={<>A teaching heuristic (Gates 2005; Gates 2011), not a law; the places it bends are listed with each result. The boxes are a map of the rule, not a true cross-section: in a real brainstem the motor tract lies at the front and the cranial nerve nuclei toward the back.</>}>
      <div className="mb-3"><Segmented accent={accent} value={mode} onChange={m => { setMode(m); setGuess(null); if (m === 'quiz') setQuiz(randomBox()); }} options={[{ id: 'explore', label: 'Explore' }, { id: 'quiz', label: 'Find the lesion' }]} /></div>

      {mode === 'quiz' && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: accent }}>A child has these findings. Tap the box where the lesion is.</div>
          <ul className="list-disc ml-5 text-[13px] text-slate-700 space-y-0.5">
            {q.findings.map(f => <li key={f.structure}><b className="capitalize">{f.side === 'same' ? sideWord(quiz.side) : sideWord(quiz.side === 'L' ? 'R' : 'L')}:</b> {(f.text.charAt(0).toLowerCase() + f.text.slice(1)).replace('the eye on the lesion side', 'the eye on that side').replace('toward the side of the lesion', 'toward that side')}</li>)}
          </ul>
          {guess && (
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span className="text-[13px] font-semibold" style={{ color: same(guess, quiz) ? '#15803d' : '#b91c1c' }}>
                {same(guess, quiz) ? 'Correct.' : `Not quite: the lesion is in the ${sideWord(quiz.side)} ${quiz.zone} ${quiz.level}.`}
              </span>
              <button onClick={next} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white" style={{ background: accent }}>Next case</button>
              <span className="text-[12px] text-slate-500">Score {score.right}/{score.total}</span>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-2 mb-3">
        <svg viewBox="0 0 472 352" className="w-full block" role="img" aria-label="Rule of four map of the brainstem">
          <text x={195} y={16} textAnchor="middle" fontSize={13} fill="#64748b">Patient&apos;s right</text>
          <text x={375} y={16} textAnchor="middle" fontSize={13} fill="#64748b">Patient&apos;s left</text>
          <text x={150} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill={LAT}>Lateral: 4 Ss</text>
          <text x={285} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill={MED}>Medial: 4 Ms</text>
          <text x={420} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill={LAT}>Lateral: 4 Ss</text>
          {LEVELS.map(L => {
            const cw = (L.x1 - L.x0) / 4;
            return (
              <g key={L.id}>
                <text x={4} y={L.y + L.h / 2 - 8} fontSize={15} fontWeight={700} fill="#0f172a">{L.name}</text>
                <text x={4} y={L.y + L.h / 2 + 10} fontSize={12} fill="#64748b">{L.id === 'midbrain' ? 'CN 1 to 4' : L.id === 'pons' ? 'CN 5 to 8' : 'CN 9 to 12'}</text>
                {L.id === 'midbrain' && <text x={4} y={L.y + L.h / 2 + 26} fontSize={12} fill="#64748b">(3, 4 here)</text>}
                <rect x={L.x0 - 4} y={L.y - 3} width={L.x1 - L.x0 + 8} height={L.h + 6} rx={L.id === 'pons' ? 40 : 18} fill="#f1f5f9" stroke="#94a3b8" />
                {COLS.map((c, k) => {
                  const b: Box = { level: L.id, zone: c.zone, side: c.side };
                  const f = fill(b); const dark = f !== '#fff';
                  const cns = RULE_CN[L.id][c.zone];
                  return (
                    <g key={k} onClick={() => tap(b)} style={{ cursor: 'pointer' }} role="button" aria-label={`${sideWord(c.side)} ${c.zone} ${L.id}`}>
                      <rect x={L.x0 + k * cw + 3} y={L.y + 3} width={cw - 6} height={L.h - 6} rx={10} fill={f} stroke={c.zone === 'medial' ? MED + '66' : LAT + '55'} strokeWidth={1.5} />
                      <text x={L.x0 + k * cw + cw / 2} y={L.y + L.h / 2 + 7} textAnchor="middle" fontSize={cns.length >= 3 ? 17 : cns.length ? 22 : 12} fontWeight={700}
                        fill={dark ? '#fff' : cns.length ? (c.zone === 'medial' ? MED : LAT) : '#94a3b8'}>{cns.length ? cns.join(' ') : 'none'}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          <line x1={285} y1={50} x2={285} y2={330} stroke="#94a3b8" strokeDasharray="4 4" />
          <text x={285} y={346} textAnchor="middle" fontSize={11} fill="#64748b">midline</text>
        </svg>
        <p className="text-[12px] text-slate-600 px-1 pt-1 leading-snug">
          <b style={{ color: MED }}>Medial numbers divide evenly into 12</b> (3, 4, 6, 12). <b style={{ color: LAT }}>The others lie laterally</b> (5, 7, 9, 11, plus 8 and 10). Four nerves sit at each level, counting up from the medulla: 9 to 12, then 5 to 8, then 1 to 4 above the pons.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 mb-3">
        {[{ title: 'Four Ms (medial)', items: M_STRUCTURES, color: MED }, { title: 'Four Ss (lateral)', items: S_STRUCTURES, color: LAT }].map(g => (
          <div key={g.title} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: g.color }}>{g.title}</div>
            <ul className="space-y-1">
              {g.items.map(it => {
                const on = hit.includes(it); const sd = on ? sideOf(it) : undefined;
                return (
                  <li key={it} className="text-[12.5px] rounded-md px-2 py-1" style={{ background: on ? g.color + '18' : 'transparent', color: on ? '#0f172a' : '#64748b', fontWeight: on ? 600 : 400 }}>
                    <b style={{ color: g.color }}>{it.charAt(0)}</b>{it.slice(1)}{on && sd && <span className="font-normal text-slate-500"> · {sd === 'same' ? 'same side' : 'opposite side'}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {r && shown && (
        <div>
          <p className="text-[13px] text-slate-500 mb-1">Lesion: {sideWord(shown.side)} {shown.zone} {shown.level}</p>
          {r.syndrome && <p className="text-[14px] font-semibold text-slate-900 mb-2">{r.syndrome}</p>}
          <div className="nm-2col">
            {(['same', 'opposite'] as const).map(sd => (
              <div key={sd} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: accent }}>{sd === 'same' ? `Same side (${sideWord(shown.side)})` : `Opposite side (${sideWord(shown.side === 'L' ? 'R' : 'L')})`}</div>
                <ul className="space-y-1.5 text-[12.5px] text-slate-700 leading-snug">
                  {r.findings.filter(f => f.side === sd).map(f => <li key={f.structure}><b>{f.text}.</b> <span className="text-slate-400">{f.structure}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          {r.notes.length > 0 && <div className="mt-2 space-y-1">{r.notes.map((n, k) => <p key={k} className="text-[11.5px] text-slate-500 leading-snug"><span className="font-semibold text-slate-600">Where the rule bends:</span> {n}</p>)}</div>}
        </div>
      )}
      {mode === 'explore' && !sel && <p className="text-[13px] text-slate-500">Tap any box to place a lesion.</p>}
    </WidgetFrame>
  );
}
