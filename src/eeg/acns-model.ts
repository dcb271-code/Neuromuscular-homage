// Pure model behind the ACNS card (Module 11): the 2021 critical care EEG terminology as data,
// a name builder and a classifier. No I/O, no DOM.
//
// Source for every term, cutoff and criterion below: Hirsch LJ, et al. American Clinical
// Neurophysiology Society's Standardized Critical Care EEG Terminology: 2021 version.
// J Clin Neurophysiol. 2021;38(1):1-29. PMID 33475321 (registry key `hirschLJ2021`).
// Section letters in comments refer to that paper (C = rhythmic and periodic patterns,
// D = seizures, E = BIRDs, F = ictal-interictal continuum).
//
// Scope: pediatric and adult terminology. Neonatal definitions differ and are not modeled here.
// Electroclinical seizures (clinical correlate, response to a parenteral drug) are not modeled,
// because the builder has no clinical input. The classifier is electrographic only.

export const SOURCE_KEY = 'hirschLJ2021';

// ── Main term 1 (C1): where
export type Loc = 'G' | 'L' | 'BI' | 'UI' | 'Mf';
export const MAIN_TERM_1: { abbr: Loc; name: string; meaning: string }[] = [
  { abbr: 'G', name: 'Generalized', meaning: 'Bilaterally synchronous and symmetric, even with a restricted field such as bifrontal.' },
  { abbr: 'L', name: 'Lateralized', meaning: 'Unilateral, or bilateral but consistently higher on one side or consistently leading from one side. Includes focal, regional and hemispheric.' },
  { abbr: 'BI', name: 'Bilateral independent', meaning: 'Two independent lateralized patterns, one in each hemisphere, present at the same time.' },
  { abbr: 'UI', name: 'Unilateral independent', meaning: 'Two independent patterns in the same hemisphere, present at the same time.' },
  { abbr: 'Mf', name: 'Multifocal', meaning: 'At least three independent lateralized patterns, at least one in each hemisphere, present at the same time.' },
];

// ── Main term 2 (C2): what
export type Pattern = 'PDs' | 'RDA' | 'SW';
export const MAIN_TERM_2: { abbr: Pattern; name: string; meaning: string }[] = [
  { abbr: 'PDs', name: 'Periodic discharges', meaning: 'Repeating discharges of uniform shape with a clear interval between them, at nearly regular intervals (cycle length varying by under 50% between most consecutive cycles). A discharge lasts under 0.5 s, or longer with no more than 3 phases.' },
  { abbr: 'RDA', name: 'Rhythmic delta activity', meaning: 'Repeating waves of uniform shape with no interval between them, at 0.5 to 4 Hz. Irregular or polymorphic delta is not RDA.' },
  { abbr: 'SW', name: 'Spike-and-wave or sharp-and-wave', meaning: 'Spike, polyspike or sharp wave consistently followed by a slow wave, repeating with no interval between complexes. With an interval, each complex is a periodic discharge and the pattern is PDs.' },
];
/** A pattern counts as rhythmic or periodic only if it continues for at least 6 cycles (C1 box). */
export const MIN_CYCLES = 6;

// ── Plus modifiers (C3i). Apply to PDs and RDA only, never to SW.
export type Plus = '' | '+F' | '+R' | '+S' | '+FR' | '+FS';
export const PLUS_MODIFIERS: { code: Exclude<Plus, ''>; meaning: string; appliesTo: Pattern[] }[] = [
  { code: '+F', meaning: 'Superimposed fast activity, theta or faster, that is part of the pattern and not of the background.', appliesTo: ['PDs', 'RDA'] },
  { code: '+R', meaning: 'Superimposed rhythmic or quasi-rhythmic delta activity.', appliesTo: ['PDs'] },
  { code: '+S', meaning: 'Associated sharp waves or spikes, or sharp contour, at least once every 10 seconds and not as part of an SW pattern.', appliesTo: ['RDA'] },
  { code: '+FR', meaning: 'Both +F and +R.', appliesTo: ['PDs'] },
  { code: '+FS', meaning: 'Both +F and +S.', appliesTo: ['RDA'] },
];
export function plusAllowed(pattern: Pattern, plus: Plus): boolean {
  if (plus === '') return true;
  return PLUS_MODIFIERS.some(p => p.code === plus && p.appliesTo.includes(pattern));
}

