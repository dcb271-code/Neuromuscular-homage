// Intracranial hemorrhage by shape and site: the compartments, the features that identify each
// one on CT, and a short quiz of schematic cases. Pure data and functions with no imports, so
// scripts/test-nrad-models.ts can run it under Node. Sources are keys into src/nrad/sources.ts.

export type BleedType = 'epidural' | 'subdural' | 'subarachnoid' | 'intraparenchymal' | 'intraventricular';

export type Shape = 'lens' | 'crescent' | 'sulcal' | 'rounded' | 'ventricular';
export type Boundary = 'stops-at-sutures' | 'crosses-sutures' | 'none';

export interface BleedInfo {
  type: BleedType;
  name: string;
  space: string;        // the anatomical compartment
  shape: Shape;
  shapeLabel: string;
  boundary: Boundary;
  features: string[];   // what identifies it on CT
  pitfall: string;      // where the rule bends
  children: string;     // what is different, or what it means, in a child
  localization: { href: string; label: string };
  sources: string[];
}

export const BLEEDS: Record<BleedType, BleedInfo> = {
  epidural: {
    type: 'epidural', name: 'Epidural', space: 'Between the inner table of the skull and the dura', shape: 'lens', shapeLabel: 'Lens (biconvex)', boundary: 'stops-at-sutures',
    features: [
      'Biconvex lens that bulges into the brain.',
      'Usually stops at a suture, where the dura is bound to the skull, but can cross the falx or tentorium.',
      'Sits at the site of impact, often under a fracture seen on the bone window.',
    ],
    pitfall: 'About 1 in 9 pediatric epidurals crossed a suture in one series, explained by a fracture through the suture or a separated suture (Huisman 2009). Thin or flat epidurals are often reported as subdural (Feiz-Erfan 2026).',
    children: 'In children an epidural often bleeds from the fractured bone itself rather than an artery (Mutch 2016). In a systematic review, epidural hematoma was associated with accidental rather than abusive injury (Kemp 2011).',
    localization: { href: '/localization/m10-everywhere/#s4', label: 'Localization Module 10: herniation' },
    sources: ['heit2017', 'mutch2016', 'huisman2009', 'feizerfan2026', 'kemp2011'],
  },
  subdural: {
    type: 'subdural', name: 'Subdural', space: 'Beneath the dura, over the arachnoid', shape: 'crescent', shapeLabel: 'Crescent', boundary: 'crosses-sutures',
    features: [
      'Thin crescent that follows the curve of the brain.',
      'Crosses sutures, because it lies beneath the dura.',
      'Stops at the falx and the tentorium, and may run along one side of them.',
    ],
    pitfall: 'A thin acute subdural against the skull can blend into bone on a brain window and stand out on a subdural window. In anemia it may be less dense, though a hyperdense part was present in every anemic patient in one series (Duy 2019). In an infant, mixed density can come from a single event (Tung 2006).',
    children: 'Subdurals that are multiple, interhemispheric, over the convexity or in the posterior fossa are associated with abusive head trauma (Kemp 2011).',
    localization: { href: '/localization/m10-everywhere/#s4', label: 'Localization Module 10: herniation' },
    sources: ['heit2017', 'duy2019', 'tung2006', 'kemp2011'],
  },
  subarachnoid: {
    type: 'subarachnoid', name: 'Subarachnoid', space: 'In the CSF spaces: sulci, fissures and basal cisterns', shape: 'sulcal', shapeLabel: 'Follows sulci and cisterns', boundary: 'none',
    features: [
      'Bright lines that fill sulci where dark CSF should be.',
      'After trauma it usually lies in sulci near the vertex and tends to spare the basal cisterns.',
      'Mixed with CSF it is less dense than a clot, so small amounts are faint.',
    ],
    pitfall: 'Blood diluted in CSF measures less than pure blood (Chakeres 1986), so a thin layer is easy to miss.',
    children: 'In trauma, subarachnoid blood is seen as often after accidental as after abusive injury (Kemp 2011).',
    localization: { href: '/localization/m10-everywhere/', label: 'Localization Module 10: coma and diffuse disease' },
    sources: ['heit2017', 'chakeres1986', 'kemp2011'],
  },
  intraparenchymal: {
    type: 'intraparenchymal', name: 'Intraparenchymal', space: 'Within the brain itself', shape: 'rounded', shapeLabel: 'Rounded or irregular, inside the brain', boundary: 'none',
    features: [
      'Bright focus inside gray or white matter, often with a dark rim of edema.',
      'After trauma, contusions sit at the point of impact or opposite it (coup and contrecoup).',
      'Ask whether it fits an arterial territory. One that does not may be venous.',
    ],
    pitfall: 'Hemorrhage that does not fit an arterial territory should raise the question of venous sinus thrombosis (Heit 2017).',
    children: 'Focal parenchymal injury did not separate abusive from accidental trauma in a systematic review (Kemp 2011).',
    localization: { href: '/localization/m09-hemispheres/', label: 'Localization Module 9: the hemispheres' },
    sources: ['heit2017', 'kemp2011'],
  },
  intraventricular: {
    type: 'intraventricular', name: 'Intraventricular', space: 'Inside the ventricles', shape: 'ventricular', shapeLabel: 'Fills or layers in the ventricles', boundary: 'none',
    features: [
      'Bright material inside a ventricle, in place of dark CSF.',
      'May come from a parenchymal hemorrhage or from a ruptured vascular malformation.',
      'Often accompanies blood in the brain or the subarachnoid space, so look for the source.',
    ],
    pitfall: 'In adults with spontaneous intraparenchymal hemorrhage, extension into the ventricles carries a worse prognosis (Heit 2017).',
    children: 'In the preterm infant, bleeding from the germinal matrix into the ventricles is a separate story, told in Module 1 on head ultrasound.',
    localization: { href: '/localization/m10-everywhere/#s2', label: 'Localization Module 10: finding the level in coma' },
    sources: ['heit2017'],
  },
};

