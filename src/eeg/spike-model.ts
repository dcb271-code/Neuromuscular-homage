// Pure model behind the spike-criteria trainer (EEG Module 5, "The IFCN criteria for calling a
// discharge"). A set of single-transient cases, each a short SYNTHETIC referential segment with
// ground truth for the six IFCN criteria, plus the synthesis and measurement code that lets the
// tests check that every waveform really shows what its answer key says. No I/O, no DOM.
//
// Sources (all already in src/eeg/sources.ts):
//   kane2017  — the six criteria, the threshold of 4, spike 20 to under 70 ms, sharp wave
//               70 to 200 ms, and the glossary entries for the named variants.
//   kural2020 — the validation study (retrospective, blinded, 100 patients whose diagnosis was
//               settled by video-EEG of their habitual events). Table 1: at least 4 of 6 gave
//               96.30% sensitivity and 84.78% specificity, at least 5 of 6 gave 81.48% and
//               95.65%, and 5 was judged optimal for clinical use. Interrater agreement was fair
//               for criteria 3 (asymmetry) and 5 (disruption), the least reliable two (Table 2).
//   krauss2005 — wicket rhythms are 6 to 11 Hz bursts.
// Variant cases follow the owner's rule: score benign variants leniently. Where a criterion is
// arguable for a variant (for example a vertex wave's sharp contour), it is scored not met and
// the explanation says why and names the variant's identifying features.
// Waveforms are schematic. Amplitudes and durations are chosen to sit inside the glossary ranges
// where the glossary gives one, and are otherwise illustrative (noted per case).

export type CriterionId = 'morphology' | 'duration' | 'asymmetry' | 'slowWave' | 'disruption' | 'field';

export interface Criterion { id: CriterionId; n: number; name: string; definition: string }

// Wording follows the numbered list in Module 5 and the glossary entry "Epileptiform pattern"
// (Kane 2017), which adds "(i.e. pointed peak)" to criterion 1.
export const CRITERIA: Criterion[] = [
  { id: 'morphology', n: 1, name: 'Sharp morphology', definition: 'Di- or triphasic, with a sharp or spiky morphology (a pointed peak).' },
  { id: 'duration', n: 2, name: 'Different duration', definition: 'Shorter or longer than the waves of the ongoing background.' },
  { id: 'asymmetry', n: 3, name: 'Asymmetric', definition: 'A sharply rising phase and a more slowly decaying one, or the reverse.' },
  { id: 'slowWave', n: 4, name: 'After-going slow wave', definition: 'Followed by an associated slow after-wave.' },
  { id: 'disruption', n: 5, name: 'Disrupts background', definition: 'The background around it is disrupted by it.' },
  { id: 'field', n: 6, name: 'Cerebral field', definition: 'Negative and positive potentials spread across the scalp in a way that implies a source in the brain.' },
];

export const CRITERION_IDS: CriterionId[] = CRITERIA.map(c => c.id);

/** Glossary threshold (Kane 2017) and the threshold with the best specificity (Kural 2020). */
export const GLOSSARY_THRESHOLD = 4;
export const STRICT_THRESHOLD = 5;
export const KURAL_SPECIFICITY = 95.7; // %, at >= 5 of 6 (Kural 2020, Table 1: 95.65)
export const KURAL_SENSITIVITY = 81.5; // %, at >= 5 of 6 (Kural 2020, Table 1: 81.48)
export const KURAL4_SPECIFICITY = 84.8; // %, at >= 4 of 6 (Kural 2020, Table 1: 84.78)
export const KURAL4_SENSITIVITY = 96.3; // %, at >= 4 of 6 (Kural 2020, Table 1: 96.30)

/** Glossary durations (Kane 2017): spike 20 to under 70 ms, sharp wave 70 to 200 ms. */
export const SPIKE_MS: [number, number] = [20, 70];
export const SHARP_MS: [number, number] = [70, 200];

export type Criteria = Record<CriterionId, boolean>;

export type Classification = 'epileptiform' | 'search-for-fifth' | 'not-epileptiform';

