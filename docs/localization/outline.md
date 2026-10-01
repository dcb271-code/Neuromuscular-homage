# Localization curriculum: module outline

Writers: follow `docs/localization/design-spec.md` for every rule. Facts with numbers only from `src/loc/sources.ts` (each entry's `supports` says exactly what it covers) or from a book page you actually read in `docs/localization/Sources/` (PDF page offsets: Brazis +6, Pearl +15, DeMyer +27, Morris +31, Fisch +15, Arslan +23). Cite books inline as "(Brazis 2011, p. 4)"; cite papers as PubMed links. The widgets' models are in `src/loc/models/` — read the one your section uses so the prose agrees with what the figure computes. Section JSON may set `"figure": "<widget id>"` (rendered above the prose) and, for case sections only, `"discussion": true` (prose collapsed behind "Discussion").

Voice: an attending who loves this subject, arguing for a way of thinking. Each module opens with a short argument (why this idea matters), then mechanism, then the bedside decision, then what changes in a child. Use history where it sharpens a point. Admit where rules bend.

Tags (use exactly): `The Doctrine`, `Periphery`, `Neuraxis`, `Hemispheres`, `Clinical Decision-Making`, `Pediatric Exam`.

---

## 1 · `m01-where-before-what` · Where before what (doctrine, `#0d9488`, beginner, 35 min, tags: The Doctrine)
Why: the name of the site is a method, and this module argues for it.
1. **The oldest rule** — localize before you name; the anatomoclinical method; Jackson's point that locating the damage that abolishes a function is not the same as locating the function (1874, public domain); Brazis's four steps and three pre-questions (is the deficit real, pathological, neurologic?) (Brazis 2011, pp. 1-3); "localize, then image" (Pearl 2014, p. 1).
2. **The neuraxis is a list of addresses** — the eleven levels from cortex to muscle; a lesion has an address; it sits where two damaged pathways cross (Brazis 2011, p. 3); precision falls as you go up (p. 4). `figure: localizer-intro`.
3. **The exam says where, the story says when** — the exam localizes; the time course suggests the cause (Brazis 2011, p. 4); the three closing questions: where, what is the phenomenon, what is the cause (Morris 2012, p. xxix); preview of Module 11.
4. **One lesion or many** — parsimony, and when to abandon it: Occam versus Hickam/Saint (Hilliard 2004); Brazis's example of deficits that arrived decades apart (p. 4); multifocal vs diffuse vs system degeneration.
5. **The child is a moving target** — development is the fourth dimension: findings normal at one age are signs at another (upgoing toe normal in the first year; hand preference before 12 months abnormal: Utah); cerebral palsy as a non-progressive lesion in a developing brain whose signs evolve (Rosenbaum 2007); static vs progressive vs regressive as localization in time.
Sign-off: on three real patients, the resident states the level before ordering imaging, and a faculty member agrees.

## 2 · `m02-the-exam` · The examination as an instrument (doctrine, `#0d9488`, beginner, 45 min, tags: The Doctrine, Pediatric Exam)
Why: the exam is not a ritual; it is a set of experiments, each testing a circuit.
1. **What the exam is for** — "think circuitry" (DeMyer); screen, then target the history's hypothesis (Morris 2012, pp. xiii-xxix); record what you saw, not what you concluded; never write "neuro WNL" (DeMyer).
2. **Stop, look, and listen** — most of the exam is hands-off; observation of spontaneous activity often discloses more than formal testing (DeMyer, p. 239); what you can learn before touching the child.
3. **Make it a game: the exam by age** — newborn, infant, toddler, school age, adolescent; tricks from the books and the owner's deck (temperature game, "don't let my fingers get away", run and fetch). `figure: exam-order`.
4. **Save the worst for last, and other craft** — order for a toddler; swing the hammer, don't peck; relax the limb before judging tone; reinforcement; compare sides and compare with parents (DeMyer pp. 252, 258, 270, 614); the plantar stimulus in a ticklish child (p. 616).
5. **The infant exam: reflexes that should come and go** — primitive reflexes fade and postural reactions emerge; persistence or absence is an upper motor neuron sign in an infant (Utah); ages from Utah only. `figure: reflex-timeline`. Link to Utah videos.
Sign-off: performs a complete neurologic exam on a toddler, in a developmentally appropriate order, observed by faculty.

## 3 · `m03-first-fork` · The first fork: upper or lower motor neuron (doctrine, `#0d9488`, beginner, 45 min, tags: The Doctrine, Clinical Decision-Making, Pediatric Exam)
Why: the first and most powerful split in localization.
1. **Two neurons, two signatures** — UMN vs LMN (DeMyer Table 7-7, p. 289; Pearl 2014, p. 65). `figure: localizer`.
2. **Tone: spasticity, rigidity, hypotonia** — catch-and-yield vs lead-pipe (DeMyer Table 7-6, p. 273); hypotonia at every level of the reflex arc (Table 7-4, p. 266).
3. **Reflexes and the plantar response** — grading; asymmetry matters most; clonus; the four criteria of a true extensor plantar (DeMyer pp. 281-282); infants.
4. **When the rules mislead** — spinal and cerebral shock (DeMyer pp. 273-274); spastic CP looks hypotonic first; axonal Guillain-Barré may keep reflexes (p. 290); upper-face sparing is "more dogmatic than truth" (Pearl 2014, p. 49).
5. **The floppy infant: central or peripheral** — Peredo 2009 (central 60-80%, peripheral 15-30%; features; botulism); link to the neurogenetics portal's hypotonia figure idea and to `/neuromuscular`. `figure: localizer-floppy`.
Sign-off: on five patients, classifies the weakness as UMN or LMN from the exam alone, agreeing with faculty.

## 4 · `m04-motor-unit` · The motor unit: horn cell, nerve, junction, muscle (periphery, `#2563eb`, intermediate, 45 min, tags: Periphery, Clinical Decision-Making)
Why: four places weakness can live, each with a fingerprint.
1. **Four addresses, four fingerprints** — pattern table (distribution, reflexes, sensation, fatigability, fasciculations, CK). `figure: localizer-motor-unit`.
2. **Muscle** — proximal, symmetric, Gowers, calves; DMD (Brazis 2011, p. 13); link `/neuromuscular`.
3. **The junction** — fatigable, ocular and bulbar; juvenile myasthenia; infant botulism (Peredo 2009).
4. **Nerve** — length-dependent (Brazis 2011, pp. 4-5, 26; Pearl 2014, p. 76); Charcot-Marie-Tooth; Guillain-Barré as root and nerve.
5. **The anterior horn** — fasciculations, wasting, no sensory loss; spinal muscular atrophy; acute flaccid myelitis (no numbers unless sourced).
Sign-off: examines three children with neuromuscular weakness and names the level of the motor unit before the EMG.

## 5 · `m05-roots-plexus-nerves` · Roots, plexus and nerves: the map problem (periphery, `#2563eb`, intermediate, 50 min, tags: Periphery, Clinical Decision-Making)
Why: three overlapping maps; the art is choosing the muscle that tells them apart.
1. **Three maps** — dermatome, myotome, nerve territory; overlap means one root may numb little (Brazis 2011, p. 89); the two rules (Morris 2012, pp. xxix, 23).
2. **The arm** — key muscles and reflex roots; wrist drop. `figure: root-nerve`.
3. **The leg: foot drop** — peroneal vs L5 by inversion and hip abduction (Morris 2012, pp. 26, 29).
4. **The brachial plexus at birth** — Erb (C5-C6) and Klumpke (C8-T1) (Pearl 2014, p. 80); root-level branches (dorsal scapular, long thoracic) separate root avulsion from trunk injury (Fisch 2012, pp. 30-35).
5. **Reflexes as root markers** — biceps/brachioradialis C5-C6, triceps C7, knee L3-L4, ankle S1; a lost reflex localizes better than a numb patch.
Sign-off: localizes three focal neuropathies or radiculopathies on real patients, naming the muscle that discriminated.

## 6 · `m06-spinal-cord` · The spinal cord: tracts, levels and syndromes (axis, `#7c3aed`, intermediate, 50 min, tags: Neuraxis)
Why: the cord is the most predictable structure in the nervous system; three tracts and their crossings explain every syndrome.
1. **Three tracts and where they cross** — corticospinal (crossed in the medulla), dorsal columns (uncrossed until the medulla), spinothalamic (crosses within a segment or two) (Fisch 2012, Drawing 7-4; Brazis 2011 ch. 5).
2. **Finding the level** — LMN at the level, UMN below; sensory level may sit below the lesion (Brazis 2011, p. 104); Beevor sign; the cord ends lower at birth (Brazis 2011, p. 99).
3. **The syndromes** — complete, Brown-Séquard, anterior, central (syrinx), posterior. `figure: cord-sim`. Intramedullary vs extramedullary clues (Brazis Table 5.11, p. 114).
4. **Conus, cauda equina and the tethered cord** — Brazis 2011, pp. 117-118; skin markers of dysraphism.
5. **Cord emergencies in children** — transverse myelitis, compression, acute flaccid myelitis; why an urgent MRI of the whole spine.
Sign-off: examines a patient with a myelopathy and predicts the level before imaging.

## 7 · `m07-brainstem` · The brainstem: crossed signs and the rule of four (axis, `#7c3aed`, intermediate, 50 min, tags: Neuraxis)
Why: the brainstem announces itself with crossed signs; the rule of four turns a maze into arithmetic.
1. **Crossed findings** — ipsilateral cranial nerve, contralateral body (Brazis 2011, p. 12; Pearl 2014, p. 47).
2. **The rule of four** — Gates 2005, 2011; present as a heuristic with exceptions. `figure: brainstem-sim`.
3. **Named syndromes as worked examples** — Weber, medial pontine/Millard-Gubler, lateral medullary (Wallenberg), medial medullary (Brazis 2011, pp. 387-397; Pearl 2014, pp. 109-112).
4. **The eyes as a brainstem map** — internuclear ophthalmoplegia; gaze toward a cortical lesion, away from a pontine one (Pearl 2014, pp. 43, 148); central vs peripheral nystagmus (owner's deck; Pearl 2014, pp. 120-121).
5. **The child's brainstem** — posterior fossa tumours, diffuse midline glioma of the pons, Chiari; what to examine when a child has a new sixth-nerve palsy.
Sign-off: localizes two brainstem lesions from the exam, naming every structure involved.

## 8 · `m08-loops` · The loops: cerebellum, basal ganglia and gait (axis, `#7c3aed`, intermediate, 45 min, tags: Neuraxis)
Why: these circuits do not weaken; they shape movement, and gait is where they show.
1. **Modulators, not motors** — why cerebellar and basal ganglia disease spare strength.
2. **The cerebellum** — ipsilateral signs; midline (truncal) vs hemispheric (limb) (Brazis 2011, pp. 411-412; Pearl 2014, p. 63); the excitatory vs inhibitory output caveat.
3. **Acute ataxia in a child** — post-infectious, ingestion, opsoclonus-myoclonus, tumour; what to do first.
4. **The basal ganglia** — too little vs too much movement; dystonia and chorea in children; Sydenham chorea (Pearl 2014, p. 116).
5. **Gait as the integrator** — gait by level, bottom up (Pearl 2014, pp. 114-117); toe walking (DeMyer p. 338). `figure: gait-by-level`.
Sign-off: describes the gait of five children in level terms before any other exam.

## 9 · `m09-hemispheres` · The hemispheres: lobes, proportions and the visual pathway (hemispheres, `#4f46e5`, intermediate, 50 min, tags: Hemispheres)
Why: the cortex is where localization is least precise and most interesting.
1. **Cortical signatures** — aphasia, neglect, cortical sensory loss, seizures, gaze preference; "experiments of nature" (Brazis 2011, p. 493).
2. **Face, arm, leg** — the homunculus; MCA vs ACA vs capsule proportions (Pearl 2014, pp. 7-10, 108-109; Brazis 2011, p. 11).
3. **The visual pathway** — `figure: visual-fields`; congruity and macular sparing rules (Pearl 2014, pp. 27-28); testing fields in a child with finger-wiggling (Pearl 2014, p. 26).
4. **Language and the developing brain** — Broca's lesion-size observation (Brazis 2011, p. 1); children's language after early injury (cautiously, no numbers unless sourced).
5. **Perinatal brain injury** — hemiplegic CP after perinatal stroke; spastic diplegia from periventricular white-matter injury (Volpe 2009), legs more than arms; early hand preference (Utah).
Sign-off: maps visual fields in two children and names the lesion site.

## 10 · `m10-everywhere` · When the lesion is everywhere: coma and diffuse disease (hemispheres, `#4f46e5`, advanced, 45 min, tags: Hemispheres, Clinical Decision-Making)
Why: some findings point to no single level, and that is itself a localization.
1. **Consciousness lives in two places** — brainstem reticular formation and both hemispheres.
2. **The coma exam as a level-finder** — breathing, pupils, eyes, posture (Pearl 2014, pp. 94-97, 147-148). `figure: coma-levels`. Describe responsiveness in plain words (Brazis 2011, p. 603).
3. **Metabolic or structural** — reactive pupils with absent eye movements; "drugs can do anything" (Pearl 2014, p. 96).
4. **Herniation** — uncal (the pupil tells the side), central; Kernohan notch (Pearl 2014, pp. 37, 93; Brazis 2011, pp. 616-622).
5. **Diffuse and multifocal disease in children** — encephalopathy, ADEM, metabolic crises; developmental regression as a localization in time.
Sign-off: examines a child with depressed consciousness and states the level or "diffuse", with faculty.

## 11 · `m11-where-to-what` · From where to what: building the differential (synthesis, `#475569`, intermediate, 45 min, tags: The Doctrine, Clinical Decision-Making)
Why: localization is half the answer; tempo turns an address into a short list.
1. **Tempo is the bridge** — Brazis 2011, p. 4.
2. **The mechanism list** — vascular, infection, inflammatory/demyelinating, toxic-metabolic, neoplastic, degenerative/genetic, congenital/developmental, traumatic, functional.
3. **Where × when** — `figure: where-when`.
4. **The child's clock** — static, progressive, regressive, episodic; age of onset as a filter.
5. **Functional neurological disorder: a positive diagnosis** — positive signs (Daum 2014), abductor and Hoover signs (Sonoo 2004), owner's deck signs; never a diagnosis of exclusion.
Sign-off: presents three new consults as "where, when, what" before any test results.

## 12 · `m12-cases` · Cases: where, when, what (synthesis, `#475569`, intermediate, 40 min, tags: Clinical Decision-Making)
Five sections, each a case: `figure: case:<id>` and `discussion: true`. The prose is the discussion shown after the case. Cases live in `src/loc/cases.ts` (schema in that file). Suggested cases: acute flaccid weakness with areflexia (Guillain-Barré); a floppy 3-month-old with constipation (infant botulism); a 4-year-old boy with a Gowers sign (Duchenne); a teenager with a crossed brainstem syndrome or a hemicord (transverse myelitis); a toddler with acute ataxia (post-infectious vs opsoclonus-myoclonus). Quiz: five new mini-vignettes mixing levels.
Sign-off: completes all five cases and presents one to faculty in where-when-what form.
