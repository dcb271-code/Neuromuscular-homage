// Exam video clips from the University of Utah NeuroLogic Exam and Pediatric NeuroLogic Exam
// (Larsen & Stensaas), licensed CC BY-NC-SA, which permits incorporation into non-commercial
// educational websites (not re-posting to YouTube or social media). Every clip id was checked
// against the entry title on Utah's Kaltura account. Clips play from Utah's own
// Kaltura account and load only when the reader presses play; poster stills are stored locally
// (public/loc/video/thumbs). Captions are ours. Each mapping of clip to content was checked
// against the description on Utah's page (2026-10-02). See /credits for the required statement.

export type UtahSite = 'adult' | 'pediatric';
export interface ExamVideo {
  id: string;            // Utah clip id, e.g. "motor_ab_10"
  title: string;
  caption: string;       // our words
  site: UtahSite;
  page: string;          // Utah page the clip appears on
  entry: string;         // Kaltura entry id on Utah's account
  sound: boolean;
  courtesy?: string;     // contributor credited by Utah for this clip
}

export const KALTURA = { partner: '816122', uiconf: '44640261' };
export const utahPageUrl = (v: ExamVideo) => `https://neurologicexam.med.utah.edu/${v.site}/html/${v.page}`;
export const kalturaEmbedUrl = (v: ExamVideo) =>
  `https://cdnapisec.kaltura.com/p/${KALTURA.partner}/sp/${KALTURA.partner}00/embedIframeJs/uiconf_id/${KALTURA.uiconf}/partner_id/${KALTURA.partner}?iframeembed=true&playerId=kplayer_${v.id}&entry_id=${v.entry}`;
export const posterUrl = (v: ExamVideo) => `/loc/video/thumbs/${v.id}.jpg`;

const STERN = 'Alejandro Stern, Stern Foundation';

