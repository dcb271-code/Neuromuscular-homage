// Neuroradiology curriculum: tracks, the six-module plan, and curriculum-level resources.
// Module numbering is fixed by the plan, so CT head stays Module 2 while Module 1 waits.

export const NRAD_TRACKS: Record<string, { name: string; color: string; blurb: string }> = {
  first: { name: 'The first images', color: '#7c3aed', blurb: 'Modules 1 and 2: head ultrasound through the open fontanelle, and the CT that answers the emergency questions.' },
  mri: { name: 'Reading MRI', color: '#4f46e5', blurb: 'Modules 3 and 4: the sequences, myelination by age and a systematic read, then the patterns of disease.' },
  special: { name: 'Vessels and the fetus', color: '#9333ea', blurb: 'Modules 5 and 6: CT and MR angiography, catheter angiography and arterial territories, and fetal MRI.' },
};

export type NradPlanStatus = 'live' | 'planned';

export interface NradPlanItem {
  number: number;
  id: string;          // module id once written; also the URL segment
  title: string;
  short: string;
  track: keyof typeof NRAD_TRACKS;
  status: NradPlanStatus;
  blurb: string;       // what the module will cover
  note?: string;       // why it is not live yet
}

export const NRAD_PLAN: NradPlanItem[] = [
  { number: 1, id: 'm01-head-ultrasound', title: 'Head ultrasound', short: 'Head ultrasound', track: 'first', status: 'planned', blurb: 'Windows through the fontanelle, germinal matrix and intraventricular hemorrhage, ventricular size, and white-matter injury of prematurity.', note: 'In preparation.' },
  { number: 2, id: 'm02-ct-head', title: 'CT of the head in children', short: 'CT head', track: 'first', status: 'live', blurb: 'Hounsfield units and windows, a systematic read with pediatric normals, hemorrhage by shape, herniation and hydrocephalus, abusive head trauma, and when to scan.' },
  { number: 3, id: 'm03-reading-mri', title: 'MRI: how to read it', short: 'Reading MRI', track: 'mri', status: 'planned', blurb: 'What each sequence shows, myelination milestones tied to the atlas, and a systematic read.' },
  { number: 4, id: 'm04-mri-pathology', title: 'MRI pathology', short: 'MRI pathology', track: 'mri', status: 'planned', blurb: 'Stroke, demyelination, infection, tumors, hypoxic-ischemic injury and metabolic disease, each tied back to the deficit it produces.' },
  { number: 5, id: 'm05-vascular-imaging', title: 'Vascular imaging', short: 'Vascular imaging', track: 'special', status: 'planned', blurb: 'CTA, MRA and catheter angiography, arterial territories, and how a territory predicts the deficit.' },
  { number: 6, id: 'm06-fetal-mri', title: 'Fetal MRI', short: 'Fetal MRI', track: 'special', status: 'planned', blurb: 'Normal fetal brain development, ventriculomegaly, malformations, and what to tell parents before birth.' },
];

export const NRAD_RESOURCES = [
  { name: 'Image Gently', url: 'https://www.imagegently.org/', note: 'The pediatric radiation-safety alliance: parent handouts and guidance on choosing and dosing scans for children.' },
  { name: 'Radiopaedia', url: 'https://radiopaedia.org/', note: 'A free, peer-edited radiology encyclopedia with articles and cases on most entities in these modules.' },
];
