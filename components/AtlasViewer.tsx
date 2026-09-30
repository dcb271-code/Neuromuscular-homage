'use client';

// Pediatric brain MRI atlas viewer (NiiVue).
// Data comes from public/atlas/, built by scripts/prepare_atlas.py.

import { useEffect, useRef, useState } from 'react';
import type { Niivue } from '@niivue/niivue';

type FileSet = { full: string; preview?: string; colormap?: string; bytes: number; preview_bytes?: number; voxel_mm?: number[] };
type Age = { id: string; label: string; detail: string; template: string; files: Record<string, FileSet> };
type TemplateMeta = { name: string; authors: string; citation: string; links: string[]; license: string; license_url: string | null };
type Manifest = { default: string; ages: Age[]; templates: Record<string, TemplateMeta> };
type LabelMap = { R: number[]; G: number[]; B: number[]; A: number[]; I: number[]; labels: string[] };

// NiiVue samples its label lookup table at the edge of entry 0, so the background picks up a
// faint tint from label 1 (red). A transparent entry below 0 keeps the background clear.
function padLabelColormap(cm: LabelMap): LabelMap {
  return {
    R: [0, ...cm.R], G: [0, ...cm.G], B: [0, ...cm.B], A: [0, ...cm.A],
    I: [-1, ...cm.I], labels: ['', ...cm.labels],
  };
}

const BASE = '/atlas';
const ACCENT = '#7c3aed';

const GROUPS: { name: string; ids: string[] }[] = [
  { name: 'Neonate', ids: ['pma36w', 'pma40w'] },
  { name: 'Infant', ids: ['m06', 'm12', 'm24'] },
  { name: 'Infant · labelled', ids: ['unc1y', 'unc2y'] },
  { name: 'Child', ids: ['y4to8'] },
  { name: 'Adolescent', ids: ['y13to18'] },
];

const PLANES = [
  { label: '3-plane', value: 3 },
  { label: 'Axial', value: 0 },
  { label: 'Coronal', value: 1 },
  { label: 'Sagittal', value: 2 },
];

const LABEL_OPACITY = 0.45;

// Phones get the downsampled preview only for sub-millimetre templates (the 0.5 mm neonatal
// ones, whose preview is still 1 mm). The 1 mm templates are small enough to send in full.
function shouldPreview(f: FileSet | undefined, mobile: boolean): boolean {
  return !!f && mobile && !!f.preview && (f.voxel_mm?.[0] ?? 1) < 0.9;
}

