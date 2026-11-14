// Synthetic, schematic axial head CT of a child, drawn from regions with sourced Hounsfield
// values, plus the window/level arithmetic that turns HU into gray. Pure TypeScript with no
// imports, so scripts/test-nrad-models.ts can run it directly under Node.
//
// Geometry is in millimetres. Origin at the center of the head, x to the image right, y down
// (anterior at the top). Images follow the radiological convention, so the patient's RIGHT is
// on the image LEFT. Angles are measured from +x toward +y (0 = image right, 90 = posterior).

export type RegionId =
  | 'air' | 'sinus' | 'skin' | 'fat' | 'bone' | 'diploe' | 'fracture'
  | 'sdh' | 'edh' | 'csf' | 'gray' | 'white' | 'deep' | 'ventricle' | 'calcification';

export interface Region {
  id: RegionId;
  label: string;
  hu: number;
  /** Key into src/nrad/sources.ts, or 'illustrative' when the value is a plausible placeholder. */
  source: string;
  note: string;
}

export const REGIONS: Record<RegionId, Region> = {
  air: { id: 'air', label: 'Air outside the head', hu: -1000, source: 'schulz2021', note: 'Air defines the bottom of the scale at -1000 HU.' },
  sinus: { id: 'sinus', label: 'Air in a sinus', hu: -1000, source: 'schulz2021', note: 'Air inside the skull base or sinuses is as dark as air outside.' },
  skin: { id: 'skin', label: 'Scalp soft tissue', hu: 40, source: 'aubrey2014', note: 'Soft tissue sits in the muscle range, -29 to +150 HU.' },
  fat: { id: 'fat', label: 'Scalp fat', hu: -100, source: 'derstine2022', note: 'Fat is defined on CT as -190 to -30 HU.' },
  bone: { id: 'bone', label: 'Skull (cortical table)', hu: 1000, source: 'schulz2021', note: 'Dense bone sits around +1000 HU on the doubled Hounsfield scale. Real cortical bone often measures higher.' },
  diploe: { id: 'diploe', label: 'Skull (diploë)', hu: 450, source: 'illustrative', note: 'The marrow space between the tables is less dense than cortical bone. The value is illustrative.' },
  fracture: { id: 'fracture', label: 'Fracture line', hu: 40, source: 'illustrative', note: 'A gap through the bone filled with soft tissue and blood. Visible on a bone window.' },
  sdh: { id: 'sdh', label: 'Acute subdural blood', hu: 70, source: 'mutch2016', note: 'Acute hemorrhage typically measures 50 to 70 HU, and less in severe anemia.' },
  edh: { id: 'edh', label: 'Acute epidural blood', hu: 70, source: 'mutch2016', note: 'Acute hemorrhage typically measures 50 to 70 HU.' },
  csf: { id: 'csf', label: 'CSF in sulci and fissures', hu: 8, source: 'honjo2026', note: 'CSF measured 6 to 15 HU in normal children, depending on method.' },
  gray: { id: 'gray', label: 'Cortical gray matter', hu: 33, source: 'honjo2026', note: 'Median 32 to 33 HU at 2 years and older, about 28 HU under 2.' },
  white: { id: 'white', label: 'White matter', hu: 24, source: 'honjo2026', note: 'Median 23 to 24 HU in children of all ages.' },
  deep: { id: 'deep', label: 'Deep gray matter (caudate, thalamus)', hu: 31, source: 'honjo2026', note: 'Caudate and thalamus about 29 to 33 HU in children.' },
  ventricle: { id: 'ventricle', label: 'CSF in the ventricles', hu: 8, source: 'honjo2026', note: 'Ventricular CSF measured 6 to 15 HU in normal children.' },
  calcification: { id: 'calcification', label: 'Choroid plexus calcification', hu: 200, source: 'illustrative', note: 'Physiologic choroid plexus calcification occurs even in young children (Whitehead 2015). The value is illustrative.' },
};

// ── Window and level ─────────────────────────────────────────────────────────

export interface WindowPreset { id: string; label: string; width: number; level: number; source: string; shows: string; hides: string }

export const PRESETS: WindowPreset[] = [
  { id: 'brain', label: 'Brain', width: 80, level: 40, source: 'wang2021', shows: 'Gray and white matter, CSF and acute blood are all distinct shades.', hides: 'Bone and anything above +80 HU are the same pure white, and acute blood is nearly as white, so a thin subdural against the inner table blends into the skull.' },
  { id: 'subdural', label: 'Subdural', width: 200, level: 80, source: 'wang2021', shows: 'Acute blood stays gray while bone stays white, so a thin collection along the inner table separates from the skull.', hides: 'Gray and white matter flatten into one shade, so parenchymal edema is harder to see.' },
  { id: 'bone', label: 'Bone', width: 2800, level: 600, source: 'wang2021', shows: 'Cortical bone, diploë, fracture lines and air in sinuses.', hides: 'The whole brain, blood included, becomes one flat gray.' },
  { id: 'stroke', label: 'Narrow (stroke)', width: 8, level: 32, source: 'lev1999', shows: 'Exaggerates the few HU between gray and white matter, which helps find early ischemic swelling.', hides: 'Almost everything else is pure black or pure white, and noise looks like texture.' },
];

