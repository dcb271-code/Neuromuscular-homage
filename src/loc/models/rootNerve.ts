// Root vs plexus vs nerve. Each examinable item (a muscle or a reflex) has the roots that
// supply it, its PREDOMINANT root(s), and the nerve that carries it. A candidate lesion
// explains the exam if every abnormal item depends on it and no item that depends mainly on
// it is normal. "Every muscle a nerve supplies below the lesion must be weak" (Morris 2012,
// p. xxix); "test a muscle with the same root but a different nerve" (Morris 2012, p. 23).
// Root assignments differ by a segment between sources; this table uses predominant roots.

export type Root = 'C5' | 'C6' | 'C7' | 'C8' | 'T1' | 'L2' | 'L3' | 'L4' | 'L5' | 'S1' | 'S2';

export interface Item {
  id: string; label: string; kind: 'muscle' | 'reflex'; limb: 'arm' | 'leg';
  roots: Root[]; main: Root[]; nerve: string;
  rootLevel?: boolean; // branch leaves the roots before the plexus (spared in a plexopathy)
}

export const ITEMS: Item[] = [
  // Arm
  { id: 'rhomboids', label: 'Rhomboids (brace shoulder blade back)', kind: 'muscle', limb: 'arm', roots: ['C5'], main: ['C5'], nerve: 'dorsal scapular', rootLevel: true },
  { id: 'serratus', label: 'Serratus anterior (push against wall; no winging)', kind: 'muscle', limb: 'arm', roots: ['C5', 'C6', 'C7'], main: ['C6'], nerve: 'long thoracic', rootLevel: true },
  { id: 'infraspinatus', label: 'Infraspinatus (shoulder external rotation)', kind: 'muscle', limb: 'arm', roots: ['C5', 'C6'], main: ['C5'], nerve: 'suprascapular' },
  { id: 'deltoid', label: 'Deltoid (shoulder abduction)', kind: 'muscle', limb: 'arm', roots: ['C5', 'C6'], main: ['C5'], nerve: 'axillary' },
  { id: 'biceps', label: 'Biceps (elbow flexion)', kind: 'muscle', limb: 'arm', roots: ['C5', 'C6'], main: ['C5', 'C6'], nerve: 'musculocutaneous' },
  { id: 'brachioradialis', label: 'Brachioradialis (elbow flexion, thumb up)', kind: 'muscle', limb: 'arm', roots: ['C5', 'C6'], main: ['C6'], nerve: 'radial' },
  { id: 'triceps', label: 'Triceps (elbow extension)', kind: 'muscle', limb: 'arm', roots: ['C6', 'C7', 'C8'], main: ['C7'], nerve: 'radial-high' },
  { id: 'wrist-ext', label: 'Wrist extensors', kind: 'muscle', limb: 'arm', roots: ['C6', 'C7'], main: ['C6', 'C7'], nerve: 'radial' },
  { id: 'finger-ext', label: 'Finger extensors', kind: 'muscle', limb: 'arm', roots: ['C7', 'C8'], main: ['C7'], nerve: 'posterior interosseous' },
  { id: 'fcr', label: 'Flexor carpi radialis (wrist flexion)', kind: 'muscle', limb: 'arm', roots: ['C6', 'C7'], main: ['C7'], nerve: 'median-high' },
  { id: 'apb', label: 'Abductor pollicis brevis (thumb abduction)', kind: 'muscle', limb: 'arm', roots: ['C8', 'T1'], main: ['T1'], nerve: 'median' },
  { id: 'fdi', label: 'First dorsal interosseous (finger spreading)', kind: 'muscle', limb: 'arm', roots: ['C8', 'T1'], main: ['T1'], nerve: 'ulnar' },
  { id: 'fdp45', label: 'Deep finger flexors, ring and little fingers', kind: 'muscle', limb: 'arm', roots: ['C8'], main: ['C8'], nerve: 'ulnar' },
  { id: 'r-biceps', label: 'Biceps reflex', kind: 'reflex', limb: 'arm', roots: ['C5', 'C6'], main: ['C5', 'C6'], nerve: 'musculocutaneous' },
  { id: 'r-br', label: 'Brachioradialis reflex', kind: 'reflex', limb: 'arm', roots: ['C6'], main: ['C6'], nerve: 'radial' },
  { id: 'r-triceps', label: 'Triceps reflex', kind: 'reflex', limb: 'arm', roots: ['C7'], main: ['C7'], nerve: 'radial-high' },
  // Leg
  { id: 'iliopsoas', label: 'Iliopsoas (hip flexion)', kind: 'muscle', limb: 'leg', roots: ['L2', 'L3'], main: ['L2'], nerve: 'femoral-plexus' },
  { id: 'adductors', label: 'Hip adductors', kind: 'muscle', limb: 'leg', roots: ['L2', 'L3', 'L4'], main: ['L3'], nerve: 'obturator' },
  { id: 'quadriceps', label: 'Quadriceps (knee extension)', kind: 'muscle', limb: 'leg', roots: ['L3', 'L4'], main: ['L4'], nerve: 'femoral' },
  { id: 'glut-med', label: 'Gluteus medius (hip abduction)', kind: 'muscle', limb: 'leg', roots: ['L4', 'L5', 'S1'], main: ['L5'], nerve: 'superior gluteal' },
  { id: 'tib-ant', label: 'Tibialis anterior (ankle dorsiflexion)', kind: 'muscle', limb: 'leg', roots: ['L4', 'L5'], main: ['L4', 'L5'], nerve: 'deep peroneal' },
  { id: 'ehl', label: 'Extensor hallucis longus (big toe up)', kind: 'muscle', limb: 'leg', roots: ['L5'], main: ['L5'], nerve: 'deep peroneal' },
  { id: 'peroneus', label: 'Peroneus longus (ankle eversion)', kind: 'muscle', limb: 'leg', roots: ['L5', 'S1'], main: ['L5'], nerve: 'superficial peroneal' },
  { id: 'tib-post', label: 'Tibialis posterior (ankle inversion)', kind: 'muscle', limb: 'leg', roots: ['L4', 'L5'], main: ['L5'], nerve: 'tibial' },
  { id: 'hamstrings', label: 'Hamstrings (knee flexion)', kind: 'muscle', limb: 'leg', roots: ['L5', 'S1'], main: ['S1'], nerve: 'sciatic' },
  { id: 'gastroc', label: 'Gastrocnemius (stand on tiptoe)', kind: 'muscle', limb: 'leg', roots: ['S1', 'S2'], main: ['S1'], nerve: 'tibial' },
  { id: 'r-knee', label: 'Knee reflex', kind: 'reflex', limb: 'leg', roots: ['L2', 'L3', 'L4'], main: ['L4'], nerve: 'femoral' },
  { id: 'r-ankle', label: 'Ankle reflex', kind: 'reflex', limb: 'leg', roots: ['S1', 'S2'], main: ['S1'], nerve: 'tibial' },
];

