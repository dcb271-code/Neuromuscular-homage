// Vertigo: peripheral or central? Two features do most of the work (Brazis 2011, p. 265):
// fixation suppresses peripheral but not central nystagmus, and pure vertical or pure torsional
// nystagmus is central. Direction-changing nystagmus and brainstem neighbours point central;
// hearing loss and tinnitus point to the ear or nerve (Pearl 2014, pp. 119-121).
// A single central feature outweighs several peripheral ones: missing a cerebellar stroke costs
// more than over-investigating labyrinthitis (Pearl 2014, pp. 121-122).

export type Lean = 'peripheral' | 'central';
export interface VestFeature { id: string; label: string; lean: Lean; weight: number; why: string }

export const VEST_FEATURES: VestFeature[] = [
  { id: 'one-direction', label: 'Nystagmus beats one way in every direction of gaze', lean: 'peripheral', weight: 1, why: 'Unidirectional nystagmus is the peripheral pattern (Pearl 2014, p. 120).' },
  { id: 'fixation', label: 'Nystagmus fades when the child fixes on a target', lean: 'peripheral', weight: 1, why: 'Fixation suppresses peripheral nystagmus (Brazis 2011, p. 265).' },
  { id: 'hearing', label: 'New hearing loss or tinnitus in one ear', lean: 'peripheral', weight: 1, why: 'The cochlea or nerve is involved along with the labyrinth (Pearl 2014, p. 119).' },
  { id: 'changes', label: 'Nystagmus changes direction with gaze', lean: 'central', weight: 2, why: 'Direction-changing nystagmus is central, and is how a cerebellar stroke betrays itself (Pearl 2014, pp. 121-122).' },
  { id: 'vertical', label: 'Pure vertical or pure torsional nystagmus', lean: 'central', weight: 2, why: 'Pure vertical or torsional nystagmus is central (Brazis 2011, p. 265).' },
  { id: 'no-fixation', label: 'Fixation does not suppress the nystagmus', lean: 'central', weight: 2, why: 'Central nystagmus persists despite fixation (Brazis 2011, p. 265).' },
  { id: 'neighbours', label: 'Double vision, slurred speech, facial numbness or limb ataxia', lean: 'central', weight: 3, why: 'Brainstem or cerebellar neighbours: everything is the company you keep (Pearl 2014, p. 121).' },
];

export function vestVerdict(ids: string[]) {
  const on = VEST_FEATURES.filter(f => ids.includes(f.id));
  if (!on.length) return { lean: null, text: 'Choose what you see. Look at the eyes first, then for neighbours.', central: 0, peripheral: 0 };
  const central = on.filter(f => f.lean === 'central').reduce((a, f) => a + f.weight, 0);
  const peripheral = on.filter(f => f.lean === 'peripheral').reduce((a, f) => a + f.weight, 0);
  if (central > 0) return { lean: 'central' as const, central, peripheral, text: 'At least one central feature is present. Treat this as brainstem or cerebellum until proved otherwise, however many peripheral features sit beside it.' };
  return { lean: 'peripheral' as const, central, peripheral, text: 'Only peripheral features. The labyrinth or vestibular nerve fits, and the vertigo should ease over days as the brain compensates. If it does not, look again.' };
}
