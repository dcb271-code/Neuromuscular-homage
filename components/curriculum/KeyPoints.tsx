'use client';

// Key Points card. Each point can be flagged to the personal review list (/eeg/review).
export function KeyPoints({ points, accent, isFlagged, onToggle }: {
  points: string[]; accent: string; isFlagged: (i: number) => boolean; onToggle: (i: number, text: string) => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Key points</p>
      <ul className="space-y-2.5">
        {points.map((p, i) => {
          const on = isFlagged(i);
          return (
            <li key={i} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-slate-700">
              <button onClick={() => onToggle(i, p)} aria-pressed={on} aria-label={on ? 'Remove from review' : 'Flag for review'}
                title={on ? 'Remove from review' : 'Flag for review'}
                className="shrink-0 mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center text-[12px] transition-colors"
                style={{ borderColor: on ? accent : '#e2e8f0', background: on ? accent : '#fff', color: on ? '#fff' : '#94a3b8' }}>
                {on ? '✓' : '⚑'}
              </button>
              <span>{p}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
