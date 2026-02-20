/**
 * scrape.mjs — Crawls neuromuscular.wustl.edu and extracts structured disease data.
 *
 * Run: node scripts/scrape.mjs
 *
 * Output:
 *   src/data/diseases.json  — array of disease entries with genes, inheritance, features
 *   src/data/pages.json     — per-page metadata
 *   src/data/search.json    — flat search chunks (copied to public/)
 *   src/data/index.json     — summary stats
 */

import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const DATA_DIR  = path.join(ROOT, 'src', 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');
fs.mkdirSync(DATA_DIR,  { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const BASE = 'https://neuromuscular.wustl.edu';
const DELAY_MS = 400; // polite rate limit

// ── Utility ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function resolveUrl(href, fromUrl) {
  try {
    const u = new URL(href, fromUrl);
    // Normalize path — collapse repeated slashes like //musdist → /musdist
    u.pathname = u.pathname.replace(/\/\/+/g, '/');
    return u.href;
  } catch { return null; }
}

function isInternal(url) {
  try {
    return new URL(url).hostname === 'neuromuscular.wustl.edu';
  } catch { return false; }
}

function pageKey(url) {
  // Strip fragment + normalize path — prevents //page variants looping forever
  try {
    const u = new URL(url);
    u.hash = '';
    u.pathname = u.pathname.replace(/\/\/+/g, '/');
    return u.href;
  } catch { return url; }
}

function stripFragment(url) {
  return pageKey(url);
}

// Skip non-HTML resources
const SKIP_EXT = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|gif|png|jpg|jpeg|css|js|ico)$/i;
function skipUrl(url) {
  try {
    const p = new URL(url).pathname;
    return SKIP_EXT.test(p);
  } catch { return true; }
}

// ── Gene / inheritance extraction ─────────────────────────────────────────

// Bullet char used on the site (Unicode ● or HTML &#9679; or similar)
// Also handles plain "•" or "-" prefixed gene lines.
const GENE_BULLET_RE = /[●•·\-]\s*([A-Z][A-Z0-9][A-Za-z0-9\-\/]*(?:\s+[A-Z][A-Za-z0-9\-\/]+)?)/g;

const INHERITANCE_TERMS = [
  'dominant', 'recessive', 'x-linked', 'x linked', 'xr', 'xl',
  'autosomal dominant', 'autosomal recessive', 'ad', 'ar',
  'mitochondrial', 'de novo', 'sporadic', 'variable', 'maternal',
  'digenic', 'semidominant',
];

const INHERITANCE_RE = new RegExp(
  `\\b(${INHERITANCE_TERMS.join('|')})\\b`,
  'gi'
);

function extractGenes(text) {
  const genes = [];
  const seen  = new Set();

  // Pattern 1: ● GENE; Chromosome Xp21; Dominant
  const full = /[●•]\s*([A-Z][A-Z0-9][A-Za-z0-9\-\/]*(?:\s+[A-Z0-9][A-Za-z0-9\-\/]+)?)\s*(?:\[[^\]]*\])?\s*;?\s*(?:Chromosome\s+([^;,\n]+?))?(?:\s*;\s*([^;\n<]{2,50}))?(?=\s*[;<\n]|$)/g;
  let m;
  while ((m = full.exec(text)) !== null) {
    const sym  = m[1].trim();
    const chr  = m[2]?.trim() ?? '';
    const rest = m[3]?.trim() ?? '';
    if (sym.length < 2 || sym.length > 30) continue;
    const key = sym.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    genes.push({ symbol: sym, chromosome: chr, note: rest });
  }

  // Pattern 2: simpler bullet-only lines
  if (genes.length === 0) {
    GENE_BULLET_RE.lastIndex = 0;
    while ((m = GENE_BULLET_RE.exec(text)) !== null) {
      const sym = m[1].trim();
      if (sym.length < 2 || sym.length > 30) continue;
      const key = sym.toUpperCase();
      if (seen.has(key)) continue;
      seen.add(key);
      genes.push({ symbol: sym, chromosome: '', note: '' });
    }
  }

  return genes;
}

function extractInheritance(text) {
  const found = new Set();
  let m;
  INHERITANCE_RE.lastIndex = 0;
  while ((m = INHERITANCE_RE.exec(text)) !== null) {
    found.add(normalizeInheritance(m[1]));
  }
  return [...found];
}

