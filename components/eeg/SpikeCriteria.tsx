'use client';

// Computed figure for Module 5, "The IFCN criteria for calling a discharge": score one synthetic
// transient against the six criteria, check, and see each feature drawn on the trace.

import { useId, useMemo, useState } from 'react';
import {
  CASES, CRITERIA, CRITERION_IDS, WINDOW_S, classify, countCriteria, synthesize,
  KURAL_SENSITIVITY, KURAL_SPECIFICITY, type Criteria, type CriterionId, type SpikeCase, type Synth,
} from '@/src/eeg/spike-model';
import { pm } from '@/src/eeg/sources';

const W = 360, PAD_L = 46, PAD_R = 10, TOP = 26, ROW = 46, BOTTOM = 30;
const INK = '#0f172a';

const empty = (): Criteria => Object.fromEntries(CRITERION_IDS.map(id => [id, false])) as Criteria;

function Cite({ k, label }: { k: string; label: string }) {
  return <a href={pm(k)} target="_blank" rel="noreferrer" className="underline decoration-slate-300 hover:decoration-slate-500">{label}</a>;
}

function Conclusion({ count }: { count: number }) {
  const cls = classify(count);
  if (cls === 'epileptiform') return (
    <>It meets the glossary threshold of 4 (<Cite k="kane2017" label="Kane 2017" />) and the stricter threshold of 5, which gave {KURAL_SPECIFICITY}% specificity and {KURAL_SENSITIVITY}% sensitivity in validation (<Cite k="kural2020" label="Kural 2020" />). Call it epileptiform.</>
  );
  if (cls === 'search-for-fifth') return (
    <>It meets the glossary threshold of 4 (<Cite k="kane2017" label="Kane 2017" />) but not the threshold of 5 that gave the best specificity (<Cite k="kural2020" label="Kural 2020" />). Search carefully for a fifth criterion before calling it epileptiform.</>
  );
  return <>It is below the glossary threshold of 4 (<Cite k="kane2017" label="Kane 2017" />). Do not call it epileptiform.</>;
}

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r={7} fill="#fff" stroke={INK} strokeWidth={1.2} />
      <text x={x} y={y + 3.2} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>{n}</text>
    </g>
  );
}

