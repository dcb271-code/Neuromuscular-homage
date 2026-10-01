// Data-driven teaching models for the localization widgets. Every age, every level and every
// example here is sourced in the comment beside it; nothing is invented to fill a cell.

// ── Reflex timeline, birth to 12 months (Utah PediNeuroLogic Exam, all items) ──────────────
export interface TimelineItem {
  id: string; name: string; kind: 'primitive' | 'postural' | 'sign';
  how: string;
  // primitive: present at birth, fading from `fade`, should be gone by `gone` (months)
  // postural: absent until `emerge`, should be present by `present`
  fade?: number; gone?: number; emerge?: number; present?: number;
  note: string;
}
export const TIMELINE: TimelineItem[] = [
  { id: 'root', name: 'Rooting', kind: 'primitive', how: 'Stroke the cheek; the mouth turns toward it.', fade: 3, gone: 4, note: 'Disappears at about 4 months.' },
  { id: 'moro', name: 'Moro', kind: 'primitive', how: 'Let the head drop back a little; the arms fling out, then come together.', fade: 3, gone: 5, note: 'Usually absent by 4 to 5 months; still present at 6 months is abnormal.' },
  { id: 'atnr', name: 'Asymmetric tonic neck', kind: 'primitive', how: 'Turn the head to one side: the face-side arm extends, the other flexes ("fencer").', fade: 4, gone: 6, note: 'Present at 3 months; persistence at 6 months is abnormal.' },
  { id: 'grasp', name: 'Palmar grasp', kind: 'primitive', how: 'A finger in the palm is gripped.', fade: 4, gone: 6, note: 'Diminishes over the first 4 to 6 months as voluntary grasp takes over.' },
  { id: 'galant', name: 'Galant', kind: 'primitive', how: 'Stroke beside the spine in prone suspension; the trunk curves toward the stroke.', fade: 4, gone: 6, note: 'Diminishes over the first 4 to 6 months.' },
  { id: 'landau', name: 'Landau', kind: 'postural', how: 'Held prone in the air, the baby lifts the head and extends trunk and legs.', emerge: 3, present: 5, note: 'Should develop by 4 to 5 months.' },
  { id: 'propping', name: 'Lateral propping', kind: 'postural', how: 'Tipped sideways while sitting, the baby puts out an arm to catch itself.', emerge: 5, present: 7, note: 'Develops at 5 to 7 months; forward propping comes first. Needed for independent sitting.' },
  { id: 'parachute', name: 'Parachute', kind: 'postural', how: 'Tipped face-down toward the mat, both arms extend to catch the fall.', emerge: 8, present: 12, note: 'Usually appears at 8 to 9 months; certainly present by 12 months. An asymmetric parachute is abnormal.' },
  { id: 'toe', name: 'Upgoing toe', kind: 'sign', how: 'Stroke the outer sole.', note: 'Normal through the first year while the corticospinal tracts myelinate; at 12 months the toe may go up or down. Reproducible asymmetry is what matters.' },
  { id: 'hand', name: 'Hand preference', kind: 'sign', how: 'Offer toys to the midline and watch which hand reaches.', note: 'Hand preference before 12 months is abnormal and points to weakness of the other hand.' },
];
export type TimelineState = 'expected' | 'fading' | 'should be gone' | 'not yet' | 'emerging' | 'should be present' | 'normal either way' | 'red flag if present';
export function timelineState(item: TimelineItem, months: number): TimelineState {
  if (item.kind === 'primitive') return months < item.fade! ? 'expected' : months < item.gone! ? 'fading' : 'should be gone';
  if (item.kind === 'postural') return months < item.emerge! ? 'not yet' : months < item.present! ? 'emerging' : 'should be present';
  if (item.id === 'toe') return 'normal either way';
  return months < 12 ? 'red flag if present' : 'normal either way';
}

