// Synthetic 10-20 EEG pages for the trace viewer. Pure model: no DOM, no I/O.
//
// Every page is SYNTHETIC and SCHEMATIC. It is built from a handful of Gaussian scalp fields
// (the idea in montage-model.ts, extended to 2D electrode positions), each driven by a
// waveform generator, plus a little independent noise per electrode. The same seed always
// gives the same page, so tests and screenshots are stable.
//
// Sign convention: values are scalp potentials in microvolts. A surface-negative event has a
// negative value. Derived channels are E1 minus E2, and the renderer draws negative up.

export const FS = 256;            // samples per second
export const PAGE_SECONDS = 10;   // one page
const PREROLL_SECONDS = 3;        // generated and filtered, then discarded, so filters settle
export const PAGE_SAMPLES = FS * PAGE_SECONDS;

// ── Electrodes ───────────────────────────────────────────────────────────────────────────
// International 10-20 system, projected onto a unit disk seen from above. x is left (−) to
// right (+), y is back (−) to front (+). T3/T4/T5/T6 naming matches the module texts.
export interface Electrode { name: string; x: number; y: number }
export const ELECTRODES: Electrode[] = [
  { name: 'Fp1', x: -0.31, y: 0.95 }, { name: 'Fp2', x: 0.31, y: 0.95 },
  { name: 'F7', x: -0.81, y: 0.59 }, { name: 'F3', x: -0.42, y: 0.52 }, { name: 'Fz', x: 0, y: 0.5 },
  { name: 'F4', x: 0.42, y: 0.52 }, { name: 'F8', x: 0.81, y: 0.59 },
  { name: 'T3', x: -1, y: 0 }, { name: 'C3', x: -0.5, y: 0 }, { name: 'Cz', x: 0, y: 0 },
  { name: 'C4', x: 0.5, y: 0 }, { name: 'T4', x: 1, y: 0 },
  { name: 'T5', x: -0.81, y: -0.59 }, { name: 'P3', x: -0.42, y: -0.52 }, { name: 'Pz', x: 0, y: -0.5 },
  { name: 'P4', x: 0.42, y: -0.52 }, { name: 'T6', x: 0.81, y: -0.59 },
  { name: 'O1', x: -0.31, y: -0.95 }, { name: 'O2', x: 0.31, y: -0.95 },
];
const EIDX: Record<string, number> = Object.fromEntries(ELECTRODES.map((e, i) => [e.name, i]));
const pos = (name: string) => ELECTRODES[EIDX[name]];

// ── Montages ─────────────────────────────────────────────────────────────────────────────
// Longitudinal bipolar ("double banana"), 18 channels: left temporal, left parasagittal,
// midline, right parasagittal, right temporal.
export const BIPOLAR_PAIRS: [string, string][] = [
  ['Fp1', 'F7'], ['F7', 'T3'], ['T3', 'T5'], ['T5', 'O1'],
  ['Fp1', 'F3'], ['F3', 'C3'], ['C3', 'P3'], ['P3', 'O1'],
  ['Fz', 'Cz'], ['Cz', 'Pz'],
  ['Fp2', 'F4'], ['F4', 'C4'], ['C4', 'P4'], ['P4', 'O2'],
  ['Fp2', 'F8'], ['F8', 'T4'], ['T4', 'T6'], ['T6', 'O2'],
];
/** Index of the first channel of each chain, used by the renderer to leave a small gap. */
export const BIPOLAR_GROUP_STARTS = [0, 4, 8, 10, 14];

export type MontageId = 'bipolar' | 'average';
export const MONTAGES: { id: MontageId; label: string }[] = [
  { id: 'bipolar', label: 'Longitudinal bipolar' },
  { id: 'average', label: 'Average reference' },
];

// ── Filters ──────────────────────────────────────────────────────────────────────────────
export const LFF_OPTIONS = [0.3, 0.5, 1, 5] as const;   // Hz, high-pass
export const HFF_OPTIONS = [15, 35, 70] as const;       // Hz, low-pass
export const SENSITIVITY_OPTIONS = [7, 10, 15, 20, 30, 50] as const; // µV/mm
export const MAINS_HZ = 60;

