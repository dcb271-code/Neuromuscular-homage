#!/usr/bin/env node
// Validates neuroradiology module JSON (adapted from scripts/validate-loc.mjs), and reports
// visible word counts per section and per module.
//   node scripts/validate-nrad.mjs            # all modules
//   node scripts/validate-nrad.mjs m02        # one module (prefix match)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dir = join(root, 'src/nrad/modules/');
const filter = process.argv[2];
const files = readdirSync(dir).filter(f => f.endsWith('.json') && (!filter || f.startsWith(filter))).sort();

const srcTs = readFileSync(join(root, 'src/nrad/sources.ts'), 'utf8');
const knownPmids = new Set([...srcTs.matchAll(/pmid: '(\d+)'/g)].map(m => m[1]));
const knownKeys = new Set([...srcTs.matchAll(/^\s+(\w+): \{ key:/gm)].map(m => m[1]));
const curTs = readFileSync(join(root, 'src/nrad/curriculum.ts'), 'utf8');
const PLAN = [...curTs.matchAll(/\{ number: (\d+), id: '([^']+)'.*?track: '(\w+)', status: '(\w+)'/g)].map(m => ({ number: +m[1], id: m[2], track: m[3], status: m[4] }));
const TRACKS = [...curTs.matchAll(/^\s+(\w+): \{ name:/gm)].map(m => m[1]);
const liveIds = new Set(PLAN.filter(p => p.status === 'live').map(p => p.id));
const WIDGETS = ['ct-window-lab', 'hemorrhage-sorter'];
const TAGS = ['CT', 'MRI', 'Ultrasound', 'Vascular', 'Fetal', 'Trauma', 'Pediatric Normals', 'Clinical Decision-Making', 'Radiation Safety'];
const HEDGES = /\b(often|may|can|usually|typically|commonly|frequently|rarely)\b[^.]*\b\d+(\.\d+)?\s*%/i;

// Other curricula and the atlas, for checking cross-links.
const locDir = join(root, 'src/loc/modules/');
const locModules = Object.fromEntries(readdirSync(locDir).filter(f => f.endsWith('.json')).map(f => { const m = JSON.parse(readFileSync(join(locDir, f), 'utf8')); return [m.id, m.sections.length]; }));
const eegDir = join(root, 'src/eeg/modules/');
const eegModules = existsSync(eegDir) ? Object.fromEntries(readdirSync(eegDir).filter(f => f.endsWith('.json')).map(f => { const m = JSON.parse(readFileSync(join(eegDir, f), 'utf8')); return [m.id, m.sections.length]; })) : {};
const manifest = JSON.parse(readFileSync(join(root, 'public/atlas/manifest.json'), 'utf8'));
const labelSets = {};
for (const a of manifest.ages) {
  const cm = a.files?.labels?.colormap;
  labelSets[a.id] = cm ? new Set(JSON.parse(readFileSync(join(root, 'public/atlas', cm), 'utf8')).labels.filter(Boolean)) : null;
}

let problems = 0;
const fail = (f, msg) => { problems++; console.log(`  ✗ ${f}: ${msg}`); };
const warn = (f, msg) => console.log(`  ! ${f}: ${msg}`);
const visibleWords = (text) => text.replace(/^:::deeper[^\n]*\n[\s\S]*?\n:::\s*$/gm, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[|*#>-]+/g, ' ').split(/\s+/).filter(Boolean).length;
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;

function checkHref(f, href, where) {
  if (!href.startsWith('/')) return;
  const [path, query = ''] = href.split('?');
  const [p, hash] = path.split('#');
  const seg = p.replace(/\/$/, '').split('/').filter(Boolean);
  if (seg[0] === 'localization' && seg[1]) {
    if (!(seg[1] in locModules)) return fail(f, `${where}: link to unknown localization module ${seg[1]}`);
    if (hash && (!/^s\d+$/.test(hash) || +hash.slice(1) > locModules[seg[1]])) fail(f, `${where}: anchor #${hash} not in ${seg[1]}`);
  } else if (seg[0] === 'eeg' && seg[1] && !['gallery', 'review'].includes(seg[1])) {
    if (!(seg[1] in eegModules)) fail(f, `${where}: link to unknown EEG module ${seg[1]}`);
  } else if (seg[0] === 'neuroradiology' && seg[1] === 'atlas') {
    const q = new URLSearchParams(query);
    const age = q.get('age'), label = q.get('label');
    if (age && !(age in labelSets)) fail(f, `${where}: atlas age "${age}" not in manifest`);
    if (label && age && (!labelSets[age] || !labelSets[age].has(label))) fail(f, `${where}: atlas label "${label}" not available at age ${age}`);
  } else if (seg[0] === 'neuroradiology' && seg[1] && !['review'].includes(seg[1])) {
    if (!liveIds.has(seg[1])) fail(f, `${where}: link to neuroradiology module ${seg[1]}, which is not live`);
  }
}

function checkQuestion(f, q, where) {
  if (!q.question || !Array.isArray(q.options) || !q.explanation) return fail(f, `${where}: malformed question`);
  if (q.options.length !== 4) fail(f, `${where}: needs exactly 4 options (has ${q.options.length})`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(f, `${where}: answer index out of range`);
  if (q.explanation.length < 120) fail(f, `${where}: explanation too short to teach the distractors (${q.explanation.length} chars)`);
  if (wordCount(q.explanation) > 65) warn(f, `${where}: explanation is ${wordCount(q.explanation)} words (budget about 60)`);
  if (/\boption[s]? [A-D]\b/i.test(q.explanation)) fail(f, `${where}: explanation refers to options by letter`);
}

function checkMarkup(f, text, where) {
  if ((text.match(/\*\*/g) || []).length % 2) fail(f, `${where}: unbalanced ** markup`);
  for (const m of text.matchAll(/\[\[([^|\]]+)\|[^\]]*\]\]/g)) if (!liveIds.has(m[1])) fail(f, `${where}: internal link to a module that is not live "${m[1]}"`);
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    const pm = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/);
    if (pm && !knownPmids.has(pm[1])) fail(f, `${where}: PMID ${pm[1]} is not in src/nrad/sources.ts (unverified)`);
    checkHref(f, url, where);
  }
  if (HEDGES.test(text)) warn(f, `${where}: hedged number ("often/may … %"); make sure it is sourced`);
  if (/;/.test(text.replace(/\]\([^)]*\)/g, ''))) warn(f, `${where}: contains a semicolon (style guide)`);
}

