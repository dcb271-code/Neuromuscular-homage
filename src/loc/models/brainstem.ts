// Brainstem lesion model: the "rule of 4" (Gates 2005; Gates 2011), a teaching heuristic.
//
//   4 medial structures, starting with M:  Motor pathway, Medial lemniscus,
//     Medial longitudinal fasciculus, Motor nucleus and nerve (3/4, 6, 12).
//   4 lateral structures, starting with S:  Spinocerebellar pathways, Spinothalamic tract,
//     Sensory nucleus of 5 (spinal trigeminal), Sympathetic pathway.
//   4 cranial nerves per level: medulla 9-12, pons 5-8, above the pons 1-4 (3 and 4 in the
//     midbrain). The motor nuclei that divide evenly into 12 (3, 4, 6, 12) are medial; 5, 7,
//     9 and 11 are lateral (8 is lateral too).
//
// Where the rule bends, `notes` say so: the facial nerve's fascicle loops medially round the
// 6th nucleus, the 4th nerve crosses before it exits, and real infarcts rarely respect a
// clean medial/lateral line.

export type BsLevel = 'midbrain' | 'pons' | 'medulla';
export type Zone = 'medial' | 'lateral';
export type BsSide = 'L' | 'R';

export interface BsFinding { text: string; side: 'same' | 'opposite' | 'both'; structure: string }
export interface BsResult { findings: BsFinding[]; syndrome: string | null; notes: string[]; cranialNerves: string[] }

const CN_MEDIAL: Record<BsLevel, string[]> = { midbrain: ['3'], pons: ['6'], medulla: ['12'] };
// Medulla lateral: the rule lists 9, 10 and 11, but 11 is rarely affected in practice, so the
// model shows 9 and 10 and says why in a note.
const CN_LATERAL: Record<BsLevel, string[]> = { midbrain: [], pons: ['5', '7', '8'], medulla: ['9', '10'] };

const CN_DEFICIT: Record<string, string> = {
  '3': 'Third-nerve palsy: eye down and out, ptosis, large pupil',
  '6': 'Sixth-nerve palsy: cannot abduct the eye; double vision looking to that side',
  '12': 'Tongue deviates toward the side of the lesion when protruded',
  '5': 'Weak jaw muscles and numb face (motor and principal sensory nucleus of 5)',
  '7': 'Lower motor neuron facial weakness: forehead and lower face',
  '8': 'Deafness, vertigo and nystagmus',
  '9': 'Reduced gag and palatal sensation',
  '10': 'Hoarse voice and difficulty swallowing (nucleus ambiguus)',
  '11': 'Weak shoulder shrug and head turn',
};

/** Cranial nerve numbers the rule places in each box of the map (for display). */
export const RULE_CN: Record<BsLevel, Record<Zone, string[]>> = {
  midbrain: { medial: ['3', '4'], lateral: [] },
  pons: { medial: ['6'], lateral: ['5', '7', '8'] },
  medulla: { medial: ['12'], lateral: ['9', '10', '11'] },
};
export const LEVEL_RULE: Record<BsLevel, string> = { midbrain: 'Above the pons: 1 to 4 (3 and 4 here)', pons: 'Pons: 5 to 8', medulla: 'Medulla: 9 to 12' };
export const M_STRUCTURES = ['Motor pathway', 'Medial lemniscus', 'Medial longitudinal fasciculus', 'Motor nucleus and nerve'];
export const S_STRUCTURES = ['Spinocerebellar pathways', 'Spinothalamic tract', 'Sensory nucleus of 5', 'Sympathetic pathway'];

/** Which of the four Ms or four Ss a lesion in this box involves. */
export function structuresHit(level: BsLevel, zone: Zone): string[] {
  if (zone === 'medial') return M_STRUCTURES;
  return level === 'midbrain' ? S_STRUCTURES.filter(x => x !== 'Sensory nucleus of 5') : S_STRUCTURES;
}

