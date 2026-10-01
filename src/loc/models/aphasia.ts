// Aphasia as four switches: fluency, comprehension, repetition, naming. Set the switches and the
// classic syndrome falls out (after Pearl 2014, pp. 18-20, Table 2.1; conduction aphasia after
// Brazis 2011, p. 524; mixed transcortical after Brazis 2011, p. 448). A teaching model of the
// adult classification; acquired aphasia in children does not always follow it.

export interface Switches { fluent: boolean; comprehends: boolean; repeats: boolean; names: boolean }
export interface AphasiaType { id: string; name: string; where: string; sample: string }

// Same stimulus for every type, our own: "A girl's kite is stuck in a tree. Her brother climbs a
// ladder to fetch it, and the ladder wobbles." Each sample is how the description might come out.
export const STIMULUS = 'A picture: a girl\'s kite is stuck in a tree; her brother climbs a ladder to fetch it, and the ladder wobbles.';

export const TYPES: Record<string, AphasiaType> = {
  normal: { id: 'normal', name: 'No aphasia', where: 'Language network intact', sample: '"The kite got stuck, so her brother is climbing up to get it, but the ladder\'s wobbling."' },
  anomic: { id: 'anomic', name: 'Anomic aphasia', where: 'Relatively nonlocalizing: many sites in the language network', sample: '"Her... the thing you fly, it\'s up in the, the green one. He\'s going up the, you know, to get it."' },
  broca: { id: 'broca', name: 'Broca (expressive) aphasia', where: 'Inferior frontal lobe, dominant hemisphere', sample: '"Kite... tree... boy... up. Ladder... wobble."' },
  tcm: { id: 'tcm', name: 'Transcortical motor aphasia', where: 'Frontal cortex around Broca\'s area, sparing it', sample: 'Says little unprompted, yet repeats "the ladder wobbles" perfectly.' },
  global: { id: 'global', name: 'Global aphasia', where: 'Large dominant perisylvian lesion', sample: 'A few sounds or one stereotyped word; does not follow the request.' },
  mixed: { id: 'mixed', name: 'Mixed transcortical aphasia', where: 'Cortex around the perisylvian language areas, or the dominant thalamus', sample: 'Little speech and poor understanding, but echoes "the ladder wobbles" when asked to repeat.' },
  wernicke: { id: 'wernicke', name: 'Wernicke (receptive) aphasia', where: 'Posterior superior temporal lobe, dominant hemisphere', sample: '"Well the flinder went up on the sorrow and he\'s getting the tall from the bimmet, it\'s all fine."' },
  tcs: { id: 'tcs', name: 'Transcortical sensory aphasia', where: 'Temporoparietal cortex around Wernicke\'s area', sample: 'Fluent but empty description; repeats a sentence word for word without understanding it.' },
  conduction: { id: 'conduction', name: 'Conduction aphasia', where: 'Supramarginal gyrus or the connection between the language areas', sample: '"The kite is stuck in the tree and her brother is climbing the lather, the ladder." Cannot repeat "the ladder wobbles."' },
};

export function classify(s: Switches): AphasiaType {
  if (s.fluent && s.comprehends && s.repeats) return s.names ? TYPES.normal : TYPES.anomic;
  if (!s.fluent && s.comprehends) return s.repeats ? TYPES.tcm : TYPES.broca;
  if (!s.fluent && !s.comprehends) return s.repeats ? TYPES.mixed : TYPES.global;
  if (s.fluent && !s.comprehends) return s.repeats ? TYPES.tcs : TYPES.wernicke;
  return TYPES.conduction; // fluent, comprehends, cannot repeat
}
