// Spinal cord lesion model. Three long tracts with a side and a crossing level, plus the
// anterior horn and the dorsal-root entry zone at the lesion's own segments. A lesion type
// says which parts of the cross-section are damaged; the deficit is computed per segment
// and per side. Teaching model after Brazis 2011 ch. 5 and Fisch 2012 Drawings 7-4 and 7-8:
//   - lateral corticospinal tract: already crossed (at the medulla) → weakness on the SAME
//     side, below the lesion, upper motor neuron type;
//   - dorsal columns: ascend uncrossed → vibration/position loss on the SAME side, below;
//   - spinothalamic tract: fibers cross within one or two segments of entry → pain and
//     temperature loss on the OPPOSITE side, starting about two segments below the lesion;
//   - anterior horn at the lesion's segments → lower motor neuron weakness AT the level.

export const SEGMENTS = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4', 'S5',
] as const;
export type Segment = (typeof SEGMENTS)[number];
export type Side = 'L' | 'R';
export const idx = (s: Segment) => SEGMENTS.indexOf(s);

export type LesionType = 'complete' | 'hemisection' | 'anterior' | 'central' | 'posterior';

export const LESION_TYPES: { id: LesionType; name: string; parts: string; example: string }[] = [
  { id: 'complete', name: 'Complete transverse lesion', parts: 'Everything at the level', example: 'Trauma, transverse myelitis, compression' },
  { id: 'hemisection', name: 'Hemisection (Brown-Séquard)', parts: 'One half of the cord', example: 'Penetrating injury, an eccentric tumor or demyelinating plaque' },
  { id: 'anterior', name: 'Anterior cord', parts: 'Front two thirds: corticospinal, spinothalamic, anterior horns', example: 'Anterior spinal artery infarct' },
  { id: 'central', name: 'Central cord (syrinx)', parts: 'The crossing spinothalamic fibers and anterior horns at the level', example: 'Syringomyelia, often with a Chiari malformation; intramedullary tumor' },
  { id: 'posterior', name: 'Posterior columns', parts: 'Dorsal columns on both sides', example: 'Vitamin B12 or copper deficiency; in children, rare' },
];

export interface SegmentDeficit {
  motor: 'normal' | 'umn' | 'lmn';
  pain: boolean;      // pain and temperature lost
  vibration: boolean; // vibration and position sense lost
}
export type CordResult = {
  bySide: Record<Side, SegmentDeficit[]>; // aligned with SEGMENTS
  bladder: boolean;
  summary: string[];
  level: Segment;
};

const blank = (): SegmentDeficit[] => SEGMENTS.map(() => ({ motor: 'normal', pain: false, vibration: false }));

export const STT_OFFSET = 2; // spinothalamic loss starts about 2 segments below (Brazis 2011, p. 106)
const SYRINX_SPAN = 4;       // segments a cervical syrinx is drawn to span

