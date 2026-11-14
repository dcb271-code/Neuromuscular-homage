// Joins the stored CT slices (src/nrad/ct-slices.json) and the open-access figures to their
// marks, credits and captions (src/nrad/ctMarks.ts). The widgets ask for an image by id, and
// the curriculum registry takes NRAD_FIGURES for the figure strips under the section text.
// Sources and licences: public/nrad/ATTRIBUTIONS.md.

import slicesJson from './ct-slices.json';
import type { EegFigure } from '@/src/eeg/types';
import type { FigureOverlay } from '@/src/figureOverlay';
import { CQ500_LICENCE, CQ500_WHO, CT_MARKS, FIGURE_TEXT, OA_IMAGES, OA_LICENCE, cq500Credit } from './ctMarks';

export interface CtSlice { case: string; slice: number; w: number; h: number; mmPerPx: number; hu: boolean; outline: string | null }
export const CT_SLICES = slicesJson as Record<string, CtSlice>;

export const NRAD_ATTRIBUTIONS = '/nrad/ATTRIBUTIONS.md';

export interface CtImage {
  id: string;
  file: string;
  w: number;
  h: number;
  overlay: FigureOverlay;
  /** The patient, as far as the source says. */
  who: string;
  credit: string;
  licence: string;
  /** What arrows and letters printed into a published figure mean. */
  note?: string;
  /** Raw Hounsfield values, for the window lab. */
  bin?: string;
  mmPerPx?: number;
}

/** A stored image by id: a CQ500 slice (with its marks) or an open-access figure. */
export function ctImage(id: string): CtImage {
  const oa = OA_IMAGES[id];
  if (oa) {
    // Published figures keep their own arrows. They get the same black frame and side letters,
    // scaled to the larger file, and no pins.
    return { id, file: oa.file, w: oa.w, h: oa.h, overlay: { w: oa.w, h: oa.h, marks: [], scale: oa.w / 330 }, who: oa.who, credit: oa.credit, licence: OA_LICENCE, note: oa.note };
  }
  const set = CT_MARKS[id];
  const key = set?.img ?? id;
  const s = CT_SLICES[key];
  if (!s) throw new Error(`Unknown CT image ${id}`);
  return {
    id, file: `/nrad/ct/${key}.webp`, w: s.w, h: s.h,
    overlay: { w: s.w, h: s.h, outline: set?.outline === false ? null : s.outline, marks: set?.marks ?? [], lines: set?.lines },
    who: CQ500_WHO, credit: cq500Credit(s.case), licence: CQ500_LICENCE,
    bin: s.hu ? `/nrad/ct/${key}.bin` : undefined, mmPerPx: s.mmPerPx,
  };
}

/** Figures for the strips under the section text, keyed by the ids used in the module JSON. */
export const NRAD_FIGURES: Record<string, EegFigure> = Object.fromEntries(Object.entries(FIGURE_TEXT).map(([id, text], i) => {
  const im = ctImage(id), oa = !!OA_IMAGES[id];
  const fig: EegFigure = {
    id, number: i + 1, page: 0, title: text.title, caption: `${text.title}. ${text.body}`,
    file: im.file, width: im.w, height: im.h, credit: im.credit, licence: im.licence,
    attribution: NRAD_ATTRIBUTIONS, dark: true, maxWidth: text.maxWidth,
    // Published figures are shown as printed. CQ500 slices get pins and a key.
    overlay: oa ? undefined : im.overlay,
  };
  return [id, fig];
}));
