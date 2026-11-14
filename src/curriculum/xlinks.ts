// Reverse cross-links: which curriculum sections link to a given page through their `related`
// field. Gene and condition pages use this to show a "Taught in" line, so a link added to a
// module section in JSON appears on the target page with no second edit.

import type { EegModule } from '@/src/eeg/types';
import { LOC_MODULES } from '@/src/loc/modules';
import { EEG_MODULES } from '@/src/eeg/modules';

export type TaughtIn = { href: string; label: string };

const CURRICULA: { name: string; basePath: string; modules: EegModule[] }[] = [
  { name: 'Localization', basePath: '/localization', modules: LOC_MODULES },
  { name: 'EEG', basePath: '/eeg', modules: EEG_MODULES },
];

let index: Map<string, TaughtIn[]> | null = null;

function build(): Map<string, TaughtIn[]> {
  const map = new Map<string, TaughtIn[]>();
  for (const c of CURRICULA) {
    for (const m of c.modules) {
      m.sections.forEach((s, i) => {
        for (const r of s.related ?? []) {
          const key = r.href.split(/[?#]/)[0];
          const list = map.get(key) ?? [];
          const href = `${c.basePath}/${m.id}/#s${i + 1}`;
          if (!list.some(t => t.href === href)) list.push({ href, label: `${c.name} Module ${m.number}, ${s.title}` });
          map.set(key, list);
        }
      });
    }
  }
  return map;
}

/** Curriculum sections whose related links point at `path` (e.g. "/gene/SMN1/"). */
export function taughtIn(path: string): TaughtIn[] {
  index ??= build();
  return index.get(path) ?? [];
}
