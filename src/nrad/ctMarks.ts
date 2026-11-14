// What is marked on the real CT images of Module 2, and the words that go with them: numbered
// landmarks, the probe landmarks of the window lab, the open-access pediatric figures and every
// caption. Coordinates are pixels of the stored image (x right, y down). All CQ500 slices follow
// the radiological convention, so the patient's right is on the image left.
// Pure data and functions with type-only imports, so scripts/test-nrad-models.ts can run it.

import type { FigureLine, FigureMark } from '../figureOverlay';

export interface MarkSet {
  /** Slice the marks are drawn on, when it differs from the key. */
  img?: string;
  /** False leaves out the amber outline even when the slice has one. */
  outline?: false;
  marks: FigureMark[];
  lines?: FigureLine[];
}

export const CT_MARKS: Record<string, MarkSet> = {
  'edh-a': { marks: [
    { n: 1, at: [215, 95], label: 'Epidural hematoma' },
    { n: 2, at: [274, 160], label: 'Scalp swelling' },
  ] },
  'sdh-b': { marks: [
    { n: 1, at: [55, 180], label: 'Subdural hematoma' },
    { n: 2, at: [128, 58], label: 'Falx' },
    { n: 3, at: [161, 120], label: 'Septum pellucidum', ang: -62 },
  ] },
  'sdh-b-shift': { img: 'sdh-b', outline: false,
    marks: [
      { n: 1, at: [55, 200], label: 'Subdural hematoma' },
      { n: 2, at: [161, 120], label: 'Septum pellucidum', ang: -40 },
    ],
    lines: [
      { from: [123, 44], to: [158, 295], dash: true },
      { from: [134.1, 123.7], to: [161, 120], label: '16 mm', labelAt: [166, 132] },
    ] },
  'sah-a': { marks: [
    { n: 1, at: [171, 108], label: 'Interhemispheric fissure' },
    { n: 2, at: [265, 172], label: 'Sylvian fissure, left' },
    { n: 3, at: [97, 178], label: 'Sylvian fissure, right' },
  ] },
  'sah-b': { marks: [
    { n: 1, at: [186, 212], label: 'Interpeduncular cistern', ang: -75 },
    { n: 2, at: [214, 228], label: 'Ambient cistern', ang: 20 },
    { n: 3, at: [245, 160], label: 'Sylvian fissure' },
    { n: 4, at: [182, 240], label: 'Midbrain', ang: 95 },
    { n: 5, at: [122, 221], label: 'Temporal horn' },
  ] },
  'sah-c': { marks: [
    { n: 1, at: [160, 85], label: 'Interhemispheric fissure' },
    { n: 2, at: [258, 190], label: 'Sylvian fissure' },
    { n: 3, at: [96, 222], label: 'Sulcus' },
    { n: 4, at: [224, 250], label: 'Choroid plexus calcification' },
  ] },
  'iph-a': { marks: [
    { n: 1, at: [108, 128], label: 'Hematoma', ang: -125 },
    { n: 2, at: [74, 98], label: 'Edema', ang: -165 },
    { n: 3, at: [160, 168], label: 'Frontal horns', ang: -60 },
  ] },
  'iph-b': { marks: [
    { n: 1, at: [103, 133], label: 'Hematoma' },
    { n: 2, at: [96, 84], label: 'Edema', ang: -120 },
    { n: 3, at: [170, 180], label: 'Lateral ventricles', ang: -20 },
  ] },
  'ivh-a': { marks: [
    { n: 1, at: [160, 151], label: 'Frontal horn', ang: -110 },
    { n: 2, at: [177, 226], label: 'Third ventricle', ang: 0 },
    { n: 3, at: [228, 281], label: 'Atrium of the lateral ventricle' },
  ] },
  'ivh-b': { marks: [
    { n: 1, at: [160, 175], label: 'Right lateral ventricle' },
    { n: 2, at: [212, 215], label: 'Left lateral ventricle' },
    { n: 3, at: [122, 268], label: 'Occipital horn' },
  ] },
  'sdh-c': { marks: [
    { n: 1, at: [57, 190], label: 'Subdural hematoma' },
    { n: 2, at: [95, 150], label: 'Effaced sulci' },
    { n: 3, at: [262, 172], label: 'Open sulci' },
    { n: 4, at: [205, 200], label: 'Left lateral ventricle', ang: 25 },
  ] },
  'normal-bg': { marks: [
    { n: 1, at: [176, 150], label: 'Frontal horn', ang: -78 },
    { n: 2, at: [194, 156], label: 'Caudate head', ang: -52 },
    { n: 3, at: [228, 185], label: 'Lentiform nucleus', ang: -22 },
    { n: 4, at: [207, 202], label: 'Internal capsule, posterior limb', ang: 2 },
    { n: 5, at: [188, 212], label: 'Thalamus', ang: 28 },
    { n: 6, at: [165, 256], label: 'Quadrigeminal cistern', ang: 75 },
    { n: 7, at: [165, 210], label: 'Third ventricle', ang: 118 },
    { n: 8, at: [88, 195], label: 'Sylvian fissure and insula', ang: 175 },
    { n: 9, at: [118, 108], label: 'Frontal white matter', ang: -140 },
    { n: 10, at: [168, 58], label: 'Falx', ang: -100 },
  ] },
  'normal-vent': { marks: [
    { n: 1, at: [194, 214], label: 'Lateral ventricle', ang: 15 },
    { n: 2, at: [235, 185], label: 'White matter', ang: -25 },
    { n: 3, at: [275, 195], label: 'Cortex', ang: 0 },
    { n: 4, at: [262, 135], label: 'Sulcus', ang: -50 },
    { n: 5, at: [170, 70], label: 'Falx', ang: -92 },
  ] },
};

