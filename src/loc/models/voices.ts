// Three voices of a lesion (plus one): the same address can subtract a function, irritate it,
// or release what it used to restrain; and when input is lost the brain may fill the gap.
// Our synthesis of examples scattered through Pearl & Emsellem 2014 (pages per cell), with
// the infant reflexes from the Utah PediNeuroLogic Exam.

export type Voice = 'subtract' | 'irritate' | 'release' | 'fill';
export const VOICES: { id: Voice; name: string; gist: string }[] = [
  { id: 'subtract', name: 'Goes quiet', gist: 'Damaged tissue stops working, giving a negative sign.' },
  { id: 'irritate', name: 'Fires', gist: 'Excited tissue overacts, giving a positive sign that often points the other way.' },
  { id: 'release', name: 'Lets go', gist: 'A structure that held something back fails, and what it restrained becomes overactive.' },
  { id: 'fill', name: 'Fills in', gist: 'An input is lost and the brain supplies an answer of its own.' },
];

export interface VoiceCell { sign: string; cite: string }
export interface Structure { id: string; name: string; cells: Partial<Record<Voice, VoiceCell>>; note?: string }

export const STRUCTURES: Structure[] = [
  { id: 'fef', name: 'Frontal eye field', cells: {
    subtract: { sign: 'The eyes drift toward the side of the lesion: the opposite eye field pushes unopposed.', cite: 'Pearl 2014, pp. 9, 43' },
    irritate: { sign: 'A seizure drives the eyes away from the side of the focus.', cite: 'Pearl 2014, p. 9' },
  }, note: 'Because a destroyed eye field and a firing one push the eyes in opposite directions, the direction of the eyes, read with the rest of the exam, tells you which is happening.' },
  { id: 'motor', name: 'Motor cortex', cells: {
    subtract: { sign: 'Weakness of the opposite face, arm or leg, in proportion to which part of the strip is lost.', cite: 'Pearl 2014, pp. 7-8' },
    irritate: { sign: 'Clonic jerking that can march from face to hand to arm as the discharge spreads along the strip.', cite: 'Pearl 2014, p. 10' },
  } },
  { id: 'ust', name: 'Upper motor neuron pathway', cells: {
    subtract: { sign: 'Weakness, loss of fine finger movement.', cite: 'Pearl 2014, p. 108' },
    release: { sign: 'The lower motor neuron, freed from restraint, overreacts: brisk reflexes, clonus, rising tone, an upgoing toe.', cite: 'Pearl 2014, pp. 65, 108' },
  }, note: 'Spasticity comes from activity the upper motor neurons used to restrain, which is why it appears below a lesion rather than at it.' },
  { id: 'frontal', name: 'Frontal lobes (maturing or failing)', cells: {
    release: { sign: 'Infant reflexes held down by maturation (grasp, suck, rooting, snout) reappear when frontal control fails later in life.', cite: 'Pearl 2014, p. 114; Utah' },
  }, note: 'In an infant these reflexes are normal and should fade on schedule, so the same finding means something different depending on the age of the child.' },
  { id: 'occipital', name: 'Occipital cortex', cells: {
    subtract: { sign: 'A hemianopia on the opposite side.', cite: 'Pearl 2014, pp. 27-28' },
    irritate: { sign: 'Simple visual phenomena: flashes, zigzags, coloured lights.', cite: 'Pearl 2014, p. 30' },
    fill: { sign: 'With both occipital lobes lost, a patient may deny being blind and describe things that are not there.', cite: 'Pearl 2014, p. 29' },
  } },
  { id: 'temporal', name: 'Medial temporal lobe', cells: {
    subtract: { sign: 'Bilateral damage stops new memories forming.', cite: 'Pearl 2014, p. 14' },
    irritate: { sign: 'Déjà vu, smells that are not there, a rising feeling in the stomach, then automatisms.', cite: 'Pearl 2014, pp. 17-18, 104' },
  } },
  { id: 'parietal', name: 'Right parietal lobe', cells: {
    subtract: { sign: 'The left side of space and body is neglected.', cite: 'Pearl 2014, p. 23' },
    fill: { sign: 'The patient is unaware of the deficit and may disown the left arm.', cite: 'Pearl 2014, p. 23; DeMyer, p. 441' },
  } },
  { id: 'root', name: 'Sensory root or nerve', cells: {
    subtract: { sign: 'Numbness in the root or nerve territory.', cite: 'Pearl 2014, p. 78' },
    irritate: { sign: 'Tingling or shooting pain along the same territory, worse with coughing or stretch.', cite: 'Pearl 2014, pp. 78, 124' },
  } },
  { id: 'vagus', name: 'Vagus nerve', cells: {
    subtract: { sign: 'A destroyed vagus lets the heart run fast.', cite: 'Pearl 2014, p. 56' },
    irritate: { sign: 'An irritated vagus slows the heart.', cite: 'Pearl 2014, p. 56' },
  } },
];

export function voiceAt(structureId: string, voice: Voice): VoiceCell | null {
  return STRUCTURES.find(s => s.id === structureId)?.cells[voice] ?? null;
}