// ── Coma: four signs, each pointing at a level (Pearl 2014 pp. 94-97, 147-148;
//    Brazis 2011 pp. 608-613) ──────────────────────────────────────────────────────────────
export type ComaLevel = 'hemispheres' | 'midbrain' | 'pons' | 'medulla' | 'metabolic';
export interface ComaSign { id: string; name: string; options: { id: string; label: string; level: ComaLevel | null }[] }
export const COMA_SIGNS: ComaSign[] = [
  { id: 'breathing', name: 'Breathing', options: [
    { id: 'cheyne', label: 'Waxing and waning, with pauses (Cheyne-Stokes)', level: 'hemispheres' },
    { id: 'hypervent', label: 'Fast and deep, sustained (central hyperventilation)', level: 'midbrain' },
    { id: 'apneustic', label: 'Long pauses at full inspiration (apneustic)', level: 'pons' },
    { id: 'ataxic', label: 'Irregular, chaotic (ataxic)', level: 'medulla' },
    { id: 'normal-b', label: 'Regular', level: null },
  ] },
  { id: 'pupils', name: 'Pupils', options: [
    { id: 'small-react', label: 'Small and reactive', level: 'hemispheres' },
    { id: 'mid-fixed', label: 'Mid-position and fixed', level: 'midbrain' },
    { id: 'pinpoint', label: 'Pinpoint', level: 'pons' },
    { id: 'react-despite', label: 'Reactive, even though eye movements are gone', level: 'metabolic' },
  ] },
  { id: 'eyes', name: 'Eye movements (doll\'s eyes)', options: [
    { id: 'intact', label: 'Full doll\'s-eye movements', level: 'hemispheres' },
    { id: 'cn3', label: 'Third-nerve palsy or no vertical movement', level: 'midbrain' },
    { id: 'no-horizontal', label: 'No horizontal movement', level: 'pons' },
    { id: 'none', label: 'No movement at all', level: null },
  ] },
  { id: 'posture', name: 'Response to pain', options: [
    { id: 'localizes', label: 'Localizes or withdraws', level: 'hemispheres' },
    { id: 'flexor', label: 'Flexor posturing (arms bend: "decorticate")', level: 'hemispheres' },
    { id: 'extensor', label: 'Extensor posturing (arms straighten: "decerebrate")', level: 'midbrain' },
    { id: 'flaccid', label: 'No response', level: 'medulla' },
  ] },
];
export function comaVerdict(choice: Record<string, string>) {
  const levels = COMA_SIGNS.map(s => s.options.find(o => o.id === choice[s.id])?.level ?? null).filter((l): l is ComaLevel => !!l);
  if (!levels.length) return { kind: 'none' as const, text: 'Choose at least one sign.' };
  if (levels.includes('metabolic')) return { kind: 'metabolic' as const, text: 'Reactive pupils with absent eye movements is the classic sign of a metabolic or toxic coma: the pupillary pathway is unusually resistant. Look for a chemical cause before a structural one.' };
  const uniq = [...new Set(levels)];
  if (uniq.length === 1) return { kind: 'level' as const, level: uniq[0], text: `Every sign points to the same level: ${uniq[0]}. A single structural lesion at that level fits.` };
  return { kind: 'scattered' as const, text: `The signs point to different levels (${uniq.join(', ')}). When they do not agree, think multifocal or metabolic disease; when they move downward over time, think herniation.` };
}

// ── Herniation as a moving level: the rostrocaudal sequence after Pearl 2014, pp. 92-98
//    (clouding to stupor to coma; normal breathing to hyperventilation; an enlarging, sluggish
//    pupil; flexor then extensor posturing) and Brazis 2011 (central and uncal syndromes). ──
export const HERNIATION: { stage: string; choice: Record<string, string>; text: string }[] = [
  { stage: 'Hemispheres and diencephalon', choice: { breathing: 'cheyne', pupils: 'small-react', eyes: 'intact', posture: 'localizes' }, text: 'Drowsy, breathing waxes and wanes, small reactive pupils, full doll\'s eyes, localizes pain. Every sign still sits above the brainstem.' },
  { stage: 'Diencephalon failing', choice: { breathing: 'cheyne', pupils: 'small-react', eyes: 'intact', posture: 'flexor' }, text: 'The arms now bend to pain. The lesion has reached the deep structures above the midbrain.' },
  { stage: 'Midbrain', choice: { breathing: 'hypervent', pupils: 'mid-fixed', eyes: 'cn3', posture: 'extensor' }, text: 'Deep, fast breathing; pupils fixed in mid-position; vertical movements lost; arms straighten. Breathing faster is not improvement.' },
  { stage: 'Pons', choice: { breathing: 'apneustic', pupils: 'mid-fixed', eyes: 'no-horizontal', posture: 'extensor' }, text: 'Pauses at full inspiration and no horizontal doll\'s-eye movement: the pons is failing.' },
  { stage: 'Medulla', choice: { breathing: 'ataxic', pupils: 'mid-fixed', eyes: 'none', posture: 'flaccid' }, text: 'Chaotic breathing and no response at all. The level has reached the respiratory centres.' },
];

