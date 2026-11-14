# EEG curriculum: improvement log

> One scoped change per entry. Each records Target / Change / Outcome (commit) / Follow-ups. Append-only under History; keep Queued short and concrete.

## Queued

- **Ideas from EEGSimLab (eegsimlab.org, Wayne State University, reviewed 2026-11-14).** Its code, tracings and text are "All rights reserved", so nothing is copied. These are independent reimplementations of general functionality, cited to the public literature:
  1. Spike-criteria tapper for Module 8: a synthetic discharge where the learner marks which of the six IFCN criteria it meets, with each criterion drawn on the trace (Kural 2020). Pure model plus widget, like the montage lab. Medium.
  2. Synthetic multichannel trace renderer: one component that draws a full bipolar page from a model, with adjustable sensitivity (pediatric and neonatal settings, not the adult default) and time scale. Unblocks the filter lab, the waveform viewer, and Module 9 morphologies until real tracings are cleared. Large.
  3. Annotated step-through on our licensed gallery figures: Next/Back captions with highlighted channels or time windows. Medium.
  4. Calipers on tracings to read Hz and ms ("3 Hz or 2.5 Hz?"). Small to medium, after item 2.
  5. ACNS terms quick card for Module 11, in our own words from Hirsch 2021. Small.
- **Clinical checks raised by the 2026-11-14 prose pass (owner):** Module 7's definition of discontinuous ("attenuated below 25 to 50 µV") should be checked against Tsuchida 2013. Module 5 quiz 5's explanation that hyperventilation "either produces 2.5 to 4 Hz spike-wave or it does not" is circular. Modules 5, 6 and 8 used to attribute some claims to "the outline"; those claims now stand without a source and need a citation or a cut. Modules 5 and 7 still name Benbadis and Murray in prose. Module 11 has 6 quiz questions and most EEG explanations run 95 to 150 words; the Localization length budgets have not been applied to EEG.
- Add the owner's own slide decks and PDFs once uploaded (see `resources-to-integrate.md`): extract figures only where the licence allows, otherwise link.
- Filter and sampling lab (Module 1): apply low-pass, high-pass and notch to a synthetic spike, muscle burst and alpha, and show what each does to morphology. Pure model + tests, like the montage lab.
- Tracings for Module 9 (hypsarrhythmia, 3 Hz spike-wave, slow spike-wave, centrotemporal spikes): the AES atlas versions are Mayo-copyrighted and the Shoup deck has none. Candidates: the DeStefano deck (permission given; identifiers to crop), or Learning EEG by link.
- Waveform viewer with real tracings: needs de-identified records with a licence. The AES figures are static images, not raw EEG.
- Baseline (pre) and comprehensive (post) assessments, mirroring the neurogenetics curriculum's 25-question baseline with no feedback and 50-question exam with explanations.
- Cross-link the sibling sites where content overlaps: neurogenetics `epilepsy` module ↔ Module 9 (syndrome EEG) and Module 7 (burst suppression); restate no number that does not match the sibling exactly.
- Second-pass accuracy audit: read every section against `outline.md` and cut any number the outline does not carry.

## History

### 2026-11-14 · Interactive features: trace lab, spike criteria, ACNS card, guided tours
- **Target:** owner asked for functionality akin to EEGSimLab. Built independently from the literature; EEGSimLab's code and content are all rights reserved and were not used.
- **Change:**
  - Trace lab (Module 1, filters section) and pattern viewer (Module 9, childhood onset): synthetic 18-channel bipolar and average-reference pages, presets (normal child, 3 Hz spike-wave, slow spike-wave, centrotemporal spikes, hypsarrhythmia-like), sensitivity, LFF, HFF, 60 Hz notch and line noise, calipers for ms, Hz and peak-to-peak µV. `src/eeg/synth.ts`, `components/eeg/TraceView.tsx`, `TraceLab.tsx`, 27 tests.
  - Spike-criteria trainer (Module 5, IFCN section): 12 synthetic cases scored on the six IFCN criteria with annotated feedback (Kane 2017, Kural 2020). `src/eeg/spike-model.ts`, `SpikeCriteria.tsx`, 194 tests.
  - ACNS 2021 quick card and name builder (Module 11, continuum section), checked against the full 2021 paper. `src/eeg/acns-model.ts`, `AcnsCard.tsx`, 67 tests.
  - Guided step-throughs on 7 licensed gallery figures (pattern gallery, "Guided" button). `src/eeg/annotations.json`, `FigureTour.tsx`, 262 tests.
- **Owner review needed:**
  - Module 11 text is less complete than the 2021 paper, and the card follows the paper: +FR and +FS plus modifiers and no plus modifiers on SW; "spike-and-wave or sharp-and-wave"; continuum criterion 3 covers any lateralized RDA (LRDA, BIRDA, UIRDA, MfRDA, not GRDA) for at least 10 s; BIRDs need at least 6 waves and evolution or matching morphology and location for a definite BIRD; evolution's same-direction and 5-minute rules; duration, amplitude and sharpness categories. Seizure frequency criterion is more than 2.5 Hz, so exactly 2.5 Hz stays on the continuum.
  - Spike trainer scoring of variants: wicket-like and POSTS-like cases credited with the shape criterion and a field; vertex and POSTS-like cases not credited with different duration; electrode pop scores 2; background disruption drawn as a post-discharge amplitude drop. Glossary durations (spike 20 to under 70 ms, sharp 70 to 200 ms) are not in the module text.
  - Trace lab amplitudes and the 3 Hz burst slowing from 3.4 to 2.9 Hz with a frontal maximum are modeling choices, not sourced values.
  - Tour captions marked for checking: positive polarity of 14 and 6 Hz spikes (from the module, not confirmed on the tracing), pulse and pop confinement read visually, "little" left-sided activity in the LPD figure, generalized simplified for GPDs, neonatal asynchrony left/right readings, burst suppression interval measured at about 7 s.