function normalizeInheritance(raw) {
  const r = raw.toLowerCase();
  if (r === 'ad' || r.includes('autosomal dominant') || r === 'dominant') return 'Autosomal Dominant';
  if (r === 'ar' || r.includes('autosomal recessive') || r === 'recessive') return 'Autosomal Recessive';
  if (r === 'xl' || r === 'xr' || r.includes('x-linked') || r.includes('x linked')) return 'X-Linked';
  if (r.includes('mitochondrial') || r.includes('maternal')) return 'Mitochondrial';
  if (r === 'de novo') return 'De Novo';
  if (r === 'sporadic') return 'Sporadic';
  if (r === 'digenic') return 'Digenic';
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function extractOmim(html) {
  const ids = [];
  const re = /omim\.org\/entry\/(\d+)/gi;
  let m;
  while ((m = re.exec(html)) !== null) ids.push(m[1]);
  return [...new Set(ids)];
}

// ── Page category from URL path ────────────────────────────────────────────

function categoryFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    const dir   = parts.length > 1 ? parts[parts.length - 2] : '';
    const file  = parts[parts.length - 1].replace(/\.html?$/, '');
    const map = {
      musdist: 'Muscular Dystrophy',
      time:    'Neuropathy (Hereditary)',
      antibody:'Immune/Antibody',
      ataxia:  'Ataxia/Cerebellar',
      mother:  'Ion Channels / Membrane',
      nother:  'Other Neuromuscular',
      nanatomy:'Nerve Anatomy',
      msys:    'Systemic/Multisystem',
      synmot:  'Motor Neuron / ALS',
      lab:     'Laboratory / Diagnostics',
      over:    'Overview / Fellowship',
    };
    return map[dir] ?? map[file] ?? 'General';
  } catch { return 'General'; }
}

// ── Section extraction from a single page ─────────────────────────────────

function extractSections(html, pageUrl) {
  const $    = cheerio.load(html);
  const sections = [];

  // Collect all anchor points and headings to find section boundaries
  const markers = [];

  // Named anchors: <a name="xyz"> — each is a disease/topic anchor
  $('a[name]').each((_, el) => {
    markers.push({
      type: 'anchor',
      name: $(el).attr('name') || '',
      el,
    });
  });

  // Headings h2–h4
  $('h2, h3, h4').each((_, el) => {
    markers.push({
      type: 'heading',
      name: $(el).text().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 60),
      text: $(el).text().trim(),
      el,
    });
  });

  // If no markers, treat whole page as one section
  if (markers.length === 0) {
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const rawHtml = $('body').html() || '';
    if (text.length > 50) {
      sections.push(makeSection($, pageUrl, '', text, rawHtml, categoryFromUrl(pageUrl)));
    }
    return sections;
  }

  // Build sections between consecutive markers
  // We'll use a simpler approach: chunk the body text around each anchor
  // For each named anchor, grab the text until the next anchor/heading
  const bodyHtml = $('body').html() || '';

  // Split by anchor tags
  const anchorSplits = [];
  $('body').find('a[name], h2, h3, h4').each((_, el) => {
    const name = $(el).attr('name') || $(el).text().trim().slice(0, 60);
    const label = $(el).text().trim() || name;
    anchorSplits.push({ name, label, el });
  });

  for (let i = 0; i < anchorSplits.length; i++) {
    const { name, label, el } = anchorSplits[i];

    // Collect sibling elements until the next marker
    const contentEls = [];
    let cur = $(el).next()[0];
    while (cur) {
      const tag = cur.tagName?.toLowerCase();
      // Stop at next anchor marker or heading
      if (tag === 'a' && $(cur).attr('name')) break;
      if (['h2', 'h3', 'h4'].includes(tag)) break;
      contentEls.push(cur);
      cur = $(cur).next()[0];
    }

    const contentHtml = contentEls.map(e => $.html(e)).join('');
    const contentText = cheerio.load(contentHtml).text().replace(/\s+/g, ' ').trim();

    if (contentText.length < 30) continue; // skip empty sections

    const displayName = label || name;
    sections.push(makeSection($, pageUrl, name, contentText, contentHtml, categoryFromUrl(pageUrl), displayName));
  }

  // Also add a page-level entry if there's content before the first marker
  return sections;
}

