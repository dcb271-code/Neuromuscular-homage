// Curriculum-level metadata for the EEG section: tracks, milestone map, resource map,
// reading targets. Content facts here come from docs/eeg/outline.md.

import type { EegTrack } from './types';

export const TRACKS: Record<EegTrack, { name: string; color: string; blurb: string }> = {
  foundation: { name: 'Foundations', color: '#2563eb', blurb: 'Modules 1 to 5, in order. Signal, montage, the reading routine, artifacts, and what is normal for age.' },
  neonatal: { name: 'Neonatal track', color: '#0d9488', blurb: 'Modules 6 and 7. Maturation by postmenstrual age, then abnormal backgrounds and neonatal seizures.' },
  abnormal: { name: 'Abnormal-EEG track', color: '#7c3aed', blurb: 'Modules 8 to 10. Interictal findings, the syndromes, and seizures and status on EEG.' },
  icu: { name: 'Critical care', color: '#4f46e5', blurb: 'Module 11. ACNS terminology, the ictal-interictal continuum, and seizure burden in the PICU.' },
  longitudinal: { name: 'Supervised reading', color: '#475569', blurb: 'Module 12 runs alongside everything: pre-read real studies from the first week.' },
};

export const HOW_TO_USE = [
  'Work through Modules 1 to 5 in order.',
  'Take the neonatal pair (6 and 7) and the abnormal-EEG sequence (8 to 10) in either order, then finish with Module 11.',
  'Module 12 runs alongside everything: pre-read real studies from the first week and compare each read with the attending\'s.',
];

// ACGME child neurology milestones (2020) mapped to modules, as in the outline.
export const MILESTONES = [
  { level: 'Level 1', wording: 'Describes general indications for an EEG', modules: [2] },
  { level: 'Level 2', wording: 'Describes normal EEG features using correct terminology, including common artifacts, across the lifespan', modules: [1, 2, 3, 4] },
  { level: 'Level 3', wording: 'Describes patterns of status epilepticus, normal EEG variants and common abnormalities, across the lifespan', modules: [5, 8, 10] },
  { level: 'Level 4', wording: 'Interprets common EEG abnormalities and creates a report', modules: [9, 12] },
  { level: 'Level 5', wording: 'Interprets uncommon EEG abnormalities', modules: [7, 11] },
];

export const RESOURCE_MAP = [
  { name: 'Learning EEG', url: 'https://www.learningeeg.com/', owner: 'David Valentine, MD', access: 'Free, no login', modules: '1 to 11; strongest for 4, 6, 8, 9', note: 'Only core site with real neonatal and pediatric-syndrome chapters; about 5 questions per chapter; no reuse licence stated.' },
  { name: 'eeg-training.com (NeuroLogic)', url: 'https://www.eeg-training.com/', owner: 'Not named on the site; EEG Fundamentals credited to Matthew S. Davitz, MD', access: 'Free; Epilepsy Rotation and Question Bank need an access code', modules: '1 to 3, 5, 10, 11', note: 'Most interactive: montage and filter labs, Artifact Hunter, ACNS drills. Adult-oriented; neonatal content is a preview only.' },
  { name: 'EEGmaster', url: 'https://eegmaster.com/eegmaster/', owner: 'Zulfi Haneef and Jay Gavvala, editors', access: 'Free account required', modules: '3 to 5, 8 to 12', note: 'Atlas, EEG of the Week, six competency tests with program-director tracking; no neonatal module in its public atlas list.' },
  { name: 'AES EEG Essentials', url: 'https://aesnet.org/education/education/eeg-essentials', owner: 'American Epilepsy Society', access: 'Free with a myAES account', modules: '4, 6, 9', note: '25 modules at three levels, including pediatric and neonatal basics.' },
  { name: 'ACNS CCEMRC education', url: 'https://www.acns.org/research/critical-care-eeg-monitoring-research-consortium-ccemrc/education', owner: 'ACNS', access: 'Free', modules: '10, 11', note: 'Training slides and certification test.' },
  { name: 'Neonatal Brain Monitoring', url: 'https://nncceducation.thinkific.com/courses/Neonatal-Brain-monitoring', owner: 'Calgary Newborn Neuro-Intensive Care Program', access: 'Free', modules: '6, 7', note: '13 lessons, about 7.5 hours: EEG, amplitude-integrated EEG, NIRS, seizures.' },
  { name: 'Roadmap to EEGs', url: 'https://www.youtube.com/channel/UCn6x_YRilGlt8S3f-ZnqGOg', owner: 'Sheikh, Katyal, Hadjinicolaou, Nascimento, Beniczky', access: 'Free, YouTube', modules: '1 to 5, 8', note: '10 video modules aligned to the ILAE curriculum.' },
  { name: 'Moeller EEG video curriculum', url: 'https://www.eeg-training.com/eeg_videos.html', owner: 'Moeller et al., MedEdPORTAL 2017', access: 'Free', modules: '1, 3, 4, 8', note: '10 videos with knowledge checks.' },
  { name: 'epilepsydiagnosis.org', url: 'https://www.epilepsydiagnosis.org/', owner: 'ILAE', access: 'Free', modules: '9', note: 'EEG tab for each syndrome.' },
  { name: 'AES introductory text and atlas', url: 'https://www.ncbi.nlm.nih.gov/books/NBK390356/', owner: 'St. Louis and Frey, eds', access: 'Free, NCBI Bookshelf', modules: '4, 5, 6', note: 'Developmental and benign-variant chapters.' },
  { name: 'ILAE Academy', url: 'https://ilae-academy.totaratalent.com/', owner: 'ILAE', access: 'Paid', modules: 'Beyond the curriculum', note: 'VIREPA pediatric EEG course.' },
];

export const TEXTBOOKS = [
  'Libenson MH. Practical Approach to Electroencephalography. 2nd ed. Elsevier; 2024.',
  'Mizrahi EM, Hrachovy RA. Atlas of Neonatal Electroencephalography. 4th ed. Demos/Springer Publishing; 2015.',
  'Sansevere AJ, Harrar DB, eds. Pediatric Neurocritical Care EEG. Springer Publishing; 2020.',
  'Tatum WO. Handbook of EEG Interpretation. 3rd ed. Springer Publishing; 2021.',
];

// A suggested local reading mix (the outline offers it as a suggestion, not a standard).
export const READING_TARGETS = [
  '60 routine studies, at least 20 of them in children under 2.',
  '10 neonatal studies across a range of postmenstrual ages.',
  '10 days of pediatric or neonatal continuous EEG.',
  'At least one recorded example each of IESS, an absence epilepsy and SeLECTS.',
];
