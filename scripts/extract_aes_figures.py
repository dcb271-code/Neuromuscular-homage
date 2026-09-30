#!/usr/bin/env python3
"""
Extract the figures of St. Louis & Frey (eds), Electroencephalography: An Introductory Text
and Atlas (American Epilepsy Society, 2016) for the EEG curriculum.

Licence (book, p. 3): "Except where indicated, this publication is licensed under the Creative
Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License ... Figures,
tables, and images included in this work are also published under the CC BY-NC-SA license and
should be properly cited when reused or repurposed."

Figures whose caption carries a separate copyright notice ("Copyright ... All rights reserved",
"reprinted with permission") are excluded automatically. Figures marked "courtesy of" a book
contributor are kept and credited to that person.

    .venv/bin/python scripts/extract_aes_figures.py            # needs docs/eeg/sources/EEG atlas AES.pdf

Writes:
    public/eeg/figures/aes-fNN.jpg     the figure image (JPEG, max 1600 px wide)
    src/eeg/figures.json               registry: id, number, title, caption, credit, page, size
    (then run scripts/build_eeg_attributions.py for public/eeg/ATTRIBUTIONS.md)
"""
from __future__ import annotations

import io
import json
import re
from pathlib import Path

import pymupdf
from PIL import Image

SRC = Path("docs/eeg/sources/EEG atlas AES.pdf")
OUT_IMG = Path("public/eeg/figures")
OUT_JSON = Path("src/eeg/figures.json")

BOOK = ("St. Louis EK, Frey LC, eds. Electroencephalography (EEG): An Introductory Text and Atlas of "
        "Normal and Abnormal Findings in Adults, Children, and Infants. Chicago: American Epilepsy "
        "Society; 2016. https://www.ncbi.nlm.nih.gov/books/NBK390346/")
LICENCE = "CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)"
EXCLUDE = re.compile(r"all rights reserved|reprinted with permission|used with permission|copyright \d{4}", re.I)
COURTESY = re.compile(r"\(?\s*Figure courtesy of (.+?)\.?\)?\s*$", re.I)  # runs to the end of the caption
MAX_W = 1600


# 2: polarity diagram whose Mayo copyright line sits several blocks below the caption;
# 3, 6: MEG dipoles and intracranial ripples, not part of the scalp-EEG curriculum.
SKIP = {2, 3, 6}
FIX = {"anoxicischemic": "anoxic-ischemic", "hypoxicischemic": "hypoxic-ischemic", "LennoxGastaut": "Lennox-Gastaut",
       "centrotemporal": "centro-temporal"}


def captions_on(page) -> dict[int, str]:
    """Captions are text blocks that START with 'Figure N.'; body-text mentions are ignored.
    A following block that carries a copyright or courtesy line is appended to the caption."""
    blocks = [b for b in page.get_text("blocks") if b[6] == 0]  # text blocks only
    out: dict[int, str] = {}
    for i, b in enumerate(blocks):
        m = re.match(r"\s*Figure (\d+)\.\s+(.*)", b[4], re.S)
        if not m:
            continue
        n = int(m.group(1))
        text = m.group(2)
        for nb in blocks[i + 1:i + 3]:
            if re.match(r"\s*(\(?Figure courtesy|Copyright|Reprinted|Used with permission)", nb[4], re.I):
                text += " " + nb[4]
        c = re.sub(r"\s+", " ", text).strip()
        c = re.sub(r"([a-z])- ([a-z])", r"\1\2", c)      # line-break hyphenation: "neo- nates"
        c = re.sub(r"([A-Za-z])- ([A-Z])", r"\1-\2", c)   # real hyphen split at a line break: "Pestana- Knight"
        for bad, good in FIX.items():
            c = c.replace(bad, good)
        if n not in out or len(c) > len(out[n]):
            out[n] = c
    return out


def main() -> None:
    doc = pymupdf.open(SRC)
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    for old in OUT_IMG.glob("aes-f*.jpg"):
        old.unlink()

    # 1. Collect images (with bbox) and captions per page.
    pages = []
    for i in range(len(doc)):
        pg = doc[i]
        imgs = []
        for info in pg.get_image_info(xrefs=True):
            xref = info.get("xref")
            if not xref:
                continue
            pix = pymupdf.Pixmap(doc, xref)
            if pix.width < 300 or pix.height < 120:
                continue
            if pix.n - pix.alpha >= 4:
                pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
            imgs.append({"xref": xref, "bbox": info["bbox"], "pix": pix})
        imgs.sort(key=lambda d: (round(d["bbox"][1]), d["bbox"][0]))
        pages.append({"page": i + 1, "images": imgs, "captions": captions_on(pg)})

    # 2. Pair each caption with the image nearest above it on the same page; if a page has
    #    images but no caption, use the first caption on the next page (figure spans a break).
    figures: dict[int, dict] = {}
    for idx, p in enumerate(pages):
        caps = p["captions"]
        imgs = p["images"]
        if not imgs:
            continue
        if not caps and idx + 1 < len(pages):
            nxt = pages[idx + 1]["captions"]
            unused = [n for n in sorted(nxt) if n not in figures]
            if unused:
                caps = {unused[0]: nxt[unused[0]]}
        if not caps:
            continue
        # caption y positions
        text_blocks = doc[p["page"] - 1].get_text("blocks")
        cap_y = {}
        for n in caps:
            for b in text_blocks:
                if re.match(rf"\s*Figure {n}\.", b[4]):
                    cap_y[n] = b[1]
                    break
        for n in sorted(caps):
            if n in figures:
                continue
            y = cap_y.get(n, 1e9)
            above = [im for im in imgs if im["bbox"][3] <= y + 5] or imgs
            im = above[-1] if y < 1e9 else imgs[0]
            imgs = [x for x in imgs if x is not im]
            figures[n] = {"number": n, "caption": caps[n], "page": p["page"], "pix": im["pix"]}

    # 3. Filter, write images, build registry.
    registry = []
    for n in sorted(figures):
        f = figures[n]
        cap = f["caption"]
        if n in SKIP:
            continue
        if EXCLUDE.search(cap):
            print(f"  skip Fig {n}: separate copyright ({cap[:60]}...)")
            continue
        credit_person = None
        m = COURTESY.search(cap)
        if m:
            credit_person = m.group(1).strip()
            cap = COURTESY.sub("", cap).strip()
        title = re.split(r"(?<=[a-z0-9\)])\. ", cap, maxsplit=1)[0].rstrip(".")
        pix = f["pix"]
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
        fid = f"aes-f{n:02d}"
        path = OUT_IMG / f"{fid}.jpg"
        img.save(path, "JPEG", quality=85, optimize=True)
        registry.append({
            "id": fid, "number": n, "title": title[:120], "caption": cap, "page": f["page"],
            "file": f"/eeg/figures/{fid}.jpg", "width": img.width, "height": img.height,
            "credit": f"St. Louis & Frey (eds), AES 2016" + (f"; figure courtesy of {credit_person}" if credit_person else ""),
            "licence": "CC BY-NC-SA 4.0",
            "source": "aes",
        })
    others = [r for r in json.loads(OUT_JSON.read_text()) if r.get("source", "aes") != "aes"] if OUT_JSON.exists() else []
    OUT_JSON.write_text(json.dumps(registry + others, indent=1, ensure_ascii=False))

    print(f"wrote {len(registry)} AES figures; run scripts/build_eeg_attributions.py to refresh credits")


if __name__ == "__main__":
    main()
