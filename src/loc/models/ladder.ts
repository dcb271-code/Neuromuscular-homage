// Lesion ladder: a nerve drawn as a sequence of branch points. A lesion at any rung removes
// everything that branches below it, so the highest affected branch marks the site.
// Facial nerve after Brazis 2011, pp. 322-327 and Pearl 2014, pp. 49-52; radial nerve after
// Brazis 2011, pp. 43-45 and 93; foot drop after Pearl 2014, pp. 87-88 and
// Brazis 2011 (peroneal, sciatic and L5 chapters).

export interface Rung {
  id: string;
  site: string;          // where the lesion sits
  adds: string[];        // deficits added at this rung, compared with the rung below
  removes?: string[];    // deficits from lower rungs that this rung replaces
  /** 'replace' rungs change the whole pattern (above the nucleus the face is weak in a different way). */
  mode?: 'replace';
  clue: string;          // the bedside test that proves the lesion reached this rung
  example: string;       // a pediatric cause at this site
}
export interface Ladder { id: string; name: string; short: string; rungs: Rung[] /* distal → proximal */; footnote: string }

export const LADDERS: Ladder[] = [
  { id: 'facial', name: 'Facial nerve', short: 'Facial', footnote: 'Branch order after Brazis 2011, pp. 322-327; Pearl 2014, pp. 49-52.', rungs: [
    { id: 'face', site: 'After it leaves the skull (stylomastoid foramen, parotid)', adds: ['Whole half of the face weak, forehead included', 'Eye does not close fully'], clue: 'Forehead weak: a lower motor neuron pattern', example: 'Parotid swelling or a facial laceration' },
    { id: 'taste', site: 'Above the chorda tympani', adds: ['Taste lost on the front two-thirds of the tongue', 'Less saliva'], clue: 'Taste on the front of the tongue', example: 'Middle ear infection spreading to the facial canal' },
    { id: 'stapedius', site: 'Above the nerve to stapedius', adds: ['Sounds uncomfortably loud on that side (hyperacusis)'], clue: 'Ask whether ordinary noise is too loud on that side', example: 'Idiopathic (Bell) palsy' },
    { id: 'tears', site: 'At or above the geniculate ganglion', adds: ['Dry eye: tears reduced on that side'], clue: 'Tear production on the two sides', example: 'Herpes zoster of the geniculate ganglion (vesicles in the ear)' },
    { id: 'canal', site: 'Internal auditory canal or cerebellopontine angle', adds: ['Hearing loss and tinnitus on that side (the eighth nerve travels alongside)'], removes: ['Sounds uncomfortably loud on that side (hyperacusis)'], clue: 'Hearing; then the fifth nerve (corneal reflex)', example: 'Vestibular schwannoma in neurofibromatosis type 2; temporal bone fracture' },
    { id: 'pons', site: 'Facial nucleus in the pons', mode: 'replace', adds: ['Whole half of the face weak, forehead included', 'Eyes cannot look toward the lesion (the gaze centre sits beside the nucleus)', 'Arm and leg weak on the opposite side'], clue: 'Gaze and the limbs: the brainstem neighbours, not the facial branches', example: 'Diffuse midline glioma of the pons; a cavernous malformation' },
    { id: 'cortex', site: 'Above the nucleus (cortex, internal capsule)', mode: 'replace', adds: ['Only the lower face is clearly weak, on the opposite side', 'Forehead relatively spared', 'Arm weak on the same side as the facial weakness', 'Taste, tears and hearing normal'], clue: 'Forehead and the arm: an upper motor neuron pattern', example: 'Arterial ischaemic stroke' },
  ] },
  { id: 'radial', name: 'Radial nerve', short: 'Radial', footnote: 'After Brazis 2011, pp. 43-45 (branch order) and p. 93 (C7). Pearl 2014, p. 83 lists triceps weakness in spiral-groove palsy; the branch order says the triceps is spared there (Brazis 2011, p. 45). C7 also supplies muscles outside the radial nerve, which is how a root lesion gives itself away.', rungs: [
    { id: 'pin', site: 'Posterior interosseous branch in the forearm', adds: ['Fingers and thumb cannot extend at the knuckles', 'Wrist still extends, drifting toward the thumb side'], clue: 'Finger drop without wrist drop and without numbness', example: 'A fracture or mass near the elbow' },
    { id: 'groove', site: 'Spiral groove of the humerus', adds: ['Wrist drop', 'Brachioradialis weak', 'Numb patch on the back of the hand by the thumb (superficial branch)'], clue: 'Triceps still strong: the lesion is below its branch', example: 'Fracture of the humeral shaft' },
    { id: 'axilla', site: 'Axilla', adds: ['Triceps weak, triceps reflex lost', 'Numb back of the arm'], clue: 'Triceps', example: 'Crutch pressure' },
    { id: 'cord', site: 'Posterior cord of the plexus', adds: ['Deltoid weak (axillary nerve)', 'Latissimus dorsi weak'], clue: 'Shoulder abduction', example: 'Birth or traction injury to the plexus' },
    { id: 'c7', site: 'C7 root', mode: 'replace', adds: ['Triceps and wrist extensors weak', 'Wrist flexors and pronation also weak: muscles outside the radial nerve', 'Brachioradialis spared (C5-C6)', 'Numb middle and ring fingers'], clue: 'Pronation and wrist flexion: a root crosses nerve boundaries', example: 'Root avulsion in a traction injury' },
  ] },
  { id: 'footdrop', name: 'Foot drop', short: 'Foot drop', footnote: 'After Pearl 2014, pp. 87-88; Brazis 2011 (leg nerves and roots). Inversion and hip abduction are the discriminating muscles.', rungs: [
    { id: 'deep', site: 'Deep peroneal branch', adds: ['Ankle and toes cannot dorsiflex', 'Numb first web space only'], clue: 'Eversion still strong', example: 'Anterior compartment injury' },
    { id: 'common', site: 'Common peroneal nerve at the fibular head', adds: ['Eversion weak', 'Numb outer shin and top of the foot'], clue: 'Inversion still strong: the lesion is below the tibial branch', example: 'Habitual leg-crossing or a tight cast' },
    { id: 'sciatic', site: 'Sciatic nerve in the thigh or buttock', adds: ['Inversion and plantar flexion weak (tibial division)', 'Ankle reflex reduced', 'Hamstrings weak', 'Numb sole and most of the leg below the knee'], clue: 'Hamstrings and the ankle reflex', example: 'Misplaced buttock injection; hip surgery' },
    { id: 'l5', site: 'L5 root', mode: 'replace', adds: ['Dorsiflexion and big-toe extension weak', 'Inversion weak too (tibialis posterior)', 'Hip abduction weak (gluteus medius): a muscle the sciatic nerve does not supply', 'Back or buttock pain radiating down the leg'], clue: 'Hip abduction: the muscle above the sciatic notch', example: 'Disc herniation or spondylolisthesis in an adolescent athlete' },
  ] },
];

/** Deficits at a rung: everything from the bottom rung up to this one, unless the rung replaces the pattern. */
export function deficitsAt(ladder: Ladder, index: number): { text: string; isNew: boolean }[] {
  const r = ladder.rungs[index];
  if (r.mode === 'replace') return r.adds.map(text => ({ text, isNew: true }));
  let out: { text: string; isNew: boolean }[] = [];
  ladder.rungs.slice(0, index + 1).forEach((x, i) => {
    if (x.mode === 'replace') return;
    if (x.removes) out = out.filter(d => !x.removes!.includes(d.text));
    x.adds.forEach(text => out.push({ text, isNew: i === index }));
  });
  return out;
}
