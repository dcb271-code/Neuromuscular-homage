# Localization & the Neurologic Exam: design spec

_Written 2026-10-01. Source of truth for the `/localization` section of Where Before What. Built on the same module engine as `/eeg` (shared components in `components/curriculum/`), so the two curricula look and behave alike._

## Why this section is the heart of the site

The site is named for the doctrine this section teaches: **find the lesion before you name the disease.** Every other section is an application of it. The tone is therefore a little more philosophical than the EEG curriculum: each module argues for a way of thinking, then hands the reader a tool to practise it.

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
| `case:<id>` | Work a case: history → choose exam elements → commit to a level → commit to a tempo → pick a differential → discussion | Staged case JSON |

## Section content rules

Same as `docs/eeg/design-spec.md` (markup subset, 4-option decision questions with teaching explanations, shuffled keys, no option letters in explanations, no em dashes), plus:

1. **Own words.** Never reproduce book text. A short phrase in quotation marks only when it is memorable, with author and page.
2. **Numbers.** A specific number, age, percentage or threshold must come from a verified PMID in `src/loc/sources.ts`, from the Utah site, or from a book page the writer actually read in the local PDF (cite as e.g. "(Brazis 2011, p. 99)"). If a number cannot be sourced, write the principle without it.
3. **Philosophy earns its place.** Each module opens with a short argument for why the idea matters, then mechanism, then the bedside decision. History (Broca, Jackson, Charcot, Gowers, Babinski) is used when it sharpens the point, not as decoration.
4. **Children first.** Every module names what changes in a child: development, the infant exam, pediatric causes. Adult-only content (spondylosis, metastatic compression, elderly gait) is translated or left out.
5. **Admit the shaky rules.** Where the books disagree or a rule is a heuristic with exceptions (upper-face sparing, the rule of 4, conus = UMN), say so.
6. **Link out, don't re-teach.** Neuromuscular disease detail links to `/neuromuscular`; EEG to `/eeg`; imaging to `/neuroradiology`.

## Out of scope (v1)

Video hosting (link to Utah instead); a free-drawing canvas; adult-only syndromes; accounts.

## Done when

12 modules pass `node scripts/validate-loc.mjs`; every widget has model tests passing; `/localization`, every module, `/localization/review` render at 390 px without horizontal scroll; `npm run build` passes; EEG regression test still passes.
