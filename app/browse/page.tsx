'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Chunk = {
  id: string;
  name: string;
  category: string;
  genes: string;
  inheritance: string;
  omimIds: string;
  content: string;
  url: string;
  anchor: string;
};

const SKIP_CATS = new Set(['Overview / Fellowship', 'General']);

// Module-level cache — avoids re-fetching 9 MB on every mount / navigation
let cachedChunks: Chunk[] | null = null;

// Exclude internal anchor stubs, reference stubs, numbered items, and other non-informative entries
function isGoodEntry(name: string): boolean {
  const n = name.trim();
  if (n.length < 4) return false;
  if (/^[●•*\-\s~]+$/.test(n)) return false;
  // Internal anchor slugs: all lowercase alphanumeric (no spaces)
  if (/^[a-z][a-z0-9]*$/.test(n)) return false;
  // Reference sections: ref1, ref33
  if (/^ref\d+/i.test(n)) return false;
  // Numbered list items: '22.', '23.', pure numbers
  if (/^\d+\.?$/.test(n)) return false;
  // Internal IDs starting with digit: 2a1, 4b1, 1dm, 3ftx
  if (/^\d[a-z0-9]+$/.test(n)) return false;
  // Short single tokens (no space, ≤6 chars) that aren't all-uppercase abbreviations
  // e.g. hexA, vitE, CSA, BDNFx are junk; DMD, SMA, ALS are fine
  if (!/\s/.test(n) && n.length <= 6 && !/^[A-Z][A-Z0-9\-]+$/.test(n)) return false;
  // Generic single-word section headers with no diagnostic value
  const blocklist = new Set(['Forms', 'Other', 'Drugs', 'Trunk', 'Roots',
    'NERVE', 'HUMOR', 'HOAX', 'Immune', 'Toxins', 'Genetics', 'Treatment',
    'Introduction', 'Summary', 'General', 'Cramps', 'Overview']);
  if (blocklist.has(n)) return false;
  return true;
}

function cleanName(n: string): string {
  return n.replace(/[\n\s]+\d+\s*$/, '').replace(/\n+/g, ' ').trim();
}

const INH_COLORS: Record<string, { bg: string; color: string }> = {
  'Autosomal Dominant':  { bg: '#eff6ff', color: '#1d4ed8' },
  'Autosomal Recessive': { bg: '#faf5ff', color: '#7c3aed' },
  'X-Linked':            { bg: '#fff1f2', color: '#be185d' },
  'Mitochondrial':       { bg: '#fffbeb', color: '#92400e' },
  'De Novo':             { bg: '#f0fdf4', color: '#166534' },
};

