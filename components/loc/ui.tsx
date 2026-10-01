'use client';

// Shared chrome for the localization widgets: one frame, one chip, one segmented control.

import type { ReactNode } from 'react';

export function WidgetFrame({ accent, label, subtitle, children, footnote }: {
  accent: string; label: string; subtitle: string; children: ReactNode; footnote?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full" style={{ color: accent, background: accent + '14' }}>{label}</span>
        <span className="text-[12px] text-slate-500 leading-snug">{subtitle}</span>
      </div>
      {children}
      {footnote && <p className="mt-3 text-[11px] text-slate-400 leading-snug">{footnote}</p>}
    </div>
  );
}

export function Chip({ on, onClick, accent, children, title, disabled }: {
  on: boolean; onClick: () => void; accent: string; children: ReactNode; title?: string; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} title={title} disabled={disabled} aria-pressed={on}
      className="text-left rounded-lg border px-2.5 py-1.5 text-[12px] font-medium leading-snug transition-colors disabled:opacity-40"
      style={{ background: on ? accent : '#fff', color: on ? '#fff' : '#334155', borderColor: on ? accent : '#e2e8f0' }}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({ value, options, onChange, accent }: {
  value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; accent: string;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-lg bg-slate-200/70 p-0.5 gap-0.5">
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={value === o.id}
          className="px-2.5 py-1 rounded-md text-[12px] font-semibold"
          style={{ background: value === o.id ? '#fff' : 'transparent', color: value === o.id ? accent : '#64748b', boxShadow: value === o.id ? '0 1px 2px rgba(0,0,0,.08)' : 'none' }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{children}</div>;
}
