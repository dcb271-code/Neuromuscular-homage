'use client';

// CT window lab: real axial head CT slices stored with their measured Hounsfield values. The
// learner moves window width and level (or picks a preset) and probes any point for its value.
// Slices and landmarks: src/nrad/ctMarks.ts. Window arithmetic: src/nrad/ctPhantom.ts.
// Tests: scripts/test-nrad-models.ts.

import { useEffect, useRef, useState } from 'react';
import { LEVEL_MAX, LEVEL_MIN, PRESETS, grayFor, sliderToWidth, widthToSlider } from '@/src/nrad/ctPhantom';
import { LAB_SLICES, huCategory, landmarkNear, roiMean } from '@/src/nrad/ctMarks';
import { NRAD_ATTRIBUTIONS, ctImage } from '@/src/nrad/ctFigures';
import { shortCite } from '@/src/nrad/sources';
import { Segmented, WidgetFrame } from '@/components/loc/ui';

type SliceId = (typeof LAB_SLICES)[number]['id'];
const fmt = (hu: number) => `${hu > 0 ? '+' : ''}${Math.round(hu)}`;
const startOf = (id: SliceId) => { const s = LAB_SLICES.find(x => x.id === id)!; const [x, y] = s.landmarks.find(m => m.id === s.start)!.at; return { x, y }; };