export interface FilterSettings { lff: number; hff: number; notch: boolean }
export const DEFAULT_FILTERS: FilterSettings = { lff: 1, hff: 70, notch: false };

/** First-order high-pass (the usual EEG low-frequency filter), bilinear transform. */
export function highPass(x: ArrayLike<number>, fc: number, fs = FS): Float64Array {
  const K = Math.tan((Math.PI * fc) / fs);
  const b0 = 1 / (1 + K), a1 = (K - 1) / (K + 1);
  const y = new Float64Array(x.length);
  let x1 = x[0], y1 = 0;
  for (let n = 0; n < x.length; n++) {
    const v = b0 * (x[n] - x1) - a1 * y1;
    y[n] = v; x1 = x[n]; y1 = v;
  }
  return y;
}

function biquad(x: ArrayLike<number>, b0: number, b1: number, b2: number, a0: number, a1: number, a2: number): Float64Array {
  b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
  const y = new Float64Array(x.length);
  let x1 = x[0], x2 = x[0], y1 = x[0] * (b0 + b1 + b2) / (1 + a1 + a2), y2 = y1;
  for (let n = 0; n < x.length; n++) {
    const v = b0 * x[n] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    y[n] = v; x2 = x1; x1 = x[n]; y2 = y1; y1 = v;
  }
  return y;
}

/** Second-order Butterworth low-pass (the high-frequency filter). RBJ cookbook biquad. */
export function lowPass(x: ArrayLike<number>, fc: number, fs = FS): Float64Array {
  const w = (2 * Math.PI * fc) / fs, cw = Math.cos(w), alpha = Math.sin(w) / (2 * Math.SQRT1_2);
  return biquad(x, (1 - cw) / 2, 1 - cw, (1 - cw) / 2, 1 + alpha, -2 * cw, 1 - alpha);
}

/** Narrow notch at f0 (Q 20, about 3 Hz wide at 60 Hz). RBJ cookbook biquad. */
export function notch(x: ArrayLike<number>, f0 = MAINS_HZ, fs = FS, Q = 20): Float64Array {
  const w = (2 * Math.PI * f0) / fs, cw = Math.cos(w), alpha = Math.sin(w) / (2 * Q);
  return biquad(x, 1, -2 * cw, 1, 1 + alpha, -2 * cw, 1 - alpha);
}

export function applyFilters(x: ArrayLike<number>, f: FilterSettings, fs = FS): Float64Array {
  let y = highPass(x, f.lff, fs);
  y = lowPass(y, f.hff, fs);
  if (f.notch) y = notch(y, MAINS_HZ, fs);
  return y;
}

// ── Seeded randomness ────────────────────────────────────────────────────────────────────
/** mulberry32: small, fast, deterministic. Returns a function giving numbers in [0, 1). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rand = () => number;
const between = (r: Rand, a: number, b: number) => a + (b - a) * r();
const gauss = (r: Rand) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

// ── Waveform generators (each returns a series of N samples, in µV) ──────────────────────
const N_TOTAL = FS * (PAGE_SECONDS + PREROLL_SECONDS);
const T0 = PREROLL_SECONDS; // page time 0 sits at this many seconds into the series
const tAt = (n: number) => n / FS - T0; // page time of sample n (negative during preroll)

/** Band-limited noise: a sum of k sinusoids in [f1, f2] with random phases. `pp` is roughly
 *  the typical peak-to-peak amplitude in µV. */
function bandNoise(r: Rand, f1: number, f2: number, pp: number, k = 8): Float64Array {
  const rms = pp / (2 * Math.SQRT2), a = rms / Math.sqrt(k / 2);
  const out = new Float64Array(N_TOTAL);
  for (let j = 0; j < k; j++) {
    const f = between(r, f1, f2), ph = between(r, 0, 2 * Math.PI);
    for (let n = 0; n < N_TOTAL; n++) out[n] += a * Math.sin(2 * Math.PI * f * n / FS + ph);
  }
  return out;
}

