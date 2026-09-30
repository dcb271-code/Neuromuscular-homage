# Resources still to integrate

Owner's Drive folder (private): https://drive.google.com/drive/folders/1n73mucIjqC0Ol-jsoLhf2UN_Hg-OTDbV
Local copies go in `docs/eeg/sources/` (gitignored). Inventory taken 2026-09-30 from the Drive listing and the text of the two decks; the PDFs have not been opened yet.

| File | Size | Author / owner (as stated in the file) | What it is | Licence status | Suitable for | Status |
|---|---|---|---|---|---|---|
| Nonepileptiform Abn.pptx | 6.8 MB | Jaime Shoup, MD, University of Louisville | 42 slides, 19 tracings: focal and generalized slowing (annotated mild/moderate/severe), FIRDA, OIRDA, TIRDA, RAWOD, burst suppression, excess beta, alpha/theta/spindle coma, triphasic waves. Cites Learning EEG, NBK390357, Schneider & Jordan 2005 (PMID 15989073, verified), Andraus 2011 (PMID 22042190, verified). | Owner has permission for the deck. One tracing is marked "By permission of Mayo Foundation, all rights reserved" (slide 35) and must not be copied; others' origin unstated | Module 8 (slowing, FIRDA/OIRDA/TIRDA) and Module 11 (attenuation, beta, burst suppression, alpha coma) | 12 tracings integrated with the owner's confirmation of permission; slide 35 (Mayo) excluded |
| EEG Board Review.pptx | 23 MB | Chris Barton, MD | 58 slides, 29 images. RITE-style questions on sleep staging, 14&6, POSTS, artifacts, subdural asymmetry, benzodiazepine beta, temporal sharp waves, SeLEAS, SeLECTS, LPDs, JME, extreme delta brush, absence, triphasic waves, NCSE, HSV, spasms, post-arrest prognosis, Ohtahara, LGS, Rasmussen, LKS. | Owner has permission for the deck, but most images are photographs and screenshots of AAN RITE examination pages ("©2016 American Academy of Neurology"), which the deck author cannot license | Topic checklist only; no images | images reviewed; not usable for figures |
| EEG Primer.pdf | 71 MB | Rowan AJ, Tolunsky E. Primer of EEG with a Mini-Atlas. Elsevier; 2003 (scan) | 108-page textbook | All rights reserved | Reading reference only; cite, do not copy | identified |
| Primer EEG - Miniatlas.pdf | 33 MB | Rowan & Tolunsky 2003, mini-atlas section (scan) | 75 pages of tracings | All rights reserved | Reading reference only | identified |
| EEG atlas AES.pdf | 34 MB | St. Louis & Frey, eds. AES 2016 | 96 pages, 93 figures | **CC BY-NC-SA 4.0** (book p. 3), except figures with a separate copyright line (Mayo Foundation) | 45 figures now on the site; see `public/eeg/ATTRIBUTIONS.md` | integrated |
| EEG_Seizure or No Seizure_Destefano.pdf | 62 MB | Sam DeStefano, MD, 2020 | 57 slides: paired "seizure?" tracings (chewing, movement, eye flutter, muscle, electrode, breach, rubbing) vs true seizures; Young criteria, Chong & Hirsch 2005, Salzburg criteria, ictal-interictal continuum (Haider/Hirsch 2018), Rodriguez Ruiz 2017 | Owner has permission for the decks; tracings are clinical-system screenshots that need identifiers cropped and their origin confirmed | Module 3 (artifact vs seizure pairs), Module 10/11 (criteria history) | text and pages reviewed; not yet used |
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