/** HU to display gray (0 black, 1 white). Values below level - width/2 are black, above level + width/2 white. */
export function grayFor(hu: number, width: number, level: number): number {
  const w = Math.max(1, width);
  const g = (hu - (level - w / 2)) / w;
  return g < 0 ? 0 : g > 1 ? 1 : g;
}

/** Whether two HU values render as the same 8-bit gray in a window. */
export function sameGray(a: number, b: number, width: number, level: number): boolean {
  return Math.round(grayFor(a, width, level) * 255) === Math.round(grayFor(b, width, level) * 255);
}

/** Display contrast (difference in gray, 0-1) between two regions in a window. */
export function contrast(a: RegionId, b: RegionId, width: number, level: number): number {
  return Math.abs(grayFor(REGIONS[a].hu, width, level) - grayFor(REGIONS[b].hu, width, level));
}

// Slider mapping: width runs on a log scale so that both W8 and W2800 are reachable on a phone.
export const WIDTH_MIN = 1, WIDTH_MAX = 4000, LEVEL_MIN = -1000, LEVEL_MAX = 2000;
export const widthToSlider = (w: number) => Math.round((Math.log(Math.max(WIDTH_MIN, w)) / Math.log(WIDTH_MAX)) * 1000);
export const sliderToWidth = (s: number) => Math.max(WIDTH_MIN, Math.round(Math.exp((s / 1000) * Math.log(WIDTH_MAX))));

// ── Geometry ────────────────────────────────────────────────────────────────

export const HEAD = { a: 74, b: 90 };            // outer scalp half-width and half-length (mm)
export const FIELD = { w: 170, h: 204 };         // field of view (mm)
const SKIN = 1.5, FAT = 4, OUTER = 6, DIPLOE = 8, INNER = 10, CSF = 11.5, CORTEX = 15;

const inEllipse = (x: number, y: number, a: number, b: number) => (x * x) / (a * a) + (y * y) / (b * b) <= 1;
/** Approximate depth (mm) below the scalp surface along an inward ray. */
function depthAt(x: number, y: number): number {
  const r = Math.sqrt((x * x) / (HEAD.a * HEAD.a) + (y * y) / (HEAD.b * HEAD.b));
  if (r === 0) return Infinity;
  // Distance from the point to the outer ellipse along the ray from the center.
  const rayLen = Math.hypot(x, y) / r;
  return rayLen - Math.hypot(x, y);
}
const angleDeg = (x: number, y: number) => (Math.atan2(y, x) * 180) / Math.PI;
const angDiff = (a: number, b: number) => { let d = a - b; while (d > 180) d -= 360; while (d < -180) d += 360; return d; };

// Lesions. Epidural on the patient's LEFT (image right), temporal, under a fracture.
// Subdural on the patient's RIGHT (image left), a long thin crescent along the convexity.
export const EDH = { center: -8, half: 24, max: 9 };
export const SDH = { center: 185, half: 72, max: 4 };
export const FRACTURE = { angle: -8, tilt: 18 }; // ray angle where it crosses the skull, and its tilt off radial

/** Thickness (mm) of the epidural at an angle: a lens, thickest in the middle. */
export function edhThickness(theta: number): number {
  const d = Math.abs(angDiff(theta, EDH.center));
  if (d >= EDH.half) return 0;
  return EDH.max * Math.sqrt(1 - (d / EDH.half) ** 2);
}
/** Thickness (mm) of the subdural: a crescent of near-even thickness that tapers only at its tips. */
export function sdhThickness(theta: number): number {
  const d = Math.abs(angDiff(theta, SDH.center));
  if (d >= SDH.half) return 0;
  const taper = Math.min(1, (SDH.half - d) / 14);
  return SDH.max * Math.sqrt(taper);
}

