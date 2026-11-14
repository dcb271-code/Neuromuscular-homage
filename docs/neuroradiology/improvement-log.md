# Neuroradiology improvement log

## Queued

- Module 1, head ultrasound: waits on the owner's slides. CC BY figures available (Insights into Imaging 2025 cranial ultrasound pair, J Ultrasound 2024).
- Modules 3 to 6: MRI reading, MRI pathology, vascular imaging, fetal MRI (dHCP fetal atlas, CC0, 21 to 36 weeks, to join the existing atlas).
- Real scrollable CT cases (CQ500, CC BY-NC-SA, adult) need the owner's go-ahead to download the dataset.
- Open points from the CT accuracy review: PECARN risk figures (>4% and about 0.9%) come from the paper's Figure 3 as restated by MDCalc, since the Lancet full text was not read. Acute blood is given as 50 to 70 HU (Mutch 2016), while older teaching gives 60 to 80 HU. Weaker sources kept: Honjo 2026 (42 scans), Wang 2021 (window values only), Feiz-Erfan 2026, Moseley 1979, Lev 1999 (adults).

## History

### 2026-11-14 · v1: curriculum shell and Module 2, CT of the head in children
- **Target:** owner asked for the CT head module and cross-links between sections.
- **Change:** `/neuroradiology/` is now the curriculum home on the shared engine (kind `nrad`), with the MRI atlas moved to `/neuroradiology/atlas/` and deep links by age and structure. Module 2 has seven sections (Hounsfield units, windows, a systematic read with pediatric normals, hemorrhage by shape, herniation and hydrocephalus, abusive head trauma, when to scan with PECARN and radiation risk), a CT window lab and a hemorrhage sorter (both schematic). An independent accuracy review corrected the PECARN risk groups, replaced three weak sources, and sharpened claims on clot density, mixed-density subdurals, the falx sign in abuse, choroid plexus calcification and periventricular lucency. 49 sources, PMIDs verified. Modules 1 and 3 to 6 are listed as planned.
- **Outcome:** see commit on `main`.
