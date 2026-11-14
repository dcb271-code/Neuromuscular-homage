'use client';

// CT window lab: a synthetic, schematic axial head CT of a child. The learner moves window
// width and level (or picks a preset) and probes any point for its Hounsfield value.
// Model: src/nrad/ctPhantom.ts. Tests: scripts/test-nrad-models.ts.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FIELD, LEVEL_MAX, LEVEL_MIN, PRESETS, REGIONS, grayFor, pixelToMm, rasterize, regionAt, sliderToWidth, widthToSlider,
  type RegionId,
} from '@/src/nrad/ctPhantom';
import { shortCite } from '@/src/nrad/sources';
import { WidgetFrame } from '@/components/loc/ui';

const COLS = 272, ROWS = Math.round((COLS * FIELD.h) / FIELD.w); // 1.6 px per mm
const STRIP: [RegionId, string][] = [['air', 'Air'], ['fat', 'Fat'], ['csf', 'CSF'], ['white', 'White matter'], ['gray', 'Gray matter'], ['sdh', 'Acute blood'], ['diploe', 'Diploë'], ['bone', 'Cortical bone']];

// Start the probe on the subdural crescent, the structure the windows are about.
function initialProbe() {
  const j = Math.round(ROWS / 2);
  for (let i = 0; i < COLS / 2; i++) { const { x, y } = pixelToMm(i, j, COLS, ROWS); if (regionAt(x, y) === 'sdh') return { i: i + 1, j }; }
  return { i: Math.round(COLS / 2), j };
}

export function CtWindowLab({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raster = useMemo(() => rasterize(COLS, ROWS), []);
  const [width, setWidth] = useState(80);
  const [level, setLevel] = useState(40);
  const [probe, setProbe] = useState<{ i: number; j: number } | null>(initialProbe);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const img = ctx.createImageData(COLS, ROWS);
    for (let k = 0; k < raster.length; k++) {
      const g = Math.round(grayFor(raster[k], width, level) * 255);
      img.data[k * 4] = g; img.data[k * 4 + 1] = g; img.data[k * 4 + 2] = g; img.data[k * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [raster, width, level]);

  const preset = PRESETS.find(p => p.width === width && p.level === level);
  const setPreset = (id: string) => { const p = PRESETS.find(x => x.id === id); if (p) { setWidth(p.width); setLevel(p.level); } };

  const probeAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(((e.clientX - r.left) / r.width) * COLS), j = Math.floor(((e.clientY - r.top) / r.height) * ROWS);
    if (i >= 0 && i < COLS && j >= 0 && j < ROWS) setProbe({ i, j });
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 8 : 2;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = d[e.key]; if (!m) return;
    e.preventDefault();
    setProbe(p => { const q = p ?? { i: COLS / 2, j: ROWS / 2 }; return { i: Math.min(COLS - 1, Math.max(0, q.i + m[0])), j: Math.min(ROWS - 1, Math.max(0, q.j + m[1])) }; });
  };

  const region = probe ? REGIONS[regionAt(pixelToMm(probe.i, probe.j, COLS, ROWS).x, pixelToMm(probe.i, probe.j, COLS, ROWS).y)] : null;
  const swatch = (hu: number) => { const g = Math.round(grayFor(hu, width, level) * 255); return `rgb(${g},${g},${g})`; };
  const lo = Math.round(level - width / 2), hi = Math.round(level + width / 2);

  return (
    <WidgetFrame accent={accent} label="CT window lab" subtitle="A synthetic, schematic head CT. Change the window and probe any point."
      footnote={<>Synthetic and schematic, not a patient image. Tissue values: {Array.from(new Set(Object.values(REGIONS).map(r => r.source).filter(s => s !== 'illustrative'))).map(shortCite).join(', ')}. Diploë, fracture and calcification values are illustrative. Presets: brain, subdural and bone from {shortCite('wang2021')}, narrow from {shortCite('lev1999')}.</>}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <div className="relative mx-auto w-full max-w-[340px]">
          <canvas ref={canvasRef} width={COLS} height={ROWS} tabIndex={0} onKeyDown={onKey}
            aria-label="Synthetic axial head CT. Use the arrow keys to move the probe."
            onPointerDown={probeAt} onPointerMove={e => { if (e.pointerType === 'mouse' || e.buttons) probeAt(e); }}
            className="block w-full h-auto rounded-xl bg-black outline-none focus-visible:ring-2"
            style={{ touchAction: 'pan-y', imageRendering: 'auto', cursor: 'crosshair' }} />
          {probe && (
            <div className="pointer-events-none absolute" aria-hidden="true"
              style={{ left: `${((probe.i + 0.5) / COLS) * 100}%`, top: `${((probe.j + 0.5) / ROWS) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: accent, boxShadow: '0 0 0 1px rgba(0,0,0,.6)' }} />
            </div>
          )}
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-300">R</span>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-300">L</span>
          <span className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-bold text-amber-300">A</span>
          <span className="pointer-events-none absolute left-2 bottom-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Synthetic · schematic</span>
        </div>

        <div className="min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 mb-3" aria-live="polite">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Under the probe</div>
            {region ? (
              <div className="flex items-center gap-2.5 mt-1">
                <span className="w-6 h-6 rounded border border-slate-300 shrink-0" style={{ background: swatch(region.hu) }} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">{region.label}</div>
                  <div className="text-[12px] text-slate-500"><span className="font-mono font-bold text-slate-800">{region.hu > 0 ? '+' : ''}{region.hu} HU</span> · {region.note}</div>
                </div>
              </div>
            ) : <div className="text-[12.5px] text-slate-500 mt-1">Tap or point at the image.</div>}
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

          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">How each tissue looks in this window</div>
          <div className="grid grid-cols-2 gap-1.5">
            {STRIP.map(([id, name]) => { const r = REGIONS[id]; return (
              <div key={id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <span className="w-5 h-5 rounded border border-slate-300 shrink-0" style={{ background: swatch(r.hu) }} />
                <span className="min-w-0 text-[11.5px] leading-tight text-slate-700"><span className="block truncate">{name}</span><span className="font-mono text-slate-400">{r.hu > 0 ? '+' : ''}{r.hu}</span></span>
              </div>
            ); })}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
