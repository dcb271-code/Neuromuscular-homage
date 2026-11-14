# Neuroradiology improvement log

## Queued

- Module 1, head ultrasound: waits on the owner's slides. CC BY figures available (Insights into Imaging 2025 cranial ultrasound pair, J Ultrasound 2024).
- Modules 3 to 6: MRI reading, MRI pathology, vascular imaging, fetal MRI (dHCP fetal atlas, CC0, 21 to 36 weeks, to join the existing atlas).
- Real scrollable CT cases: single CQ500 slices are now in Module 2 (see v2 below). A scrollable stack through one scan is still open.
- CQ500 terms: the dataset is CC BY-NC-SA 4.0, and its page also carries an end user license agreement whose clause on copying and public display without Qure's written consent is ambiguous. Owner to decide whether to write to Qure.ai. All CQ500 assets sit in `public/nrad/ct/`.
- Real images not yet found under an open license: a vertex epidural, and a pediatric figure of physiologic calcification. No drawing stands in for them.
- Quiz stems and images come from different patients (for example a 4-month-old stem over a 3-year-old's scan). The page says so under each image. Better-matched open-access panels would remove the mismatch.
- Open points from the CT accuracy review: PECARN risk figures (>4% and about 0.9%) come from the paper's Figure 3 as restated by MDCalc, since the Lancet full text was not read. Acute blood is given as 50 to 70 HU (Mutch 2016), while older teaching gives 60 to 80 HU. Weaker sources kept: Honjo 2026 (42 scans), Wang 2021 (window values only), Feiz-Erfan 2026, Moseley 1979, Lev 1999 (adults).

## History

### 2026-11-14 · v1: curriculum shell and Module 2, CT of the head in children
- **Target:** owner asked for the CT head module and cross-links between sections.
- **Change:** `/neuroradiology/` is now the curriculum home on the shared engine (kind `nrad`), with the MRI atlas moved to `/neuroradiology/atlas/` and deep links by age and structure. Module 2 has seven sections (Hounsfield units, windows, a systematic read with pediatric normals, hemorrhage by shape, herniation and hydrocephalus, abusive head trauma, when to scan with PECARN and radiation risk), a CT window lab and a hemorrhage sorter (both schematic). An independent accuracy review corrected the PECARN risk groups, replaced three weak sources, and sharpened claims on clot density, mixed-density subdurals, the falx sign in abuse, choroid plexus calcification and periventricular lucency. 49 sources, PMIDs verified. Modules 1 and 3 to 6 are listed as planned.
- **Outcome:** see commit on `main`.

### 2026-11-14 · v2: real CT images replace the drawings in Module 2
- **Target:** owner asked for real head CT images in place of the schematic drawings, with any remaining drawing made to a high standard.
- **Change:** every CT picture in Module 2 is now a real image. 14 slices from 8 scans of the CQ500 dataset (Chilamkurthy 2018, CC BY-NC-SA 4.0) carry numbered pins, and the slices with a hematoma carry a threshold-traced outline around the blood. 12 panels from open-access pediatric articles (CC BY 4.0) are cropped and shown as printed. The window lab now draws two real slices from their stored Hounsfield values, with a probe that reads a small box mean and landmark buttons with measured values. The hemorrhage sorter shows a real slice for each compartment and six real quiz images, with a bone-window view of the same patient on the epidural case. Sections 3 to 6 gained image strips (normal anatomy at two levels, a normal 14-month-old, benign enlargement of the subarachnoid spaces, sutures on 3D CT, a fracture beside an accessory suture, cisternal subarachnoid blood, midline shift with a measurement, sulcal effacement, cisterns before and after swelling, hydrocephalus, mixed-density subdurals, diffuse hypoattenuation). No module prose was removed. Text edits: quiz stem "drawn" became "shown", the intraparenchymal stem now says left-sided weakness to match the right-sided hematoma on the image, the intraventricular explanation names the lateral and third ventricles, and the widget subtitles, footnotes, curriculum footer and home line now describe real images. New: `public/nrad/ATTRIBUTIONS.md`, a CT section on the credits page, `src/nrad/ctMarks.ts`, `src/nrad/ctFigures.ts`, `src/figureOverlay.ts`, `components/curriculum/AnnotatedImage.tsx`. The old schematic head drawing in the sorter is gone. `src/nrad/ctPhantom.ts` stays for the window arithmetic and its tests.
- **Limits stated on the page:** CQ500 files carry no ages and most of its patients are adults, so no CQ500 slice is called a child, and its gray and white matter measure several HU above the pediatric values in the text. No CT was mirrored or rotated.
- **Checks:** `scripts/test-nrad-models.ts` 123 passed (files exist and match their sizes, marks inside images, measured HU within range at each landmark, every image credited and listed in the attribution file). Validator, type check and build pass. Viewed in the browser at phone and desktop widths.
- **Outcome:** see commit on `main`.
