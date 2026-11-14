// Tests for the guided figure tours (src/eeg/annotations.json).
//   npx tsx scripts/test-eeg-annotations.ts
import { readFileSync } from 'node:fs';
import { TOURS, tourProblems, tourFor, stepFocus, type FigureTour } from '../src/eeg/annotations';

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' (' + detail + ')' : ''}`); } };

const figures: { id: string; width: number; height: number }[] = JSON.parse(readFileSync(new URL('../src/eeg/figures.json', import.meta.url), 'utf8'));
const ids = new Set(figures.map(f => f.id));

t('between 6 and 8 tours', TOURS.length >= 6 && TOURS.length <= 8, String(TOURS.length));
t('the data passes every check', tourProblems(TOURS, ids).length === 0, tourProblems(TOURS, ids).join('; '));

for (const tour of TOURS) {
  t(`${tour.figureId} exists in figures.json`, ids.has(tour.figureId));
  t(`${tour.figureId} has 3 to 5 steps`, tour.steps.length >= 3 && tour.steps.length <= 5, String(tour.steps.length));
  t(`${tour.figureId} has at least one step with a region`, tour.steps.some(s => s.regions.length > 0));
  tour.steps.forEach((s, i) => {
    const at = `${tour.figureId} step ${i + 1}`;
    t(`${at} caption non-empty`, s.caption.trim().length > 0);
    t(`${at} caption has no em dash`, !s.caption.includes('—'));
    t(`${at} caption has no semicolon`, !s.caption.includes(';'));
    t(`${at} caption is one or two sentences`, (s.caption.match(/[.?!](\s|$)/g) ?? []).length <= 2, s.caption);
    for (const r of s.regions) {
      const vals = [r.x, r.y, r.width, r.height];
      t(`${at} ${r.label} coordinates in 0..1`, vals.every(v => v >= 0 && v <= 1), vals.join(','));
      t(`${at} ${r.label} stays on the image`, r.x + r.width <= 1.0001 && r.y + r.height <= 1.0001);
      t(`${at} ${r.label} has a label`, r.label.trim().length > 0);
    }
  });
}

// The validator itself catches bad data.
const bad: FigureTour[] = [
  { figureId: 'nope', steps: [{ caption: 'One; two', regions: [{ kind: 'box', x: 0.9, y: -0.1, width: 0.2, height: 0.1, label: 'x' }] }] },
];
const probs = tourProblems(bad, ids);
t('validator flags unknown figure', probs.some(p => p.includes('not in figures.json')));
t('validator flags step count', probs.some(p => p.includes('steps')));
t('validator flags semicolon', probs.some(p => p.includes('semicolon')));
t('validator flags out-of-range coordinate', probs.some(p => p.includes('outside 0..1')));
t('validator flags region off the image', probs.some(p => p.includes('runs off')));

t('tourFor finds a tour', tourFor(TOURS[0].figureId) === TOURS[0]);
t('tourFor returns undefined for a figure without one', tourFor('aes-f19') === undefined);
t('stepFocus is null for a caption-only step', stepFocus({ caption: 'x', regions: [] }) === null);
const f = stepFocus({ caption: 'x', regions: [{ kind: 'box', x: 0.2, y: 0.2, width: 0.2, height: 0.2, label: 'a' }] });
t('stepFocus centers on the region', !!f && Math.abs(f.x - 0.3) < 1e-9 && Math.abs(f.y - 0.3) < 1e-9);

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
