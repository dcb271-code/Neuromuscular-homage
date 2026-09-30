#!/usr/bin/env python3
"""
Build the pediatric MRI atlas used by the Neuroradiology section's viewer.

Seven population-average templates, 36 weeks postmenstrual age to late
adolescence, downloaded from TemplateFlow's public S3 bucket, verified against
the bucket's MD5 checksums, and rewritten as small 8-bit NIfTI files that
NiiVue can stream to a browser.

    pip install numpy nibabel
    python scripts/prepare_atlas.py --out public/atlas

Options
    --no-preview        skip the 2 mm (2x downsampled) mobile versions
    --only ID [ID ...]  build a subset of age points, e.g. --only pma36w m12
    --source-dir DIR    reuse an existing TemplateFlow tree (~/.cache/templateflow)
    --cache DIR         raw download cache (default .atlas-cache/, gitignored)

Output (public/atlas/)
    manifest.json                    ages, files, sizes, shapes, licences, citations
    ATTRIBUTION.md                   human-readable credits and a list of changes
    licenses/<template>/LICENSE      original licence text
    labels/dhcp-structures.json      NiiVue label colormap {R,G,B,A,I,labels}
    <id>/T1w.nii.gz, T2w.nii.gz      8-bit, native resolution
    <id>/T1w_preview.nii.gz, ...     8-bit, 2x2x2 block mean
    pma36w|pma40w/labels.nii.gz      dHCP 87-structure segmentation (+ preview)
"""
from __future__ import annotations

import argparse
import colorsys
import hashlib
import json
import os
import re
import shutil
import sys
import urllib.request
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

import nibabel as nib
import numpy as np

BUCKET = "https://templateflow.s3.amazonaws.com"

# ── Templates ────────────────────────────────────────────────────────────────

TEMPLATES = {
    "dhcpVol": {
        "name": "dHCP neonatal volumetric atlas",
        "authors": "Schuh A, Makropoulos A, Robinson EC, Cordero-Grande L, Hughes E, Hutter J, "
                   "Price AN, Murgasova M, Teixeira RPA, Tusor N, Steinweg JK, Victor S, "
                   "Rutherford MA, Hajnal JV, Edwards AD, Rueckert D",
        "citation": "Schuh A, et al. Unbiased construction of a temporally consistent morphological "
                    "atlas of neonatal brain development. bioRxiv 2018. doi:10.1101/251512",
        "links": ["https://doi.org/10.1101/251512", "https://doi.org/10.12751/g-node.d2b353"],
        "license": "CC BY 4.0",
        "license_url": "https://creativecommons.org/licenses/by/4.0/",
    },
    "MNIInfant": {
        "name": "MNI unbiased nonlinear infant atlases, 0–4.5 yr",
        "authors": "Fonov V, Evans AC, Botteron K, Almli CR, McKinstry RC, Collins DL",
        "citation": "Fonov V, et al. Unbiased nonlinear average age-appropriate brain templates "
                    "from birth to adulthood. NeuroImage 2009;47:S102. doi:10.1016/S1053-8119(09)70884-5",
        "links": ["https://doi.org/10.1016/S1053-8119(09)70884-5", "http://nist.mni.mcgill.ca/?p=1005"],
        "license": "MNI/McGill permissive licence (copyright notice must accompany all copies)",
        "license_url": None,
    },
    "MNIPediatricAsym": {
        "name": "MNI unbiased pediatric templates, 4.5–18.5 yr",
        "authors": "Fonov V, Evans AC, Botteron K, Almli CR, McKinstry RC, Collins DL",
        "citation": "Fonov V, et al. Unbiased average age-appropriate atlases for pediatric "
                    "studies. NeuroImage 2011;54(1):313–327. doi:10.1016/j.neuroimage.2010.07.033",
        "links": ["https://doi.org/10.1016/j.neuroimage.2010.07.033", "http://nist.mni.mcgill.ca/?p=974"],
        "license": "MNI/McGill permissive licence (copyright notice must accompany all copies)",
        "license_url": None,
    },
    "UNCInfant": {
        "name": "UNC infant 0–1–2 atlases, with AAL parcellation",
        "authors": "Shi F, Yap PT, Wu G, Jia H, Gilmore JH, Lin W, Shen D",
        "citation": "Shi F, et al. Infant brain atlases from neonates to 1- and 2-year-olds. PLoS One "
                    "2011;6(4):e18746. doi:10.1371/journal.pone.0018746. Structure labels follow the "
                    "AAL atlas: Tzourio-Mazoyer N, et al. NeuroImage 2002;15(1):273–289. "
                    "doi:10.1006/nimg.2001.0978",
        "links": ["https://doi.org/10.1371/journal.pone.0018746", "http://www.nitrc.org/projects/pediatricatlas",
                  "https://doi.org/10.1006/nimg.2001.0978"],
        "license": "CC BY 4.0",
        "license_url": "https://creativecommons.org/licenses/by/4.0/",
    },
}

