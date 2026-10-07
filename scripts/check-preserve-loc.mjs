#!/usr/bin/env node
// Guards a prose rewrite: compares each module with its committed version (git HEAD) and fails if
// a citation, link, figure, answer key or option count was lost or changed. New citations are
// listed for review rather than failed.
//   node scripts/check-preserve-loc.mjs [module-prefix]
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'src/loc/modules/';
const filter = process.argv[2];
const files = readdirSync(dir).filter(f => f.endsWith('.json') && (!filter || f.startsWith(filter))).sort();

const cites = text => {
  const out = [];
  for (const m of text.matchAll(/\(([A-Z][A-Za-z&. ]+? (?:\d{4}|DeMyer)[^()]*?)\)/g)) out.push(...m[1].split(/;\s*/).map(s => s.trim()));
  for (const m of text.matchAll(/\((DeMyer, pp?\. [^()]+)\)/g)) out.push(m[1]);
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) out.push(m[1]);
  for (const m of text.matchAll(/\[\[([a-z0-9-]+)\|/g)) out.push("[[" + m[1]);
  return out.map(c => c.replace(/\s+/g, ' ').replace(/–/g, '-'));
};
const allText = m => JSON.stringify([m.why, m.description, m.opener, m.sections.map(s => [s.content, s.keyPoints, s.question]), m.quiz]);

let problems = 0;
for (const f of files) {
  let old;
  try { old = JSON.parse(execSync(`git show HEAD:${dir}${f}`, { encoding: 'utf8' })); } catch { console.log(`- ${f}: new file, skipped`); continue; }
  const cur = JSON.parse(readFileSync(dir + f, 'utf8'));
  const msgs = [];
  if (old.sections.length !== cur.sections.length) msgs.push(`section count ${old.sections.length} → ${cur.sections.length}`);
  old.sections.forEach((s, i) => {
    const c = cur.sections[i]; if (!c) return;
    if ((s.figure || '') !== (c.figure || '')) msgs.push(`section ${i + 1}: figure ${s.figure} → ${c.figure}`);
    if (!!s.discussion !== !!c.discussion) msgs.push(`section ${i + 1}: discussion flag changed`);
    if (s.question && (!c.question || s.question.answer !== c.question.answer || s.question.options.length !== c.question.options.length)) msgs.push(`section ${i + 1}: inline question answer/options changed`);
  });
  // A quiz may be trimmed (the cap is 5): each remaining question is matched to its old self by
  // its correct option, and must keep that answer and option count.
  const key = q => q.options[q.answer];
  if (cur.quiz.length > old.quiz.length) msgs.push(`quiz count ${old.quiz.length} → ${cur.quiz.length}`);
  cur.quiz.forEach((c, i) => { const q = old.quiz.find(o => key(o) === key(c)); if (!q || c.answer !== q.answer || c.options.length !== q.options.length) msgs.push(`quiz ${i + 1}: answer/options changed`); });
  const dropped = old.quiz.filter(q => !cur.quiz.some(c => key(c) === key(q)));
  for (const k of ['id', 'number', 'track', 'color', 'core']) if (JSON.stringify(old[k]) !== JSON.stringify(cur[k])) msgs.push(`${k} changed`);
  if (JSON.stringify(old.sources) !== JSON.stringify(cur.sources)) msgs.push(`sources list changed`);
  if (old.opener?.source !== cur.opener?.source) msgs.push(`opener source changed`);
  const before = cites(allText(old)), after = cites(allText(cur));
  const lost = [...new Set(before)].filter(c => !after.includes(c));
  const added = [...new Set(after)].filter(c => !before.includes(c));
  if (lost.length) msgs.push(`citations lost: ${lost.join(' | ')}`);
  problems += msgs.length;
  console.log(`${msgs.length ? '✗' : '✓'} ${f}${added.length ? `  (new citations to review: ${added.join(' | ')})` : ''}`);
  dropped.forEach(q => console.log(`    quiz question dropped: ${q.question.slice(0, 70)}...`));
  msgs.forEach(m => console.log('    ' + m));
}
console.log(problems ? `\n${problems} problem(s)` : '\nnothing lost');
process.exit(problems ? 1 : 0);