export const EXAM_VIDEOS: ExamVideo[] = [
  // Module 2: the examination
  { id: 'intro_05', title: 'Watching before touching', caption: 'How much of the examination can be done by watching a child play, before any hands-on testing begins.', site: 'pediatric', page: 'introduction.html', entry: '0_in4wfp18', sound: true },
  { id: 'intro_06', title: 'Making the examination a game', caption: 'Puppets for coordination and a reflex hammer that becomes a horse, so that each test turns into something a toddler wants to do.', site: 'pediatric', page: 'introduction.html', entry: '0_ekedwepg', sound: true },
  { id: 'intro_07', title: 'Saving the worst for last', caption: 'Why the fundi, the otoscope, the gag reflex and the tape measure come at the end of the visit.', site: 'pediatric', page: 'introduction.html', entry: '0_1pgqjkyl', sound: true },
  { id: 'newborn_n_23', title: 'Moro reflex in a newborn', caption: 'The arms open fully and then come back toward the midline. An absent or incomplete response, or a one-sided one, is the abnormal finding.', site: 'pediatric', page: 'newborn_n.html', entry: '0_cgadiect', sound: true },
  { id: '03mo_17', title: 'Asymmetric tonic neck reflex at 3 months', caption: 'Turning the head extends the arm on that side and flexes the other. It should not be obligatory, and it should be gone by about 6 months.', site: 'pediatric', page: '03month.html', entry: '0_7w04alvx', sound: true },
  { id: '06mo_14', title: 'Testing the parachute at 6 months', caption: 'The parachute is the last postural reaction to arrive, usually at 8 to 9 months; before then the arms are drawn back rather than thrust forward.', site: 'pediatric', page: '06month.html', entry: '0_yrj51o1n', sound: true },
  // Module 3: upper versus lower motor neuron
  { id: 'motor_ab_05', title: 'Pronator drift', caption: 'With the arms outstretched and palms up, the weaker arm pronates and drifts down, a subtle sign of an upper motor neuron lesion.', site: 'adult', page: 'motor_abnormal.html', entry: '0_bcb3hac4', sound: true },
  { id: 'motor_ab_02', title: 'Spasticity', caption: 'Resistance that builds with the speed of the stretch and then gives way, the clasp-knife pattern of an upper motor neuron lesion.', site: 'adult', page: 'motor_abnormal.html', entry: '0_zrw75ko4', sound: true },
  { id: 'motor_ab_09', title: 'Brisk reflexes and sustained clonus', caption: 'A very brisk ankle jerk with sustained clonus on one side, part of the upper motor neuron syndrome.', site: 'adult', page: 'motor_abnormal.html', entry: '0_lvenbarj', sound: true },
  { id: 'motor_ab_10', title: 'Babinski sign', caption: 'Stroking the outer sole lifts the great toe and fans the others. After the first year this points to the corticospinal tract.', site: 'adult', page: 'motor_abnormal.html', entry: '0_gjevsv13', sound: true },
  { id: 'newborn_ab_03', title: 'A hypotonic newborn at rest', caption: 'A "flat on the mat" posture with few movements against gravity, the first clue to low tone.', site: 'pediatric', page: 'newborn_ab.html', entry: '0_0gixnw5t', sound: true },
  { id: 'newborn_ab_19', title: 'Slipping through the hands', caption: 'In vertical suspension the same infant slides through the examiner\'s grip because of low shoulder-girdle tone. Utah\'s full examination of this baby points to a central cause.', site: 'pediatric', page: 'newborn_ab.html', entry: '0_0htxq80k', sound: true },
  // Module 4: the motor unit
  { id: 'motor_ab_12', title: 'Gowers sign', caption: 'The hands climb up the legs to reach standing, because the hip and back extensors are weak.', site: 'adult', page: 'motor_abnormal.html', entry: '0_5s8cd51y', sound: false },
  { id: 'gait_ab_11', title: 'Myopathic gait', caption: 'A waddling gait with exaggerated lumbar lordosis, which keeps the center of gravity behind weak hip extensors.', site: 'adult', page: 'gait_abnormal.html', entry: '0_mq7mgtdc', sound: false },
  { id: 'motor_ab_01', title: 'Wasting and fasciculations', caption: 'Atrophy of the hand muscles with fasciculations in an adult with motor neuron disease, the lower motor neuron picture of the anterior horn.', site: 'adult', page: 'motor_abnormal.html', entry: '0_875mcqn1', sound: true },
  // Module 5: roots, plexus and nerves
  { id: 'gait_ab_10', title: 'Steppage gait', caption: 'The leg is lifted high to clear a foot that cannot dorsiflex, the gait of foot drop.', site: 'adult', page: 'gait_abnormal.html', entry: '0_z1p8nsbi', sound: false },
  // Module 6: spinal cord
  { id: 'sensory_ab_03', title: 'A sensory level', caption: 'Pinprick loss with a level on the trunk, which together with the arm findings places the lesion in the spinal cord.', site: 'adult', page: 'sensory_abnormal.html', entry: '0_0e677hou', sound: true },
  // Module 7: brainstem
  { id: 'cranialnerve_ab_08', title: 'Internuclear ophthalmoplegia', caption: 'One eye fails to adduct on horizontal gaze because the medial longitudinal fasciculus is damaged between the sixth and third nerve nuclei.', site: 'adult', page: 'cranialnerve_abnormal.html', entry: '0_dfh2s4jf', sound: false },
  // Module 8: cerebellum and basal ganglia
  { id: 'coord_ab_06', title: 'Finger-to-nose ataxia', caption: 'Overshoot and a movement broken into separate parts, the appendicular ataxia of cerebellar hemisphere disease.', site: 'adult', page: 'coordination_abnormal.html', entry: '0_eshn7zg6', sound: true },
  { id: 'gait_ab_14', title: 'Ataxic gait', caption: 'A wide-based, unsteady gait that worsens on turning.', site: 'adult', page: 'gait_abnormal.html', entry: '0_a0h5yewo', sound: true },
  { id: 'sensory_ab_11', title: 'Romberg sign', caption: 'Steady with the eyes open but falling with them closed, which points to lost position sense rather than cerebellar ataxia.', site: 'adult', page: 'sensory_abnormal.html', entry: '0_daax3khx', sound: false, courtesy: STERN },
  { id: 'gait_ab_12', title: 'Parkinsonian gait', caption: 'Stooped posture, small shuffling steps and turning en bloc, with reduced facial expression.', site: 'adult', page: 'gait_abnormal.html', entry: '0_dsa53mhp', sound: false, courtesy: STERN },
  { id: 'gait_ab_13', title: 'Choreoathetoid gait', caption: 'Irregular, flowing involuntary movements intruding on walking, from the basal ganglia.', site: 'adult', page: 'gait_abnormal.html', entry: '0_1nijz6zy', sound: false, courtesy: STERN },
  // Module 9: hemispheres
  { id: 'gait_ab_08', title: 'Hemiplegic gait', caption: 'Circumduction of the leg, with the arm flexed and the thumb tucked into the fist on the same side.', site: 'adult', page: 'gait_abnormal.html', entry: '0_kiwccyst', sound: true },
  { id: 'cranialnerve_ab_17', title: 'Central facial weakness', caption: 'Weakness of the lower face with the forehead relatively spared, the pattern of an upper motor neuron lesion.', site: 'adult', page: 'cranialnerve_abnormal.html', entry: '0_zvlbuiyo', sound: false, courtesy: STERN },
  { id: 'cranialnerve_ab_03', title: 'Homonymous hemianopia on confrontation', caption: 'Loss of the right half of the visual field in both eyes, from a lesion behind the chiasm on the left.', site: 'adult', page: 'cranialnerve_abnormal.html', entry: '0_xdxwhxua', sound: false },
  { id: 'mentalstatus_ab_06', title: 'Expressive aphasia', caption: 'Halting, effortful speech made mostly of nouns and verbs, with frustration and good comprehension.', site: 'adult', page: 'mentalstatus_abnormal.html', entry: '0_8gr2v3tn', sound: true },
  { id: 'gait_ab_09', title: 'Diplegic gait', caption: 'Spastic, weak legs swung around in circumduction on both sides, with the arms much less affected.', site: 'adult', page: 'gait_abnormal.html', entry: '0_ed16c1q8', sound: false },
];

export const VIDEO_BY_ID: Record<string, ExamVideo> = Object.fromEntries(EXAM_VIDEOS.map(v => [v.id, v]));

export const UTAH_CREDIT = 'Movies from the "Adult NeuroLogic Exam" and "Pediatric NeuroLogic Exam" websites are used by permission of Paul D. Larsen, M.D., University of Nebraska Medical Center and Suzanne S. Stensaas, Ph.D., University of Utah School of Medicine. Additional materials were drawn from resources provided by Alejandro Stern, Stern Foundation, Buenos Aires, Argentina; Kathleen Digre, M.D., University of Utah; and Daniel Jacobson, M.D., Marshfield Clinic, Wisconsin. The movies are licensed under a Creative Commons Attribution-NonCommercial-ShareAlike License.';
export const UTAH_LICENSE_URL = 'https://neurologicexam.med.utah.edu/adult/html/creative-commons-license.html';
