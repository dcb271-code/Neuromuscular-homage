// Pretest probability and the meaning of a result.
// Bayes in odds form: post-test odds = pretest odds × likelihood ratio (Gill 2005).
// Localization sets the pretest probability: a result that lands where the exam predicted
// means far more than the same result found by scanning everywhere (Brazis 2011, p. 1).
//
// False-positive rates are sourced: incidental findings on brain MRI in 21.1% of 9-10-year-old
// children (Li 2021), epileptiform discharges in 6.5% of healthy 6-13-year-olds (Borusiak 2010).
// Sensitivities and the pretest probabilities are illustrative and adjustable; the widget says so.

export function toOdds(p: number) { return p / (1 - p); }
export function toProb(o: number) { return o / (1 + o); }

export interface TestModel { sensitivity: number; falsePositive: number }
export function likelihoodRatios(t: TestModel) {
  const spec = 1 - t.falsePositive;
  return { positive: t.sensitivity / t.falsePositive, negative: (1 - t.sensitivity) / spec };
}

/** Probability of disease after a positive or negative result. */
export function posttest(pretest: number, t: TestModel, positive: boolean) {
  const lr = likelihoodRatios(t);
  return toProb(toOdds(pretest) * (positive ? lr.positive : lr.negative));
}

/** Natural frequencies for a group of children: who has the disease, who tests positive. */
export function frequencies(n: number, pretest: number, t: TestModel) {
  const sick = Math.round(n * pretest);
  const well = n - sick;
  const truePos = Math.round(sick * t.sensitivity);
  const falsePos = Math.round(well * t.falsePositive);
  return { sick, well, truePos, falseNeg: sick - truePos, falsePos, trueNeg: well - falsePos, ppv: truePos + falsePos ? truePos / (truePos + falsePos) : 0 };
}

export type TestId = 'mri' | 'eeg' | 'gene';
export interface TestScenario {
  id: TestId; name: string; finding: string; target: string;
  falsePositive: number | null; fpSource: string; defaultSensitivity: number; note: string;
}
export const TESTS: TestScenario[] = [
  { id: 'mri', name: 'Brain MRI', finding: 'The report describes an abnormality', target: 'the abnormality is the cause of the symptom',
    falsePositive: 0.211, fpSource: 'Incidental findings in 21.1% of 9-10-year-olds scanned for research (Li 2021)', defaultSensitivity: 0.9,
    note: 'A scan shows structure rather than function, and a child weak from Guillain-Barré syndrome or botulism has a normal brain MRI. A normal result only helps if the exam predicted a structural lesion the scan could see.' },
  { id: 'eeg', name: 'Routine EEG', finding: 'The report describes epileptiform discharges', target: 'the events are epileptic seizures',
    falsePositive: 0.065, fpSource: 'Epileptiform discharges in 6.5% of healthy 6-13-year-olds (Borusiak 2010)', defaultSensitivity: 0.5,
    note: 'Some healthy children carry discharges as a trait. Normal background fluctuations are also overread as epileptiform (Benbadis 2003). The story of the events sets the prior.' },
  { id: 'gene', name: 'Gene panel or exome', finding: 'The report lists a variant in a gene that can cause the phenotype', target: 'the variant explains the child',
    falsePositive: null, fpSource: 'No single rate applies; laboratories classify each variant on a five-step scale from benign to pathogenic (Richards 2015)', defaultSensitivity: 0.5,
    note: 'A variant of uncertain significance should not be read as a positive result. Whether it is worth pursuing depends on how well the child, examined and localized, matches what that gene does.' },
];

/** Pretest probabilities set by localization (illustrative). */
export const PRIORS = [
  { id: 'fits', name: 'The exam predicted this', detail: 'The finding sits where the localization pointed', p: 0.5 },
  { id: 'loose', name: 'The exam was vague', detail: 'Ordered "to be thorough" with no prediction', p: 0.1 },
  { id: 'elsewhere', name: 'The exam pointed elsewhere', detail: 'The finding is at an address the exam excluded', p: 0.02 },
] as const;
