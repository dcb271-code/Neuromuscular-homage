# Localization curriculum: improvement log

> One scoped change per entry: Target / Change / Outcome (commit) / Follow-ups. Append-only under History.

## Queued

- **Owner's read-through.** Every module was drafted from the outline by a writer working from the books; the owner should read each one for clinical judgement, especially Modules 11 and 12 (differentials and cases).
- **Link Utah videos per element.** Sections on reflexes, tone and gait could link the specific Utah video for each element (CC BY-NC-SA; link, do not re-host).
- **Draw-it builder.** A layer-by-layer cord and brainstem drawing (Fisch's method) that the learner builds step by step, then places lesions on.
- **Plexus explorer.** A clickable brachial plexus (roots → trunks → cords → nerves) to extend the root-vs-nerve widget beyond the two trunk lesions it models.
- **Dermatome accuracy.** The cord simulator's body map uses simplified dermatomes (one region per segment group); a finer map would show the saddle and the C4/T2 jump better.
- **Pediatric numbers.** Facts with ages beyond the Utah site (e.g. primitive reflex persistence thresholds by study) need a full-text source before they go in; Zafeiriou 2004 is registered but only its abstract has been read.
- **Cross-link the sibling sites.** Module 3's floppy infant ↔ the neurogenetics portal's hypotonia figure; Module 4 ↔ `/neuromuscular` gene pages.


## History

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