// ── Gait by level, bottom up (Pearl 2014 pp. 114-117; DeMyer p. 338; Brazis 2011 p. 17) ──
export const GAITS: { id: string; name: string; level: string; looks: string; child: string }[] = [
  { id: 'waddle', name: 'Waddling', level: 'Muscle (proximal weakness)', looks: 'Trunk sways side to side as weak hip abductors fail to hold the pelvis level; exaggerated lumbar lordosis.', child: 'With a Gowers manoeuvre and big calves, think Duchenne muscular dystrophy.' },
  { id: 'fatigue', name: 'Fatigable', level: 'Neuromuscular junction', looks: 'Starts well and deteriorates with distance; recovers with rest.', child: 'Juvenile myasthenia gravis; ask whether the child keeps up with friends by the end of a game.' },
  { id: 'steppage', name: 'Steppage', level: 'Peripheral nerve (foot drop)', looks: 'High knee lift and a slapping foot, because the ankle cannot dorsiflex.', child: 'Bilateral: think of an inherited neuropathy such as Charcot-Marie-Tooth; one side: a peroneal neuropathy.' },
  { id: 'antalgic', name: 'Antalgic', level: 'Root, joint or bone (pain)', looks: 'Short stance on the painful side.', child: 'In a limping child, pain is usually orthopaedic; radicular pain is rare and worth imaging.' },
  { id: 'scissor', name: 'Spastic, scissoring', level: 'Spinal cord or bilateral upper motor neuron', looks: 'Stiff legs, crossing at the knees, on the toes.', child: 'Spastic diplegia from periventricular white-matter injury in a child born preterm; a progressive version suggests a cord or hereditary spastic paraplegia.' },
  { id: 'hemi', name: 'Hemiparetic (circumducting)', level: 'Hemisphere (one side)', looks: 'The stiff leg swings out in an arc; the arm on that side is flexed and does not swing.', child: 'Hemiplegic cerebral palsy after perinatal stroke; running and fast walking bring out subtle posturing of the arm.' },
  { id: 'dystonic', name: 'Dystonic or choreic', level: 'Basal ganglia', looks: 'Twisting postures of the foot or trunk that may appear only when walking; or irregular, dancing extra movements.', child: 'Dystonia that is better in the morning suggests dopa-responsive dystonia; new chorea suggests Sydenham chorea.' },
  { id: 'ataxic', name: 'Wide-based ataxic', level: 'Cerebellum', looks: 'Broad base, lurching, cannot walk heel to toe; no better with eyes open.', child: 'Acute: post-infectious ataxia or an ingestion. Weeks: a posterior fossa tumour.' },
  { id: 'sensory', name: 'Sensory ataxic', level: 'Dorsal columns or large sensory nerves', looks: 'Stamping, watching the feet; much worse with eyes closed (Romberg positive).', child: 'Friedreich ataxia mixes cerebellar and sensory ataxia.' },
  { id: 'toe-walk', name: 'Toe walking', level: 'Several: muscle, cord, brain, or none', looks: 'Persistent walking on the toes.', child: 'Can be idiopathic and familial, or the first sign of Duchenne dystrophy, spastic diplegia or autism: the rest of the exam decides (DeMyer, p. 338).' },
  { id: 'functional', name: 'Inconsistent, effortful (astasia-abasia)', level: 'Functional', looks: 'Wild sways that rarely end in a fall, knee buckling without collapse, improvement with distraction.', child: 'A positive diagnosis, made from signs, not from normal tests (Daum 2014).' },
];