/** A slowly varying envelope between lo and hi (waxing and waning). */
function envelope(r: Rand, lo: number, hi: number): Float64Array {
  const e = bandNoise(r, 0.08, 0.35, 2, 4);
  let m = 0; for (const v of e) m = Math.max(m, Math.abs(v));
  return e.map(v => lo + (hi - lo) * (0.5 + 0.5 * v / (m || 1)));
}

/** A rhythm near frequency f with slight frequency drift and a waxing-waning envelope. */
function rhythm(r: Rand, f: number, pp: number): Float64Array {
  const drift = bandNoise(r, 0.05, 0.3, 0.06, 3); // about ±3% frequency wander
  const env = envelope(r, 0.45, 1);
  const out = new Float64Array(N_TOTAL);
  let ph = between(r, 0, 2 * Math.PI);
  for (let n = 0; n < N_TOTAL; n++) {
    ph += (2 * Math.PI * f * (1 + drift[n])) / FS;
    out[n] = (pp / 2) * env[n] * Math.sin(ph);
  }
  return out;
}

/** Asymmetric Gaussian bump: faster rise than fall, like the first criterion of an
 *  epileptiform transient in the IFCN glossary (Kane 2017). */
function bump(t: number, center: number, sigma: number, riseRatio = 0.7): number {
  const s = t < center ? sigma * riseRatio : sigma * (2 - riseRatio);
  return Math.exp(-((t - center) ** 2) / (2 * s * s));
}

export interface TransientSpec {
  t: number;          // page time of the sharp peak (s)
  sharpAmp: number;   // µV, signed (negative = surface-negative)
  sharpSigma: number; // s. Visible duration is about 4 sigma.
  slowAmp: number;    // µV, signed, the after-going slow wave
  slowSigma: number;  // s
  slowDelay: number;  // s after the sharp peak
}

/** Sharp transient with an after-going slow wave, added into `out`. */
function addTransient(out: Float64Array, s: TransientSpec) {
  const c = s.t + T0;
  const n0 = Math.max(0, Math.floor((c - 5 * s.sharpSigma) * FS));
  const n1 = Math.min(N_TOTAL, Math.ceil((c + s.slowDelay + 5 * s.slowSigma) * FS));
  for (let n = n0; n < n1; n++) {
    const t = n / FS;
    out[n] += s.sharpAmp * bump(t, c, s.sharpSigma) + s.slowAmp * bump(t, c + s.slowDelay, s.slowSigma, 1);
  }
}

/** Generalized spike-wave train from tStart to tEnd (page seconds), with frequency moving
 *  linearly from fStart to fEnd. Each cycle is a surface-negative spike, a brief positive
 *  phase, and a surface-negative slow wave. */
function spikeWaveTrain(opts: {
  tStart: number; tEnd: number; fStart: number; fEnd: number;
  spikeAmp: number; spikeSigma: number; waveAmp: number; jitter?: number; r: Rand;
}): { wave: Float64Array; cycles: number[] } {
  const out = new Float64Array(N_TOTAL);
  const cycles: number[] = [];
  let t = opts.tStart;
  while (t < opts.tEnd) {
    const frac = (t - opts.tStart) / (opts.tEnd - opts.tStart);
    const f = opts.fStart + (opts.fEnd - opts.fStart) * frac;
    const P = 1 / f;
    const amp = 0.8 + 0.2 * Math.sin(Math.PI * frac); // slightly larger mid-burst
    addTransient(out, {
      t, sharpAmp: opts.spikeAmp * amp, sharpSigma: opts.spikeSigma,
      slowAmp: opts.waveAmp * amp, slowSigma: 0.17 * P, slowDelay: 0.45 * P,
    });
    addTransient(out, { t: t + 0.05 + opts.spikeSigma, sharpAmp: 0.25 * Math.abs(opts.spikeAmp) * amp, sharpSigma: 0.02, slowAmp: 0, slowSigma: 0.1, slowDelay: 0 });
    cycles.push(t);
    t += P * (1 + (opts.jitter ?? 0) * gauss(opts.r));
  }
  return { wave: out, cycles };
}

