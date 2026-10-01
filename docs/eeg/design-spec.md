# EEG curriculum: design spec

_Written 2026-09-30. Source of truth for the EEG section of Where Before What (`/eeg`). The content outline is Dylan's "Pediatric EEG Reading Curriculum" doc (claude.ai/artifact/SUCMBLecNSAETwu7t2ZUGr); the didactic architecture follows the Neurogenetics Curriculum brief (`docs/eeg/briefs/`)._

## Purpose

Twelve self-paced modules that take a child neurology resident from electrodes and montages to reading a neonatal or PICU record and writing the report. The site teaches; real-record reading with faculty (Module 12) certifies. Every module links out to the best free material rather than copying it, because none of the core sites grants a reuse licence.

## Identity

| | |
|---|---|
| Route | `/eeg` (section home), `/eeg/<module-id>` (module), `/eeg/review` (flagged key points + missed questions) |
| Data | one JSON per module in `src/eeg/modules/`, registered in `src/eeg/modules/index.ts`; schema in `src/eeg/types.ts` |
| Citations | `src/eeg/sources.ts`, every PMID verified against PubMed before it ships |
| Validator | `node scripts/validate-eeg.mjs` must pass before commit |
| Progress | per-browser `localStorage` (sections read, quiz scores, flagged key points, missed questions). No accounts. |

## Module ids and tracks

| # | id | Track | Accent |
|---|---|---|---|
| 1 | `m01-signals` | foundation | `#2563eb` |
| 2 | `m02-read-and-report` | foundation | `#2563eb` |
| 3 | `m03-artifacts` | foundation | `#2563eb` |
| 4 | `m04-normal-by-age` | foundation | `#2563eb` |
| 5 | `m05-variants` | foundation | `#2563eb` |
| 6 | `m06-neonatal-maturation` | neonatal | `#0d9488` |
| 7 | `m07-neonatal-abnormal` | neonatal | `#0d9488` |
| 8 | `m08-interictal` | abnormal | `#7c3aed` |
| 9 | `m09-syndromes` | abnormal | `#7c3aed` |
| 10 | `m10-seizures-status` | abnormal | `#7c3aed` |
| 11 | `m11-critical-care` | icu | `#4f46e5` |
| 12 | `m12-supervised-reading` | longitudinal | `#475569` |

Modules 1 to 5 in order; the neonatal pair (6, 7) and the abnormal sequence (8 to 10) in either order; both lead to 11. Module 12 runs alongside everything.

Tags: `EEG Fundamentals` (1–3), `Normal & Variants` (4–5), `Neonatal & ICU` (6, 7, 11), `Abnormal & Ictal` (8–10), `Clinical Decision-Making` (2, 9, 10, 12; add to others where the module's decisions warrant it).

## Pedagogical spine (per module)

```
why (one line)  →  objectives  →  sections (4–6)  →  quiz (5–7)  →  sign-off  →  resources  →  sources
                                    ├─ optional computed figure
                                    ├─ prose 150–450 words: mechanism → what it changes at the bedside
                                    ├─ Key Points (3–5, flaggable)
                                    └─ 1 inline question (decision, not recall)
```

Each section teaches **beyond** its bullets: the physiology that generates a pattern, then the decision it changes (treat or not, image, monitor, reassure, repeat the study). A section that only restates the outline's bullets is incomplete. Each module ends at the sign-off from the outline, verbatim or lightly edited.

## Content rules (non-negotiable)

1. **Numbers come from the outline or a verified source.** Every specific number, threshold, range or percentage carries an inline citation in the form `[Kane 2017](https://pubmed.ncbi.nlm.nih.gov/30214992/)`, using only PMIDs present in `src/eeg/sources.ts`. Sources without a PMID are cited by name in the text ("Current Practice chapter", "St. Louis 2016") and, where the outline gives a URL, linked. A number that cannot be sourced is cut, not hedged.
2. **No invented facts.** General electrophysiology and standard definitions may be explained from first principles; specific claims (ages, percentages, criteria, thresholds) must appear in the outline. If the outline says sources disagree, say so.
3. **The same number must match wherever it appears.** Neonatal seizure ≥10 s, neonatal status ≥50% of an hour; pediatric/adult electrographic status ≥10 min or ≥20% of an hour; IFCN 4 of 6 (Kane 2017), 5 of 6 best threshold (Kural 2020). Check cross-module numbers against the outline before writing them.
4. **Questions test decisions.** Stems are vignettes ("What do you do next?", "What must the report say?", "Does this meet…?"). Four options; the correct index is spread across A–D within a module (the validator rejects "always B"). Every explanation says why the right answer is right and why each tempting distractor is wrong (≥120 characters; usually 400–800). Never refer to an option by its letter in an explanation ("option B"); describe it ("reporting the transients") so the key can be shuffled.
5. **Vocabulary follows the standards:** ACNS 2021 critical care terminology, ACNS neonatal terminology (Tsuchida 2013), IFCN glossary (Kane 2017), ILAE 2022 syndrome definitions.
6. **Language.** Attending-at-the-bedside voice: direct, explanatory, willing to say "do not call it". Person-respecting descriptors. Uncertainty stated plainly ("no source gave firm age limits"). Superlatives tempered. No em dashes; use commas, colons or a new sentence.
7. **Markup subset** (rendered by `components/eeg/FormattedContent.tsx`): `**bold**` (2–6 per paragraph), a lone `**Bold**` line as a sub-heading, `*italic*`, `- ` bullets, `1. ` numbered lists, pipe tables (no wiki-links inside tables), `[[module-id|Display]]` internal links, `[Label](https://…)` external links. Blank line between paragraphs. Break walls of text with sub-headings, bullets and tables.
8. **Resources are links, not copies.** Use the outline's URLs verbatim. Note access requirements ("free account required").
9. **Not for clinical decision-making.** The module footer states it; content never prescribes.

## Assessment plan

- Inline question after every section (immediate feedback, explanation always shown).
- End-of-module quiz of 5–7 vignettes. Score saved; missed items feed `/eeg/review`.
- The outline's three practice questions per module are reused, expanded into 4-option items with teaching explanations, either inline or in the quiz.
- Sign-off is the faculty-verified competency from the outline; the site shows it as a checklist item the resident can tick, clearly labelled as self-reported.

## Out of scope (v1)

Accounts and cross-device progress; faculty dashboards; a waveform viewer with real tracings (no licensed tracings yet); slide decks; the ILAE VIREPA course; adult-only variants beyond what the outline lists.

## Done when

All 12 modules pass the validator; `/eeg`, every module page and `/eeg/review` render at 390 px with no horizontal scroll; `npm run build` passes; coverage checklist marks every outline topic ✅; improvement log has its first entry.