// ── Window lab: slices stored with their true Hounsfield values ───────────────

export interface Landmark {
  id: string;
  label: string;
  at: [number, number];
  /** Range the 5 x 5 pixel mean at this point must fall in. Checked by the tests against the file. */
  range: [number, number];
  note?: string;
}

export interface LabSlice {
  id: string;
  label: string;
  /** One line under the image saying what the slice shows. */
  about: string;
  /** Landmark the probe starts on. */
  start: string;
  landmarks: Landmark[];
}

export const LAB_SLICES: LabSlice[] = [
  { id: 'sdh-a', label: 'Subdural', start: 'blood',
    about: 'A thin subdural hematoma along the right side of the head, which is the left side of the image.',
    landmarks: [
      { id: 'blood', label: 'Subdural blood', at: [46, 230], range: [70, 88] },
      { id: 'skull', label: 'Skull', at: [161, 359], range: [1000, 1600] },
      { id: 'cortex', label: 'Cortex', at: [285, 190], range: [38, 50] },
      { id: 'white', label: 'White matter', at: [250, 150], range: [27, 36] },
      { id: 'csf', label: 'CSF in the left lateral ventricle', at: [215, 235], range: [3, 15] },
      { id: 'air', label: 'Air', at: [6, 6], range: [-1024, -990] },
    ] },
  { id: 'edh-a', label: 'Epidural', start: 'blood',
    about: 'A left frontal epidural hematoma, with swelling of the scalp over it.',
    landmarks: [
      { id: 'blood', label: 'Epidural blood', at: [215, 95], range: [60, 78] },
      { id: 'scalp', label: 'Scalp swelling', at: [272, 150], range: [48, 68], note: 'Swollen scalp measures in the same range as blood, so its position outside the skull is what identifies it.' },
      { id: 'skull', label: 'Skull', at: [216, 328], range: [900, 1500] },
      { id: 'brain', label: 'Frontal lobe', at: [110, 110], range: [20, 34] },
      { id: 'csf', label: 'CSF in the right frontal horn', at: [135, 146], range: [0, 14] },
      { id: 'pineal', label: 'Pineal calcification', at: [142, 215], range: [60, 150], note: 'A calcification this small is averaged with the tissue around it, so it measures far below bone.' },
      { id: 'air', label: 'Air', at: [6, 6], range: [-1024, -990] },
    ] },
];

/** Mean HU of the (2r+1) x (2r+1) box centered on a pixel, clipped at the image edge. */
export function roiMean(hu: ArrayLike<number>, w: number, h: number, x: number, y: number, r = 2): number {
  let sum = 0, n = 0;
  for (let j = Math.max(0, y - r); j <= Math.min(h - 1, y + r); j++)
    for (let i = Math.max(0, x - r); i <= Math.min(w - 1, x + r); i++) { sum += hu[j * w + i]; n++; }
  return n ? sum / n : NaN;
}

export interface HuCategory { label: string; note: string }