export function cordLesion(level: Segment, type: LesionType, side: Side = 'L'): CordResult {
  const L = idx(level);
  const out: Record<Side, SegmentDeficit[]> = { L: blank(), R: blank() };
  const other: Side = side === 'L' ? 'R' : 'L';
  const below = (i: number) => i > L;
  const at = (i: number) => i === L;
  const summary: string[] = [];
  let bladder = false;

  const forSides = (sides: Side[], fn: (d: SegmentDeficit, i: number) => void) =>
    sides.forEach(s => out[s].forEach((d, i) => fn(d, i)));

  switch (type) {
    case 'complete':
      forSides(['L', 'R'], (d, i) => {
        if (at(i)) d.motor = 'lmn';
        if (below(i)) d.motor = 'umn';
        if (i >= L) { d.pain = true; d.vibration = true; }
      });
      bladder = true;
      summary.push(`Weakness of everything below ${level} on both sides, upper motor neuron type once spinal shock passes.`,
        `Lower motor neuron weakness and lost reflexes at ${level} itself, from the damaged anterior horns.`,
        `Every sensory modality lost from about ${level} down: a sensory level.`,
        'Bladder and bowel control lost.');
      break;
    case 'hemisection':
      out[side].forEach((d, i) => {
        if (at(i)) { d.motor = 'lmn'; d.pain = true; d.vibration = true; }
        if (below(i)) { d.motor = 'umn'; d.vibration = true; }
      });
      out[other].forEach((d, i) => { if (i >= L + STT_OFFSET) d.pain = true; });
      summary.push(`Same side (${side}): upper motor neuron weakness below ${level}, because the corticospinal tract has already crossed in the medulla.`,
        `Same side: vibration and position sense lost below ${level}; the dorsal columns ascend uncrossed.`,
        `Opposite side (${other}): pain and temperature lost from about ${SEGMENTS[Math.min(L + STT_OFFSET, SEGMENTS.length - 1)]} down; spinothalamic fibers cross within a segment or two of entering.`,
        `A narrow band of total loss and lower motor neuron weakness at ${level} on the same side, where the entering roots and the horn are cut.`);
      break;
    case 'anterior':
      forSides(['L', 'R'], (d, i) => {
        if (at(i)) d.motor = 'lmn';
        if (below(i)) d.motor = 'umn';
        if (i >= L + 1) d.pain = true;
      });
      bladder = true;
      summary.push(`Weakness below ${level} on both sides, with lower motor neuron signs at the level.`,
        'Pain and temperature lost below the lesion on both sides.',
        'Vibration and position sense SPARED: the dorsal columns lie in the back third, supplied by the posterior spinal arteries.',
        'Bladder control lost.');
      break;
    case 'central': {
      const end = Math.min(L + SYRINX_SPAN - 1, SEGMENTS.length - 1);
      forSides(['L', 'R'], (d, i) => {
        if (i >= L && i <= end) { d.pain = true; d.motor = 'lmn'; }
      });
      summary.push(`Pain and temperature lost on both sides from ${level} to ${SEGMENTS[end]} only, with normal sensation above AND below: a suspended, cape-like loss.`,
        'The crossing spinothalamic fibers in front of the central canal are the first thing an expanding cavity cuts.',
        'Touch, vibration and position spared (dissociated sensory loss).',
        'Lower motor neuron weakness and wasting at the involved segments as the cavity reaches the anterior horns. Long-tract signs below appear later, if at all.');
      break;
    }
    case 'posterior':
      forSides(['L', 'R'], (d, i) => { if (i >= L) d.vibration = true; });
      summary.push(`Vibration and position sense lost below ${level} on both sides; strength and pain sensation spared.`,
        'The child sways or falls with eyes closed (Romberg sign) and walks on a broad base, watching the feet: sensory ataxia.');
      break;
  }
  return { bySide: out, bladder, summary, level };
}

// Body map: which segments each drawn region represents (dermatomes, simplified).
export const REGIONS: { id: string; label: string; segs: Segment[] }[] = [
  { id: 'neck', label: 'Neck and top of shoulder', segs: ['C3', 'C4'] },
  { id: 'arm-radial-prox', label: 'Outer upper arm', segs: ['C5'] },
  { id: 'arm-radial-dist', label: 'Thumb side of forearm and thumb', segs: ['C6'] },
  { id: 'hand-mid', label: 'Middle finger', segs: ['C7'] },
  { id: 'arm-ulnar-dist', label: 'Little-finger side of hand and forearm', segs: ['C8'] },
  { id: 'arm-ulnar-prox', label: 'Inner upper arm', segs: ['T1'] },
  { id: 'chest', label: 'Chest (nipple line ≈ T4)', segs: ['T2', 'T3', 'T4', 'T5', 'T6'] },
  { id: 'abdomen', label: 'Abdomen (umbilicus ≈ T10)', segs: ['T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
  { id: 'groin', label: 'Groin', segs: ['L1'] },
  { id: 'thigh', label: 'Front of thigh', segs: ['L2', 'L3'] },
  { id: 'shin-medial', label: 'Knee and inner shin', segs: ['L4'] },
  { id: 'shin-lateral', label: 'Outer shin and top of foot, big toe', segs: ['L5'] },
  { id: 'foot-lateral', label: 'Little-toe side of foot and sole', segs: ['S1'] },
  { id: 'saddle', label: 'Saddle area', segs: ['S2', 'S3', 'S4', 'S5'] },
];

export const LEVEL_CHOICES: Segment[] = ['C5', 'C7', 'T4', 'T10', 'L2'];
