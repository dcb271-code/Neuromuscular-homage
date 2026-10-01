// The localizer: a pure model of "localization is elimination".
//
// Eleven levels of the neuraxis (the owner's list, cortex to muscle). Each finding declares
// the levels it FITS and the levels it EXCLUDES, with a reason; every other level is neutral.
// A level survives while no selected finding excludes it. Fit counts rank the survivors.
//
// Rules are classical teaching rules (Brazis 2011 ch. 1; DeMyer Table 7-7; Pearl 2014 pp.65,
// 108-117; Peredo 2009 for infant hypotonia). Each `caveat` names where a rule bends, so the
// figure never pretends a heuristic is a law.

export type Level =
  | 'cortex' | 'subcortex' | 'brainstem' | 'cerebellum' | 'cord'
  | 'horn' | 'root' | 'plexus' | 'nerve' | 'nmj' | 'muscle';

export const LEVELS: { id: Level; name: string; short: string; group: 'brain' | 'axis' | 'motor unit' }[] = [
  { id: 'cortex', name: 'Cerebral cortex', short: 'Cortex', group: 'brain' },
  { id: 'subcortex', name: 'Subcortex and deep grey (white matter, capsule, basal ganglia, thalamus)', short: 'Subcortex', group: 'brain' },
  { id: 'brainstem', name: 'Brainstem', short: 'Brainstem', group: 'axis' },
  { id: 'cerebellum', name: 'Cerebellum', short: 'Cerebellum', group: 'axis' },
  { id: 'cord', name: 'Spinal cord', short: 'Cord', group: 'axis' },
  { id: 'horn', name: 'Anterior horn cell', short: 'Horn cell', group: 'motor unit' },
  { id: 'root', name: 'Nerve root', short: 'Root', group: 'motor unit' },
  { id: 'plexus', name: 'Plexus (brachial, lumbosacral)', short: 'Plexus', group: 'motor unit' },
  { id: 'nerve', name: 'Peripheral nerve (one or many)', short: 'Nerve', group: 'motor unit' },
  { id: 'nmj', name: 'Neuromuscular junction', short: 'Junction', group: 'motor unit' },
  { id: 'muscle', name: 'Muscle', short: 'Muscle', group: 'motor unit' },
];

const BRAIN: Level[] = ['cortex', 'subcortex'];
const CNS: Level[] = ['cortex', 'subcortex', 'brainstem', 'cerebellum', 'cord'];
const MOTOR_UNIT: Level[] = ['horn', 'root', 'plexus', 'nerve', 'nmj', 'muscle'];

export type FindingGroup = 'distribution' | 'tone & reflexes' | 'muscle' | 'sensation' | 'other';

export interface Finding {
  id: string;
  label: string;           // what the examiner observed
  group: FindingGroup;
  fits: Level[];
  excludes: Partial<Record<Level, string>>; // level → why it cannot be there
  caveat?: string;         // where the rule bends
}

const ex = (levels: Level[], why: string): Partial<Record<Level, string>> => Object.fromEntries(levels.map(l => [l, why]));