function onFracture(x: number, y: number): boolean {
  const t = (FRACTURE.angle * Math.PI) / 180, tilt = (FRACTURE.tilt * Math.PI) / 180;
  // Point on the skull where the fracture crosses, then a line through it tilted off the ray.
  const ux = Math.cos(t), uy = Math.sin(t);
  const r = 1 / Math.sqrt((ux * ux) / (HEAD.a * HEAD.a) + (uy * uy) / (HEAD.b * HEAD.b));
  const px = ux * (r - DIPLOE), py = uy * (r - DIPLOE);
  const dx = Math.cos(t + tilt), dy = Math.sin(t + tilt);
  const dist = Math.abs((x - px) * dy - (y - py) * dx);
  const along = Math.abs((x - px) * dx + (y - py) * dy);
  return dist < 0.7 && along < 8;
}

/** The region at a point (mm). Nominal values, no noise. */
export function regionAt(x: number, y: number, opts: { lesions?: boolean } = {}): RegionId {
  const lesions = opts.lesions !== false;
  if (!inEllipse(x, y, HEAD.a, HEAD.b)) return 'air';
  const d = depthAt(x, y);
  const theta = angleDeg(x, y);
  if (d < SKIN) return 'skin';
  if (d < FAT) return 'fat';
  if (d < INNER) {
    if (lesions && onFracture(x, y)) return 'fracture';
    // Frontal sinus: an air cell in the frontal bone at the anterior midline.
    if (y < 0 && (x / 9) ** 2 + ((d - DIPLOE) / 1.8) ** 2 < 1) return 'sinus';
    return d < OUTER || d >= DIPLOE ? 'bone' : 'diploe';
  }
  // Extra-axial blood sits under the inner table and pushes the brain in.
  let shift = 0;
  if (lesions) {
    const te = edhThickness(theta), ts = sdhThickness(theta);
    if (te > 0 && d < INNER + te) return 'edh';
    if (ts > 0 && d < INNER + ts) return 'sdh';
    shift = Math.max(te, ts);
  }
  const dd = d - shift;
  // Blood displaces the thin CSF layer first, so the sulci over a collection are effaced.
  if (dd < CSF && shift === 0) return 'csf';
  if (dd < CORTEX) return 'gray';
  // Interior structures.
  if (Math.abs(x) < 0.9 && (y < -30 || y > 42)) return 'csf'; // interhemispheric fissure
  for (const s of [-1, 1]) {
    const cx = s * 15, cy = 26;                                 // atrium and occipital horn
    if (inEllipse(x - s * 15.5, y - 25, 1.6, 1.6)) return 'calcification';
    if (inEllipseRot(x - cx, y - cy, 4.5, 10, s * 25)) return 'ventricle';
    if (inEllipseRot(x - s * 8, y + 2, 4.2, 22, s * -14)) return 'ventricle'; // frontal horn and body
    if (inEllipse(x - s * 15, y + 16, 4.2, 7)) return 'deep';                // caudate head
    if (inEllipse(x - s * 9, y - 12, 7, 9)) return 'deep';                   // thalamus
  }
  if (Math.abs(x) < 1.3 && y > 2 && y < 20) return 'ventricle';            // third ventricle
  return 'white';
}

function inEllipseRot(x: number, y: number, a: number, b: number, rotDeg: number) {
  const t = (rotDeg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  return inEllipse(x * c + y * s, -x * s + y * c, a, b);
}

export const huAt = (x: number, y: number, opts?: { lesions?: boolean }) => REGIONS[regionAt(x, y, opts)].hu;

/** Deterministic pseudo-noise in HU (roughly -3 to +3), so the image looks like CT and tests are repeatable. */
export function noiseAt(i: number, j: number, amp = 3): number {
  const h = (n: number) => { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); };
  return ((h(i * 12.9898 + j * 78.233) + h(i * 39.346 + j * 11.135) - 1) * amp);
}

/** HU raster of the field: cols x rows pixels, row-major, with optional noise. */
export function rasterize(cols: number, rows: number, opts: { noise?: number; lesions?: boolean } = {}): Float32Array {
  const out = new Float32Array(cols * rows);
  const sx = FIELD.w / cols, sy = FIELD.h / rows;
  const amp = opts.noise ?? 3;
  for (let j = 0; j < rows; j++) {
    const y = -FIELD.h / 2 + (j + 0.5) * sy;
    for (let i = 0; i < cols; i++) {
      const x = -FIELD.w / 2 + (i + 0.5) * sx;
      const r = regionAt(x, y, opts);
      out[j * cols + i] = REGIONS[r].hu + (r === 'air' || r === 'sinus' ? 0 : noiseAt(i, j, amp));
    }
  }
  return out;
}

/** Pixel (in a cols x rows raster) to millimetres. */
export function pixelToMm(i: number, j: number, cols: number, rows: number) {
  return { x: -FIELD.w / 2 + ((i + 0.5) * FIELD.w) / cols, y: -FIELD.h / 2 + ((j + 0.5) * FIELD.h) / rows };
}
