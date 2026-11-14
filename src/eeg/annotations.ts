// Guided step-throughs on the licensed tracings in figures.json. Pure data plus checks, no DOM.
// Region coordinates are fractions of the image (0 to 1), measured on the published JPEGs.
// Captions are grounded in each figure's own caption and in the module text that teaches it.

import raw from './annotations.json';

/** box: one feature. rows: one or more channel rows. time: a vertical time window. */
export type RegionKind = 'box' | 'rows' | 'time';

export interface TourRegion {
  kind: RegionKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface TourStep {
  caption: string;
  regions: TourRegion[];
}

export interface FigureTour {
  figureId: string;
  steps: TourStep[];
}

export const TOURS = raw as FigureTour[];

const BY_ID = new Map(TOURS.map(t => [t.figureId, t]));
export const tourFor = (figureId: string): FigureTour | undefined => BY_ID.get(figureId);

export const KIND_NAME: Record<RegionKind, string> = { box: 'feature', rows: 'channel row', time: 'time window' };

/** Center of a step's highlighted regions (fractions), so a zoomed view can scroll to it. */
export function stepFocus(step: TourStep): { x: number; y: number } | null {
  if (!step.regions.length) return null;
  const x0 = Math.min(...step.regions.map(r => r.x));
  const x1 = Math.max(...step.regions.map(r => r.x + r.width));
  const y0 = Math.min(...step.regions.map(r => r.y));
  const y1 = Math.max(...step.regions.map(r => r.y + r.height));
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
}

/** Every problem with the tour data, as readable strings. Empty means valid. */
export function tourProblems(tours: FigureTour[], figureIds: Set<string>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const inUnit = (v: number) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
  const badText = (s: string) => /[—;]/.test(s);
  for (const t of tours) {
    if (!figureIds.has(t.figureId)) out.push(`${t.figureId}: not in figures.json`);
    if (seen.has(t.figureId)) out.push(`${t.figureId}: duplicate tour`);
    seen.add(t.figureId);
    if (t.steps.length < 3 || t.steps.length > 5) out.push(`${t.figureId}: ${t.steps.length} steps (want 3 to 5)`);
    t.steps.forEach((s, i) => {
      const at = `${t.figureId} step ${i + 1}`;
      if (!s.caption.trim()) out.push(`${at}: empty caption`);
      if (badText(s.caption)) out.push(`${at}: caption has an em dash or semicolon`);
      for (const r of s.regions) {
        if (!['box', 'rows', 'time'].includes(r.kind)) out.push(`${at}: unknown kind ${r.kind}`);
        if (![r.x, r.y, r.width, r.height].every(inUnit)) out.push(`${at}: coordinate outside 0..1 (${r.label})`);
        if (r.width <= 0 || r.height <= 0) out.push(`${at}: empty region (${r.label})`);
        if (r.x + r.width > 1.0001 || r.y + r.height > 1.0001) out.push(`${at}: region runs off the image (${r.label})`);
        if (!r.label.trim()) out.push(`${at}: region without a label`);
        if (badText(r.label)) out.push(`${at}: label has an em dash or semicolon`);
      }
    });
  }
  return out;
}
