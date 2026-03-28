'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse, { type FuseResult } from 'fuse.js';
import Link from 'next/link';

type Chunk = {
  id: string; name: string; category: string; genes: string;
  inheritance: string; omimIds: string; content: string;
  url: string; anchor: string;
};

type GeneRecord = {
  symbol: string; fullName: string; locus: string;
  aliases?: string[]; inheritance: string[]; omim: string;
  phenotype?: string;
};

let fuseInstance: Fuse<Chunk> | null = null;
let genesCache: GeneRecord[] | null = null;
let condSlugsCache: Set<string> | null = null;

async function getFuse(): Promise<Fuse<Chunk>> {
  if (fuseInstance) return fuseInstance;
  const res = await fetch('/search.json');
  const data: Chunk[] = await res.json();
  // Filter out junk entries before indexing
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
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

async function getGenes(): Promise<GeneRecord[]> {
  if (genesCache) return genesCache;
  try { const res = await fetch('/api/genes'); genesCache = await res.json(); }
  catch { genesCache = []; }
  return genesCache!;
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

// Build the right link for a search result: local page if it exists, WUSTL otherwise
function resultHref(item: Chunk, localSlugs: Set<string>): { href: string; external: boolean } {
  const slug = slugify(item.name);
  if (localSlugs.has(slug)) {
    return { href: `/condition/${slug}`, external: false };
  }
  // Fall back to WUSTL link
  const wustlUrl = `${item.url}${item.anchor ? '#' + item.anchor : ''}`;
  return { href: wustlUrl, external: true };
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
  for (const [p, s] of Object.entries(INH_COLORS)) { if (key.includes(p)) return s; }
  return { bg: '#f1f5f9', fg: '#475569' };
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<Chunk>[]>([]);
  const [geneMatches, setGeneMatches] = useState<GeneRecord[]>([]);
  const [localSlugs, setLocalSlugs] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load condition slugs on mount
  useEffect(() => { getCondSlugs().then(setLocalSlugs); }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setGeneMatches([]); return; }
    setLoading(true);
    const [fuse, genes] = await Promise.all([getFuse(), getGenes()]);
    const qLower = q.toLowerCase();
    setResults(fuse.search(q, { limit: 8 }));
    setGeneMatches(
      genes.filter(g =>
        g.symbol.toLowerCase().includes(qLower) ||
        g.fullName.toLowerCase().includes(qLower) ||
        (g.aliases || []).some((a: string) => a.toLowerCase().includes(qLower)) ||
        (g.phenotype || '').toLowerCase().includes(qLower)
      ).slice(0, 5)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 150);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const hasResults = geneMatches.length > 0 || results.length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#fff', borderRadius: '16px',
          border: '2px solid #e2e8f0', padding: '4px 4px 4px 16px',
          gap: '10px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>
          <svg width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search genes, conditions, OMIM IDs..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            aria-label="Search conditions, genes, or OMIM IDs"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#1e293b', fontSize: '15px', minWidth: 0, height: '40px',
            }}
          />
          <button
            type="submit"
            style={{
              height: '38px', padding: '0 20px',
              fontSize: '13px', fontWeight: 600,
              background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '12px',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown results */}
      {open && query.trim().length >= 2 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
          background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 100,
          maxHeight: '480px', overflowY: 'auto',
        }}>
          {loading && <div style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8' }}>Searching...</div>}

          {!loading && !hasResults && (
            <div style={{ padding: '16px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && hasResults && (
            <>
              {/* Gene matches — always link to local gene pages */}
              {geneMatches.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: '6px', padding: '0 4px' }}>
                    Genes
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {geneMatches.map(g => (
                      <Link
                        key={g.symbol}
                        href={`/gene/${g.symbol}`}
                        onClick={() => setOpen(false)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '5px 10px', borderRadius: '8px',
                          background: '#eff6ff', border: '1px solid #bfdbfe',
                          textDecoration: 'none',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', fontFamily: 'ui-monospace, monospace' }}>
                          {g.symbol}
                        </span>
                        <span style={{ fontSize: '11px', color: '#475569' }}>
                          {g.fullName}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Condition matches — local page or WUSTL external */}
              {results.length > 0 && (
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', padding: '8px 16px 4px' }}>
                    Conditions
                  </div>
                  {results.map((r, i) => {
                    const item = r.item;
                    const inhs = item.inheritance.split(',').map(s => s.trim()).filter(Boolean);
                    const { href, external } = resultHref(item, localSlugs);

                    const linkProps = external
                      ? { href, target: '_blank' as const, rel: 'noopener' }
                      : { href };

                    const El = external ? 'a' : Link;

                    return (
                      <El
                        key={i}
                        {...linkProps}
                        onClick={() => setOpen(false)}
                        style={{
                          display: 'block', padding: '10px 16px',
                          textDecoration: 'none',
                          borderBottom: i < results.length - 1 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{item.name}</span>
                          {inhs.slice(0, 2).map(ih => {
                            const s = inhStyle(ih);
                            return <span key={ih} style={{ fontSize: '10px', fontWeight: 500, padding: '1px 6px', borderRadius: '99px', background: s.bg, color: s.fg }}>{ih}</span>;
                          })}
                          {external && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        {item.genes && (
                          <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '2px', fontFamily: 'ui-monospace, monospace' }}>
                            {item.genes.split(/[,\s]+/).filter(Boolean).slice(0, 5).join(', ')}
                          </div>
                        )}
                      </El>
                    );
                  })}

                  {/* See all results */}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'block', padding: '10px 16px',
                      textAlign: 'center', fontSize: '12px', fontWeight: 600,
                      color: '#2563eb', textDecoration: 'none',
                      borderTop: '1px solid #f1f5f9', background: '#f8fafc',
                    }}
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