export function countCriteria(c: Criteria): number {
  return CRITERION_IDS.reduce((n, id) => n + (c[id] ? 1 : 0), 0);
}

/** 5 or 6: epileptiform at the stricter bar. 4: meets the glossary threshold only, which is
 *  not enough on its own (84.8% specificity in Kural 2020), so the call leans toward not
 *  epileptiform unless a fifth criterion is found and no variant fits. 3 or fewer: below the
 *  glossary threshold, do not call it epileptiform. */
export function classify(count: number): Classification {
  if (count >= STRICT_THRESHOLD) return 'epileptiform';
  if (count >= GLOSSARY_THRESHOLD) return 'search-for-fifth';
  return 'not-epileptiform';
}

// ── Waveform specification ────────────────────────────────────────────────────────────────

export interface TransientSpec {
  polarity: -1 | 1;        // -1 = surface negative (drawn up)
  amplitude: number;       // µV at the maximum channel
  riseMs: number;          // onset to peak
  fallMs: number;          // peak back to baseline
  fallExponent?: number;   // shape of the fall (default 1.6; larger = fast drop then slow tail)
  rounded?: boolean;       // main phase drawn as a half sine: a broad, blunt peak, not a pointed one
  second?: { amp: number; ms: number }; // opposite-polarity phase after the main one (fraction of amplitude)
  slowWave?: { amp: number; ms: number }; // same-polarity slow wave after the second phase
  disruption?: { attenuation: number; ms: number }; // background scaled down after the transient
  repeats?: { offsetMs: number; scale: number }[];  // neighbors in a train (wicket-like run)
}

export interface BackgroundSpec {
  freqHz: number;          // dominant background frequency, sets the "background wave" duration
  amplitude: number;       // µV
}

export type CaseGroup = 'epileptiform' | 'borderline' | 'variant' | 'artifact' | 'background';

export interface SpikeCase {
  id: string;
  synthetic: true;
  group: CaseGroup;
  prompt: string;          // neutral description shown before checking
  name: string;            // revealed after checking
  state: 'Awake' | 'Drowsy' | 'Light sleep';
  waveType?: 'spike' | 'sharp'; // epileptiform cases only, by glossary duration
  channels: string[];      // referential channels, top to bottom
  gains: number[];         // fraction of the transient seen at each electrode (signed by polarity)
  background: BackgroundSpec;
  transient: TransientSpec;
  criteria: Criteria;
  explain: Record<CriterionId, string>;
  takeaway: string;
}

export const FS = 500;           // samples per second
export const WINDOW_S = 1.5;     // context window
export const ONSET_S = 0.55;     // onset of the candidate transient

// ── Cases ─────────────────────────────────────────────────────────────────────────────────

const LT = ['Fp1', 'F7', 'T3', 'T5', 'O1'];
const RT = ['Fp2', 'F8', 'T4', 'T6', 'O2'];
const LP = ['Fp1', 'F3', 'C3', 'P3', 'O1'];
const RP = ['Fp2', 'F4', 'C4', 'P4', 'O2'];