/** What a measured value is compatible with. A number alone never names a tissue. */
export function huCategory(hu: number): HuCategory {
  if (hu < -200) return { label: 'Air', note: 'Air sets the bottom of the scale at -1000 HU.' };
  if (hu < -20) return { label: 'Fat range', note: 'CT studies define fat as -190 to -30 HU. At an edge the scanner also averages air with tissue.' };
  if (hu < 20) return { label: 'Fluid range', note: 'CSF measures about 6 to 15 HU. Water is 0.' };
  if (hu < 46) return { label: 'Brain tissue range', note: 'Gray matter measures a few HU above white matter.' };
  if (hu < 100) return { label: 'Range of acute blood', note: 'Acute blood typically measures 50 to 70 HU, and the clots on these two scans measure 55 to 88. Scalp, muscle and dura can measure the same, so location decides.' };
  if (hu < 300) return { label: 'Above blood', note: 'Calcification, thin bone, or bone averaged with soft tissue at its edge.' };
  return { label: 'Bone', note: 'Dense bone sits around +1000 HU and often measures higher.' };
}

/** Landmark within `reach` pixels of a point, nearest first. */
export function landmarkNear(slice: LabSlice, x: number, y: number, reach = 4): Landmark | null {
  let best: Landmark | null = null, d = reach + 1e-9;
  for (const m of slice.landmarks) { const k = Math.hypot(m.at[0] - x, m.at[1] - y); if (k <= d) { d = k; best = m; } }
  return best;
}

// ── Open-access pediatric figures (all CC BY 4.0, cropped from the published figure) ─────────

export interface OaImage {
  file: string;
  w: number;
  h: number;
  /** The patient, as the source describes them. */
  who: string;
  credit: string;
  /** What the arrows and letters printed into the source figure mean. */
  note?: string;
}

export const OA_IMAGES: Record<string, OaImage> = {
  'oa-edh-11y': { file: '/nrad/oa/oa-edh-11y.webp', w: 1237, h: 1237, who: 'An 11-year-old injured in a road crash', credit: 'Tsitsipanis 2023, Pediatric Reports, Figure 1a, cropped',
    note: 'The arrow printed on the source figure points at the collection, and the letter is its panel label.' },
  'oa-edh-11y-bone': { file: '/nrad/oa/oa-edh-11y-bone.webp', w: 1237, h: 1256, who: 'The same 11-year-old, bone window', credit: 'Tsitsipanis 2023, Pediatric Reports, Figure 1c, cropped',
    note: 'The arrow printed on the source figure points at the fracture of the left temporal bone.' },
  'oa-sdh-3y': { file: '/nrad/oa/oa-sdh-3y.webp', w: 1400, h: 1400, who: 'A 3-year-old with a sudden change in mental status and many bruises', credit: 'Caré 2022, Diagnostics, Figure 3, cropped',
    note: 'On the source figure the white arrow points at the collection, the black arrowheads mark midline shift and the black arrow marks an effaced temporal horn.' },
  'oa-sdh-falx-4m': { file: '/nrad/oa/oa-sdh-falx-4m.webp', w: 1400, h: 1400, who: 'A 4-month-old with a seizure and lethargy', credit: 'Caré 2022, Diagnostics, Figure 4a, cropped',
    note: 'The arrow printed on the source figure points at the blood.' },
  'oa-normal-14m': { file: '/nrad/oa/oa-normal-14m.webp', w: 722, h: 721, who: 'A 14-month-old', credit: 'Afsharpayman 2024, Journal of Medical Case Reports, Figure 3B, cropped' },
  'oa-bess-7m': { file: '/nrad/oa/oa-bess-7m.webp', w: 966, h: 1020, who: 'A 7-month-old with a large head', credit: 'Raissaki 2023, Pediatric Radiology, Figure 2, cropped' },
  'oa-sutures-3d': { file: '/nrad/oa/oa-sutures-3d.webp', w: 1400, h: 726, who: 'An infant', credit: 'Timberlake 2016, eLife, Figure 1a, cropped' },
  'oa-fx-9m': { file: '/nrad/oa/oa-fx-9m.webp', w: 1496, h: 723, who: 'A 9-month-old', credit: 'Paddock 2023, Pediatric Radiology, Figure 4, cropped' },
  'oa-cisterns-5y': { file: '/nrad/oa/oa-cisterns-5y.webp', w: 1600, h: 1090, who: 'A 5-year-old with encephalitis', credit: 'Mierzewska-Schmidt 2024, Biomedicines, Figure 1, cropped' },
  'oa-hydro': { file: '/nrad/oa/oa-hydro.webp', w: 937, h: 699, who: 'An infant born at 26 weeks', credit: 'Kharoufeh 2026, Children, Figure 1, cropped' },
  'oa-aht-8m': { file: '/nrad/oa/oa-aht-8m.webp', w: 731, h: 751, who: 'An 8-month-old', credit: 'Colleran 2025, European Radiology, Figure 2A, cropped' },
  'oa-hie-3m': { file: '/nrad/oa/oa-hie-3m.webp', w: 1081, h: 1081, who: 'A 3-month-old', credit: 'Caré 2022, Diagnostics, Figure 2a, cropped' },
};

