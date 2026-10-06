# Localization & the Neurologic Exam: design spec

_Written 2026-10-01. Source of truth for the `/localization` section of Where Before What. Built on the same module engine as `/eeg` (shared components in `components/curriculum/`), so the two curricula look and behave alike._

## Why this section is the heart of the site

The site is named for the doctrine this section teaches: **find the lesion before you name the disease.** Every other section is an application of it. The writing argues for a way of thinking and then hands the reader a tool to practise it. Its voice is narrative and conversational, in the register of good science writing, and is set out in `style-guide.md`.

## Sources and how they are used

Seven owner-supplied files in `docs/localization/Sources/` (git-ignored). Six are copyrighted textbooks used as **inspiration only**: summarise in our own words, never copy text or figures, cite by book + page when a specific claim rests on them.

| Key | Book | How it shapes the section |
|---|---|---|
| `brazis2011` | Brazis, Masdeu, Biller. *Localization in Clinical Neurology*, 6th ed. LWW 2011 | Method: localize before imaging; the lesion at the intersection of pathways; precision falls as you ascend; exam localizes, time course suggests cause; one lesion vs many. Syndromes. |
| `pearl2014` | Pearl, Emsellem. *Neuro-Logic: A Primer on Localization*. Demos 2014 | Tone: playful, vignettes, "everything is the company you keep". Coma as a level-finder. Gait by level. Rostrocaudal reporting. |
| `demyer` | Biller et al. *DeMyer's The Neurologic Examination*, 6th ed. | The programmed-text method (commit, then reveal). "Think circuitry." UMN/LMN table. True Babinski criteria. Craft and pitfalls. |
| `morris2012` | *Neurological Clinical Examination: A Concise Guide*, 3rd ed. 2012 | Choose the exam to fit the history; three closing questions (where, what phenomenology, what cause). Root-vs-nerve rules. |
| `fisch2012` | Fisch. *Neuroanatomy: Draw It to Know It*, 2nd ed. 2012 | Build a diagram layer by layer; place the lesion on the drawing you just built. |
| `arslan2014` | Arslan. *Neuroanatomical Basis of Clinical Neurology*, 2nd ed. 2014 | Condition → structures → deficits tables (the data model for our lesion simulators). |
| owner's deck | Brock. *Advanced Neuro Assessment* (Children's Hospital Colorado) | The owner's own teaching: the 11-level list, "stop, look, listen / make it a game / save the worst for last", the newborn exam, functional signs. Text may be adapted; its images are third-party and are not reused. |

Free, citable, linkable: **Utah PediNeuroLogic Exam** (Larsen & Stensaas, University of Utah; videos CC BY-NC-SA) — the pediatric reflex and handedness facts below come from it, and modules link to its videos.

## The curriculum

Five tracks, twelve modules. Module ids are fixed; internal links use them.

| # | id | Title | Track | Accent | Widget(s) |
|---|---|---|---|---|---|
| 1 | `m01-where-before-what` | Where before what | doctrine | `#0d9488` | `localizer-intro` |
| 2 | `m02-the-exam` | The examination as an instrument | doctrine | `#0d9488` | `exam-order`, `reflex-timeline` |
| 3 | `m03-first-fork` | The first fork: upper or lower motor neuron | doctrine | `#0d9488` | `localizer`, `localizer-floppy` |
| 4 | `m04-motor-unit` | The motor unit: horn cell, nerve, junction, muscle | periphery | `#2563eb` | `localizer-motor-unit` |
| 5 | `m05-roots-plexus-nerves` | Roots, plexus and nerves: the map problem | periphery | `#2563eb` | `root-nerve` |
| 6 | `m06-spinal-cord` | The spinal cord: tracts, levels and syndromes | axis | `#7c3aed` | `cord-sim` |
| 7 | `m07-brainstem` | The brainstem: crossed signs and the rule of four | axis | `#7c3aed` | `brainstem-sim` |
| 8 | `m08-loops` | The loops: cerebellum, basal ganglia and gait | axis | `#7c3aed` | `gait-by-level` |
| 9 | `m09-hemispheres` | The hemispheres: lobes, proportions and the visual pathway | hemispheres | `#4f46e5` | `visual-fields` |
| 10 | `m10-everywhere` | When the lesion is everywhere: coma and diffuse disease | hemispheres | `#4f46e5` | `coma-levels` |
| 11 | `m11-where-to-what` | From where to what: building the differential | synthesis | `#475569` | `where-when` |
| 12 | `m12-cases` | Cases: where, when, what | synthesis | `#475569` | `case:*` |

Order: Module 1 to 3 first (the doctrine). Then periphery (4, 5) and the axis (6 to 8) in either order, then the hemispheres (9, 10), then synthesis (11, 12). Module 12's cases can be attempted at any time and repeated.

Tags: `The Doctrine` (1–3, 11), `Periphery` (4, 5), `Neuraxis` (6–8), `Hemispheres` (9, 10), `Clinical Decision-Making` (3, 5, 11, 12), `Pediatric Exam` (2, 3).

## Interactivity: compute, don't draw

Every figure runs a small model of the anatomy and draws its output, so the learner manipulates the mechanism (Fisch's layer-by-layer method and DeMyer's commit-then-reveal, translated for the web). Models are pure TypeScript in `src/loc/models/` with tests in `scripts/test-loc-models.ts`; widgets in `components/loc/`.

