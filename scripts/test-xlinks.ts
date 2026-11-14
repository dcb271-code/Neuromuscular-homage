// Cross-link checks: every `related` href in the localization and EEG modules resolves, every
// atlas link names an age and a structure that exist, every gene link has a gene page, and the
// widget atlas targets are valid.
//   node scripts/test-xlinks.ts
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { checkHref, checkRelated, checkAtlasTarget, loadSite, ATLAS_ROUTE } from './xlinks-lib.mjs';

const root = new URL('../', import.meta.url).pathname;
const json = (p: string) => JSON.parse(readFileSync(root + p, 'utf8'));

let pass = 0, fail = 0;
const t = (name: string, cond: boolean, detail = '') => { if (cond) pass++; else { fail++; console.log(`✗ ${name}${detail ? ': ' + detail : ''}`); } };

type Related = { href: string; label: string };
const all: { from: string; href: string; label: string }[] = [];

for (const [dir, base] of [['src/loc/modules', '/localization'], ['src/eeg/modules', '/eeg']] as const) {
  for (const f of readdirSync(root + dir).filter(f => f.endsWith('.json')).sort()) {
    const m = json(`${dir}/${f}`);
    m.sections.forEach((s: { title: string; related?: Related[] }, i: number) => {
      if (!s.related) return;
      const from = `${base}/${m.id}/#s${i + 1}`;
      const errs: string[] = checkRelated(s.related, `${base}/${m.id}/`);
      t(`${from} related`, errs.length === 0, errs.join('; '));
      for (const r of s.related) all.push({ from, href: r.href, label: r.label });
    });
  }
}
t('some related links exist', all.length > 20, `${all.length}`);

// Each kind of target, checked directly against the data (not only through the shared helper).
const site = loadSite();
const routeFiles: Record<string, string> = {
  localization: 'app/localization/[module]/page.tsx',
  eeg: 'app/eeg/[module]/page.tsx',
  gene: 'app/gene/[symbol]/page.tsx',
  condition: 'app/condition/[slug]/page.tsx',
};
for (const l of all) {
  const u = new URL(l.href, 'https://site.invalid');
  const seg = u.pathname.split('/')[1];
  if (routeFiles[seg]) t(`route file for ${l.href}`, existsSync(root + routeFiles[seg]));
  if (seg === 'gene') {
    const sym = u.pathname.split('/')[2];
    t(`gene ${sym} exists (${l.from})`, site.genes.has(sym));
  }
  if (u.pathname === ATLAS_ROUTE) {
    const age = u.searchParams.get('age'), label = u.searchParams.get('label');
    t(`atlas link has an age and a label (${l.from})`, !!age && !!label);
    const a = site.ages.get(age);
    t(`atlas age ${age} exists`, !!a);
    t(`atlas label "${label}" exists for ${age}`, !!a?.labels?.has(label));
    t(`label volume for ${age} is on disk`, !!a?.labelFile && existsSync(`${root}public/atlas/${a.labelFile}`));
  }
  if (seg === 'neuroradiology') t(`neuroradiology link is the atlas or a published module (${l.href})`, u.pathname === ATLAS_ROUTE || checkHref(l.href).length === 0);
  t(`label is plain (${l.href})`, !!l.label.trim() && !/[—;]/.test(l.label));
}

// The atlas page itself is built by the neuroradiology agent; flag it until it exists.
const atlasPage = existsSync(root + 'app/neuroradiology/atlas/page.tsx');
if (!atlasPage) console.log('! app/neuroradiology/atlas/page.tsx does not exist yet: atlas links will 404 until it does');

// Widget "See it on MRI" targets.
const targets = json('src/loc/atlas-links.json').targets as Record<string, { age: string; label: string }>;
for (const [site, tg] of Object.entries(targets)) {
  const errs: string[] = checkAtlasTarget(tg.age, tg.label);
  t(`widget target ${site}`, errs.length === 0, errs.join('; '));
}
// Laterality: a left-sided widget site must map to a left-sided structure and vice versa.
for (const [s, tg] of Object.entries(targets)) {
  if (/-L$/.test(s)) t(`${s} maps to a left structure`, / left$/.test(tg.label));
  if (/-R$/.test(s)) t(`${s} maps to a right structure`, / right$/.test(tg.label));
}

// The checker must reject bad links (guards against a checker that passes everything).
const bad = [
  '/eeg/m99-nothing/', '/eeg/m11-critical-care/#s99', '/gene/NOTAGENE/', '/condition/not-a-condition/',
  `${ATLAS_ROUTE}?age=pma40w&label=Putamen%20left`, // AAL name, not in the dHCP table
  `${ATLAS_ROUTE}?age=m06&label=Thalamus%20left`, // template without labels
  `${ATLAS_ROUTE}?age=zzz`, '/neuroradiology/m01-ct/', 'https://example.com/', '/eeg/m11-critical-care',
];
for (const h of bad) t(`rejects ${h}`, (checkHref(h) as string[]).length > 0);
t('rejects an em dash label', (checkRelated([{ href: '/eeg/', label: 'EEG — home' }]) as string[]).length > 0);
t('rejects a semicolon label', (checkRelated([{ href: '/eeg/', label: 'EEG; home' }]) as string[]).length > 0);
t('rejects an empty label', (checkRelated([{ href: '/eeg/', label: ' ' }]) as string[]).length > 0);
t('accepts a good atlas link', (checkHref(`${ATLAS_ROUTE}?age=unc2y&label=Calcarine%20cortex%20left`) as string[]).length === 0);

console.log(`\n${pass} passed, ${fail} failed (${all.length} related links)`);
process.exit(fail ? 1 : 0);