export const FINDINGS: Finding[] = [
  // ── Distribution of weakness ──────────────────────────────────────────────
  {
    id: 'hemi-face', group: 'distribution',
    label: 'Weakness of face, arm and leg on the same side',
    fits: ['cortex', 'subcortex'],
    excludes: {
      ...ex(['cord'], 'The cord cannot weaken the face; facial fibres leave the corticospinal tract in the brainstem.'),
      ...ex(['cerebellum'], 'The cerebellum coordinates; it does not cause weakness.'),
      ...ex(MOTOR_UNIT, 'A single hemibody pattern including the face cannot come from one root, plexus, nerve or from muscle or junction disease.'),
      brainstem: 'A brainstem lesion that weakens the limbs gives a crossed pattern: a cranial nerve on one side, the body on the other. Same-side face and limbs place the lesion above the facial nucleus.',
    },
    caveat: 'A lesion in the upper pons, above the facial nucleus, can also give a same-side face, arm and leg weakness.',
  },
  {
    id: 'crossed', group: 'distribution',
    label: 'Cranial nerve sign on one side, limb weakness or sensory loss on the other',
    fits: ['brainstem'],
    excludes: {
      ...ex(BRAIN, 'Above the brainstem, face and body are on the same side; crossing only happens where cranial nerve nuclei sit beside the long tracts.'),
      ...ex(['cord'], 'The cord has no cranial nerves.'),
      ...ex(['cerebellum'], 'Cerebellar signs are all on one side, and the cerebellum does not cause weakness.'),
      ...ex(MOTOR_UNIT, 'A crossed pattern needs a single lesion that touches a cranial nerve nucleus and a long tract together; only the brainstem holds both.'),
    },
  },
  {
    id: 'paraparesis', group: 'distribution',
    label: 'Both legs weak, arms normal',
    fits: ['cord', 'subcortex', 'root', 'nerve'],
    excludes: {
      brainstem: 'A brainstem lesion strong enough to weaken both legs would weaken the arms and usually the cranial nerves too.',
      cerebellum: 'The cerebellum does not cause weakness.',
      nmj: 'Junction disorders weaken proximal, ocular and bulbar muscles, not the legs alone.',
      muscle: 'Myopathies weaken the hip and shoulder girdles together; they do not spare the arms.',
    },
    caveat: 'Subcortex fits through periventricular white-matter injury in preterm infants (spastic diplegia); root fits through the cauda equina; nerve through a length-dependent neuropathy. Bilateral parasagittal cortical lesions are possible but rare.',
  },
  {
    id: 'proximal-symmetric', group: 'distribution',
    label: 'Proximal, symmetric weakness of arms and legs (hips and shoulders)',
    fits: ['muscle', 'nmj', 'horn'],
    excludes: {
      ...ex(BRAIN, 'Cerebral lesions weaken by side (hemiparesis) or by region, not by girdle.'),
      cerebellum: 'The cerebellum does not cause weakness.',
      plexus: 'One plexus serves one limb; a symmetric four-limb pattern needs a diffuse process.',
    },
    caveat: 'An acute demyelinating polyradiculoneuropathy (Guillain-Barré) can be proximal as well as distal, so root and nerve stay possible. Spinal muscular atrophy weakens proximally.',
  },
  {
    id: 'distal-symmetric', group: 'distribution',
    label: 'Distal, symmetric weakness, legs before hands',
    fits: ['nerve'],
    excludes: {
      ...ex(BRAIN, 'Cerebral lesions do not produce a symmetric glove-and-stocking gradient.'),
      cerebellum: 'The cerebellum does not cause weakness.',
      plexus: 'One plexus serves one limb.',
      nmj: 'Junction disorders favour ocular, bulbar and proximal muscles.',
    },
    caveat: 'The length-dependent pattern is the signature of polyneuropathy: the longest nerves fail first (Brazis 2011, pp. 4-5, 26). A few myopathies are distal, so muscle stays possible.',
  },
  {
    id: 'one-limb-territory', group: 'distribution',
    label: 'Weakness confined to one limb, in the territory of a nerve or root',
    fits: ['root', 'plexus', 'nerve'],
    excludes: {
      nmj: 'Junction disorders are generalized or ocular-bulbar, not a single-nerve territory.',
      muscle: 'Myopathies are symmetric and girdle-predominant.',
      cerebellum: 'The cerebellum does not cause weakness.',
      brainstem: 'A brainstem lesion weakening a limb would bring cranial nerve or other long-tract signs with it.',
    },
    caveat: 'A monoparesis from a small cortical lesion is possible, but a weak limb with nothing else should send you looking for a root, plexus or nerve first (Brazis 2011, p. 12).',
  },

  // ── Tone and reflexes ─────────────────────────────────────────────────────
  {
    id: 'umn', group: 'tone & reflexes',
    label: 'Brisk or spreading reflexes, sustained clonus, increased tone',
    fits: ['cortex', 'subcortex', 'brainstem', 'cord'],
    excludes: {
      ...ex(MOTOR_UNIT, 'Brisk reflexes and spasticity are release signs of the upper motor neuron; disease of the motor unit lowers reflexes and tone.'),
      cerebellum: 'Cerebellar disease lowers tone and can make reflexes pendular, not brisk.',
    },
    caveat: 'A few beats of clonus can be normal, and sustained ankle clonus can be normal in a newborn (DeMyer, pp. 268-269).',
  },
  {
    id: 'areflexia', group: 'tone & reflexes',
    label: 'Reflexes reduced or absent',
    fits: ['horn', 'root', 'plexus', 'nerve'],
    excludes: {
      ...ex(BRAIN, 'Cerebral lesions spare the reflex arc; reflexes are normal or brisk once the acute phase passes.'),
      brainstem: 'A brainstem lesion spares the spinal reflex arc.',
    },
    caveat: 'An acute, severe upper motor neuron lesion (spinal or cerebral shock) can be flaccid and areflexic at first, so the cord is not excluded (DeMyer, pp. 273-274). Junction disorders usually keep reflexes; myopathies lose them only in proportion to weakness. Axonal Guillain-Barré may keep reflexes.',
  },
  {
    id: 'babinski', group: 'tone & reflexes',
    label: 'Extensor plantar response (upgoing toe) after the first year',
    fits: ['cortex', 'subcortex', 'brainstem', 'cord'],
    excludes: {
      ...ex(MOTOR_UNIT, 'An extensor plantar response is a sign of corticospinal tract dysfunction; the motor unit cannot produce it.'),
      cerebellum: 'The cerebellum does not carry the corticospinal tract.',
    },
    caveat: 'An upgoing toe is normal in the first year, while the corticospinal tracts myelinate (Utah PediNeuroLogic Exam). Withdrawal and a ticklish child can mimic it (DeMyer, pp. 281-282).',
  },

  // ── Muscle signs ──────────────────────────────────────────────────────────
  {
    id: 'fasciculations', group: 'muscle',
    label: 'Fasciculations and wasting (including tongue fasciculations)',
    fits: ['horn', 'root', 'nerve'],
    excludes: {
      ...ex(CNS, 'Fasciculations come from denervated motor units; central lesions do not denervate muscle.'),
      nmj: 'The junction does not denervate muscle.',
      muscle: 'Primary muscle disease does not fasciculate.',
    },
    caveat: 'Brief benign fasciculations in a healthy person are common and mean nothing on their own. Tongue fasciculations in a weak, areflexic infant are the classic sign of spinal muscular atrophy.',
  },
  {
    id: 'fatigable', group: 'muscle',
    label: 'Weakness that worsens with use and recovers with rest; drooping lids or double vision that fluctuate',
    fits: ['nmj'],
    excludes: {
      ...ex(BRAIN, 'Fatigable, fluctuating ocular and bulbar weakness is the junction\'s signature, not the cortex\'s.'),
      cord: 'The cord does not cause ptosis or fatigable weakness.',
      cerebellum: 'The cerebellum does not cause weakness.',
      plexus: 'A plexus lesion is fixed, one limb, and not fatigable.',
      root: 'A root lesion is fixed and dermatomal.',
    },
    caveat: 'Some myopathies (for example mitochondrial) cause ptosis and ophthalmoplegia without true fatigability, so muscle stays possible.',
  },
  {
    id: 'gowers', group: 'muscle',
    label: 'Gowers sign or waddling gait; calves look large',
    fits: ['muscle', 'horn'],
    excludes: {
      ...ex(BRAIN, 'A Gowers manoeuvre reflects proximal hip weakness; cerebral lesions do not produce a symmetric girdle pattern.'),
      cerebellum: 'The cerebellum does not cause weakness.',
      plexus: 'A plexus lesion affects one limb.',
    },
    caveat: 'Gowers sign means proximal leg weakness of any cause: dystrophy, spinal muscular atrophy, inflammatory myopathy. Calf enlargement points toward a dystrophy.',
  },

  // ── Sensation ─────────────────────────────────────────────────────────────
  {
    id: 'sensory-level', group: 'sensation',
    label: 'A sensory level on the trunk',
    fits: ['cord'],
    excludes: {
      ...ex(BRAIN, 'The brain cannot produce a horizontal sensory level on the trunk.'),
      brainstem: 'A brainstem lesion gives a hemibody pattern, not a level.',
      cerebellum: 'The cerebellum does not carry sensation to consciousness.',
      ...ex(MOTOR_UNIT, 'A level needs a lesion across the ascending tracts; one root gives a band, not everything below a line.'),
    },
    caveat: 'The level on the skin can sit several segments below the real lesion (Brazis 2011, p. 104).',
  },
  {
    id: 'glove-stocking', group: 'sensation',
    label: 'Sensory loss in a glove-and-stocking distribution',
    fits: ['nerve'],
    excludes: {
      ...ex(CNS, 'A symmetric distal gradient is length-dependent: the longest axons fail first. No single central lesion makes it.'),
      horn: 'The anterior horn is purely motor.',
      nmj: 'The junction is purely motor.',
      muscle: 'Muscle disease does not cause sensory loss.',
      plexus: 'One plexus serves one limb.',
    },
  },
  {
    id: 'dermatome', group: 'sensation',
    label: 'Sensory loss in one dermatome or one nerve territory',
    fits: ['root', 'nerve', 'plexus'],
    excludes: {
      ...ex(['horn', 'nmj', 'muscle'], 'This level is purely motor; it cannot cause sensory loss.'),
      cerebellum: 'The cerebellum does not carry sensation to consciousness.',
    },
    caveat: 'Overlap between neighbouring roots means a single root lesion may cause little measurable sensory loss (Brazis 2011, p. 89).',
  },
  {
    id: 'pure-motor', group: 'sensation',
    label: 'Weakness with no sensory loss at all',
    fits: ['horn', 'nmj', 'muscle'],
    excludes: {
      plexus: 'Plexus fibres are mixed; a plexus lesion strong enough to weaken also numbs.',
      cord: 'A cord lesion strong enough to weaken almost always disturbs sensation below it.',
    },
    caveat: 'A small capsular or brainstem stroke can be pure motor, and Guillain-Barré often has few sensory signs, so brain, root and nerve stay possible.',
  },

  // ── Other ─────────────────────────────────────────────────────────────────
  {
    id: 'cortical', group: 'other',
    label: 'Aphasia, neglect, seizures, or loss of discriminative sensation (stereognosis, graphesthesia)',
    fits: ['cortex'],
    excludes: {
      ...ex(['brainstem', 'cerebellum', 'cord'], 'Language, attention and discriminative sensation are cortical functions.'),
      ...ex(MOTOR_UNIT, 'These are functions of the cortex; the motor unit cannot produce them.'),
    },
    caveat: 'Subcortical and thalamic lesions can disturb language and attention, so subcortex stays possible.',
  },
  {
    id: 'ataxia', group: 'other',
    label: 'Clumsy, overshooting limb movements with normal strength and normal position sense',
    fits: ['cerebellum', 'brainstem'],
    excludes: {
      cord: 'With position sense intact, the clumsiness is not sensory ataxia from the dorsal columns.',
      ...ex(['root', 'plexus', 'nerve'], 'Sensory ataxia from nerves or roots needs lost position sense.'),
      ...ex(['horn', 'nmj', 'muscle'], 'With normal strength, the clumsiness is not weakness.'),
    },
    caveat: 'Cerebellar signs are on the same side as the lesion. A small subcortical stroke can cause ataxic hemiparesis.',
  },
  {
    id: 'cranial-nerves', group: 'other',
    label: 'Double vision, facial weakness, or difficulty swallowing',
    fits: ['brainstem', 'nmj', 'nerve'],
    excludes: {
      cord: 'The cord has no cranial nerves.',
      ...ex(['root', 'plexus'], 'Spinal roots and plexus do not serve the head.'),
      cerebellum: 'The cerebellum moves the eyes inaccurately (nystagmus, dysmetric saccades), but does not paralyse them.',
    },
    caveat: 'Cortical and subcortical lesions weaken the lower face and can impair swallowing (pseudobulbar). Some myopathies weaken the face. Spinal muscular atrophy can weaken the bulbar muscles.',
  },
  {
    id: 'bladder', group: 'other',
    label: 'Bladder or bowel control lost early',
    fits: ['cord', 'root'],
    excludes: {
      ...ex(['horn', 'muscle'], 'This level has no role in sphincter control.'),
      cerebellum: 'The cerebellum does not control the sphincters.',
      plexus: 'A one-sided limb plexus lesion does not cause sphincter loss.',
    },
    caveat: 'Root fits through the cauda equina. Infant botulism causes constipation through the junction, so the junction stays possible. Bilateral frontal lesions can disturb bladder control.',
  },
  {
    id: 'movements', group: 'other',
    label: 'Involuntary movements: chorea, dystonia, or tremor at rest',
    fits: ['subcortex'],
    excludes: {
      cerebellum: 'Cerebellar tremor appears on action, not at rest, and the cerebellum does not cause chorea or dystonia.',
      ...ex(MOTOR_UNIT, 'Chorea and dystonia arise in the basal ganglia circuits.'),
      cord: 'The cord does not generate chorea or dystonia.',
    },
  },
  {
    id: 'consciousness', group: 'other',
    label: 'Depressed level of consciousness',
    fits: ['cortex', 'subcortex', 'brainstem'],
    excludes: {
      cord: 'The cord does not maintain arousal.',
      cerebellum: 'An isolated cerebellar lesion does not depress consciousness unless it compresses the brainstem.',
      ...ex(MOTOR_UNIT, 'Arousal depends on the brainstem reticular formation and both hemispheres.'),
    },
    caveat: 'A depressed level of consciousness in a floppy infant points toward central hypotonia (Peredo 2009).',
  },
];