export function SpikeTrace({ c, syn, accent, show, hatchId }: { c: SpikeCase; syn: Synth; accent: string; show: Criteria | null; hatchId: string }) {
  const n = syn.channels.length;
  const H = TOP + n * ROW + BOTTOM;
  const x = (t: number) => PAD_L + (t / WINDOW_S) * (W - PAD_L - PAD_R);
  const yc = (i: number) => TOP + i * ROW + ROW / 2;
  const maxCh = syn.channels[syn.maxChannel];
  const maxAbs = Math.max(...maxCh.total.map(Math.abs), 1);
  // px per µV. Large transients nearly fill their row. Small ones keep a common floor so that a
  // 40 µV transient looks small, as it should.
  const scale = (ROW * 0.85) / Math.max(maxAbs, 110);
  const m = syn.marks;
  const ym = yc(syn.maxChannel);
  const peakV = maxCh.transient[Math.round(m.peak * 500)] + maxCh.background[Math.round(m.peak * 500)];
  const yPeak = ym + peakV * scale;
  const yAt = (t: number) => ym + maxCh.total[Math.min(maxCh.total.length - 1, Math.round(t * 500))] * scale;
  const field = syn.channels.map((ch, i) => ({ i, on: Math.abs(ch.gain) >= 0.2 })).filter(f => f.on).map(f => f.i);
  const disruptRows = syn.channels.map((ch, i) => ({ i, on: Math.abs(ch.gain) >= 0.3 })).filter(f => f.on).map(f => f.i);
  const barUv = maxAbs > 120 ? 100 : 50;
  const up = c.transient.polarity < 0 ? -1 : 1; // direction of the peak on screen
  const label = `Synthetic ${n}-channel referential trace, ${WINDOW_S} seconds, ${c.prompt}. Negative is drawn up.`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" role="img" aria-label={label}>
      <defs>
        <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1.2" />
        </pattern>
      </defs>
      <text x={W - PAD_R} y={11} textAnchor="end" fontSize="9" fontWeight="700" letterSpacing="0.08em" fill="#94a3b8">SYNTHETIC</text>

      {show?.disruption && m.disruptStart !== undefined && m.disruptEnd !== undefined && disruptRows.length > 0 && (
        <g>
          <rect x={x(m.disruptStart)} width={x(m.disruptEnd) - x(m.disruptStart)}
            y={yc(disruptRows[0]) - ROW / 2} height={(disruptRows[disruptRows.length - 1] - disruptRows[0] + 1) * ROW}
            fill={`url(#${hatchId})`} opacity={0.35} stroke="#64748b" strokeDasharray="2 2" />
          <Badge x={x(m.disruptEnd) - 9} y={yc(disruptRows[0]) - ROW / 2 + 9} n={5} />
        </g>
      )}

      {syn.channels.map((ch, i) => {
        const pts = ch.total.map((v, k) => `${x(syn.t[k]).toFixed(1)},${(yc(i) + v * scale).toFixed(1)}`).join(' ');
        return (
          <g key={ch.label}>
            <line x1={PAD_L} x2={W - PAD_R} y1={yc(i)} y2={yc(i)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD_L - 6} y={yc(i) + 4} textAnchor="end" fontSize="10.5" fontFamily="ui-monospace, monospace" fill="#475569">{ch.label}</text>
            <polyline points={pts} fill="none" stroke={accent} strokeWidth="1.3" strokeLinejoin="round" />
          </g>
        );
      })}

      {!show && (
        <g aria-hidden="true">
          <path d={`M ${x(m.peak) - 5} ${TOP - 12} L ${x(m.peak) + 5} ${TOP - 12} L ${x(m.peak)} ${TOP - 5} Z`} fill={INK} />
          <text x={x(m.peak) + 8} y={TOP - 6} fontSize="9.5" fill="#475569">candidate</text>
        </g>
      )}

      {show?.field && field.length > 1 && (
        <g>
          <path d={`M 12 ${yc(field[0]) - 8} L 8 ${yc(field[0]) - 8} L 8 ${yc(field[field.length - 1]) + 8} L 12 ${yc(field[field.length - 1]) + 8}`} fill="none" stroke={INK} strokeWidth="1.4" />
          {field.map(i => <circle key={i} cx={16} cy={yc(i)} r={2.2} fill={INK} />)}
          <Badge x={8} y={(yc(field[0]) + yc(field[field.length - 1])) / 2} n={6} />
        </g>
      )}

      {show?.slowWave && m.slowStart !== undefined && m.slowEnd !== undefined && (
        <g>
          <rect x={x(m.slowStart)} y={ym - ROW * 0.5} width={x(m.slowEnd) - x(m.slowStart)} height={ROW} rx={6}
            fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 3" />
          <Badge x={x(m.slowEnd)} y={ym - ROW * 0.5} n={4} />
        </g>
      )}

      {show?.duration && (
        <g>
          <path d={`M ${x(m.onset)} ${ym + ROW * 0.38 - 4} L ${x(m.onset)} ${ym + ROW * 0.38} L ${x(m.fallEnd)} ${ym + ROW * 0.38} L ${x(m.fallEnd)} ${ym + ROW * 0.38 - 4}`}
            fill="none" stroke={INK} strokeWidth="1.4" />
          <Badge x={x(m.onset) - 9} y={ym + ROW * 0.38} n={2} />
        </g>
      )}

      {show?.asymmetry && (
        <g>
          <line x1={x(m.onset)} y1={yAt(m.onset)} x2={x(m.peak)} y2={yPeak} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <line x1={x(m.peak)} y1={yPeak} x2={x(m.fallEnd)} y2={yAt(m.fallEnd)} stroke={INK} strokeWidth="2.2" strokeDasharray="3 2.5" strokeLinecap="round" />
          <Badge x={x(m.fallEnd) + 10} y={(yPeak + yAt(m.fallEnd)) / 2} n={3} />
        </g>
      )}

      {show?.morphology && (
        <g>
          <path d={up < 0
            ? `M ${x(m.peak) - 4} ${yPeak - 10} L ${x(m.peak) + 4} ${yPeak - 10} L ${x(m.peak)} ${yPeak - 4} Z`
            : `M ${x(m.peak) - 4} ${yPeak + 10} L ${x(m.peak) + 4} ${yPeak + 10} L ${x(m.peak)} ${yPeak + 4} Z`}
            fill="#fff" stroke={INK} strokeWidth="1.2" />
          <Badge x={x(m.peak) - 12} y={yPeak + up * 9} n={1} />
        </g>
      )}

      {/* Scale bars: 200 ms and an amplitude bar */}
      <g aria-hidden="true">
        <line x1={W - PAD_R - x(0.2) + PAD_L} x2={W - PAD_R} y1={H - 10} y2={H - 10} stroke="#475569" strokeWidth="1.5" />
        <text x={W - PAD_R - (x(0.2) - PAD_L) / 2} y={H - 14} textAnchor="middle" fontSize="9" fill="#475569">200 ms</text>
        <line x1={PAD_L} x2={PAD_L} y1={H - 6} y2={H - 6 - barUv * scale} stroke="#475569" strokeWidth="1.5" />
        <text x={PAD_L + 4} y={H - 8} fontSize="9" fill="#475569">{barUv} µV</text>
      </g>
    </svg>
  );
}

