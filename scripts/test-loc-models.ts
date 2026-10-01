// Tests for the localization models. Each assertion is a fact a neurologist would check.
//   node scripts/test-loc-models.ts
import { localize, survivors, PRESETS, FINDINGS, FINDING_SETS, LEVELS } from '../src/loc/models/localizer.ts';
import { cordLesion, idx, STT_OFFSET } from '../src/loc/models/cord.ts';
import { brainstemLesion } from '../src/loc/models/brainstem.ts';
import { fieldsFor, isLost, sparesMacula } from '../src/loc/models/visual.ts';
import { candidates, RN_PRESETS, ITEMS, NERVE_LESIONS } from '../src/loc/models/rootNerve.ts';
import { TIMELINE, timelineState, comaVerdict, examOrderScore, EXAM_STEPS, WHERE_WHEN, TEMPOS } from '../src/loc/models/data.ts';

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ' — ' + detail : ''}`); } };
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// ── Localizer
const lv = (sel: string[]) => Object.fromEntries(localize(sel).map(v => [v.level, v.status]));
t('no findings: nothing excluded', localize([]).every(v => v.status === 'possible'));
t('face+arm+leg same side excludes cord', lv(['hemi-face']).cord === 'excluded');
t('face+arm+leg same side excludes every motor-unit level', ['horn', 'root', 'plexus', 'nerve', 'nmj', 'muscle'].every(l => lv(['hemi-face'])[l] === 'excluded'));
t('crossed signs leave only brainstem', eq(survivors(['crossed']), ['brainstem']));
t('sensory level leaves only cord', eq(survivors(['sensory-level']), ['cord']));
t('brisk reflexes exclude nerve and muscle', lv(['umn']).nerve === 'excluded' && lv(['umn']).muscle === 'excluded');
t('areflexia does not exclude cord (spinal shock)', lv(['areflexia']).cord !== 'excluded');
t('fasciculations exclude muscle and junction', lv(['fasciculations']).muscle === 'excluded' && lv(['fasciculations']).nmj === 'excluded');
t('glove-and-stocking: nerve is the only fit; root stays possible (polyradiculoneuropathy)', eq(localize(['glove-stocking']).filter(v => v.status === 'fits').map(v => v.level), ['nerve']) && lv(['glove-stocking']).root === 'possible');
t('pure motor excludes plexus and cord but not horn/nmj/muscle', lv(['pure-motor']).plexus === 'excluded' && lv(['pure-motor']).cord === 'excluded' && ['horn', 'nmj', 'muscle'].every(l => lv(['pure-motor'])[l] === 'fits'));
t('every finding excludes something and fits something', FINDINGS.every(f => f.fits.length > 0 && Object.keys(f.excludes).length > 0));
t('no finding both fits and excludes a level', FINDINGS.every(f => f.fits.every(l => !f.excludes[l])), FINDINGS.filter(f => f.fits.some(l => f.excludes[l])).map(f => f.id).join(','));
t('every excluded level has a reason', localize(FINDINGS.map(f => f.id)).every(v => v.status !== 'excluded' || v.reasons.length > 0));
for (const [set, ps] of Object.entries(PRESETS)) for (const p of ps) {
  t(`preset ${set}/${p.id} uses findings from its set`, p.findings.every(f => FINDING_SETS[set].includes(f)));
  t(`preset ${set}/${p.id} leaves at least one level`, survivors(p.findings).length > 0);
}
t('preset intro/para-level → cord', eq(survivors(PRESETS.intro[1].findings), ['cord']));
t('preset full/gbs → nerve first, root second', survivors(PRESETS.full[0].findings).slice(0, 2).join() === 'nerve,root');
t('preset floppy/sma → horn first', survivors(PRESETS.floppy[1].findings)[0] === 'horn');
t('preset floppy/botulism → junction first', survivors(PRESETS.floppy[2].findings)[0] === 'nmj');
t('preset motor-unit/cmt → nerve first', survivors(PRESETS['motor-unit'][1].findings)[0] === 'nerve');
t('11 levels', LEVELS.length === 11);

// ── Cord
const bs = cordLesion('T4', 'hemisection', 'L');
const below = idx('T4') + 3, above = idx('T4') - 2;
t('Brown-Séquard: weakness same side below', bs.bySide.L[below].motor === 'umn' && bs.bySide.R[below].motor === 'normal');
t('Brown-Séquard: vibration lost same side below', bs.bySide.L[below].vibration && !bs.bySide.R[below].vibration);
t('Brown-Séquard: pain lost opposite side below', bs.bySide.R[below].pain && !bs.bySide.L[below].pain);
t('Brown-Séquard: pain loss starts ~2 segments down', !bs.bySide.R[idx('T4') + STT_OFFSET - 1].pain && bs.bySide.R[idx('T4') + STT_OFFSET].pain);
t('Brown-Séquard: nothing above the lesion', !bs.bySide.L[above].pain && bs.bySide.L[above].motor === 'normal' && !bs.bySide.R[above].vibration);
t('Brown-Séquard: bladder usually spared', !bs.bladder);
const ant = cordLesion('T10', 'anterior');
t('anterior cord spares vibration', ant.bySide.L.every(d => !d.vibration) && ant.bySide.R.every(d => !d.vibration));
t('anterior cord loses pain below both sides', ant.bySide.L[idx('L4')].pain && ant.bySide.R[idx('L4')].pain);
t('anterior cord: bladder lost', ant.bladder);
const syr = cordLesion('C5', 'central');
t('syrinx: pain lost at C5-C8', ['C5', 'C6', 'C7', 'C8'].every(s => syr.bySide.L[idx(s as never)].pain));
t('syrinx: suspended — sacral pain sensation spared', !syr.bySide.L[idx('S3')].pain);
t('syrinx: touch/vibration spared', syr.bySide.L.every(d => !d.vibration));
t('syrinx: lower motor neuron at level', syr.bySide.R[idx('C6')].motor === 'lmn');
const comp = cordLesion('C5', 'complete');
t('complete C5: legs UMN both sides, LMN at C5', comp.bySide.L[idx('L4')].motor === 'umn' && comp.bySide.R[idx('C5')].motor === 'lmn' && comp.bladder);
t('posterior columns: strength spared', cordLesion('T4', 'posterior').bySide.L.every(d => d.motor === 'normal'));

// ── Brainstem
const wall = brainstemLesion('medulla', 'lateral', 'L');
const has = (r: ReturnType<typeof brainstemLesion>, s: string, side: string) => r.findings.some(f => f.structure.startsWith(s) && f.side === side);
t('Wallenberg: face pain same side, body pain opposite', has(wall, 'Sensory nucleus of 5', 'same') && has(wall, 'Spinothalamic', 'opposite'));
t('Wallenberg: Horner and ataxia same side', has(wall, 'Sympathetic', 'same') && has(wall, 'Spinocerebellar', 'same'));
t('Wallenberg: CN 9 and 10, not 12', wall.cranialNerves.includes('9') && wall.cranialNerves.includes('10') && !wall.cranialNerves.includes('12'));
t('Wallenberg: no weakness', !has(wall, 'Motor pathway', 'opposite'));
t('Wallenberg named', /Wallenberg/.test(wall.syndrome ?? ''));
t('Wallenberg: vertigo same side, no CN 11', has(wall, 'Vestibular', 'same') && !wall.cranialNerves.includes('11'));
const web = brainstemLesion('midbrain', 'medial');
t('Weber: CN 3 same side, weakness opposite', web.cranialNerves.join() === '3' && has(web, 'Motor pathway', 'opposite') && /Weber/.test(web.syndrome ?? ''));
const mm = brainstemLesion('medulla', 'medial');
t('Medial medulla: CN 12 + opposite hemiparesis + opposite position loss', mm.cranialNerves.join() === '12' && has(mm, 'Motor pathway', 'opposite') && has(mm, 'Medial lemniscus', 'opposite'));
t('Medial pons: CN 6', brainstemLesion('pons', 'medial').cranialNerves.join() === '6');
t('Lateral pons: CN 5, 7, 8', brainstemLesion('pons', 'lateral').cranialNerves.join() === '5,7,8');
t('Medial lesions never cause Horner', ['midbrain', 'pons', 'medulla'].every(l => !has(brainstemLesion(l as never, 'medial'), 'Sympathetic', 'same')));

// ── Visual
const ch = fieldsFor('chiasm');
t('chiasm: bitemporal', ch.L['upper-left'] && ch.L['lower-left'] && !ch.L['upper-right'] && ch.R['upper-right'] && !ch.R['upper-left']);
const rt = fieldsFor('tract-R');
t('right tract: left homonymous hemianopia', rt.L['upper-left'] && rt.R['upper-left'] && rt.L['lower-left'] && !rt.L['upper-right'] && !rt.R['lower-right']);
const ml = fieldsFor('meyer-L');
t("left Meyer's loop: right upper quadrant both eyes only", ml.L['upper-right'] && ml.R['upper-right'] && !ml.L['lower-right'] && !ml.R['upper-left']);
const pr = fieldsFor('parietal-R');
t('right parietal: left lower quadrant', pr.L['lower-left'] && pr.R['lower-left'] && !pr.L['upper-left']);
t('left optic nerve: left eye only', Object.values(fieldsFor('optic-nerve-L').L).every(Boolean) && Object.values(fieldsFor('optic-nerve-L').R).every(x => !x));
t('occipital spares macula; tract does not', sparesMacula('occipital-R') && !sparesMacula('tract-R'));
t('left eye nasal retina sees the left field (crosses at chiasm)', isLost({ eye: 'L', h: 'left', v: 'upper' }, 'chiasm'));

// ── Root vs nerve
const explains = (exam: Parameters<typeof candidates>[0]) => candidates(exam).filter(c => c.explains).map(c => c.id);
const P = Object.fromEntries(RN_PRESETS.map(p => [p.id, explains(p.exam)]));
t('peroneal preset → common peroneal only', eq(P.peroneal, ['common-peroneal']), String(P.peroneal));
t('L5 preset → L5 root only', eq(P.l5, ['L5']), String(P.l5));
t('radial preset → radial at spiral groove only', eq(P.radial, ['radial-groove']), String(P.radial));
t('Erb preset → upper trunk only', eq(P.erb, ['upper-trunk']), String(P.erb));
t('every nerve lesion covers at least one item', NERVE_LESIONS.every(n => n.covers.length > 0));
t('every item has main roots within its roots', ITEMS.every(i => i.main.every(r => i.roots.includes(r))));
t('weak APB alone: median at wrist explains; median at elbow too', explains({ apb: 'weak' }).includes('median-wrist') && explains({ apb: 'weak' }).includes('median-elbow'));
t('weak APB with FCR normal: wrist yes, elbow no', explains({ apb: 'weak', fcr: 'normal' }).includes('median-wrist') && !explains({ apb: 'weak', fcr: 'normal' }).includes('median-elbow'));

// ── Data
t('Moro should be gone by 6 months', timelineState(TIMELINE.find(i => i.id === 'moro')!, 6) === 'should be gone');
t('Moro expected at 1 month', timelineState(TIMELINE.find(i => i.id === 'moro')!, 1) === 'expected');
t('parachute not yet at 6 months, present by 12', timelineState(TIMELINE.find(i => i.id === 'parachute')!, 6) === 'not yet' && timelineState(TIMELINE.find(i => i.id === 'parachute')!, 12) === 'should be present');
t('hand preference red flag at 9 months', timelineState(TIMELINE.find(i => i.id === 'hand')!, 9) === 'red flag if present');
t('coma: all hemispheric signs agree', comaVerdict({ breathing: 'cheyne', pupils: 'small-react', eyes: 'intact', posture: 'flexor' }).kind === 'level');
t('coma: reactive pupils + absent eye movements → metabolic', comaVerdict({ pupils: 'react-despite', eyes: 'none' }).kind === 'metabolic');
t('coma: mixed levels → scattered', comaVerdict({ breathing: 'ataxic', pupils: 'small-react' }).kind === 'scattered');
t('exam order: tier order has no inversions', examOrderScore([...EXAM_STEPS].sort((a, b) => a.tier - b.tier).map(s => s.id)).inversions === 0);
t('exam order: fundi first is penalised', examOrderScore(['fundi', ...EXAM_STEPS.filter(s => s.id !== 'fundi').map(s => s.id)]).inversions >= 6);
t('where-when keys are known tempos', Object.values(WHERE_WHEN).every(row => Object.keys(row ?? {}).every(k => TEMPOS.some(tp => tp.id === k))));
t('where-when keys are known levels', Object.keys(WHERE_WHEN).every(k => LEVELS.some(l => l.id === k)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
