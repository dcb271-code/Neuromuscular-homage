'use client';

// Spinal cord lesion simulator. Choose a level, a lesion pattern and a side; the body map is
// computed from the tract model (src/loc/models/cord.ts) and drawn by segment.

import { useMemo, useState } from 'react';
import { cordLesion, LESION_TYPES, LEVEL_CHOICES, REGIONS, SEGMENTS, idx, type LesionType, type Segment, type Side } from '@/src/loc/models/cord';
import { Label, Segmented, WidgetFrame } from './ui';

type Mode = 'motor' | 'pain' | 'vibration';

// Simple front-view figure, arms out ("T pose", palms forward, thumbs up). Patient's right is
// on the viewer's left. Each shape maps to a region of REGIONS or a trunk segment.
type Shape = { region?: string; seg?: Segment; side: Side; x: number; y: number; w: number; h: number };
function shapes(): Shape[] {
  const out: Shape[] = [];
  const sides: Side[] = ['R', 'L']; // R drawn on viewer's left
  sides.forEach(side => {
    const left = side === 'R';
    const sx = (x: number, w: number) => (left ? x : 320 - x - w); // mirror
    out.push({ region: 'neck', side, ...{ x: sx(146, 14), y: 64, w: 14, h: 18 } });
    // arm: proximal (78-128) and distal (34-78), top half radial, bottom half ulnar; hand 14-34
    out.push({ region: 'arm-radial-prox', side, x: sx(78, 50), y: 86, w: 50, h: 12 });
    out.push({ region: 'arm-ulnar-prox', side, x: sx(78, 50), y: 98, w: 50, h: 12 });
    out.push({ region: 'arm-radial-dist', side, x: sx(34, 44), y: 86, w: 44, h: 12 });
    out.push({ region: 'arm-ulnar-dist', side, x: sx(34, 44), y: 98, w: 44, h: 12 });
    out.push({ region: 'arm-radial-dist', side, x: sx(14, 20), y: 84, w: 20, h: 9 });
    out.push({ region: 'hand-mid', side, x: sx(14, 20), y: 93, w: 20, h: 8 });
    out.push({ region: 'arm-ulnar-dist', side, x: sx(14, 20), y: 101, w: 20, h: 9 });
    // trunk bands T2..T12, each half
    const trunk = SEGMENTS.slice(idx('T2'), idx('T12') + 1);
    trunk.forEach((seg, k) => out.push({ seg, side, x: sx(128, 32), y: 82 + k * 13.5, w: 32, h: 13.5 }));
    out.push({ region: 'groin', side, x: sx(128, 32), y: 230, w: 32, h: 12 });
    out.push({ region: 'thigh', side, x: sx(130, 28), y: 242, w: 28, h: 74 });
    out.push({ region: 'shin-medial', side, x: sx(144, 14), y: 316, w: 14, h: 74 });
    out.push({ region: 'shin-lateral', side, x: sx(130, 14), y: 316, w: 14, h: 74 });
    out.push({ region: 'shin-lateral', side, x: sx(144, 14), y: 390, w: 14, h: 14 });
    out.push({ region: 'foot-lateral', side, x: sx(126, 18), y: 390, w: 18, h: 14 });
  });
  out.push({ region: 'saddle', side: 'R', x: 152, y: 238, w: 8, h: 16 });
  out.push({ region: 'saddle', side: 'L', x: 160, y: 238, w: 8, h: 16 });
  return out;
}
const SHAPES = shapes();

