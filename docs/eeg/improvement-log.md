# EEG curriculum: improvement log

> One scoped change per entry. Each records Target / Change / Outcome (commit) / Follow-ups. Append-only under History; keep Queued short and concrete.

## Queued

- Add the owner's own slide decks and PDFs once uploaded (see `resources-to-integrate.md`): extract figures only where the licence allows, otherwise link.
- Filter and sampling lab (Module 1): apply low-pass, high-pass and notch to a synthetic spike, muscle burst and alpha, and show what each does to morphology. Pure model + tests, like the montage lab.
- Tracings for Module 9 (hypsarrhythmia, 3 Hz spike-wave, slow spike-wave, centrotemporal spikes): the AES atlas versions are Mayo-copyrighted and the Shoup deck has none. Candidates: the DeStefano deck (permission given; identifiers to crop), or Learning EEG by link.
- Waveform viewer with real tracings: needs de-identified records with a licence. The AES figures are static images, not raw EEG.
- Baseline (pre) and comprehensive (post) assessments, mirroring the neurogenetics curriculum's 25-question baseline with no feedback and 50-question exam with explanations.
- Cross-link the sibling sites where content overlaps: neurogenetics `epilepsy` module ↔ Module 9 (syndrome EEG) and Module 7 (burst suppression); restate no number that does not match the sibling exactly.
- Second-pass accuracy audit: read every section against `outline.md` and cut any number the outline does not carry.

## History

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