export function brainstemLesion(level: BsLevel, zone: Zone, side: BsSide = 'L'): BsResult {
  const findings: BsFinding[] = [];
  const notes: string[] = [];
  const cns = zone === 'medial' ? CN_MEDIAL[level] : CN_LATERAL[level];
  cns.forEach(cn => findings.push({ text: CN_DEFICIT[cn], side: 'same', structure: `Cranial nerve ${cn}` }));

  if (zone === 'medial') {
    findings.push({ text: 'Weakness of the arm and leg (upper motor neuron)', side: 'opposite', structure: 'Motor pathway (corticospinal tract)' });
    findings.push({ text: 'Loss of vibration and position sense in arm and leg', side: 'opposite', structure: 'Medial lemniscus' });
    findings.push({ text: 'Internuclear ophthalmoplegia: the eye on the lesion side fails to adduct on gaze to the other side', side: 'same', structure: 'Medial longitudinal fasciculus' });
    if (level === 'midbrain') notes.push('The fourth nerve also has a medial midbrain nucleus, but its fibers cross before they exit, so a nuclear fourth-nerve lesion weakens the opposite superior oblique, which makes it one of the rule\'s exceptions.');
  } else {
    findings.push({ text: 'Clumsy, overshooting arm and leg (ataxia)', side: 'same', structure: 'Spinocerebellar pathways' });
    findings.push({ text: 'Loss of pain and temperature in arm, leg and trunk', side: 'opposite', structure: 'Spinothalamic tract' });
    if (level !== 'midbrain') findings.push({ text: 'Loss of pain and temperature on the face', side: 'same', structure: 'Sensory nucleus of 5 (spinal trigeminal)' });
    findings.push({ text: 'Horner syndrome: small pupil, mild ptosis', side: 'same', structure: 'Sympathetic pathway' });
    if (level === 'midbrain') notes.push('There are no lateral cranial nerve nuclei in the midbrain, and isolated lateral midbrain lesions are uncommon.');
    if (level === 'medulla') {
      findings.push({ text: 'Vertigo, nystagmus and vomiting', side: 'same', structure: 'Vestibular nuclei' });
      notes.push('The vestibular nuclei extend down into the lateral medulla, so vertigo and nystagmus are typical of a lateral medullary lesion even though cranial nerve 8 is "a pontine nerve" in the rule.');
    }
  }

  if (zone === 'medial') notes.push('The rule lists everything a medial lesion could reach. A real lesion usually takes only some of the four Ms, which is why the named syndromes leave some of them out.');
  let syndrome: string | null = null;
  if (level === 'midbrain' && zone === 'medial') { syndrome = 'Medial midbrain lesion. Its ventral form, Weber syndrome, is a third-nerve palsy with opposite hemiparesis'; notes.push('A lesion a little further back, through the red nucleus, adds tremor and ataxia on the opposite side (Benedikt syndrome).'); }
  if (level === 'pons' && zone === 'medial') { syndrome = 'Medial pontine syndrome: sixth-nerve palsy with opposite hemiparesis'; notes.push('The rule says sixth-nerve palsy, which is what a lesion of the sixth-nerve fibers gives. A lesion of the sixth nucleus itself, where the horizontal gaze center sits, gives a palsy of gaze toward that side instead (Pearl 2014, p. 43).'); notes.push('The facial fibers loop around the sixth nucleus before they leave the pons, so a medial pontine lesion often weakens the face as well (Millard-Gubler syndrome), even though the rule places the seventh nerve laterally.'); }
  if (level === 'pons' && zone === 'lateral') syndrome = 'Lateral pontine syndrome (anterior inferior cerebellar artery territory)';
  if (level === 'medulla' && zone === 'medial') syndrome = 'Medial medullary lesion. Dejerine syndrome is a weak tongue on the lesion side with opposite hemiparesis and loss of position sense';
  if (level === 'medulla' && zone === 'lateral') { syndrome = 'Lateral medullary syndrome (Wallenberg)'; notes.push('The rule places cranial nerve 11 in the lateral medulla too, but its fibers are rarely affected in a lateral medullary stroke, so it is left out here.'); }

  return { findings, syndrome, notes, cranialNerves: cns };
}
