#!/usr/bin/env node
// Validates EEG module JSON against the content rules in docs/eeg/design-spec.md.
//   node scripts/validate-eeg.mjs            # all modules
//   node scripts/validate-eeg.mjs m03        # one module (prefix match)
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../src/eeg/modules/', import.meta.url).pathname;
const filter = process.argv[2];
const files = readdirSync(dir).filter(f => f.endsWith('.json') && (!filter || f.startsWith(filter))).sort();

// PMIDs known to src/eeg/sources.ts (kept in sync by hand; the check catches typos).
const srcTs = readFileSync(new URL('../src/eeg/sources.ts', import.meta.url), 'utf8');
const knownPmids = new Set([...srcTs.matchAll(/pmid: '(\d+)'/g)].map(m => m[1]));
const knownKeys = new Set([...srcTs.matchAll(/^\s+(\w+): \{ key:/gm)].map(m => m[1]));
// Planned curriculum ids (see docs/eeg/design-spec.md); internal links may point at any of them.
export const PLANNED_IDS = [
  'm01-signals', 'm02-read-and-report', 'm03-artifacts', 'm04-normal-by-age', 'm05-variants',
  'm06-neonatal-maturation', 'm07-neonatal-abnormal', 'm08-interictal', 'm09-syndromes',
  'm10-seizures-status', 'm11-critical-care', 'm12-supervised-reading',
];
const allIds = new Set(PLANNED_IDS);
const figureIds = new Set(JSON.parse(readFileSync(new URL('../src/eeg/figures.json', import.meta.url), 'utf8')).map(f => f.id));

const TRACKS = ['foundation', 'neonatal', 'abnormal', 'icu', 'longitudinal'];
const TAGS = ['EEG Fundamentals', 'Normal & Variants', 'Neonatal & ICU', 'Abnormal & Ictal', 'Clinical Decision-Making'];
const HEDGES = /\b(often|may|can|usually|typically|commonly|frequently|rarely)\b[^.]*\b\d+(\.\d+)?\s*%/i;

let problems = 0;
const fail = (f, msg) => { problems++; console.log(`  ✗ ${f}: ${msg}`); };
const warn = (f, msg) => console.log(`  ! ${f}: ${msg}`);

function checkQuestion(f, q, where) {
  if (!q.question || !Array.isArray(q.options) || !q.explanation) return fail(f, `${where}: malformed question`);
  if (q.options.length !== 4) fail(f, `${where}: needs exactly 4 options (has ${q.options.length})`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(f, `${where}: answer index out of range`);
  if (q.explanation.length < 120) fail(f, `${where}: explanation too short to teach the distractors (${q.explanation.length} chars)`);
  if (/^name this|^what is this wave/i.test(q.question)) warn(f, `${where}: recall-style stem; prefer a decision`);
  if (/\boption[s]? [A-D]\b/i.test(q.explanation)) fail(f, `${where}: explanation refers to options by letter; describe the option instead (keys are shuffled)`);
}

function checkMarkup(f, text, where) {
  const bolds = (text.match(/\*\*/g) || []).length;
  if (bolds % 2) fail(f, `${where}: unbalanced ** markup`);
  for (const m of text.matchAll(/\[\[([^|\]]+)\|[^\]]*\]\]/g)) {
    if (!allIds.has(m[1])) fail(f, `${where}: internal link to unknown module "${m[1]}"`);
  }
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    const url = m[1];
    const pm = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/);
    if (pm && !knownPmids.has(pm[1])) fail(f, `${where}: PMID ${pm[1]} is not in sources.ts (unverified)`);
  }
  if (HEDGES.test(text)) warn(f, `${where}: hedged number ("often/may … %"); make sure it is sourced`);
}

for (const f of files) {
  let m;
  try { m = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { fail(f, `invalid JSON: ${e.message}`); continue; }
  const before = problems;
  for (const k of ['id', 'number', 'title', 'short', 'description', 'why', 'track', 'tags', 'difficulty', 'duration', 'color', 'objectives', 'sections', 'quiz', 'resources', 'signOff', 'sources']) {
    if (m[k] === undefined) fail(f, `missing field ${k}`);
  }
  if (!f.startsWith(m.id)) fail(f, `file name must start with id (${m.id})`);
  if (!TRACKS.includes(m.track)) fail(f, `unknown track ${m.track}`);
  for (const t of m.tags || []) if (!TAGS.includes(t)) fail(f, `unknown tag ${t}`);
  if (!/^#[0-9a-f]{6}$/i.test(m.color || '')) fail(f, `color must be a hex value`);
  if ((m.objectives || []).length < 3) fail(f, `fewer than 3 objectives`);
  if ((m.sections || []).length < 4 || (m.sections || []).length > 7) fail(f, `sections: ${(m.sections || []).length} (want 4–7)`);
  const answers = [];
  (m.sections || []).forEach((s, i) => {
    const where = `section ${i + 1} "${s.title}"`;
    const words = (s.content || '').split(/\s+/).length;
    if (words < 120) fail(f, `${where}: prose is ${words} words (want ≥120)`);
    if (words > 700) warn(f, `${where}: prose is ${words} words; consider splitting`);
    if (!s.keyPoints || s.keyPoints.length < 3 || s.keyPoints.length > 5) fail(f, `${where}: keyPoints ${s.keyPoints?.length ?? 0} (want 3–5)`);
    checkMarkup(f, s.content || '', where);
    for (const id of s.figures || []) if (!figureIds.has(id)) fail(f, `${where}: unknown figure ${id}`);
    if (s.question) { checkQuestion(f, s.question, where + ' inline'); answers.push(s.question.answer); }
    else warn(f, `${where}: no inline question`);
    if ((s.content || '').split('\n').some(l => l.trim().startsWith('|') && l.includes('[['))) fail(f, `${where}: wiki-link inside a table row`);
  });
  if ((m.quiz || []).length < 5) fail(f, `quiz has ${(m.quiz || []).length} questions (want ≥5)`);
  (m.quiz || []).forEach((q, i) => { checkQuestion(f, q, `quiz ${i + 1}`); answers.push(q.answer); });
  const distinct = new Set(answers);
  if (answers.length >= 4 && distinct.size < 3) fail(f, `answer key uses only positions ${[...distinct].join(',')} (shuffle them)`);
  const counts = [0, 1, 2, 3].map(i => answers.filter(a => a === i).length);
  if (Math.max(...counts) > Math.ceil(answers.length * 0.5)) warn(f, `answer key skewed: ${counts.join('/')}`);
  for (const k of m.sources || []) if (!knownKeys.has(k)) fail(f, `unknown source key ${k}`);
  for (const r of m.resources || []) if (!/^https?:\/\//.test(r.url || '')) fail(f, `resource "${r.label}" has no URL`);
  if (!m.signOff || m.signOff.length < 40) fail(f, `signOff missing or too short`);
  console.log(`${problems === before ? '✓' : '✗'} ${f}: ${m.sections?.length} sections, ${m.quiz?.length} quiz, ${answers.length} questions`);
}
console.log(problems ? `\n${problems} problem(s)` : '\nall modules pass');
process.exit(problems ? 1 : 0);