// ── Scene ────────────────────────────────────────────────────────────────────────────────
/** A scalp field. Potential at an electrode = wave(t) × exp(−d² / 2σ²), where d is the
 *  distance from (x, y) on the unit disk. A dipole adds a second, opposite pole. */
interface Source {
  x: number; y: number; sigma: number; wave: Float64Array;
  dipole?: { x: number; y: number; sigma: number; ratio: number }; // second pole = −ratio × wave
}

export interface SceneEvent { t: number; label: string }

interface Scene { sources: Source[]; perElectrode: Float64Array[]; events: SceneEvent[] }

interface BackgroundSpec {
  pdrHz?: number;   // posterior dominant rhythm, omitted when absent
  pdrPP?: number;   // µV peak-to-peak at O1/O2
  thetaPP: number; deltaPP: number; betaPP: number; noisePP: number;
}

function background(r: Rand, b: BackgroundSpec): Scene {
  const sources: Source[] = [];
  if (b.pdrHz && b.pdrPP) {
    // Two occipital generators sharing a frequency with independent waxing and waning.
    for (const side of [-1, 1]) sources.push({ x: side * 0.3, y: -0.9, sigma: 0.45, wave: rhythm(r, b.pdrHz * (1 + side * 0.01), b.pdrPP) });
  }
  // Theta and delta from a few broad, independent regional generators.
  const regions = [[-0.5, 0.5], [0.5, 0.5], [-0.6, -0.2], [0.6, -0.2], [0, 0.1], [0, -0.6]];
  for (const [x, y] of regions) {
    sources.push({ x, y, sigma: 0.55, wave: bandNoise(r, 4, 7.5, b.thetaPP, 6) });
    sources.push({ x, y, sigma: 0.6, wave: bandNoise(r, 1, 3.5, b.deltaPP, 6) });
  }
  // Low-amplitude beta and a little broadband noise, independent at each electrode.
  const perElectrode = ELECTRODES.map(e => {
    const beta = bandNoise(r, 14, 25, b.betaPP * (e.y > 0.3 ? 1 : 0.6), 8);
    for (let n = 0; n < N_TOTAL; n++) beta[n] += (b.noisePP / 4) * gauss(r);
    return beta;
  });
  return { sources, perElectrode, events: [] };
}

function combine(scene: Scene): Float64Array[] {
  return ELECTRODES.map((e, i) => {
    const v = Float64Array.from(scene.perElectrode[i]);
    for (const s of scene.sources) {
      let g = Math.exp(-((e.x - s.x) ** 2 + (e.y - s.y) ** 2) / (2 * s.sigma ** 2));
      if (s.dipole) g -= s.dipole.ratio * Math.exp(-((e.x - s.dipole.x) ** 2 + (e.y - s.dipole.y) ** 2) / (2 * s.dipole.sigma ** 2));
      if (Math.abs(g) < 1e-4) continue;
      for (let n = 0; n < N_TOTAL; n++) v[n] += g * s.wave[n];
    }
    return v;
  });
}

// ── Presets ──────────────────────────────────────────────────────────────────────────────
export type PresetId = 'normal-child' | 'absence' | 'slow-spike-wave' | 'centrotemporal' | 'hypsarrhythmia';

export interface Preset {
  id: PresetId;
  label: string;          // button label
  title: string;          // figure title
  syndrome: boolean;      // shown in the pattern viewer
  sensitivity: number;    // default µV/mm
  note: string;           // one or two plain sentences shown under the figure
  sourceKey?: string;     // key in src/eeg/sources.ts for the note
  build: (r: Rand) => Scene;
}

// Spike vs sharp wave durations: spike 20 to under 70 ms, sharp wave 70 to 200 ms (IFCN
// glossary, Kane 2017). With the asymmetric bump above, visible duration ≈ 4 × sigma.