export const CASES: SpikeCase[] = [
  {
    id: 'temporal-spike', synthetic: true, group: 'epileptiform', waveType: 'spike',
    prompt: 'Left temporal transient, drowsy', name: 'Spike with an after-going slow wave',
    state: 'Drowsy', channels: LT, gains: [0.1, 0.55, 1, 0.5, 0.1],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 110, riseMs: 15, fallMs: 30, second: { amp: 0.25, ms: 40 }, slowWave: { amp: 0.45, ms: 220 }, disruption: { attenuation: 0.3, ms: 400 } },
    criteria: { morphology: true, duration: true, asymmetry: true, slowWave: true, disruption: true, field: true },
    explain: {
      morphology: 'A pointed negative peak followed by a smaller positive phase makes it diphasic and spiky.',
      duration: 'The spike lasts about 45 ms, much briefer than the 6 Hz waves around it.',
      asymmetry: 'It rises in about 15 ms and falls in about 30 ms.',
      slowWave: 'A broad negative slow wave of about 220 ms follows it.',
      disruption: 'The background is flattened for several hundred milliseconds afterward.',
      field: 'It is largest at T3 and smaller at F7 and T5, a graded field around a cerebral source.',
    },
    takeaway: 'All six criteria are met.',
  },
  {
    id: 'frontal-sharp', synthetic: true, group: 'epileptiform', waveType: 'sharp',
    prompt: 'Right frontotemporal transient, awake', name: 'Sharp wave with an after-going slow wave',
    state: 'Awake', channels: RT, gains: [0.5, 1, 0.6, 0.2, 0.05],
    background: { freqHz: 9, amplitude: 20 },
    transient: { polarity: -1, amplitude: 120, riseMs: 45, fallMs: 85, second: { amp: 0.2, ms: 50 }, slowWave: { amp: 0.5, ms: 260 }, disruption: { attenuation: 0.35, ms: 450 } },
    criteria: { morphology: true, duration: true, asymmetry: true, slowWave: true, disruption: true, field: true },
    explain: {
      morphology: 'A sharp negative peak with a small positive phase after it, so it is diphasic and sharply contoured.',
      duration: 'At about 130 ms it is a sharp wave, more than twice as long as the 9 Hz background waves.',
      asymmetry: 'It rises in about 45 ms and decays over about 85 ms.',
      slowWave: 'A slow wave of about 260 ms follows.',
      disruption: 'The alpha-range background is suppressed after it.',
      field: 'It peaks at F8 and spreads to Fp2 and T4 with falling amplitude.',
    },
    takeaway: 'All six criteria are met. Its duration makes it a sharp wave rather than a spike.',
  },
  {
    id: 'central-spike', synthetic: true, group: 'epileptiform', waveType: 'spike',
    prompt: 'Left central transient, drowsy', name: 'Spike without background disruption',
    state: 'Drowsy', channels: LP, gains: [0.1, 0.5, 1, 0.55, 0.15],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 100, riseMs: 18, fallMs: 36, second: { amp: 0.2, ms: 40 }, slowWave: { amp: 0.4, ms: 200 } },
    criteria: { morphology: true, duration: true, asymmetry: true, slowWave: true, disruption: false, field: true },
    explain: {
      morphology: 'Pointed and diphasic.',
      duration: 'About 54 ms, shorter than the 6 Hz background waves.',
      asymmetry: 'The rise (about 18 ms) is half the length of the fall (about 36 ms).',
      slowWave: 'A slow wave of about 200 ms follows.',
      disruption: 'The background continues unchanged on both sides of it.',
      field: 'Largest at C3 with a graded spread to F3 and P3.',
    },
    takeaway: 'Five criteria are met, enough at the stricter threshold.',
  },
  {
    id: 'border-4-noslow', synthetic: true, group: 'borderline',
    prompt: 'Right temporal transient, drowsy', name: 'Spiky transient with no slow wave',
    state: 'Drowsy', channels: RT, gains: [0.1, 0.5, 1, 0.45, 0.1],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 80, riseMs: 16, fallMs: 32, second: { amp: 0.3, ms: 35 } },
    criteria: { morphology: true, duration: true, asymmetry: true, slowWave: false, disruption: false, field: true },
    explain: {
      morphology: 'Pointed and diphasic.',
      duration: 'About 48 ms, briefer than the background waves.',
      asymmetry: 'It rises in about 16 ms and falls in about 32 ms. Raters agree on this criterion less than on most others (Kural 2020), so it is the weakest of the four.',
      slowWave: 'The trace returns straight to background with no slow wave.',
      disruption: 'The background is unchanged after it.',
      field: 'Largest at T4 with a graded spread to F8 and T6.',
    },
    takeaway: 'Four criteria, which is not enough on its own. In drowsiness, compare a temporal transient with the temporal variants first. At 80 µV it is too large for a small sharp spike, and it stands alone rather than in a wicket run. With no slow wave and no change in the background, leave it uncalled unless the rest of the record shows the same transient with a fifth criterion.',
  },
  {
    id: 'border-4-samedur', synthetic: true, group: 'borderline',
    prompt: 'Left frontal transient, drowsy', name: 'Sharp transient as long as the background waves',
    state: 'Drowsy', channels: LP, gains: [0.5, 1, 0.5, 0.15, 0.05],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 75, riseMs: 30, fallMs: 55, second: { amp: 0.2, ms: 40 }, slowWave: { amp: 0.4, ms: 220 } },
    criteria: { morphology: true, duration: false, asymmetry: true, slowWave: true, disruption: false, field: true },
    explain: {
      morphology: 'Sharp and diphasic.',
      duration: 'About 85 ms, the same as a half-wave of the 6 Hz background.',
      asymmetry: 'It rises in about 30 ms and decays over about 55 ms. Raters agree on this criterion less than on most others (Kural 2020).',
      slowWave: 'A slow wave of about 220 ms follows.',
      disruption: 'The background runs on unchanged.',
      field: 'Largest at F3 with spread to Fp1 and C3.',
    },
    takeaway: 'Four criteria, which is not enough on its own. A wave the same length as the background, in drowsiness, may be a sharper than usual background wave with a slow wave behind it. Look for the same shape elsewhere in the background, and leave it uncalled unless a fifth criterion is clear.',
  },
  {
    id: 'border-3-nofield', synthetic: true, group: 'borderline',
    prompt: 'Left temporal transient, drowsy', name: 'Spiky transient confined to one electrode',
    state: 'Drowsy', channels: LT, gains: [0, 0, 1, 0, 0],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 70, riseMs: 10, fallMs: 22, second: { amp: 0.3, ms: 30 } },
    criteria: { morphology: true, duration: true, asymmetry: true, slowWave: false, disruption: false, field: false },
    explain: {
      morphology: 'Spiky and diphasic.',
      duration: 'About 32 ms, much briefer than the background waves.',
      asymmetry: 'It rises in about 10 ms and falls in about 22 ms.',
      slowWave: 'No slow wave follows.',
      disruption: 'The background is unchanged after it.',
      field: 'Only T3 shows it. With no distribution beyond one electrode there is no evidence of a brain source, and artifact is more likely (Module 3).',
    },
    takeaway: 'Three criteria, below the glossary threshold. Do not call it epileptiform.',
  },
  {
    id: 'wicket-like', synthetic: true, group: 'variant',
    prompt: 'Left temporal transient in a short run, drowsy', name: 'Wicket wave',
    state: 'Drowsy', channels: LT, gains: [0, 0.4, 1, 0.5, 0.1],
    // Glossary (Kane 2017): spike-like, monophasic, surface-negative single waves or trains over the
    // temporal regions in drowsiness, arcuate or mu-like. Krauss 2005: 6 to 11 Hz. Here each wave
    // is a single negative arch, no opposite phase, no slow wave, at 8 Hz. Amplitude illustrative.
    background: { freqHz: 8, amplitude: 18 },
    transient: { polarity: -1, amplitude: 70, riseMs: 30, fallMs: 32, repeats: [{ offsetMs: -125, scale: 0.8 }, { offsetMs: 125, scale: 0.9 }, { offsetMs: 250, scale: 0.7 }] },
    criteria: { morphology: false, duration: false, asymmetry: false, slowWave: false, disruption: false, field: true },
    explain: {
      morphology: 'Each wave is a single negative arch with no opposite phase. The glossary describes wickets as monophasic (Kane 2017), and criterion 1 asks for a di- or triphasic wave, so a pointed top is not enough.',
      duration: 'About 62 ms, the same as the other waves in the run.',
      asymmetry: 'The rise and fall are about equal.',
      slowWave: 'No slow wave follows. Wickets characteristically lack one.',
      disruption: 'It is one wave of a run that blends with the background, so nothing is interrupted.',
      field: 'It spreads to F7 and T5 from a T3 maximum. That shows a brain source, which a normal rhythm also has.',
    },
    takeaway: 'One criterion, the field, which shows only that the wave comes from the brain. Recognize a wicket by its setting and shape. It is temporal, in drowsiness, and monophasic and arch-shaped, in runs at 6 to 11 Hz in which each wave looks like its neighbors, with no slow wave (Kane 2017, Krauss 2005). Wickets also occur singly, and a single one is harder to recognize, so look for runs elsewhere in drowsiness.',
  },
  {
    id: 'bets-like', synthetic: true, group: 'variant',
    prompt: 'Low-amplitude left temporal transient, drowsy', name: 'Small sharp spike (BETS)',
    state: 'Drowsy', channels: LT, gains: [0.15, 0.35, 1, 0.6, 0.15],
    // Glossary (Kane 2017): under 50 ms and under 50 µV, often followed by a small theta wave,
    // temporal, in drowsiness and light sleep, a normal variant that is not epileptiform. Drawn
    // monophasic with near-equal limbs and no theta wave, a common form.
    background: { freqHz: 6, amplitude: 15 },
    transient: { polarity: -1, amplitude: 40, riseMs: 15, fallMs: 17 },
    criteria: { morphology: false, duration: true, asymmetry: false, slowWave: false, disruption: false, field: true },
    explain: {
      morphology: 'A single small negative peak with no second phase, so it is monophasic, not di- or triphasic. Small sharp spikes are often like this, and at under 50 µV they barely stand out from the background.',
      duration: 'About 32 ms, briefer than the background waves.',
      asymmetry: 'The rise and fall are about equal, steep on both sides.',
      slowWave: 'No slow wave follows here. When one does, the glossary describes it as a small theta wave (Kane 2017). It is low and blends with the background, so do not credit it as the after-going slow wave of a discharge.',
      disruption: 'The background is unchanged.',
      field: 'It appears at low amplitude in the neighboring temporal channels.',
    },
    takeaway: 'Two criteria. Recognize a small sharp spike by its size and setting. It lasts under 50 ms, is under 50 µV, is temporal, and appears in drowsiness and light sleep, with at most a small theta wave after it. The glossary calls it a normal variant that, despite its old name, is not epileptiform (Kane 2017).',
  },
  {
    id: 'vertex', synthetic: true, group: 'variant',
    prompt: 'Central transient on a transverse chain, light sleep', name: 'Vertex wave',
    state: 'Light sleep', channels: ['T3', 'C3', 'Cz', 'C4', 'T4'], gains: [0.15, 0.6, 1, 0.6, 0.15],
    // Glossary (Kane 2017): sharply contoured, under 0.5 s, maximal at the vertex, negative, in
    // light sleep or after a sensory stimulus, rarely over 250 µV. The glossary also says the term
    // sharp wave does not apply to vertex sharp transients. Drawn with a broad, blunt peak.
    background: { freqHz: 4, amplitude: 25 },
    transient: { polarity: -1, amplitude: 120, riseMs: 60, fallMs: 65, rounded: true, second: { amp: 0.25, ms: 80 } },
    criteria: { morphology: false, duration: false, asymmetry: false, slowWave: false, disruption: false, field: true },
    explain: {
      morphology: 'Its contour is sharp against the slow sleep background, but the peak is broad and blunt rather than pointed. The glossary also names vertex sharp transients as physiological events to which the term sharp wave does not apply (Kane 2017). Not met.',
      duration: 'About 125 ms, the same as the slow waves of the sleep background.',
      asymmetry: 'The rise and fall are nearly equal.',
      slowWave: 'No slow wave follows.',
      disruption: 'It belongs to the sleep background and interrupts nothing.',
      field: 'Maximal at Cz and symmetric to C3 and C4, a cerebral field.',
    },
    takeaway: 'One criterion. Recognize a vertex wave by its maximum at the vertex, its symmetry across the midline, and its setting in light sleep or after a sound (Kane 2017). In children vertex waves can be tall and sharp, and their identity settles the call whatever the count.',
  },
  {
    id: 'posts-like', synthetic: true, group: 'variant',
    prompt: 'Occipital transient, light sleep', name: 'Positive occipital sharp transient of sleep (POSTS)',
    state: 'Light sleep', channels: ['P3', 'O1', 'O2', 'P4', 'Cz'], gains: [0.4, 1, 0.95, 0.4, 0.1],
    // Glossary (Kane 2017): maximal occipitally, positive, in sleep, single or repetitive,
    // generally under 50 µV. Drawn as a single positive triangular wave.
    background: { freqHz: 4, amplitude: 25 },
    transient: { polarity: 1, amplitude: 45, riseMs: 60, fallMs: 62, fallExponent: 1 },
    criteria: { morphology: false, duration: false, asymmetry: false, slowWave: false, disruption: false, field: true },
    explain: {
      morphology: 'A single surface-positive triangle, monophasic rather than di- or triphasic. The glossary also excludes POSTS from the term sharp wave (Kane 2017).',
      duration: 'About 120 ms, the same as the background waves.',
      asymmetry: 'The two limbs are close to equal. Even when one limb of a POSTS is steeper, raters agree on this criterion less than on most others (Kural 2020), so it should not tip the call.',
      slowWave: 'No slow wave follows.',
      disruption: 'The sleep background continues around it.',
      field: 'Positive at O1 and O2 and smaller at P3 and P4, a bilateral occipital field.',
    },
    takeaway: 'One criterion. Recognize POSTS by their positive polarity (drawn downward), their bilateral occipital maximum, their setting in sleep, and their low amplitude, generally under 50 µV. They may be single or repetitive (Kane 2017).',
  },
  {
    id: 'electrode-pop', synthetic: true, group: 'artifact',
    prompt: 'Right central transient, awake', name: 'Electrode pop',
    state: 'Awake', channels: RP, gains: [0, 0, 1, 0, 0],
    // Abrupt rise and slow decay at a single electrode. Shape illustrative.
    background: { freqHz: 9, amplitude: 20 },
    transient: { polarity: -1, amplitude: 150, riseMs: 4, fallMs: 230, fallExponent: 3 },
    criteria: { morphology: false, duration: true, asymmetry: true, slowWave: false, disruption: false, field: false },
    explain: {
      morphology: 'It is a single monophasic step, not a di- or triphasic wave.',
      duration: 'About 230 ms, far longer than the 9 Hz background waves, and longer than any sharp wave.',
      asymmetry: 'It rises almost instantly and decays slowly.',
      slowWave: 'Nothing follows except the tail of the decay.',
      disruption: 'The background continues through it.',
      field: 'Only C4 shows it. A deflection at one electrode has no cerebral field.',
    },
    takeaway: 'Two criteria, and no field. An artifact can meet shape criteria, and a deflection confined to one electrode points to the electrode itself as the source.',
  },
  {
    id: 'sharp-background', synthetic: true, group: 'background',
    prompt: 'Left central transient, drowsy', name: 'Sharply contoured background wave',
    state: 'Drowsy', channels: LP, gains: [0, 0, 1, 0, 0],
    background: { freqHz: 6, amplitude: 20 },
    transient: { polarity: -1, amplitude: 40, riseMs: 40, fallMs: 42, second: { amp: 0.6, ms: 80 } },
    criteria: { morphology: true, duration: false, asymmetry: false, slowWave: false, disruption: false, field: false },
    explain: {
      morphology: 'The peak is sharp and the wave is diphasic.',
      duration: 'About 82 ms, the same as the background waves it sits among.',
      asymmetry: 'The rise and fall are equal.',
      slowWave: 'No slow wave follows.',
      disruption: 'It is part of the background, so it interrupts nothing.',
      field: 'It stands out only at C3, the electrode where it caught the eye.',
    },
    takeaway: 'One criterion. Sharply contoured background usually scores on shape and then stops scoring (Module 5).',
  },
];

