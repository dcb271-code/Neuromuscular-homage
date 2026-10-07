#!/usr/bin/env node
// Style check for localization prose: counts the habits that make text read as machine-written
// (clipped aphorisms, "not X but Y" antitheses, colon reveals, paragraph-ending zingers, stock
// phrases). It measures; it does not judge meaning. See docs/localization/style-guide.md.
//   node scripts/style-loc.mjs            # summary per module
//   node scripts/style-loc.mjs m04 -v     # list every flagged sentence
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../src/loc/modules/', import.meta.url).pathname;
const args = process.argv.slice(2);
const verbose = args.includes('-v');
const filter = args.find(a => !a.startsWith('-'));

const STOCK = [
  /\bthe whole (diagnosis|point|game|story)\b/i, /\buntil prove[dn] otherwise\b/i, /\bthat is the point\b/i, /\bhere is the (thing|point|catch)\b/i,
  /\bthe lesson\b/i, /\bin other words\b/i, /\bput simply\b/i, /\bquietly\b/i, /\bit turns out\b/i, /\bthe answer is simple\b/i,
  /\bsame [a-z]+, different [a-z]+/i, /\bone [a-z]+, (two|three|four) [a-z]+/i, /\bnot a [a-z]+[;,] (but )?an? [a-z]+\b/i,
  /\bthe rest is\b/i, /\bis the tell\b/i, /\bdoes the (heavy lifting|work)\b/i, /\bspeaks? louder\b/i, /\bsigns its name\b/i,
];
const ANTITHESIS = [
  /\bis not [^.;:]{1,60}[;,.] (it is|it's|but)\b/i, /\bnot [^.;:,]{1,40}, but [^.;:]{1,40}/i, /, not [^.;:,]{1,30}\.$/i,
  /\b(isn't|is not|are not|aren't) [^.]{1,50}\. (It|They)('s| is| are)\b/,
];

// Softer tells, listed with -v: throat-clearing and framing openers, and trailing participial phrases.
const FRAMING = [
  /^(It is|It's) worth (noting|remembering|saying|asking)\b/i, /^(Crucially|Importantly|Notably|Interestingly|Ultimately|Of course|In short|In practice|Remember that|Note that|Keep in mind)\b/,
  /^While [^,]{1,80}, /, /\bit depends on\b/i, /\b(the|this) (key|real) (question|point|insight)\b/i,
];
const TRAIL = /, (making|leaving|giving|turning|allowing|creating|producing|meaning|suggesting|showing|reflecting|ensuring|pointing|helping|letting|revealing|adding)\b[^,]*\.$/;

const sentencesOf = text => text
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1')
  .replace(/\((?:[A-Z][^()]{0,60}\d{4}[^()]*|DeMyer[^()]*|Utah[^()]*)\)/g, '')
  .split(/(?<=[.!?])\s+(?=[A-Z"*>])/).map(s => s.replace(/\*\*/g, '').trim()).filter(s => s && !/^[-|>]/.test(s));
const words = s => s.split(/\s+/).filter(Boolean).length;
// Sources named as the subject of prose (outside citation parentheses and link text).
const NAMED = /\b(Brazis|DeMyer|Pearl|Emsellem|Morris|Fisch|Arslan|Gill|Peredo|Hannibal|Daum|Sonoo|Borusiak|Benbadis|Richards|Gates|Volpe|Rosenbaum|Zafeiriou|Hilliard|Larsen|Stensaas)\b/;

function scoreText(text) {
  const out = { words: 0, sentences: 0, short: [], antithesis: [], framing: [], trail: [], colon: [], stock: [], zinger: [], semicolon: 0, long: [], named: [] };
  const paras = text.split(/\n\n+|\n(?=- |\d+\. )/);
  for (const [pi, para] of paras.entries()) {
    const p = para.trim();
    if (/^(- |\d+\. )/.test(p)) continue; // list items are not prose sentences
    const leadIn = /^(- |\d+\. )/.test((paras[pi + 1] || '').trim());
    if (!p || /^\*\*[^*]+\*\*$/.test(p) || p.startsWith('|')) continue;
    const ss = sentencesOf(p);
    ss.forEach((s, i) => {
      const w = words(s); out.words += w; out.sentences++;
      if (w <= 7 && !leadIn && !/^(Use the figure|Try it)/.test(s)) out.short.push(s);
      if (w > 38) out.long.push(s);
      if (NAMED.test(s)) out.named.push(s);
      if (ANTITHESIS.some(r => r.test(s))) out.antithesis.push(s);
      const body = s.replace(/^\*\*[^*]+\*\*\s*/, '').replace(/^[A-Z][a-z ]{0,25}:/, '');
      if (/[a-z)]: [a-z]/.test(body) && !/\b(e\.g|i\.e)\b/.test(body)) out.colon.push(s);
      if (STOCK.some(r => r.test(s))) out.stock.push(s);
      if (FRAMING.some(r => r.test(s))) out.framing.push(s);
      if (TRAIL.test(s)) out.trail.push(s);
      if (i === ss.length - 1 && ss.length > 1 && w <= 9 && !leadIn) out.zinger.push(s);
      out.semicolon += (s.match(/;/g) || []).length;
    });
  }
  return out;
}

const files = readdirSync(dir).filter(f => f.endsWith('.json') && (!filter || f.startsWith(filter))).sort();
let tot = { words: 0, short: 0, antithesis: 0, colon: 0, stock: 0, zinger: 0, semicolon: 0, sentences: 0, long: 0, named: 0 };
console.log('module                       words  short%  anti  colon  stock  zinger  semi/1k  long  named  avg');
for (const f of files) {
  const m = JSON.parse(readFileSync(dir + f, 'utf8'));
  const texts = [m.why, m.description, m.opener?.parable, m.opener?.history, ...m.sections.map(s => s.content.replace(/^:::deeper[^\n]*\n|^:::\s*$/gm, ''))].filter(Boolean);
  const r = scoreText(texts.join('\n\n'));
  for (const k of Object.keys(tot)) tot[k] += Array.isArray(r[k]) ? r[k].length : r[k];
  const pct = r.sentences ? Math.round(100 * r.short.length / r.sentences) : 0;
  console.log(`${f.replace('.json', '').padEnd(28)} ${String(r.words).padStart(5)}  ${String(pct).padStart(5)}%  ${String(r.antithesis.length).padStart(4)}  ${String(r.colon.length).padStart(5)}  ${String(r.stock.length).padStart(5)}  ${String(r.zinger.length).padStart(6)}  ${(1000 * r.semicolon / Math.max(1, r.words)).toFixed(1).padStart(7)}  ${String(r.long.length).padStart(4)}  ${String(r.named.length).padStart(5)}  ${(r.words / Math.max(1, r.sentences)).toFixed(1).padStart(4)}`);
  if (r.framing.length || r.trail.length) console.log(`    [soft] ${r.framing.length} framing openers, ${r.trail.length} trailing participial phrases`);
  const visible = c => c.replace(/^:::deeper[^\n]*\n[\s\S]*?\n:::\s*$/gm, '').split(/\s+/).filter(Boolean).length;
  for (const [i, s] of m.sections.entries()) { const v = visible(s.content); if (v > 400) console.log(`    [budget] section ${i + 1} "${s.title}": ${v} visible words (budget 400)`); }
  for (const q of [...m.sections.map(s => s.question).filter(Boolean), ...m.quiz]) { const w = q.explanation.split(/\s+/).length; if (w > 65) console.log(`    [budget] explanation ${w} words (target 60): ${q.question.slice(0, 60)}...`); }
  if (m.quiz.length > 5) console.log(`    [budget] quiz has ${m.quiz.length} questions (cap 5)`);
  if (verbose) for (const k of ['named', 'long', 'stock', 'antithesis', 'framing', 'trail', 'zinger', 'short', 'colon']) for (const s of r[k]) console.log(`    [${k}] ${s}`);
}
const pct = Math.round(100 * tot.short / Math.max(1, tot.sentences));
console.log(`${'TOTAL'.padEnd(28)} ${String(tot.words).padStart(5)}  ${String(pct).padStart(5)}%  ${String(tot.antithesis).padStart(4)}  ${String(tot.colon).padStart(5)}  ${String(tot.stock).padStart(5)}  ${String(tot.zinger).padStart(6)}  ${(1000 * tot.semicolon / tot.words).toFixed(1).padStart(7)}  ${String(tot.long).padStart(4)}  ${String(tot.named).padStart(5)}  ${(tot.words / tot.sentences).toFixed(1).padStart(4)}`);
console.log('\nTargets per module: short% under 8, antithesis 2 or fewer, colon reveals 6 or fewer, stock 0, zingers 3 or fewer, semicolons under 4 per 1000 words, sentences over 38 words 3 or fewer, sources named in prose 0 (historical figures excepted), average sentence 22 words or fewer.');
