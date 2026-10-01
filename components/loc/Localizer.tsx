'use client';

// "Localization is elimination": toggle findings and watch levels of the neuraxis fall away.
// Every excluded level can be opened to read why. Model: src/loc/models/localizer.ts.

import { useMemo, useState } from 'react';
import { FINDINGS, FINDING_SETS, LEVELS, PRESETS, localize, type FindingGroup } from '@/src/loc/models/localizer';
import { Chip, Label, WidgetFrame } from './ui';

const GROUP_ORDER: FindingGroup[] = ['distribution', 'tone & reflexes', 'muscle', 'sensation', 'other'];
const SUBTITLES: Record<string, string> = {
  intro: 'Pick what you found. Each finding rules levels out; what survives is where the lesion can be.',
  full: 'Every finding has levels it fits and levels it cannot come from. Combine them; open a struck level to see why it fell.',
  floppy: 'A floppy infant: is the problem central (brain) or peripheral (motor unit)?',
  'motor-unit': 'Four addresses in the motor unit, each with a fingerprint.',
};

export function Localizer({ accent, variant = 'full' }: { accent: string; variant?: keyof typeof FINDING_SETS }) {
  const [sel, setSel] = useState<string[]>([]);
  const [preset, setPreset] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const verdicts = useMemo(() => localize(sel), [sel]);
  const allowed = FINDING_SETS[variant];
  const presets = PRESETS[variant] ?? [];
  const activePreset = presets.find(p => p.id === preset);
  const surviving = verdicts.filter(v => v.status !== 'excluded');
  const best = Math.max(0, ...surviving.map(v => v.fitCount));

  const toggle = (id: string) => { setPreset(null); setSel(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id])); };

  return (
    <WidgetFrame accent={accent} label="Localizer" subtitle={SUBTITLES[variant]}
      footnote="A teaching model of classical rules (Brazis 2011; DeMyer; Peredo 2009). Each rule's exceptions are listed under its finding. Real patients can have more than one lesion.">
      {presets.length > 0 && (
        <div className="mb-3">
          <Label>Try a patient</Label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <Chip key={p.id} accent={accent} on={preset === p.id} onClick={() => { setPreset(p.id); setSel(p.findings); setOpen(null); }}>{p.label}</Chip>
            ))}
            {sel.length > 0 && <button onClick={() => { setSel([]); setPreset(null); }} className="text-[12px] text-slate-500 underline px-2">clear</button>}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,300px)]">
        <div className="min-w-0">
          {GROUP_ORDER.map(g => {
            const fs = FINDINGS.filter(f => f.group === g && allowed.includes(f.id));
            if (!fs.length) return null;
            return (
              <div key={g} className="mb-3">
                <Label>{g}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {fs.map(f => <Chip key={f.id} accent={accent} on={sel.includes(f.id)} onClick={() => toggle(f.id)}>{f.label}</Chip>)}
                </div>
              </div>
            );
          })}
          {sel.map(id => FINDINGS.find(f => f.id === id)).filter(f => f?.caveat).map(f => (
            <p key={f!.id} className="text-[11.5px] text-slate-500 leading-snug mt-1.5"><span className="font-semibold text-slate-600">Where this rule bends:</span> {f!.caveat}</p>
          ))}
        </div>

        <div className="min-w-0">
          <Label>The neuraxis, top to bottom</Label>
          <ol className="rounded-xl border border-slate-200 bg-white overflow-hidden" aria-live="polite">
            {LEVELS.map((l, i) => {
              const v = verdicts[i];
              const excluded = v.status === 'excluded';
              const top = !excluded && v.fitCount > 0 && v.fitCount === best;
              return (
                <li key={l.id} className="border-b border-slate-100 last:border-0">
                  <button onClick={() => setOpen(open === l.id ? null : l.id)} disabled={!excluded}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12.5px]"
                    style={{ background: top ? accent + '14' : undefined }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: excluded ? '#e2e8f0' : top ? accent : v.fitCount ? accent + '88' : '#cbd5e1' }} />
                    <span className={excluded ? 'line-through text-slate-300' : top ? 'font-semibold text-slate-900' : 'text-slate-700'}>{l.short}</span>
                    {!excluded && v.fitCount > 0 && <span className="ml-auto font-mono text-[10px]" style={{ color: accent }}>{'●'.repeat(v.fitCount)}</span>}
                    {excluded && <span className="ml-auto text-[10px] text-slate-400">why?</span>}
                  </button>
                  {excluded && open === l.id && (
                    <div className="px-3 pb-2 text-[11.5px] text-slate-600 leading-snug">
                      {v.reasons.map((r, k) => <p key={k} className="mt-1"><span className="text-slate-400">{r.finding}: </span>{r.why}</p>)}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[12px] text-slate-600 leading-snug min-h-[36px]">
            {!sel.length ? 'No findings yet: every level is possible.'
              : surviving.length === 0 ? 'Nothing survives. Either a finding is wrong, or there is more than one lesion.'
              : surviving.length === 1 ? <><b>One level left:</b> {LEVELS.find(l => l.id === surviving[0].level)!.name}.</>
              : <><b>{surviving.length} levels survive.</b> Filled dots show how many findings each one positively fits.</>}
          </p>
          {activePreset && <p className="mt-1 text-[12px] leading-snug rounded-lg px-3 py-2" style={{ background: accent + '10', color: '#334155' }}>{activePreset.teaching}</p>}
        </div>
      </div>
    </WidgetFrame>
  );
}
