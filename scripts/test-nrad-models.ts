// Tests for the neuroradiology models. Each assertion is a fact a reader could check against the
// cited source or against the phantom's own design.
//   node scripts/test-nrad-models.ts
// The models are loaded with a dynamic import of the .ts file so Node can run this directly, while
// the type-only imports keep `tsc --noEmit` checking it like any other file.
import type * as CtModel from '../src/nrad/ctPhantom';
import type * as HemModel from '../src/nrad/hemorrhage';

const ct: typeof CtModel = await import('../src/nrad/ctPhantom.ts' as string);
const hem: typeof HemModel = await import('../src/nrad/hemorrhage.ts' as string);
const { readFileSync } = await import('node:fs' as string) as typeof import('node:fs');

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
t('quiz drawings match their answers', hem.QUIZ.every(q => q.drawing.bleed === 'interhemispheric' ? q.answer === 'subdural' : B[q.answer].shape === q.drawing.bleed));
t('no em dashes in visible model text', !/—/.test(JSON.stringify(B) + JSON.stringify(hem.QUIZ) + JSON.stringify(R) + JSON.stringify(ct.PRESETS)));

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