# ── Structure label sets ─────────────────────────────────────────────────────

# AAL (Tzourio-Mazoyer 2002), first 90 cerebral regions in standard order: odd = left,
# even = right. TemplateFlow ships the UNC AAL maps without a names table; this order was
# checked against the UNC 2-year map (all odd labels left of midline, caudate/thalamus/
# hippocampus/amygdala etc. at the expected centroids).
AAL_REGIONS = [
    ("Precentral", "Precentral gyrus"),
    ("Frontal_Sup", "Superior frontal gyrus, dorsolateral"),
    ("Frontal_Sup_Orb", "Superior frontal gyrus, orbital part"),
    ("Frontal_Mid", "Middle frontal gyrus"),
    ("Frontal_Mid_Orb", "Middle frontal gyrus, orbital part"),
    ("Frontal_Inf_Oper", "Inferior frontal gyrus, opercular part"),
    ("Frontal_Inf_Tri", "Inferior frontal gyrus, triangular part"),
    ("Frontal_Inf_Orb", "Inferior frontal gyrus, orbital part"),
    ("Rolandic_Oper", "Rolandic operculum"),
    ("Supp_Motor_Area", "Supplementary motor area"),
    ("Olfactory", "Olfactory cortex"),
    ("Frontal_Sup_Medial", "Superior frontal gyrus, medial"),
    ("Frontal_Med_Orb", "Superior frontal gyrus, medial orbital"),
    ("Rectus", "Gyrus rectus"),
    ("Insula", "Insula"),
    ("Cingulum_Ant", "Anterior cingulate gyrus"),
    ("Cingulum_Mid", "Middle cingulate gyrus"),
    ("Cingulum_Post", "Posterior cingulate gyrus"),
    ("Hippocampus", "Hippocampus"),
    ("ParaHippocampal", "Parahippocampal gyrus"),
    ("Amygdala", "Amygdala"),
    ("Calcarine", "Calcarine cortex"),
    ("Cuneus", "Cuneus"),
    ("Lingual", "Lingual gyrus"),
    ("Occipital_Sup", "Superior occipital gyrus"),
    ("Occipital_Mid", "Middle occipital gyrus"),
    ("Occipital_Inf", "Inferior occipital gyrus"),
    ("Fusiform", "Fusiform gyrus"),
    ("Postcentral", "Postcentral gyrus"),
    ("Parietal_Sup", "Superior parietal lobule"),
    ("Parietal_Inf", "Inferior parietal lobule"),
    ("SupraMarginal", "Supramarginal gyrus"),
    ("Angular", "Angular gyrus"),
    ("Precuneus", "Precuneus"),
    ("Paracentral_Lobule", "Paracentral lobule"),
    ("Caudate", "Caudate nucleus"),
    ("Putamen", "Putamen"),
    ("Pallidum", "Globus pallidus"),
    ("Thalamus", "Thalamus"),
    ("Heschl", "Heschl gyrus"),
    ("Temporal_Sup", "Superior temporal gyrus"),
    ("Temporal_Pole_Sup", "Temporal pole, superior"),
    ("Temporal_Mid", "Middle temporal gyrus"),
    ("Temporal_Pole_Mid", "Temporal pole, middle"),
    ("Temporal_Inf", "Inferior temporal gyrus"),
]