// ── Synthesis ────────────────────────────────────────────────────────────────────────────

export interface Marks {           // seconds, on the candidate transient
  onset: number; peak: number; fallEnd: number; secondEnd: number;
  slowStart?: number; slowEnd?: number;
  disruptStart?: number; disruptEnd?: number;
}

export interface Synth {
  t: number[];
  channels: { label: string; gain: number; total: number[]; transient: number[]; background: number[] }[];
  marks: Marks;
  maxChannel: number;
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** One transient (unit gain) at time t (s), onset t0. */
function transientAt(spec: TransientSpec, t: number, t0: number): number {
  const r = spec.riseMs / 1000, f = spec.fallMs / 1000, k = spec.fallExponent ?? 1.6;
  const A = spec.amplitude * spec.polarity;
  const x = t - t0;
  let v = 0;
  if (spec.rounded) {
    // Half sine: the peak is broad and blunt.
    if (x >= 0 && x < r) v += A * Math.sin((Math.PI / 2) * (x / r));
    else if (x >= r && x < r + f) v += A * Math.cos((Math.PI / 2) * ((x - r) / f));
  } else if (x >= 0 && x < r) v += A * Math.pow(x / r, 1.6);
  else if (x >= r && x < r + f) v += A * Math.pow(1 - (x - r) / f, k);
  let after = r + f;
  if (spec.second) {
    const d = spec.second.ms / 1000;
    if (x >= after && x < after + d) v -= A * spec.second.amp * Math.sin(Math.PI * (x - after) / d);
    after += d;
  }
  if (spec.slowWave) {
    const d = spec.slowWave.ms / 1000;
    if (x >= after && x < after + d) v += A * spec.slowWave.amp * Math.sin(Math.PI * (x - after) / d);
  }
  return v;
}

export function marksFor(c: SpikeCase): Marks {
  const s = c.transient;
  const onset = ONSET_S, peak = onset + s.riseMs / 1000, fallEnd = peak + s.fallMs / 1000;
  const secondEnd = fallEnd + (s.second ? s.second.ms / 1000 : 0);
  const m: Marks = { onset, peak, fallEnd, secondEnd };
  if (s.slowWave) { m.slowStart = secondEnd; m.slowEnd = secondEnd + s.slowWave.ms / 1000; }
  if (s.disruption) { m.disruptStart = fallEnd; m.disruptEnd = fallEnd + s.disruption.ms / 1000; }
  return m;
}

export function synthesize(c: SpikeCase): Synth {
  const n = Math.round(WINDOW_S * FS);
  const t = Array.from({ length: n }, (_, i) => i / FS);
  const marks = marksFor(c);
  const seed = c.id.split('').reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7);
  const rnd = lcg(seed);
  const { freqHz, amplitude } = c.background;
  const channels = c.channels.map((label, ci) => {
    const gain = c.gains[ci];
    const ph1 = rnd() * 2 * Math.PI, ph2 = rnd() * 2 * Math.PI, ph3 = rnd() * 2 * Math.PI;
    const disrupt = c.transient.disruption && Math.abs(gain) >= 0.3 ? c.transient.disruption : null;
    const background = t.map(tt => {
      let b = amplitude * (0.75 * Math.sin(2 * Math.PI * freqHz * tt + ph1)
        + 0.25 * Math.sin(2 * Math.PI * freqHz * 1.7 * tt + ph2)
        + 0.12 * Math.sin(2 * Math.PI * freqHz * 0.45 * tt + ph3))
        + amplitude * 0.08 * (rnd() - 0.5);
      if (disrupt && marks.disruptStart !== undefined && marks.disruptEnd !== undefined && tt >= marks.disruptStart && tt < marks.disruptEnd) {
        const u = (tt - marks.disruptStart) / (marks.disruptEnd - marks.disruptStart);
        const taper = u < 0.15 ? u / 0.15 : u > 0.75 ? (1 - u) / 0.25 : 1;
        b *= 1 - (1 - disrupt.attenuation) * taper;
      }
      return b;
    });
    const transient = t.map(tt => {
      let v = transientAt(c.transient, tt, ONSET_S);
      for (const rep of c.transient.repeats ?? []) v += rep.scale * transientAt(c.transient, tt, ONSET_S + rep.offsetMs / 1000);
      return gain * v;
    });
    const total = background.map((b, i) => b + transient[i]);
    return { label, gain, total, transient, background };
  });
  let maxChannel = 0;
  c.gains.forEach((g, i) => { if (Math.abs(g) > Math.abs(c.gains[maxChannel])) maxChannel = i; });
  return { t, channels, marks, maxChannel };
}