// ── Prevalence (C3a): percent of the record or epoch.
export type Prevalence = 'Continuous' | 'Abundant' | 'Frequent' | 'Occasional' | 'Rare';
export const PREVALENCE: { term: Prevalence; minPct: number; range: string }[] = [
  { term: 'Continuous', minPct: 90, range: '90% or more' },
  { term: 'Abundant', minPct: 50, range: '50% to 89%' },
  { term: 'Frequent', minPct: 10, range: '10% to 49%' },
  { term: 'Occasional', minPct: 1, range: '1% to 9%' },
  { term: 'Rare', minPct: 0, range: 'Under 1%' },
];
export function prevalenceFor(pct: number): Prevalence {
  return PREVALENCE.find(p => pct >= p.minPct)!.term;
}

// ── Duration (C3b): typical duration if not continuous.
export type DurationCat = 'Very long' | 'Long' | 'Intermediate' | 'Brief' | 'Very brief';
export const DURATION: { term: DurationCat; minSec: number; range: string }[] = [
  { term: 'Very long', minSec: 3600, range: '1 hour or more' },
  { term: 'Long', minSec: 600, range: '10 to 59 minutes' },
  { term: 'Intermediate', minSec: 60, range: '1 to 9.9 minutes' },
  { term: 'Brief', minSec: 10, range: '10 to 59 seconds' },
  { term: 'Very brief', minSec: 0, range: 'Under 10 seconds' },
];
export function durationFor(sec: number): DurationCat {
  return DURATION.find(d => sec >= d.minSec)!.term;
}
export const durationMinSec = (d: DurationCat) => DURATION.find(x => x.term === d)!.minSec;

// ── Frequency (C3c). Categories <0.5, 0.5, 1, 1.5, 2, 2.5, and 3, 3.5, 4 only if very brief.
// No rhythmic or periodic pattern has a typical frequency above 4 Hz. RDA is 0.5 to 4 Hz (C2b).
// BELOW_HALF stands for the "<0.5" category.
export const BELOW_HALF = 0.25;
export const FREQUENCIES = [BELOW_HALF, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4] as const;
export const VERY_BRIEF_ONLY_ABOVE_HZ = 2.5;
export const freqLabel = (hz: number) => (hz < 0.5 ? 'under 0.5 Hz' : `${hz} Hz`);

// ── Sharpness (C3e), PDs and the spike of SW only.
export const SHARPNESS = [
  { term: 'Spiky', meaning: 'Under 70 ms at the baseline' },
  { term: 'Sharp', meaning: '70 to 200 ms' },
  { term: 'Sharply contoured', meaning: 'Sharp shape but too long to be a sharp wave' },
  { term: 'Blunt', meaning: 'Smooth or sinusoidal' },
];

// ── Absolute amplitude (C3f), peak to trough in longitudinal bipolar.
export const AMPLITUDE = [
  { term: 'Very low', range: 'Under 20 µV' },
  { term: 'Low', range: '20 to 49 µV' },
  { term: 'Medium', range: '50 to 149 µV' },
  { term: 'High', range: '150 µV or more' },
];
/** Relative amplitude, PDs only: discharge voltage over background, 2 or less, or more than 2. */
export const RELATIVE_AMPLITUDE_CUTOFF = 2;

// ── Evolution and fluctuation (C3h)
export type Change = 'static' | 'fluctuating' | 'evolving';
export const EVOLUTION = {
  minChanges: 2,          // at least 2 unequivocal, sequential changes in one category
  minFreqStepHz: 0.5,     // frequency changes in the same direction by at least 0.5 Hz
  minCyclesEach: 3,       // each frequency, morphology or location persists at least 3 cycles
  maxStaticMin: 5,        // not evolution if the feature stays unchanged for 5 minutes or more
  // The 2 changes must be in the same category (frequency, morphology or location). Location
  // evolution means spreading into or out of at least 2 standard 10-20 electrode positions.
  // Under 10 s, an evolving pattern at 4 Hz or less is an evolving RPP (for example "evolving RDA"),
  // and above 4 Hz it is a definite BIRD. At 10 s or more it is a seizure by criterion B.
};
export const FLUCTUATION = {
  minChanges: 3,          // 3 or more changes
  maxGapSec: 60,          // not more than 1 minute apart
  minFreqStepHz: 0.5,
  minLocationStep: '1 standard interelectrode distance',
  minCyclesEach: 3,       // each frequency, morphology or location persists at least 3 cycles
};
/** Amplitude change alone is neither evolution nor fluctuation. */

