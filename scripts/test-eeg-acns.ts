// Tests for the ACNS 2021 terminology model (Module 11). Each assertion is a fact a reader would check
// against Hirsch LJ 2021 (PMID 33475321) or against the module's own quiz and worked examples.
//   npx tsx scripts/test-eeg-acns.ts
import {
  MAIN_TERM_1, MAIN_TERM_2, PLUS_MODIFIERS, PREVALENCE, DURATION, FREQUENCIES, AMPLITUDE, SHARPNESS,
  EVOLUTION, FLUCTUATION, ESZ, ESE, BIRDS, IIC_CRITERIA, SOURCE_KEY,
  prevalenceFor, durationFor, plusAllowed, buildName, classify, classifyChoice, isStatus, seizureCriterion,
  birdStatus, issues, type ClassifyInput,
} from '../src/eeg/acns-model';
import { SOURCES } from '../src/eeg/sources';

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' (' + detail + ')' : ''}`); } };
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const base: ClassifyInput = { loc: 'G', pattern: 'PDs', plus: '', hz: 1.5, change: 'static', durationSec: 600 };
const cat = (o: Partial<ClassifyInput>) => classify({ ...base, ...o }).category;

// ── Source
t('cited source is in the registry with PMID 33475321', SOURCES[SOURCE_KEY]?.pmid === '33475321');

// ── Terms
t('main term 1 is G, L, BI, UI, Mf', eq(MAIN_TERM_1.map(m => m.abbr), ['G', 'L', 'BI', 'UI', 'Mf']));
t('main term 2 is PDs, RDA, SW', eq(MAIN_TERM_2.map(m => m.abbr), ['PDs', 'RDA', 'SW']));
t('plus modifiers are +F, +R, +S, +FR, +FS', eq(PLUS_MODIFIERS.map(p => p.code), ['+F', '+R', '+S', '+FR', '+FS']));
t('+R is for PDs only', plusAllowed('PDs', '+R') && !plusAllowed('RDA', '+R'));
t('+S is for RDA only', plusAllowed('RDA', '+S') && !plusAllowed('PDs', '+S'));
t('+F is for PDs and RDA', plusAllowed('PDs', '+F') && plusAllowed('RDA', '+F'));
t('no plus modifier applies to SW', PLUS_MODIFIERS.every(p => !plusAllowed('SW', p.code)));
t('+FR goes with PDs, +FS with RDA', plusAllowed('PDs', '+FR') && plusAllowed('RDA', '+FS') && !plusAllowed('RDA', '+FR') && !plusAllowed('PDs', '+FS'));

// ── Cutoffs
t('prevalence cutoffs 90, 50, 10, 1, 0', eq(PREVALENCE.map(p => p.minPct), [90, 50, 10, 1, 0]));
t('70% is abundant, 90% continuous, 89% abundant', prevalenceFor(70) === 'Abundant' && prevalenceFor(90) === 'Continuous' && prevalenceFor(89) === 'Abundant');
t('10% frequent, 9% occasional, 1% occasional, 0.5% rare', prevalenceFor(10) === 'Frequent' && prevalenceFor(9) === 'Occasional' && prevalenceFor(1) === 'Occasional' && prevalenceFor(0.5) === 'Rare');
t('duration cutoffs 1 h, 10 min, 1 min, 10 s', eq(DURATION.map(d => d.minSec), [3600, 600, 60, 10, 0]));
t('9 s very brief, 10 s brief, 59 s brief, 60 s intermediate, 9.9 min intermediate, 10 min long, 1 h very long',
  durationFor(9) === 'Very brief' && durationFor(10) === 'Brief' && durationFor(59) === 'Brief' && durationFor(60) === 'Intermediate'
  && durationFor(594) === 'Intermediate' && durationFor(600) === 'Long' && durationFor(3600) === 'Very long');
t('frequency categories stop at 4 Hz', Math.max(...FREQUENCIES) === 4 && FREQUENCIES.includes(2.5));
t('amplitude bands end at 150 µV for high', AMPLITUDE[3].range === '150 µV or more' && AMPLITUDE[2].range === '50 to 149 µV');
t('spiky under 70 ms, sharp 70 to 200 ms', SHARPNESS[0].meaning.includes('70') && SHARPNESS[1].meaning === '70 to 200 ms');
t('evolution needs 2 changes of 0.5 Hz, 3 cycles each', EVOLUTION.minChanges === 2 && EVOLUTION.minFreqStepHz === 0.5 && EVOLUTION.minCyclesEach === 3);
t('fluctuation needs 3 changes no more than 60 s apart', FLUCTUATION.minChanges === 3 && FLUCTUATION.maxGapSec === 60);
t('seizure is >2.5 Hz for 10 s, status 10 min or 20%', ESZ.minHz === 2.5 && ESZ.minSec === 10 && ESE.continuousMin === 10 && ESE.burdenPct === 20);
t('BIRDs >4 Hz, 0.5 to under 10 s, 6 waves', BIRDS.minHz === 4 && BIRDS.minSec === 0.5 && BIRDS.maxSec === 10 && BIRDS.minWaves === 6);
t('three continuum criteria', IIC_CRITERIA.length === 3);

// ── Names
t('Abundant LPDs+F at 1.5 Hz', buildName({ loc: 'L', pattern: 'PDs', plus: '+F', prevalence: 'Abundant', hz: 1.5 }) === 'Abundant LPDs+F at 1.5 Hz');
t('Abundant GPDs at 1.5 Hz (quiz 1)', buildName({ loc: 'G', pattern: 'PDs', plus: '', prevalence: 'Abundant', hz: 1.5 }) === 'Abundant GPDs at 1.5 Hz');
t('LRDA+S (section question)', buildName({ loc: 'L', pattern: 'RDA', plus: '+S', prevalence: 'Frequent', hz: 1.5 }) === 'Frequent LRDA+S at 1.5 Hz');
t('BIPDs+F (worked example)', buildName({ loc: 'BI', pattern: 'PDs', plus: '+F', prevalence: 'Continuous', hz: 1 }) === 'Continuous BIPDs+F at 1 Hz');
t('UI and Mf names', buildName({ loc: 'UI', pattern: 'PDs', plus: '', prevalence: 'Rare', hz: 0.5 }) === 'Rare UIPDs at 0.5 Hz' && buildName({ loc: 'Mf', pattern: 'RDA', plus: '', prevalence: 'Occasional', hz: 2 }) === 'Occasional MfRDA at 2 Hz');
t('GSW never carries a plus', buildName({ loc: 'G', pattern: 'SW', plus: '+F', prevalence: 'Frequent', hz: 2 }) === 'Frequent GSW at 2 Hz');
t('fluctuating is appended', buildName({ loc: 'L', pattern: 'PDs', plus: '', prevalence: 'Frequent', hz: 1, change: 'fluctuating' }) === 'Frequent LPDs at 1 Hz, fluctuating');
t('below 0.5 Hz reads "under 0.5 Hz"', buildName({ loc: 'G', pattern: 'PDs', plus: '', prevalence: 'Rare', hz: 0.25 }) === 'Rare GPDs under 0.5 Hz');
t('issues flag a plus on SW and +S on PDs', issues({ loc: 'G', pattern: 'SW', plus: '+F', prevalence: 'Rare', hz: 2, change: 'static', duration: 'Brief' }).length === 1
  && issues({ loc: 'L', pattern: 'PDs', plus: '+S', prevalence: 'Rare', hz: 1, change: 'static', duration: 'Brief' }).length === 1);
t('issues are empty for a valid choice', issues({ loc: 'L', pattern: 'RDA', plus: '+S', prevalence: 'Rare', hz: 1.5, change: 'static', duration: 'Brief' }).length === 0);

// ── Classification: the module's quiz and worked examples
t('quiz 1 and IIC question: abundant GPDs at 1.5 Hz, static, are on the continuum',
  classify({ ...base, prevalence: 'Abundant' }).category === 'iic' && classify({ ...base, prevalence: 'Abundant' }).criterion === 'IIC 1');
t('the abundant-GPD reason says prevalence is not seizure burden', classify({ ...base, prevalence: 'Abundant' }).reason.includes('20%'));
t('quiz 2: LRDA+S at 1.5 Hz for minutes is on the continuum (criterion 3)', classify({ ...base, loc: 'L', pattern: 'RDA', plus: '+S', durationSec: 300 }).criterion === 'IIC 3');
t('quiz 2 distractor: LRDA at 1.5 Hz without modifier is interictal', cat({ loc: 'L', pattern: 'RDA', durationSec: 300 }) === 'interictal');
t('quiz 4: three seizures of 4, 5 and 6 minutes in an hour are status (25%)', isStatus(6, 15).status && isStatus(6, 15).by === 'burden');
t('quiz 4 through classify: 6-minute seizure with 15 minutes in the hour is ESE by the 20% rule',
  classify({ ...base, hz: 3, durationSec: 360, seizureMinInWorstHour: 15 }).criterion === 'ESE 20%');
t('quiz 5: LPDs at 1 Hz with fluctuation are on the continuum (criterion 2)', classify({ ...base, loc: 'L', hz: 1, change: 'fluctuating' }).criterion === 'IIC 2');
t('LPDs at 0.5 Hz with +F are on the continuum', cat({ loc: 'L', hz: 0.5, plus: '+F' }) === 'iic');
t('LPDs at 1 Hz static without modifier are interictal', cat({ loc: 'L', hz: 1 }) === 'interictal');
t('PDs under 0.5 Hz with +F are interictal', cat({ hz: 0.25, plus: '+F' }) === 'interictal');
t('2.5 Hz is still the continuum, not a seizure', cat({ hz: 2.5, durationSec: 60 }) === 'iic');
t('3 Hz GPDs for 10 s are an electrographic seizure (criterion A)', classify({ ...base, hz: 3, durationSec: 10 }).criterion === 'ESz A');
t('3 Hz GSW for 30 s are a seizure', cat({ pattern: 'SW', hz: 3, durationSec: 30 }) === 'seizure');
t('3 Hz GPDs for 9 s are not a seizure', cat({ hz: 3, durationSec: 9 }) !== 'seizure');
t('evolving LRDA at 1 Hz for 30 s is a seizure (criterion B)', classify({ ...base, loc: 'L', pattern: 'RDA', hz: 1, change: 'evolving', durationSec: 30 }).criterion === 'ESz B');
t('evolving pattern for 8 s is not a seizure', cat({ change: 'evolving', durationSec: 8 }) === 'interictal');
t('a seizure for 10 continuous minutes is status', classify({ ...base, hz: 3, durationSec: 600 }).criterion === 'ESE 10 min');
t('a 2-minute seizure with 5 minutes in the hour is a seizure only', cat({ hz: 3, durationSec: 120, seizureMinInWorstHour: 5 }) === 'seizure');
t('12 minutes in an hour is exactly 20% and is status', isStatus(4, 12).status && !isStatus(4, 11.9).status);
t('9.9 continuous minutes alone is not status', !isStatus(9.9, 9.9).status);
t('GRDA+F at 2 Hz is interictal (GRDA excluded)', cat({ pattern: 'RDA', plus: '+F', hz: 2 }) === 'interictal');
t('BIRDA+S at 1.5 Hz is on the continuum (any lateralized RDA)', cat({ loc: 'BI', pattern: 'RDA', plus: '+S' }) === 'iic');
t('LRDA at 1 Hz with +S is interictal (must be above 1 Hz)', cat({ loc: 'L', pattern: 'RDA', plus: '+S', hz: 1 }) === 'interictal');
t('RDA at 3 Hz static is not a seizure by criterion A', seizureCriterion({ pattern: 'RDA', hz: 3, change: 'static', durationSec: 60 }) === null);
t('builder: abundant GPDs 1.5 Hz long is IIC', classifyChoice({ loc: 'G', pattern: 'PDs', plus: '', prevalence: 'Abundant', hz: 1.5, change: 'static', duration: 'Long' }).category === 'iic');
t('builder: 3 Hz LPDs, brief, is a seizure, and long is status',
  classifyChoice({ loc: 'L', pattern: 'PDs', plus: '', prevalence: 'Frequent', hz: 3, change: 'static', duration: 'Brief' }).category === 'seizure'
  && classifyChoice({ loc: 'L', pattern: 'PDs', plus: '', prevalence: 'Frequent', hz: 3, change: 'static', duration: 'Long' }).category === 'status');
t('builder: very brief runs are never seizures', classifyChoice({ loc: 'L', pattern: 'PDs', plus: '', prevalence: 'Frequent', hz: 3, change: 'evolving', duration: 'Very brief' }).category === 'interictal');
t('every reason is a plain sentence with no semicolon or em dash', [base, { ...base, hz: 3 }, { ...base, pattern: 'RDA' as const }].every(x => { const r = classify(x).reason; return r.endsWith('.') && !r.includes(';') && !r.includes('—'); }));

// ── BIRDs (quiz 3 and section question)
t('6 s of 6 Hz at the site of the spikes is a definite BIRD', birdStatus({ hz: 6, durationSec: 6, clinicalCorrelate: false, feature: 'matches-patient' }).bird === 'definite');
t('evolving BIRDs are definite', birdStatus({ hz: 5, durationSec: 3, clinicalCorrelate: false, feature: 'evolution' }).bird === 'definite');
t('sharply contoured only is a possible BIRD', birdStatus({ hz: 5, durationSec: 3, clinicalCorrelate: false, feature: 'sharply-contoured' }).bird === 'possible');
t('4 Hz is not a BIRD', birdStatus({ hz: 4, durationSec: 3, clinicalCorrelate: false, feature: 'evolution' }).bird === 'no');
t('10 s is not a BIRD', birdStatus({ hz: 6, durationSec: 10, clinicalCorrelate: false, feature: 'evolution' }).bird === 'no');
t('a clinical correlate rules out a BIRD', birdStatus({ hz: 6, durationSec: 6, clinicalCorrelate: true, feature: 'matches-patient' }).bird === 'no');
t('fewer than 6 waves is not a BIRD', birdStatus({ hz: 5, durationSec: 1, clinicalCorrelate: false, feature: 'evolution' }).bird === 'no');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
