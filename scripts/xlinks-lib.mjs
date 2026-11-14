// Shared checks for cross-curriculum links: the `related` field on module sections and the
// atlas deep links used by the localization widgets (src/loc/atlas-links.json).
// Used by validate-loc.mjs, validate-eeg.mjs and test-xlinks.ts.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const read = p => readFileSync(root + p, 'utf8');
const json = p => JSON.parse(read(p));

export const ATLAS_ROUTE = '/neuroradiology/atlas/';

// Static routes a related link may point at (beyond modules, genes, conditions and the atlas).
export const STATIC_ROUTES = new Set([
  '/', '/localization/', '/localization/review/', '/eeg/', '/eeg/review/', '/eeg/gallery/',
  '/neuromuscular/', '/browse/', '/search/', '/credits/', ATLAS_ROUTE,
  '/neuroradiology/', '/neuroradiology/review/',
]);

function moduleSections(dir) {
  const out = new Map();
  for (const f of readdirSync(root + dir).filter(f => f.endsWith('.json'))) {
    const m = json(`${dir}/${f}`);
    out.set(m.id, m.sections.length);
  }
  return out;
}

let cache;
export function loadSite() {
  if (cache) return cache;
  const manifest = json('public/atlas/manifest.json');
  const labelTables = {};
  const ages = new Map();
  for (const a of manifest.ages) {
    const cm = a.files.labels?.colormap;
    if (cm && !labelTables[cm]) labelTables[cm] = new Set(json(`public/atlas/${cm}`).labels.filter(Boolean));
    ages.set(a.id, { labels: cm ? labelTables[cm] : null, labelFile: a.files.labels?.full ?? null });
  }
  cache = {
    loc: moduleSections('src/loc/modules'),
    eeg: moduleSections('src/eeg/modules'),
    nrad: moduleSections('src/nrad/modules'),
    genes: new Set(json('src/data/genes-enriched.json').map(g => g.symbol)),
    conditions: new Set(json('src/data/conditions-enriched.json').map(c => c.slug)),
    atlasDefault: manifest.default,
    ages,
  };
  return cache;
}

/** Problems with one atlas deep link (age and label as they appear after URL decoding). */
export function checkAtlasTarget(age, label) {
  const site = loadSite();
  const errs = [];
  const a = site.ages.get(age ?? site.atlasDefault);
  if (!a) return [`atlas age "${age}" is not in public/atlas/manifest.json`];
  if (label != null) {
    if (!a.labels) errs.push(`atlas age "${age}" has no label volume, so label "${label}" cannot be shown`);
    else if (!a.labels.has(label)) errs.push(`atlas label "${label}" is not in the label table for ${age}`);
    if (a.labelFile && !existsSync(root + 'public/atlas/' + a.labelFile)) errs.push(`label volume public/atlas/${a.labelFile} is missing`);
  }
  return errs;
}

/** Problems with one internal href. Returns [] when the href resolves. */
export function checkHref(href) {
  const site = loadSite();
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return [`href "${href}" must be an internal path starting with /`];
  const u = new URL(href, 'https://site.invalid');
  const path = u.pathname;
  if (!path.endsWith('/')) return [`href "${href}" needs a trailing slash (the site uses trailingSlash)`];
  const hash = u.hash.slice(1);
  let m;
  const sectionOk = (n, count) => {
    if (!hash) return [];
    const s = hash.match(/^s(\d+)$/);
    if (!s) return [`anchor "#${hash}" should be #s<number>`];
    return Number(s[1]) >= 1 && Number(s[1]) <= count ? [] : [`anchor #${hash} is outside ${n} (it has ${count} sections)`];
  };
  if ((m = path.match(/^\/localization\/([^/]+)\/$/)) && !STATIC_ROUTES.has(path)) {
    return site.loc.has(m[1]) ? sectionOk(m[1], site.loc.get(m[1])) : [`unknown localization module "${m[1]}"`];
  }
  if ((m = path.match(/^\/eeg\/([^/]+)\/$/)) && !STATIC_ROUTES.has(path)) {
    return site.eeg.has(m[1]) ? sectionOk(m[1], site.eeg.get(m[1])) : [`unknown EEG module "${m[1]}"`];
  }
  if ((m = path.match(/^\/neuroradiology\/([^/]+)\/$/)) && !STATIC_ROUTES.has(path)) {
    return site.nrad.has(m[1]) ? sectionOk(m[1], site.nrad.get(m[1])) : [`unknown neuroradiology module "${m[1]}"`];
  }
  if ((m = path.match(/^\/gene\/([^/]+)\/$/))) {
    return site.genes.has(decodeURIComponent(m[1])) ? [] : [`gene "${m[1]}" is not in src/data/genes-enriched.json`];
  }
  if ((m = path.match(/^\/condition\/([^/]+)\/$/))) {
    return site.conditions.has(m[1]) ? [] : [`condition "${m[1]}" is not in src/data/conditions-enriched.json`];
  }
  if (path === ATLAS_ROUTE) {
    const extra = [...u.searchParams.keys()].filter(k => k !== 'age' && k !== 'label');
    if (extra.length) return [`atlas link has unknown parameters: ${extra.join(', ')}`];
    return checkAtlasTarget(u.searchParams.get('age'), u.searchParams.get('label'));
  }
  if (STATIC_ROUTES.has(path)) return u.search ? [`static route "${path}" takes no query string`] : [];
  return [`href "${href}" does not match a known route`];
}

/** Problems with a section's `related` array. `self` is the module's own base path, to catch self-links. */
export function checkRelated(related, self) {
  if (related === undefined) return [];
  if (!Array.isArray(related) || !related.length) return ['related must be a non-empty array when present'];
  const errs = [];
  const seen = new Set();
  for (const r of related) {
    if (!r || typeof r !== 'object') { errs.push('related entry is not an object'); continue; }
    const label = (r.label ?? '').trim();
    if (!label) errs.push(`related "${r.href}" has an empty label`);
    if (/—/.test(label)) errs.push(`related label "${label}" contains an em dash`);
    if (/;/.test(label)) errs.push(`related label "${label}" contains a semicolon`);
    if (seen.has(r.href)) errs.push(`related href "${r.href}" is listed twice`);
    seen.add(r.href);
    if (self && typeof r.href === 'string' && r.href.split('#')[0] === self) errs.push(`related href "${r.href}" points at its own module`);
    errs.push(...checkHref(r.href));
  }
  if (related.length > 4) errs.push(`related has ${related.length} links (keep it to 4 or fewer)`);
  return errs;
}