// ── Measurement (used by the tests and by the feedback labels) ───────────────────────────

export interface Measures {
  riseMs: number; fallMs: number; durationMs: number;
  backgroundHalfWaveMs: number;
  lobes: number;               // phases of the main transient (main + second)
  peakWidthFraction: number;   // width at half amplitude / full width of the main phase (pointed peaks are narrow, under about 0.45)
  slowWaveFraction: number;    // peak same-polarity deflection in the slow-wave window / amplitude
  neighborFraction: number;    // largest transient deflection on any other channel / maximum
  backgroundRatio: number;     // background RMS after the transient / before it, at the maximum channel
}

const idx = (s: number) => Math.max(0, Math.min(Math.round(WINDOW_S * FS) - 1, Math.round(s * FS)));

function rms(a: number[], from: number, to: number): number {
  let s = 0, n = 0;
  for (let i = idx(from); i < idx(to); i++) { s += a[i] * a[i]; n++; }
  return n ? Math.sqrt(s / n) : 0;
}

export function measure(c: SpikeCase, syn: Synth = synthesize(c)): Measures {
  const ch = syn.channels[syn.maxChannel];
  const A = Math.abs(c.transient.amplitude * c.gains[syn.maxChannel]);
  const p = c.transient.polarity;
  // Main phase only: sample the single transient, no repeats, no background.
  const single = syn.t.map(tt => transientAt({ ...c.transient }, tt, ONSET_S) * c.gains[syn.maxChannel]);
  const thr = 0.05 * A;
  let peakI = idx(syn.marks.onset);
  for (let i = idx(syn.marks.onset); i <= idx(syn.marks.fallEnd); i++) if (p * single[i] > p * single[peakI]) peakI = i;
  let on = peakI; while (on > 0 && p * single[on - 1] > thr) on--;
  let off = peakI; while (off < single.length - 1 && p * single[off + 1] > thr) off++;
  // Peaks above threshold on the main + second phases, by sign changes of significant lobes.
  let lobes = 0, last = 0;
  for (let i = idx(syn.marks.onset); i <= idx(syn.marks.secondEnd) + 1 && i < single.length; i++) {
    const s = Math.abs(single[i]) > 0.1 * A ? Math.sign(single[i]) : 0;
    if (s !== 0 && s !== last) { lobes++; last = s; }
  }
  let slow = 0;
  if (syn.marks.slowStart !== undefined && syn.marks.slowEnd !== undefined) {
    for (let i = idx(syn.marks.slowStart); i < idx(syn.marks.slowEnd); i++) slow = Math.max(slow, p * single[i]);
  } else {
    // Look in the 250 ms after the second phase for any same-polarity slow wave.
    for (let i = idx(syn.marks.secondEnd); i < idx(syn.marks.secondEnd + 0.25); i++) slow = Math.max(slow, p * single[i]);
  }
  let neighbor = 0;
  const peakOf = (a: number[]) => a.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const maxPeak = peakOf(ch.transient);
  syn.channels.forEach((o, i) => { if (i !== syn.maxChannel) neighbor = Math.max(neighbor, peakOf(o.transient)); });
  const before = rms(ch.background, 0.02, syn.marks.onset - 0.02);
  const aStart = syn.marks.fallEnd + 0.06;
  const aEnd = syn.marks.disruptEnd !== undefined ? syn.marks.disruptEnd - 0.08 : syn.marks.fallEnd + 0.3;
  const after = rms(ch.background, aStart, aEnd);
  const riseMs = ((peakI - on) / FS) * 1000, fallMs = ((off - peakI) / FS) * 1000;
  let h0 = peakI; while (h0 > 0 && p * single[h0 - 1] > 0.5 * A) h0--;
  let h1 = peakI; while (h1 < single.length - 1 && p * single[h1 + 1] > 0.5 * A) h1++;
  return {
    riseMs, fallMs, durationMs: ((off - on) / FS) * 1000,
    backgroundHalfWaveMs: 500 / c.background.freqHz,
    lobes,
    peakWidthFraction: off > on ? (h1 - h0) / (off - on) : 0,
    slowWaveFraction: A ? slow / A : 0,
    neighborFraction: maxPeak ? neighbor / maxPeak : 0,
    backgroundRatio: before ? after / before : 1,
  };
}
