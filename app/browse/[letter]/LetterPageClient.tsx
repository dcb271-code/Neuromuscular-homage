'use client';

import Link from 'next/link';
import type { IndexEntry } from '@/src/data/curatedIndex';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const WUSTL_INDEX = 'https://neuromuscular.wustl.edu/alfindex.htm';

function cleanGeneSymbol(raw: string) {
  return raw.split(/[\s(]/)[0].trim().toUpperCase();
}

function slugify(name: string) {
  return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function LetterPageClient({
  letter,
  entries,
}: {
  letter: string;
  entries: IndexEntry[];
}) {
  const genes = entries.filter(e => e.type === 'gene');
  const conditions = entries.filter(e => e.type === 'condition');

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px', fontSize: '12px', color: '#94a3b8' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        <Link href="/browse" style={{ color: '#94a3b8', textDecoration: 'none' }}>Browse</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>{letter}</span>
      </div>

      {/* Letter nav strip */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px',
        marginBottom: '20px',
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '12px', padding: '10px 12px',
        alignItems: 'center',
      }}>
        {ALL_LETTERS.map(l => (
          <Link
            key={l}
            href={`/browse/${l}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '26px', height: '26px',
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.05em',
              borderRadius: '5px', textDecoration: 'none',
              background: l === letter ? '#0f172a' : '#f8fafc',
              color: l === letter ? '#60a5fa' : '#475569',
              border: l === letter ? '1px solid #334155' : '1px solid #e2e8f0',
            }}
          >
            {l}
          </Link>
        ))}
        <a
          href={WUSTL_INDEX}
          target="_blank"
          rel="noopener"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '4px', marginLeft: '6px', height: '26px', padding: '0 10px',
            fontSize: '11px', fontWeight: 600, color: '#475569',
            background: '#f1f5f9', border: '1px solid #cbd5e1',
            borderRadius: '5px', textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          A-Z Index
        </a>
      </div>

      {/* Legend */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '10px', padding: '10px 14px',
        marginBottom: '28px',
        display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center',
        fontSize: '11px', color: '#64748b',
      }}>
        <span>
          <span style={{
            fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
            color: '#2563eb', fontWeight: 700, fontSize: '11px',
            background: '#eff6ff', padding: '1px 5px', borderRadius: '4px',
          }}>GENE</span>
          {' '} -- gene symbol (links to gene page)
        </span>
        <span>
          <span style={{ color: '#1e293b', fontWeight: 500 }}>Condition</span>
          {' '} -- named syndrome or disease
        </span>
        <span>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>+</span>
          {' '} -- predominantly adult-onset; pediatric cases documented
        </span>
      </div>

      {/* Page heading */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{
          fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
          fontSize: '42px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-1px',
        }}>{letter}</span>
        {entries.length > 0 && (
          <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '12px', fontWeight: 500 }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            {genes.length > 0 && conditions.length > 0 && (
              <> &middot; {genes.length} gene{genes.length !== 1 ? 's' : ''}, {conditions.length} condition{conditions.length !== 1 ? 's' : ''}</>
            )}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
          padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px',
        }}>
          No curated entries for letter <strong style={{ color: '#475569' }}>{letter}</strong>.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '32px' }}>

          {/* Genes — link to local /gene/SYMBOL pages */}
          {genes.length > 0 && (
            <section>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px',
              }}>
                Gene Symbols ({genes.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {genes.map(entry => {
                  const sym = cleanGeneSymbol(entry.name);
                  return (
                    <Link
                      key={entry.name}
                      href={`/gene/${sym}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '5px 10px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
                        fontSize: '12px', fontWeight: 600, color: '#2563eb',
                        transition: 'border-color 0.1s, background 0.1s',
                      }}
                    >
                      {entry.name}
                      {entry.dagger && (
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>+</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Conditions — link to local /condition/slug pages */}
          {conditions.length > 0 && (
            <section>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px',
              }}>
                Conditions ({conditions.length})
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {conditions.map(entry => {
                  const slug = slugify(entry.name);
                  return (
                    <Link
                      key={entry.name}
                      href={`/condition/${slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1, lineHeight: 1.4 }}>
                        {entry.name}
                        {entry.dagger && (
                          <span style={{ color: '#f59e0b', marginLeft: '5px', fontWeight: 700, fontSize: '12px' }}>+</span>
                        )}
                      </span>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M4 2L10 6L4 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Bottom attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '32px' }}>
        Data sourced from the{' '}
        <a href="https://neuromuscular.wustl.edu" target="_blank" rel="noopener"
          style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Washington University Neuromuscular Disease Center
        </a>
        , NCBI Gene, and OMIM.
        For clinical use, always refer to primary sources.
      </p>
    </div>
  );
}
