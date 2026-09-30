# MRI atlas attribution

The brain templates in this folder are population averages, not images of any individual.
They were obtained from [TemplateFlow](https://www.templateflow.org) and are redistributed
under their original licences, reproduced in `licenses/`.

## MNI unbiased nonlinear infant atlases, 0–4.5 yr (`tpl-MNIInfant`)

- Ages used here: 5–8 mo, 11–14 mo, 21–27 mo
- Authors: Fonov V, Evans AC, Botteron K, Almli CR, McKinstry RC, Collins DL
- Cite: Fonov V, et al. Unbiased nonlinear average age-appropriate brain templates from birth to adulthood. NeuroImage 2009;47:S102. doi:10.1016/S1053-8119(09)70884-5
- Licence: MNI/McGill permissive licence (copyright notice must accompany all copies). Full text: `licenses/MNIInfant/LICENSE`.
- Links: https://doi.org/10.1016/S1053-8119(09)70884-5, http://nist.mni.mcgill.ca/?p=1005

## MNI unbiased pediatric templates, 4.5–18.5 yr (`tpl-MNIPediatricAsym`)

- Ages used here: 4.5–8.5 yr, 13–18.5 yr
- Authors: Fonov V, Evans AC, Botteron K, Almli CR, McKinstry RC, Collins DL
- Cite: Fonov V, et al. Unbiased average age-appropriate atlases for pediatric studies. NeuroImage 2011;54(1):313–327. doi:10.1016/j.neuroimage.2010.07.033
- Licence: MNI/McGill permissive licence (copyright notice must accompany all copies). Full text: `licenses/MNIPediatricAsym/LICENSE`.
- Links: https://doi.org/10.1016/j.neuroimage.2010.07.033, http://nist.mni.mcgill.ca/?p=974

## UNC infant 0–1–2 atlases, with AAL parcellation (`tpl-UNCInfant`)

- Ages used here: 1 yr, 2 yr
- Authors: Shi F, Yap PT, Wu G, Jia H, Gilmore JH, Lin W, Shen D
- Cite: Shi F, et al. Infant brain atlases from neonates to 1- and 2-year-olds. PLoS One 2011;6(4):e18746. doi:10.1371/journal.pone.0018746. Structure labels follow the AAL atlas: Tzourio-Mazoyer N, et al. NeuroImage 2002;15(1):273–289. doi:10.1006/nimg.2001.0978
- Licence: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Full text: `licenses/UNCInfant/LICENSE`.
- Links: https://doi.org/10.1371/journal.pone.0018746, http://www.nitrc.org/projects/pediatricatlas, https://doi.org/10.1006/nimg.2001.0978

## dHCP neonatal volumetric atlas (`tpl-dhcpVol`)

- Ages used here: 36 wk PMA, 40 wk PMA (term)
- Authors: Schuh A, Makropoulos A, Robinson EC, Cordero-Grande L, Hughes E, Hutter J, Price AN, Murgasova M, Teixeira RPA, Tusor N, Steinweg JK, Victor S, Rutherford MA, Hajnal JV, Edwards AD, Rueckert D
- Cite: Schuh A, et al. Unbiased construction of a temporally consistent morphological atlas of neonatal brain development. bioRxiv 2018. doi:10.1101/251512
- Licence: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Full text: `licenses/dhcpVol/LICENSE`.
- Links: https://doi.org/10.1101/251512, https://doi.org/10.12751/g-node.d2b353

## Changes made to the original files

These files are modified versions of the originals, as CC BY 4.0 requires us to state.

- Intensities were rescaled to 8-bit (0–255) using the 0.5th to 99.5th percentile of non-zero
  voxels inside each template's brain mask (97th percentile ceiling for the neonatal T2).
  Geometry (affine, qform, sform) is unchanged.
- `*_preview` files are 2×2×2 block averages (labels: majority vote), with the affine shifted
  so voxel centres stay aligned with the full-resolution volume.
- dHCP structure labels: the two background labels (84, 85) were set to 0.
- dHCP structure colours were reassigned for 85 of 85 structures so that
  neighbouring structures are distinguishable. Label numbers and names are unchanged.
- UNC AAL labels: the source has no colour table or names file, so colours were assigned
  and the standard AAL region names were attached (abbreviations expanded, e.g.
  `Frontal_Inf_Tri_L` → "Inferior frontal gyrus, triangular part left").
- UNC templates are T1-weighted only.

Generated 2026-09-30.