function inhStyle(inh: string) {
  for (const [key, val] of Object.entries(INH_COLORS)) {
    if (inh.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: '#f1f5f9', color: '#475569' };
}

const PAGE_SIZE = 60;

function BrowseInner() {
  const params = useSearchParams();
  const cat = params.get('cat') ?? '';

  const [allChunks, setAllChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [inhFilter, setInhFilter] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (cachedChunks) {
      setAllChunks(cachedChunks);
      setLoading(false);
      return;
    }
    fetch('/search.json')
      .then(r => r.json())
      .then((data: Chunk[]) => {
        cachedChunks = data.filter(c => !SKIP_CATS.has(c.category) && isGoodEntry(c.name));
        setAllChunks(cachedChunks);
        setLoading(false);
      });
  }, []);

  // reset pagination on filter change
  useEffect(() => { setPage(1); }, [cat, inhFilter, query]);

  const categories = useMemo(() =>
    [...new Set(allChunks.map(c => c.category))].sort(),
    [allChunks]
  );

  const inheritanceTypes = useMemo(() => {
    const all = new Set<string>();
    allChunks.forEach(c => c.inheritance.split(',').forEach(i => { if (i.trim()) all.add(i.trim()); }));
    return [...all].sort();
  }, [allChunks]);

  const filtered = useMemo(() => {
    let res = allChunks;
    if (cat) res = res.filter(c => c.category === cat);
    if (inhFilter) res = res.filter(c => c.inheritance.includes(inhFilter));
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      res = res.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.genes.toLowerCase().includes(q) ||
        c.omimIds.includes(q) ||
        c.content.toLowerCase().includes(q)
      );
    }
    return res;
  }, [allChunks, cat, inhFilter, query]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function slugify(name: string) {
    return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  }

  // Check if condition has a local page, otherwise link to WUSTL
  const [localSlugs, setLocalSlugs] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetch('/api/condition-slugs').then(r => r.json()).then((slugs: string[]) => setLocalSlugs(new Set(slugs))).catch(() => {});
  }, []);

  function condLink(c: Chunk): { href: string; external: boolean } {
    const slug = slugify(c.name);
    if (localSlugs.has(slug)) return { href: `/condition/${slug}`, external: false };
    return { href: `${c.url}${c.anchor ? '#' + c.anchor : ''}`, external: true };
  }

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
          {cat || 'All Conditions'}
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          {loading ? 'Loading…' : `${filtered.length.toLocaleString()} entries`}
          {cat && <span> · <button onClick={() => window.location.href = '/browse'} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}>View all</button></span>}
        </p>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
          <CategoryPill label="All" active={!cat} href="/browse" />
          {categories.map(c => (
            <CategoryPill key={c} label={c} active={c === cat} href={`/browse?cat=${encodeURIComponent(c)}`} />
          ))}
        </div>
      </div>

      {/* Secondary filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by name, gene, OMIM…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: '1', minWidth: '200px', height: '36px',
            padding: '0 12px', fontSize: '13px',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            outline: 'none', background: '#fff', color: '#1e293b',
          }}
        />
        <select
          value={inhFilter}
          onChange={e => setInhFilter(e.target.value)}
          style={{
            height: '36px', padding: '0 12px', fontSize: '13px',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            background: '#fff', color: inhFilter ? '#1e293b' : '#94a3b8',
            cursor: 'pointer',
          }}
        >
          <option value="">All inheritance</option>
          {inheritanceTypes.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Results grid */}
      {loading ? (
        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ height: '90px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: '14px' }}>
          No entries match your filters.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {paginated.map(c => {
              const inhs = c.inheritance.split(',').map(s => s.trim()).filter(Boolean);
              const { href, external } = condLink(c);
              const cardStyle = {
                display: 'block' as const, background: '#fff',
                border: '1px solid #e2e8f0', borderRadius: '12px',
                padding: '12px 14px', textDecoration: 'none' as const,
                transition: 'border-color 0.15s, box-shadow 0.15s',
              };
              const cardContent = (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{cleanName(c.name)}</span>
                    {external && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: '3px', opacity: 0.4 }}>
                        <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {c.genes && (
                    <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '6px', fontFamily: 'ui-monospace, monospace' }}>
                      {c.genes.split(',').slice(0, 5).join(', ')}{c.genes.split(',').length > 5 ? ' ...' : ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {inhs.map(inh => {
                      const s = inhStyle(inh);
                      return (
                        <span key={inh} style={{
                          fontSize: '10px', fontWeight: 500, padding: '1px 6px',
                          borderRadius: '99px', background: s.bg, color: s.color,
                        }}>{inh}</span>
                      );
                    })}
                    {!cat && (
                      <span style={{
                        fontSize: '10px', padding: '1px 6px',
                        borderRadius: '99px', background: '#f1f5f9', color: '#64748b',
                      }}>{c.category}</span>
                    )}
                  </div>
                </>
              );
              return external ? (
                <a key={c.id} href={href} target="_blank" rel="noopener" style={cardStyle}>{cardContent}</a>
              ) : (
                <Link key={c.id} href={href} style={cardStyle}>{cardContent}</Link>
              );
            })}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '10px 28px',
                  fontSize: '13px', fontWeight: 600,
                  background: '#fff', color: '#1e293b',
                  border: '1px solid #e2e8f0', borderRadius: '99px',
                  cursor: 'pointer',
                }}
              >
                Load more ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryPill({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        fontSize: '12px', fontWeight: active ? 600 : 400,
        borderRadius: '99px',
        background: active ? '#1e293b' : '#f8fafc',
        color: active ? '#fff' : '#64748b',
        border: active ? '1px solid #1e293b' : '1px solid #e2e8f0',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </a>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading…</div>}>
      <BrowseInner />
    </Suspense>
  );
}
