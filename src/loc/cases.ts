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
    "history": "A 6-year-old boy is brought in because he will not walk. Two weeks ago he had a febrile illness with diarrhoea that settled. Four days ago he complained that his legs hurt and his feet felt \"fizzy\". Since then he has stumbled more each day, needed help on the stairs yesterday, and this morning could not stand. He says his hands feel funny too. His bladder and bowels have been normal. He is alert, chatty and frightened. There is no headache, no vomiting and no rash, and nobody at home takes regular medicines.",
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
        "finding": "Weakness of both legs, proximal and distal, worse than the arms; grip slightly weak on both sides. Symmetric.",
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
        "finding": "Counts more slowly and runs out of breath sooner than expected for his age. Worth repeating every few hours.",
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
      "explanation": "Absent reflexes everywhere put the lesion in the motor unit, and distal tingling with no sensory level places it in the nerves and roots rather than the horn cell or the cord. Guillain-Barré syndrome is a polyradiculoneuropathy, so nerve and root are both right. Bilateral facial weakness fits: cranial nerves are peripheral nerves too."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "Hours to days: the weakness has climbed over four days after an infection two weeks earlier. That tempo points to an immune or inflammatory process rather than a degenerative one."
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
          "why": "Must stay on the list: in the first days, spinal shock can leave a cord lesion flaccid and areflexic. The absence of a sensory level and the normal bladder argue against it here."
        },
        {
          "label": "Tick paralysis",
          "correct": true,
          "why": "An ascending flaccid paralysis that is cured by finding and removing the tick, so the scalp and skin folds deserve a search."
        },
        {
          "label": "Acute flaccid myelitis",
          "correct": false,
          "why": "An anterior horn disease: purely motor, so tingling and distal sensory loss argue against it."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A chronic, progressive myopathy of years, not days, with no sensory symptoms."
        },
        {
          "label": "Myasthenia gravis",
          "correct": false,
          "why": "Fatigable ocular and bulbar weakness with preserved reflexes; areflexia and sensory symptoms point elsewhere."
        },
        {
          "label": "Functional weakness",
          "correct": false,
          "why": "Absent reflexes are an objective sign that cannot be produced voluntarily."
        }
      ]
    },
    "reveal": "**Guillain-Barré syndrome.** The clinching sign is generalized areflexia with distal sensory symptoms and no sensory level, evolving over days after an infection. The next steps are about safety as much as diagnosis: admit, monitor breathing, swallowing, heart rate and blood pressure, and confirm with cerebrospinal fluid and nerve conduction studies while immunotherapy is planned."
  },
  {
    "id": "botulism",
    "title": "Infant botulism",
    "teaser": "A 3-month-old who stopped feeding well",
    "history": "A 3-month-old girl, previously well and growing normally, has been feeding poorly for three days. Her parents say she tires halfway through a bottle, her cry has become weak, and she has not opened her bowels for five days, which is unusual for her. Today she seems floppier and \"less expressive\". There has been no fever, vomiting or diarrhoea. She was born at term after an uncomplicated pregnancy and was smiling and holding her head up well a week ago.",
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
        "finding": "A weak suck that fades after a few seconds; reduced gag.",
        "key": true
      },
      {
        "id": "tone",
        "label": "Tone and head control",
        "finding": "Diffusely floppy, with marked head lag; a week ago she held her head well.",
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
      "explanation": "Ptosis, weak suck and gag, and a weak cry that fade with use are fatigable bulbar and ocular weakness, the signature of the junction. No fasciculations argues against the horn cell. Constipation fits the junction too, because the toxin blocks acetylcholine release in the gut as well."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "Days: a previously normal infant has lost head control and feeding over three days. An acquired, acute process, not a static or congenital one."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Infant botulism",
          "correct": true,
          "why": "Peredo 2009: suspect it under 6 months with constipation, listlessness, poor feeding, weak cry and a reduced gag. Every feature is here."
        },
        {
          "label": "Spinal muscular atrophy",
          "correct": true,
          "why": "A floppy, weak, alert infant belongs on the list until the pattern excludes it; the absence of tongue fasciculations and the acute course argue against it."
        },
        {
          "label": "Sepsis or a metabolic crisis",
          "correct": true,
          "why": "A floppy, poorly feeding infant is a sick infant until proved otherwise; infection and metabolic decompensation must be excluded in parallel."
        },
        {
          "label": "Congenital myasthenic syndrome",
          "correct": false,
          "why": "A congenital junction disorder is present from birth; this baby was normal a week ago."
        },
        {
          "label": "Cerebral palsy",
          "correct": false,
          "why": "A static condition from early brain injury; it does not take away skills over three days."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A slowly progressive myopathy of boys that presents in the toddler years, not as acute bulbar weakness in infancy."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "Typically ascends from the legs with absent reflexes; descending bulbar weakness with constipation points to the junction."
        }
      ]
    },
    "reveal": "**Infant botulism.** The clinching combination is constipation with fatigable ptosis, a weak suck and a fading cry in a previously normal infant under 6 months ([Peredo 2009](https://pubmed.ncbi.nlm.nih.gov/19726697/)). Admit with close monitoring of the airway and feeding, send stool for toxin testing, and discuss specific antitoxin treatment with the infectious diseases team without waiting for the result."
  },
  {
    "id": "duchenne",
    "title": "Duchenne muscular dystrophy",
    "teaser": "A 4-year-old boy who climbs up his own legs",
    "history": "A 4-year-old boy is referred because he falls more than his friends and cannot keep up when running. He walked later than his older sister. He uses the handrail and both feet on each step for the stairs, and his parents have noticed he walks on his toes. He has never lost a skill; he is simply not catching up. He has no pain, no cramps after exercise and no episodes of dark urine. His mother's brother \"had trouble walking\" as a boy and used a wheelchair as a teenager.",
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
        "finding": "Symmetric weakness of hips and shoulders; hands and feet strong.",
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
      "explanation": "Proximal, symmetric, purely motor weakness with a Gowers manoeuvre and large calves is a myopathy pattern; calf enlargement points to a dystrophy (Brazis 2011, p. 13). The anterior horn cell remains defensible until tested, because spinal muscular atrophy also weakens proximally and produces a Gowers sign, but the calves and the preserved reflexes lean to muscle."
    },
    "tempo": {
      "answer": "chronic",
      "explanation": "Months to years: late walking, then falling further behind without ever losing a skill. Slow progression, here colouring a developmental history."
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
          "why": "The milder dystrophinopathy: the same gene and pattern, a later and slower course. Genetics will separate them."
        },
        {
          "label": "Spinal muscular atrophy",
          "correct": true,
          "why": "Proximal weakness with a Gowers sign and no sensory loss, so the horn cell stays on the list until CK and genetics answer it."
        },
        {
          "label": "Spastic diplegic cerebral palsy",
          "correct": false,
          "why": "Toe walking, yes, but with brisk reflexes, increased tone and upgoing toes rather than proximal weakness."
        },
        {
          "label": "Charcot-Marie-Tooth disease",
          "correct": false,
          "why": "A distal, length-dependent neuropathy with lost ankle reflexes and sensory loss, the opposite pattern."
        },
        {
          "label": "Idiopathic toe walking",
          "correct": false,
          "why": "A diagnosis only when the rest of the examination is normal; a Gowers manoeuvre is not normal."
        },
        {
          "label": "Juvenile myasthenia gravis",
          "correct": false,
          "why": "Fatigable ocular and bulbar weakness; not fixed proximal weakness with big calves since toddlerhood."
        }
      ]
    },
    "reveal": "**Duchenne muscular dystrophy.** The Gowers manoeuvre shows proximal hip weakness, and the large calves with an affected maternal uncle point to an X-linked dystrophinopathy (Brazis 2011, p. 13). The next step is a creatine kinase level, then genetic testing of the dystrophin gene. See the [Neuromuscular section](/neuromuscular) for the disease itself."
  },
  {
    "id": "myelitis",
    "title": "Acute transverse myelitis",
    "teaser": "A 13-year-old whose legs went numb from the waist down",
    "history": "A 13-year-old girl had a cold ten days ago. Two days ago she developed pain between her shoulder blades. Yesterday her feet began to tingle, and the tingling climbed to her waist over the evening. This morning her legs are weak and she has not been able to pass urine since last night. She has had no injury, no fever now, and no problems with her arms, speech or swallowing. She mentions that her vision seemed blurred in one eye last week, which got better.",
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
        "finding": "Knee and ankle reflexes reduced; plantar responses upgoing on both sides.",
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
      "explanation": "Weak legs with a sensory level on the trunk and early urinary retention can only come from the cord; the sensory level is the most powerful of the three because no other level makes one. Reduced reflexes in the first days do not move the lesion out of the cord: an acute, severe lesion can produce spinal shock (DeMyer, pp. 273-274), and the upgoing toes already show the upper motor neuron. The real lesion may sit several segments above the level on the skin (Brazis 2011, p. 104), so image above it."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "Hours to days: tingling climbing to the waist overnight and retention by morning, ten days after an infection."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Spinal cord compression (epidural abscess, haematoma, tumour)",
          "correct": true,
          "why": "Must be excluded first, with urgent imaging, because it is treated by decompression and delay costs function."
        },
        {
          "label": "Acute transverse myelitis",
          "correct": true,
          "why": "A cord syndrome evolving over hours to days after an infection, with back pain, is the classic picture."
        },
        {
          "label": "Neuromyelitis optica spectrum or MOG antibody disease",
          "correct": true,
          "why": "The recent visual blurring with an afferent pupillary defect suggests optic neuritis, and myelitis plus optic neuritis points to these antibody-mediated diseases."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "The important mimic because the reflexes are reduced, but a sensory level, early retention and upgoing toes place this in the cord."
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
          "why": "A chronic myopathy of boys, with no sensory or bladder involvement."
        }
      ]
    },
    "reveal": "**Acute transverse myelitis**, with optic neuritis raising the question of an antibody-mediated disease. The clinching sign is the sensory level, with retention and upgoing toes confirming the cord. Urgent MRI of the whole spine and brain comes first to exclude compression, imaging above the skin level; then cerebrospinal fluid and antibody testing, and treatment of inflammation."
  },
  {
    "id": "ataxia",
    "title": "Post-infectious acute cerebellar ataxia",
    "teaser": "A 3-year-old who suddenly cannot walk straight",
    "history": "A 3-year-old boy woke this morning unable to walk without falling. Yesterday he was running normally. He had a viral illness with a rash a week and a half ago, now resolved. He is cheerful, eating and drinking, and has not vomited or complained of headache. He has not been sleepy. His parents have checked the house: there are no medicines within his reach, and nobody had a party last night. He has not been jerking, and his eyes have not been \"dancing\".",
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
      "explanation": "Ataxia with normal strength, normal reflexes and no sensory signs places the lesion in the cerebellum or its connections. A wide-based staggering gait points to the midline; disorders of the midline cerebellum affect the trunk and balance most (Brazis 2011, p. 411)."
    },
    "tempo": {
      "answer": "acute",
      "explanation": "Overnight: normal yesterday, ataxic this morning, a week and a half after a viral illness."
    },
    "differential": {
      "pick": 3,
      "options": [
        {
          "label": "Post-infectious acute cerebellar ataxia",
          "correct": true,
          "why": "Acute ataxia in a well, alert young child after a viral illness is the commonest cause."
        },
        {
          "label": "Toxic ingestion",
          "correct": true,
          "why": "Always on the list for acute ataxia in a toddler, even when the parents have checked; a normal level of alertness makes it less likely but not impossible."
        },
        {
          "label": "Opsoclonus-myoclonus-ataxia",
          "correct": true,
          "why": "Can begin as ataxia before the eye and jerk movements appear, and points to a search for neuroblastoma; watch for opsoclonus, myoclonus and irritability over the next days."
        },
        {
          "label": "Posterior fossa tumour",
          "correct": false,
          "why": "Tumours evolve over weeks, usually with headache, vomiting or papilloedema; an overnight onset with sharp discs fits poorly, although persisting or worsening ataxia should prompt imaging."
        },
        {
          "label": "Guillain-Barré syndrome",
          "correct": false,
          "why": "Ataxia can occur in the Miller Fisher variant, but with absent reflexes; his reflexes are normal."
        },
        {
          "label": "Spastic diplegia",
          "correct": false,
          "why": "A static condition with brisk reflexes and stiff legs, not an overnight ataxia."
        },
        {
          "label": "Duchenne muscular dystrophy",
          "correct": false,
          "why": "A slowly progressive myopathy with weakness, not acute ataxia with normal strength."
        }
      ]
    },
    "reveal": "**Post-infectious acute cerebellar ataxia.** The clinching features are an overnight midline ataxia in a well, alert child after a viral illness, with no opsoclonus, no papilloedema and normal reflexes. A toxicology screen is reasonable; imaging is for atypical features, persistence or worsening. Review again in the coming days, looking specifically for opsoclonus, myoclonus and irritability."
  }
];
