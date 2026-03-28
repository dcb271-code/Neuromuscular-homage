#!/usr/bin/env node
/**
 * build-gene-db.mjs
 *
 * Compiles a comprehensive gene database from:
 *   1. daily.json        — 20 deeply curated genes with hallmarks/citations
 *   2. curatedIndex.ts   — 274 gene symbols with WUSTL links
 *   3. search.json       — 14K scraped entries with OMIM, inheritance, content
 *   4. NCBI Gene API     — gene summaries, aliases, chromosome info (with --enrich)
 *
 * Usage:
 *   node scripts/build-gene-db.mjs           # local data only (fast)
 *   node scripts/build-gene-db.mjs --enrich  # + NCBI Gene API fetch
 *
 * Output: src/data/genes-enriched.json, src/data/conditions-enriched.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ENRICH = process.argv.includes('--enrich');
const NCBI_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const DELAY_MS = 350; // stay under 3 req/sec NCBI limit

// ─── Helpers ────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80); // cap slug length to prevent filesystem issues
}

function isValidConditionName(name) {
  if (!name || name.length < 4) return false;
  if (name.length > 120) return false; // reject paragraph-length "names"
  if (/^[a-z][a-z0-9]*$/.test(name)) return false; // anchor slugs
  if (/^ref\d+/i.test(name)) return false;
  if (/^\d+\.?$/.test(name)) return false;
  if (/^\d[a-z0-9]+$/.test(name)) return false;
  // Reject things that look like sentences (multiple spaces + lots of lowercase)
  if ((name.match(/ /g) || []).length > 15) return false;
  return true;
}

function cleanGeneSymbol(raw) {
  // Handle entries like "ADCK3 (COQ8A)" or "POLG (Alpers)" -> take first token
  return raw.split(/[\s(]/)[0].trim().toUpperCase();
}

// ─── 1. Load local sources ──────────────────────────────────────────────────────

console.log('Loading local data...');

// daily.json — rich gene data
const daily = JSON.parse(readFileSync(resolve(root, 'src/data/daily.json'), 'utf8'));
const dailyGenes = new Map();
for (const g of daily.genes) {
  dailyGenes.set(g.symbol.toUpperCase(), g);
}

// curatedIndex.ts — gene symbols + WUSTL links
const indexText = readFileSync(resolve(root, 'src/data/curatedIndex.ts'), 'utf8');
const indexEntries = [...indexText.matchAll(
  /\{\s*letter:\s*"(\w)",\s*type:\s*"(gene|condition)",\s*name:\s*"([^"]+)",\s*href:\s*"([^"]+)",\s*dagger:\s*(true|false)\s*\}/g
)];

const curatedGenes = indexEntries
  .filter(e => e[2] === 'gene')
  .map(e => ({ rawName: e[3], symbol: cleanGeneSymbol(e[3]), href: e[4], dagger: e[5] === 'true', letter: e[1] }));

const curatedConditions = indexEntries
  .filter(e => e[2] === 'condition')
  .map(e => ({ name: e[3], href: e[4], dagger: e[5] === 'true', letter: e[1] }));

// Supplemental important genes not in curatedIndex.ts or daily.json
const SUPPLEMENTAL_GENES = [
  { symbol: 'FXN', href: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#FA' },
  { symbol: 'COL6A1', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#beth' },
  { symbol: 'COL6A2', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#beth' },
  { symbol: 'COL6A3', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#beth' },
  { symbol: 'EMD', href: 'https://neuromuscular.wustl.edu/msys/contract.html#emd' },
  { symbol: 'CHRNA1', href: 'https://neuromuscular.wustl.edu/synmg.html#chrna1' },
  { symbol: 'MUSK', href: 'https://neuromuscular.wustl.edu/synmg.html#musk' },
  { symbol: 'CLCN1', href: 'https://neuromuscular.wustl.edu/mother/chan.html#clcn1' },
  { symbol: 'SPG4', href: 'https://neuromuscular.wustl.edu/spinal/fsp.html#spast' },
  { symbol: 'SPG7', href: 'https://neuromuscular.wustl.edu/spinal/fsp.html#spg7' },
  { symbol: 'ATM', href: 'https://neuromuscular.wustl.edu/ataxia/dnarep.html#at' },
  { symbol: 'SGCA', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2d' },
  { symbol: 'SGCB', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2e' },
  { symbol: 'SGCG', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2c' },
  { symbol: 'SGCD', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2f' },
  { symbol: 'DES', href: 'https://neuromuscular.wustl.edu/mother/myosin.htm#desdis' },
  { symbol: 'FLNC', href: 'https://neuromuscular.wustl.edu/mother/myosin.htm#flnc' },
  { symbol: 'UBA1', href: 'https://neuromuscular.wustl.edu/synmot.html#uba1' },
  { symbol: 'HEXB', href: 'https://neuromuscular.wustl.edu/synmot.html#hexB' },
  { symbol: 'HEXA', href: 'https://neuromuscular.wustl.edu/synmot.html#hexA' },
  { symbol: 'FKRP', href: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2i' },
  { symbol: 'CACNA1A', href: 'https://neuromuscular.wustl.edu/ataxia/domatax.html#sca6' },
  { symbol: 'GJB1', href: 'https://neuromuscular.wustl.edu/time/hmsn.html#cmtx1' },
  { symbol: 'MPZ', href: 'https://neuromuscular.wustl.edu/time/hmsn.html#mpz' },
  { symbol: 'SH3TC2', href: 'https://neuromuscular.wustl.edu/time/hmsn.html#cmt4c' },
  { symbol: 'GDAP1', href: 'https://neuromuscular.wustl.edu/time/hmsn.html#gdap1' },
  { symbol: 'IGHMBP2', href: 'https://neuromuscular.wustl.edu/synmot.html#smard1' },
  { symbol: 'TRPV4', href: 'https://neuromuscular.wustl.edu/time/hmsn.html#trpv4' },
  { symbol: 'BAG3', href: 'https://neuromuscular.wustl.edu/mother/myosin.htm#bag3' },
  { symbol: 'SELENON', href: 'https://neuromuscular.wustl.edu/syncm.html#selenon' },
  { symbol: 'BIN1', href: 'https://neuromuscular.wustl.edu/syncm.html#bin1' },
  { symbol: 'STAC3', href: 'https://neuromuscular.wustl.edu/syncm.html#stac3' },
  { symbol: 'CHAT', href: 'https://neuromuscular.wustl.edu/synmg.html#chat' },
  { symbol: 'RAPSN', href: 'https://neuromuscular.wustl.edu/synmg.html#rapsn' },
  { symbol: 'DOK7', href: 'https://neuromuscular.wustl.edu/synmg.html#dok7' },
  { symbol: 'AGRN', href: 'https://neuromuscular.wustl.edu/synmg.html#agrn' },
  { symbol: 'POLG', href: 'https://neuromuscular.wustl.edu/mitosyn.html#alpers' },
  { symbol: 'SURF1', href: 'https://neuromuscular.wustl.edu/mitosyn.html#surf1' },
  { symbol: 'TWNK', href: 'https://neuromuscular.wustl.edu/mitosyn.html#twinkle' },
  { symbol: 'OPA1', href: 'https://neuromuscular.wustl.edu/mitosyn.html#opa1' },
];

// search.json — scraped WUSTL data
const searchData = JSON.parse(readFileSync(resolve(root, 'src/data/search.json'), 'utf8'));

// Build reverse index: gene symbol → search entries
const geneToEntries = new Map();
const allSearchEntries = searchData.filter(s => s.name && s.name.length > 3);

for (const entry of allSearchEntries) {
  if (!entry.genes) continue;
  const geneTokens = entry.genes.split(/[,\s]+/).filter(Boolean);
  for (const g of geneTokens) {
    const sym = g.toUpperCase().trim();
    if (sym.length < 2 || sym.length > 12) continue;
    if (/^\d/.test(sym)) continue; // skip numeric tokens
    if (!geneToEntries.has(sym)) geneToEntries.set(sym, []);
    geneToEntries.get(sym).push(entry);
  }
}

// Build OMIM map from search entries
const geneToOmim = new Map();
for (const entry of searchData) {
  if (!entry.genes || !entry.omimIds) continue;
  const genes = entry.genes.split(/[,\s]+/).filter(Boolean);
  const omims = entry.omimIds.split(/[,\s]+/).filter(Boolean);
  for (const g of genes) {
    const sym = g.toUpperCase().trim();
    if (!geneToOmim.has(sym)) geneToOmim.set(sym, new Set());
    for (const o of omims) geneToOmim.get(sym).add(o);
  }
}

console.log(`  daily.json: ${dailyGenes.size} rich genes`);
console.log(`  curatedIndex: ${curatedGenes.length} genes, ${curatedConditions.length} conditions`);
console.log(`  search.json: ${searchData.length} entries, ${geneToEntries.size} gene-symbol keys`);

// ─── 2. Build initial gene records ─────────────────────────────────────────────

console.log('Building gene records...');

const genes = new Map();

for (const cg of curatedGenes) {
  const sym = cg.symbol;
  const rich = dailyGenes.get(sym);
  const entries = geneToEntries.get(sym) || [];
  const omimSet = geneToOmim.get(sym) || new Set();

  // Gather inheritance patterns from search entries
  const inhSet = new Set();
  for (const e of entries) {
    if (!e.inheritance) continue;
    for (const inh of e.inheritance.split(',')) {
      const trimmed = inh.trim();
      if (trimmed && !['Sporadic', 'Unknown'].includes(trimmed)) {
        inhSet.add(trimmed);
      }
    }
  }

  // Gather categories
  const catSet = new Set();
  for (const e of entries) {
    if (e.category && !['General', 'Overview / Fellowship'].includes(e.category)) {
      catSet.add(e.category);
    }
  }

  // Build associated conditions from search entries
  const assocConditions = [];
  const seenNames = new Set();
  for (const e of entries) {
    const name = e.name?.trim();
    if (!isValidConditionName(name) || seenNames.has(name.toLowerCase())) continue;
    seenNames.add(name.toLowerCase());
    assocConditions.push({
      name,
      slug: slugify(name),
      category: e.category,
      url: `${e.url}${e.anchor ? '#' + e.anchor : ''}`,
      inheritance: e.inheritance,
      omimIds: e.omimIds,
    });
  }

  const record = {
    symbol: sym,
    rawName: cg.rawName,
    fullName: rich?.fullName || '',
    aliases: [],
    chromosome: '',
    locus: rich?.locus || '',
    geneType: '',
    ncbiGeneId: '',
    ncbiSummary: '',
    inheritance: rich?.inheritance
      ? [rich.inheritance]
      : [...inhSet],
    omim: rich?.omim || [...omimSet][0] || '',
    omimIds: [...omimSet],
    phenotype: rich?.phenotype || '',
    mechanism: rich?.mechanism || '',
    hallmarks: rich?.hallmarks || [],
    wustlUrl: cg.href,
    adultOnset: cg.dagger,
    categories: [...catSet],
    associatedConditions: assocConditions.slice(0, 30), // cap for sanity
  };

  genes.set(sym, record);
}

// Known WUSTL URLs for daily.json genes missing from curated index
const DAILY_GENE_URLS = {
  DMD:   'https://neuromuscular.wustl.edu/musdist/dmd.html',
  DMPK:  'https://neuromuscular.wustl.edu/musdist/pe-eom.html#dm1',
  SMN1:  'https://neuromuscular.wustl.edu/synmot.html#sma5q',
  GAA:   'https://neuromuscular.wustl.edu/msys/glycogen.html#am',
  CAPN3: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2a',
  LMNA:  'https://neuromuscular.wustl.edu/msys/contract.html#laminac',
  SOD1:  'https://neuromuscular.wustl.edu/synmot.html#sod1',
  DYSF:  'https://neuromuscular.wustl.edu/musdist/lg.html#ml1',
  VCP:   'https://neuromuscular.wustl.edu/musdist/distal.html#vcp',
  PYGM:  'https://neuromuscular.wustl.edu/msys/glycogen.html#McA',
  NEB:   'https://neuromuscular.wustl.edu/syncm.html#rod',
  TTN:   'https://neuromuscular.wustl.edu/musdist/lg.html#ttn',
  GAN:   'https://neuromuscular.wustl.edu/time/hmsn.html#gan',
  COLQ:  'https://neuromuscular.wustl.edu/synmg.html#colq',
  FUS:   'https://neuromuscular.wustl.edu/synmot.html#fus',
  MTM1:  'https://neuromuscular.wustl.edu/syncm.html#mtm',
  SCN4A: 'https://neuromuscular.wustl.edu/mother/chan.html#scn4a',
};

// Also add daily.json genes not in the curated index
for (const [sym, rich] of dailyGenes) {
  if (genes.has(sym)) continue;
  const entries = geneToEntries.get(sym) || [];
  const omimSet = geneToOmim.get(sym) || new Set();

  const inhSet = new Set();
  const catSet = new Set();
  for (const e of entries) {
    if (e.inheritance) e.inheritance.split(',').map(s => s.trim()).filter(Boolean).forEach(i => { if (!['Sporadic', 'Unknown'].includes(i)) inhSet.add(i); });
    if (e.category && !['General', 'Overview / Fellowship'].includes(e.category)) catSet.add(e.category);
  }

  const assocConditions = [];
  const seenNames = new Set();
  for (const e of entries) {
    const name = e.name?.trim();
    if (!isValidConditionName(name) || seenNames.has(name.toLowerCase())) continue;
    seenNames.add(name.toLowerCase());
    assocConditions.push({
      name, slug: slugify(name), category: e.category,
      url: `${e.url}${e.anchor ? '#' + e.anchor : ''}`,
      inheritance: e.inheritance, omimIds: e.omimIds,
    });
  }

  // Use known URL, or build from search entries, or fall back to search
  const knownUrl = DAILY_GENE_URLS[sym];
  const firstEntry = entries[0];
  const wustlUrl = knownUrl
    || (firstEntry ? `${firstEntry.url}${firstEntry.anchor ? '#' + firstEntry.anchor : ''}` : '')
    || `https://neuromuscular.wustl.edu/alfindex.htm`;

  genes.set(sym, {
    symbol: sym,
    rawName: rich.fullName || sym,
    fullName: rich.fullName || '',
    aliases: [],
    chromosome: '',
    locus: rich.locus || '',
    geneType: '',
    ncbiGeneId: '',
    ncbiSummary: '',
    inheritance: rich.inheritance ? [rich.inheritance] : [...inhSet],
    omim: rich.omim || [...omimSet][0] || '',
    omimIds: [...omimSet],
    phenotype: rich.phenotype || '',
    mechanism: rich.mechanism || '',
    hallmarks: rich.hallmarks || [],
    wustlUrl,
    adultOnset: false,
    categories: [...catSet],
    associatedConditions: assocConditions.slice(0, 30),
  });
}

// Also add supplemental important genes
for (const sg of SUPPLEMENTAL_GENES) {
  if (genes.has(sg.symbol)) continue;
  const entries = geneToEntries.get(sg.symbol) || [];
  const omimSet = geneToOmim.get(sg.symbol) || new Set();
  const inhSet = new Set();
  const catSet = new Set();
  for (const e of entries) {
    if (e.inheritance) e.inheritance.split(',').map(s => s.trim()).filter(Boolean).forEach(i => { if (!['Sporadic', 'Unknown'].includes(i)) inhSet.add(i); });
    if (e.category && !['General', 'Overview / Fellowship'].includes(e.category)) catSet.add(e.category);
  }
  const assocConditions = [];
  const seenNames = new Set();
  for (const e of entries) {
    const name = e.name?.trim();
    if (!isValidConditionName(name) || seenNames.has(name.toLowerCase())) continue;
    seenNames.add(name.toLowerCase());
    assocConditions.push({ name, slug: slugify(name), category: e.category, url: `${e.url}${e.anchor ? '#' + e.anchor : ''}`, inheritance: e.inheritance, omimIds: e.omimIds });
  }
  genes.set(sg.symbol, {
    symbol: sg.symbol,
    rawName: sg.symbol,
    fullName: '',
    aliases: [],
    chromosome: '',
    locus: '',
    geneType: '',
    ncbiGeneId: '',
    ncbiSummary: '',
    inheritance: [...inhSet],
    omim: [...omimSet][0] || '',
    omimIds: [...omimSet],
    phenotype: '',
    mechanism: '',
    hallmarks: [],
    wustlUrl: sg.href,
    adultOnset: false,
    categories: [...catSet],
    associatedConditions: assocConditions.slice(0, 30),
  });
}

console.log(`  Built ${genes.size} gene records`);

// ─── 3. Build condition records ─────────────────────────────────────────────────

console.log('Building condition records...');

const conditions = new Map();

// Start with curated conditions
for (const cc of curatedConditions) {
  const slug = slugify(cc.name);
  // Find matching search entries by URL or name
  const matching = searchData.filter(s => {
    const entryUrl = `${s.url}${s.anchor ? '#' + s.anchor : ''}`;
    if (entryUrl === cc.href) return true;
    if (s.name?.toLowerCase() === cc.name.toLowerCase()) return true;
    return false;
  });

  const best = matching[0];
  const geneSet = new Set();
  const inhSet = new Set();
  const omimSet = new Set();

  for (const m of matching) {
    if (m.genes) m.genes.split(/[,\s]+/).filter(Boolean).forEach(g => geneSet.add(g.toUpperCase()));
    if (m.inheritance) m.inheritance.split(',').map(s => s.trim()).filter(Boolean).forEach(i => inhSet.add(i));
    if (m.omimIds) m.omimIds.split(/[,\s]+/).filter(Boolean).forEach(o => omimSet.add(o));
  }

  conditions.set(slug, {
    name: cc.name,
    slug,
    letter: cc.letter,
    category: best?.category || '',
    genes: [...geneSet].filter(g => g.length >= 2 && g.length <= 12 && !/^\d/.test(g)),
    inheritance: [...inhSet].filter(i => i && !['Sporadic', 'Unknown'].includes(i)),
    omimIds: [...omimSet],
    content: best?.content || '',
    wustlUrl: cc.href,
    adultOnset: cc.dagger,
  });
}

// Add rich conditions from search.json that have genes + OMIM + good names
const SKIP_CATS = new Set(['Overview / Fellowship', 'General']);
for (const entry of searchData) {
  const name = entry.name?.trim();
  if (!isValidConditionName(name)) continue;
  if (SKIP_CATS.has(entry.category)) continue;
  if (!entry.genes?.trim()) continue;

  const slug = slugify(name);
  if (conditions.has(slug)) continue; // don't overwrite curated

  const geneSet = new Set();
  entry.genes.split(/[,\s]+/).filter(Boolean).forEach(g => {
    const sym = g.toUpperCase();
    if (sym.length >= 2 && sym.length <= 12 && !/^\d/.test(sym)) geneSet.add(sym);
  });

  if (geneSet.size === 0) continue;

  const inhSet = new Set();
  if (entry.inheritance) {
    entry.inheritance.split(',').map(s => s.trim()).filter(Boolean).forEach(i => inhSet.add(i));
  }

  const omimSet = new Set();
  if (entry.omimIds) {
    entry.omimIds.split(/[,\s]+/).filter(Boolean).forEach(o => omimSet.add(o));
  }

  conditions.set(slug, {
    name,
    slug,
    letter: name[0].toUpperCase(),
    category: entry.category,
    genes: [...geneSet],
    inheritance: [...inhSet].filter(i => i && !['Sporadic', 'Unknown'].includes(i)),
    omimIds: [...omimSet],
    content: entry.content || '',
    wustlUrl: `${entry.url}${entry.anchor ? '#' + entry.anchor : ''}`,
    adultOnset: false,
  });
}

console.log(`  Built ${conditions.size} condition records`);

// ─── 4. NCBI Gene API enrichment ────────────────────────────────────────────────

if (ENRICH) {
  console.log('\nFetching from NCBI Gene API...');

  // Check for cached results
  const cachePath = resolve(root, 'src/data/.ncbi-cache.json');
  let cache = {};
  if (existsSync(cachePath)) {
    cache = JSON.parse(readFileSync(cachePath, 'utf8'));
    console.log(`  Loaded ${Object.keys(cache).length} cached NCBI results`);
  }

  const symbols = [...genes.keys()];
  const uncached = symbols.filter(s => !cache[s]);
  console.log(`  ${uncached.length} genes need NCBI lookup (${symbols.length - uncached.length} cached)`);

  // Step 1: Search for gene IDs
  const symbolToId = {};
  for (const sym of symbols) {
    if (cache[sym]?.ncbiGeneId) {
      symbolToId[sym] = cache[sym].ncbiGeneId;
      continue;
    }
  }

  // Fetch in batches of 10
  for (let i = 0; i < uncached.length; i += 10) {
    const batch = uncached.slice(i, i + 10);
    const promises = batch.map(async (sym) => {
      try {
        const url = `${NCBI_BASE}/esearch.fcgi?db=gene&term=${encodeURIComponent(sym)}[sym]+AND+"Homo+sapiens"[orgn]&retmode=json&retmax=3`;
        const res = await fetch(url);
        const data = await res.json();
        const ids = data?.esearchresult?.idlist || [];
        if (ids.length > 0) {
          symbolToId[sym] = ids[0];
        }
      } catch (err) {
        console.error(`  esearch failed for ${sym}:`, err.message);
      }
    });
    await Promise.all(promises);
    process.stdout.write(`\r  esearch: ${Math.min(i + 10, uncached.length)}/${uncached.length}`);
    await sleep(DELAY_MS * 3); // respect rate limit for batch
  }
  console.log();

  // Step 2: Batch fetch summaries
  const idsToFetch = Object.entries(symbolToId)
    .filter(([sym]) => !cache[sym]?.ncbiSummary)
    .map(([, id]) => id)
    .filter(Boolean);

  console.log(`  Fetching summaries for ${idsToFetch.length} genes...`);

  // Reverse map: id → symbol
  const idToSymbol = {};
  for (const [sym, id] of Object.entries(symbolToId)) {
    idToSymbol[id] = sym;
  }

  // Fetch in batches of 100 IDs
  for (let i = 0; i < idsToFetch.length; i += 100) {
    const batchIds = idsToFetch.slice(i, i + 100);
    try {
      const url = `${NCBI_BASE}/esummary.fcgi?db=gene&id=${batchIds.join(',')}&retmode=json`;
      const res = await fetch(url);
      const data = await res.json();

      for (const id of batchIds) {
        const info = data?.result?.[id];
        if (!info) continue;
        const sym = idToSymbol[id];
        if (!sym) continue;

        cache[sym] = {
          ncbiGeneId: id,
          officialSymbol: info.name || sym,
          officialName: info.description || '',
          aliases: (info.otheraliases || '').split(',').map(s => s.trim()).filter(Boolean),
          otherDesignations: (info.otherdesignations || '').split('|').map(s => s.trim()).filter(Boolean),
          chromosome: info.chromosome || '',
          mapLocation: info.maplocation || '',
          ncbiSummary: info.summary || '',
          geneType: info.generictype || '',
        };
      }
    } catch (err) {
      console.error(`  esummary batch failed:`, err.message);
    }
    process.stdout.write(`\r  esummary: ${Math.min(i + 100, idsToFetch.length)}/${idsToFetch.length}`);
    await sleep(DELAY_MS * 3);
  }
  console.log();

  // Save cache
  writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`  Cached ${Object.keys(cache).length} NCBI results`);

  // Merge NCBI data into gene records
  for (const [sym, record] of genes) {
    const ncbi = cache[sym];
    if (!ncbi) continue;
    record.ncbiGeneId = ncbi.ncbiGeneId || '';
    record.fullName = record.fullName || ncbi.officialName || '';
    record.aliases = ncbi.aliases || [];
    record.chromosome = ncbi.chromosome || '';
    record.locus = record.locus || ncbi.mapLocation || '';
    record.geneType = ncbi.geneType || '';
    record.ncbiSummary = ncbi.ncbiSummary || '';
  }

  console.log('  NCBI enrichment complete');
} else {
  console.log('\nSkipping NCBI enrichment (use --enrich to fetch from NCBI Gene API)');
}

// ─── 5. Generate external links for each gene ──────────────────────────────────

for (const [sym, record] of genes) {
  record.externalLinks = {
    wustl: record.wustlUrl,
    omim: record.omim ? `https://omim.org/entry/${record.omim}` : '',
    ncbiGene: record.ncbiGeneId ? `https://www.ncbi.nlm.nih.gov/gene/${record.ncbiGeneId}` : `https://www.ncbi.nlm.nih.gov/gene/?term=${encodeURIComponent(sym)}%5Bsym%5D+AND+human%5Borgn%5D`,
    clinGen: `https://search.clinicalgenome.org/kb/genes?search=${encodeURIComponent(sym)}`,
    g2p: `https://www.ebi.ac.uk/gene2phenotype/search?panel=ALL&search_term=${encodeURIComponent(sym)}`,
    geneReviews: `https://www.ncbi.nlm.nih.gov/books/NBK1116/?term=${encodeURIComponent(sym)}`,
    pubmed: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(sym)}+gene+neuromuscular`,
    uniprot: `https://www.uniprot.org/uniprotkb?query=gene:${encodeURIComponent(sym)}+AND+organism_id:9606`,
    decipher: `https://www.deciphergenomics.org/search?q=${encodeURIComponent(sym)}`,
  };
}

// ─── 6. Write output ────────────────────────────────────────────────────────────

const genesArray = [...genes.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
const conditionsArray = [...conditions.values()].sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(
  resolve(root, 'src/data/genes-enriched.json'),
  JSON.stringify(genesArray, null, 2)
);

writeFileSync(
  resolve(root, 'src/data/conditions-enriched.json'),
  JSON.stringify(conditionsArray, null, 2)
);

console.log(`\nDone!`);
console.log(`  genes-enriched.json: ${genesArray.length} genes`);
console.log(`  conditions-enriched.json: ${conditionsArray.length} conditions`);

// Quick stats
const withSummary = genesArray.filter(g => g.ncbiSummary).length;
const withOmim = genesArray.filter(g => g.omim).length;
const withHallmarks = genesArray.filter(g => g.hallmarks.length > 0).length;
const withConditions = genesArray.filter(g => g.associatedConditions.length > 0).length;
console.log(`  With NCBI summary: ${withSummary}`);
console.log(`  With OMIM: ${withOmim}`);
console.log(`  With hallmarks: ${withHallmarks}`);
console.log(`  With associated conditions: ${withConditions}`);