// ── Seizure, status and BIRDs (D, E)
// ESz criterion A also counts sharply contoured discharges that are too long to be epileptiform
// (the paper's example is more than 25 sharply contoured discharges in 10 s).
export const ESZ = { minHz: 2.5, minSec: 10 };          // >2.5 Hz (more than 25 in 10 s) for at least 10 s, or evolution for at least 10 s
export const ESE = { continuousMin: 10, burdenPct: 20 }; // at least 10 continuous minutes, or at least 20% of any 60-minute period
// Electroclinical status (D4): the same thresholds, or 5 continuous minutes for an ongoing seizure with
// bilateral tonic-clonic motor activity. Possible ECSE (D4b): an IIC pattern for 10 continuous minutes or
// 20% of an hour that improves on EEG after a parenteral antiseizure medication without clinical improvement.
export const ECSE = { continuousMin: 10, burdenPct: 20, bilateralTonicClonicMin: 5 };
// BIRDs: focal or generalized rhythmic activity >4 Hz, at least 6 waves at a regular rate, at least 0.5 s
// and under 10 s, not a normal pattern or benign variant, not part of burst suppression or burst
// attenuation, no definite clinical correlate.
export const BIRDS = { minHz: 4, minSec: 0.5, maxSec: 10, minWaves: 6 };

// ── Ictal-interictal continuum (F), plain statements used by the card.
export const IIC_CRITERIA = [
  'PDs or SW averaging more than 1 and up to 2.5 Hz over 10 seconds (more than 10 and up to 25 discharges in 10 seconds).',
  'PDs or SW averaging 0.5 to 1 Hz over 10 seconds (5 to 10 discharges), with a plus modifier or fluctuation. SW takes no plus modifier, so SW qualifies here only by fluctuation.',
  'Any lateralized RDA (LRDA, BIRDA, UIRDA or MfRDA, never GRDA) averaging more than 1 Hz for at least 10 seconds (at least 10 waves in 10 seconds), with a plus modifier or fluctuation.',
];
export const IIC_EXCLUSION = 'The pattern does not meet criteria for an electrographic seizure or electrographic status epilepticus.';

// ── Naming
export function coreName(loc: Loc, pattern: Pattern): string {
  return `${loc}${pattern}`;
}

export interface Choice {
  loc: Loc;
  pattern: Pattern;
  plus: Plus;
  prevalence: Prevalence;
  hz: number;            // one of FREQUENCIES
  change: Change;
  duration: DurationCat; // typical run duration
}

/** Problems with a set of choices, in plain sentences. Empty when the choices are consistent. */
export function issues(c: Choice): string[] {
  const out: string[] = [];
  if (c.pattern === 'SW' && c.plus) out.push('Plus modifiers apply to PDs and RDA only, not to SW.');
  else if (!plusAllowed(c.pattern, c.plus)) out.push(`${c.plus} cannot be used with ${c.pattern}.`);
  if (c.pattern === 'RDA' && c.hz < 0.5) out.push('RDA is 0.5 to 4 Hz by definition.');
  if (c.hz > VERY_BRIEF_ONLY_ABOVE_HZ && c.duration !== 'Very brief' && c.pattern === 'RDA')
    out.push('The 2021 terminology lists 3 to 4 Hz only for very brief patterns.');
  return out;
}

/** The standard name, for example "Abundant LPDs+F at 1.5 Hz". Fluctuating or evolving is added at the end. */
export function buildName(c: Pick<Choice, 'loc' | 'pattern' | 'plus' | 'prevalence' | 'hz'> & { change?: Change }): string {
  const plus = c.pattern === 'SW' ? '' : c.plus;
  const freq = c.hz < 0.5 ? 'under 0.5 Hz' : `at ${c.hz} Hz`;
  const tail = c.change && c.change !== 'static' ? `, ${c.change}` : '';
  return `${c.prevalence} ${coreName(c.loc, c.pattern)}${plus} ${freq}${tail}`;
}