export const PRESETS: Preset[] = [
  {
    id: 'normal-child', label: 'Normal child', title: 'Normal awake child, 9 years, eyes closed',
    syndrome: false, sensitivity: 10, sourceKey: 'currentPractice',
    note: 'Posterior dominant rhythm at about 9 Hz, the mean value at age 9. Measure one cycle over O1 or O2 with the calipers.',
    // PDR 9 Hz: "mean 9 Hz by age 9" (Current Practice chapter, as cited in m04-normal-by-age).
    // PDR amplitude 60 µV peak-to-peak is a schematic choice, not from a registry source.
    build: r => background(r, { pdrHz: 9, pdrPP: 60, thetaPP: 18, deltaPP: 10, betaPP: 6, noisePP: 3 }),
  },
  {
    id: 'absence', label: '3 Hz spike-wave', title: 'Generalized 3 Hz spike-wave (childhood absence epilepsy pattern), 7 years',
    syndrome: true, sensitivity: 15, sourceKey: 'hirschE2022',
    note: 'Generalized spike-wave at about 3 Hz. The defining range is 2.5 to 4 Hz. Place the calipers on two consecutive spikes to measure it.',
    // Frequency 3 Hz, range 2.5 to 4 Hz (Hirsch E 2022, ILAE IGE definitions, via m09).
    // The train starts at 3.4 Hz and slows to 2.9 Hz across the 5 s burst. That slowing within
    // the discharge, the frontal-predominant field, and the amplitudes (spike 340 µV, wave
    // 380 µV at the field maximum, at Fz) are schematic choices for the owner to confirm. Spike sigma 11 ms gives a spike
    // about 50 ms wide (spike range per Kane 2017).
    build: r => {
      const sc = background(r, { pdrHz: 8.5, pdrPP: 55, thetaPP: 20, deltaPP: 12, betaPP: 6, noisePP: 3 });
      const sw = spikeWaveTrain({ tStart: 2.4, tEnd: 7.4, fStart: 3.4, fEnd: 2.9, spikeAmp: -340, spikeSigma: 0.011, waveAmp: -380, jitter: 0.01, r });
      sc.sources.push({ x: 0, y: 0.45, sigma: 0.5, wave: sw.wave });
      sc.events.push({ t: 2.4, label: 'spike-wave onset' }, ...sw.cycles.map(t => ({ t, label: 'spike' })));
      return sc;
    },
  },
  {
    id: 'slow-spike-wave', label: 'Slow spike-wave', title: 'Generalized slow spike-wave below 2.5 Hz (one Lennox-Gastaut pattern)',
    syndrome: true, sensitivity: 20, sourceKey: 'specchio2022',
    note: 'Generalized slow spike-wave below 2.5 Hz. Lennox-Gastaut syndrome also requires generalized paroxysmal fast activity, which this page does not show.',
    // Slow spike-wave below 2.5 Hz, and LGS needs paroxysmal fast activity too (Specchio 2022,
    // via m09). Here about 2 Hz, irregular (jitter 8%), with sharp waves (sigma 25 ms, about
    // 100 ms wide, sharp wave range per Kane 2017). The slow, theta-delta background with no
    // posterior rhythm and the amplitudes are schematic choices for the owner to confirm.
    build: r => {
      const sc = background(r, { thetaPP: 40, deltaPP: 45, betaPP: 5, noisePP: 3 });
      const sw = spikeWaveTrain({ tStart: 0.8, tEnd: 9.4, fStart: 2.1, fEnd: 1.9, spikeAmp: -220, spikeSigma: 0.025, waveAmp: -280, jitter: 0.08, r });
      sc.sources.push({ x: 0, y: 0.6, sigma: 0.55, wave: sw.wave });
      sc.events.push(...sw.cycles.map(t => ({ t, label: 'sharp wave' })));
      return sc;
    },
  },
  {
    id: 'centrotemporal', label: 'Centrotemporal spikes', title: 'Left centrotemporal spikes (SeLECTS pattern), 8 years',
    syndrome: true, sensitivity: 15, sourceKey: 'specchio2022',
    note: 'High-amplitude centrotemporal sharp-and-slow waves with a horizontal dipole, negative centrotemporal and positive frontal. Look for the phase reversal at T3 and C3 in the bipolar montage.',
    // Horizontal dipole, frontal positive and temporo-parietal negative (Specchio 2022, via m09).
    // Negative pole between C3 and T3, positive pole near F3 and Fp1 at 45% of the negative.
    // Sharp component sigma 20 ms (about 80 ms wide, in the sharp wave range of Kane 2017),
    // with an after-going slow wave. The amplitude (180 µV) and spike timing are schematic.
    build: r => {
      const sc = background(r, { pdrHz: 8.5, pdrPP: 55, thetaPP: 20, deltaPP: 12, betaPP: 6, noisePP: 3 });
      const wave = new Float64Array(N_TOTAL);
      for (const t of [1.3, 3.15, 4.05, 6.6, 8.3]) {
        addTransient(wave, { t, sharpAmp: -180 * between(r, 0.85, 1.1), sharpSigma: 0.02, slowAmp: -55, slowSigma: 0.07, slowDelay: 0.12 });
        sc.events.push({ t, label: 'centrotemporal spike' });
      }
      sc.sources.push({ x: -0.78, y: -0.05, sigma: 0.3, wave, dipole: { x: -0.4, y: 0.7, sigma: 0.38, ratio: 0.45 } });
      return sc;
    },
  },
  {
    id: 'hypsarrhythmia', label: 'Hypsarrhythmia-like', title: 'Hypsarrhythmia-like page, 7 months',
    syndrome: true, sensitivity: 30, sourceKey: 'zuberi2022',
    note: 'A chaotic, high-voltage, disorganized background with multifocal spikes. The definition of infantile epileptic spasms syndrome does not require hypsarrhythmia.',
    // "Chaotic, high-voltage, disorganized background with multifocal spikes", and
    // hypsarrhythmia is not required (Zuberi 2022, via m09). Ten independent focal slow
    // generators (0.7 to 3 Hz, 180 to 320 µV) and 24 spikes or sharp waves at random sites.
    // Amplitudes are schematic. No posterior rhythm is modeled.
    build: r => {
      const sc = background(r, { thetaPP: 50, deltaPP: 60, betaPP: 6, noisePP: 4 });
      for (let i = 0; i < 10; i++) {
        const e = ELECTRODES[Math.floor(r() * ELECTRODES.length)];
        sc.sources.push({ x: e.x + between(r, -0.15, 0.15), y: e.y + between(r, -0.15, 0.15), sigma: between(r, 0.35, 0.6), wave: bandNoise(r, 0.7, 3, between(r, 180, 320), 5) });
      }
      for (let i = 0; i < 24; i++) {
        const e = ELECTRODES[Math.floor(r() * ELECTRODES.length)];
        const wave = new Float64Array(N_TOTAL);
        const t = between(r, 0.3, 9.7);
        addTransient(wave, { t, sharpAmp: (r() < 0.85 ? -1 : 1) * between(r, 150, 300), sharpSigma: between(r, 0.01, 0.022), slowAmp: -between(r, 40, 100), slowSigma: 0.08, slowDelay: 0.1 });
        sc.sources.push({ x: e.x, y: e.y, sigma: 0.28, wave });
        sc.events.push({ t, label: `spike near ${e.name}` });
      }
      return sc;
    },
  },
];
export const presetById = (id: PresetId) => PRESETS.find(p => p.id === id)!;

