# Resources still to integrate

Owner's Drive folder (private): https://drive.google.com/drive/folders/1n73mucIjqC0Ol-jsoLhf2UN_Hg-OTDbV
Local copies go in `docs/eeg/sources/` (gitignored). Inventory taken 2026-09-30 from the Drive listing and the text of the two decks; the PDFs have not been opened yet.

| File | Size | Author / owner (as stated in the file) | What it is | Licence status | Suitable for | Status |
|---|---|---|---|---|---|---|
| Nonepileptiform Abn.pptx | 6.8 MB | Jaime Shoup, MD, University of Louisville | 27-slide lecture: focal and generalized slowing, FIRDA/OIRDA/TIRDA, attenuation, RAWOD, burst suppression, excessive beta, coma patterns (alpha, theta, spindle), triphasic waves. Cites Learning EEG, NBK390357, Schneider & Jordan 2005, Andraus 2011. | Colleague's deck; figure sources not stated | Module 8 (structure and topics), Module 11 (coma patterns) | text read; images not seen |
| EEG Board Review.pptx | 23 MB | Chris Barton, MD | RITE-style question deck: sleep staging, benign variants (14&6, POSTS), artifacts, asymmetry/subdural, beta with benzodiazepines, temporal sharp waves, SeLEAS, SeLECTS, LPDs, JME, NMDA (extreme delta brush), absence/ethosuximide, triphasic waves, NCSE, HSV, spasms/ACTH, post-arrest prognosis, Ohtahara, LGS, Rasmussen, LKS. | Colleague's deck; question stems and tracings not stated as original | Quiz-topic checklist for Modules 3, 5, 8, 9, 10, 11 (rewrite, do not copy stems) | text read; images not seen |
| EEG Primer.pdf | 71 MB | unknown until opened | | | | not opened |
| Primer EEG - Miniatlas.pdf | 33 MB | unknown until opened | | | | not opened |
| EEG atlas AES.pdf | 34 MB | probably St. Louis & Frey, AES 2016 (free on NCBI Bookshelf, NBK390356) | | see licence note below | Modules 4–6 already link to it | not opened |
| EEG_Seizure or No Seizure_Destefano.pdf | 62 MB | Destefano (lecture) | | Colleague's deck | Modules 3, 10 (artifact vs seizure) | not opened |
| Untitled.md | 28 KB | owner | Earlier export of the curriculum outline (some numbers differ from the live doc, e.g. "55%" vs "93%" set no minimum reads); the live doc is authoritative | owner's | superseded by `outline.md` | done |
| eeg-companion-brief.md, BRIEF-learning-curriculum-for-eeg-site.md | | owner | Design briefs | owner's | in `briefs/` | done |

## What the decks contribute even without their images

- **Non-epileptiform deck:** a cleaner taxonomy for Module 8 (slowing → attenuation → suppression → coma patterns → triphasic waves), and two primary sources worth adding to `sources.ts` once verified: Schneider & Jordan 2005 (RAWOD, PMID 15989073) and Andraus & Alves-Leon 2011 (overview, PMID 22042190). Its numbers (tumour growth rate vs delta/theta, triphasic-wave amplitudes) are not in the outline and would need their own primary sources before use.
- **Board review deck:** a list of board-favourite patterns to make sure the quizzes cover: 14&6 Hz positive bursts, POSTS, lateral eye movement at F7/F8, ECG artifact in low-amplitude records, hemispheric attenuation over a subdural, benzodiazepine beta, T4-T2 maximum, SeLEAS (ictal syncope), LPDs and HSV, extreme delta brush, triphasic waves, hypsarrhythmia, burst suppression after arrest, Ohtahara, LGS tonic seizures, Rasmussen, LKS. Several are adult items outside the outline's scope.

## Rules for integrating them

1. **Licence first.** Only the owner's own material, or open-licence material, may have figures copied into `public/`. A colleague's deck is linked or described, never copied, unless the colleague gives written permission and the tracings are theirs to give. Tracings lifted from textbooks or websites inside a deck stay out regardless.
2. **Facts still need a source.** A number taken from a slide is cited to the slide's own source, not to the slide. If the slide does not give one, find it or leave the number out.
3. **Question stems are not copied.** A colleague's quiz item may suggest a topic; the vignette on the site is written fresh.
4. **Attribution log.** Any image that ends up in `public/eeg/` gets a row in `public/eeg/ATTRIBUTIONS.md` with author, licence and the change made, the same way `public/atlas/ATTRIBUTION.md` works for the MRI atlas.
5. **De-identification.** Every patient tracing is cropped of names, dates and record numbers before it goes online, and each one is flagged for the owner to confirm.
6. **Coverage.** After integrating, update `curriculum-coverage.md` (✅ / ⚠️ / ❌) and add a History entry to `improvement-log.md`.

## Licence note on the AES atlas

See the check recorded in the improvement log for what NCBI Bookshelf states. If the book is under a Creative Commons licence that permits reuse, its tracings are the best candidates for a first pattern gallery, credited per figure.