LABEL_SETS = {
    "dhcp": {"suffix": "desc-structures_dseg", "colormap": "labels/dhcp-structures.json",
             "background": (84, 85)},  # extra- and intra-cranial background
    "aal": {"suffix": "atlas-AAL_dseg", "colormap": "labels/aal.json", "background": ()},
}


@dataclass
class AgePoint:
    id: str
    label: str        # short label for the selector
    detail: str       # longer description
    template: str
    cohort: int
    res: int | None   # TemplateFlow res- entity (None for templates with a single resolution)
    label_set: str | None = None           # key into LABEL_SETS
    contrasts: tuple = ("T1w", "T2w")
    mask_suffix: str = "desc-brain_mask"
    # Optional hand-tuned windows, as (low, high) percentiles of brain voxels.
    window: dict = field(default_factory=dict)

    def key(self, suffix: str) -> str:
        t, c = self.template, self.cohort
        res = f"_res-{self.res}" if self.res else ""
        return f"tpl-{t}/cohort-{c}/tpl-{t}_cohort-{c}{res}_{suffix}.nii.gz"


AGES = [
    # Neonatal T2: the default 99.5th-percentile ceiling leaves CSF mid-grey. A 97th-percentile
    # ceiling puts ventricles near white and unmyelinated white matter mid-grey (3% of brain
    # voxels saturate), which matches how a neonatal T2 is usually displayed.
    AgePoint("pma36w", "36 wk PMA", "36 weeks postmenstrual age at scan (dHCP)", "dhcpVol", 36, None, label_set="dhcp", window={"T2w": (0.5, 97)}),
    AgePoint("pma40w", "40 wk PMA (term)", "40 weeks postmenstrual age at scan, term-equivalent (dHCP)", "dhcpVol", 40, None, label_set="dhcp", window={"T2w": (0.5, 97)}),
    AgePoint("m06", "5–8 mo", "Infants 5 to 8 months (MNI infant, cohort 3)", "MNIInfant", 3, 1),
    AgePoint("m12", "11–14 mo", "Infants 11 to 14 months (MNI infant, cohort 5)", "MNIInfant", 5, 1),
    AgePoint("m24", "21–27 mo", "Toddlers 21 to 27 months (MNI infant, cohort 8)", "MNIInfant", 8, 1),
    # UNC infant atlases: T1 only, 90 AAL regions of cortex and deep grey matter (no white matter,
    # cerebellum or brainstem labels).
    AgePoint("unc1y", "1 yr", "1-year-olds, T1 with 90 AAL grey-matter regions (UNC infant)", "UNCInfant", 2, None,
             label_set="aal", contrasts=("T1w",), mask_suffix="label-brain_mask"),
    AgePoint("unc2y", "2 yr", "2-year-olds, T1 with 90 AAL grey-matter regions (UNC infant)", "UNCInfant", 3, None,
             label_set="aal", contrasts=("T1w",), mask_suffix="label-brain_mask"),
    AgePoint("y4to8", "4.5–8.5 yr", "Children 4.5 to 8.5 years, prepubertal (MNI pediatric, cohort 2)", "MNIPediatricAsym", 2, 1),
    AgePoint("y13to18", "13–18.5 yr", "Adolescents 13 to 18.5 years, postpubertal (MNI pediatric, cohort 6)", "MNIPediatricAsym", 6, 1),
]

LABEL_TSV = "tpl-dhcpVol/tpl-dhcpVol_desc-structures_dseg.tsv"
DHCP_BACKGROUND = LABEL_SETS["dhcp"]["background"]

# ── Download + verify ────────────────────────────────────────────────────────