// ── Page rendering ───────────────────────────────────────────────────────────────────────
export interface PageOptions {
  montage?: MontageId;
  filters?: FilterSettings;
  mains?: boolean;  // 60 Hz line noise, large at one high-impedance electrode (T4)
  seed?: number;
}
export interface Channel { label: string; data: Float64Array }
export interface Page { fs: number; seconds: number; channels: Channel[]; groupStarts: number[]; events: SceneEvent[] }

export const DEFAULT_SEED = 20261114;
export const MAINS_ELECTRODE = 'T4';

/** Raw electrode potentials (µV) including the preroll, before filtering. */
export function electrodePotentials(id: PresetId, mains = false, seed = DEFAULT_SEED): { data: Float64Array[]; events: SceneEvent[] } {
  const r = rng(seed ^ (PRESETS.findIndex(p => p.id === id) * 0x9e3779b1));
  const scene = presetById(id).build(r);
  const data = combine(scene);
  if (mains) {
    // Line noise: a little everywhere (slightly different at each electrode, so some survives
    // the bipolar subtraction), and a lot at one electrode, as with a poor-contact electrode.
    const rm = rng(seed + 60);
    data.forEach((v, i) => {
      const a = ELECTRODES[i].name === MAINS_ELECTRODE ? 40 : between(rm, 3, 8);
      const ph = between(rm, -0.3, 0.3);
      for (let n = 0; n < N_TOTAL; n++) v[n] += a * Math.sin(2 * Math.PI * MAINS_HZ * n / FS + ph);
    });
  }
  return { data, events: scene.events };
}