const report = [];
for (const f of files) {
  let m;
  try { m = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { fail(f, `invalid JSON: ${e.message}`); continue; }
  const before = problems;
  for (const k of ['id', 'number', 'title', 'short', 'description', 'why', 'track', 'tags', 'difficulty', 'duration', 'color', 'objectives', 'sections', 'quiz', 'resources', 'signOff', 'sources']) {
    if (m[k] === undefined) fail(f, `missing field ${k}`);
  }
  if (!f.startsWith(m.id)) fail(f, `file name must start with id (${m.id})`);
  const plan = PLAN.find(p => p.id === m.id);
  if (!plan) fail(f, `id ${m.id} is not in NRAD_PLAN`);
  else {
    if (plan.number !== m.number) fail(f, `number ${m.number} differs from the plan (${plan.number})`);
    if (plan.track !== m.track) fail(f, `track ${m.track} differs from the plan (${plan.track})`);
    if (plan.status !== 'live') fail(f, `module exists but the plan marks it ${plan.status}`);
  }
  if (!TRACKS.includes(m.track)) fail(f, `unknown track ${m.track}`);
  for (const t of m.tags || []) if (!TAGS.includes(t)) fail(f, `unknown tag ${t}`);
  if (!/^#[0-9a-f]{6}$/i.test(m.color || '')) fail(f, `color must be a hex value`);
  if ((m.objectives || []).length < 3) fail(f, `fewer than 3 objectives`);
  if ((m.sections || []).length < 4 || (m.sections || []).length > 7) fail(f, `sections: ${(m.sections || []).length} (want 4–7)`);
  const answers = [];
  const counts = [];
  (m.sections || []).forEach((s, i) => {
    const where = `section ${i + 1} "${s.title}"`;
    const words = visibleWords(s.content || '');
    counts.push(words);
    if (words < 120) fail(f, `${where}: prose is ${words} words (want ≥120)`);
    if (words > 400) fail(f, `${where}: ${words} visible words (budget 400)`);
    const deepers = (s.content.match(/^:::deeper/gm) || []).length;
    if (deepers !== (s.content.match(/^:::\s*$/gm) || []).length) fail(f, `${where}: unbalanced :::deeper block`);
    if (deepers > 1) fail(f, `${where}: more than one :::deeper box`);
    if (!s.keyPoints || s.keyPoints.length < 3 || s.keyPoints.length > 5) fail(f, `${where}: keyPoints ${s.keyPoints?.length ?? 0} (want 3–5)`);
    checkMarkup(f, s.content || '', where);
    for (const kp of s.keyPoints || []) checkMarkup(f, kp, `${where} key point`);
    if (s.figure && !WIDGETS.includes(s.figure)) fail(f, `${where}: unknown widget ${s.figure}`);
    for (const r of s.related || []) {
      if (!r.href || !r.label) fail(f, `${where}: related link needs href and label`);
      else checkHref(f, r.href, `${where} related`);
    }
    if (s.question) { checkQuestion(f, s.question, where + ' inline'); answers.push(s.question.answer); }
    else fail(f, `${where}: no inline question`);
    if ((s.content || '').split('\n').some(l => l.trim().startsWith('|') && l.includes('[['))) fail(f, `${where}: wiki-link inside a table row`);
  });
  if ((m.quiz || []).length < 3) fail(f, `quiz has ${(m.quiz || []).length} questions (want 3–5)`);
  if ((m.quiz || []).length > 5) fail(f, `quiz has ${m.quiz.length} questions (cap is 5)`);
  (m.quiz || []).forEach((q, i) => { checkQuestion(f, q, `quiz ${i + 1}`); answers.push(q.answer); });
  const distinct = new Set(answers);
  if (answers.length >= 4 && distinct.size < 3) fail(f, `answer key uses only positions ${[...distinct].join(',')} (shuffle them)`);
  const pos = [0, 1, 2, 3].map(i => answers.filter(a => a === i).length);
  if (Math.max(...pos) > Math.ceil(answers.length * 0.4)) warn(f, `answer key skewed: ${pos.join('/')}`);
  for (const k of m.sources || []) if (!knownKeys.has(k)) fail(f, `unknown source key ${k}`);
  // Every PMID cited in prose must be listed in the module's sources.
  const cited = new Set([...JSON.stringify(m.sections).matchAll(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/g)].map(x => x[1]));
  const listed = new Set((m.sources || []).map(k => (srcTs.match(new RegExp(`\\b${k}: \\{ key: '${k}', pmid: '(\\d+)'`)) || [])[1]).filter(Boolean));
  for (const p of cited) if (!listed.has(p)) fail(f, `PMID ${p} is cited in prose but its key is not in sources[]`);
  for (const r of m.resources || []) if (!/^https?:\/\//.test(r.url || '')) fail(f, `resource "${r.label}" has no URL`);
  if (!m.signOff || m.signOff.length < 40) fail(f, `signOff missing or too short`);
  if (!m.opener || !(m.opener.parable || m.opener.history)) fail(f, `missing opener (parable and/or history)`);
  if (m.opener?.history && !m.opener.source) fail(f, `opener history needs a source`);
  for (const k of ['parable', 'history']) if (m.opener?.[k] && wordCount(m.opener[k]) > 90) fail(f, `opener ${k} is over 90 words`);
  if (/—/.test(JSON.stringify(m))) fail(f, `contains an em dash`);
  const total = counts.reduce((a, b) => a + b, 0);
  report.push(`${m.id}: ${total} visible words in ${counts.length} sections [${counts.join(', ')}]`);
  console.log(`${problems === before ? '✓' : '✗'} ${f}: ${m.sections?.length} sections, ${m.quiz?.length} quiz, ${answers.length} questions`);
}
console.log('\nWord counts (visible prose, excluding Go deeper boxes):');
for (const r of report) console.log('  ' + r);
console.log(problems ? `\n${problems} problem(s)` : '\nall modules pass');
process.exit(problems ? 1 : 0);
