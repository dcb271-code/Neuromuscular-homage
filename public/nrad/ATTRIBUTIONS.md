# Neuroradiology image attributions

The CT images in the neuroradiology curriculum are real. They come from two kinds of source, listed below. Every image on the site carries its credit and license beside it.

## CQ500 dataset (14 slices from 8 scans, `public/nrad/ct/`)

> Chilamkurthy S, Ghosh R, Tanamala S, et al. Deep learning algorithms for detection of critical findings in head CT scans: a retrospective study. Lancet. 2018;392(10162):2388-2396. https://pubmed.ncbi.nlm.nih.gov/30318264/

Dataset page: http://headctstudy.qure.ai/dataset (Qure.ai and the Centre for Advanced Research in Imaging, Neurosciences and Genomics, New Delhi).

License: CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/). The dataset page also carries an end user license agreement. The use here is non-commercial and educational. Any adaptation of these images carries the same license (ShareAlike).

The released files are anonymized and carry no age, sex or date. The paper reports mean ages of 43 and 52 years in its two batches and excluded patients under 7 years. For that reason the site uses these slices to show the anatomy of hemorrhage and the behavior of CT windows, and it does not describe any one of them as a child.

Changes made: one axial slice was taken from the non-contrast series named in the table. Pixels outside the head, including the scanner table, were set to air (-1024 HU). The slice was cropped to the head, displayed on a brain window (width 80, level 40), enlarged twofold and saved as 8-bit WebP. For the two slices marked "HU" the measured Hounsfield values were also saved without windowing, as 16-bit integers, for the window lab. No slice was mirrored or rotated.

This site drew the amber outline (a threshold trace around the bright blood), the numbered pins and their labels, the dashed midline and the shift measurement. They are not part of the dataset. The words "the three readers" refer to the three radiologists whose reads were published with the dataset (`reads.csv`).

| Image | Case | Series | Slice | Pixel size (mm) | Readers' findings for the scan | Stored as |
|---|---|---|---|---|---|---|
| edh-a | CQ500-CT-4 | 5mm | 17 | 0.5625 | Epidural hematoma, calvarial fracture, mass effect, midline shift | WebP, HU |
| edh-b | CQ500-CT-4 | 5mm | 19 | 0.5625 | Same scan | WebP |
| sdh-a | CQ500-CT-379 | 5mm | 18 | 0.4883 | Subdural hematoma, right, mass effect, midline shift | WebP, HU |
| sdh-b | CQ500-CT-61 | Plain 3mm | 31 | 0.6074 | Subdural hematoma, right, mass effect, midline shift | WebP |
| sdh-c | CQ500-CT-86 | 5/5mm Plain | 22 | 0.5234 | Subdural hematoma, mass effect, midline shift | WebP |
| sah-a | CQ500-CT-378 | 5mm | 13 | 0.4883 | Subarachnoid hemorrhage | WebP |
| sah-b | CQ500-CT-378 | 5mm | 10 | 0.4883 | Same scan | WebP |
| sah-c | CQ500-CT-378 | 5mm | 15 | 0.4883 | Same scan | WebP |
| iph-a | CQ500-CT-273 | 5mm | 17 | 0.5195 | Intraparenchymal hemorrhage, right, mass effect, midline shift | WebP |
| iph-b | CQ500-CT-273 | 5mm | 19 | 0.5195 | Same scan | WebP |
| ivh-a | CQ500-CT-481 | Plain | 13 | 0.4473 | Intraventricular hemorrhage | WebP |
| ivh-b | CQ500-CT-481 | Plain | 15 | 0.4473 | Same scan | WebP |
| normal-bg | CQ500-CT-99 | PRE CONTRAST 5MM STD | 14 | 0.5137 | No finding recorded by any reader | WebP |
| normal-vent | CQ500-CT-99 | PRE CONTRAST 5MM STD | 18 | 0.5137 | Same scan | WebP |

## Figures from open-access articles (12 panels, `public/nrad/oa/`)

Each article below is published under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes made: each figure was cropped to the panel or panels named, some were reduced in size, and all were saved as WebP. Nothing was drawn on them. Arrows, arrowheads and letters inside these images come from the original figures.

| Image | Source figure | Article |
|---|---|---|
| oa-edh-11y, oa-edh-11y-bone | Figure 1, panels a and c | Tsitsipanis C, et al. Severe and Atypical Presentation of Takotsubo Cardiomyopathy in a Pediatric Patient after a Serious Crash Injury-Case Report and Literature Review. Pediatr Rep. 2023;15(3):396-402. https://doi.org/10.3390/pediatric15030036 |
| oa-sdh-3y | Figure 3, panel a | Caré MM. Parenchymal Insults in Abuse-A Potential Key to Diagnosis. Diagnostics (Basel). 2022;12(4):955. https://doi.org/10.3390/diagnostics12040955 |
| oa-sdh-falx-4m | Figure 4, panel a | Caré MM. Diagnostics (Basel). 2022;12(4):955, as above |
| oa-hie-3m | Figure 2, panel a | Caré MM. Diagnostics (Basel). 2022;12(4):955, as above |
| oa-aht-8m | Figure 2, panel A | Colleran GC, et al. ESR Essentials: imaging of suspected child abuse-practice recommendations by the European Society of Paediatric Radiology. Eur Radiol. 2025;35(4):1868-1880. https://doi.org/10.1007/s00330-024-11052-4 |
| oa-bess-7m | Figure 2 | Raissaki M, et al. Benign enlargement of the subarachnoid spaces and subdural collections-when to evaluate for abuse. Pediatr Radiol. 2023;53(4):752-767. https://doi.org/10.1007/s00247-023-05611-y |
| oa-fx-9m | Figure 4 | Paddock M, et al. Controversial aspects of imaging in child abuse: a second roundtable discussion from the ESPR child abuse taskforce. Pediatr Radiol. 2023;53(4):739-751. https://doi.org/10.1007/s00247-023-05618-5 |
| oa-normal-14m | Figure 3, panel B | Afsharpayman S, et al. Fulminant coronavirus disease 2019 meningitis in Iranian infants: a case series. J Med Case Rep. 2024;18(1):121. https://doi.org/10.1186/s13256-024-04428-z |
| oa-sutures-3d | Figure 1, panel a | Timberlake AT, et al. Two locus inheritance of non-syndromic midline craniosynostosis via rare SMAD6 and common BMP2 alleles. eLife. 2016;5:e20125. https://doi.org/10.7554/eLife.20125 |
| oa-cisterns-5y | Figure 1 | Mierzewska-Schmidt M, et al. Fatal Fulminant Epstein-Barr Virus (EBV) Encephalitis in Immunocompetent 5.5-Year-Old Girl-A Case Report with the Review of Diagnostic and Management Dilemmas. Biomedicines. 2024;12(12):2877. https://doi.org/10.3390/biomedicines12122877 |
| oa-hydro | Figure 1 | Kharoufeh A, et al. Post-Hemorrhagic Hydrocephalus with Secondary Cerebrospinal Fluid Pathway Obstruction in an Extremely Premature Infant: A Case Report. Children (Basel). 2026;13(7):860. https://doi.org/10.3390/children13070860 |

## Teaching scenarios

The case stems in the hemorrhage sorter are teaching scenarios written for this site. They are not the histories of the patients in the images. The line under each image says what its source records about the patient.

If you are a rights holder and something here is credited incorrectly, please contact the site owner and it will be corrected.
