# Localization curriculum: improvement log

> One scoped change per entry: Target / Change / Outcome (commit) / Follow-ups. Append-only under History.

## Queued

### Owner decisions (clinical judgment calls raised by the 2026-10-01 fact-check)
- Ages taken from the Utah exam: upgoing toe "normal in the first year" (many references allow 12-24 months) and hand preference before 12 months (some use 18). Conus at L3 at term (Brazis p. 99); newer ultrasound data put it at or above L2-L3, with a conus at or below L3 prompting a look for tethering.
- Uncited safety additions to confirm: acquired third-nerve palsy in a child needs imaging even when the pupil is spared (m07); opioids and clonidine mimic pontine pupils, hypoglycemia can cause focal signs, and hydrocephalus causes upgaze failure (m10); hearing check before diagnosing a language disorder (m09).
- Currency: "pseudotumor cerebri" and "cerebellar mutism" (now idiopathic intracranial hypertension and cerebellar mutism syndrome); vertigo still taught from nystagmus with only a note on HINTS; Brazis p. 493's claim about absent frontal asymmetry in autism rests on older small studies.
- Floppy-infant next steps should name SMN1 testing and CK before EMG, and SMA newborn screening; the Duchenne case could do the same.

### Content to add
- Missing pediatric topics: transient neonatal myasthenia; myositis (juvenile dermatomyositis, benign acute childhood myositis); acute flaccid myelitis as a localizer preset; MOG antibody disease and ADEM in myelitis work-up; syrinx presenting as scoliosis; drug-induced parkinsonism and Wilson disease; non-convulsive status and when coma needs continuous EEG (link /eeg); infants with open sutures (fontanelle, head growth, setting-sun eyes), the pediatric coma scale and current pediatric brain death standards; Landau-Kleffner syndrome and ESES; craniopharyngioma and optic pathway glioma in NF1; pediatric gait mimics (in-toeing, tibial torsion).
- New cases: regression in a 2-year-old (autism-associated regression, Landau-Kleffner, metachromatic leukodystrophy, anti-NMDA receptor encephalitis); functional weakness with a positive Hoover sign before the MRI is revealed; adolescent spondylolisthesis with L5 radiculopathy; toddler with acute ataxia unfolding over time; opioid or clonidine ingestion versus pontine hemorrhage; incidental findings (Chiari 4 mm, pineal cyst, white-matter spots, an SCN1A VUS) worked through the pretest figure.

### Interactivity
- Case player: staged re-examination ("day 3"), and a "rank by cost of missing" step so the treatable emergency must come first.
- Calibration game: the learner states a probability before each reveal and is scored (Brier score), tying the Bayes thread to their own judgment.
- Brainstem simulator "growing tumor" mode; third-nerve cross-section (compression versus ischemia); vertigo sorter with head impulse and skew; cord simulator conus-versus-cauda toggle and a "misleading level" mode; root-nerve presets for Erb-plus and total plexus with Horner; reflex timeline with corrected age for preterm infants.
- "Write the note" exercise: describe a Utah video in words, with "WNL" and "non-focal" flagged.
- Cross-site links: lesion sites in the localizer and cord, brainstem and visual figures could open the matching slice of the MRI atlas; the coma and seizure sections could link the EEG modules.
- Tone, plantar and fatigability trainers from short video clips (Utah, CC BY-NC-SA, linked not re-hosted).