export function CtWindowLab({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sliceId, setSliceId] = useState<SliceId>(LAB_SLICES[0].id);
  const [volumes, setVolumes] = useState<Record<string, Int16Array>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [width, setWidth] = useState(80);
  const [level, setLevel] = useState(40);
  const [probe, setProbe] = useState(() => startOf(LAB_SLICES[0].id));

  const slice = LAB_SLICES.find(s => s.id === sliceId)!;
  const im = ctImage(sliceId);
  const hu = volumes[sliceId];

  // Fetch the Hounsfield values of a slice the first time it is shown: 16-bit signed integers,
  // little-endian, one per pixel, row by row.
  useEffect(() => {
    if (hu || failed[sliceId] || !im.bin) return;
    let live = true;
    fetch(im.bin)
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.arrayBuffer(); })
      .then(buf => {
        if (buf.byteLength !== im.w * im.h * 2) throw new Error('unexpected size');
        const view = new DataView(buf), out = new Int16Array(im.w * im.h);
        for (let k = 0; k < out.length; k++) out[k] = view.getInt16(k * 2, true);
        if (live) setVolumes(v => ({ ...v, [sliceId]: out }));
      })
      .catch(() => { if (live) setFailed(f => ({ ...f, [sliceId]: true })); });
    return () => { live = false; };
  }, [sliceId, hu, failed, im.bin, im.w, im.h]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv || !hu) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const img = ctx.createImageData(im.w, im.h);
    for (let k = 0; k < hu.length; k++) {
      const g = Math.round(grayFor(hu[k], width, level) * 255);
      img.data[k * 4] = g; img.data[k * 4 + 1] = g; img.data[k * 4 + 2] = g; img.data[k * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [hu, im.w, im.h, width, level]);

  const preset = PRESETS.find(p => p.width === width && p.level === level);
  const setPreset = (id: string) => { const p = PRESETS.find(x => x.id === id); if (p) { setWidth(p.width); setLevel(p.level); } };
  const pickSlice = (id: SliceId) => { setSliceId(id); setProbe(startOf(id)); };

  const probeAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * im.w), y = Math.floor(((e.clientY - r.top) / r.height) * im.h);
    if (x >= 0 && x < im.w && y >= 0 && y < im.h) setProbe({ x, y });
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 6 : 1;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = d[e.key]; if (!m) return;
    e.preventDefault();
    setProbe(p => ({ x: Math.min(im.w - 1, Math.max(0, p.x + m[0])), y: Math.min(im.h - 1, Math.max(0, p.y + m[1])) }));
  };

  const swatch = (v: number) => { const g = Math.round(grayFor(v, width, level) * 255); return `rgb(${g},${g},${g})`; };
  const lo = Math.round(level - width / 2), hi = Math.round(level + width / 2);
  const value = hu ? roiMean(hu, im.w, im.h, probe.x, probe.y) : null;
  const near = landmarkNear(slice, probe.x, probe.y);
  const category = value === null ? null : huCategory(value);
  const boxMm = (5 * (im.mmPerPx ?? 0.5)).toFixed(1);

  return (
    <WidgetFrame accent={accent} label="CT window lab" subtitle="A real head CT with its measured Hounsfield values. Change the window and probe any point."
      footnote={<>Real CT slices from the CQ500 dataset ({shortCite('chilamkurthy2018')}), stored with their measured Hounsfield values. The files carry no ages, and most patients in the dataset are adults. On these two scans gray and white matter measure a few HU higher than the pediatric values in the text. Pixels outside the head were set to air when the scanner table was removed. R and L follow the radiological convention, so the patient&apos;s right is on the image left. Presets: brain, subdural and bone from {shortCite('wang2021')}, narrow from {shortCite('lev1999')}.</>}>
      <div className="mb-3"><Segmented value={sliceId} onChange={pickSlice} accent={accent} options={LAB_SLICES.map(s => ({ id: s.id, label: s.label }))} /></div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <div className="mx-auto w-full max-w-[340px]">
          <div className="relative">
            <canvas key={sliceId} ref={canvasRef} width={im.w} height={im.h} tabIndex={0} onKeyDown={onKey}
              aria-label={`Axial head CT. ${slice.about} Use the arrow keys to move the probe.`}
              onPointerDown={probeAt} onPointerMove={e => { if (e.pointerType === 'mouse' || e.buttons) probeAt(e); }}
              className="block w-full h-auto rounded-xl bg-black outline-none focus-visible:ring-2"
              style={{ touchAction: 'pan-y', cursor: 'crosshair', backgroundImage: `url(${im.file})`, backgroundSize: '100% 100%' }} />
            <div className="pointer-events-none absolute" aria-hidden="true"
              style={{ left: `${((probe.x + 0.5) / im.w) * 100}%`, top: `${((probe.y + 0.5) / im.h) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: accent, boxShadow: '0 0 0 1px rgba(0,0,0,.7), inset 0 0 0 1px rgba(0,0,0,.5)' }} />
            </div>
            <span className="pointer-events-none absolute left-2 top-1.5 text-[11px] font-bold text-slate-300" aria-hidden="true">R</span>
            <span className="pointer-events-none absolute right-2 top-1.5 text-[11px] font-bold text-slate-300" aria-hidden="true">L</span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-slate-600">{slice.about}</p>
          <p className="mt-1 text-[10.5px] text-slate-400">{im.credit} · <a href={NRAD_ATTRIBUTIONS} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accent }}>{im.licence}</a></p>
        </div>

        <div className="min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 mb-3" aria-live="polite">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Under the probe</div>
            {value !== null && category ? (
              <div className="flex items-start gap-2.5 mt-1">
                <span className="w-6 h-6 rounded border border-slate-300 shrink-0 mt-0.5" style={{ background: swatch(value) }} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">{near ? near.label : category.label}</div>
                  <div className="text-[12px] text-slate-500"><span className="font-mono font-bold text-slate-800">{fmt(value)} HU</span> · mean of a box {boxMm} mm across</div>
                  <div className="text-[12px] text-slate-500 leading-snug mt-0.5">{near?.note ?? category.note}</div>
                </div>
              </div>
            ) : (
              <div className="text-[12.5px] text-slate-500 mt-1">{failed[sliceId] ? 'The Hounsfield values did not load, so the picture is fixed on a brain window.' : 'Loading the Hounsfield values.'}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Window presets">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => setPreset(p.id)} aria-pressed={preset?.id === p.id}
                className="rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold leading-tight"
                style={{ background: preset?.id === p.id ? accent : '#fff', color: preset?.id === p.id ? '#fff' : '#334155', borderColor: preset?.id === p.id ? accent : '#e2e8f0' }}>
                {p.label} <span className="font-mono font-normal opacity-80">W{p.width}/L{p.level}</span>
              </button>
            ))}
          </div>

          <label className="block mb-2">
            <span className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400"><span>Window width</span><span className="font-mono normal-case text-slate-700">W {width}</span></span>
            <input type="range" min={0} max={1000} value={widthToSlider(width)} onChange={e => setWidth(sliderToWidth(Number(e.target.value)))}
              className="w-full" style={{ accentColor: accent }} aria-label="Window width" />
          </label>
          <label className="block mb-3">
            <span className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400"><span>Window level</span><span className="font-mono normal-case text-slate-700">L {level}</span></span>
            <input type="range" min={LEVEL_MIN} max={LEVEL_MAX} step={1} value={level} onChange={e => setLevel(Number(e.target.value))}
              className="w-full" style={{ accentColor: accent }} aria-label="Window level" />
          </label>
          <p className="text-[12px] text-slate-500 mb-3 leading-snug">
            Black below <span className="font-mono text-slate-700">{lo}</span> HU, white above <span className="font-mono text-slate-700">{hi}</span> HU, and every shade of gray squeezed in between.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 mb-3 text-[12.5px] leading-relaxed text-slate-600">
            {preset ? (
              <>
                <div><b className="text-slate-800">{preset.label} window shows:</b> {preset.shows}</div>
                <div className="mt-1"><b className="text-slate-800">It hides:</b> {preset.hides}</div>
              </>
            ) : <div>A custom window. Narrow it to stretch a few HU across the whole gray scale, or widen it to fit bone and air on the same image.</div>}
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Measured on this slice, and how each looks in this window</div>
          <div className="grid grid-cols-2 gap-1.5">
            {slice.landmarks.map(m => {
              const v = hu ? roiMean(hu, im.w, im.h, m.at[0], m.at[1]) : null;
              const on = near?.id === m.id;
              return (
                <button key={m.id} onClick={() => setProbe({ x: m.at[0], y: m.at[1] })} aria-pressed={on}
                  className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 text-left"
                  style={{ borderColor: on ? accent : '#e2e8f0', boxShadow: on ? `0 0 0 1px ${accent}` : undefined }}>
                  <span className="w-5 h-5 rounded border border-slate-300 shrink-0" style={{ background: v === null ? '#e2e8f0' : swatch(v) }} />
                  <span className="min-w-0 text-[11.5px] leading-tight text-slate-700"><span className="block">{m.label}</span><span className="font-mono text-slate-400">{v === null ? ' ' : `${fmt(v)} HU`}</span></span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
