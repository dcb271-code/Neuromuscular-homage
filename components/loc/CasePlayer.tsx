'use client';

// Case player: history → choose limited exam elements → commit to a level → commit to a
// tempo → choose a differential → reveal. Nothing is shown before the learner commits.

import { useState } from 'react';
import type { LocCase } from '@/src/loc/cases';
import { LEVELS } from '@/src/loc/models/localizer';
import { TEMPOS } from '@/src/loc/models/data';
import { FormattedContent } from '@/components/curriculum/FormattedContent';
import { Chip, Label, WidgetFrame } from './ui';

type Stage = 'start' | 'exam' | 'level' | 'tempo' | 'ddx' | 'reveal';

export function CasePlayer({ accent, c }: { accent: string; c: LocCase }) {
  const [stage, setStage] = useState<Stage>('start');
  const [picked, setPicked] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [tempo, setTempo] = useState<string | null>(null);
  const [ddx, setDdx] = useState<string[]>([]);
  const [ddxDone, setDdxDone] = useState(false);
  const reset = () => { setStage('start'); setPicked([]); setLevel(null); setTempo(null); setDdx([]); setDdxDone(false); };
  const order: Stage[] = ['start', 'exam', 'level', 'tempo', 'ddx', 'reveal'];
  const at = (s: Stage) => order.indexOf(stage) >= order.indexOf(s);
  const levelRight = level === c.level.answer || (c.level.also ?? []).includes(level as never);

  return (
    <WidgetFrame accent={accent} label="Case" subtitle={stage === 'reveal' ? c.title : c.teaser}>
      {stage === 'start' ? (
        <button onClick={() => setStage('exam')} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white" style={{ background: accent }}>Start the case</button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><Label>History</Label><FormattedContent content={c.history} accent={accent} basePath="/localization" /></div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <Label>Examine: choose {c.examPicks} ({picked.length}/{c.examPicks})</Label>
            <div className="flex flex-col gap-1.5">
              {c.exam.map(e => {
                const on = picked.includes(e.id);
                const reveal = on || at('level');
                return (
                  <button key={e.id} disabled={at('level') || (!on && picked.length >= c.examPicks)} onClick={() => setPicked(p => on ? p.filter(x => x !== e.id) : [...p, e.id])}
                    className="text-left rounded-lg border px-3 py-2 text-[12.5px] disabled:cursor-default"
                    style={{ borderColor: on ? accent : '#e2e8f0', background: on ? accent + '0f' : '#fff', opacity: at('level') && !on ? 0.75 : 1 }}>
                    <span className="font-medium text-slate-800">{e.label}</span>
                    {reveal && <span className="block text-slate-600 mt-0.5">{e.finding}{at('level') && e.key && <span className="ml-1 text-[10px] font-bold uppercase" style={{ color: accent }}>high yield</span>}</span>}
                  </button>
                );
              })}
            </div>
            {stage === 'exam' && <button disabled={picked.length === 0} onClick={() => setStage('level')} className="mt-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40" style={{ background: accent }}>Done examining</button>}
            {at('level') && <p className="mt-2 text-[11.5px] text-slate-500">Every finding is now shown, including the ones you did not ask for. High-yield ones are marked: did you choose them?</p>}
          </div>

          {at('level') && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Label>Where is the lesion?</Label>
              <div className="flex flex-wrap gap-1.5">{LEVELS.map(l => <Chip key={l.id} accent={accent} disabled={at('tempo')} on={level === l.id} onClick={() => setLevel(l.id)}>{l.short}</Chip>)}</div>
              {stage === 'level' && <button disabled={!level} onClick={() => setStage('tempo')} className="mt-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40" style={{ background: accent }}>Commit</button>}
              {at('tempo') && <p className="mt-2 text-[12.5px] leading-snug"><b style={{ color: levelRight ? accent : '#334155' }}>{levelRight ? 'Yes.' : `The answer is ${LEVELS.find(l => l.id === c.level.answer)!.short.toLowerCase()}.`}</b> {c.level.explanation}</p>}
            </div>
          )}

          {at('tempo') && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Label>When: what is the time course?</Label>
              <div className="flex flex-wrap gap-1.5">{TEMPOS.map(t => <Chip key={t.id} accent={accent} disabled={at('ddx')} on={tempo === t.id} onClick={() => setTempo(t.id)}>{t.name}</Chip>)}</div>
              {stage === 'tempo' && <button disabled={!tempo} onClick={() => setStage('ddx')} className="mt-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40" style={{ background: accent }}>Commit</button>}
              {at('ddx') && <p className="mt-2 text-[12.5px] leading-snug"><b style={{ color: tempo === c.tempo.answer ? accent : '#334155' }}>{tempo === c.tempo.answer ? 'Yes.' : `Best fit: ${TEMPOS.find(t => t.id === c.tempo.answer)!.name.toLowerCase()}.`}</b> {c.tempo.explanation}</p>}
            </div>
          )}

          {at('ddx') && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Label>What: choose your top {c.differential.pick}</Label>
              <div className="flex flex-col gap-1.5">
                {c.differential.options.map(o => {
                  const on = ddx.includes(o.label);
                  return (
                    <button key={o.label} disabled={ddxDone || (!on && ddx.length >= c.differential.pick)} onClick={() => setDdx(d => on ? d.filter(x => x !== o.label) : [...d, o.label])}
                      className="text-left rounded-lg border px-3 py-2 text-[12.5px]"
                      style={{ borderColor: ddxDone ? (o.correct ? accent : '#e2e8f0') : on ? accent : '#e2e8f0', background: ddxDone && o.correct ? accent + '12' : on ? accent + '0a' : '#fff' }}>
                      <span className="font-medium text-slate-800">{ddxDone && (on ? '● ' : '○ ')}{o.label}</span>
                      {ddxDone && <span className="block text-slate-600 mt-0.5">{o.correct ? 'Belongs on the list. ' : 'Less likely. '}{o.why}</span>}
                    </button>
                  );
                })}
              </div>
              {!ddxDone && <button disabled={ddx.length === 0} onClick={() => { setDdxDone(true); setStage('reveal'); }} className="mt-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40" style={{ background: accent }}>Commit</button>}
            </div>
          )}

          {stage === 'reveal' && (
            <div className="rounded-xl border p-4" style={{ borderColor: accent, background: accent + '0a' }}>
              <Label>{c.title}</Label>
              <FormattedContent content={c.reveal} accent={accent} basePath="/localization" />
              <button onClick={reset} className="mt-2 text-[12px] underline text-slate-500">Work it again</button>
            </div>
          )}
        </div>
      )}
    </WidgetFrame>
  );
}
