'use client';

// The smaller localization widgets: exam order, reflex timeline, root vs nerve, gait by level,
// coma levels, and where × when. Models: src/loc/models/{data,rootNerve,localizer}.ts.

import { useEffect, useMemo, useState } from 'react';
import { COMA_SIGNS, EXAM_STEPS, GAITS, TEMPOS, TIMELINE, WHERE_WHEN, comaVerdict, examOrderScore, timelineState, type Tempo, type TimelineState, HERNIATION } from '@/src/loc/models/data';
import { ITEMS, RN_PRESETS, candidates, type Exam } from '@/src/loc/models/rootNerve';
import { LEVELS } from '@/src/loc/models/localizer';
import { Chip, Label, Segmented, WidgetFrame } from './ui';

// ── Exam order ──────────────────────────────────────────────────────────────────────────────
const SHUFFLED = ['fundi', 'reflexes', 'watch-walk', 'fine-motor', 'ofc', 'watch-play', 'tone-strength', 'cn-game'];
export function ExamOrder({ accent }: { accent: string }) {
  const [order, setOrder] = useState<string[]>([]);
  const byId = Object.fromEntries(EXAM_STEPS.map(s => [s.id, s]));
  const done = order.length === EXAM_STEPS.length;
  const score = done ? examOrderScore(order) : null;
  return (
    <WidgetFrame accent={accent} label="Examining a toddler" subtitle="Tap the steps in the order you would do them with a toddler, and see which ones you have made harder by doing them too early."
      footnote={'After the owner\'s rule: stop, look and listen; make it a game; save the worst for last. Reflexes late and on a lap (Utah PediNeuroLogic Exam).'}>
      <div className="nm-2col">
        <div>
          <Label>Steps</Label>
          <div className="flex flex-col gap-1.5">
            {SHUFFLED.filter(id => !order.includes(id)).map(id => (
              <button key={id} onClick={() => setOrder(o => [...o, id])} className="text-left rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12.5px] text-slate-700 hover:border-slate-400">{byId[id].label}</button>
            ))}
            {done && <p className="text-[12px] text-slate-400">All placed.</p>}
          </div>
        </div>
        <div>
          <Label>Your order</Label>
          <ol className="flex flex-col gap-1.5">
            {order.map((id, i) => {
              const late = score?.pairs.some(([a]) => a === id);
              return (
                <li key={id} className="rounded-lg border px-3 py-2 text-[12.5px] flex gap-2" style={{ borderColor: late ? accent : '#e2e8f0', background: late ? accent + '0d' : '#fff' }}>
                  <span className="font-mono text-slate-400">{i + 1}</span>
                  <span className="text-slate-700">{byId[id].label}{done && <span className="block text-[11.5px] text-slate-500 mt-0.5">{byId[id].why}</span>}</span>
                </li>
              );
            })}
          </ol>
          {order.length > 0 && <button onClick={() => setOrder([])} className="mt-2 text-[12px] text-slate-500 underline">start again</button>}
          {score && (
            <p className="mt-2 text-[13px] leading-snug rounded-lg px-3 py-2" style={{ background: accent + '10' }}>
              {score.inversions === 0 ? <><b>Every step is in a workable place.</b> Watching first, games next, hands-on after, unpleasant last.</>
                : <><b>{score.inversions} {score.inversions === 1 ? 'step comes' : 'pairs of steps come'} out of order.</b> Highlighted steps are ones a toddler is likely to resist, done before gentler ones; once a child is crying, the rest of the exam is lost.</>}
            </p>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Reflex timeline ─────────────────────────────────────────────────────────────────────────
const STATE_STYLE: Record<TimelineState, { label: string; tone: 'ok' | 'mid' | 'flag' | 'muted' }> = {
  expected: { label: 'expected', tone: 'ok' }, fading: { label: 'fading', tone: 'mid' }, 'should be gone': { label: 'should be gone', tone: 'flag' },
  'not yet': { label: 'not yet', tone: 'muted' }, emerging: { label: 'emerging', tone: 'mid' }, 'should be present': { label: 'should be present', tone: 'ok' },
  'normal either way': { label: 'normal either way', tone: 'muted' }, 'red flag if present': { label: 'red flag if present', tone: 'flag' },
};
export function ReflexTimeline({ accent }: { accent: string }) {
  const [m, setM] = useState(6);
  const tone = (t: string) => t === 'ok' ? { background: accent + '18', color: accent } : t === 'flag' ? { background: '#1e293b', color: '#fff' } : t === 'mid' ? { background: '#e2e8f0', color: '#334155' } : { background: '#f1f5f9', color: '#94a3b8' };
  return (
    <WidgetFrame accent={accent} label="Reflexes that come and go" subtitle="Drag the age slider. Primitive reflexes should fade and postural reactions should appear on schedule, and in an infant either one arriving out of time suggests an upper motor neuron problem."
      footnote={<>Ages from the <a href="https://neurologicexam.med.utah.edu/pediatric/html/home_exam.html" target="_blank" rel="noopener noreferrer" className="underline">Utah PediNeuroLogic Exam</a> (Larsen and Stensaas), which has a video of each reflex. Boundaries are typical ages, not cut-offs; asymmetry at any age matters more than timing.</>}>
      <div className="mb-3">
        <div className="flex items-baseline justify-between"><Label>Age</Label><span className="font-mono text-[14px] font-bold" style={{ color: accent }}>{m === 0 ? 'newborn' : `${m} month${m === 1 ? '' : 's'}`}</span></div>
        <input type="range" min={0} max={12} step={1} value={m} onChange={e => setM(Number(e.target.value))} className="w-full" style={{ accentColor: accent }} aria-label="Age in months" />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono"><span>0</span><span>3</span><span>6</span><span>9</span><span>12</span></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        {TIMELINE.map(item => {
          const s = STATE_STYLE[timelineState(item, m)];
          return (
            <details key={item.id} className="px-3 py-2">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <span className="text-[13px] font-medium text-slate-800">{item.name}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">{item.kind}</span>
                <span className="ml-auto text-[11px] font-semibold rounded-full px-2 py-0.5" style={tone(s.tone)}>{s.label}</span>
              </summary>
              <p className="text-[12px] text-slate-600 mt-1.5 leading-snug"><b>How:</b> {item.how} {item.note}</p>
            </details>
          );
        })}
      </div>
    </WidgetFrame>
  );
}

// ── Root vs nerve ───────────────────────────────────────────────────────────────────────────
export function RootNerve({ accent }: { accent: string }) {
  const [exam, setExam] = useState<Exam>({});
  const [limb, setLimb] = useState<'arm' | 'leg'>('leg');
  const [preset, setPreset] = useState<string | null>(null);
  const cands = useMemo(() => candidates(exam), [exam]);
  const fits = cands.filter(c => c.explains);
  const cycle = (id: string) => { setPreset(null); setExam(e => { const n = { ...e }; if (!n[id]) n[id] = 'weak'; else if (n[id] === 'weak') n[id] = 'normal'; else delete n[id]; return n; }); };
  const p = RN_PRESETS.find(x => x.id === preset);
  return (
    <WidgetFrame accent={accent} label="Root, plexus or nerve" subtitle="Tap a muscle or reflex once for weak, twice for normal, three times to clear. The candidates that still explain everything stay lit."
      footnote="Predominant root assignments; sources differ by a segment (Brazis 2011 ch. 2-4). Two rules do the work: every muscle a nerve supplies below the lesion must be weak, and a muscle sharing a root but not a nerve tells them apart (Morris 2012).">
      <div className="mb-3">
        <Label>Try a patient</Label>
        <div className="flex flex-wrap gap-1.5">{RN_PRESETS.map(x => <Chip key={x.id} accent={accent} on={preset === x.id} onClick={() => { setPreset(x.id); setExam(x.exam); setLimb(Object.keys(x.exam).some(k => ITEMS.find(i => i.id === k)?.limb === 'arm') ? 'arm' : 'leg'); }}>{x.label}</Chip>)}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2"><Segmented accent={accent} value={limb} onChange={setLimb} options={[{ id: 'arm', label: 'Arm' }, { id: 'leg', label: 'Leg' }]} /></div>
          <div className="flex flex-col gap-1">
            {ITEMS.filter(i => i.limb === limb).map(i => {
              const st = exam[i.id];
              return (
                <button key={i.id} onClick={() => cycle(i.id)} className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12px]"
                  style={{ borderColor: st === 'weak' ? accent : '#e2e8f0', background: st === 'weak' ? accent + '14' : '#fff' }}>
                  <span className="w-14 shrink-0 text-[10px] font-bold uppercase" style={{ color: st === 'weak' ? accent : st === 'normal' ? '#64748b' : '#cbd5e1' }}>{st ?? 'untested'}</span>
                  <span className="text-slate-700 flex-1">{i.label}</span>
                  <span className="font-mono text-[10px] text-slate-400">{i.roots.join('-')}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>What still explains the exam</Label>
          {!Object.values(exam).includes('weak') ? <p className="text-[12.5px] text-slate-500">Mark at least one weak muscle or lost reflex.</p> : (
            <>
              {fits.length === 0 && <p className="text-[12.5px] text-slate-700 rounded-lg bg-white border border-slate-200 px-3 py-2">Nothing single explains this. Think of more than one lesion, a polyneuropathy, or a central cause.</p>}
              <ul className="space-y-1.5">
                {fits.map(c => <li key={c.id} className="rounded-lg px-3 py-2 text-[12.5px]" style={{ background: accent + '14' }}><b style={{ color: accent }}>{c.name}</b><span className="block text-slate-600">{c.why}</span></li>)}
              </ul>
              <details className="mt-2"><summary className="text-[12px] text-slate-500 cursor-pointer">Why the others fail</summary>
                <ul className="mt-1 space-y-1">{cands.filter(c => !c.explains && (c.kind !== 'root' || ITEMS.filter(i => i.limb === limb).some(i => i.roots.includes(c.id as never)))).map(c => <li key={c.id} className="text-[11.5px] text-slate-500"><b className="text-slate-600">{c.name}:</b> {c.why}</li>)}</ul>
              </details>
            </>
          )}
          {p && <p className="mt-2 text-[12px] leading-snug rounded-lg px-3 py-2 bg-white border border-slate-200">{p.teaching}</p>}
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Gait by level ───────────────────────────────────────────────────────────────────────────
export function GaitByLevel({ accent }: { accent: string }) {
  const [g, setG] = useState(GAITS[0].id);
  const gait = GAITS.find(x => x.id === g)!;
  return (
    <WidgetFrame accent={accent} label="Gait by level" subtitle="Each level of the nervous system changes walking in its own way. Pick a gait to see where it points and what usually accompanies it in a child."
      footnote="After Pearl 2014, pp. 114-117 (bottom up, muscle to cortex); toe walking after DeMyer, p. 338.">
      <div className="flex flex-wrap gap-1.5 mb-3">{GAITS.map(x => <Chip key={x.id} accent={accent} on={g === x.id} onClick={() => setG(x.id)}>{x.name}</Chip>)}</div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: accent }}>Points to</div>
        <div className="text-[16px] font-semibold text-slate-900 mb-2">{gait.level}</div>
        <p className="text-[13px] text-slate-700 leading-snug mb-2"><b>Looks like:</b> {gait.looks}</p>
        <p className="text-[13px] text-slate-700 leading-snug"><b>In a child:</b> {gait.child}</p>
      </div>
    </WidgetFrame>
  );
}

// ── Coma levels ─────────────────────────────────────────────────────────────────────────────
export function ComaLevels({ accent }: { accent: string }) {
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<number | null>(null);
  const v = comaVerdict(choice);
  const rows = ['hemispheres', 'midbrain', 'pons', 'medulla'] as const;
  useEffect(() => {
    if (stage === null) return;
    setChoice(HERNIATION[stage].choice);
    if (stage >= HERNIATION.length - 1) return;
    const id = setTimeout(() => setStage(s => (s === null ? null : s + 1)), 2600);
    return () => clearTimeout(id);
  }, [stage]);
  const pick = (sid: string, oid: string) => { setStage(null); setChoice(c => ({ ...c, [sid]: c[sid] === oid ? '' : oid })); };
  return (
    <WidgetFrame accent={accent} label="Coma as a level-finder" subtitle="Choose what you see for each sign. When they agree on one level, a structural lesion there is likely, and when they disagree, a metabolic cause becomes more likely."
      footnote="After Pearl 2014, pp. 94-98, and Brazis 2011, pp. 608-613. Describe responsiveness in plain words rather than labels (Brazis 2011, p. 603). The herniation sequence shows a level that moves: the signs descend rather than scatter.">
      <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,220px)]">
        <div className="space-y-3">
          {COMA_SIGNS.map(s => (
            <div key={s.id}>
              <Label>{s.name}</Label>
              <div className="flex flex-wrap gap-1.5">{s.options.map(o => <Chip key={o.id} accent={accent} on={choice[s.id] === o.id} onClick={() => pick(s.id, o.id)}>{o.label}</Chip>)}</div>
            </div>
          ))}
        </div>
        <div>
          <Label>Where each sign points</Label>
          <ol className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            {rows.map(r => {
              const n = COMA_SIGNS.filter(s => s.options.find(o => o.id === choice[s.id])?.level === r).length;
              return <li key={r} className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 last:border-0 text-[12.5px]" style={{ background: n ? accent + '12' : undefined }}><span className="capitalize text-slate-700">{r}</span><span className="ml-auto font-mono" style={{ color: accent }}>{'●'.repeat(n)}</span></li>;
            })}
          </ol>
          {stage === null
            ? <p className="mt-2 text-[12.5px] leading-snug rounded-lg px-3 py-2" style={{ background: v.kind === 'none' ? '#f1f5f9' : accent + '12', color: '#334155' }}>{v.text}</p>
            : <p className="mt-2 text-[12.5px] leading-snug rounded-lg px-3 py-2" style={{ background: '#fef3c7', color: '#334155' }}><b>{stage + 1}/{HERNIATION.length} · {HERNIATION[stage].stage}.</b> {HERNIATION[stage].text}</p>}
          <button onClick={() => setStage(stage === null ? 0 : null)} className="mt-2 w-full rounded-lg border px-3 py-1.5 text-[12px] font-semibold" style={{ borderColor: accent, color: stage === null ? accent : '#fff', background: stage === null ? '#fff' : accent }}>
            {stage === null ? '▶ Watch a herniation descend' : stage >= HERNIATION.length - 1 ? 'Done: clear' : '■ Stop'}
          </button>
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Where × when ────────────────────────────────────────────────────────────────────────────
export function WhereWhen({ accent }: { accent: string }) {
  const [level, setLevel] = useState('cord');
  const [tempo, setTempo] = useState<Tempo>('acute');
  const t = TEMPOS.find(x => x.id === tempo)!;
  const ex = WHERE_WHEN[level]?.[tempo] ?? [];
  return (
    <WidgetFrame accent={accent} label="Where × when → what" subtitle="The examination gives you the level and the time course suggests the mechanism. Choose both to see the causes that fit a child at that address."
      footnote="Tempo and mechanism after Brazis 2011, p. 4, with the child's own tempos added (static, regression). Examples are illustrative, not a complete differential.">
      <div className="mb-3"><Label>Where</Label><div className="flex flex-wrap gap-1.5">{LEVELS.map(l => <Chip key={l.id} accent={accent} on={level === l.id} onClick={() => setLevel(l.id)}>{l.short}</Chip>)}</div></div>
      <div className="mb-3"><Label>When</Label><div className="flex flex-wrap gap-1.5">{TEMPOS.map(x => <Chip key={x.id} accent={accent} on={tempo === x.id} onClick={() => setTempo(x.id)}>{x.name}</Chip>)}</div></div>
      <div className="nm-2col">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: accent }}>{t.name}: {t.span.toLowerCase()}</div>
          <ul className="list-disc ml-4 text-[12.5px] text-slate-700 space-y-0.5">{t.mechanisms.map(m => <li key={m}>{m}</li>)}</ul>
          {t.mimics && (<>
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] mt-2 mb-1 text-amber-600">Not a lesion at all: mimics</div>
            <ul className="list-disc ml-4 text-[12.5px] text-slate-700 space-y-0.5">{t.mimics.map(m => <li key={m}>{m}</li>)}</ul>
            <p className="text-[11px] text-slate-400 mt-1">Pearl 2014, p. 104.</p>
          </>)}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: accent }}>{LEVELS.find(l => l.id === level)!.short} + {t.name.toLowerCase()}: in a child</div>
          {ex.length ? <ul className="list-disc ml-4 text-[12.5px] text-slate-700 space-y-0.5">{ex.map(e => <li key={e}>{e}</li>)}</ul>
            : <p className="text-[12.5px] text-slate-500">No classic pediatric example sits in this cell. That is itself information: re-check the level or the tempo before going further.</p>}
        </div>
      </div>
    </WidgetFrame>
  );
}
