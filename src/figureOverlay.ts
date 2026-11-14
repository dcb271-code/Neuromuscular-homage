// Numbered pins over a real image. Coordinates are in the image's own pixels, with x to the
// right and y down. Pins sit on an ellipse just outside the image, so the picture itself
// carries only a thin leader and a small ring at the structure. Pure TypeScript with no
// imports, so the model tests can run it under Node.

export interface FigureMark {
  n: number;
  /** The structure, in image pixels. */
  at: [number, number];
  label: string;
  /** Direction of the pin from the image center, in degrees (0 = image right, 90 = down).
   *  Left out, the pin lies on the ray from the center through the structure. */
  ang?: number;
}

export interface FigureLine {
  from: [number, number];
  to: [number, number];
  /** Dashed white reference line. Without it the line is a solid amber measurement. */
  dash?: boolean;
  label?: string;
  labelAt?: [number, number];
}

export interface FigureOverlay {
  w: number;
  h: number;
  /** SVG path in image pixels, drawn as a thin amber line around the finding. */
  outline?: string | null;
  marks: FigureMark[];
  lines?: FigureLine[];
  /** R and L letters in the top corners. Off for images that are not axial or carry their own. */
  orient?: boolean;
  /** Multiplies the pad, pins, strokes and type, for images much wider than about 350 px. */
  scale?: number;
}

export const OVERLAY_PAD = 24;
export const PIN_R = 8.5;

/** Center of the pin for a mark, in image pixels. It lies in the black margin around the image. */
export function pinFor(o: Pick<FigureOverlay, 'w' | 'h' | 'scale'>, m: FigureMark): { x: number; y: number } {
  const pad = OVERLAY_PAD * (o.scale ?? 1);
  const cx = o.w / 2, cy = o.h / 2;
  const a = m.ang === undefined ? Math.atan2(m.at[1] - cy, m.at[0] - cx) : (m.ang * Math.PI) / 180;
  const rx = o.w / 2 + pad * 0.46, ry = o.h / 2 + pad * 0.46;
  const t = 1 / Math.sqrt((Math.cos(a) / rx) ** 2 + (Math.sin(a) / ry) ** 2);
  return { x: cx + t * Math.cos(a), y: cy + t * Math.sin(a) };
}
