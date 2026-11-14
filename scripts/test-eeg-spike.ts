// Tests for the spike-criteria trainer model. Each assertion is a fact a reader would check.
//   npx tsx scripts/test-eeg-spike.ts
import {
  CASES, CRITERIA, CRITERION_IDS, countCriteria, classify, synthesize, measure,
  SPIKE_MS, SHARP_MS, GLOSSARY_THRESHOLD, STRICT_THRESHOLD, type Criteria,
} from '../src/eeg/spike-model';

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' — ' + detail : ''}`); } };

// ── Criteria list and thresholds
t('six criteria, numbered 1 to 6', CRITERIA.length === 6 && CRITERIA.every((c, i) => c.n === i + 1));
t('glossary threshold is 4, stricter threshold is 5', GLOSSARY_THRESHOLD === 4 && STRICT_THRESHOLD === 5);
const all = (v: boolean): Criteria => Object.fromEntries(CRITERION_IDS.map(id => [id, v])) as Criteria;
t('count of none is 0, of all is 6', countCriteria(all(false)) === 0 && countCriteria(all(true)) === 6);
t('count of a mixed set', countCriteria({ ...all(false), morphology: true, field: true, slowWave: true }) === 3);
t('6 and 5 are epileptiform', classify(6) === 'epileptiform' && classify(5) === 'epileptiform');
t('4 meets only the glossary bar', classify(4) === 'search-for-fifth');
t('3, 2, 1, 0 are not epileptiform', [0, 1, 2, 3].every(n => classify(n) === 'not-epileptiform'));

// ── Cases
t('8 to 12 cases', CASES.length >= 8 && CASES.length <= 12, String(CASES.length));
t('case ids are unique', new Set(CASES.map(c => c.id)).size === CASES.length);
for (const c of CASES) {
  const n = countCriteria(c.criteria);
  t(`${c.id}: marked synthetic`, c.synthetic === true);
  t(`${c.id}: six boolean criteria`, Object.keys(c.criteria).length === 6 && CRITERION_IDS.every(id => typeof c.criteria[id] === 'boolean'));
  t(`${c.id}: an explanation for every criterion`, CRITERION_IDS.every(id => typeof c.explain[id] === 'string' && c.explain[id].length > 5));
  t(`${c.id}: channels and gains line up`, c.channels.length === c.gains.length && c.channels.length >= 3);
  if (c.group === 'epileptiform') t(`${c.id}: epileptiform case meets 5 or 6`, n >= 5, String(n));
  if (c.group === 'borderline') t(`${c.id}: borderline case meets exactly 3 or 4`, n === 3 || n === 4, String(n));
  if (c.group === 'variant' || c.group === 'artifact' || c.group === 'background')
    t(`${c.id}: benign case falls below the glossary threshold`, n < GLOSSARY_THRESHOLD && classify(n) === 'not-epileptiform', String(n));
  t(`${c.id}: no visible text uses em dashes or semicolons`,
    ![c.prompt, c.name, c.takeaway, ...Object.values(c.explain)].some(s => /[—;]/.test(s)));
}
t('spans every group', ['epileptiform', 'borderline', 'variant', 'artifact', 'background'].every(g => CASES.some(c => c.group === g)));
t('borderline cases include a 3 and a 4', CASES.some(c => c.group === 'borderline' && countCriteria(c.criteria) === 3) && CASES.some(c => c.group === 'borderline' && countCriteria(c.criteria) === 4));
t('at least one spike and one sharp wave', CASES.some(c => c.waveType === 'spike') && CASES.some(c => c.waveType === 'sharp'));

// ── The waveforms show their criteria
for (const c of CASES) {
  const syn = synthesize(c);
  const m = measure(c, syn);
  const nominal = c.transient.riseMs + c.transient.fallMs;
  if (c.waveType === 'spike') t(`${c.id}: spike lasts 20 to under 70 ms`, nominal >= SPIKE_MS[0] && nominal < SPIKE_MS[1], String(nominal));
  if (c.waveType === 'sharp') t(`${c.id}: sharp wave lasts 70 to 200 ms`, nominal >= SHARP_MS[0] && nominal <= SHARP_MS[1], String(nominal));
  t(`${c.id}: measured duration tracks the specification`, Math.abs(m.durationMs - nominal) / nominal < 0.4, `${m.durationMs.toFixed(0)} vs ${nominal}`);

  const ratio = Math.min(m.riseMs, m.fallMs) / Math.max(m.riseMs, m.fallMs);
  if (c.criteria.asymmetry) t(`${c.id}: asymmetric, rise and fall differ (ratio <= 0.7)`, ratio <= 0.7, ratio.toFixed(2));
  else t(`${c.id}: symmetric, rise and fall within 25%`, ratio >= 0.75, ratio.toFixed(2));
  if (c.criteria.asymmetry && c.group !== 'artifact') t(`${c.id}: rise is shorter than fall`, m.riseMs < m.fallMs);

  const durRatio = nominal / m.backgroundHalfWaveMs;
  if (c.criteria.duration) t(`${c.id}: duration differs from the background wave`, durRatio < 0.7 || durRatio > 1.4, durRatio.toFixed(2));
  else t(`${c.id}: duration matches the background wave`, durRatio >= 0.8 && durRatio <= 1.25, durRatio.toFixed(2));

  if (c.criteria.morphology) t(`${c.id}: di- or triphasic and no longer than a sharp wave`, m.lobes >= 2 && nominal <= SHARP_MS[1], `lobes ${m.lobes}`);
  else t(`${c.id}: fails morphology, monophasic or too long`, m.lobes < 2 || nominal > SHARP_MS[1]);

  if (c.criteria.slowWave) t(`${c.id}: after-going slow wave present (>= 25% of the peak)`, m.slowWaveFraction >= 0.25, m.slowWaveFraction.toFixed(2));
  else t(`${c.id}: no after-going slow wave (< 5% of the peak)`, m.slowWaveFraction < 0.05, m.slowWaveFraction.toFixed(2));

  if (c.criteria.field) t(`${c.id}: field, a neighbor shows >= 20% of the peak`, m.neighborFraction >= 0.2, m.neighborFraction.toFixed(2));
  else t(`${c.id}: no field, no other channel deflects`, m.neighborFraction === 0, m.neighborFraction.toFixed(2));

  if (c.criteria.disruption) t(`${c.id}: background drops after the transient`, m.backgroundRatio < 0.6, m.backgroundRatio.toFixed(2));
  else t(`${c.id}: background unchanged after the transient`, m.backgroundRatio > 0.75, m.backgroundRatio.toFixed(2));

  t(`${c.id}: polarity of the maximum channel matches the specification`,
    Math.sign(syn.channels[syn.maxChannel].transient[Math.round(syn.marks.peak * 500)]) === c.transient.polarity);
}

// ── Variant-specific facts from the Module 5 table and the glossary
const get = (id: string) => CASES.find(c => c.id === id)!;
const bets = get('bets-like');
t('small sharp spike: under 50 ms and under 50 µV', bets.transient.riseMs + bets.transient.fallMs < 50 && bets.transient.amplitude < 50);
const posts = get('posts-like');
t('POSTS-like: positive, occipital maximum, under 50 µV', posts.transient.polarity === 1 && posts.channels[synthesize(posts).maxChannel].startsWith('O') && posts.transient.amplitude < 50);
const vertex = get('vertex');
t('vertex wave: negative, maximal at Cz', vertex.transient.polarity === -1 && vertex.channels[synthesize(vertex).maxChannel] === 'Cz');
t('wicket-like: no after-going slow wave', !get('wicket-like').transient.slowWave && !get('wicket-like').criteria.slowWave);
t('electrode pop: one electrode only', get('electrode-pop').gains.filter(g => g !== 0).length === 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