export function CordSim({ accent }: { accent: string }) {
  const [level, setLevel] = useState<Segment>('T4');
  const [type, setType] = useState<LesionType>('hemisection');
  const [side, setSide] = useState<Side>('L');
  const [mode, setMode] = useState<Mode>('pain');
  const r = useMemo(() => cordLesion(level, type, side), [level, type, side]);

  const segsOf = (s: Shape): Segment[] => (s.seg ? [s.seg] : REGIONS.find(x => x.id === s.region)!.segs);
  const fillFor = (s: Shape) => {
    const ds = segsOf(s).map(seg => r.bySide[s.side][idx(seg)]);
    if (mode === 'pain') return ds.some(d => d.pain) ? accent : '#fff';
    if (mode === 'vibration') return ds.some(d => d.vibration) ? accent : '#fff';
    if (ds.some(d => d.motor === 'lmn')) return 'url(#lmn-hatch)';
    if (ds.some(d => d.motor === 'umn')) return accent + 'aa';
    return '#fff';
  };

  return (
    <WidgetFrame accent={accent} label="Cord lesion simulator" subtitle="Choose a level and a lesion. The deficits are computed from three tracts and where each one crosses."
      footnote={<>Teaching model: three long tracts, the anterior horn and the entering roots, drawn on simplified dermatomes. Pain and temperature loss from a lateral lesion starts about two segments below it (Brazis 2011, p. 106). The figure faces you: the patient&apos;s right is on your left.</>}>
      <div className="grid gap-3 sm:grid-cols-2 mb-3">
        <div><Label>Level</Label><Segmented accent={accent} value={level} onChange={setLevel} options={LEVEL_CHOICES.map(l => ({ id: l, label: l }))} /></div>
        <div><Label>Show</Label><Segmented accent={accent} value={mode} onChange={setMode} options={[{ id: 'motor', label: 'Strength' }, { id: 'pain', label: 'Pain & temperature' }, { id: 'vibration', label: 'Vibration & position' }]} /></div>
      </div>
      <div className="mb-3">
        <Label>Lesion</Label>
        <div className="flex flex-wrap gap-1.5">
          {LESION_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)} aria-pressed={type === t.id}
              className="rounded-lg border px-2.5 py-1.5 text-[12px] font-medium text-left"
              style={{ background: type === t.id ? accent : '#fff', color: type === t.id ? '#fff' : '#334155', borderColor: type === t.id ? accent : '#e2e8f0' }}>{t.name}</button>
          ))}
        </div>
        {type === 'hemisection' && <div className="mt-2"><Segmented accent={accent} value={side} onChange={setSide} options={[{ id: 'L', label: "Patient's left half" }, { id: 'R', label: "Patient's right half" }]} /></div>}
        <p className="text-[11.5px] text-slate-500 mt-1.5">{LESION_TYPES.find(t => t.id === type)!.parts}. In children: {LESION_TYPES.find(t => t.id === type)!.example.toLowerCase()}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,300px)_1fr] items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg viewBox="0 0 320 418" className="w-full block" role="img" aria-label={`Body map: ${mode}`}>
            <defs>
              <pattern id="lmn-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="5" height="5" fill={accent + '33'} /><line x1="0" y1="0" x2="0" y2="5" stroke={accent} strokeWidth="2.2" />
              </pattern>
            </defs>
            <circle cx="160" cy="38" r="24" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="160" y="42" textAnchor="middle" fontSize="8" fill="#94a3b8">face: not the cord</text>
            {SHAPES.map((s, k) => <rect key={k} x={s.x} y={s.y} width={s.w} height={s.h} fill={fillFor(s)} stroke="#cbd5e1" strokeWidth="0.6" />)}
            <line x1="160" y1="64" x2="160" y2="242" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="0.8" />
            <text x="40" y="414" fontSize="9" fill="#64748b">patient&apos;s right</text>
            <text x="230" y="414" fontSize="9" fill="#64748b">patient&apos;s left</text>
            <text x="196" y={82 + (idx('T4') - idx('T2')) * 13.5 + 10} fontSize="7.5" fill="#94a3b8">T4 nipples</text>
            <text x="196" y={82 + (idx('T10') - idx('T2')) * 13.5 + 10} fontSize="7.5" fill="#94a3b8">T10 umbilicus</text>
          </svg>
          <div className="flex flex-wrap gap-3 px-1 pt-1 text-[10.5px] text-slate-500">
            {mode === 'motor' ? (<>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: accent + 'aa' }} /> upper motor neuron weakness</span>
              <span className="flex items-center gap-1"><svg width="12" height="12"><rect width="12" height="12" fill="url(#lmn-hatch)" /></svg> lower motor neuron at the level</span>
            </>) : <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: accent }} /> lost</span>}
            <span>bladder: <b className="text-slate-700">{r.bladder ? 'affected' : 'usually spared'}</b></span>
          </div>
        </div>
        <ul className="space-y-2">
          {r.summary.map((s, k) => <li key={k} className="text-[13px] text-slate-700 leading-snug rounded-lg bg-white border border-slate-200 px-3 py-2">{s}</li>)}
        </ul>
      </div>
    </WidgetFrame>
  );
}
