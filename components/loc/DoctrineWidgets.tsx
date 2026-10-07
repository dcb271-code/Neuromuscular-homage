'use client';

// Widgets added after the Neuro-Logic review: voices of a lesion, pretest probability, the
// lesion ladder, which map a deficit obeys, aphasia switches, and vertigo sorting. Each is a thin
// view over a tested model in src/loc/models/.

import { useMemo, useState } from 'react';
import { STRUCTURES, VOICES, type Voice } from '@/src/loc/models/voices';
import { frequencies, posttest, PRIORS, TESTS, type TestId } from '@/src/loc/models/bayes';
import { LADDERS, deficitsAt, type Ladder } from '@/src/loc/models/ladder';
import { NERVE_DIAGRAMS } from '@/src/loc/models/nerveDiagrams';
import { MAPS, MAP_CASES, checkMap, type MapId } from '@/src/loc/models/maps';
import { classify, STIMULUS, type Switches } from '@/src/loc/models/aphasia';
import { VEST_FEATURES, vestVerdict } from '@/src/loc/models/vestibular';
import { Chip, Label, Segmented, WidgetFrame } from './ui';

const pct = (p: number) => (p < 0.01 ? '<1%' : p > 0.99 ? '>99%' : `${Math.round(p * 100)}%`);

// ── Voices of a lesion ──────────────────────────────────────────────────────────────────────
export function LesionVoices({ accent }: { accent: string }) {
  const [sid, setSid] = useState('fef');
  const st = STRUCTURES.find(s => s.id === sid)!;
  return (
    <WidgetFrame accent={accent} label="How a lesion shows itself" subtitle="Choose a structure and see the kinds of sign it can produce, depending on whether the damage silences it, excites it, or removes the brake it applies to something else."
      footnote="Examples gathered from Pearl 2014 (pages on each card), DeMyer and the Utah PediNeuroLogic Exam. DeMyer frames the positive and negative effects of motor lesions as deficit and release phenomena (DeMyer, p. 292); the fourth category and the grouping are ours.">
      <div className="mb-3"><Label>Structure</Label>
        <div className="flex flex-wrap gap-1.5">{STRUCTURES.map(s => <Chip key={s.id} accent={accent} on={sid === s.id} onClick={() => setSid(s.id)}>{s.name}</Chip>)}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {VOICES.map(v => {
          const cell = st.cells[v.id as Voice];
          return (
            <div key={v.id} className="rounded-xl border bg-white p-3" style={{ borderColor: cell ? accent + '55' : '#e2e8f0', opacity: cell ? 1 : 0.6 }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: cell ? accent : '#94a3b8' }}>{v.name}</span>
                <span className="text-[11px] text-slate-400">{v.gist}</span>
              </div>
              {cell ? <p className="text-[13px] text-slate-700 leading-snug">{cell.sign} <span className="text-slate-400 text-[11px]">({cell.cite})</span></p>
                : <p className="text-[12.5px] text-slate-400 leading-snug">This structure has no classic sign of this kind.</p>}
            </div>
          );
        })}
      </div>
      {st.note && <p className="mt-3 text-[12.5px] text-slate-600 leading-snug rounded-lg px-3 py-2" style={{ background: accent + '10' }}>{st.note}</p>}
    </WidgetFrame>
  );
}

