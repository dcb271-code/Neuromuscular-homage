'use client';

// Dermatome map: the public-domain dermatome drawing (Ralf Stephan, Wikimedia Commons) with the
// standard key sensory points on top. Explore a point, quiz yourself, or set a cord level and see
// which points a complete lesion at that level would leave numb.

import { useMemo, useState } from 'react';
import { KEY_POINTS, LEVEL_CHOICES, levelStatus, type KeyPoint } from '@/src/loc/models/dermatomes';
import { Chip, Label, Segmented, WidgetFrame } from './ui';

type Mode = 'explore' | 'quiz' | 'level';
// Crop of the 1202 x 1700 drawing that holds both figures; the white rectangles hide its legend.
const VIEWBOX = '125 60 860 1490';
const MASKS: [number, number, number, number][] = [[100, 255, 92, 380], [100, 1170, 92, 290], [60, 170, 205, 110], [60, 1070, 205, 140], [905, 60, 120, 130], [972, 150, 40, 630], [972, 1180, 40, 300], [930, 1020, 90, 150]];

export function DermatomeMap({ accent, initialMode = 'explore' }: { accent: string; initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [sel, setSel] = useState<KeyPoint | null>(null);
  const [level, setLevel] = useState('T10');
  const [target, setTarget] = useState(() => KEY_POINTS[Math.floor(Math.random() * KEY_POINTS.length)]);
  const [answer, setAnswer] = useState<{ ok: boolean; picked: KeyPoint } | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const status = useMemo(() => levelStatus(level), [level]);

  const nextQuestion = () => { setAnswer(null); setTarget(KEY_POINTS[Math.floor(Math.random() * KEY_POINTS.length)]); };
  const tap = (p: KeyPoint) => {
    if (mode === 'quiz') {
      if (answer) return;
      const ok = p.root === target.root;
      setAnswer({ ok, picked: p }); setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    } else setSel(p);
  };
  const fillFor = (p: KeyPoint) => {
    if (mode === 'level') return status[p.root] === 'lost' ? '#dc2626' : status[p.root] === 'level' ? '#f59e0b' : '#fff';
    if (mode === 'quiz' && answer) return p.root === target.root ? '#16a34a' : p === answer.picked ? '#dc2626' : '#fff';
    return sel?.root === p.root ? accent : '#fff';
  };
  const lostCount = Object.values(status).filter(s => s === 'lost').length;

  return (
    <WidgetFrame accent={accent} label="Dermatome map" subtitle="Each dot is the standard point for testing one root. Tap a dot to see its root, quiz yourself, or set a cord level and see which points a complete lesion would leave numb."
      footnote={<>Key sensory points and key muscles from the International Standards for Neurological Classification of Spinal Cord Injury, revised 2011 (Kirshblum et al.). Drawing: Ralf Stephan, Wikimedia Commons, public domain. Dermatome maps vary between sources and neighboring roots overlap, which is why the standard tests one point per root rather than whole territories.</>}>
      <div className="mb-3"><Segmented accent={accent} value={mode} onChange={m => { setMode(m); setSel(null); setAnswer(null); }} options={[{ id: 'explore', label: 'Explore' }, { id: 'quiz', label: 'Quiz' }, { id: 'level', label: 'Sensory level' }]} /></div>
      {mode === 'level' && (
        <div className="mb-3"><Label>Complete cord lesion at</Label>
          <div className="flex flex-wrap gap-1.5">{LEVEL_CHOICES.map(l => <Chip key={l} accent={accent} on={level === l} onClick={() => setLevel(l)}>{l}</Chip>)}</div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-1.5">
          <svg viewBox={VIEWBOX} className="w-full block" role="img" aria-label="Dermatome drawing, front view on the left and back view on the right, with key sensory points">
            <image href="/loc/dermatomes.svg" x={0} y={0} width={1202} height={1700} />
            {MASKS.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#fff" />)}
            <text x={330} y={1545} fontSize={30} fill="#64748b" textAnchor="middle">front</text>
            <text x={760} y={1545} fontSize={30} fill="#64748b" textAnchor="middle">back</text>
            {KEY_POINTS.map(p => (
              <g key={p.root} onClick={() => tap(p)} style={{ cursor: 'pointer' }} role="button" aria-label={mode === 'quiz' ? `Key point` : `${p.root}: ${p.landmark}`}>
                <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                <circle cx={p.x} cy={p.y} r={9} fill={fillFor(p)} stroke="#0f172a" strokeWidth={3} />
                {mode === 'explore' && sel?.root === p.root && <text x={p.x + 16} y={p.y - 12} fontSize={30} fontWeight={700} fill="#0f172a" stroke="#fff" strokeWidth={6} paintOrder="stroke">{p.root}</text>}
              </g>
            ))}
          </svg>
        </div>
        <div className="space-y-2">
          {mode === 'explore' && (sel ? (
            <div className="rounded-xl border bg-white p-3" style={{ borderColor: accent + '55' }}>
              <div className="text-[18px] font-bold" style={{ color: accent }}>{sel.root}</div>
              <p className="text-[13px] text-slate-700 leading-snug mt-1"><b>Key sensory point:</b> {sel.landmark}.</p>
              {sel.muscle && <p className="text-[13px] text-slate-700 leading-snug mt-1"><b>Key muscle:</b> {sel.muscle}.</p>}
              <p className="text-[12px] text-slate-500 leading-snug mt-2">Numbness here with normal sensation at the neighboring points points to this root, or to a cord level just above it if everything below is also numb.</p>
            </div>
          ) : <p className="text-[13px] text-slate-500 leading-snug">Tap any dot. The front view shows C3 to L5; the back view shows C2 and the sacral points.</p>)}
          {mode === 'quiz' && (
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[14px] text-slate-800">Tap the key sensory point for <b style={{ color: accent }}>{target.root}</b>.</p>
              {answer && (
                <p className="text-[13px] mt-2 leading-snug" style={{ color: answer.ok ? '#15803d' : '#b91c1c' }}>
                  {answer.ok ? 'Correct.' : `That dot is ${answer.picked.root}.`} {target.root} is tested at: {target.landmark.toLowerCase()}.
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {answer && <button onClick={nextQuestion} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white" style={{ background: accent }}>Next</button>}
                <span className="text-[12px] text-slate-500">Score {score.right}/{score.total}</span>
              </div>
            </div>
          )}
          {mode === 'level' && (
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[13px] text-slate-700 leading-snug space-y-1.5">
              <p><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle" style={{ background: '#f59e0b' }} />The {level} point sits at the level and may be partly spared.</p>
              <p><span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle" style={{ background: '#dc2626' }} />{lostCount} points below it would be numb after a complete lesion.</p>
              <p className="text-[12px] text-slate-500">A partial lesion is less tidy. Pain and temperature loss from a lesion on one side of the cord begins a segment or two below it and on the other side, which the cord simulator shows.</p>
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

export function DermatomeLevel({ accent }: { accent: string }) {
  return <DermatomeMap accent={accent} initialMode="level" />;
}
