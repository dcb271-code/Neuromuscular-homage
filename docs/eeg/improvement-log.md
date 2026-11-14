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
