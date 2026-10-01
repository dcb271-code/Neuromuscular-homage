// Visual pathway model. Each eye's field is four quadrants (upper/lower × left/right, in the
// world's frame). The model routes each quadrant through the pathway, so any lesion site can
// be asked which quadrants it removes.
//
//   Light from the LEFT visual field lands on the RIGHT half of each retina.
//   Light from the UPPER field lands on the LOWER retina.
//   Nasal retinal fibers cross at the chiasm; temporal fibers stay on their own side.
//   So the right optic tract, radiation and cortex carry the LEFT field of BOTH eyes.
//   Behind the lateral geniculate: lower retina (upper field) fibers loop through the temporal
//   lobe (Meyer's loop); upper retina (lower field) fibers run in the parietal radiation.
// (Fisch 2012, Drawing 22-9; Pearl 2014, pp. 27-28.)

export type Eye = 'L' | 'R';
export type HField = 'left' | 'right';
export type VField = 'upper' | 'lower';
export interface Quadrant { eye: Eye; h: HField; v: VField }

export type LesionSite =
  | 'optic-nerve-L' | 'optic-nerve-R' | 'chiasm'
  | 'tract-L' | 'tract-R'
  | 'meyer-L' | 'meyer-R' | 'parietal-L' | 'parietal-R'
  | 'occipital-L' | 'occipital-R';

export const SITES: { id: LesionSite; name: string; defect: string }[] = [
  { id: 'optic-nerve-L', name: 'Left optic nerve', defect: 'Blind left eye' },
  { id: 'optic-nerve-R', name: 'Right optic nerve', defect: 'Blind right eye' },
  { id: 'chiasm', name: 'Optic chiasm', defect: 'Bitemporal hemianopia' },
  { id: 'tract-L', name: 'Left optic tract', defect: 'Right homonymous hemianopia' },
  { id: 'tract-R', name: 'Right optic tract', defect: 'Left homonymous hemianopia' },
  { id: 'meyer-L', name: "Left temporal lobe (Meyer's loop)", defect: 'Right upper quadrantanopia ("pie in the sky")' },
  { id: 'meyer-R', name: "Right temporal lobe (Meyer's loop)", defect: 'Left upper quadrantanopia' },
  { id: 'parietal-L', name: 'Left parietal radiation', defect: 'Right lower quadrantanopia' },
  { id: 'parietal-R', name: 'Right parietal radiation', defect: 'Left lower quadrantanopia' },
  { id: 'occipital-L', name: 'Left occipital cortex', defect: 'Right homonymous hemianopia, often with macular sparing' },
  { id: 'occipital-R', name: 'Right occipital cortex', defect: 'Left homonymous hemianopia, often with macular sparing' },
];

/** The retina half that receives a quadrant of an eye's field. */
function retina(q: Quadrant) {
  const half: 'left' | 'right' = q.h === 'left' ? 'right' : 'left'; // fields invert on the retina
  const nasal = (q.eye === 'L' && half === 'right') || (q.eye === 'R' && half === 'left');
  return { half, nasal, lower: q.v === 'upper' };
}

/** Which hemisphere's pathway carries this quadrant behind the chiasm. */
export function hemisphereFor(q: Quadrant): Eye {
  // Right halves of both retinas project to the right hemisphere.
  return retina(q).half === 'right' ? 'R' : 'L';
}

export function isLost(q: Quadrant, site: LesionSite): boolean {
  const r = retina(q);
  const hemi = hemisphereFor(q);
  switch (site) {
    case 'optic-nerve-L': return q.eye === 'L';
    case 'optic-nerve-R': return q.eye === 'R';
    case 'chiasm': return r.nasal;                      // crossing nasal fibers = temporal fields
    case 'tract-L': case 'occipital-L': return hemi === 'L';
    case 'tract-R': case 'occipital-R': return hemi === 'R';
    case 'meyer-L': return hemi === 'L' && r.lower;      // lower retina = upper field
    case 'meyer-R': return hemi === 'R' && r.lower;
    case 'parietal-L': return hemi === 'L' && !r.lower;
    case 'parietal-R': return hemi === 'R' && !r.lower;
  }
}

export const QUADRANTS: Quadrant[] = (['L', 'R'] as Eye[]).flatMap(eye =>
  (['upper', 'lower'] as VField[]).flatMap(v => (['left', 'right'] as HField[]).map(h => ({ eye, h, v }))));

export function fieldsFor(site: LesionSite): Record<Eye, Record<string, boolean>> {
  const out: Record<Eye, Record<string, boolean>> = { L: {}, R: {} };
  for (const q of QUADRANTS) out[q.eye][`${q.v}-${q.h}`] = isLost(q, site);
  return out;
}

/** Macular sparing applies to occipital lesions (dual blood supply of the occipital pole). */
export const sparesMacula = (site: LesionSite) => site === 'occipital-L' || site === 'occipital-R';
