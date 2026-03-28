'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Fuse, { type FuseResult } from 'fuse.js';

type Chunk = {
  id: string; name: string; category: string; genes: string;
  inheritance: string; omimIds: string; content: string;
  url: string; anchor: string;
};

type GeneRecord = {
  symbol: string; fullName: string; locus: string;
  inheritance: string[]; omim: string; ncbiSummary: string;
  categories: string[];
};

let fuseInstance: Fuse<Chunk> | null = null;
let condSlugsCache: Set<string> | null = null;

function isGoodEntry(name: string): boolean {
  if (!name || name.length < 4 || name.length > 120) return false;
  if (/^[a-z][a-z0-9]*$/.test(name)) return false;
  if (/^ref\d+/i.test(name)) return false;
  if (/^\d+\.?$/.test(name)) return false;
  if (/^\d[a-z0-9]+$/.test(name)) return false;
  if ((name.match(/ /g) || []).length > 15) return false;
  if (!/\s/.test(name) && name.length <= 6 && !/^[A-Z][A-Z0-9\-]+$/.test(name)) return false;
  return true;
}

async function getFuse(): Promise<Fuse<Chunk>> {
  if (fuseInstance) return fuseInstance;
  const res = await fetch('/search.json');
  const data: Chunk[] = await res.json();
  const clean = data.filter(d => isGoodEntry(d.name));
  fuseInstance = new Fuse(clean, {
    keys: [
      { name: 'name', weight: 4 },
      { name: 'genes', weight: 3 },
      { name: 'omimIds', weight: 2 },
      { name: 'inheritance', weight: 1 },
      { name: 'content', weight: 1 },
      { name: 'category', weight: 0.5 },
    ],
    threshold: 0.35,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

async function getCondSlugs(): Promise<Set<string>> {
  if (condSlugsCache) return condSlugsCache;
  try { const res = await fetch('/api/condition-slugs'); condSlugsCache = new Set(await res.json()); }
  catch { condSlugsCache = new Set(); }
  return condSlugsCache;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function resultHref(item: Chunk, localSlugs: Set<string>): { href: string; external: boolean } {
  const slug = slugify(item.name);
  if (localSlugs.has(slug)) return { href: `/condition/${slug}`, external: false };
  return { href: `${item.url}${item.anchor ? '#' + item.anchor : ''}`, external: true };
}

const INH_COLORS: Record<string, { bg: string; fg: string }> = {
  'autosomal dominant':  { bg: '#eff6ff', fg: '#1d4ed8' },
  'autosomal recessive': { bg: '#faf5ff', fg: '#7c3aed' },
  'x-linked':            { bg: '#fff1f2', fg: '#be185d' },
  'mitochondrial':       { bg: '#fffbeb', fg: '#92400e' },
  'de novo':             { bg: '#f0fdf4', fg: '#166534' },
};

function inhStyle(inh: string) {
  const key = inh.toLowerCase();
  for (const [pattern, style] of Object.entries(INH_COLORS)) {
    if (key.includes(pattern)) return style;
  }
  return { bg: '#f1f5f9', fg: '#475569' };
}

const PAGE_SIZE = 40;

function SearchInner() {
  const params = useSearchParams();
  const initialQuery = params.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<FuseResult<Chunk>[]>([]);
  const [geneMatches, setGeneMatches] = useState<GeneRecord[]>([]);
  const [localSlugs, setLocalSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [inhFilter, setInhFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { getCondSlugs().then(setLocalSlugs); }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setGeneMatches([]);
      return;
    }
    setLoading(true);
    setPage(1);

    Promise.all([
      getFuse().then(fuse => fuse.search(query, { limit: 200 })),
      fetch('/api/genes').then(r => r.json()).then((genes: GeneRecord[]) => {
        const q = query.toLowerCase();
        return genes.filter(g =>
          g.symbol.toLowerCase().includes(q) ||
          g.fullName.toLowerCase().includes(q) ||
          g.locus.toLowerCase().includes(q)
        );
      }).catch(() => [] as GeneRecord[]),
    ]).then(([searchResults, genes]) => {
      setResults(searchResults);
      setGeneMatches(genes);
      setLoading(false);
    });
  }, [query]);

  const { categories, inheritanceTypes } = useMemo(() => {
    const cats = new Set<string>();
    const inhs = new Set<string>();
    for (const r of results) {
      if (r.item.category) cats.add(r.item.category);
      if (r.item.inheritance) {
        r.item.inheritance.split(',').forEach(i => { const t = i.trim(); if (t) inhs.add(t); });
      }
    }
    return { categories: [...cats].sort(), inheritanceTypes: [...inhs].sort() };
  }, [results]);

  const filtered = useMemo(() => {
    let res = results;
    if (catFilter) res = res.filter(r => r.item.category === catFilter);
    if (inhFilter) res = res.filter(r => r.item.inheritance.includes(inhFilter));
    return res;
  }, [results, catFilter, inhFilter]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>Search</h1>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search conditions, genes, OMIM IDs..."
          autoFocus
          style={{
            width: '100%', height: '44px', padding: '0 16px',
            fontSize: '15px', border: '2px solid #e2e8f0',
            borderRadius: '12px', outline: 'none', background: '#fff',
            color: '#1e293b', transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
        />
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Searching...</div>
      )}

      {!loading && query.trim().length >= 2 && (
        <>
          {/* Gene matches */}
          {geneMatches.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: '10px' }}>
                Genes ({geneMatches.length})
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {geneMatches.slice(0, 12).map(g => (
                  <Link key={g.symbol} href={`/gene/${g.symbol}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '10px',
                      border: '1px solid #bfdbfe', background: '#eff6ff',
                      textDecoration: 'none',
                    }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', fontFamily: 'ui-monospace, monospace' }}>{g.symbol}</span>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{g.fullName}</span>
                    {g.locus && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{g.locus}</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {filtered.length.toLocaleString()} condition entries
            </span>
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
              style={{ height: '32px', padding: '0 10px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: catFilter ? '#1e293b' : '#94a3b8', cursor: 'pointer' }}>
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={inhFilter} onChange={e => { setInhFilter(e.target.value); setPage(1); }}
              style={{ height: '32px', padding: '0 10px', fontSize: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: inhFilter ? '#1e293b' : '#94a3b8', cursor: 'pointer' }}>
              <option value="">All inheritance</option>
              {inheritanceTypes.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {(catFilter || inhFilter) && (
              <button onClick={() => { setCatFilter(''); setInhFilter(''); }}
                style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: '14px' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {paginated.map((r, idx) => {
                  const item = r.item;
                  const inhs = item.inheritance.split(',').map(s => s.trim()).filter(Boolean);
                  const genes = item.genes?.split(/[,\s]+/).filter(Boolean).slice(0, 5) || [];
                  const { href, external } = resultHref(item, localSlugs);

                  const cardStyle = {
                    display: 'block' as const, background: '#fff',
                    border: '1px solid #e2e8f0', borderRadius: '12px',
                    padding: '12px 14px', textDecoration: 'none' as const,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  };

                  const cardContent = (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{item.name}</span>
                        {external && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.4 }}>
                            <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {genes.length > 0 && (
                        <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '4px', fontFamily: 'ui-monospace, monospace' }}>
                          {genes.join(', ')}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {inhs.slice(0, 3).map(inh => {
                          const s = inhStyle(inh);
                          return <span key={inh} style={{ fontSize: '10px', fontWeight: 500, padding: '1px 6px', borderRadius: '99px', background: s.bg, color: s.fg }}>{inh}</span>;
                        })}
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: '#f1f5f9', color: '#64748b' }}>{item.category}</span>
                      </div>
                      {item.content && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.content.slice(0, 200).replace(/\s+/g, ' ')}
                        </div>
                      )}
                    </>
                  );

                  return external ? (
                    <a key={idx} href={href} target="_blank" rel="noopener" style={cardStyle}>{cardContent}</a>
                  ) : (
                    <Link key={idx} href={href} style={cardStyle}>{cardContent}</Link>
                  );
                })}
              </div>

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button onClick={() => setPage(p => p + 1)}
                    style={{ padding: '10px 28px', fontSize: '13px', fontWeight: 600, background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '99px', cursor: 'pointer' }}>
                    Load more ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!loading && query.trim().length < 2 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ display: 'inline' }}>
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>Search 14,000+ neuromuscular disease entries</p>
          <p style={{ fontSize: '12px' }}>
            Try: <Chip q="DMD" /> <Chip q="SMA" /> <Chip q="Duchenne" /> <Chip q="CMT" /> <Chip q="RYR1" /> <Chip q="mitochondrial" />
          </p>
        </div>
      )}
    </div>
  );
}

function Chip({ q }: { q: string }) {
  return (
    <Link href={`/search?q=${encodeURIComponent(q)}`}
      style={{ display: 'inline-block', padding: '2px 8px', margin: '2px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', textDecoration: 'none' }}>
      {q}
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <SearchInner />
    </Suspense>
  );
}
