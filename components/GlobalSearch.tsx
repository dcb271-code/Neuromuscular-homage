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

type GeneRecord = { symbol: string; fullName: string };

let fuseInstance: Fuse<Chunk> | null = null;
let genesCache: GeneRecord[] | null = null;

async function getFuse(): Promise<Fuse<Chunk>> {
  if (fuseInstance) return fuseInstance;
  const res  = await fetch('/search.json');
  const data: Chunk[] = await res.json();
  fuseInstance = new Fuse(data, {
    keys: [
      { name: 'name',        weight: 4 },
      { name: 'genes',       weight: 3 },
      { name: 'omimIds',     weight: 2 },
      { name: 'inheritance', weight: 1 },
      { name: 'content',     weight: 1 },
      { name: 'category',    weight: 0.5 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

async function getGenes(): Promise<GeneRecord[]> {
  if (genesCache) return genesCache;
  try {
    const res = await fetch('/api/genes');
    genesCache = await res.json();
  } catch { genesCache = []; }
  return genesCache!;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inheritanceBadge(inh: string) {
  const i = inh.toLowerCase();
  if (i.includes('dominant'))     return 'badge badge-ad';
  if (i.includes('recessive'))    return 'badge badge-ar';
  if (i.includes('x-linked'))     return 'badge badge-xl';
  if (i.includes('mitochondrial'))return 'badge badge-mt';
  if (i.includes('de novo'))      return 'badge badge-dn';
  return 'badge badge-gen';
}

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<FuseResult<Chunk>[]>([]);
  const [geneMatches, setGeneMatches] = useState<GeneRecord[]>([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setGeneMatches([]); return; }
    setLoading(true);
    const [fuse, genes] = await Promise.all([getFuse(), getGenes()]);
    const qLower = q.toLowerCase();
    setResults(fuse.search(q, { limit: 8 }));
    setGeneMatches(
      genes.filter(g =>
        g.symbol.toLowerCase().includes(qLower) ||
        g.fullName.toLowerCase().includes(qLower)
      ).slice(0, 4)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 180);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); inputRef.current?.focus(); setOpen(true);
      }
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const hasResults = geneMatches.length > 0 || results.length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.12)', borderRadius: '8px',
        padding: '6px 12px', gap: '8px',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        <svg width="16" height="16" fill="none" stroke="rgba(147,197,253,1)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
          style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="6" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search disease, gene, OMIM ID..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleSubmit}
          aria-label="Search conditions, genes, or OMIM IDs"
          className="search-input-placeholder"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'white', fontSize: '13px', minWidth: 0 }}
        />
        {query ? (
          <button onClick={() => { setQuery(''); setResults([]); setGeneMatches([]); inputRef.current?.focus(); }}
            style={{ color: 'rgba(147,197,253,0.8)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>x</button>
        ) : (
          <kbd style={{ fontSize: '11px', color: 'rgba(147,197,253,0.7)',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px', padding: '1px 6px', fontFamily: 'monospace', flexShrink: 0 }}>/</kbd>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
          background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 100,
          maxHeight: '480px', overflowY: 'auto',
        }}>
          {loading && <div style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8' }}>Searching...</div>}

          {!loading && !hasResults && (
            <div style={{ padding: '16px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
              No results for &quot;{query}&quot;
            </div>
          )}

          {!loading && hasResults && (
            <>
              {/* Gene matches — link to local gene pages */}
              {geneMatches.length > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: '4px', padding: '0 4px' }}>
                    Genes
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {geneMatches.map(g => (
                      <Link
                        key={g.symbol}
                        href={`/gene/${g.symbol}`}
                        onClick={() => setOpen(false)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 8px', borderRadius: '6px',
                          background: '#eff6ff', border: '1px solid #bfdbfe',
                          textDecoration: 'none', fontSize: '11px',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: '#2563eb', fontFamily: 'ui-monospace, monospace' }}>{g.symbol}</span>
                        <span style={{ color: '#475569' }}>{g.fullName}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Condition matches — link to local condition pages */}
              {results.map((r, i) => {
                const item = r.item;
                const inh  = item.inheritance.split(',').map(s => s.trim()).filter(Boolean);
                const slug = slugify(item.name);
                return (
                  <Link key={i} href={`/condition/${slug}`}
                    onClick={() => setOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', textDecoration: 'none',
                      borderBottom: i < results.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{item.name}</span>
                      {inh.slice(0, 2).map(ih => (
                        <span key={ih} className={inheritanceBadge(ih)}>{ih}</span>
                      ))}
                    </div>
                    {item.genes && (
                      <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '2px' }}>
                        {item.genes.split(/[,\s]+/).slice(0, 5).join(', ')}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.category}</div>
                  </Link>
                );
              })}

              {/* See all link */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '8px 16px', textAlign: 'center',
                  fontSize: '11px', fontWeight: 600, color: '#2563eb',
                  textDecoration: 'none', borderTop: '1px solid #f1f5f9',
                  background: '#f8fafc',
                }}
              >
                See all results
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