// Nerve lesions, each defined by the items whose nerve lies DISTAL to that lesion site.
const N = (...nerves: string[]) => ITEMS.filter(i => nerves.includes(i.nerve)).map(i => i.id);
export const NERVE_LESIONS: { id: string; name: string; covers: string[] }[] = [
  { id: 'axillary', name: 'Axillary nerve', covers: N('axillary') },
  { id: 'musculocutaneous', name: 'Musculocutaneous nerve', covers: N('musculocutaneous') },
  { id: 'suprascapular', name: 'Suprascapular nerve', covers: N('suprascapular') },
  { id: 'radial-groove', name: 'Radial nerve at the spiral groove (triceps spared)', covers: N('radial', 'posterior interosseous') },
  { id: 'radial-axilla', name: 'Radial nerve in the axilla', covers: N('radial', 'radial-high', 'posterior interosseous') },
  { id: 'pin', name: 'Posterior interosseous nerve', covers: N('posterior interosseous') },
  { id: 'median-wrist', name: 'Median nerve at the wrist', covers: N('median') },
  { id: 'median-elbow', name: 'Median nerve at the elbow', covers: N('median', 'median-high') },
  { id: 'ulnar', name: 'Ulnar nerve', covers: N('ulnar') },
  { id: 'long-thoracic', name: 'Long thoracic nerve', covers: N('long thoracic') },
  { id: 'femoral', name: 'Femoral nerve', covers: N('femoral') },
  { id: 'obturator', name: 'Obturator nerve', covers: N('obturator') },
  { id: 'sup-gluteal', name: 'Superior gluteal nerve', covers: N('superior gluteal') },
  { id: 'common-peroneal', name: 'Common peroneal nerve at the fibular head', covers: N('deep peroneal', 'superficial peroneal') },
  { id: 'deep-peroneal', name: 'Deep peroneal nerve', covers: N('deep peroneal') },
  { id: 'tibial', name: 'Tibial nerve', covers: N('tibial') },
  { id: 'sciatic', name: 'Sciatic nerve', covers: N('deep peroneal', 'superficial peroneal', 'tibial', 'sciatic') },
];

// Plexus lesions: the roots they carry, minus branches that leave before the plexus.
export const PLEXUS_LESIONS: { id: string; name: string; roots: Root[] }[] = [
  { id: 'upper-trunk', name: 'Upper trunk of the brachial plexus (C5-C6; Erb)', roots: ['C5', 'C6'] },
  { id: 'lower-trunk', name: 'Lower trunk of the brachial plexus (C8-T1; Klumpke)', roots: ['C8', 'T1'] },
];