| Widget | What the learner does | Model |
|---|---|---|
| `localizer` | Toggle findings; watch the 11 levels of the neuraxis fall away. Each excluded level says why. | Findings × levels compatibility table |
| `localizer-intro`, `-floppy`, `-motor-unit` | The same engine with a curated finding set and presets | same |
| `exam-order` | Put eight exam steps for a toddler in order; get feedback by tier (watch → play → hands-on → unpleasant) | Tier ranks |
| `reflex-timeline` | Drag an age slider from birth to 12 months; see which reflexes should be present, fading or gone | Utah-sourced age table |
| `root-nerve` | Mark weak muscles and lost reflexes; see which roots and nerves still explain the pattern | Muscle → root + nerve table |
| `cord-sim` | Choose a level and a lesion pattern; the body map shows what is lost, on which side, below what level | Tracts with sides and crossing levels |
| `brainstem-sim` | Choose midbrain/pons/medulla, medial/lateral, side; get the findings and the named syndrome | Rule of 4 |
| `visual-fields` | Choose a lesion site on the pathway; both eyes' fields are computed | Hemiretina → fibre → field mapping |
| `gait-by-level` | Pick a gait; see the level it points to and the company it keeps | Lookup |
| `coma-levels` | Set breathing, pupils, eye movements and posture; see which level they agree on, or that they don't (think metabolic) | Pearl's coma table as data |
| `where-when` | Choose a level and a tempo; get the mechanisms that fit and pediatric examples | Level × tempo grid |
| `coma-levels` (descent) | "Watch a herniation descend" plays the rostrocaudal sequence: the level as a trajectory | `HERNIATION` stages |
| `lesion-voices` | Pick a structure; see how it subtracts, irritates, releases or fills in | Structure × voice table (Pearl pages per cell) |
| `pretest` | Choose MRI, EEG or gene panel and how well the exam predicted the finding; a 100-child icon array gives the post-test probability | Bayes in odds form; sourced false-positive rates (Li 2021, Borusiak 2010) |
| `lesion-ladder` | Move a lesion up the facial nerve, radial nerve or foot-drop pathway; deficits accumulate until the pattern changes | Ordered branch points with removals and pattern changes |
| `map-sort` | Read a pattern, name the map it obeys (artery, length, segment, nerve, level, system, none) | Pattern cards → map → mechanism |
| `aphasia-switches` | Set fluency, comprehension, repetition, naming; one shared picture described by each syndrome | Four-switch classifier |
| `vertigo-sorter` | Mark nystagmus features and neighbours; one central feature overrules the peripheral ones | Weighted features (Brazis p. 265) |
| `dermatome-map`, `dermatome-level` | The public-domain dermatome drawing with the 28 ISNCSCI key sensory points: explore, quiz, or set a cord level and see which points a complete lesion leaves numb | Key points and key muscles (Kirshblum 2011); placements verified against the drawing's colors and band count |
| `case:<id>` | Work a case: history → choose exam elements → commit to a level → commit to a tempo → pick a differential → discussion | Staged case JSON |

## Exam videos

Sections may list `videos` (ids in `src/loc/videos.ts`): University of Utah NeuroLogic Exam clips (Larsen & Stensaas, CC BY-NC-SA, which allows use on non-commercial educational websites but not re-posting to YouTube or social media). Clips play from Utah's own Kaltura account and load only on click; posters are local stills. Every clip id was checked against Utah's own entry title. The required credit statement and the clip list are on `/credits`. To self-host instead, request the download password through Utah's form; nothing else changes.

## Openers and the core path

Every module opens with a parable (our own, one to three sentences), a historical note (a named neurologist or document, with a cited book page or registered paper), or both. The validator requires one, and requires a source for any history. Six modules carry `core: true` and form the short path shown on the section home: 1, 3, 4, 6, 7, 11.

Boxed callouts use a paragraph whose lines all start with `> `, written as `> **Bedside trick.** ...` with a citation.

## Section content rules

Same as `docs/eeg/design-spec.md` (markup subset, 4-option decision questions with teaching explanations, shuffled keys, no option letters in explanations, no em dashes), plus:

1. **Own words.** Never reproduce book text. A short phrase in quotation marks only when it is memorable, with author and page.
2. **Numbers.** A specific number, age, percentage or threshold must come from a verified PMID in `src/loc/sources.ts`, from the Utah site, or from a book page the writer actually read in the local PDF (cite as e.g. "(Brazis 2011, p. 99)"). If a number cannot be sourced, write the principle without it.
3. **Write the way the style guide describes.** Each section starts from something concrete (a child, a historical figure, a puzzle), explains the mechanism, and arrives at the bedside decision. History is used when it illuminates the idea, always from a cited page. `node scripts/style-loc.mjs` counts the habits to avoid.
4. **Children first.** Every module names what changes in a child: development, the infant exam, pediatric causes. Adult-only content (spondylosis, metastatic compression, elderly gait) is translated or left out.
5. **Admit the shaky rules.** Where the books disagree or a rule is a heuristic with exceptions (upper-face sparing, the rule of 4, conus = UMN), say so.
6. **Link out, don't re-teach.** Neuromuscular disease detail links to `/neuromuscular`; EEG to `/eeg`; imaging to `/neuroradiology`.

## Out of scope (v1)

Video hosting (link to Utah instead); a free-drawing canvas; adult-only syndromes; accounts.

## Done when

12 modules pass `node scripts/validate-loc.mjs`; every widget has model tests passing; `/localization`, every module, `/localization/review` render at 390 px without horizontal scroll; `npm run build` passes; EEG regression test still passes.
