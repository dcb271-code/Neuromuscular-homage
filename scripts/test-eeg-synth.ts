// Tests for the synthetic EEG page model.
//   npx tsx scripts/test-eeg-synth.ts
import {
  renderPage, PRESETS, BIPOLAR_PAIRS, FS, PAGE_SAMPLES, DEFAULT_FILTERS,
  dominantFrequency, bandPower, powerAt, peakToPeak, type Page,
} from '../src/eeg/synth';

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' — ' + detail : ''}`); } };
const ch = (p: Page, label: string) => { const c = p.channels.find(c => c.label === label); if (!c) throw new Error(label); return c.data; };
const seg = (x: Float64Array, t0: number, t1: number) => x.slice(Math.round(t0 * FS), Math.round(t1 * FS));
const maxSlope = (x: ArrayLike<number>) => { let m = 0; for (let n = 1; n < x.length; n++) m = Math.max(m, Math.abs(x[n] - x[n - 1])); return m * FS; };

// ── Montage shape
const bp = renderPage('normal-child');
t('bipolar montage has 18 channels', bp.channels.length === 18 && BIPOLAR_PAIRS.length === 18);
t('average montage has 19 channels', renderPage('normal-child', { montage: 'average' }).channels.length === 19);
t('a page is 10 s at 256 Hz', bp.channels.every(c => c.data.length === PAGE_SAMPLES) && PAGE_SAMPLES === 2560);
t('every preset renders finite values', PRESETS.every(p => renderPage(p.id).channels.every(c => c.data.every(Number.isFinite))));
t('every preset default sensitivity is a standard choice', PRESETS.every(p => [7, 10, 15, 20, 30, 50].includes(p.sensitivity)));

// ── Determinism
const a1 = renderPage('hypsarrhythmia', { seed: 7 }), a2 = renderPage('hypsarrhythmia', { seed: 7 }), a3 = renderPage('hypsarrhythmia', { seed: 8 });
t('same seed gives the same output', a1.channels.every((c, i) => c.data.every((v, n) => v === a2.channels[i].data[n])));
t('a different seed gives different output', a1.channels[0].data.some((v, n) => v !== a3.channels[0].data[n]));

// ── Normal child: posterior dominant rhythm near 9 Hz, about 50 to 100 µV
const pdr = dominantFrequency(ch(bp, 'P3-O1'), 6, 13);
t('normal child: PDR at O1 is 8.5 to 9.5 Hz', pdr >= 8.5 && pdr <= 9.5, `${pdr.toFixed(2)} Hz`);
const pdrPost = bandPower(ch(bp, 'P3-O1'), 8, 10), pdrFront = bandPower(ch(bp, 'Fp1-F3'), 8, 10);
const o1pp = peakToPeak(ch(renderPage('normal-child', { montage: 'average' }), 'O1-Avg')), t5o1 = peakToPeak(ch(bp, 'T5-O1'));
t('normal child: PDR amplitude is in the pediatric range (about 50 to 120 µV)', o1pp >= 50 && o1pp <= 120 && t5o1 >= 50 && t5o1 <= 120, `O1-Avg ${o1pp.toFixed(0)}, T5-O1 ${t5o1.toFixed(0)}`);
t('normal child: alpha is larger posteriorly than frontally', pdrPost > 4 * pdrFront, `${pdrPost.toFixed(1)} vs ${pdrFront.toFixed(1)}`);

// ── 3 Hz spike-wave
const abs = renderPage('absence');
const absF = dominantFrequency(seg(ch(abs, 'F3-C3'), 1.6, 8.6), 1, 8);
t('absence: dominant frequency during the burst is 2.5 to 4 Hz', absF >= 2.5 && absF <= 4, `${absF.toFixed(2)} Hz`);
const cyc = abs.events.filter(e => e.label === 'spike').map(e => e.t);
const meanF = (cyc.length - 1) / (cyc[cyc.length - 1] - cyc[0]);
t('absence: mean spike repetition rate is 2.5 to 4 Hz', meanF >= 2.5 && meanF <= 4, meanF.toFixed(2));
t('absence: burst is much larger than the background before it', peakToPeak(seg(ch(abs, 'F3-C3'), 3, 6)) > 3 * peakToPeak(seg(ch(abs, 'F3-C3'), 0.1, 1.4)));
const firstF = 1 / (cyc[1] - cyc[0]), lastF = 1 / (cyc[cyc.length - 1] - cyc[cyc.length - 2]);
t('absence: faster at onset than at the end, both within 2.5 to 4 Hz', firstF > lastF && firstF <= 4 && lastF >= 2.5, `${firstF.toFixed(2)} to ${lastF.toFixed(2)} Hz`);
const absAvg = renderPage('absence', { montage: 'average' });
t('absence: frontal predominance (Fz larger than O1 in average reference)', peakToPeak(seg(ch(absAvg, 'Fz-Avg'), 3, 6)) > 1.5 * peakToPeak(seg(ch(absAvg, 'O1-Avg'), 3, 6)));
t('absence: discharge is seen in both hemispheres', peakToPeak(seg(ch(abs, 'F4-C4'), 3, 6)) > 0.7 * peakToPeak(seg(ch(abs, 'F3-C3'), 3, 6)));

// ── Slow spike-wave
const lgs = renderPage('slow-spike-wave');
const lgsF = dominantFrequency(seg(ch(lgs, 'F3-C3'), 0.8, 9.4), 0.8, 8);
t('slow spike-wave: dominant frequency is below 2.5 Hz', lgsF < 2.5 && lgsF > 1, `${lgsF.toFixed(2)} Hz`);
const sc = lgs.events.map(e => e.t); const lgsRate = (sc.length - 1) / (sc[sc.length - 1] - sc[0]);
t('slow spike-wave: repetition rate below 2.5 Hz', lgsRate < 2.5, lgsRate.toFixed(2));

// ── Centrotemporal spikes: phase reversal at T3 and C3 in the bipolar montage
const cts = renderPage('centrotemporal');
const reversalOK = cts.events.every(ev => {
  // Find the sample of largest |F7-T3| within ±60 ms of the spike.
  const x = ch(cts, 'F7-T3'); let best = Math.round(ev.t * FS);
  for (let n = Math.round((ev.t - 0.06) * FS); n <= Math.round((ev.t + 0.06) * FS); n++) if (Math.abs(x[n]) > Math.abs(x[best])) best = n;
  const v = (l: string) => ch(cts, l)[best];
  return v('F7-T3') > 0 && v('T3-T5') < 0 && v('F3-C3') > 0 && v('C3-P3') < 0;
});
t('centrotemporal: negative phase reversal at T3 and at C3 for every spike', reversalOK);
const ctsLeft = peakToPeak(ch(cts, 'F7-T3')), ctsRight = peakToPeak(ch(cts, 'F8-T4'));
t('centrotemporal: left-sided (F7-T3 much larger than F8-T4)', ctsLeft > 3 * ctsRight, `${ctsLeft.toFixed(0)} vs ${ctsRight.toFixed(0)}`);
const ctsAvg = renderPage('centrotemporal', { montage: 'average' });
const at = Math.round(cts.events[0].t * FS);
const pk = (l: string) => { const x = ch(ctsAvg, l); let m = 0; for (let n = at - 10; n <= at + 10; n++) if (Math.abs(x[n]) > Math.abs(m)) m = x[n]; return m; };
t('centrotemporal: horizontal dipole, T3 negative and F3 positive in average reference', pk('T3-Avg') < 0 && pk('F3-Avg') > 0, `${pk('T3-Avg').toFixed(0)}, ${pk('F3-Avg').toFixed(0)}`);

// ── Hypsarrhythmia-like
const hyp = renderPage('hypsarrhythmia', { montage: 'average' });
const hypPP = Math.max(...hyp.channels.map(c => peakToPeak(c.data)));
t('hypsarrhythmia: high voltage (some channel over 200 µV peak-to-peak)', hypPP > 200, hypPP.toFixed(0));
// 2021 BASED score (Mytinger 2021): over 200 µV in most bipolar channels, excluding midline and
// occipital, and over 300 µV in T3-T5 and T4-T6. Measured with HFF 15 Hz so the spikes count less.
const hypB = renderPage('hypsarrhythmia', { filters: { ...DEFAULT_FILTERS, hff: 15 } });
const lateral = hypB.channels.filter(c => !/^(Fz|Cz)|O[12]$/.test(c.label));
const over200 = lateral.filter(c => peakToPeak(c.data) > 200).length;
t('hypsarrhythmia: over 200 µV in most lateral bipolar channels', over200 > lateral.length / 2, `${over200}/${lateral.length}`);
t('hypsarrhythmia: over 300 µV in T3-T5 and T4-T6', peakToPeak(ch(hypB, 'T3-T5')) > 300 && peakToPeak(ch(hypB, 'T4-T6')) > 300);
const ctsAmp = peakToPeak(seg(ch(cts, 'F7-T3'), cts.events[0].t - 0.1, cts.events[0].t + 0.1));
t('centrotemporal: spike amplitude 100 to 300 µV in F7-T3', ctsAmp >= 100 && ctsAmp <= 300, ctsAmp.toFixed(0));

// ── Filters
const lgsLow = renderPage('slow-spike-wave', { filters: { ...DEFAULT_FILTERS, lff: 0.3 } });
const lgsHigh = renderPage('slow-spike-wave', { filters: { ...DEFAULT_FILTERS, lff: 5 } });
const dLow = bandPower(ch(lgsLow, 'F3-C3'), 0.5, 3), dHigh = bandPower(ch(lgsHigh, 'F3-C3'), 0.5, 3);
t('raising LFF from 0.3 to 5 Hz reduces delta power by more than 70%', dHigh < 0.3 * dLow, `${dLow.toFixed(0)} to ${dHigh.toFixed(0)}`);
const d05 = bandPower(ch(renderPage('slow-spike-wave', { filters: { ...DEFAULT_FILTERS, lff: 0.5 } }), 'F3-C3'), 0.5, 3);
const d1 = bandPower(ch(renderPage('slow-spike-wave', { filters: { ...DEFAULT_FILTERS, lff: 1 } }), 'F3-C3'), 0.5, 3);
t('delta power falls monotonically as LFF rises', dLow > d05 && d05 > d1 && d1 > dHigh);

const cts70 = ch(renderPage('centrotemporal', { filters: { ...DEFAULT_FILTERS, hff: 70 } }), 'F7-T3');
const cts15 = ch(renderPage('centrotemporal', { filters: { ...DEFAULT_FILTERS, hff: 15 } }), 'F7-T3');
t('HFF 15 reduces the spike peak', peakToPeak(cts15) < 0.92 * peakToPeak(cts70), `${peakToPeak(cts70).toFixed(0)} to ${peakToPeak(cts15).toFixed(0)}`);
t('HFF 15 reduces spike sharpness (max slope) by more than 20%', maxSlope(cts15) < 0.8 * maxSlope(cts70), `${maxSlope(cts70).toFixed(0)} to ${maxSlope(cts15).toFixed(0)} µV/s`);

const mOff = ch(renderPage('normal-child', { mains: true }), 'F8-T4');
const mOn = ch(renderPage('normal-child', { mains: true, filters: { ...DEFAULT_FILTERS, notch: true } }), 'F8-T4');
const clean = ch(renderPage('normal-child'), 'F8-T4');
t('mains artifact adds 60 Hz power', powerAt(mOff, 60) > 100 * powerAt(clean, 60));
t('notch removes more than 99% of 60 Hz power', powerAt(mOn, 60) < 0.01 * powerAt(mOff, 60), `${powerAt(mOff, 60).toFixed(1)} to ${powerAt(mOn, 60).toFixed(3)}`);
t('notch leaves the 9 Hz rhythm nearly unchanged', Math.abs(bandPower(mOn, 8, 10) / bandPower(clean, 8, 10) - 1) < 0.1);
const hf35 = ch(renderPage('normal-child', { mains: true, filters: { ...DEFAULT_FILTERS, hff: 35 } }), 'F8-T4');
t('HFF 35 attenuates 60 Hz but less completely than the notch', powerAt(hf35, 60) < powerAt(mOff, 60) && powerAt(hf35, 60) > powerAt(mOn, 60));

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
