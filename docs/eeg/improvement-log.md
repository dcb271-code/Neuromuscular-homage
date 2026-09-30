# EEG curriculum: improvement log

> One scoped change per entry. Each records Target / Change / Outcome (commit) / Follow-ups. Append-only under History; keep Queued short and concrete.

## Queued

- Add the owner's own slide decks and PDFs once uploaded (see `resources-to-integrate.md`): extract figures only where the licence allows, otherwise link.
- Filter and sampling lab (Module 1): apply low-pass, high-pass and notch to a synthetic spike, muscle burst and alpha, and show what each does to morphology. Pure model + tests, like the montage lab.
- Pattern gallery in flashcard style (front: pattern description or sketch; back: name, criteria, significance). Needs openly licensed images or synthetic renderings.
- Waveform viewer with real tracings: blocked until de-identified, openly licensed records exist. Log provenance the way the atlas does in `public/atlas/ATTRIBUTION.md`.
- Baseline (pre) and comprehensive (post) assessments, mirroring the neurogenetics curriculum's 25-question baseline with no feedback and 50-question exam with explanations.
- Cross-link the sibling sites where content overlaps: neurogenetics `epilepsy` module ↔ Module 9 (syndrome EEG) and Module 7 (burst suppression); restate no number that does not match the sibling exactly.
- Second-pass accuracy audit: read every section against `outline.md` and cut any number the outline does not carry.

## History

### 2026-09-30 · v1: twelve modules, module pages, review, montage lab
- **Target:** stand up the EEG section from the owner's twelve-module outline, parallel in didactic structure to the Neurogenetics Curriculum.
- **Change:** content model (`src/eeg/types.ts`), citation registry with every PMID checked against PubMed esummary (`src/eeg/sources.ts`), validator (`scripts/validate-eeg.mjs`), 12 module JSONs, section home with module map and progress, module page (sections → key points → inline question → quiz → sign-off → resources → sources), review page with flashcards, per-browser progress, and the montage lab computed figure for Module 1.
- **Outcome:** see commit on `main`.
- **Follow-ups:** Queued items above; the coverage checklist's ⚠️ rows.