export default function AtlasViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nvRef = useRef<Niivue | null>(null);
  const labelMapRef = useRef<LabelMap | null>(null);          // map for the loaded age
  const labelCacheRef = useRef<Record<string, LabelMap>>({});
  const hasLabelVolRef = useRef(false);
  const loadedAgeRef = useRef<string | null>(null);

  const [ready, setReady] = useState(false);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [ageId, setAgeId] = useState('pma40w');
  const [contrast, setContrast] = useState<'T1w' | 'T2w'>('T2w');
  const [plane, setPlane] = useState(3);
  const planeRef = useRef(3);
  const [railPlane, setRailPlane] = useState(0); // 0 axial, 1 coronal, 2 sagittal (NiiVue SLICE_TYPE)
  const [frac, setFrac] = useState<[number, number, number]>([0.5, 0.5, 0.5]);
  const [showLabels, setShowLabels] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [where, setWhere] = useState<{ mm: string; structure: string | null }>({ mm: '', structure: null });

  // Create NiiVue once. Imported dynamically: it needs window/WebGL, so it can't run during prerender.
  useEffect(() => {
    let disposed = false;
    setMobile(window.matchMedia('(max-width: 640px)').matches);

    fetch(`${BASE}/manifest.json`)
      .then(r => r.json())
      .then((m: Manifest) => { if (!disposed) { setManifest(m); setAgeId(m.default); } })
      .catch(() => setError('Could not load the atlas manifest.'));
    (async () => {
      try {
        const { Niivue, SHOW_RENDER } = await import('@niivue/niivue');
        if (disposed || !canvasRef.current) return;
        const nv = new Niivue({
          backColor: [0, 0, 0, 1],
          show3Dcrosshair: true,
          crosshairColor: [0.49, 0.36, 0.93, 0.9],
          isOrientationTextVisible: true,
          sagittalNoseLeft: true, // radiology convention: face left, cerebellum right
          multiplanarShowRender: SHOW_RENDER.NEVER,
        });
        nv.onLocationChange = (raw: unknown) => {
          const d = raw as { mm: number[]; frac: number[]; axCorSag: number; values: { value: number }[] };
          if (d.frac) setFrac([d.frac[0], d.frac[1], d.frac[2]]);
          // In 3-plane view the slice rail follows whichever pane was last touched.
          if (planeRef.current === 3 && d.axCorSag >= 0 && d.axCorSag <= 2) setRailPlane(d.axCorSag);
          const mm = d.mm ? `${d.mm.slice(0, 3).map(v => v.toFixed(0)).join(', ')} mm` : '';
          let structure: string | null = null;
          if (hasLabelVolRef.current && d.values?.[1]) {
            const idx = Math.round(d.values[1].value);
            structure = idx > 0 ? labelMapRef.current?.labels[idx] || null : null;
          }
          setWhere({ mm, structure });
        };
        // NiiVue 0.69 derives decimal places from the scene's field of view. While volumes are
        // being swapped the scene is empty, the field of view is 0, and toFixed(Infinity) throws.
        // Skip location updates in that window instead of letting the error escape.
        const nvAny = nv as unknown as { createOnLocationChange: (a?: number) => void };
        const createOnLocationChange = nvAny.createOnLocationChange.bind(nv);
        nvAny.createOnLocationChange = (a?: number) => {
          if (!nv.volumes.length) return;
          try { createOnLocationChange(a); } catch { /* transient: scene not ready */ }
        };
        await nv.attachToCanvas(canvasRef.current);
        nv.setRadiologicalConvention(true);
        nv.setSliceType(3);
        nvRef.current = nv;
        setReady(true);
      } catch {
        setError('This browser could not start the WebGL2 viewer.');
      }
    })();

    return () => {
      disposed = true;
      try { nvRef.current?.cleanup(); } catch { /* already gone */ }
      nvRef.current = null;
    };
  }, []);

  const age = manifest?.ages.find(a => a.id === ageId);
  const hasLabels = !!age?.files.labels;
  // Some templates (UNC) are T1 only; fall back without forgetting the user's choice.
  const activeContrast: 'T1w' | 'T2w' = age && !age.files[contrast] ? (age.files.T1w ? 'T1w' : 'T2w') : contrast;

  // (Re)load volumes when the age, contrast, or resolution changes.
  useEffect(() => {
    const nv = nvRef.current;
    if (!ready || !nv || !age) return;
    const pick = (f: FileSet) => `${BASE}/${shouldPreview(f, mobile) ? f.preview : f.full}`;
    const vols: { url: string; opacity?: number; colormap?: string }[] = [
      { url: pick(age.files[activeContrast]), colormap: 'gray' },
    ];
    const lab = age.files.labels;
    // The label volume always loads when available, hidden unless "Structures" is on,
    // so the readout can name the structure under the crosshair either way.
    if (lab) vols.push({ url: pick(lab), opacity: showLabels ? LABEL_OPACITY : 0 });
    let cancelled = false;
    setLoading(true);
    hasLabelVolRef.current = false;
    nv.loadVolumes(vols)
      .then(async () => {
        if (cancelled) return;
        if (lab?.colormap && nv.volumes[1]) {
          const cm = labelCacheRef.current[lab.colormap]
            ?? await fetch(`${BASE}/${lab.colormap}`).then(r => r.json());
          if (cancelled) return;
          labelCacheRef.current[lab.colormap] = cm;
          labelMapRef.current = cm;
          nv.volumes[1].setColormapLabel(padLabelColormap(cm));
          nv.updateGLVolume();
          hasLabelVolRef.current = true;
        }
        // Templates differ in field of view, so a crosshair carried over from another age can
        // land outside the head. Re-centre on age changes; keep position on T1/T2 switches.
        if (loadedAgeRef.current !== age.id) {
          nv.scene.crosshairPos = [0.5, 0.5, 0.5];
          nv.createOnLocationChange();
          nv.drawScene();
          loadedAgeRef.current = age.id;
        }
        setWhere({ mm: '', structure: null });
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setError('Could not load this template.'); setLoading(false); } });
    return () => { cancelled = true; };
    // showLabels is applied by the opacity effect below without a reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, age, activeContrast, mobile]);

  useEffect(() => {
    const nv = nvRef.current;
    if (!nv || loading || nv.volumes.length < 2) return;
    nv.setOpacity(1, showLabels ? LABEL_OPACITY : 0);
  }, [showLabels, loading]);

  useEffect(() => {
    planeRef.current = plane;
    if (plane !== 3) setRailPlane(plane);
    nvRef.current?.setSliceType(plane);
  }, [plane, ready]);

  // Slice rail: RAS axis for each plane (axial moves z, coronal y, sagittal x).
  const railAxis = 2 - railPlane;
  const nSlices = () => nvRef.current?.volumes[0]?.dimsRAS?.[railAxis + 1] ?? 1;
  const moveSlice = (delta: number) => {
    const nv = nvRef.current;
    if (!nv?.volumes.length || !delta) return;
    const step: [number, number, number] = [0, 0, 0];
    step[railAxis] = delta;
    nv.moveCrosshairInVox(step[0], step[1], step[2]);
    nv.drawScene();
  };
  const goToFrac = (f: number) => {
    const nv = nvRef.current;
    if (!nv?.volumes.length) return;
    const n = nSlices();
    const target = Math.round(Math.min(1, Math.max(0, f)) * (n - 1));
    moveSlice(target - Math.round(nv.frac2vox(nv.scene.crosshairPos)[railAxis]));
  };

  const loadedFiles = age ? [age.files[activeContrast], age.files.labels].filter(Boolean) as FileSet[] : [];
  const sizeMB = age
    ? (loadedFiles.reduce((s, f) => s + (shouldPreview(f, mobile) ? f.preview_bytes ?? f.bytes : f.bytes), 0) / 1e6).toFixed(1)
    : null;
  const previewing = age ? shouldPreview(age.files[activeContrast], mobile) : false;

  return (
    <div>
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: ACCENT, background: ACCENT + '14', padding: '3px 8px', borderRadius: '99px',
          }}>Pediatric brain MRI atlas</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Population-average templates, 36 weeks to 18 years</span>
        </div>

        {/* Controls */}
        <div style={{ padding: '14px 18px', display: 'grid', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div className="atlas-age-row">
            {GROUPS.map(g => {
              const ages = g.ids.map(id => manifest?.ages.find(a => a.id === id)).filter(Boolean) as Age[];
              if (manifest && !ages.length) return null;
              return (
                <div key={g.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>{g.name}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(manifest ? ages : g.ids.map(id => ({ id, label: '…' } as Age))).map(a => (
                      <Pill key={a.id} active={a.id === ageId} onClick={() => setAgeId(a.id)}>{a.label}</Pill>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Segmented
              options={[
                { label: 'T1', value: 'T1w', disabled: !!age && !age.files.T1w },
                { label: 'T2', value: 'T2w', disabled: !!age && !age.files.T2w, title: 'This template is T1 only' },
              ]}
              value={activeContrast} onChange={v => setContrast(v as 'T1w' | 'T2w')}
            />
            <Segmented
              options={PLANES.map(p => ({ label: p.label, value: String(p.value) }))}
              value={String(plane)} onChange={v => setPlane(Number(v))}
            />
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500,
              color: hasLabels ? '#334155' : '#cbd5e1', cursor: hasLabels ? 'pointer' : 'default',
            }} title={hasLabels ? '' : 'Structure labels are available for the neonatal templates and the labelled 1 and 2 year templates'}>
              <input type="checkbox" disabled={!hasLabels} checked={hasLabels && showLabels}
                onChange={e => setShowLabels(e.target.checked)} style={{ accentColor: ACCENT }} />
              Structures
              {!hasLabels && <span style={{ fontSize: '10px' }}>(not for this age)</span>}
            </label>
          </div>

          {age && (
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {age.detail}
              {sizeMB && <span style={{ color: '#cbd5e1' }}> · {sizeMB} MB{previewing ? ' (1 mm preview)' : ''}</span>}
            </div>
          )}
        </div>

        {/* Canvas. NiiVue sizes the canvas to this parent, so it must have a height. */}
        <div className="atlas-canvas-wrap" style={{ display: 'flex', background: '#000' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
            {(loading || error) && (
              <div className="atlas-loading" style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: error ? '#fca5a5' : '#94a3b8', fontSize: '12px', letterSpacing: '0.04em', pointerEvents: 'none',
                background: 'rgba(0,0,0,0.35)', textAlign: 'center', padding: '0 16px',
              }}>
                {error ?? `Loading ${age?.label ?? 'atlas'}…`}
              </div>
            )}
          </div>
          <SliceRail
            plane={railPlane}
            frac={frac[railAxis]}
            total={ready && !loading ? nSlices() : 0}
            canCycle={plane === 3}
            onCycle={() => setRailPlane(p => (p + 1) % 3)}
            onStep={moveSlice}
            onScrub={goToFrac}
          />
        </div>

        {/* Readout */}
        <div style={{
          padding: '10px 18px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
          fontSize: '12px', minHeight: '40px', borderTop: '1px solid #f1f5f9',
        }}>
          {where.structure ? (
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{where.structure}</span>
          ) : (
            <span style={{ color: '#94a3b8' }}>
              {!hasLabels ? 'Click or tap to move the crosshair'
                : where.mm ? 'No labelled structure here' : 'Click or tap to name a structure'}
            </span>
          )}
          {where.mm && <span style={{ color: '#94a3b8', fontFamily: 'ui-monospace, monospace', fontSize: '11px', marginLeft: 'auto' }}>{where.mm}</span>}
        </div>
      </div>

      {/* How to use */}
      <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.7, marginTop: '10px' }}>
        <b style={{ color: '#64748b' }}>Mouse:</b> scroll or use the slider on the right to page through slices · click to move the crosshair · right-drag to adjust window and level.{' '}
        <b style={{ color: '#64748b' }}>Touch:</b> tap to move the crosshair · drag the slider on the right, or tap its arrows, to page through slices.{' '}
        Radiological convention: the patient&apos;s left is on the right of the screen, and sagittal images face left.
      </div>

      {manifest && <Sources manifest={manifest} />}
    </div>
  );
}

function Sources({ manifest }: { manifest: Manifest }) {
  return (
    <details style={{ marginTop: '14px', fontSize: '11px', color: '#64748b' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>Sources and licences</summary>
      <div style={{ display: 'grid', gap: '10px', marginTop: '10px', lineHeight: 1.6 }}>
        {Object.entries(manifest.templates).map(([id, t]) => (
          <div key={id}>
            <div style={{ fontWeight: 600, color: '#334155' }}>{t.name}</div>
            <div>{t.citation}</div>
            <div>
              {t.license_url ? <a href={t.license_url} target="_blank" rel="noopener" style={{ color: ACCENT }}>{t.license}</a> : t.license}
              {' · '}
              <a href={`${BASE}/licenses/${id}/LICENSE`} target="_blank" rel="noopener" style={{ color: ACCENT }}>licence text</a>
            </div>
          </div>
        ))}
        <div>
          Templates obtained from <a href="https://www.templateflow.org" target="_blank" rel="noopener" style={{ color: ACCENT }}>TemplateFlow</a> and
          modified for the web: intensities rescaled to 8-bit, 2 mm previews added, structure colours assigned, and AAL region names expanded.
          Full details in <a href={`${BASE}/ATTRIBUTION.md`} target="_blank" rel="noopener" style={{ color: ACCENT }}>ATTRIBUTION.md</a>.
          These are population averages for education, not reference standards for diagnosis.
        </div>
      </div>
    </details>
  );
}

// Vertical slice scrubber beside the image: drag the track, or tap / hold the arrows.
const RAIL_PLANES = [
  { short: 'AX', name: 'Axial', top: 'S', bottom: 'I' },
  { short: 'COR', name: 'Coronal', top: 'A', bottom: 'P' },
  { short: 'SAG', name: 'Sagittal', top: 'R', bottom: 'L' },
];

function SliceRail({ plane, frac, total, canCycle, onCycle, onStep, onScrub }: {
  plane: number; frac: number; total: number; canCycle: boolean;
  onCycle: () => void; onStep: (delta: number) => void; onScrub: (frac: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const repeatRef = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});
  const p = RAIL_PLANES[plane];
  const disabled = total <= 1;
  const slice = Math.round(frac * (total - 1)) + 1;

  const stopRepeat = () => {
    clearTimeout(repeatRef.current.t);
    clearInterval(repeatRef.current.i);
    repeatRef.current = {};
  };
  useEffect(() => stopRepeat, []);
  const startStep = (delta: number) => {
    stopRepeat();
    onStep(delta);
    repeatRef.current.t = setTimeout(() => {
      repeatRef.current.i = setInterval(() => onStep(delta), 55);
    }, 350);
  };
  const scrubAt = (clientY: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (r) onScrub(1 - (clientY - r.top) / r.height);
  };

  const arrow = (delta: number, label: string, glyph: string) => (
    <button
      aria-label={label}
      disabled={disabled}
      onPointerDown={e => { e.preventDefault(); startStep(delta); }}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onPointerCancel={stopRepeat}
      onContextMenu={e => e.preventDefault()}
      className="atlas-rail-btn"
    >
      {glyph}
    </button>
  );

  return (
    <div className="atlas-rail" style={{ opacity: disabled ? 0.4 : 1 }}>
      {arrow(1, `Next ${p.name.toLowerCase()} slice`, '▲')}
      <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 700 }}>{p.top}</span>
      <div
        ref={trackRef}
        role="slider"
        aria-label={`${p.name} slice`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={slice}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowUp') { e.preventDefault(); onStep(1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); onStep(-1); }
        }}
        onPointerDown={e => {
          if (disabled) return;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          scrubAt(e.clientY);
        }}
        onPointerMove={e => {
          if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) scrubAt(e.clientY);
        }}
        style={{ position: 'relative', flex: 1, width: '100%', cursor: disabled ? 'default' : 'ns-resize', touchAction: 'none' }}
      >
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', marginLeft: '-2px', borderRadius: '2px', background: '#1e293b' }} />
        <div style={{
          position: 'absolute', left: '50%', bottom: 0, width: '4px', marginLeft: '-2px', borderRadius: '2px',
          height: `${frac * 100}%`, background: ACCENT + '66',
        }} />
        <div style={{
          position: 'absolute', left: '50%', bottom: `${frac * 100}%`, transform: 'translate(-50%, 50%)',
          width: '26px', height: '14px', borderRadius: '7px', background: ACCENT,
          boxShadow: '0 0 0 3px rgba(124,58,237,0.25)',
        }} />
      </div>
      <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 700 }}>{p.bottom}</span>
      {arrow(-1, `Previous ${p.name.toLowerCase()} slice`, '▼')}
      <button
        onClick={onCycle}
        disabled={!canCycle}
        title={canCycle ? 'Tap to switch which plane the rail scrolls' : undefined}
        className="atlas-rail-plane"
        style={{ cursor: canCycle ? 'pointer' : 'default' }}
      >
        <span style={{ color: '#e2e8f0' }}>{p.short}</span>
        <span style={{ color: '#64748b', fontWeight: 500 }}>{disabled ? '–' : slice}</span>
      </button>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
      padding: '5px 10px', borderRadius: '8px',
      color: active ? '#fff' : '#475569',
      background: active ? ACCENT : '#f8fafc',
      border: `1px solid ${active ? ACCENT : '#e2e8f0'}`,
    }}>
      {children}
    </button>
  );
}

function Segmented({ options, value, onChange }: {
  options: { label: string; value: string; disabled?: boolean; title?: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', gap: '2px' }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} disabled={o.disabled} title={o.disabled ? o.title : undefined} style={{
          fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', border: 'none',
          cursor: o.disabled ? 'default' : 'pointer',
          color: o.disabled ? '#cbd5e1' : o.value === value ? '#1e293b' : '#64748b',
          background: o.value === value ? '#fff' : 'transparent',
          boxShadow: o.value === value ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