// ── Pretest probability ─────────────────────────────────────────────────────────────────────
const GENE_SCALE = ['Benign', 'Likely benign', 'Uncertain significance', 'Likely pathogenic', 'Pathogenic'];
export function Pretest({ accent }: { accent: string }) {
  const [tid, setTid] = useState<TestId>('mri');
  const [prior, setPrior] = useState<string>('loose');
  const test = TESTS.find(t => t.id === tid)!;
  const [sens, setSens] = useState<Record<TestId, number>>({ mri: 0.9, eeg: 0.5, gene: 0.5 });
  const p = PRIORS.find(x => x.id === prior)!.p;
  const model = test.falsePositive === null ? null : { sensitivity: sens[tid], falsePositive: test.falsePositive };
  const f = model ? frequencies(100, p, model) : null;
  const post = model ? posttest(p, model, true) : 0;
  const dots = useMemo(() => {
    if (!f) return [];
    return [
      ...Array(f.truePos).fill('tp'), ...Array(f.falseNeg).fill('fn'),
      ...Array(f.falsePos).fill('fp'), ...Array(f.trueNeg).fill('tn'),
    ] as ('tp' | 'fn' | 'fp' | 'tn')[];
  }, [f]);
  const colour = { tp: accent, fn: '#fff', fp: '#f59e0b', tn: '#e2e8f0' } as const;
  return (
    <WidgetFrame accent={accent} label="Pretest probability" subtitle="Choose a test and how well the examination predicted the finding, and watch how much the same positive report is worth for a child like this one."
      footnote={<>Bayes in odds form: post-test odds = pretest odds × likelihood ratio (Gill 2005). False-positive rates are published: incidental MRI findings in 21.1% of 9-10-year-olds (Li 2021); epileptiform discharges in 6.5% of healthy 6-13-year-olds (Borusiak 2010). Pretest probabilities and sensitivities are illustrative; move them.</>}>
      <div className="grid gap-3 sm:grid-cols-2 mb-3">
        <div><Label>Test</Label><Segmented accent={accent} value={tid} onChange={setTid} options={TESTS.map(t => ({ id: t.id, label: t.name }))} /></div>
        {model && (
          <div><Label>Sensitivity (illustrative): {Math.round(sens[tid] * 100)}%</Label>
            <input type="range" min={0.2} max={0.99} step={0.01} value={sens[tid]} onChange={e => setSens(s => ({ ...s, [tid]: Number(e.target.value) }))} className="w-full" style={{ accentColor: accent }} aria-label="Sensitivity" />
          </div>
        )}
      </div>
      <div className="mb-3"><Label>Before the test</Label>
        <div className="flex flex-wrap gap-1.5">{PRIORS.map(x => <Chip key={x.id} accent={accent} on={prior === x.id} onClick={() => setPrior(x.id)}>{x.name} <span className="opacity-70">· {pct(x.p)}</span></Chip>)}</div>
        <p className="text-[11.5px] text-slate-500 mt-1">{PRIORS.find(x => x.id === prior)!.detail}.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: accent }}>{test.finding}</div>
        {model && f ? (
          <div className="grid gap-3 md:grid-cols-[minmax(0,220px)_1fr] items-start">
            <div className="grid grid-cols-10 gap-[3px] max-w-[220px]" role="img" aria-label={`${f.truePos} true and ${f.falsePos} false positives among 100 children`}>
              {dots.map((d, i) => <span key={i} className="aspect-square rounded-full" style={{ background: colour[d], border: d === 'fn' ? `1.5px solid ${accent}` : '1px solid transparent' }} />)}
            </div>
            <div className="text-[13px] text-slate-700 leading-snug space-y-1.5">
              <p>Of 100 such children, <b>{f.sick}</b> have it. The test finds <b style={{ color: accent }}>{f.truePos}</b> of them and flags <b style={{ color: '#d97706' }}>{f.falsePos}</b> who do not.</p>
              <p>So a positive report means {test.target} in about <b style={{ color: accent }}>{pct(post)}</b> of children like this one.</p>
              <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />true positive</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />false positive</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: accent }} />missed</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1 mb-2">{GENE_SCALE.map((g, i) => <span key={g} className="text-[11px] px-2 py-1 rounded-md border" style={{ borderColor: i === 2 ? accent : '#e2e8f0', background: i === 2 ? accent + '12' : '#fff', color: i === 2 ? accent : '#64748b', fontWeight: i === 2 ? 700 : 500 }}>{g}</span>)}</div>
            <p className="text-[13px] text-slate-700 leading-snug">
              {prior === 'fits' && 'The child, examined and localized, looks like what this gene does. An uncertain variant here is worth working on: testing the parents, re-examining for features the gene predicts, and asking the laboratory to review it.'}
              {prior === 'loose' && 'Without a localized phenotype there is nothing to weigh the variant against. Most uncertain variants found this way stay uncertain.'}
              {prior === 'elsewhere' && 'The gene acts at an address the exam excluded. However the report is worded, the variant is very unlikely to explain this child.'}
            </p>
          </div>
        )}
      </div>
      <p className="text-[12px] text-slate-500 leading-snug">{test.fpSource}. {test.note}</p>
    </WidgetFrame>
  );
}


