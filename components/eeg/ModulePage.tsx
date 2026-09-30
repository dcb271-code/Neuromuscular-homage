'use client';

// Module page: sticky header → objectives → sections (figure, prose, key points, inline
// question) → quiz → sign-off → resources → sources. Progress is tracked per browser.

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { EegModule, QuizQuestion } from '@/src/eeg/types';
import { SOURCES, sourceUrl } from '@/src/eeg/sources';
import { TRACKS } from '@/src/eeg/curriculum';
import { useEegProgress } from '@/src/eeg/progress';
import { FormattedContent } from './FormattedContent';
import { InlineQuestion } from './InlineQuestion';
import { KeyPoints } from './KeyPoints';
import { MontageLab } from './MontageLab';

export function ModulePage({ module: m, prev, next }: { module: EegModule; prev?: EegModule; next?: EegModule }) {
  const accent = m.color;
  const { store, hydrated, markRead, touch, saveQuiz, toggleFlag, recordInline, setSignOff } = useEegProgress();
  const read = store.read[m.id] ?? [];
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => { touch(m.id); }, [m.id, touch]);

  // Active section = the one whose header is highest in the viewport. A section counts as
  // read once the sentinel at the end of its prose has been on screen (tall sections never
  // reach a 50% visibility threshold, so ratio-based observation fails for them).
  useEffect(() => {
    const active = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).map(e => Number((e.target as HTMLElement).dataset.section));
      if (visible.length) setActive(Math.min(...visible));
    }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });
    const read = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) markRead(m.id, Number((e.target as HTMLElement).dataset.sectionEnd)); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    sectionRefs.current.forEach(el => {
      if (!el) return;
      active.observe(el);
      const end = el.querySelector('[data-section-end]'); if (end) read.observe(end);
    });
    return () => { active.disconnect(); read.disconnect(); };
  }, [m.id, markRead]);

  const allRead = m.sections.every((_, i) => read.includes(i));
  const attempt = store.quiz[m.id];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Breadcrumb + header */}
      <nav className="text-[12px] text-slate-400 mb-5 flex gap-1.5 items-center flex-wrap">
        <Link href="/eeg" className="text-slate-500 no-underline hover:underline">EEG</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Module {m.number}</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-[3px] rounded-full" style={{ color: accent, background: accent + '14' }}>{TRACKS[m.track].name}</span>
          {m.tags.map(t => <span key={t} className="text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-[2px] rounded-full border border-slate-200 text-slate-500 bg-white">{t}</span>)}
          <span className="text-[11px] text-slate-400 ml-auto">{m.difficulty} · {m.duration}</span>
        </div>
        <h1 className="font-mono font-extrabold tracking-tight leading-[1.1] mb-3 text-slate-900" style={{ fontSize: 'clamp(24px, 5.5vw, 36px)' }}>
          <span style={{ color: accent }}>{String(m.number).padStart(2, '0')}</span> {m.title}
        </h1>
        <p className="text-[15px] text-slate-600 leading-relaxed max-w-[640px]">{m.why}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
        {/* Sidebar */}
        <aside className="md:sticky md:top-[72px] rounded-2xl border border-slate-200 bg-white p-3 text-[12.5px]">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 px-1 mb-2">Sections</div>
          <ol className="space-y-0.5">
            {m.sections.map((s, i) => {
              const done = read.includes(i);
              return (
                <li key={i}>
                  <a href={`#s${i + 1}`} className="flex items-start gap-2 rounded-lg px-1.5 py-1.5 no-underline hover:bg-slate-50"
                    style={{ color: active === i ? '#0f172a' : '#475569', fontWeight: active === i ? 600 : 500 }}>
                    <span className="shrink-0 mt-[1px] w-4 h-4 rounded-full border text-[9px] flex items-center justify-center font-mono"
                      style={{ borderColor: done ? '#16a34a' : '#cbd5e1', background: done ? '#16a34a' : '#fff', color: done ? '#fff' : '#94a3b8' }}>{done ? '✓' : i + 1}</span>
                    <span className="leading-snug">{s.title}</span>
                  </a>
                </li>
              );
            })}
            <li>
              <a href="#quiz" className="flex items-start gap-2 rounded-lg px-1.5 py-1.5 no-underline hover:bg-slate-50 text-slate-600 font-medium">
                <span className="shrink-0 mt-[1px] w-4 h-4 rounded-full border text-[9px] flex items-center justify-center font-mono"
                  style={{ borderColor: attempt ? '#16a34a' : '#cbd5e1', background: attempt ? '#16a34a' : '#fff', color: attempt ? '#fff' : '#94a3b8' }}>{attempt ? '✓' : 'Q'}</span>
                <span>Quiz{attempt ? ` · ${attempt.score}/${attempt.total}` : ''}</span>
              </a>
            </li>
          </ol>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${hydrated ? ((read.length + (attempt ? 1 : 0)) / (m.sections.length + 1)) * 100 : 0}%`, background: accent }} />
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0">
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">By the end of this module you can</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-[14px] text-slate-700 leading-relaxed">
              {m.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </section>

          {m.sections.map((s, i) => (
            <section key={i} id={`s${i + 1}`} data-section={i} ref={el => { sectionRefs.current[i] = el; }} className="mb-10 scroll-mt-20">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-[13px] font-bold" style={{ color: read.includes(i) ? '#16a34a' : accent }}>{read.includes(i) ? '✓' : String(i + 1).padStart(2, '0')}</span>
                <h2 className="text-[20px] font-bold tracking-tight text-slate-900 leading-tight">{s.title}</h2>
              </div>
              {s.figure === 'montage-lab' && <MontageLab accent={accent} />}
              <FormattedContent content={s.content} accent={accent} />
              <div data-section-end={i} aria-hidden="true" />
              <KeyPoints points={s.keyPoints} accent={accent}
                isFlagged={k => !!store.flags[`${m.id}:${i}:${k}`]}
                onToggle={(k, text) => toggleFlag(m.id, i, k, text)} />
              {s.question && <InlineQuestion question={s.question} accent={accent} onAnswer={ok => recordInline(m.id, i, ok)} />}
              {i < m.sections.length - 1 && <hr className="mt-10 border-slate-100" />}
            </section>
          ))}

          <section id="quiz" className="mb-10 scroll-mt-20">
            <Quiz module={m} accent={accent} unlocked={allRead || !!attempt} last={attempt}
              onFinish={(score, missed) => saveQuiz(m.id, { score, total: m.quiz.length, at: new Date().toISOString(), missed })} />
          </section>

          <section className="mb-8 rounded-2xl border p-5" style={{ borderColor: accent + '55', background: accent + '08' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: accent }}>Sign-off · with a faculty reader</p>
            <p className="text-[14px] text-slate-800 leading-relaxed mb-3">{m.signOff}</p>
            <label className="inline-flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
              <input type="checkbox" checked={!!store.signOff[m.id]} onChange={e => setSignOff(m.id, e.target.checked)} style={{ accentColor: accent }} />
              Signed off (self-reported; this site does not verify it)
            </label>
          </section>

          <section className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Read and watch</p>
            <ul className="space-y-2">
              {m.resources.map(r => (
                <li key={r.url} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] leading-relaxed">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold no-underline hover:underline" style={{ color: accent }}>{r.label} ↗</a>
                  {r.note && <div className="text-slate-500 mt-0.5">{r.note}</div>}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 mt-2">These sites are free but grant no reuse licence, so this module links to their pages rather than copying their figures.</p>
          </section>

          <section className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Sources</p>
            <ol className="list-decimal list-outside ml-5 space-y-1.5 text-[12px] text-slate-500 leading-relaxed">
              {m.sources.map(k => {
                const s = SOURCES[k]; if (!s) return null; const url = sourceUrl(s);
                return <li key={k}>{s.citation}{url && <> <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: accent }}>{s.pmid ? `PMID ${s.pmid}` : 'link'} ↗</a></>}</li>;
              })}
            </ol>
            <p className="text-[11px] text-slate-400 mt-3">For education. Not for clinical decision-making; consult primary sources and your attending.</p>
          </section>

          <nav className="flex gap-3 justify-between border-t border-slate-100 pt-5 text-[13px]">
            {prev ? <Link href={`/eeg/${prev.id}`} className="no-underline text-slate-600 hover:text-slate-900">← {String(prev.number).padStart(2, '0')} {prev.short}</Link> : <span />}
            {next ? <Link href={`/eeg/${next.id}`} className="no-underline font-semibold text-right" style={{ color: accent }}>{String(next.number).padStart(2, '0')} {next.short} →</Link> : <Link href="/eeg" className="no-underline font-semibold" style={{ color: accent }}>Back to the curriculum →</Link>}
          </nav>
        </div>
      </div>
    </div>
  );
}

// ── End-of-module quiz ───────────────────────────────────────────────────────

function Quiz({ module: m, accent, unlocked, last, onFinish }: {
  module: EegModule; accent: string; unlocked: boolean; last?: { score: number; total: number; at: string };
  onFinish: (score: number, missed: number[]) => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => m.quiz.map(() => null));
  const [checked, setChecked] = useState<boolean[]>(() => m.quiz.map(() => false));
  const [done, setDone] = useState(false);
  const score = useMemo(() => answers.filter((a, i) => a === m.quiz[i].answer).length, [answers, m.quiz]);
  const allChecked = checked.every(Boolean);

  const finish = () => {
    setDone(true);
    onFinish(score, m.quiz.map((q, i) => (answers[i] === q.answer ? -1 : i)).filter(i => i >= 0));
  };
  const retry = () => { setAnswers(m.quiz.map(() => null)); setChecked(m.quiz.map(() => false)); setDone(false); };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <h2 className="text-[18px] font-bold tracking-tight text-slate-900">Module quiz</h2>
        <span className="text-[11px] text-slate-400">{m.quiz.length} vignettes</span>
        {last && <span className="ml-auto text-[11px] text-slate-500">Last attempt: <b>{last.score}/{last.total}</b></span>}
      </div>
      {!unlocked ? (
        <p className="text-[13px] text-slate-500 mt-2">Read every section first. The quiz unlocks when the last section has been on screen.</p>
      ) : (
        <div className="mt-4 space-y-6">
          {m.quiz.map((q, qi) => (
            <QuizItem key={qi} n={qi + 1} q={q} accent={accent} selected={answers[qi]} checked={checked[qi]}
              onSelect={i => setAnswers(a => a.map((v, k) => (k === qi ? i : v)))}
              onCheck={() => setChecked(c => c.map((v, k) => (k === qi ? true : v)))} />
          ))}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
            {!done ? (
              <button onClick={finish} disabled={!allChecked} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
                style={{ background: accent }}>Finish and save score</button>
            ) : (
              <>
                <div className="text-[14px] text-slate-800"><b>{score}/{m.quiz.length}</b> correct{score === m.quiz.length ? '. Well read.' : '. Missed items are on your review page.'}</div>
                <button onClick={retry} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-slate-200 text-slate-600 bg-white">Try again</button>
                <Link href="/eeg/review" className="text-[12px] font-semibold no-underline" style={{ color: accent }}>Review page →</Link>
              </>
            )}
            {!allChecked && !done && <span className="text-[11px] text-slate-400">Check every answer to finish.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizItem({ n, q, accent, selected, checked, onSelect, onCheck }: {
  n: number; q: QuizQuestion; accent: string; selected: number | null; checked: boolean; onSelect: (i: number) => void; onCheck: () => void;
}) {
  const correct = selected === q.answer;
  return (
    <div>
      <p className="text-[14px] font-medium text-slate-900 leading-relaxed mb-3"><span className="font-mono text-slate-400 mr-2">{n}.</span>{q.question}</p>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const isRight = checked && i === q.answer, isWrong = checked && selected === i && !isRight, isSel = !checked && selected === i;
          return (
            <button key={i} onClick={() => !checked && onSelect(i)} disabled={checked}
              className={`text-left flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed
                ${isRight ? 'border-green-500/50 bg-green-50 text-green-900' : isWrong ? 'border-red-400/50 bg-red-50 text-red-900 line-through decoration-red-300' : checked ? 'border-slate-200 opacity-50' : 'bg-white cursor-pointer hover:border-slate-400'}`}
              style={!checked ? { borderColor: isSel ? accent : '#e2e8f0', boxShadow: isSel ? `0 0 0 2px ${accent}33` : 'none' } : undefined}>
              <span className="shrink-0 font-mono font-bold opacity-50 mt-0.5">{String.fromCharCode(65 + i)}.</span><span>{opt}</span>
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button onClick={onCheck} disabled={selected === null} className="mt-3 px-3 py-1.5 rounded-lg text-[12px] font-semibold border disabled:opacity-40"
          style={{ borderColor: accent, color: accent, background: '#fff' }}>Check answer</button>
      ) : (
        <div className={`mt-3 rounded-xl px-4 py-3 text-[13px] leading-relaxed border ${correct ? 'bg-green-50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <span className="font-semibold">{correct ? 'Correct. ' : 'Not quite. '}</span>{q.explanation}
        </div>
      )}
    </div>
  );
}
