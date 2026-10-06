// Dermatome key sensory points, after the International Standards for Neurological
// Classification of Spinal Cord Injury, revised 2011 (Kirshblum et al., PMID 22330108).
// Landmarks are paraphrased; key muscles are the standard ones for C5-T1 and L2-S1.
//
// Coordinates sit on the public-domain dermatome drawing by Ralf Stephan (Wikimedia Commons,
// "Dermatoms.svg"), in a 1202 x 1700 frame (A4). Each point was checked against the drawing:
// limb and trunk points by the drawing's own color for that root, thoracic points by counting
// the drawn bands down the midclavicular line (band k is Tk; T12 is the strip at the groin).

export type View = 'front' | 'back';
export interface KeyPoint { root: string; view: View; x: number; y: number; landmark: string; muscle?: string }

export const SEGMENT_ORDER = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4-5'];

export const KEY_POINTS: KeyPoint[] = [
  { root: 'C2', view: 'back', x: 665, y: 180, landmark: 'Just beside the occipital protuberance at the back of the head' },
  { root: 'C3', view: 'front', x: 450, y: 292, landmark: 'Supraclavicular fossa, in the midclavicular line' },
  { root: 'C4', view: 'front', x: 325, y: 350, landmark: 'Over the acromioclavicular joint' },
  { root: 'C5', view: 'front', x: 285, y: 545, landmark: 'Lateral (radial) side of the antecubital fossa', muscle: 'Elbow flexors' },
  { root: 'C6', view: 'front', x: 160, y: 836, landmark: 'Thumb, back of the proximal phalanx', muscle: 'Wrist extensors' },
  { root: 'C7', view: 'front', x: 210, y: 878, landmark: 'Middle finger, back of the proximal phalanx', muscle: 'Elbow extensors' },
  { root: 'C8', view: 'front', x: 230, y: 878, landmark: 'Little finger, back of the proximal phalanx', muscle: 'Finger flexors (distal phalanx of the middle finger)' },
  { root: 'T1', view: 'front', x: 322, y: 560, landmark: 'Medial (ulnar) side of the antecubital fossa', muscle: 'Little finger abductors' },
  { root: 'T2', view: 'front', x: 372, y: 402, landmark: 'Apex of the axilla' },
  { root: 'T3', view: 'front', x: 420, y: 438, landmark: 'Third intercostal space, midclavicular line' },
  { root: 'T4', view: 'front', x: 420, y: 466, landmark: 'Fourth intercostal space: the nipple line' },
  { root: 'T5', view: 'front', x: 420, y: 495, landmark: 'Fifth intercostal space, midclavicular line' },
  { root: 'T6', view: 'front', x: 420, y: 524, landmark: 'Sixth intercostal space: the level of the xiphisternum' },
  { root: 'T7', view: 'front', x: 420, y: 553, landmark: 'Seventh intercostal space, midclavicular line' },
  { root: 'T8', view: 'front', x: 420, y: 585, landmark: 'Eighth intercostal space, midclavicular line' },
  { root: 'T9', view: 'front', x: 420, y: 622, landmark: 'Ninth intercostal space, midclavicular line' },
  { root: 'T10', view: 'front', x: 420, y: 663, landmark: 'Tenth intercostal space: the level of the umbilicus' },
  { root: 'T11', view: 'front', x: 420, y: 710, landmark: 'Eleventh intercostal space, midclavicular line' },
  { root: 'T12', view: 'front', x: 466, y: 761, landmark: 'Midpoint of the inguinal ligament' },
  { root: 'L1', view: 'front', x: 440, y: 822, landmark: 'Halfway between the T12 and L2 points' },
  { root: 'L2', view: 'front', x: 452, y: 880, landmark: 'Front of the medial thigh, halfway to the knee', muscle: 'Hip flexors' },
  { root: 'L3', view: 'front', x: 445, y: 1095, landmark: 'Medial femoral condyle, just above the knee', muscle: 'Knee extensors' },
  { root: 'L4', view: 'front', x: 452, y: 1440, landmark: 'Medial malleolus', muscle: 'Ankle dorsiflexors' },
  { root: 'L5', view: 'front', x: 400, y: 1490, landmark: 'Dorsum of the foot at the third metatarsophalangeal joint', muscle: 'Long toe extensors' },
  { root: 'S1', view: 'back', x: 722, y: 1405, landmark: 'Lateral heel', muscle: 'Ankle plantar flexors' },
  { root: 'S2', view: 'back', x: 690, y: 1150, landmark: 'Midpoint of the popliteal fossa' },
  { root: 'S3', view: 'back', x: 700, y: 940, landmark: 'Ischial tuberosity or infragluteal fold' },
  { root: 'S4-5', view: 'back', x: 648, y: 855, landmark: 'Perianal skin, tested as a single level' },
];

/** Status of each key point for a complete cord lesion at `level`: normal above, at the level, lost below. */
export function levelStatus(level: string): Record<string, 'normal' | 'level' | 'lost'> {
  const i = SEGMENT_ORDER.indexOf(level);
  return Object.fromEntries(SEGMENT_ORDER.map((r, j) => [r, j < i ? 'normal' : j === i ? 'level' : 'lost']));
}

export const LEVEL_CHOICES = ['C4', 'C5', 'C6', 'C8', 'T2', 'T4', 'T6', 'T10', 'T12', 'L2', 'L4', 'S1'];