const pageCache = new Map<string, { data: Float64Array[]; events: SceneEvent[] }>();

/** One 10 s page: filtered electrode potentials derived into the chosen montage. */
export function renderPage(id: PresetId, opts: PageOptions = {}): Page {
  const montage = opts.montage ?? 'bipolar';
  const filters = opts.filters ?? DEFAULT_FILTERS;
  const seed = opts.seed ?? DEFAULT_SEED;
  const key = `${id}|${opts.mains ? 1 : 0}|${seed}`;
  let raw = pageCache.get(key);
  if (!raw) { raw = electrodePotentials(id, !!opts.mains, seed); pageCache.set(key, raw); if (pageCache.size > 24) pageCache.delete(pageCache.keys().next().value as string); }
  const start = T0 * FS;
  const filtered = raw.data.map(v => applyFilters(v, filters).slice(start, start + PAGE_SAMPLES));
  const E = (name: string) => filtered[EIDX[name]];
  let channels: Channel[], groupStarts: number[];
  if (montage === 'bipolar') {
    channels = BIPOLAR_PAIRS.map(([a, b]) => {
      const A = E(a), B = E(b);
      return { label: `${a}-${b}`, data: A.map((v, n) => v - B[n]) };
    });
    groupStarts = BIPOLAR_GROUP_STARTS;
  } else {
    const avg = new Float64Array(PAGE_SAMPLES);
    filtered.forEach(v => v.forEach((x, n) => { avg[n] += x / filtered.length; }));
    channels = ELECTRODES.map((e, i) => ({ label: `${e.name}-Avg`, data: filtered[i].map((v, n) => v - avg[n]) }));
    groupStarts = [0, 2, 7, 12, 17];
  }
  return { fs: FS, seconds: PAGE_SECONDS, channels, groupStarts, events: raw.events.filter(e => e.t >= 0 && e.t < PAGE_SECONDS) };
}

// ── Measurement helpers (used by the calipers and the tests) ─────────────────────────────
export function peakToPeak(x: ArrayLike<number>, n0 = 0, n1 = x.length): number {
  let lo = Infinity, hi = -Infinity;
  for (let n = Math.max(0, n0); n < Math.min(x.length, n1); n++) { lo = Math.min(lo, x[n]); hi = Math.max(hi, x[n]); }
  return hi - lo;
}

/** Power at frequency f by a single-bin DFT (mean-removed), µV². */
export function powerAt(x: ArrayLike<number>, f: number, fs = FS): number {
  let m = 0; for (let n = 0; n < x.length; n++) m += x[n]; m /= x.length;
  let re = 0, im = 0;
  for (let n = 0; n < x.length; n++) { const w = (2 * Math.PI * f * n) / fs; re += (x[n] - m) * Math.cos(w); im -= (x[n] - m) * Math.sin(w); }
  return (re * re + im * im) / (x.length * x.length);
}

/** Summed power over [f1, f2] in steps of df. */
export function bandPower(x: ArrayLike<number>, f1: number, f2: number, fs = FS, df = 0.1): number {
  let p = 0; for (let f = f1; f <= f2 + 1e-9; f += df) p += powerAt(x, f, fs); return p;
}

/** Frequency with the most power in [fmin, fmax]. */
export function dominantFrequency(x: ArrayLike<number>, fmin: number, fmax: number, fs = FS, df = 0.05): number {
  let best = fmin, bp = -1;
  for (let f = fmin; f <= fmax + 1e-9; f += df) { const p = powerAt(x, f, fs); if (p > bp) { bp = p; best = f; } }
  return best;
}