// ── Examining a toddler: the order that keeps the exam possible (owner's teaching:
//    "stop, look, and listen; make it a game; save the worst for last"; Utah: reflexes late,
//    on the parent's lap, with the hammer as an imaginary horse) ───────────────────────────
export const EXAM_STEPS: { id: string; label: string; tier: 1 | 2 | 3 | 4; why: string }[] = [
  { id: 'watch-play', label: 'Watch the child play while you take the history', tier: 1, why: 'Most of the exam can be done hands-off: alertness, symmetry, how each hand is used, how the child moves.' },
  { id: 'watch-walk', label: 'Watch the child walk, run and fetch a ball', tier: 1, why: 'Gait is the single most informative test, and children walk best when distracted (Brazis 2011, p. 17).' },
  { id: 'cn-game', label: 'Cranial nerves as a game: follow a toy, blow a kiss, stick out the tongue', tier: 2, why: 'A game tests the same nerves without a stranger touching the face.' },
  { id: 'fine-motor', label: 'Fine motor: stack blocks, pick up a small object', tier: 2, why: 'Pincer grasp, coordination and hand preference, while the child is still happy to play.' },
  { id: 'tone-strength', label: 'Tone and strength through play: "don\'t let me pull your arms"', tier: 3, why: 'Hands-on, but still a game; save it until the child trusts you.' },
  { id: 'reflexes', label: 'Reflexes, with the hammer turned into a horse, on the parent\'s lap', tier: 3, why: 'A hammer is a threatening object; do it late, and make it part of a story (Utah PediNeuroLogic Exam).' },
  { id: 'ofc', label: 'Head circumference with the tape', tier: 4, why: 'Quick, but many toddlers object to a tape round the head.' },
  { id: 'fundi', label: 'Look at the optic discs with the ophthalmoscope', tier: 4, why: 'A bright light close to the face is the least tolerated part of the exam: save the worst for last.' },
];
export function examOrderScore(order: string[]) {
  const tier = Object.fromEntries(EXAM_STEPS.map(s => [s.id, s.tier]));
  let inversions = 0; const pairs: [string, string][] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) if (tier[order[i]] > tier[order[j]]) { inversions++; pairs.push([order[i], order[j]]); }
  return { inversions, pairs };
}

