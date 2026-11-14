// Tests for the neuroradiology models. Each assertion is a fact a reader could check against the
// cited source or against the phantom's own design.
//   node scripts/test-nrad-models.ts
// The models are loaded with a dynamic import of the .ts file so Node can run this directly, while
// the type-only imports keep `tsc --noEmit` checking it like any other file.
import type * as CtModel from '../src/nrad/ctPhantom';
import type * as HemModel from '../src/nrad/hemorrhage';
import type * as MarksModel from '../src/nrad/ctMarks';
import type * as OverlayModel from '../src/figureOverlay';

const ct: typeof CtModel = await import('../src/nrad/ctPhantom.ts' as string);
const hem: typeof HemModel = await import('../src/nrad/hemorrhage.ts' as string);
const mk: typeof MarksModel = await import('../src/nrad/ctMarks.ts' as string);
const ov: typeof OverlayModel = await import('../src/figureOverlay.ts' as string);
const { readFileSync, existsSync } = await import('node:fs' as string) as typeof import('node:fs');

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' — ' + detail : ''}`); } };

const R = ct.REGIONS;
const sourcesTs = readFileSync(new URL('../src/nrad/sources.ts', import.meta.url), 'utf8');
const knownKeys = new Set([...sourcesTs.matchAll(/^\s+(\w+): \{ key:/gm)].map(m => m[1]));

// ── Hounsfield values match their sources
t('air is -1000 (Schulz 2021)', R.air.hu === -1000 && R.sinus.hu === -1000);
t('fat lies in the CT fat range -190 to -30 (Derstine 2022)', R.fat.hu >= -190 && R.fat.hu <= -30);
t('scalp soft tissue lies in the muscle range -29 to +150 (Aubrey 2014)', R.skin.hu >= -29 && R.skin.hu <= 150);
t('acute blood lies in 50 to 70 HU (Mutch 2016)', [R.sdh.hu, R.edh.hu].every(h => h >= 50 && h <= 70));
t('pediatric gray matter about 32-33 HU (Honjo 2026)', R.gray.hu >= 32 && R.gray.hu <= 34);
t('pediatric white matter about 23-24 HU (Honjo 2026)', R.white.hu >= 22 && R.white.hu <= 25);
t('CSF within 6-15 HU (Honjo 2026)', R.csf.hu >= 6 && R.csf.hu <= 15 && R.ventricle.hu >= 6 && R.ventricle.hu <= 15);
t('order: bone > blood > gray > white > CSF > fat > air', R.bone.hu > R.sdh.hu && R.sdh.hu > R.gray.hu && R.gray.hu > R.white.hu && R.white.hu > R.csf.hu && R.csf.hu > R.fat.hu && R.fat.hu > R.air.hu);
t('every region cites a known source or says illustrative', Object.values(R).every(r => r.source === 'illustrative' || knownKeys.has(r.source)));
t('every preset cites a known source', ct.PRESETS.every(p => knownKeys.has(p.source)));

// ── Window arithmetic
t('below the window is black', ct.grayFor(-100, 80, 40) === 0);
t('above the window is white', ct.grayFor(200, 80, 40) === 1);
t('the level is mid-gray', Math.abs(ct.grayFor(40, 80, 40) - 0.5) < 1e-9);
const P = Object.fromEntries(ct.PRESETS.map(p => [p.id, p]));
t('brain preset W80/L40 (Wang 2021)', P.brain.width === 80 && P.brain.level === 40);
t('subdural preset W200/L80 (Wang 2021)', P.subdural.width === 200 && P.subdural.level === 80);
t('bone preset W2800/L600 (Wang 2021)', P.bone.width === 2800 && P.bone.level === 600);
t('narrow preset W8/L32 (Lev 1999)', P.stroke.width === 8 && P.stroke.level === 32);
t('brain window: acute subdural is nearly as white as skull', ct.contrast('sdh', 'bone', 80, 40) < 0.15);
t('brain window: bone and anything denser are identical white', ct.sameGray(R.bone.hu, R.calcification.hu, 80, 40));
t('subdural window separates the subdural from the skull', !ct.sameGray(R.sdh.hu, R.bone.hu, 200, 80) && ct.contrast('sdh', 'bone', 200, 80) > 0.4);
t('brain window separates gray from white matter', ct.contrast('gray', 'white', 80, 40) > 0.1);
t('subdural window flattens gray-white contrast compared with the brain window', ct.contrast('gray', 'white', 200, 80) < ct.contrast('gray', 'white', 80, 40));
t('narrow window exaggerates gray-white contrast', ct.contrast('gray', 'white', 8, 32) > 4 * ct.contrast('gray', 'white', 80, 40));
t('bone window: brain and blood look nearly alike', ct.contrast('sdh', 'white', 2800, 600) < 0.03);
t('bone window: fracture gap stands out against bone', ct.contrast('fracture', 'bone', 2800, 600) > 0.3);
t('bone window: diploe differs from cortical bone', ct.contrast('diploe', 'bone', 2800, 600) > 0.15);
t('width slider round-trips at W8, W80, W2800', [8, 80, 2800].every(w => Math.abs(ct.sliderToWidth(ct.widthToSlider(w)) - w) / w < 0.02));

// ── Phantom geometry
t('outside the head is air', ct.regionAt(84, 0) === 'air');
t('center of the head is not air', ct.regionAt(0, -40) !== 'air');
t('frontal sinus at the anterior midline is air', (() => { for (let y = -90; y < -70; y += 0.25) if (ct.regionAt(0, y) === 'sinus') return true; return false; })());
const along = (deg: number) => { const out: string[] = []; const u = Math.cos(deg * Math.PI / 180), v = Math.sin(deg * Math.PI / 180); for (let r = 95; r > 0; r -= 0.25) { const g = ct.regionAt(u * r, v * r); if (out[out.length - 1] !== g) out.push(g); } return out; };
const rayEdh = along(ct.EDH.center + 6), raySdh = along(ct.SDH.center), rayPost = along(90);
t('a ray through the epidural meets skin, fat, bone, then epidural blood', rayEdh.indexOf('edh') > rayEdh.indexOf('bone') && rayEdh.indexOf('bone') > rayEdh.indexOf('fat'), rayEdh.join('>'));
t('a ray through the subdural meets bone, then subdural blood, then cortex', raySdh.indexOf('sdh') > raySdh.lastIndexOf('bone') && raySdh.indexOf('gray') > raySdh.indexOf('sdh'), raySdh.join('>'));
t('a normal ray passes CSF before cortex before white matter', rayPost.indexOf('csf') < rayPost.indexOf('gray') && rayPost.indexOf('gray') < rayPost.indexOf('white'), rayPost.join('>'));
t('epidural is a lens: thickest in the middle, zero at its edges', ct.edhThickness(ct.EDH.center) === ct.EDH.max && ct.edhThickness(ct.EDH.center + ct.EDH.half) === 0 && ct.edhThickness(ct.EDH.center + ct.EDH.half / 2) < ct.EDH.max);
t('subdural is a crescent: long and of near-even thickness', ct.SDH.half * 2 > 120 && ct.sdhThickness(ct.SDH.center + 40) / ct.sdhThickness(ct.SDH.center) > 0.9);
t('subdural is thinner than the epidural', ct.SDH.max < ct.EDH.max);
t('lesions are on opposite sides (subdural image left = patient right)', Math.cos(ct.SDH.center * Math.PI / 180) < 0 && Math.cos(ct.EDH.center * Math.PI / 180) > 0);
t('removing lesions removes all blood', (() => { for (let x = -80; x <= 80; x += 1) for (let y = -95; y <= 95; y += 1) { const g = ct.regionAt(x, y, { lesions: false }); if (g === 'sdh' || g === 'edh' || g === 'fracture') return false; } return true; })());
t('a fracture crosses the skull near the epidural', (() => { for (let r = 60; r < 80; r += 0.1) for (let a = -20; a < 5; a += 0.5) if (ct.regionAt(Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r) === 'fracture') return true; return false; })());
t('both lateral ventricles and calcified choroid plexus are present', [-1, 1].every(s => { let v = false, c = false; for (let x = 0; x < 30; x += 0.5) for (let y = -30; y < 40; y += 0.5) { const g = ct.regionAt(s * x, y); if (g === 'ventricle') v = true; if (g === 'calcification') c = true; } return v && c; }));
const ras = ct.rasterize(68, 82);
t('raster has the right size and finite values', ras.length === 68 * 82 && Array.from(ras).every(Number.isFinite));
t('raster is deterministic', ct.rasterize(20, 24).every((v, i) => v === ct.rasterize(20, 24)[i]));
t('noise stays within ±3 HU', (() => { for (let i = 0; i < 200; i++) for (let j = 0; j < 20; j++) if (Math.abs(ct.noiseAt(i, j)) > 3) return false; return true; })());

// ── Hemorrhage model
const B = hem.BLEEDS;
t('five compartments', hem.ORDER.length === 5 && hem.ORDER.every(k => B[k]));
t('epidural is a lens that stops at sutures (Heit 2017)', B.epidural.shape === 'lens' && B.epidural.boundary === 'stops-at-sutures');
t('subdural is a crescent that crosses sutures (Heit 2017)', B.subdural.shape === 'crescent' && B.subdural.boundary === 'crosses-sutures');
t('shape alone identifies each compartment', hem.ORDER.every(k => { const r = hem.identify(B[k].shape, null); return r.length === 1 && r[0] === k; }));
t('a crescent that stops at sutures fits nothing cleanly', hem.identify('crescent', 'stops-at-sutures').length === 0);
t('a lens that crosses a suture is still possibly epidural (Huisman 2009)', hem.identify('lens', 'crosses-sutures').includes('epidural'));
t('no shape, no boundary: everything possible', hem.identify(null, null).length === 5);
t('every bleed cites known sources', hem.ORDER.every(k => B[k].sources.length > 0 && B[k].sources.every(s => knownKeys.has(s))));
t('every bleed links into Localization', hem.ORDER.every(k => B[k].localization.href.startsWith('/localization/')));
t('quiz covers every compartment', hem.ORDER.every(k => hem.QUIZ.some(q => q.answer === k)));
t('quiz answers check correctly', hem.QUIZ.every(q => hem.checkAnswer(q.id, q.answer) && !hem.checkAnswer(q.id, hem.ORDER.find(k => k !== q.answer)!)));
t('quiz shapes match their answers', hem.QUIZ.every(q => q.shape === 'interhemispheric' ? q.answer === 'subdural' : B[q.answer].shape === q.shape));
t('no em dashes in visible model text', !/—/.test(JSON.stringify(B) + JSON.stringify(hem.QUIZ) + JSON.stringify(R) + JSON.stringify(ct.PRESETS)));

// ── Real images: stored slices, marks, landmarks and credits
const root = new URL('../', import.meta.url);
const file = (rel: string) => new URL(rel.replace(/^\//, ''), new URL('public/', root));
interface Slice { case: string; slice: number; w: number; h: number; mmPerPx: number; hu: boolean; outline: string | null }
const slices = JSON.parse(readFileSync(new URL('src/nrad/ct-slices.json', root), 'utf8')) as Record<string, Slice>;
const sliceIds = Object.keys(slices);
const sliceOf = (id: string) => slices[mk.CT_MARKS[id]?.img ?? id];
const isImage = (id: string) => !!mk.OA_IMAGES[id] || !!sliceOf(id);
const webpSize = (rel: string): [number, number] | null => {
  const b = readFileSync(file(rel)), kind = b.toString('latin1', 12, 16);
  if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (kind === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >>> 14) & 0x3fff) + 1]; }
  if (kind === 'VP8X') return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
  return null;
};
const sameSize = (a: [number, number] | null, w: number, h: number) => !!a && a[0] === w && a[1] === h;

t('every stored slice has its image file', sliceIds.every(id => existsSync(file(`nrad/ct/${id}.webp`))));
t('each slice image is twice the size the marks are drawn in', sliceIds.every(id => sameSize(webpSize(`nrad/ct/${id}.webp`), slices[id].w * 2, slices[id].h * 2)), sliceIds.filter(id => !sameSize(webpSize(`nrad/ct/${id}.webp`), slices[id].w * 2, slices[id].h * 2)).join(' '));
t('every mark set belongs to a stored slice', Object.keys(mk.CT_MARKS).every(id => !!sliceOf(id)));
t('every mark lies inside its image', Object.entries(mk.CT_MARKS).every(([id, set]) => { const s = sliceOf(id); return set.marks.every(m => m.at[0] >= 0 && m.at[0] < s.w && m.at[1] >= 0 && m.at[1] < s.h); }));
t('marks are numbered 1 to n and labeled', Object.values(mk.CT_MARKS).every(set => set.marks.every((m, i) => m.n === i + 1 && m.label.length > 2)));
{
  const clash: string[] = [];
  for (const [id, set] of Object.entries(mk.CT_MARKS)) {
    const s = sliceOf(id), pins = set.marks.map(m => ov.pinFor(s, m));
    for (let a = 0; a < pins.length; a++) for (let b = a + 1; b < pins.length; b++) if (Math.hypot(pins[a].x - pins[b].x, pins[a].y - pins[b].y) < 2 * ov.PIN_R) clash.push(`${id} ${a + 1}/${b + 1}`);
  }
  t('no two pins on an image overlap', clash.length === 0, clash.join(', '));
}
t('measurement lines lie inside their image', Object.entries(mk.CT_MARKS).every(([id, set]) => { const s = sliceOf(id); return (set.lines ?? []).every(l => [l.from, l.to].every(p => p[0] >= 0 && p[0] <= s.w && p[1] >= 0 && p[1] <= s.h)); }));
{
  // The shift printed on the image must equal the distance from the septum to the dashed midline.
  const set = mk.CT_MARKS['sdh-b-shift'], s = sliceOf('sdh-b-shift');
  const mid = set.lines!.find(l => l.dash)!, meas = set.lines!.find(l => !l.dash)!;
  const dx = mid.to[0] - mid.from[0], dy = mid.to[1] - mid.from[1];
  const dist = (p: [number, number]) => Math.abs(dy * (p[0] - mid.from[0]) - dx * (p[1] - mid.from[1])) / Math.hypot(dx, dy);
  const mm = Math.max(dist(meas.from), dist(meas.to)) * s.mmPerPx;
  t('the printed midline shift matches the drawn line', Math.abs(mm - parseFloat(meas.label!)) <= 1 && Math.min(dist(meas.from), dist(meas.to)) < 1.5, `${mm.toFixed(1)} mm against ${meas.label}`);
  t('the caption gives the same shift', mk.FIGURE_TEXT['sdh-b-shift'].body.includes(meas.label!));
}

t('the window lab uses slices stored with Hounsfield values', mk.LAB_SLICES.length >= 2 && mk.LAB_SLICES.every(s => slices[s.id]?.hu));
t('only lab slices ship raw values', sliceIds.every(id => slices[id].hu === existsSync(file(`nrad/ct/${id}.bin`))));
for (const lab of mk.LAB_SLICES) {
  const s = slices[lab.id], buf = readFileSync(file(`nrad/ct/${lab.id}.bin`));
  t(`${lab.id}: raw file holds one 16-bit value per pixel`, buf.length === s.w * s.h * 2, `${buf.length} bytes`);
  const hu = new Int16Array(s.w * s.h);
  for (let k = 0; k < hu.length; k++) hu[k] = buf.readInt16LE(k * 2);
  t(`${lab.id}: values stay within the CT scale`, hu.every(v => v >= -1024 && v <= 3071));
  t(`${lab.id}: starts on one of its landmarks`, lab.landmarks.some(m => m.id === lab.start));
  for (const m of lab.landmarks) {
    const v = mk.roiMean(hu, s.w, s.h, m.at[0], m.at[1]);
    t(`${lab.id}: ${m.label} measures within ${m.range[0]} to ${m.range[1]} HU`, v >= m.range[0] && v <= m.range[1], `measured ${v.toFixed(1)}`);
    t(`${lab.id}: the probe on ${m.label} finds that landmark`, mk.landmarkNear(lab, m.at[0], m.at[1])?.id === m.id);
  }
  const blood = lab.landmarks.find(m => m.id === 'blood')!, csf = lab.landmarks.find(m => m.id === 'csf')!, skull = lab.landmarks.find(m => m.id === 'skull')!;
  const at = (m: typeof blood) => mk.roiMean(hu, s.w, s.h, m.at[0], m.at[1]);
  t(`${lab.id}: bone > blood > CSF on the real slice`, at(skull) > at(blood) && at(blood) > at(csf));
  t(`${lab.id}: the blood reads as acute blood`, mk.huCategory(at(blood)).label === 'Range of acute blood');
  t(`${lab.id}: the blood blends into bone on a brain window and separates on a subdural window`, ct.grayFor(at(blood), 80, 40) > 0.85 && ct.grayFor(at(blood), 200, 80) < 0.6 && ct.grayFor(at(skull), 200, 80) === 1, `brain ${ct.grayFor(at(blood), 80, 40).toFixed(2)}, subdural ${ct.grayFor(at(blood), 200, 80).toFixed(2)}`);
}
t('roiMean of a flat field is the field', mk.roiMean(new Int16Array(100).fill(37), 10, 10, 0, 0) === 37 && mk.roiMean(new Int16Array(100).fill(37), 10, 10, 9, 9) === 37);
t('HU categories run air, fat, fluid, brain, blood, bone', ['Air', 'Fat range', 'Fluid range', 'Brain tissue range', 'Range of acute blood', 'Bone'].every((l, i) => mk.huCategory([-1000, -90, 8, 32, 65, 1200][i]).label === l));

const oaIds = Object.keys(mk.OA_IMAGES);
t('every open-access image file exists at its stated size', oaIds.every(id => { const o = mk.OA_IMAGES[id]; return existsSync(file(o.file)) && sameSize(webpSize(o.file), o.w, o.h); }), oaIds.filter(id => !existsSync(file(mk.OA_IMAGES[id].file)) || !sameSize(webpSize(mk.OA_IMAGES[id].file), mk.OA_IMAGES[id].w, mk.OA_IMAGES[id].h)).join(' '));
t('every open-access image says who it shows, its source figure and that it was cropped', oaIds.every(id => { const o = mk.OA_IMAGES[id]; return o.who.length > 5 && /\b(19|20)\d{2}\b/.test(o.credit) && /Figure \d/.test(o.credit) && /cropped/.test(o.credit); }));
const attributions = readFileSync(file('nrad/ATTRIBUTIONS.md'), 'utf8');
t('the attribution file lists every stored image', [...sliceIds, ...oaIds].every(id => attributions.includes(id)), [...sliceIds, ...oaIds].filter(id => !attributions.includes(id)).join(' '));
t('the attribution file names both licenses', attributions.includes('creativecommons.org/licenses/by-nc-sa/4.0') && attributions.includes('creativecommons.org/licenses/by/4.0'));
t('the CQ500 source is in the citation registry', knownKeys.has('chilamkurthy2018') && mk.cq500Credit('CQ500-CT-99') === 'CQ500 dataset, case 99 (Chilamkurthy 2018)');
t('no CQ500 image is described as a child or an adult', !/\b(child|infant|adult scan|an adult)\b/i.test(JSON.stringify(mk.LAB_SLICES) + sliceIds.filter(id => mk.FIGURE_TEXT[id]).map(id => JSON.stringify(mk.FIGURE_TEXT[id])).join('')));

t('every explore image is a stored slice with marks', hem.ORDER.every(k => !!sliceOf(hem.EXPLORE_IMAGE[k]) && mk.CT_MARKS[hem.EXPLORE_IMAGE[k]]?.marks.length > 0));
t('every quiz image exists', hem.QUIZ.every(q => isImage(q.image) && (!q.after || isImage(q.after.image))), hem.QUIZ.filter(q => !isImage(q.image)).map(q => q.id).join(' '));
t('no quiz image repeats the explore image for its answer', hem.QUIZ.every(q => q.image !== hem.EXPLORE_IMAGE[q.answer]));
t('quiz images are all different', new Set(hem.QUIZ.map(q => q.image)).size === hem.QUIZ.length);

const figureIds = Object.keys(mk.FIGURE_TEXT);
t('every figure under the text is a stored image', figureIds.every(isImage), figureIds.filter(id => !isImage(id)).join(' '));
const m02 = JSON.parse(readFileSync(new URL('src/nrad/modules/m02-ct-head.json', root), 'utf8')) as { sources: string[]; sections: { figures?: string[] }[] };
const used = m02.sections.flatMap(s => s.figures ?? []);
t('every figure the module asks for has a caption', used.length > 0 && used.every(id => !!mk.FIGURE_TEXT[id]), used.filter(id => !mk.FIGURE_TEXT[id]).join(' '));
t('every captioned figure is used once', figureIds.every(id => used.filter(u => u === id).length === 1), figureIds.filter(id => used.filter(u => u === id).length !== 1).join(' '));
t('the module lists the dataset among its sources', m02.sources.includes('chilamkurthy2018'));
t('captions are short', figureIds.every(id => mk.FIGURE_TEXT[id].body.split(/\s+/).length <= 60));
t('no em dashes or semicolons in image text', !/[—;]/.test(JSON.stringify(mk.CT_MARKS) + JSON.stringify(mk.LAB_SLICES) + JSON.stringify(mk.OA_IMAGES) + JSON.stringify(mk.FIGURE_TEXT) + mk.CQ500_WHO));

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