- **Accuracy review (owner asked for best-supported decisions, lenient toward benign calls):** every feature re-checked against primary sources by an independent reviewer.
  - Spike trainer: variants rescored to 1 or 2 criteria (wicket, small sharp spike, POSTS monophasic; vertex wave blunt; glossary excludes vertex transients and POSTS from "sharp wave"). Score of 4 now advises checking for a variant and not calling it if doubt remains, with Kural 2020 values at 4 (sensitivity 96.3%, specificity 84.8%). Module 5 now calls Kural 2020 a blinded validation (it was retrospective, not prospective). New source krauss2005.
  - ACNS card: all cutoffs already matched the 2021 paper; added electroclinical seizure and status, the 5-minute tonic-clonic rule, fuller PD, RDA and SW definitions. Module 11 and Module 10 gained the paper's missing details in place (plus modifiers, BIRDs, continuum criterion 3, evolution and fluctuation), nothing deleted. Module 11 sections 2 and 4 and Module 10 section 2 now run 408 to 473 words.
  - Synthetic tracings: normal posterior rhythm raised to about 100 µV at O1; absence burst 7 s, slowing 3.5 to 2.7 Hz; centrotemporal spike 220 µV; hypsarrhythmia page meets BASED voltage criteria (Mytinger 2021). Pattern viewer low-frequency filter lowered from 1 to 0.5 Hz (Kuratani 2016).
  - Gallery tours: all regions accurate; 22 of 31 captions tightened with hedges, ACNS definitions, and measurements stated against each figure's scale bar.
- **Outcome:** see commit on `main`.
### 2026-11-14 · Plain-language pass on all twelve modules
- **Target:** owner asked for a light-to-medium humanizer pass (strip AI tells, simplify sentence structure without flattening the voice).
- **Change:** every module's prose, key points, questions and explanations. Totals before → after: antitheses 27 → 2, colon reveals 96 → 0, sentences over 38 words 50 → 5, semicolons 3.6 → 0.1 per 1000 words, average sentence 22.3 → 18.7 words. British spellings made American. Plainer headings where the old ones were riddles or parallel pairs. Fixed: the stray claim that spindle asynchrony is expected only "in the first year" (the cited range is 18 to 24 months); "and the reverse" in the neonatal status comparison, which was false; "often" vs "may" for focal aware seizures without a scalp correlate. `style-loc.mjs` and `check-preserve-loc.mjs` now take `MODULES=eeg`.
- **Outcome:** see commit on `main`.
### 2026-09-30 · Twelve tracings from Jaime Shoup's non-epileptiform lecture
- **Target:** give Module 8 (slowing, rhythmic deltas) and Module 11 (ICU backgrounds) real tracings.
- **Change:** owner confirmed the deck's recordings may be used. `scripts/extract_shoup_figures.py` takes 12 slides (excluding three Mayo-permission tracings, a scanned journal figure and an unlabelled slide), writes `shoup-sNN.jpg` and merges them into the registry with the credit "used with permission"; `scripts/build_eeg_attributions.py` now renders `ATTRIBUTIONS.md` for both sources. Placed in Module 8 sections 4 and 5 and Module 11 section 1.
- **Outcome:** see commit on `main`.
- **Follow-ups:** Module 9 still has no tracings.

### 2026-09-30 · Licensed tracings from the AES atlas, pattern gallery
- **Target:** put real tracings beside the prose without breaching anyone's copyright.
- **Change:** `scripts/extract_aes_figures.py` pulls the figures of St. Louis & Frey (AES 2016, CC BY-NC-SA 4.0) from the owner's PDF, skips every figure with a separate copyright notice (the Mayo Foundation tracings, 48 of 93), and writes `public/eeg/figures/` (45 JPEGs, 17 MB), `src/eeg/figures.json` and `public/eeg/ATTRIBUTIONS.md`. Sections gained a `figures` field; 44 figures are placed across Modules 1, 3, 4, 5, 6, 7, 10 and 11 with a tap-to-enlarge lightbox. New `/eeg/gallery` page browses all of them and has a name-the-pattern quiz mode. The owner's Drive folder was inventoried in `resources-to-integrate.md`.
- **Outcome:** see commit on `main`.
- **Follow-ups:** Modules 8 and 9 still have no tracings (Queued); Destefano's seizure-vs-mimic framework (Young, Chong & Hirsch 2005, Salzburg) could extend Module 10 once its sources are verified.

### 2026-09-30 · v1: twelve modules, module pages, review, montage lab
- **Target:** stand up the EEG section from the owner's twelve-module outline, parallel in didactic structure to the Neurogenetics Curriculum.
- **Change:** content model (`src/eeg/types.ts`), citation registry with every PMID checked against PubMed esummary (`src/eeg/sources.ts`), validator (`scripts/validate-eeg.mjs`), 12 module JSONs, section home with module map and progress, module page (sections → key points → inline question → quiz → sign-off → resources → sources), review page with flashcards, per-browser progress, and the montage lab computed figure for Module 1.
- **Outcome:** see commit on `main`.
- **Follow-ups:** Queued items above; the coverage checklist's ⚠️ rows.