// ── Classification
export type Category = 'interictal' | 'iic' | 'seizure' | 'status';
export const CATEGORY_LABEL: Record<Category, string> = {
  interictal: 'Interictal',
  iic: 'Ictal-interictal continuum',
  seizure: 'Electrographic seizure',
  status: 'Electrographic status epilepticus',
};

export interface Classification {
  category: Category;
  criterion: string; // short tag, e.g. "IIC 1", "ESz A", "ESE 20%"
  reason: string;
}

export interface ClassifyInput {
  loc: Loc;
  pattern: Pattern;
  plus: Plus;
  hz: number;
  change: Change;
  durationSec: number;              // longest continuous run
  seizureMinInWorstHour?: number;   // total seizure time in the worst 60 minutes, if known
  prevalence?: Prevalence;          // used only to explain that prevalence is not seizure burden
}

/** Whether a run meets the electrographic seizure definition (D1), and by which criterion. */
export function seizureCriterion(x: Pick<ClassifyInput, 'pattern' | 'hz' | 'change' | 'durationSec'>): 'A' | 'B' | null {
  if (x.durationSec < ESZ.minSec) return null;
  if (x.change === 'evolving') return 'B';
  // Criterion A is written for epileptiform discharges, so it is applied to PDs and SW, not to RDA.
  // Judgment call: the paper states the ">2.5 Hz for 10 s is a seizure" rule explicitly for PDs and SW
  // and is silent on 3 to 4 Hz RDA lasting 10 s or more (it only limits 3 to 4 Hz labels to very brief
  // runs). The lenient reading is kept, and the builder does not offer 3 to 4 Hz RDA beyond very brief.
  if (x.pattern !== 'RDA' && x.hz > ESZ.minHz) return 'A';
  return null;
}

/** Electrographic status (D2): at least 10 continuous minutes, or at least 20% of any hour. */
export function isStatus(longestSeizureMin: number, seizureMinInWorstHour: number): { status: boolean; by: 'continuous' | 'burden' | null } {
  if (longestSeizureMin >= ESE.continuousMin) return { status: true, by: 'continuous' };
  if ((seizureMinInWorstHour / 60) * 100 >= ESE.burdenPct) return { status: true, by: 'burden' };
  return { status: false, by: null };
}

export function classify(x: ClassifyInput): Classification {
  const plus = x.pattern === 'SW' ? '' : (plusAllowed(x.pattern, x.plus) ? x.plus : '');
  const sz = seizureCriterion(x);
  if (sz) {
    const why = sz === 'B'
      ? 'Definite evolution lasting at least 10 seconds meets seizure criterion B.'
      : `Discharges averaging more than ${ESZ.minHz} Hz for at least 10 seconds meet seizure criterion A.`;
    const longestMin = x.durationSec / 60;
    const burden = Math.max(x.seizureMinInWorstHour ?? 0, Math.min(longestMin, 60));
    const st = isStatus(longestMin, burden);
    if (st.by === 'continuous')
      return { category: 'status', criterion: 'ESE 10 min', reason: `${why} A seizure lasting 10 continuous minutes or more is electrographic status epilepticus.` };
    if (st.by === 'burden') {
      const pct = Math.round((burden / 60) * 100);
      return { category: 'status', criterion: 'ESE 20%', reason: `${why} Seizures total ${fmtMin(burden)} in the worst hour, which is ${pct}%, and 20% of any hour is electrographic status epilepticus.` };
    }
    return { category: 'seizure', criterion: `ESz ${sz}`, reason: `${why} It is status epilepticus only at 10 continuous minutes or 20% of an hour (12 minutes).` };
  }

  if (x.durationSec < ESZ.minSec) {
    const ev = x.change === 'evolving' ? ' An evolving run this short is called evolving and is not yet a seizure.' : '';
    return { category: 'interictal', criterion: 'Under 10 s', reason: `The run lasts under 10 seconds, so it cannot be a seizure, and the continuum criteria are judged over 10 seconds.${ev}` };
  }

  const fl = x.change === 'fluctuating';
  const mod = plus ? `the ${plus} modifier` : fl ? 'fluctuation' : '';
  const prevNote = x.prevalence && (x.prevalence === 'Continuous' || x.prevalence === 'Abundant')
    ? ' Its prevalence does not count toward the 20% status threshold, because the pattern is not a seizure.' : '';

  if (x.pattern === 'PDs' || x.pattern === 'SW') {
    if (x.hz > 1 && x.hz <= ESZ.minHz)
      return { category: 'iic', criterion: 'IIC 1', reason: `${x.pattern} at more than 1 and up to 2.5 Hz are on the continuum (criterion 1).${prevNote}` };
    if (x.hz >= 0.5 && x.hz <= 1) {
      if (mod) return { category: 'iic', criterion: 'IIC 2', reason: `${x.pattern} at 0.5 to 1 Hz with ${mod} are on the continuum (criterion 2).${prevNote}` };
      return { category: 'interictal', criterion: 'Below IIC', reason: `${x.pattern} at 0.5 to 1 Hz reach the continuum only with a plus modifier or fluctuation, and this pattern has neither.` };
    }
    return { category: 'interictal', criterion: 'Below IIC', reason: `${x.pattern} under 0.5 Hz do not meet any continuum criterion.` };
  }

  // RDA
  if (x.loc === 'G')
    return { category: 'interictal', criterion: 'GRDA', reason: 'Generalized RDA is excluded from the continuum criteria, whatever its frequency or modifiers.' };
  if (x.hz <= 1)
    return { category: 'interictal', criterion: 'Below IIC', reason: 'Lateralized RDA reaches the continuum only above 1 Hz.' };
  if (!mod)
    return { category: 'interictal', criterion: 'Below IIC', reason: 'Lateralized RDA above 1 Hz reaches the continuum only with a plus modifier or fluctuation, and this pattern has neither.' };
  return { category: 'iic', criterion: 'IIC 3', reason: `${x.loc}RDA above 1 Hz with ${mod} is on the continuum (criterion 3).${prevNote}` };
}