export const ROOTS: Root[] = ['C5', 'C6', 'C7', 'C8', 'T1', 'L2', 'L3', 'L4', 'L5', 'S1'];

export type Exam = Record<string, 'weak' | 'normal'>; // untested items are absent

export interface Candidate { kind: 'root' | 'plexus' | 'nerve'; id: string; name: string; explains: boolean; why: string }

const label = (id: string) => ITEMS.find(i => i.id === id)!.label;

export function candidates(exam: Exam): Candidate[] {
  const weak = Object.keys(exam).filter(k => exam[k] === 'weak');
  const normal = Object.keys(exam).filter(k => exam[k] === 'normal');
  const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  if (!weak.length) return [];
  const out: Candidate[] = [];

  for (const r of ROOTS) {
    const unexplained = weak.filter(w => !byId[w].roots.includes(r));
    const contradict = normal.filter(n => byId[n].main.includes(r));
    out.push({ kind: 'root', id: r, name: `${r} root`, explains: !unexplained.length && !contradict.length,
      why: unexplained.length ? `${label(unexplained[0])} does not depend on ${r}.` : contradict.length ? `${label(contradict[0])} depends mainly on ${r} and is normal.` : `Every weak item depends on ${r}, and nothing that depends mainly on ${r} is normal.` });
  }
  for (const p of PLEXUS_LESIONS) {
    const inTrunk = (i: Item) => !i.rootLevel && i.roots.some(r => p.roots.includes(r));
    const unexplained = weak.filter(w => !inTrunk(byId[w]));
    const contradict = normal.filter(n => !byId[n].rootLevel && byId[n].main.every(r => p.roots.includes(r)));
    out.push({ kind: 'plexus', id: p.id, name: p.name, explains: !unexplained.length && !contradict.length,
      why: unexplained.length ? `${label(unexplained[0])} is ${byId[unexplained[0]].rootLevel ? 'supplied by a branch that leaves the roots before the plexus' : 'not carried by this trunk'}.` : contradict.length ? `${label(contradict[0])} runs through this trunk and is normal.` : 'Every weak item runs through this trunk, and its root-level branches are spared.' });
  }
  for (const n of NERVE_LESIONS) {
    const unexplained = weak.filter(w => !n.covers.includes(w));
    const contradict = normal.filter(x => n.covers.includes(x));
    out.push({ kind: 'nerve', id: n.id, name: n.name, explains: !unexplained.length && !contradict.length,
      why: unexplained.length ? `${label(unexplained[0])} is not supplied by this nerve below the lesion.` : contradict.length ? `${label(contradict[0])} is supplied by this nerve below the lesion and is normal.` : 'Every weak item is supplied by this nerve, and everything it supplies below the lesion is weak.' });
  }
  return out;
}

export const RN_PRESETS: { id: string; label: string; exam: Exam; teaching: string }[] = [
  { id: 'peroneal', label: 'Foot drop; inversion and hip abduction normal', exam: { 'tib-ant': 'weak', ehl: 'weak', peroneus: 'weak', 'tib-post': 'normal', 'glut-med': 'normal', 'r-ankle': 'normal' },
    teaching: 'Inversion (tibial nerve) and hip abduction (superior gluteal) share the L5 root but not the peroneal nerve. Both normal: the common peroneal nerve, often compressed at the fibular head.' },
  { id: 'l5', label: 'Foot drop; inversion and hip abduction also weak', exam: { 'tib-ant': 'weak', ehl: 'weak', peroneus: 'weak', 'tib-post': 'weak', 'glut-med': 'weak', 'r-ankle': 'normal' },
    teaching: 'Now muscles from three different nerves are weak, and the one thing they share is the L5 root.' },
  { id: 'radial', label: 'Wrist drop; triceps and its reflex normal', exam: { 'wrist-ext': 'weak', 'finger-ext': 'weak', brachioradialis: 'weak', triceps: 'normal', 'r-triceps': 'normal', deltoid: 'normal' },
    teaching: 'Triceps branches leave the radial nerve high in the arm. Spared triceps puts the lesion at or below the spiral groove.' },
  { id: 'erb', label: 'Newborn arm hangs limp at the side; hand moves; rhomboids and serratus working', exam: { deltoid: 'weak', biceps: 'weak', infraspinatus: 'weak', brachioradialis: 'weak', 'r-biceps': 'weak', rhomboids: 'normal', serratus: 'normal', apb: 'normal', fdi: 'normal' },
    teaching: 'Shoulder and elbow-flexor weakness is C5 and C6. Spared rhomboids and serratus, whose nerves leave the roots before the plexus, place the injury beyond the roots: the upper trunk (Erb palsy).' },
];