export const ORDER: BleedType[] = ['epidural', 'subdural', 'subarachnoid', 'intraparenchymal', 'intraventricular'];

/** Bleed types compatible with an observed shape and suture behavior. */
export function identify(shape: Shape | null, boundary: Boundary | null): BleedType[] {
  return ORDER.filter(t => {
    const b = BLEEDS[t];
    if (shape && b.shape !== shape) return false;
    if (boundary && boundary !== 'none' && b.boundary !== boundary) {
      // An epidural that crosses a suture is the documented exception (fracture or diastasis).
      return t === 'epidural' && boundary === 'crosses-sutures' && shape === 'lens';
    }
    return true;
  });
}

// ── Quiz: schematic cases drawn by components/nrad/HemorrhageSorter.tsx ─────────

export type Side = 'left' | 'right'; // the patient's side; drawn on the opposite side of the image

export interface CaseDrawing {
  bleed: Shape | 'interhemispheric';
  side?: Side;
  crossesSuture?: boolean;
  fracture?: boolean;
  region?: 'frontal' | 'temporal' | 'parietal' | 'occipital';
}

export interface QuizCase {
  id: string;
  stem: string;
  drawing: CaseDrawing;
  answer: BleedType;
  explanation: string;
}

export const QUIZ: QuizCase[] = [
  { id: 'q-lens', stem: 'A 9-year-old fell from a climbing frame and struck the left side of his head. Where is this blood?', drawing: { bleed: 'lens', side: 'left', region: 'temporal', fracture: true }, answer: 'epidural', explanation: 'A biconvex collection that stops at the sutures, under a fracture at the point of impact, is epidural. The bone window shows the fracture.' },
  { id: 'q-crescent', stem: 'A 4-month-old is brought in limp. One collection is drawn on this slice. Where is it?', drawing: { bleed: 'crescent', side: 'right', crossesSuture: true }, answer: 'subdural', explanation: 'A thin crescent that runs past the suture lines lies beneath the dura. In an infant without a clear accidental mechanism, a subdural starts an evaluation for abuse.' },
  { id: 'q-falx', stem: 'A 3-month-old with vomiting and a full fontanelle. The blood runs along the falx. Where is it?', drawing: { bleed: 'interhemispheric', side: 'right' }, answer: 'subdural', explanation: 'Blood layered along one side of the falx is an interhemispheric subdural. It is one of the patterns associated with abusive head trauma (Kemp 2011).' },
  { id: 'q-sulci', stem: 'A 15-year-old was hit by a car. Thin bright lines fill several sulci and the sylvian fissure. Where is the blood?', drawing: { bleed: 'sulcal', side: 'left' }, answer: 'subarachnoid', explanation: 'Blood that follows the sulci and fills a fissure is in the subarachnoid space, where the CSF should be.' },
  { id: 'q-blob', stem: 'A 12-year-old with sudden headache and right-sided weakness. Where is this blood?', drawing: { bleed: 'rounded', side: 'left', region: 'frontal' }, answer: 'intraparenchymal', explanation: 'A rounded bright focus inside the brain substance, with a dark rim of edema, is intraparenchymal. The weakness is on the opposite side to the hemorrhage.' },
  { id: 'q-ivh', stem: 'A 6-year-old with a known arteriovenous malformation becomes drowsy. Where is this blood?', drawing: { bleed: 'ventricular', side: 'right' }, answer: 'intraventricular', explanation: 'Bright blood inside both occipital horns, where dark CSF should be, is intraventricular. A ruptured arteriovenous malformation can bleed into the brain, the ventricles or the subarachnoid space (Heit 2017).' },
];

export function checkAnswer(caseId: string, answer: BleedType): boolean {
  const c = QUIZ.find(q => q.id === caseId);
  return !!c && c.answer === answer;
}