// Schematic of the nerve with the lesion marked; branches beyond the lesion turn red.
function NerveDiagramView({ ladder, index, onPick, accent }: { ladder: Ladder; index: number; onPick: (i: number) => void; accent: string }) {
  const dg = NERVE_DIAGRAMS[ladder.id];
  if (!dg) return null;
  const rung = ladder.rungs[index];
  const r = dg.rungs[rung.id];
  const lost = new Set(r?.lost ?? []); const hit = new Set(r?.hit ?? []);
  const LOST = '#dc2626', HIT = '#f59e0b';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 mb-3">
      <div className="overflow-x-auto">
      <svg viewBox={dg.viewBox} className="w-full block" style={{ minWidth: 560 }} role="img" aria-label={`Diagram of the ${ladder.name.toLowerCase()} with the lesion ${rung.site.toLowerCase()}`}>
        {dg.boxes?.map((b, bi) => (
          <g key={bi}><rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} fill="#f8fafc" stroke="#cbd5e1" />
            <text x={b.x + 8} y={b.y + 18} fontSize={12} fontWeight={600} fill="#475569">{b.text}</text></g>
        ))}
        {dg.parts.map(p => {
          const isLost = lost.has(p.id), isHit = hit.has(p.id);
          const color = isLost ? LOST : isHit ? HIT : p.kind === 'other' ? '#94a3b8' : '#334155';
          const w = p.kind === 'trunk' ? 4.5 : p.kind === 'struct' ? 2 : 2.5;
          return (
            <g key={p.id}>
              <path d={p.d} fill={p.kind === 'struct' ? (isHit ? HIT + '55' : '#e2e8f0') : 'none'} stroke={color} strokeWidth={w} strokeLinecap="round"
                strokeDasharray={p.kind === 'other' && !isLost && !isHit ? '5 4' : isLost ? '7 5' : undefined} />
              {p.label && <text x={p.label.x} y={p.label.y} fontSize={12.5} textAnchor={p.label.anchor ?? 'middle'} fill={isLost ? LOST : isHit ? '#b45309' : '#334155'}
                fontWeight={isLost || isHit ? 700 : 400}>{p.label.text}</text>}
            </g>
          );
        })}
        {ladder.rungs.map((rg, k) => {
          const site = dg.rungs[rg.id]; if (!site) return null;
          const on = k === index;
          return (
            <g key={rg.id} onClick={() => onPick(k)} style={{ cursor: 'pointer' }} role="button" aria-label={`Lesion ${rg.site}`}>
              <circle cx={site.at[0]} cy={site.at[1]} r={13} fill="transparent" />
              {on ? (
                <g stroke={LOST} strokeWidth={4} strokeLinecap="round">
                  <line x1={site.at[0] - 9} y1={site.at[1] - 9} x2={site.at[0] + 9} y2={site.at[1] + 9} />
                  <line x1={site.at[0] - 9} y1={site.at[1] + 9} x2={site.at[0] + 9} y2={site.at[1] - 9} />
                </g>
              ) : <circle cx={site.at[0]} cy={site.at[1]} r={5} fill="#fff" stroke={accent} strokeWidth={2.5} />}
            </g>
          );
        })}
      </svg>
      </div>
      <p className="text-[11px] text-slate-500 px-1 pt-1">Tap a circle to place the lesion there; on a small screen, swipe sideways to see the whole nerve. Red branches are cut off from the cord; amber structures are neighbors hit by the same lesion.</p>
    </div>
  );
}