### Carried over
- **Owner's read-through.** Every module was drafted from the outline by a writer working from the books; the owner should read each one for clinical judgement, especially Modules 11 and 12 (differentials and cases).
- **Link Utah videos per element.** Sections on reflexes, tone and gait could link the specific Utah video for each element (CC BY-NC-SA; link, do not re-host).
- **Draw-it builder.** A layer-by-layer cord and brainstem drawing (Fisch's method) that the learner builds step by step, then places lesions on.
- **Plexus explorer.** A clickable brachial plexus (roots → trunks → cords → nerves) to extend the root-vs-nerve widget beyond the two trunk lesions it models.
- **Dermatome accuracy.** The cord simulator's body map uses simplified dermatomes (one region per segment group); a finer map would show the saddle and the C4/T2 jump better.
- **Pediatric numbers.** Facts with ages beyond the Utah site (e.g. primitive reflex persistence thresholds by study) need a full-text source before they go in; Zafeiriou 2004 is registered but only its abstract has been read.
- **Cross-link the sibling sites.** Module 3's floppy infant ↔ the neurogenetics portal's hypotonia figure; Module 4 ↔ `/neuromuscular` gene pages.


## History

### 2026-10-01 · v4: proofread, American spelling, fact-check
- **Target:** owner asked for prose that does not name the books directly, reads easily, uses American spelling, and is checked for accuracy.
- **Change:** American spelling throughout (code identifiers untouched); sources no longer named in running prose (199 → 0); long sentences and average sentence length reduced (average 24.8 → 19.4 words); every cited page re-read against the extracted texts. About 60 corrections, among them fasciculations versus fibrillations, the double crossing of cerebellar outflow, the facial fascicle in the pons, the sixth-nerve fascicle in crossed pontine palsy, pontine pupils in coma, bladder timing after acute cord injury, the still newborn arm, botulism immune globulin and the aminoglycoside warning, and several overstatements of what a page says.
- **Outcome:** see commit on `main`.
- **Follow-ups:** the owner decisions and ideas under Queued.

### 2026-10-01 · v3: voice rewrite
- **Target:** the owner found the prose read as machine-written (clipped aphorisms, "not X but Y", colon reveals, paragraph-ending zingers) and asked for a natural, narrative register in the manner of Gladwell or Lehrer.
- **Change:** `docs/localization/style-guide.md`; `scripts/style-loc.mjs` counts the habits; `scripts/check-preserve-loc.mjs` guards citations, links, figures and answer keys against git HEAD. All twelve modules, the six cases, the openers, widget copy, track blurbs and the section home rewritten. Totals before → after: short sentences 10% → 2%, antitheses 28 → 0, colon reveals 213 → 7, stock phrases 12 → 0, paragraph-ending zingers 49 → 1.
- **Outcome:** see commit on `main`. No citation, figure placement or answer key changed.
- **Follow-ups:** owner read-through for voice; hypothetical scenes should read as hypothetical.

### 2026-10-01 · v2: Neuro-Logic integration, Bayes, history and parable openers
- **Target:** integrate the eleven recommendations in `neuro-logic-review.md`, add a Bayesian thread (localization as the prior for imaging, EEG and genetic results), and open every module with a parable, a historical note, or both.
- **Change:**
  - Engine: module `opener` (parable / history / source) and `core` flag; `> ` callout blocks in the shared renderer; core path on the section home. Validator requires an opener and a source for any history.
  - Models (48 new tests, 143 total): `voices.ts`, `bayes.ts`, `ladder.ts`, `maps.ts`, `aphasia.ts`, `vestibular.ts`; herniation stages and episodic mimics in `data.ts`.
  - Widgets: lesion-voices, pretest, lesion-ladder, map-sort, aphasia-switches, vertigo-sorter; coma-levels plays a descending herniation; where-when lists episodic mimics.
  - Content: 10 new sections (m01 ×2, m02, m05, m07, m08, m09, m10, m11 ×2), case 6 (raised pressure, the sixth nerve as messenger), bedside-trick callouts, 10 new quiz items. New verified sources: li2021, borusiak2010, benbadis2003, richards2015, gill2005, george1992.
  - Corrections found on the way: Pearl's spiral-groove triceps claim (p. 83) contradicts the branch order (Brazis p. 45); C7 sensory loss is the third and fourth digits (Brazis p. 93).
- **Outcome:** see commit on `main`.
- **Follow-ups:** owner's read-through of the new sections; pediatric brain-death and functional-gait sources if those topics are added.

### 2026-10-01 · v1: twelve modules, twelve interactive figures, shared module engine
- **Target:** build the section the site is named for, structured like the EEG curriculum but more interactive, from the owner's seven source files.
- **Change:**
  - Module engine made generic (`components/curriculum/`, `src/curriculum/progress.ts`) so EEG and localization share module pages, quizzes, review and progress; EEG behaviour unchanged (regression-tested).
  - Pure models in `src/loc/models/` (localizer, cord, brainstem rule of 4, visual pathway, root/plexus/nerve, reflex timeline, coma levels, gait, exam order, where × when), 95 tests in `scripts/test-loc-models.ts`.
  - Twelve widgets in `components/loc/` plus a case player; twelve module JSONs; five cases in `src/loc/cases.ts`; validator `scripts/validate-loc.mjs`; sources registry with every PMID checked and each entry's `supports` note.
  - Section home with a playable localizer; landing card marked live.
- **Outcome:** see commit on `main`.
- **Follow-ups:** the Queued list above.
