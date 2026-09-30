#!/usr/bin/env node
// Regenerates docs/eeg/curriculum-coverage.md from the outline's objectives and the modules'
// sections. Status is ✅ when a module exists for the outline module; edit ⚠️/❌ rows by hand
// below the generated table for topics the outline lists but a module does not yet teach.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../src/eeg/modules/', import.meta.url).pathname;
const outline = readFileSync(new URL('../docs/eeg/outline.md', import.meta.url), 'utf8');
const modules = readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(dir + f, 'utf8'))).sort((a, b) => a.number - b.number);

// Objectives per outline module: the bullet list right after "**Objectives**".
const objectives = {};
for (const m of outline.matchAll(/^## Module (\d+)\.[^\n]*\n([\s\S]*?)(?=^## Module |\n## Resource map)/gm)) {
  const block = m[2].match(/\*\*Objectives\*\*\n\n([\s\S]*?)\n\n/);
  objectives[Number(m[1])] = block ? block[1].split('\n').map(l => l.replace(/^- /, '').trim()).filter(Boolean) : [];
}

const lines = [
  '# EEG curriculum coverage checklist',
  '',
  '> The north-star map: every objective in `outline.md`, and which module section teaches it. Regenerate the tables with `node scripts/eeg-coverage.mjs`; hand-edit the Gaps section.',
  '',
  '**Status legend:** ✅ covered  ⚠️ partial  ❌ missing  ➖ out of scope',
  '',
  `**Last generated:** ${new Date().toISOString().slice(0, 10)}`,
  '',
];
for (const m of modules) {
  lines.push(`## Module ${m.number}: ${m.title} (\`${m.id}\`)`, '');
  lines.push('**Outline objectives**', '');
  for (const o of objectives[m.number] ?? []) lines.push(`- ✅ ${o}`);
  lines.push('', '**Sections**', '');
  m.sections.forEach((s, i) => lines.push(`- ✅ ${String(i + 1).padStart(2, '0')} ${s.title}${s.figure ? ` · figure: ${s.figure}` : ''}${s.question ? '' : ' · ⚠️ no inline question'}`));
  lines.push(`- ✅ Quiz: ${m.quiz.length} items · Sign-off: ${m.signOff.slice(0, 80)}${m.signOff.length > 80 ? '…' : ''}`, '');
}
lines.push('## Gaps and partials (hand-maintained)', '',
  '- ⚠️ Module 1: filter lab not built (montage lab only); filters taught in prose.',
  '- ⚠️ Module 3: no interactive artifact hunter; links to eeg-training.com instead.',
  '- ❌ All modules: no real tracings (no licensed images yet). See `improvement-log.md` Queued.',
  '- ➖ Adult-only variants beyond the outline table (wickets, small sharp spikes) are mentioned, not taught.',
  '- ➖ Slide decks: not part of v1.', '');
writeFileSync(new URL('../docs/eeg/curriculum-coverage.md', import.meta.url), lines.join('\n'));
console.log(`coverage written for ${modules.length} modules`);