// ── Lesion ladder ───────────────────────────────────────────────────────────────────────────
export function LesionLadder({ accent }: { accent: string }) {
  const [lid, setLid] = useState('facial');
  const ladder = LADDERS.find(l => l.id === lid)!;
  const [idx, setIdx] = useState(0);
  const i = Math.min(idx, ladder.rungs.length - 1);
  const rung = ladder.rungs[i];
  const deficits = deficitsAt(ladder, i);
  const top = [...ladder.rungs.keys()].reverse();
  return (
    <WidgetFrame accent={accent} label="Lesion ladder" subtitle="Move the lesion up the nerve and watch the deficits accumulate, since a lesion takes out every branch that leaves below it."
      footnote={ladder.footnote}>
      <div className="mb-3"><Segmented accent={accent} value={lid} onChange={v => { setLid(v); setIdx(0); }} options={LADDERS.map(l => ({ id: l.id, label: l.short }))} /></div>
      <NerveDiagramView ladder={ladder} index={i} onPick={setIdx} accent={accent} />
      <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr] items-start">
        <ol className="rounded-xl border border-slate-200 bg-white overflow-hidden" aria-label="Lesion site, proximal at the top">
          {top.map(k => {
            const r = ladder.rungs[k];
            const lit = r.mode === 'replace' ? k === i : rung.mode !== 'replace' && k <= i && !ladder.rungs[k].mode;
            return (
              <li key={r.id}>
                <button onClick={() => setIdx(k)} aria-pressed={k === i} className="w-full text-left flex items-start gap-2 px-3 py-2 border-b border-slate-100 text-[12.5px]"
                  style={{ background: k === i ? accent : lit ? accent + '14' : '#fff', color: k === i ? '#fff' : '#334155', borderBottom: r.mode === 'replace' ? '2px dashed #cbd5e1' : undefined }}>
                  <span className="font-mono text-[10px] mt-[2px] opacity-70">{k === i ? '✕' : r.mode === 'replace' ? '◆' : '│'}</span>
                  <span className="leading-snug">{r.site}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div>
          <Label>What the child shows</Label>
          <ul className="space-y-1.5 mb-3">
            {deficits.map(d => (
              <li key={d.text} className="text-[13px] leading-snug rounded-lg border px-3 py-1.5 bg-white" style={{ borderColor: d.isNew ? accent : '#e2e8f0' }}>
                {d.isNew && <span className="text-[9.5px] font-bold uppercase tracking-wide mr-1.5" style={{ color: accent }}>{rung.mode === 'replace' ? 'pattern' : 'new'}</span>}{d.text}
              </li>
            ))}
          </ul>
          <p className="text-[12.5px] text-slate-700 leading-snug"><b style={{ color: accent }}>The test that places it:</b> {rung.clue}.</p>
          <p className="text-[12px] text-slate-500 leading-snug mt-1">In a child: {rung.example}.</p>
          {rung.mode === 'replace' && <p className="text-[12px] text-slate-500 leading-snug mt-1">◆ Above a dashed line the pattern changes shape instead of growing, because the lesion has left the nerve itself.</p>}
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Which map does the deficit obey? ────────────────────────────────────────────────────────
export function MapSort({ accent }: { accent: string }) {
  const [k, setK] = useState(0);
  const [pick, setPick] = useState<MapId | null>(null);
  const c = MAP_CASES[k];
  const r = pick ? checkMap(c.id, pick) : null;
  const go = (d: number) => { setK((k + d + MAP_CASES.length) % MAP_CASES.length); setPick(null); };
  return (
    <WidgetFrame accent={accent} label="Which map fits the deficit" subtitle="Strokes, neuropathies, root lesions and tumors each respect a different map of the body. Read the pattern and decide which map it follows."
      footnote="Maps after Pearl 2014 (pages on each answer). Cases are teaching sketches, not complete differentials.">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => go(-1)} className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[12px]" aria-label="Previous pattern">←</button>
        <span className="text-[11px] text-slate-400 font-mono">{k + 1}/{MAP_CASES.length}</span>
        <button onClick={() => go(1)} className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[12px]" aria-label="Next pattern">→</button>
      </div>
      <p className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13.5px] text-slate-800 leading-snug mb-3">{c.pattern}</p>
      <Label>The deficit obeys</Label>
      <div className="flex flex-wrap gap-1.5 mb-3">{MAPS.map(m => <Chip key={m.id} accent={accent} on={pick === m.id} onClick={() => setPick(m.id)} disabled={!!r?.correct && pick !== m.id}>{m.name}</Chip>)}</div>
      {r && (
        <div className="rounded-lg px-3 py-2 text-[13px] leading-snug" style={{ background: r.correct ? accent + '14' : '#fef3c7' }}>
          <b>{r.correct ? 'Yes.' : `Not quite: it obeys ${r.answer.name.toLowerCase()}.`}</b> {r.why} <span className="text-slate-500">({r.cite})</span>
          <div className="mt-1.5 text-[12.5px] text-slate-700"><b style={{ color: accent }}>So think:</b> {r.answer.suggests}.</div>
        </div>
      )}
    </WidgetFrame>
  );
}

// ── Aphasia as four switches ────────────────────────────────────────────────────────────────
const SWITCHES: { id: keyof Switches; label: string; yes: string; no: string }[] = [
  { id: 'fluent', label: 'Speech', yes: 'Fluent', no: 'Halting, effortful' },
  { id: 'comprehends', label: 'Comprehension', yes: 'Follows commands', no: 'Does not understand' },
  { id: 'repeats', label: 'Repetition', yes: 'Repeats a sentence', no: 'Cannot repeat' },
  { id: 'names', label: 'Naming', yes: 'Names objects', no: 'Cannot find names' },
];
export function AphasiaSwitches({ accent }: { accent: string }) {
  const [s, setS] = useState<Switches>({ fluent: false, comprehends: true, repeats: false, names: false });
  const a = classify(s);
  return (
    <WidgetFrame accent={accent} label="Aphasia at the bedside" subtitle="Every patient below describes the same picture. Set the four bedside tests and see which syndrome, and which part of the brain, fits the result."
      footnote="After Pearl 2014, p. 20 (Table 2.1), with conduction and mixed transcortical aphasia from Brazis 2011, pp. 524 and 448. The adult classification; acquired aphasia in children does not always follow it. Sample speech is ours.">
      <div className="grid gap-2 sm:grid-cols-2 mb-3">
        {SWITCHES.map(w => (
          <div key={w.id}><Label>{w.label}</Label>
            <Segmented accent={accent} value={s[w.id] ? 'y' : 'n'} onChange={v => setS(x => ({ ...x, [w.id]: v === 'y' }))} options={[{ id: 'y', label: w.yes }, { id: 'n', label: w.no }]} />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="text-[11px] text-slate-500 mb-1.5">{STIMULUS}</div>
        <p className="text-[14px] text-slate-800 leading-snug mb-2">{a.sample}</p>
        <div className="text-[13px]"><b style={{ color: accent }}>{a.name}.</b> <span className="text-slate-600">{a.where}.</span></div>
      </div>
    </WidgetFrame>
  );
}

// ── Vertigo: ear or brain? ──────────────────────────────────────────────────────────────────
export function VertigoSorter({ accent }: { accent: string }) {
  const [on, setOn] = useState<string[]>([]);
  const v = vestVerdict(on);
  const toggle = (id: string) => setOn(x => x.includes(id) ? x.filter(y => y !== id) : [...x, id]);
  return (
    <WidgetFrame accent={accent} label="Vertigo: ear or brain?" subtitle="Mark what you find. Peripheral features can accumulate without settling the question, while a single central feature is enough to treat the problem as central."
      footnote="Features after Brazis 2011, p. 265, and Pearl 2014, pp. 119-122. A teaching sort, not a validated rule.">
      <div className="grid gap-1.5 mb-3">
        {VEST_FEATURES.map(f => (
          <button key={f.id} onClick={() => toggle(f.id)} aria-pressed={on.includes(f.id)} className="text-left rounded-lg border px-3 py-2 text-[12.5px] leading-snug"
            style={{ borderColor: on.includes(f.id) ? (f.lean === 'central' ? '#dc2626' : accent) : '#e2e8f0', background: on.includes(f.id) ? (f.lean === 'central' ? '#fef2f2' : accent + '0f') : '#fff' }}>
            <span className="font-medium text-slate-800">{f.label}</span>
            {on.includes(f.id) && <span className="block text-[11.5px] text-slate-500 mt-0.5">{f.why}</span>}
          </button>
        ))}
      </div>
      <p className="rounded-lg px-3 py-2 text-[13px] leading-snug" style={{ background: v.lean === 'central' ? '#fee2e2' : v.lean === 'peripheral' ? accent + '14' : '#f1f5f9', color: '#334155' }}>
        {v.lean && <b>{v.lean === 'central' ? 'Central. ' : 'Peripheral. '}</b>}{v.text}
      </p>
    </WidgetFrame>
  );
}