def s3_etag(key: str) -> tuple[str | None, int | None]:
    """Return (md5-or-None, size) for a bucket key from a HEAD request."""
    req = urllib.request.Request(f"{BUCKET}/{key}", method="HEAD")
    with urllib.request.urlopen(req, timeout=60) as r:
        etag = (r.headers.get("ETag") or "").strip('"')
        size = int(r.headers.get("Content-Length") or 0)
    # Multipart uploads have ETags like "<hash>-<parts>", which are not an MD5.
    return (etag if re.fullmatch(r"[0-9a-f]{32}", etag) else None), size


def md5sum(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def fetch(key: str, cache: Path, source_dir: Path | None) -> Path:
    """Return a verified local copy of a bucket key, downloading if needed."""
    if source_dir:
        local = source_dir / key
        if local.exists():
            return local
    dest = cache / key
    md5, size = s3_etag(key)
    if dest.exists():
        if (md5 and md5sum(dest) == md5) or (not md5 and dest.stat().st_size == size):
            return dest
        print(f"  cached copy of {key} failed verification; re-downloading")
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    print(f"  downloading {key} ({size / 1e6:.1f} MB)")
    with urllib.request.urlopen(f"{BUCKET}/{key}", timeout=300) as r, open(tmp, "wb") as f:
        shutil.copyfileobj(r, f, 1 << 20)
    if md5:
        got = md5sum(tmp)
        if got != md5:
            tmp.unlink()
            sys.exit(f"MD5 mismatch for {key}: expected {md5}, got {got}")
    elif tmp.stat().st_size != size:
        tmp.unlink()
        sys.exit(f"Size mismatch for {key}")
    tmp.replace(dest)
    return dest


# ── Image processing ─────────────────────────────────────────────────────────


def to_uint8(data: np.ndarray, mask: np.ndarray | None, lo_pct=0.5, hi_pct=99.5) -> tuple[np.ndarray, float, float]:
    """Rescale to 0–255 using percentiles of non-zero voxels (inside the brain mask if given)."""
    sel = data != 0
    if mask is not None and mask.shape == data.shape:
        sel &= mask > 0
    vals = data[sel]
    lo, hi = np.percentile(vals, [lo_pct, hi_pct])
    out = np.clip((data - lo) / (hi - lo), 0, 1) * 255
    out[data == 0] = 0
    return np.rint(out).astype(np.uint8), float(lo), float(hi)


def even_crop(a: np.ndarray) -> np.ndarray:
    return a[: a.shape[0] // 2 * 2, : a.shape[1] // 2 * 2, : a.shape[2] // 2 * 2]


def block_mean(a: np.ndarray) -> np.ndarray:
    a = even_crop(a).astype(np.float32)
    x, y, z = a.shape
    return a.reshape(x // 2, 2, y // 2, 2, z // 2, 2).mean(axis=(1, 3, 5))


def block_mode(a: np.ndarray) -> np.ndarray:
    """Majority vote over each 2x2x2 block (ties go to the first voxel in the block)."""
    a = even_crop(a)
    x, y, z = a.shape
    b = a.reshape(x // 2, 2, y // 2, 2, z // 2, 2).transpose(0, 2, 4, 1, 3, 5).reshape(x // 2, y // 2, z // 2, 8)
    counts = (b[..., :, None] == b[..., None, :]).sum(-1)
    return np.take_along_axis(b, counts.argmax(-1)[..., None], -1)[..., 0]


def preview_affine(affine: np.ndarray) -> np.ndarray:
    """Affine for a 2x downsample whose voxel i covers source voxels 2i and 2i+1."""
    s = np.diag([2.0, 2.0, 2.0, 1.0])
    s[:3, 3] = 0.5
    return affine @ s


def save_nifti(data: np.ndarray, ref: nib.Nifti1Image, affine: np.ndarray, path: Path, *, is_label=False) -> dict:
    hdr = ref.header.copy()
    img = nib.Nifti1Image(data, affine, hdr)
    # Keep the original geometry codes; only the matrices change for previews.
    img.set_qform(affine, int(ref.header["qform_code"]) or 1)
    img.set_sform(affine, int(ref.header["sform_code"]) or 1)
    img.set_data_dtype(np.uint8)
    img.header["scl_slope"] = 1
    img.header["scl_inter"] = 0
    img.header["cal_min"] = 0
    img.header["cal_max"] = int(data.max()) if is_label else 255
    img.header["descrip"] = b"Pons Asinorum atlas (modified from TemplateFlow)"
    path.parent.mkdir(parents=True, exist_ok=True)
    nib.save(img, str(path))
    return {"bytes": path.stat().st_size, "shape": list(data.shape),
            "voxel_mm": [round(float(v), 3) for v in nib.affines.voxel_sizes(affine)]}


# ── Label colormap ───────────────────────────────────────────────────────────


def build_label_colormap(tsv_path: Path) -> tuple[dict, list[str]]:
    """
    NiiVue label colormap from the dHCP structure table.

    The source colours repeat heavily (six structures are pure white, several are
    pure red), so neighbours become indistinguishable. Each region gets its own
    hue instead; grey- and white-matter parts of the same region share a hue,
    with white matter paler, so the pairing stays visible.
    """
    rows = []
    for line in tsv_path.read_text().splitlines()[1:]:
        if not line.strip():
            continue
        idx, r, g, b, _op, _thing, name = line.split("\t")
        rows.append((int(idx), (int(r), int(g), int(b)), name.strip()))

    changed: list[str] = []
    fixed = {  # anatomically conventional colours for fluid spaces
        "CSF": (70, 110, 200),
        "Lateral Ventricle left": (40, 80, 190),
        "Lateral Ventricle right": (40, 80, 190),
    }
    regions: list[str] = []
    for idx, _, name in rows:
        if idx in DHCP_BACKGROUND or name in fixed:
            continue
        base = re.sub(r"\s+(GM|WM)$", "", name)
        if base not in regions:
            regions.append(base)
    golden = 0.61803398875
    hue = {reg: (i * golden) % 1.0 for i, reg in enumerate(regions)}

    max_idx = max(i for i, _, _ in rows)
    R = [0] * (max_idx + 1); G = [0] * (max_idx + 1); B = [0] * (max_idx + 1)
    A = [0] * (max_idx + 1); labels = [""] * (max_idx + 1)
    for idx, src, name in rows:
        if idx in DHCP_BACKGROUND:
            continue
        if name in fixed:
            rgb = fixed[name]
        else:
            base = re.sub(r"\s+(GM|WM)$", "", name)
            is_wm = name.endswith(" WM")
            r, g, b = colorsys.hls_to_rgb(hue[base], 0.72 if is_wm else 0.5, 0.45 if is_wm else 0.75)
            rgb = (round(r * 255), round(g * 255), round(b * 255))
        if rgb != src:
            changed.append(name)
        R[idx], G[idx], B[idx], A[idx] = *rgb, 255
        labels[idx] = name
    cmap = {"R": R, "G": G, "B": B, "A": A, "I": list(range(max_idx + 1)), "labels": labels}
    return cmap, changed


def build_aal_colormap() -> dict:
    """
    NiiVue label colormap for the 90 AAL cerebral regions. The source has no colour
    table. Each region gets its own hue, shared by both hemispheres so the map reads
    symmetrically; the right side is slightly darker so the midline stays visible.
    """
    golden = 0.61803398875
    n = 2 * len(AAL_REGIONS)
    R = [0] * (n + 1); G = [0] * (n + 1); B = [0] * (n + 1); A = [0] * (n + 1); labels = [""] * (n + 1)
    for i, (_abbr, name) in enumerate(AAL_REGIONS):
        h = (i * golden) % 1.0
        for side, idx, light in (("left", 2 * i + 1, 0.55), ("right", 2 * i + 2, 0.45)):
            r, g, b = colorsys.hls_to_rgb(h, light, 0.7)
            R[idx], G[idx], B[idx], A[idx] = round(r * 255), round(g * 255), round(b * 255), 255
            labels[idx] = f"{name} {side}"
    return {"R": R, "G": G, "B": B, "A": A, "I": list(range(n + 1)), "labels": labels}


# ── Main ─────────────────────────────────────────────────────────────────────


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default="public/atlas", type=Path)
    ap.add_argument("--cache", default=".atlas-cache", type=Path)
    ap.add_argument("--source-dir", type=Path, default=None)
    ap.add_argument("--no-preview", action="store_true")
    ap.add_argument("--only", nargs="+", metavar="ID")
    args = ap.parse_args()

    ages = [a for a in AGES if not args.only or a.id in args.only]
    if args.only and len(ages) != len(args.only):
        known = ", ".join(a.id for a in AGES)
        sys.exit(f"Unknown id in --only. Known ids: {known}")
    out: Path = args.out
    out.mkdir(parents=True, exist_ok=True)
    src_dir = args.source_dir.expanduser() if args.source_dir else None

    # Licences
    used_templates = sorted({a.template for a in ages})
    for t in used_templates:
        lic = fetch(f"tpl-{t}/LICENSE", args.cache, src_dir)
        (out / "licenses" / t).mkdir(parents=True, exist_ok=True)
        shutil.copy(lic, out / "licenses" / t / "LICENSE")

    # Label colormaps
    def colormap_for(label_set: str) -> dict:
        if label_set == "dhcp":
            return build_label_colormap(fetch(LABEL_TSV, args.cache, src_dir))[0]
        return build_aal_colormap()

    for label_set in sorted({a.label_set for a in ages if a.label_set}):
        path = out / LABEL_SETS[label_set]["colormap"]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(colormap_for(label_set)))

    # Merge with an existing manifest so --only rebuilds don't drop other ages
    manifest_path = out / "manifest.json"
    prior = {}
    if manifest_path.exists():
        prior = {a["id"]: a for a in json.loads(manifest_path.read_text()).get("ages", [])}

    built = {}
    for age in ages:
        print(f"[{age.id}] {age.detail}")
        mask_img = nib.load(str(fetch(age.key(age.mask_suffix), args.cache, src_dir)))
        mask = np.asarray(mask_img.dataobj)
        entry = {
            "id": age.id, "label": age.label, "detail": age.detail,
            "template": age.template, "cohort": age.cohort, "files": {},
        }
        for contrast in age.contrasts:
            img = nib.load(str(fetch(age.key(contrast), args.cache, src_dir)))
            data = np.asarray(img.dataobj, dtype=np.float32)
            lo_pct, hi_pct = age.window.get(contrast, (0.5, 99.5))
            u8, lo, hi = to_uint8(data, mask, lo_pct, hi_pct)
            full = f"{age.id}/{contrast}.nii.gz"
            info = save_nifti(u8, img, img.affine, out / full)
            f = {"full": full, **info, "window_source": [round(lo, 3), round(hi, 3)]}
            if not args.no_preview:
                prev = f"{age.id}/{contrast}_preview.nii.gz"
                pinfo = save_nifti(np.rint(block_mean(u8)).astype(np.uint8), img, preview_affine(img.affine), out / prev)
                f.update({"preview": prev, "preview_bytes": pinfo["bytes"], "preview_shape": pinfo["shape"]})
            entry["files"][contrast] = f
            print(f"    {contrast}: {info['shape']} @ {info['voxel_mm']} mm, {info['bytes'] / 1e6:.1f} MB")
        if age.label_set:
            ls = LABEL_SETS[age.label_set]
            img = nib.load(str(fetch(age.key(ls["suffix"]), args.cache, src_dir)))
            lab = np.asarray(img.dataobj).astype(np.int32)
            for bg in ls["background"]:
                lab[lab == bg] = 0
            if lab.max() > 255:
                sys.exit(f"{age.id}: label values exceed 8 bits")
            lab = lab.astype(np.uint8)
            full = f"{age.id}/labels.nii.gz"
            info = save_nifti(lab, img, img.affine, out / full, is_label=True)
            f = {"full": full, **info, "colormap": ls["colormap"], "label_set": age.label_set}
            if not args.no_preview:
                prev = f"{age.id}/labels_preview.nii.gz"
                pinfo = save_nifti(block_mode(lab), img, preview_affine(img.affine), out / prev, is_label=True)
                f.update({"preview": prev, "preview_bytes": pinfo["bytes"], "preview_shape": pinfo["shape"]})
            entry["files"]["labels"] = f
            print(f"    labels: {info['bytes'] / 1e6:.1f} MB")
        built[age.id] = entry

    order = [a.id for a in AGES]
    merged = {**prior, **built}
    manifest = {
        "generated": date.today().isoformat(),
        "source": "TemplateFlow (https://www.templateflow.org), public S3 bucket",
        "default": "pma40w" if "pma40w" in merged else next(iter(merged)),
        "ages": [merged[i] for i in order if i in merged],
        "templates": {t: TEMPLATES[t] for t in sorted({merged[i]["template"] for i in merged})},
        "attribution": "ATTRIBUTION.md",
    }
    manifest_path.write_text(json.dumps(manifest, indent=2))
    label_sets = {a["files"]["labels"].get("label_set", "dhcp") for a in manifest["ages"] if "labels" in a["files"]}
    changed_colours = build_label_colormap(fetch(LABEL_TSV, args.cache, src_dir))[1] if "dhcp" in label_sets else []
    write_attribution(out, manifest, changed_colours, "aal" in label_sets)
    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(f"Wrote {out} ({total / 1e6:.1f} MB)")


def write_attribution(out: Path, manifest: dict, changed_colours: list[str], has_aal: bool = False) -> None:
    lines = [
        "# MRI atlas attribution",
        "",
        "The brain templates in this folder are population averages, not images of any individual.",
        "They were obtained from [TemplateFlow](https://www.templateflow.org) and are redistributed",
        "under their original licences, reproduced in `licenses/`.",
        "",
    ]
    for t, meta in manifest["templates"].items():
        ids = [a["label"] for a in manifest["ages"] if a["template"] == t]
        lines += [
            f"## {meta['name']} (`tpl-{t}`)",
            "",
            f"- Ages used here: {', '.join(ids)}",
            f"- Authors: {meta['authors']}",
            f"- Cite: {meta['citation']}",
            f"- Licence: {meta['license']}" + (f" ({meta['license_url']})" if meta.get("license_url") else "")
            + f". Full text: `licenses/{t}/LICENSE`.",
            f"- Links: {', '.join(meta['links'])}",
            "",
        ]
    lines += [
        "## Changes made to the original files",
        "",
        "These files are modified versions of the originals, as CC BY 4.0 requires us to state.",
        "",
        "- Intensities were rescaled to 8-bit (0–255) using the 0.5th to 99.5th percentile of non-zero",
        "  voxels inside each template's brain mask (97th percentile ceiling for the neonatal T2).",
        "  Geometry (affine, qform, sform) is unchanged.",
        "- `*_preview` files are 2×2×2 block averages (labels: majority vote), with the affine shifted",
        "  so voxel centres stay aligned with the full-resolution volume.",
        "- dHCP structure labels: the two background labels (84, 85) were set to 0.",
    ]
    if changed_colours:
        lines += [
            f"- dHCP structure colours were reassigned for {len(changed_colours)} of 85 structures so that",
            "  neighbouring structures are distinguishable. Label numbers and names are unchanged.",
        ]
    if has_aal:
        lines += [
            "- UNC AAL labels: the source has no colour table or names file, so colours were assigned",
            "  and the standard AAL region names were attached (abbreviations expanded, e.g.",
            "  `Frontal_Inf_Tri_L` → \"Inferior frontal gyrus, triangular part left\").",
            "- UNC templates are T1-weighted only.",
        ]
    lines += ["", f"Generated {manifest['generated']}.", ""]
    (out / "ATTRIBUTION.md").write_text("\n".join(lines))


if __name__ == "__main__":
    main()
