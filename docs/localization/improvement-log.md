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

### 2026-10-01 · v1: twelve modules, twelve interactive figures, shared module engine
- **Target:** build the section the site is named for, structured like the EEG curriculum but more interactive, from the owner's seven source files.
- **Change:**
  - Module engine made generic (`components/curriculum/`, `src/curriculum/progress.ts`) so EEG and localization share module pages, quizzes, review and progress; EEG behaviour unchanged (regression-tested).
  - Pure models in `src/loc/models/` (localizer, cord, brainstem rule of 4, visual pathway, root/plexus/nerve, reflex timeline, coma levels, gait, exam order, where × when), 95 tests in `scripts/test-loc-models.ts`.
  - Twelve widgets in `components/loc/` plus a case player; twelve module JSONs; five cases in `src/loc/cases.ts`; validator `scripts/validate-loc.mjs`; sources registry with every PMID checked and each entry's `supports` note.
  - Section home with a playable localizer; landing card marked live.
- **Outcome:** see commit on `main`.
- **Follow-ups:** the Queued list above.