function fmtMin(m: number) {
  const r = Math.round(m * 10) / 10;
  return `${r} minute${r === 1 ? '' : 's'}`;
}

/** Classify the builder's choices. Duration category is taken at its lower bound. */
export function classifyChoice(c: Choice, seizureMinInWorstHour?: number): Classification {
  return classify({ ...c, durationSec: durationMinSec(c.duration) || 5, seizureMinInWorstHour });
}

// ── BIRDs (E)
export type BirdFeature = 'evolution' | 'matches-patient' | 'sharply-contoured' | 'none';
export interface BirdInput {
  hz: number;
  durationSec: number;
  waves?: number;                   // waves at a regular rate, at least 6
  clinicalCorrelate: boolean;
  feature: BirdFeature;             // matches-patient = similar morphology and location to the patient's epileptiform discharges or seizures
}
export function birdStatus(b: BirdInput): { bird: 'definite' | 'possible' | 'no'; reason: string } {
  if (b.hz <= BIRDS.minHz) return { bird: 'no', reason: 'BIRDs are faster than 4 Hz.' };
  if (b.durationSec < BIRDS.minSec) return { bird: 'no', reason: 'BIRDs last at least 0.5 seconds.' };
  if (b.durationSec >= BIRDS.maxSec) return { bird: 'no', reason: 'At 10 seconds or more, rhythmic activity above 4 Hz meets the seizure definition instead.' };
  const waves = b.waves ?? Math.floor(b.hz * b.durationSec);
  if (waves < BIRDS.minWaves) return { bird: 'no', reason: 'BIRDs need at least 6 waves at a regular rate.' };
  if (b.clinicalCorrelate) return { bird: 'no', reason: 'With a definite clinical correlate, the run is an electroclinical seizure, not a BIRD.' };
  if (b.feature === 'evolution') return { bird: 'definite', reason: 'An evolving run is a definite BIRD.' };
  if (b.feature === 'matches-patient') return { bird: 'definite', reason: "A run with a similar morphology and location to the patient's epileptiform discharges or seizures is a definite BIRD." };
  if (b.feature === 'sharply-contoured') return { bird: 'possible', reason: 'A sharply contoured run without evolution or a match to the patient is a possible BIRD.' };
  return { bird: 'no', reason: 'BIRDs need evolution, a match to the patient, or sharp contour.' };
}
