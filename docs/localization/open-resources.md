# Open resources for anatomy, pathways and localization

_Researched 2026-10-02. Every license below was read at its source (GitHub LICENSE or release notes, the Commons API, or the publisher's terms page); the five Commons files marked ✓ and the MRC booklet were re-checked independently. Licenses change: re-check before shipping an asset._

## License rules for this site

- **Public domain, CC0, CC BY, MIT, OGL:** use and adapt freely with attribution.
- **CC BY-SA:** an adapted file stays CC BY-SA. Ship it as its own asset with a license line; the React code around it is unaffected.
- **CC BY-NC-SA:** allowed while the site is non-commercial. Adaptations stay BY-NC-SA. Cannot be merged into one image with BY-SA material.
- **All rights reserved, even if "open access":** link only.
- Keep a credits page listing every reused asset, its license and the required attribution text.

## Data, atlases and 3D models

| Resource | License | What it gives us | Notes |
|---|---|---|---|
| [AMU7T spinal cord atlas](https://github.com/spinalcordtoolbox/template-AMU7T) | MIT ✓ | 296 KB label volume: 30 cervical white-matter tracts and detailed gray matter (ventral horn columns, intermediate zone, Lissauer tract) | Adult, 7T, cervical only. Cite Le Troter et al., ISMRM 2023 |
| [PAM50 template](https://github.com/spinalcordtoolbox/PAM50) (Spinal Cord Toolbox) | No LICENSE file; SCT is LGPL-3.0; cite De Leener 2018, Lévy 2015 | Whole cord with vertebral levels, spinal segments C1-S5, rootlets, 36 tract maps | Ask NeuroPoly before redistributing. Adult |
| [HCP1065 tractography atlas](https://github.com/data-others/atlas/releases) (Yeh) | CC BY-SA 4.0 ✓ | 87 tract probability maps (1.8-3.4 MB): corticospinal, medial lemniscus, optic and acoustic radiations, arcuate, cerebellar peduncles, cranial nerves II, III, V, VII, VIII | NiiVue reads its `.tt.gz` streamlines. Young adult, MNI space |
| [Harvard Ascending Arousal Network atlas](https://www.nmr.mgh.harvard.edu/resources/aan-atlas) | CC0 | Brainstem arousal nuclei (locus coeruleus, raphe, PAG, parabrachial, VTA) | No cranial nerve nuclei |
| [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html) | CC BY 4.0 | Whole-body meshes incl. nerves | Credit: "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International" |
| [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) | Models CC BY-SA ✓ | Nervous system FBX (54 MB): plexuses, peripheral and cranial nerves | Decimate to glTF under 5 MB |
| [Clinical Neuroanatomy Atlas](https://github.com/aycibatuhan/nervous-system-atlas) | Code Apache-2.0, content CC BY-SA 4.0 | 3D MNI atlas with pathways, lesion mode, 60 vignettes | New single-author project; vet content; link or iframe |
| [UBC Neuroanatomy](https://neuroanatomy.ca) | CC BY-NC-SA 4.0 | Brainstem section micrographs, 3D models | Link or adapt non-commercially |
| SCT pediatric cord templates (ages 10-17) | No license | The only pediatric cord template | Ask NeuroPoly |
| **Not usable:** Brainstem Navigator (no redistribution), FSL JHU/XTRACT atlases (FSL non-commercial terms), TractSeg reference data (44 GB, CC BY-NC) | | | Link out only |

## Diagrams (vector first)

| File | License | Use |
|---|---|---|
| [Spinal cord tracts - English.svg](https://commons.wikimedia.org/wiki/File:Spinal_cord_tracts_-_English.svg) | CC BY-SA 3.0 ✓ | Relabelable cross-section (37 text labels); no lamination |
| [Dermatomes and cutaneous nerves - anterior.svg](https://commons.wikimedia.org/wiki/File:Dermatomes_and_cutaneous_nerves_-_anterior.svg) and posterior | Public domain ✓ | Dermatomes beside nerve fields: base for an interactive map tied to the root/nerve sorter |
| [Dermatomes labeled, male front 3d-shaded.svg](https://commons.wikimedia.org/wiki/File:Dermatomes_labeled,_male_front_3d-shaded.svg) series (Goran tek-en) | CC BY-SA 4.0 | Color-blind-friendly fills, one color per dermatome; map colors to roots |
| [Lower pons horizontal KB.svg](https://commons.wikimedia.org/wiki/File:Lower_pons_horizontal_KB.svg) | CC BY 3.0 ✓ | Detailed nuclei and tracts, 62 labels: base layer for the rule-of-four simulator |
| Dufendach brainstem and cord level series | CC BY-SA 3.0 | Consistent set of medulla, pons, midbrain and cord levels (one embeds a raster) |
| [Brachial plexus 2.svg](https://commons.wikimedia.org/wiki/File:Brachial_plexus_2.svg) | Public domain ✓ | Plexus explorer base (59 labels) |
| [Human visual pathway.svg](https://commons.wikimedia.org/wiki/File:Human_visual_pathway.svg) | CC BY-SA 4.0 ✓ | Pathway drawing beside the visual-field simulator |
| [Lumbar plexus.svg](https://commons.wikimedia.org/wiki/File:Lumbar_plexus.svg), [Sacral plexus schematic.svg](https://commons.wikimedia.org/wiki/File:Sacral_plexus_schematic.svg) | CC BY 3.0 | Leg nerve ladders |
| [Basal ganglia circuits.svg](https://commons.wikimedia.org/wiki/File:Basal_ganglia_circuits.svg) | CC BY-SA 3.0 | Direct and indirect pathways |
| [Gray696.svg](https://commons.wikimedia.org/wiki/File:Gray696.svg) and Gray's 1918 plates (669, 694, 701, 710, 722, 788, 790, 808, 818, 822, 828, 832) | Public domain | Tracing references: facial nerve plan (788) for the facial ladder, radial (818), sciatic (832). Tracing keeps our drawings unencumbered |
| DBCLS TogoTV neuro icons (corticospinal and other descending tracts, basal ganglia, cerebellum) | CC BY 4.0, credit "DBCLS TogoTV" | Clean flat icons; no text labels |
| OpenStax A&P **1st edition** figures on Commons (homunculus, spinal pathways, dermatomes, plexuses) | CC BY 3.0/4.0 | Static figures. The **2nd edition is now CC BY-NC-SA 4.0** |
| Servier Medical Art | CC BY 4.0 | Polished but simplified; PowerPoint kits export to SVG |
| Blausen gallery | CC BY 3.0 (2014) or CC BY-SA 4.0 (later) | High-resolution raster pathways |
| Radiopaedia | CC BY-NC-SA 3.0, no bulk copying | Single attributed images only |

Gaps nobody fills openly: axial vascular territory maps, myotome charts, facial nerve branch diagrams, visual field defects by lesion. Draw these ourselves, traced from public-domain Gray's plates.

## Teaching material

| Resource | License | Use |
|---|---|---|
| [Utah NeuroLogic Exam](https://neurologicexam.med.utah.edu/adult/html/creative-commons-license.html), adult and pediatric, and the Neuroanatomy Video Lab | CC BY-NC-SA (2.5/4.0); may be incorporated into websites; **not** to be re-posted to YouTube or social media | Self-host clips beside cases and widgets with the verbatim credit statement from that page |
| [MRC *Aids to the Examination of the Peripheral Nervous System*](https://www.ukri.org/wp-content/uploads/2021/12/MRC-011221-AidsToTheExaminationOfThePeripheralNervousSystem.pdf) (1976 reprint) | Open Government Licence, per the [MRC Muscle Scale page](https://www.ukri.org/councils/mrc/facilities-and-resources/find-an-mrc-facility-or-resource/mrc-muscle-scale/); credit "Used with the permission of the Medical Research Council"; say if modified; no implied endorsement | Root and nerve muscle diagrams adaptable for the root/nerve sorter and lesion ladders. Later Elsevier editions are all rights reserved |
| [Lyon 2022, *Neurology: Education*](https://doi.org/10.1212/NE9.0000000000200012) localization handouts | CC BY 4.0 | Vascular, upper-limb and lower-limb localization summaries |
| [*Foundations of Neuroscience*](https://openbooks.lib.msu.edu/neuroscience/) (MSU) | CC BY-NC-SA 4.0 | Pathway figures and further reading |
| [CDC Milestones in Action](https://www.cdc.gov/act-early/milestones-in-action/index.html) | CDC permission for educational use and website embedding; unaltered, with attribution and no-endorsement note | Developmental milestone photos and videos, 2 months to 5 years |
| [ISNCSCI worksheet](https://asia-spinalinjury.org/international-standards-neurological-classification-sci-isncsci-worksheet/) | CC BY-NC-ND 4.0 | Link the unaltered PDF; teach the rules in our own widget |
| Stanford Newborn Nursery gallery | Educational use with citation; not CC | Link |
| Stanford Medicine 25 | YouTube standard license | Embed only |
| **All rights reserved despite appearances:** UTHealth Neuroscience Online, AAN site content, EyeWiki, Draw It to Know It, WUSTL Neuromuscular pages | | Link only |