export const OA_LICENCE = 'CC BY 4.0';
export const CQ500_LICENCE = 'CC BY-NC-SA 4.0';
/** The files carry no ages. The dataset's paper excluded children under 7 and reports mean ages of 43 and 52 years in its two batches. */
export const CQ500_WHO = 'Age not recorded. Most patients in this dataset are adults';
/** "CQ500-CT-99" → the credit line under an image. */
export function cq500Credit(caseId: string): string {
  return `CQ500 dataset, case ${caseId.replace(/^CQ500-CT-/, '')} (Chilamkurthy 2018)`;
}

// ── Figures shown under the section text ──────────────────────────────────────
// Each caption begins with its title, because the figure card prints the title in bold and
// then the rest of the caption.

export interface FigureText { title: string; body: string; maxWidth?: number }

export const FIGURE_TEXT: Record<string, FigureText> = {
  'normal-bg': { title: 'Normal anatomy at the level of the basal ganglia',
    body: 'A scan that all three readers called normal, shown on a brain window. Gray matter is lighter than white matter, and CSF in the ventricles, cisterns and fissures is dark.' },
  'normal-vent': { title: 'Normal anatomy at the level of the lateral ventricles',
    body: 'The same scan, higher up. The sulci hold dark CSF, and the cortex forms a lighter ribbon over the white matter.' },
  'oa-normal-14m': { title: 'A normal head CT at 14 months',
    body: 'The authors reported this scan as normal. The ventricles are small and symmetric, and the sylvian fissures hold dark CSF. The letter B is the panel label from the source figure.' },
  'oa-bess-7m': { title: 'Benign enlargement of the subarachnoid spaces at 7 months',
    body: 'The CSF spaces over the frontal lobes and between the hemispheres are wide, and the cortex beneath them is not flattened. The open arrows from the source figure mark vessels that lie away from the surface of the brain.' },
  'oa-sutures-3d': { title: 'Normal infant sutures on 3D CT', maxWidth: 640,
    body: 'The letters from the source figure mark the sagittal (S) and metopic (M) sutures. The dark gap where they meet the coronal sutures is the anterior fontanelle.' },
  'oa-fx-9m': { title: 'A linear skull fracture and an accessory suture at 9 months', maxWidth: 640,
    body: 'On the bone window (a) the arrow marks a right parietal fracture and the arrowheads mark scalp swelling over it. On the 3D reconstruction (b) the arrows follow the fracture, and the arrowheads mark an accessory suture in the occipital bone, a normal variant with a zigzag course.' },
  'sah-b': { title: 'Subarachnoid blood in the basal cisterns',
    body: 'Bright blood outlines the midbrain and fills the sylvian fissure, where dark CSF should be.' },
  'sdh-b-shift': { title: 'Midline shift from a subdural hematoma',
    body: 'The dashed line joins the front and back attachments of the falx, and the septum pellucidum lies about 16 mm toward the patient\'s left of it.' },
  'sdh-c': { title: 'Mass effect on the sulci',
    body: 'A scan with a right subdural hematoma. The sulci beneath the collection are pressed flat, while the sulci of the left hemisphere still hold CSF.' },
  'oa-cisterns-5y': { title: 'Open and effaced CSF spaces in a 5-year-old with encephalitis', maxWidth: 640,
    body: 'On admission (A) dark CSF fills the cisterns around the brainstem and the sylvian fissures. Five days later (B) the brain is diffusely swollen and those spaces have closed. The authors reported tonsillar herniation on the second scan.' },
  'oa-hydro': { title: 'Hydrocephalus in an infant born at 26 weeks', maxWidth: 520,
    body: 'The lateral ventricles are greatly enlarged and the brain around them is thin. The labels and arrows come from the source figure. The authors describe it as posthemorrhagic hydrocephalus.' },
  'oa-aht-8m': { title: 'Subdural collections of mixed density at 8 months',
    body: 'The infant was found floppy and unresponsive, with no explanation. The arrows from the source figure mark several subdural collections of mixed density, and the arrowhead marks one along the falx.' },
  'oa-hie-3m': { title: 'Diffuse abnormal attenuation of both hemispheres at 3 months',
    body: 'The infant presented in status epilepticus with bruises. The arrowheads from the source figure mark abnormal attenuation throughout both cerebral hemispheres.' },
};
