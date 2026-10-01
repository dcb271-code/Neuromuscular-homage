// Case player data for Module 12. Each case is worked in stages: read the history, request a
// limited number of exam elements, commit to a level, commit to a tempo, choose a
// differential, then read the reveal. Schema only here; cases are appended below.

import type { Level } from './models/localizer';
import type { Tempo } from './models/data';

export interface LocCase {
  id: string;                 // used as figure id "case:<id>"
  title: string;              // shown after the reveal (no spoilers before)
  teaser: string;             // one line shown before starting, e.g. "A 3-year-old who will not walk"
  history: string;            // markdown subset; 80-160 words
  examPicks: number;          // how many exam elements the learner may request (e.g. 4)
  exam: { id: string; label: string; finding: string; key: boolean }[]; // 7-10 options; key = high-yield
  level: { answer: Level; also?: Level[]; explanation: string };     // `also` = defensible second answers
  tempo: { answer: Tempo; explanation: string };
  differential: { pick: number; options: { label: string; correct: boolean; why: string }[] }; // 6-8 options
  reveal: string;             // diagnosis, the one sign that clinched it, and what to do next (markdown)
}

export const CASES: LocCase[] = [
  {
    "id": "gbs",
    "title": "Guillain-Barré syndrome",
    "teaser": "A 6-year-old who has stopped walking",
    "history": "A 6-year-old boy is brought in because he will not walk. Two weeks ago he had a febrile illness with diarrhoea that has since settled. Four days ago he complained that his legs hurt and his feet felt \"fizzy\", and since then he has stumbled a little more each day, needing help on the stairs yesterday and unable to stand this morning. He says his hands feel funny too. His bladder and bowels have been working normally, and he is alert and chatty, though clearly frightened. There has been no headache, vomiting or rash, and nobody at home takes regular medicines.",
    "examPicks": 4,
    "exam": [
      {
        "id": "reflexes",
        "label": "Deep tendon reflexes",
        "finding": "Absent at the ankles and knees, and absent at the biceps and triceps despite reinforcement.",
        "key": true
      },
      {
        "id": "strength",
        "label": "Strength, by muscle group",
        "finding": "Symmetric weakness of both legs, proximal and distal, worse than in the arms, with a slightly weak grip on both sides.",
        "key": true
      },
      {
        "id": "level",
        "label": "Look for a sensory level on the trunk",
        "finding": "No sensory level. Pinprick is normal on the trunk and reduced only at the toes and fingertips.",
        "key": true
      },
      {
        "id": "face",
        "label": "Facial strength and bulbar function",
        "finding": "Mild weakness of eye closure and smile on both sides. Swallowing and voice are normal.",
        "key": true
      },
      {
        "id": "breathing",
        "label": "Count aloud in one breath",
        "finding": "Counts more slowly and runs out of breath sooner than expected for his age, a measure worth repeating every few hours.",
        "key": false
      },
      {
        "id": "plantar",
        "label": "Plantar responses",
        "finding": "Flexor on both sides.",
        "key": false
      },
      {
        "id": "bladder",
        "label": "Bladder: palpate for retention",
        "finding": "Not palpable; he passed urine an hour ago.",
        "key": false
      },
      {
        "id": "mental",
        "label": "Mental status",
        "finding": "Alert, oriented, appropriate.",
        "key": false
      },
      {
        "id": "fundi",
        "label": "Fundi",
        "finding": "Normal discs.",
        "key": false
      },
      {
        "id": "fasc",
        "label": "Look for fasciculations and wasting",
        "finding": "None.",
        "key": false
      }
    ],
    "level": {
      "answer": "nerve",
      "also": [
        "root"
      ],
      "explanation": "Absent reflexes everywhere put the lesion in the motor unit, and distal tingling with no sensory level places it in the nerves and roots rather than the horn cell or the cord. Guillain-Barré syndrome is a polyradiculoneuropathy, so nerve and root are both right. The weakness on both sides of the face fits as well, because the cranial nerves are peripheral nerves too."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "The weakness has climbed over four days, beginning two weeks after an infection, which is a course of hours to days. That tempo points to an immune or inflammatory process rather than a degenerative one."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Guillain-Barré syndrome",
          "correct": true,
          "why": "Ascending, symmetric weakness with absent reflexes and distal tingling after an infection is the classic picture."
        },
        {
          "label": "Acute transverse myelitis or spinal cord compression",
          "correct": true,
          "why": "It must stay on the list, because in the first days spinal shock can leave a cord lesion flaccid and areflexic. Here the absence of a sensory level and the normal bladder argue against it."
        },
        {
          "label": "Tick paralysis",
          "correct": true,
          "why": "It causes an ascending flaccid paralysis that is cured by finding and removing the tick, so the scalp and skin folds deserve a search."
        },
        {
          "label": "Acute flaccid myelitis",
          "correct": false,
          "why": "A disease of the anterior horn, and so purely motor, which means the tingling and distal sensory loss argue against it."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A chronic, progressive myopathy that unfolds over years rather than days, with no sensory symptoms."
        },
        {
          "label": "Myasthenia gravis",
          "correct": false,
          "why": "It causes fatigable ocular and bulbar weakness with preserved reflexes, so areflexia and sensory symptoms point elsewhere."
        },
        {
          "label": "Functional weakness",
          "correct": false,
          "why": "Absent reflexes are an objective sign that cannot be produced voluntarily."
        }
      ]
    },
    "reveal": "**Guillain-Barré syndrome.** What clinches it is generalized areflexia with distal sensory symptoms and no sensory level, evolving over days after an infection. The next steps concern safety as much as diagnosis. Admit him, monitor breathing, swallowing, heart rate and blood pressure, and confirm the diagnosis with cerebrospinal fluid and nerve conduction studies while immunotherapy is planned."
  },
  {
    "id": "botulism",
    "title": "Infant botulism",
    "teaser": "A 3-month-old who stopped feeding well",
    "history": "A 3-month-old girl who was previously well and growing normally has been feeding poorly for three days. Her parents say she tires halfway through a bottle and her cry has become weak, and she has not opened her bowels for five days, which is unusual for her. Today she seems floppier and \"less expressive\". There has been no fever, vomiting or diarrhoea. She was born at term after an uncomplicated pregnancy, and a week ago she was smiling and holding her head up well.",
    "examPicks": 4,
    "exam": [
      {
        "id": "lids",
        "label": "Eyelids and eye movements",
        "finding": "Bilateral ptosis that worsens as the examination goes on; eye movements are reduced.",
        "key": true
      },
      {
        "id": "suck",
        "label": "Suck and gag",
        "finding": "A weak suck that fades after a few seconds, and a reduced gag.",
        "key": true
      },
      {
        "id": "tone",
        "label": "Tone and head control",
        "finding": "Diffusely floppy, with marked head lag, although a week ago she held her head well.",
        "key": true
      },
      {
        "id": "fasc",
        "label": "Tongue: look for fasciculations",
        "finding": "No fasciculations.",
        "key": true
      },
      {
        "id": "alert",
        "label": "Level of alertness",
        "finding": "Awake and follows faces with her eyes, but with little facial expression.",
        "key": false
      },
      {
        "id": "reflexes",
        "label": "Deep tendon reflexes",
        "finding": "Present but reduced.",
        "key": false
      },
      {
        "id": "fontanelle",
        "label": "Anterior fontanelle",
        "finding": "Soft and flat.",
        "key": false
      },
      {
        "id": "abdomen",
        "label": "Abdomen",
        "finding": "Mildly distended, with reduced bowel sounds.",
        "key": false
      },
      {
        "id": "skin",
        "label": "Skin",
        "finding": "No rash, no neurocutaneous marks.",
        "key": false
      }
    ],
    "level": {
      "answer": "nmj",
      "explanation": "Ptosis, a weak suck and gag, and a weak cry that all fade with use are fatigable bulbar and ocular weakness, the signature of the junction. The absence of fasciculations argues against the horn cell. The constipation fits the junction too, because the toxin blocks acetylcholine release in the gut as well."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "Over three days a previously normal infant has lost head control and feeding, which makes this an acquired, acute process rather than a static or congenital one."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Infant botulism",
          "correct": true,
          "why": "Peredo 2009 advises suspecting it under 6 months with constipation, listlessness, poor feeding, a weak cry and a reduced gag, and every one of those features is here."
        },
        {
          "label": "Spinal muscular atrophy",
          "correct": true,
          "why": "A floppy, weak, alert infant belongs on the list until the pattern excludes it, and here the absence of tongue fasciculations and the acute course argue against it."
        },
        {
          "label": "Sepsis or a metabolic crisis",
          "correct": true,
          "why": "A floppy infant who is feeding poorly has to be treated as a sick infant from the start, so infection and metabolic decompensation are excluded in parallel."
        },
        {
          "label": "Congenital myasthenic syndrome",
          "correct": false,
          "why": "A congenital junction disorder is present from birth, and this baby was normal a week ago."
        },
        {
          "label": "Cerebral palsy",
          "correct": false,
          "why": "A static condition from early brain injury, which does not take away skills over three days."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A slowly progressive myopathy of boys that presents in the toddler years rather than as acute bulbar weakness in infancy."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "It typically ascends from the legs with absent reflexes, whereas descending bulbar weakness with constipation points to the junction."
        }
      ]
    },
    "reveal": "**Infant botulism.** What clinches it is constipation together with fatigable ptosis, a weak suck and a fading cry in a previously normal infant under 6 months ([Peredo 2009](https://pubmed.ncbi.nlm.nih.gov/19726697/)). Admit her with close monitoring of the airway and feeding, send stool for toxin testing, and discuss specific antitoxin treatment with the infectious diseases team without waiting for the result."
  },
  {
    "id": "duchenne",
    "title": "Duchenne muscular dystrophy",
    "teaser": "A 4-year-old boy who climbs up his own legs",
    "history": "A 4-year-old boy is referred because he falls more often than his friends and cannot keep up when they run. He walked later than his older sister did. He climbs stairs using the handrail and putting both feet on each step, and his parents have noticed that he walks on his toes. He has never lost a skill and is simply not catching up. There is no pain, no cramping after exercise and no dark urine. His mother's brother \"had trouble walking\" as a boy and used a wheelchair as a teenager.",
    "examPicks": 4,
    "exam": [
      {
        "id": "gowers",
        "label": "Watch him get up from the floor",
        "finding": "He turns prone, pushes up on his hands and walks his hands up his thighs to stand (Gowers manoeuvre).",
        "key": true
      },
      {
        "id": "calves",
        "label": "Look at and feel the calves",
        "finding": "Large, firm calves on both sides.",
        "key": true
      },
      {
        "id": "gait",
        "label": "Gait",
        "finding": "Waddling, with an exaggerated lumbar curve and a tendency to walk on his toes.",
        "key": true
      },
      {
        "id": "strength",
        "label": "Strength pattern",
        "finding": "Symmetric weakness of the hips and shoulders, with strong hands and feet.",
        "key": true
      },
      {
        "id": "sensation",
        "label": "Sensation",
        "finding": "Normal to touch and pinprick.",
        "key": false
      },
      {
        "id": "reflexes",
        "label": "Deep tendon reflexes",
        "finding": "Present; knee jerks reduced, ankle jerks present. No clonus; plantars flexor.",
        "key": false
      },
      {
        "id": "tongue",
        "label": "Tongue: look for fasciculations",
        "finding": "None.",
        "key": false
      },
      {
        "id": "cn",
        "label": "Cranial nerves",
        "finding": "Normal: no ptosis, full eye movements, normal face.",
        "key": false
      },
      {
        "id": "heels",
        "label": "Ankle range of motion",
        "finding": "Tight heel cords bilaterally.",
        "key": false
      }
    ],
    "level": {
      "answer": "muscle",
      "also": [
        "horn"
      ],
      "explanation": "Proximal, symmetric, purely motor weakness with a Gowers manoeuvre and large calves is the pattern of a myopathy, and calf enlargement points to a dystrophy (Brazis 2011, p. 13). The anterior horn cell remains defensible until tested, because spinal muscular atrophy also weakens proximal muscles and produces a Gowers sign, but the calves and the preserved reflexes lean toward muscle."
    },
    "tempo": {
      "answer": "chronic",
      "explanation": "Over months to years he walked late and then fell further behind without ever losing a skill, so this is slow progression showing itself through a developmental history."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Duchenne muscular dystrophy",
          "correct": true,
          "why": "A boy with proximal weakness, Gowers manoeuvre, calf enlargement, lordosis and toe walking, with an affected maternal uncle, fits the classic picture (Brazis 2011, p. 13)."
        },
        {
          "label": "Becker muscular dystrophy",
          "correct": true,
          "why": "The milder dystrophinopathy, with the same gene and pattern but a later and slower course, and genetics will separate the two."
        },
        {
          "label": "Spinal muscular atrophy",
          "correct": true,
          "why": "Proximal weakness with a Gowers sign and no sensory loss keeps the horn cell on the list until CK and genetics answer it."
        },
        {
          "label": "Spastic diplegic cerebral palsy",
          "correct": false,
          "why": "It causes toe walking too, but with brisk reflexes, increased tone and upgoing toes rather than proximal weakness."
        },
        {
          "label": "Charcot-Marie-Tooth disease",
          "correct": false,
          "why": "A distal, length-dependent neuropathy with lost ankle reflexes and sensory loss, which is the opposite pattern."
        },
        {
          "label": "Idiopathic toe walking",
          "correct": false,
          "why": "A diagnosis only when the rest of the examination is normal, and a Gowers manoeuvre is not normal."
        },
        {
          "label": "Juvenile myasthenia gravis",
          "correct": false,
          "why": "It causes fatigable ocular and bulbar weakness rather than fixed proximal weakness with big calves since toddlerhood."
        }
      ]
    },
    "reveal": "**Duchenne muscular dystrophy.** The Gowers manoeuvre shows proximal hip weakness, and the large calves together with an affected maternal uncle point to an X-linked dystrophinopathy (Brazis 2011, p. 13). The next step is a creatine kinase level, followed by genetic testing of the dystrophin gene. See the [Neuromuscular section](/neuromuscular) for the disease itself."
  },
  {
    "id": "myelitis",
    "title": "Acute transverse myelitis",
    "teaser": "A 13-year-old whose legs went numb from the waist down",
    "history": "A 13-year-old girl had a cold ten days ago. Two days ago she developed pain between her shoulder blades, and yesterday her feet began to tingle, with the tingling climbing to her waist over the evening. This morning her legs are weak, and she has not been able to pass urine since last night. She has had no injury and has no fever now, and her arms, speech and swallowing are unaffected. She mentions that the vision in one eye seemed blurred last week before it got better.",
    "examPicks": 4,
    "exam": [
      {
        "id": "level",
        "label": "Look for a sensory level on the trunk",
        "finding": "Pinprick is reduced from just below the umbilicus downward on both sides.",
        "key": true
      },
      {
        "id": "legs",
        "label": "Leg strength",
        "finding": "Both legs weak, hip flexion worst.",
        "key": true
      },
      {
        "id": "reflexes",
        "label": "Leg reflexes and plantars",
        "finding": "Knee and ankle reflexes reduced, with upgoing plantar responses on both sides.",
        "key": true
      },
      {
        "id": "bladder",
        "label": "Bladder: palpate for retention",
        "finding": "A distended, tender bladder.",
        "key": true
      },
      {
        "id": "arms",
        "label": "Arm strength and reflexes",
        "finding": "Normal.",
        "key": false
      },
      {
        "id": "eyes",
        "label": "Visual acuity and pupils",
        "finding": "Acuity mildly reduced in the right eye with a relative afferent pupillary defect.",
        "key": false
      },
      {
        "id": "back",
        "label": "Examine the spine",
        "finding": "Tender over the mid-thoracic spine; no deformity.",
        "key": false
      },
      {
        "id": "vibration",
        "label": "Vibration sense",
        "finding": "Reduced at the toes and ankles on both sides.",
        "key": false
      },
      {
        "id": "cn",
        "label": "Cranial nerves",
        "finding": "Normal apart from the right eye findings.",
        "key": false
      }
    ],
    "level": {
      "answer": "cord",
      "explanation": "Weak legs with a sensory level on the trunk and early urinary retention can only come from the cord, and the sensory level is the most powerful of the three because no other level makes one. Reduced reflexes in the first days do not move the lesion out of the cord, since an acute, severe lesion can produce spinal shock (DeMyer, pp. 273-274), and the upgoing toes already show the upper motor neuron. The real lesion may sit several segments above the level on the skin (Brazis 2011, p. 104), so the imaging has to extend above it."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "The course is one of hours to days, with tingling that climbed to the waist overnight and retention by morning, ten days after an infection."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Spinal cord compression (epidural abscess, haematoma, tumour)",
          "correct": true,
          "why": "It must be excluded first, with urgent imaging, because it is treated by decompression and delay costs function."
        },
        {
          "label": "Acute transverse myelitis",
          "correct": true,
          "why": "A cord syndrome evolving over hours to days after an infection, with back pain, is the classic picture."
        },
        {
          "label": "Neuromyelitis optica spectrum or MOG antibody disease",
          "correct": true,
          "why": "The recent visual blurring with an afferent pupillary defect suggests optic neuritis, and myelitis together with optic neuritis points to these antibody-mediated diseases."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "It is the important mimic because the reflexes are reduced, but a sensory level, early retention and upgoing toes place this lesion in the cord."
        },
        {
          "label": "Functional weakness",
          "correct": false,
          "why": "A sensory level, a distended bladder and upgoing toes are objective structural signs."
        },
        {
          "label": "Acute cerebellar ataxia",
          "correct": false,
          "why": "The cerebellum does not cause weakness, a sensory level or retention."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A chronic myopathy of boys that spares sensation and the bladder."
        }
      ]
    },
    "reveal": "**Acute transverse myelitis**, with optic neuritis raising the question of an antibody-mediated disease. The clinching sign is the sensory level, and the retention and upgoing toes confirm the cord. Urgent MRI of the whole spine and brain comes first, to exclude compression and to image above the level on the skin, followed by cerebrospinal fluid and antibody testing and treatment of the inflammation."
  },
  {
    "id": "ataxia",
    "title": "Post-infectious acute cerebellar ataxia",
    "teaser": "A 3-year-old who suddenly cannot walk straight",
    "history": "A 3-year-old boy woke this morning unable to walk without falling, although yesterday he was running normally. He had a viral illness with a rash a week and a half ago, which has resolved. He is cheerful and eating and drinking, and he has not vomited, complained of headache or been sleepy. His parents have checked the house and found no medicines within his reach, and nobody had a party last night. He has not been jerking, and his eyes have not been \"dancing\".",
    "examPicks": 4,
    "exam": [
      {
        "id": "gait",
        "label": "Gait",
        "finding": "Wide-based and staggering; he falls if he tries to turn quickly.",
        "key": true
      },
      {
        "id": "eyes",
        "label": "Eye movements: look for opsoclonus",
        "finding": "No opsoclonus. A few beats of nystagmus at the end of gaze.",
        "key": true
      },
      {
        "id": "mental",
        "label": "Alertness and behaviour",
        "finding": "Alert, playful and appropriate; not irritable or sleepy.",
        "key": true
      },
      {
        "id": "fundi",
        "label": "Fundi",
        "finding": "Sharp discs; no papilloedema.",
        "key": true
      },
      {
        "id": "limbs",
        "label": "Reaching for a toy",
        "finding": "Mild overshoot and tremor as his hand nears the toy, both sides.",
        "key": false
      },
      {
        "id": "strength",
        "label": "Strength",
        "finding": "Normal.",
        "key": false
      },
      {
        "id": "reflexes",
        "label": "Deep tendon reflexes",
        "finding": "Present and symmetric; plantars flexor.",
        "key": false
      },
      {
        "id": "myoclonus",
        "label": "Watch for myoclonic jerks",
        "finding": "None seen.",
        "key": false
      },
      {
        "id": "abdomen",
        "label": "Abdomen: feel for a mass",
        "finding": "Soft, no mass.",
        "key": false
      }
    ],
    "level": {
      "answer": "cerebellum",
      "explanation": "Ataxia with normal strength, normal reflexes and no sensory signs places the lesion in the cerebellum or its connections. A wide-based, staggering gait points to the midline, because disorders of the midline cerebellum affect the trunk and balance most (Brazis 2011, p. 411)."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "The onset was overnight, with a boy who was normal yesterday ataxic this morning, a week and a half after a viral illness."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Post-infectious acute cerebellar ataxia",
          "correct": true,
          "why": "In a well, alert young child, this is the commonest cause of acute ataxia after a viral illness."
        },
        {
          "label": "Toxic ingestion",
          "correct": true,
          "why": "It is always on the list for acute ataxia in a toddler, even when the parents have checked, and a normal level of alertness makes it less likely without ruling it out."
        },
        {
          "label": "Opsoclonus-myoclonus-ataxia",
          "correct": true,
          "why": "It can begin as ataxia before the eye movements and jerks appear, and it should prompt a search for neuroblastoma, so watch for opsoclonus, myoclonus and irritability over the next few days."
        },
        {
          "label": "Posterior fossa tumour",
          "correct": false,
          "why": "Tumours evolve over weeks, usually with headache, vomiting or papilloedema, so an overnight onset with sharp discs fits poorly, although ataxia that persists or worsens should prompt imaging."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "Ataxia can occur in the Miller Fisher variant, but with absent reflexes, and his reflexes are normal."
        },
        {
          "label": "Spastic diplegia",
          "correct": false,
          "why": "A static condition with brisk reflexes and stiff legs, which looks nothing like an overnight ataxia."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A slowly progressive myopathy that causes weakness, whereas this is acute ataxia with normal strength."
        }
      ]
    },
    "reveal": "**Post-infectious acute cerebellar ataxia.** The clinching features are an overnight midline ataxia in a well, alert child after a viral illness, with no opsoclonus, no papilloedema and normal reflexes. A toxicology screen is reasonable, and imaging is kept for atypical features, persistence or worsening. Review him again over the coming days, looking specifically for opsoclonus, myoclonus and irritability."
  },
  {
    "id": "icp",
    "title": "Posterior fossa tumour with obstructive hydrocephalus",
    "teaser": "A 7-year-old who sees double when looking to one side",
    "history": "A 7-year-old girl has had headaches for three or four weeks. They are worst when she wakes, and on several mornings she has vomited before breakfast and then felt well enough to go to school. For the past week she has seen double when she looks to the left, and she has started turning her whole head to read the board. Her teacher says she has become clumsy in the playground, and her father thinks she walks \"as if the floor were moving\". She has had no fever, injury or recent illness, and she takes no medicines. She can still read small print, and her parents wonder whether she needs glasses.",
    "examPicks": 4,
    "exam": [
      {
        "id": "fundi",
        "label": "Fundi",
        "finding": "Both optic discs are swollen, with blurred margins and no venous pulsations.",
        "key": true
      },
      {
        "id": "eyes",
        "label": "Eye movements",
        "finding": "The left eye does not move fully outward on looking left, and the double vision is worst in that direction. All other movements are full.",
        "key": true
      },
      {
        "id": "gait",
        "label": "Gait, then heel-to-toe walking",
        "finding": "Wide-based and unsteady; she cannot walk heel to toe and sways when standing with her feet together, even with her eyes open.",
        "key": true
      },
      {
        "id": "face",
        "label": "Facial strength and swallowing",
        "finding": "Normal: full eye closure, a symmetric smile, a normal voice and swallow.",
        "key": true
      },
      {
        "id": "fingernose",
        "label": "Finger to nose",
        "finding": "Mild overshoot on both sides, far less striking than the gait.",
        "key": false
      },
      {
        "id": "reflexes",
        "label": "Deep tendon reflexes",
        "finding": "Present and symmetric.",
        "key": false
      },
      {
        "id": "plantar",
        "label": "Plantar responses",
        "finding": "Flexor on both sides.",
        "key": false
      },
      {
        "id": "level",
        "label": "Look for a sensory level on the trunk",
        "finding": "None.",
        "key": false
      },
      {
        "id": "head",
        "label": "Head circumference",
        "finding": "Within the normal range and unchanged from earlier measurements.",
        "key": false
      },
      {
        "id": "mental",
        "label": "Alertness and behaviour",
        "finding": "Alert and oriented; quieter and more tired than usual, but answers appropriately.",
        "key": false
      }
    ],
    "level": {
      "answer": "cerebellum",
      "also": [
        "brainstem"
      ],
      "explanation": "The sixth-nerve palsy is better read as a messenger reporting raised pressure than as a marker of where the lesion sits. The nerve's long course makes it an early casualty of raised pressure from almost any cause (Pearl 2014, p. 43), and together with papilloedema it is one of the commonest false localizing signs (Brazis 2011, p. 622). The address comes from the company it keeps. A wide-based, staggering gait with little limb ataxia is the midline cerebellar pattern (Brazis 2011, p. 412), and a cerebellar mass pressing on the fourth ventricle is what raises the pressure (Arslan 2014, p. 98). Brainstem is defensible, because it shares the posterior fossa, but the normal face and swallow argue against an intrinsic pontine lesion, and a lesion at the sixth-nerve nucleus tends to cause a gaze palsy rather than one weak lateral rectus (Pearl 2014, p. 43)."
    },
    "tempo": {
      "answer": "subacute",
      "explanation": "The course runs over weeks, with morning headaches for three or four weeks, then double vision, then unsteadiness, each new symptom added to the old. A steady build-up over weeks is the tempo of rising pressure and a growing mass, and it does not match a post-infectious illness that peaks within a day or two."
    },
    "differential": {
      "pick": 2,
      "options": [
        {
          "label": "Posterior fossa tumour (medulloblastoma, cerebellar astrocytoma)",
          "correct": true,
          "why": "Posterior fossa tumours are common in children, medulloblastoma and cystic astrocytoma above all (Pearl 2014, p. 63). A midline mass explains the truncal ataxia, and by obstructing the fourth ventricle it also explains the morning headache and vomiting, the papilloedema and the sixth-nerve palsy (Arslan 2014, p. 98)."
        },
        {
          "label": "Obstructive hydrocephalus from another cause",
          "correct": true,
          "why": "Hydrocephalus raises the pressure and can bring the same papilloedema and sixth-nerve palsy (Brazis 2011, p. 158; Pearl 2014, p. 43). The scan is what separates a tumour from other causes of obstruction, which the bedside cannot do."
        },
        {
          "label": "Idiopathic intracranial hypertension",
          "correct": false,
          "why": "It can produce the same headache, papilloedema and sixth-nerve palsy (Brazis 2011, p. 202), but by definition it is raised pressure without a tumour or other cause (Arslan 2014, p. 191), so it can be named only after a scan. A clear midline ataxia sends you to the posterior fossa first."
        },
        {
          "label": "Diffuse midline glioma of the pons",
          "correct": false,
          "why": "It lives in the same compartment, but tumours within the pons seldom block the flow of cerebrospinal fluid early, so papilloedema is not their usual opening sign (Arslan 2014, p. 330), and a lesion at the sixth-nerve nucleus tends to cause a gaze palsy instead (Pearl 2014, p. 43). Her face and swallow are normal, and imaging will settle the question."
        },
        {
          "label": "Migraine",
          "correct": false,
          "why": "Migraine comes in attacks with recovery between them. Headaches that build over weeks, wake her with vomiting and arrive with swollen discs and a cranial nerve palsy should not be called migraine before a scan has been done."
        },
        {
          "label": "Sinusitis, a squint or a need for glasses",
          "correct": false,
          "why": "None of these swells both optic discs or makes a child unsteady. The double vision is real, but the eye is reporting a problem that lies behind it."
        },
        {
          "label": "Post-infectious acute cerebellar ataxia",
          "correct": false,
          "why": "Both the tempo and the company are wrong for it. It comes on overnight in a well child after an infection, with sharp discs (compare Case 5), rather than over weeks with headache, vomiting and papilloedema."
        }
      ]
    },
    "reveal": "**A posterior fossa mass with obstructive hydrocephalus**, to be confirmed by urgent imaging. The clinching sign is the papilloedema, because it explains the double vision. Once the pressure is known to be high, the sixth-nerve palsy needs no address of its own (Pearl 2014, p. 43; Brazis 2011, p. 622), which leaves the wide-based gait to do the localizing, to the midline cerebellum (Brazis 2011, p. 412). Posterior fossa tumours are common in children, medulloblastoma and cystic astrocytoma among them (Pearl 2014, p. 63). Arrange brain imaging the same day and involve neurosurgery at once. A lumbar puncture should not come first, because a suspected posterior fossa mass is a reason to image before any needle (DeMyer, pp. 545-546)."
  }
];
