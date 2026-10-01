'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/src/eeg/types';

// One decision-style question after a section. Immediate feedback; the explanation always
// teaches why the right answer is right and why the tempting one is wrong.
export function InlineQuestion({ question, accent, onAnswer }: {
  question: QuizQuestion; accent: string; onAnswer?: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === question.answer;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    onAnswer?.(i === question.answer);
  };

  return (
    <div className="mt-7 rounded-2xl border border-dashed p-5" style={{ borderColor: accent + '55', background: accent + '08' }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: accent }}>Check your understanding</p>
      <p className="text-[14px] font-medium text-slate-900 leading-relaxed mb-4">{question.question}</p>
      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          const isRight = answered && i === question.answer;
          const isWrong = answered && selected === i && i !== question.answer;
          return (
            <button key={i} onClick={() => choose(i)} disabled={answered}
              className={`text-left flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed transition-colors
                ${!answered ? 'border-slate-200 bg-white hover:border-slate-400 cursor-pointer' : ''}
                ${isRight ? 'border-green-500/50 bg-green-50 text-green-900' : ''}
                ${isWrong ? 'border-red-400/50 bg-red-50 text-red-900' : ''}
                ${answered && !isRight && !isWrong ? 'border-slate-200 bg-white opacity-50' : ''}`}>
              <span className="shrink-0 font-mono font-bold opacity-50 mt-0.5">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className={`mt-4 rounded-xl px-4 py-3 text-[13px] leading-relaxed border ${correct ? 'bg-green-50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <span className="font-semibold">{correct ? 'Correct. ' : 'Not quite. '}</span>{question.explanation}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-slate-400">Select an answer to reveal the explanation</p>
      )}
    </div>
  );
}
