// Pure model behind the montage lab: a single scalp source on a longitudinal chain, and the
// referential and bipolar channels computed from the SAME potentials. No I/O, no DOM.

export const CHAIN = ['Fp1', 'F3', 'C3', 'P3', 'O1'] as const;
export type Electrode = (typeof CHAIN)[number];

export interface SourceSpec {
  position: number;   // 0..4 along the chain (electrode index; fractions allowed)
  polarity: -1 | 1;   // -1 = surface-negative (the usual epileptiform case)
  spread: number;     // field width in electrode spacings (sigma of a Gaussian)
  amplitude?: number; // microvolts at the maximum (display only)
}

export interface MontageResult {
  potentials: number[];            // V at each electrode, reference = 0
  referential: { label: string; value: number }[];   // Ei − Ref
  bipolar: { label: string; value: number }[];       // Ei − Ei+1
  maxElectrode: number;            // index of the electrode with the largest |V|
  reversal: { at: number; kind: 'negative' | 'positive' } | null; // bipolar phase reversal
  endOfChain: boolean;             // maximum is at Fp1 or O1, so no reversal is possible
}

export function scalpPotentials(src: SourceSpec): number[] {
  const A = src.amplitude ?? 100;
  return CHAIN.map((_, i) => src.polarity * A * Math.exp(-((i - src.position) ** 2) / (2 * src.spread ** 2)));
}

export function computeMontages(src: SourceSpec): MontageResult {
  const V = scalpPotentials(src);
  const referential = CHAIN.map((e, i) => ({ label: `${e}-Ref`, value: V[i] }));
  const bipolar = CHAIN.slice(0, -1).map((e, i) => ({ label: `${e}-${CHAIN[i + 1]}`, value: V[i] - V[i + 1] }));
  let maxElectrode = 0;
  V.forEach((v, i) => { if (Math.abs(v) > Math.abs(V[maxElectrode])) maxElectrode = i; });

  // Negative reversal at electrode k: channel k-1 (Ek-1 − Ek) is positive (drawn down) and
  // channel k (Ek − Ek+1) is negative (drawn up): the deflections point toward each other.
  let reversal: MontageResult['reversal'] = null;
  for (let k = 1; k < CHAIN.length - 1; k++) {
    const a = bipolar[k - 1].value, b = bipolar[k].value;
    const eps = 1e-6;
    if (a > eps && b < -eps) { reversal = { at: k, kind: 'negative' }; break; }
    if (a < -eps && b > eps) { reversal = { at: k, kind: 'positive' }; break; }
  }
  const endOfChain = maxElectrode === 0 || maxElectrode === CHAIN.length - 1;
  return { potentials: V, referential, bipolar, maxElectrode, reversal, endOfChain };
}

/** Shape of a sharp transient with an after-going slow wave, sampled over [0,1]. Peak = 1. */
export function transientShape(n = 60): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const spike = Math.exp(-((t - 0.3) ** 2) / (2 * 0.035 ** 2));
    const slow = 0.35 * Math.exp(-((t - 0.55) ** 2) / (2 * 0.12 ** 2));
    out.push(spike + slow);
  }
  return out;
}
