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

export function brainstemLesion(level: BsLevel, zone: Zone, side: BsSide = 'L'): BsResult {
  const findings: BsFinding[] = [];
  const notes: string[] = [];
  const cns = zone === 'medial' ? CN_MEDIAL[level] : CN_LATERAL[level];
  cns.forEach(cn => findings.push({ text: CN_DEFICIT[cn], side: 'same', structure: `Cranial nerve ${cn}` }));

  if (zone === 'medial') {
    findings.push({ text: 'Weakness of the arm and leg (upper motor neuron)', side: 'opposite', structure: 'Motor pathway (corticospinal tract)' });
    findings.push({ text: 'Loss of vibration and position sense in arm and leg', side: 'opposite', structure: 'Medial lemniscus' });
    findings.push({ text: 'Internuclear ophthalmoplegia: the eye on the lesion side fails to adduct on gaze to the other side', side: 'same', structure: 'Medial longitudinal fasciculus' });
    if (level === 'midbrain') notes.push('The fourth nerve also has a medial midbrain nucleus, but its fibers cross before they exit, so a nuclear fourth-nerve lesion weakens the opposite superior oblique: one of the rule\'s exceptions.');
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

  let syndrome: string | null = null;
  if (level === 'midbrain' && zone === 'medial') { syndrome = 'Weber syndrome (ventral midbrain): third-nerve palsy with opposite hemiparesis'; notes.push('A lesion a little further back, through the red nucleus, adds tremor and ataxia on the opposite side (Benedikt syndrome).'); }
  if (level === 'pons' && zone === 'medial') { syndrome = 'Medial pontine syndrome: sixth-nerve palsy with opposite hemiparesis'; notes.push('The facial fascicle loops around the sixth nucleus before it exits, so a ventral pontine lesion often weakens the face too (Millard-Gubler syndrome): the rule calls 7 lateral, the anatomy lets it stray medial.'); }
  if (level === 'pons' && zone === 'lateral') syndrome = 'Lateral pontine syndrome (anterior inferior cerebellar artery territory)';
  if (level === 'medulla' && zone === 'medial') syndrome = 'Medial medullary syndrome (Dejerine): tongue weak on the lesion side, opposite hemiparesis and loss of position sense';
  if (level === 'medulla' && zone === 'lateral') { syndrome = 'Lateral medullary syndrome (Wallenberg)'; notes.push('The rule places cranial nerve 11 in the lateral medulla too, but its fibers are rarely affected in a lateral medullary stroke, so it is left out here.'); }

  return { findings, syndrome, notes, cranialNerves: cns };
}