// ── Where × when → what. Tempo ↔ mechanism after Brazis 2011 p. 4 (minutes: vascular or
//    seizure; days: infection or demyelination; months: tumour or degeneration), with the
//    pediatric tempos (static, regression) added. Examples are illustrative, not exhaustive. ──
export type Tempo = 'sudden' | 'acute' | 'subacute' | 'chronic' | 'episodic' | 'static' | 'regression';
export const TEMPOS: { id: Tempo; name: string; span: string; mechanisms: string[]; mimics?: string[] }[] = [
  { id: 'sudden', name: 'Sudden', span: 'Seconds to minutes', mechanisms: ['Vascular (stroke, haemorrhage)', 'Seizure', 'Trauma'] },
  { id: 'acute', name: 'Acute', span: 'Hours to days', mechanisms: ['Infection', 'Immune and inflammatory', 'Toxic or metabolic', 'Trauma and its complications'] },
  { id: 'subacute', name: 'Subacute', span: 'Days to weeks', mechanisms: ['Demyelinating and inflammatory', 'Infection (abscess, slower organisms)', 'Fast-growing tumour', 'Raised intracranial pressure'] },
  { id: 'chronic', name: 'Chronic progressive', span: 'Months to years', mechanisms: ['Tumour', 'Neurodegenerative', 'Genetic and metabolic', 'Hydrocephalus', 'Nutritional'] },
  { id: 'episodic', name: 'Episodic', span: 'Attacks with recovery between', mechanisms: ['Seizure', 'Migraine', 'Channelopathy', 'Syncope', 'Intermittent metabolic decompensation', 'Functional'], mimics: ['Breath-holding spells (6 months to 6 years), after crying or a fright', 'Night terrors (2 to 10 years), a partial arousal from deep sleep', 'Syncope'] },
  { id: 'static', name: 'Static', span: 'Present from early life, not worsening', mechanisms: ['Malformation', 'Prenatal or perinatal injury', 'Fixed result of an earlier insult'] },
  { id: 'regression', name: 'Regression', span: 'Loss of skills once acquired', mechanisms: ['Neurodegenerative and genetic-metabolic', 'Epileptic encephalopathy', 'Acquired encephalitis', 'Untreated hydrocephalus'] },
];
export const WHERE_WHEN: Partial<Record<string, Partial<Record<Tempo, string[]>>>> = {
  cortex: { sudden: ['Arterial ischaemic stroke (arteriopathy, heart disease, sickle cell disease)', 'Focal seizure, with post-ictal (Todd) weakness'], acute: ['Encephalitis (herpes simplex, autoimmune)', 'Acute disseminated encephalomyelitis'], subacute: ['Brain abscess', 'Tumour with oedema'], chronic: ['Low-grade glioma', 'Rasmussen encephalitis (progressive, one hemisphere)'], episodic: ['Focal epilepsy', 'Migraine with aura (symptoms spread over minutes)'], static: ['Perinatal arterial stroke (hemiplegic cerebral palsy)', 'Malformation of cortical development'], regression: ['Grey-matter neurodegenerative disease (for example neuronal ceroid lipofuscinosis)', 'Epileptic encephalopathy'] },
  subcortex: { sudden: ['Basal ganglia stroke (focal cerebral arteriopathy)', 'Haemorrhage from a vascular malformation'], acute: ['Acute disseminated encephalomyelitis'], subacute: ['Sydenham chorea'], chronic: ['Leukodystrophy (for example X-linked adrenoleukodystrophy)', 'Wilson disease in an adolescent', 'Thalamic tumour'], episodic: ['Paroxysmal dyskinesias'], static: ['Periventricular leukomalacia (spastic diplegia)', 'Dyskinetic cerebral palsy'], regression: ['Leukodystrophies', 'Mitochondrial disease (Leigh syndrome)'] },
  brainstem: { sudden: ['Haemorrhage from a cavernous malformation'], acute: ['Rhombencephalitis (enterovirus, Listeria)'], subacute: ['Diffuse midline glioma of the pons', 'Demyelination (acute disseminated encephalomyelitis, MOG antibody disease)'], chronic: ['Chiari malformation compressing the medulla', 'Brainstem glioma'], static: ['Congenital cranial nerve disorders (for example Möbius syndrome)'] },
  cerebellum: { sudden: ['Cerebellar stroke or haemorrhage'], acute: ['Post-infectious acute cerebellar ataxia', 'Toxic ingestion'], subacute: ['Posterior fossa tumour (medulloblastoma, pilocytic astrocytoma)', 'Opsoclonus-myoclonus-ataxia (look for neuroblastoma)'], chronic: ['Friedreich ataxia', 'Ataxia-telangiectasia'], episodic: ['Episodic ataxias', 'Intermittent metabolic decompensation'], static: ['Cerebellar malformation (for example Joubert syndrome)'] },
  cord: { sudden: ['Spinal trauma', 'Spinal cord infarct'], acute: ['Transverse myelitis', 'Compression from an epidural abscess or haematoma'], subacute: ['Neuromyelitis optica spectrum or MOG antibody disease', 'Spinal tumour (intramedullary astrocytoma; neuroblastoma through a foramen)'], chronic: ['Syringomyelia', 'Tethered cord', 'Hereditary spastic paraplegia'], static: ['Myelomeningocele'] },
  horn: { acute: ['Acute flaccid myelitis (anterior horn of the cord)', 'Poliomyelitis'], chronic: ['Spinal muscular atrophy'] },
  root: { acute: ['Guillain-Barré syndrome (polyradiculoneuropathy)', 'Cauda equina compression'], subacute: ['Chronic inflammatory demyelinating polyneuropathy'] },
  plexus: { sudden: ['Brachial plexus birth injury', 'Traumatic plexopathy'], acute: ['Neuralgic amyotrophy'] },
  nerve: { acute: ['Guillain-Barré syndrome', 'Compression neuropathy'], subacute: ['Drug toxicity (for example vincristine)', 'Chronic inflammatory demyelinating polyneuropathy'], chronic: ['Charcot-Marie-Tooth disease'], episodic: ['Hereditary neuropathy with liability to pressure palsies'] },
  nmj: { acute: ['Infant botulism (under 6 months)', 'Tick paralysis'], subacute: ['Juvenile myasthenia gravis'], episodic: ['Myasthenic fluctuation'], static: ['Congenital myasthenic syndromes'] },
  muscle: { acute: ['Benign acute childhood myositis after influenza', 'Rhabdomyolysis'], subacute: ['Juvenile dermatomyositis'], chronic: ['Duchenne and Becker muscular dystrophy'], episodic: ['Periodic paralysis', 'Metabolic myopathy (exercise-induced rhabdomyolysis)'], static: ['Congenital myopathies'] },
};