export const FINDING_BY_ID: Record<string, Finding> = Object.fromEntries(FINDINGS.map(f => [f.id, f]));

export interface LevelVerdict {
  level: Level;
  status: 'excluded' | 'fits' | 'possible';
  fitCount: number;
  reasons: { finding: string; why: string }[]; // why excluded
}

/** Evaluate every level against the selected findings. Pure. */
export function localize(selected: string[]): LevelVerdict[] {
  const fs = selected.map(id => FINDING_BY_ID[id]).filter(Boolean);
  return LEVELS.map(({ id }) => {
    const reasons = fs.filter(f => f.excludes[id]).map(f => ({ finding: f.label, why: f.excludes[id]! }));
    const fitCount = fs.filter(f => f.fits.includes(id)).length;
    const status = reasons.length ? 'excluded' : fitCount > 0 ? 'fits' : 'possible';
    return { level: id, status, fitCount, reasons };
  });
}

/** The surviving levels, best supported first. */
export function survivors(selected: string[]): Level[] {
  return localize(selected)
    .filter(v => v.status !== 'excluded')
    .sort((a, b) => b.fitCount - a.fitCount)
    .map(v => v.level);
}

export interface Preset { id: string; label: string; findings: string[]; teaching: string }

export const PRESETS: Record<string, Preset[]> = {
  intro: [
    { id: 'hemi', label: 'A boy who woke with a weak right arm, leg and face', findings: ['hemi-face'], teaching: 'One finding already removes the cord and everything in the motor unit. The face is the key: the cord has no face.' },
    { id: 'para-level', label: 'A girl with weak legs and a line on her belly below which she cannot feel', findings: ['paraparesis', 'sensory-level'], teaching: 'Two findings, one level. The sensory level is the more powerful of the two because only the cord can make it.' },
    { id: 'crossed', label: 'A teenager with a left sixth-nerve palsy and a weak right arm and leg', findings: ['crossed'], teaching: 'A crossed pattern leaves only the brainstem standing. The cranial nerve sign is on the side of the lesion.' },
  ],
  full: [
    { id: 'gbs', label: 'Weakness creeping up the legs over days, absent reflexes, tingling toes', findings: ['distal-symmetric', 'areflexia', 'glove-stocking'], teaching: 'Absent reflexes push you into the motor unit, and glove-and-stocking tingling leaves the nerve on top with the root close behind. Guillain-Barré is a polyradiculoneuropathy: both are right.' },
    { id: 'transverse', label: 'Weak legs, a sensory level at the umbilicus, retention of urine', findings: ['paraparesis', 'sensory-level', 'bladder'], teaching: 'Three findings, one survivor. If reflexes are absent in the first days, remember spinal shock before you leave the cord.' },
    { id: 'capsule', label: 'Weak face, arm and leg on one side; no sensory loss; normal speech', findings: ['hemi-face', 'pure-motor'], teaching: 'Cortex and subcortex survive. No aphasia or neglect leans toward a deep, capsular lesion.' },
  ],
  floppy: [
    { id: 'central', label: 'A sleepy floppy newborn, reflexes brisk, strength surprisingly good', findings: ['consciousness', 'umn'], teaching: 'Peredo 2009: a depressed level of consciousness, axial weakness, near-normal limb strength and normal or brisk reflexes point to central hypotonia, the more common kind.' },
    { id: 'sma', label: 'An alert floppy infant with tongue fasciculations and no reflexes', findings: ['areflexia', 'fasciculations', 'pure-motor'], teaching: 'Alert, areflexic, fasciculating and purely motor: the anterior horn cell is the best fit. This is the picture of spinal muscular atrophy.' },
    { id: 'botulism', label: 'A 3-month-old with constipation, weak cry, ptosis and a poor suck', findings: ['fatigable', 'cranial-nerves', 'pure-motor'], teaching: 'Peredo 2009: suspect infant botulism under 6 months with constipation, weak cry, poor feeding and a reduced gag. The junction is the only level that fits everything.' },
  ],
  'motor-unit': [
    { id: 'dmd', label: 'A 4-year-old boy who climbs up his legs to stand, with big calves', findings: ['proximal-symmetric', 'gowers', 'pure-motor'], teaching: 'Proximal, symmetric, purely motor with large calves: muscle. The horn cell survives too, which is why spinal muscular atrophy is on the list until the CK comes back.' },
    { id: 'cmt', label: 'A 10-year-old with high arches, thin calves, no ankle jerks and numb toes', findings: ['distal-symmetric', 'areflexia', 'glove-stocking'], teaching: 'Distal, areflexic, with glove-and-stocking loss: only the nerve survives. A length-dependent neuropathy since early childhood suggests an inherited one.' },
    { id: 'mg', label: 'A teenager whose eyelids droop by evening and whose voice fades while talking', findings: ['fatigable', 'cranial-nerves'], teaching: 'Fatigability narrows it to the junction.' },
  ],
};

/** Finding subsets shown by each widget variant. */
export const FINDING_SETS: Record<string, string[]> = {
  intro: ['hemi-face', 'crossed', 'paraparesis', 'sensory-level', 'umn', 'areflexia'],
  full: FINDINGS.map(f => f.id),
  floppy: ['consciousness', 'umn', 'areflexia', 'fasciculations', 'fatigable', 'cranial-nerves', 'pure-motor', 'proximal-symmetric'],
  'motor-unit': ['proximal-symmetric', 'distal-symmetric', 'one-limb-territory', 'areflexia', 'fasciculations', 'fatigable', 'gowers', 'glove-stocking', 'dermatome', 'pure-motor', 'cranial-nerves'],
};