export function SpikeCriteria({ accent = '#2563eb' }: { accent?: string }) {
  const hatchId = 'spk-hatch' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, Criteria>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  // First check of each case, for the session score.
  const [scores, setScores] = useState<Record<string, { right: number; conclusion: boolean }>>({});

  const c = CASES[index];
  const syn = useMemo(() => synthesize(c), [c]);
  const pick = picks[c.id] ?? empty();
  const isChecked = !!checked[c.id];
  const trueCount = countCriteria(c.criteria);
  const userCount = countCriteria(pick);
  const right = CRITERION_IDS.filter(id => pick[id] === c.criteria[id]).length;

  const toggle = (id: CriterionId) => {
    if (isChecked) return;
    setPicks(p => ({ ...p, [c.id]: { ...pick, [id]: !pick[id] } }));
  };
  const check = () => {
    setChecked(s => ({ ...s, [c.id]: true }));
    if (!scores[c.id]) setScores(s => ({ ...s, [c.id]: { right, conclusion: classify(userCount) === classify(trueCount) } }));
  };
  const retry = () => {
    setChecked(s => ({ ...s, [c.id]: false }));
    setPicks(p => ({ ...p, [c.id]: empty() }));
  };
  const scored = Object.values(scores);
  const totalRight = scored.reduce((a, s) => a + s.right, 0);
  const conclusionsRight = scored.filter(s => s.conclusion).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>Spike criteria</span>
        <span className="text-[12px] text-slate-500">Mark each criterion the candidate transient meets, then check.</span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <button type="button" onClick={() => setIndex(i => (i - 1 + CASES.length) % CASES.length)} aria-label="Previous case"
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-slate-200 bg-white text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Previous</button>
        <div className="text-center min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Case {index + 1} of {CASES.length}</div>
          <div className="text-[13px] font-semibold text-slate-800 leading-snug">{isChecked ? c.name : c.prompt}</div>
          <div className="text-[11px] text-slate-500">{isChecked ? `${c.prompt}. ` : ''}State: {c.state.toLowerCase()}</div>
        </div>
        <button type="button" onClick={() => setIndex(i => (i + 1) % CASES.length)} aria-label="Next case"
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-slate-200 bg-white text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Next</button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden mb-3">
        <SpikeTrace c={c} syn={syn} accent={accent} show={isChecked ? c.criteria : null} hatchId={hatchId} />
        {isChecked && (
          <div className="px-3 py-2 border-t border-slate-100 text-[11.5px] text-slate-600 leading-snug">
            Numbered marks show each criterion this transient meets. 1 marks the sharp peak, 2 brackets its duration, 3 traces the rise (solid) and fall (dashed), 4 boxes the slow wave, 5 hatches the disrupted background, and 6 brackets the channels in the field.
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="IFCN criteria">
        {CRITERIA.map(cr => {
          const on = pick[cr.id];
          const ok = on === c.criteria[cr.id];
          return (
            <button key={cr.id} type="button" onClick={() => toggle(cr.id)} aria-pressed={on} disabled={isChecked}
              className="text-left rounded-xl border bg-white px-3 py-2 flex gap-2.5 items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
              style={{ borderColor: isChecked ? (ok ? '#16a34a' : '#dc2626') : on ? accent : '#e2e8f0', borderStyle: isChecked && !ok ? 'dashed' : 'solid' }}>
              <span aria-hidden="true" className="mt-0.5 shrink-0 w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center text-[12px] font-bold"
                style={{ background: on ? accent : '#fff', borderColor: on ? accent : '#cbd5e1', color: '#fff' }}>{on ? '✓' : ''}</span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-slate-800">{cr.n}. {cr.name}</span>
                <span className="block text-[11.5px] text-slate-500 leading-snug">{cr.definition}</span>
                {isChecked && (
                  <span className="block mt-1 text-[11.5px] leading-snug text-slate-700">
                    <b style={{ color: ok ? '#15803d' : '#b91c1c' }}>{ok ? 'Correct.' : 'Not quite.'}</b>{' '}
                    {c.criteria[cr.id] ? 'Met.' : 'Not met.'} {c.explain[cr.id]}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-3">
        {!isChecked
          ? <button type="button" onClick={check} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: accent }}>Check</button>
          : <button type="button" onClick={retry} className="px-4 py-2 rounded-lg text-[13px] font-semibold border border-slate-300 bg-white text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Try this case again</button>}
        <span className="text-[12px] text-slate-500" aria-live="polite">
          {scored.length === 0 ? 'Session: no cases checked yet.' : `Session: ${totalRight} of ${scored.length * 6} criteria correct, ${conclusionsRight} of ${scored.length} conclusions matched.`}
        </span>
      </div>

      {isChecked && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12.5px] text-slate-700 leading-snug" aria-live="polite">
          <p className="mb-1.5"><b>You marked {right} of 6 criteria correctly.</b> {userCount !== trueCount && <>Your marks total {userCount}, and the answer is {trueCount}.</>}</p>
          <p className="mb-1.5"><b>This transient meets {trueCount} of 6.</b> <Conclusion count={trueCount} /></p>
          <p className="text-slate-600">{c.takeaway}</p>
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-400 leading-snug">
        Synthetic, schematic tracings. Each shows a few referential channels against a quiet reference, with negative drawn up. Spike and sharp wave durations follow the glossary (spike 20 to under 70 ms, sharp wave 70 to 200 ms, <Cite k="kane2017" label="Kane 2017" />). Real transients should be scored in more than one montage. Your session score counts the first check of each case.
      </p>
    </div>
  );
}