function makeSection($, pageUrl, anchor, text, rawHtml, category, displayName) {
  const genes       = extractGenes(text);
  const inheritance = extractInheritance(text);
  const omimIds     = extractOmim(rawHtml);

  // Try to derive a clean disease name
  const name = displayName
    ? displayName
    : anchor.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();

  return {
    id:          `${pageUrl}#${anchor}`,
    url:         pageUrl,
    anchor,
    name:        name || 'Untitled',
    category,
    genes,
    inheritance,
    omimIds,
    // Trim content to reasonable size for search
    content: text.slice(0, 1200),
  };
}

// ── Fetcher with retry ─────────────────────────────────────────────────────

async function fetchPage(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (academic research crawler)' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('html')) return null;
      return await res.text();
    } catch (e) {
      if (i === retries) return null;
      await sleep(1000);
    }
  }
  return null;
}

// ── Extract internal links from a page ────────────────────────────────────

function extractLinks(html, fromUrl) {
  const $ = cheerio.load(html);
  const links = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    const resolved = resolveUrl(href, fromUrl);
    if (!resolved) return;
    if (!isInternal(resolved)) return;
    if (skipUrl(resolved)) return;
    links.add(stripFragment(resolved));
  });
  return [...links];
}

// ── Main crawl ─────────────────────────────────────────────────────────────

async function crawl() {
  const visited = new Set();
  const queue   = [
    `${BASE}/alfindex.htm`,
    `${BASE}/`,
    `${BASE}/motor.html`,
    `${BASE}/spinal.html`,
    `${BASE}/synmot.html`,
    `${BASE}/synmg.html`,
    `${BASE}/mitosyn.html`,
    `${BASE}/maltbrain.html`,
    `${BASE}/naltbrain.html`,
  ];

  const allSections = [];
  const pagesMeta   = [];

  let pageCount = 0;

  while (queue.length > 0) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    if (SKIP_EXT.test(new URL(url).pathname)) continue;

    process.stdout.write(`[${++pageCount}] ${url.replace(BASE, '')} ... `);

    const html = await fetchPage(url);
    if (!html) {
      console.log('SKIP (no HTML)');
      await sleep(DELAY_MS);
      continue;
    }

    // Extract sections/diseases from this page
    const sections = extractSections(html, url);
    allSections.push(...sections);

    // Discover more links
    const links = extractLinks(html, url);
    let newLinks = 0;
    for (const link of links) {
      if (!visited.has(link) && !queue.includes(link)) {
        queue.push(link);
        newLinks++;
      }
    }

    pagesMeta.push({
      url,
      sectionCount: sections.length,
      category: categoryFromUrl(url),
    });

    console.log(`${sections.length} sections, ${newLinks} new links`);
    await sleep(DELAY_MS);
  }

  return { allSections, pagesMeta, pageCount };
}

// ── Post-process: deduplicate and clean ───────────────────────────────────

function deduplicateSections(sections) {
  const seen = new Set();
  return sections.filter(s => {
    const key = s.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildSearchChunks(sections) {
  return sections.map(s => ({
    id:          s.id,
    name:        s.name,
    category:    s.category,
    genes:       s.genes.map(g => g.symbol).join(', '),
    inheritance: s.inheritance.join(', '),
    omimIds:     s.omimIds.join(', '),
    content:     s.content.slice(0, 600),
    url:         s.url,
    anchor:      s.anchor,
  }));
}

// ── Run ───────────────────────────────────────────────────────────────────

console.log('Starting crawl of neuromuscular.wustl.edu...\n');

const { allSections, pagesMeta, pageCount } = await crawl();
const diseases = deduplicateSections(allSections);
const chunks   = buildSearchChunks(diseases);

// Summary stats
const withGenes = diseases.filter(d => d.genes.length > 0).length;
const withInheritance = diseases.filter(d => d.inheritance.length > 0).length;

const summary = {
  crawledPages:   pageCount,
  totalSections:  diseases.length,
  withGenes,
  withInheritance,
  categories: [...new Set(diseases.map(d => d.category))].sort(),
};

fs.writeFileSync(path.join(DATA_DIR, 'diseases.json'), JSON.stringify(diseases,  null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'pages.json'),   JSON.stringify(pagesMeta, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'search.json'),  JSON.stringify(chunks,    null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'index.json'),   JSON.stringify(summary,   null, 2));
fs.copyFileSync(path.join(DATA_DIR, 'search.json'), path.join(PUBLIC_DIR, 'search.json'));

console.log('\n✅ Done!');
console.log(`   Pages crawled:  ${pageCount}`);
console.log(`   Sections found: ${diseases.length}`);
console.log(`   With genes:     ${withGenes}`);
console.log(`   With inheritance: ${withInheritance}`);
