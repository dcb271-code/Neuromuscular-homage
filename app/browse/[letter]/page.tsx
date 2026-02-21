'use client';

import Link from 'next/link';
import { getEntriesByLetter } from '@/src/data/curatedIndex';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function generateStaticParams() {
  return ALL_LETTERS.map(letter => ({ letter }));
}

export default function LetterPage({ params }: { params: { letter: string } }) {
  const letter = params.letter.toUpperCase();
  const entries = getEntriesByLetter(letter);
  const genes = entries.filter(e => e.type === 'gene');
  const conditions = entries.filter(e => e.type === 'condition');

  return (
    <div>
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '20px', fontSize: '12px', color: '#94a3b8' }}>
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        <Link href="/browse" style={{ color: '#94a3b8', textDecoration: 'none' }}>Browse</Link>
        <span style={{ margin: '0 6px' }}>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>{letter}</span>
      </div>

      {/* ── Letter nav strip ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px',
        marginBottom: '20px',
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '12px', padding: '10px 12px',
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
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
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
          {' '}— gene symbol
        </span>
        <span>
          <span style={{ color: '#1e293b', fontWeight: 500 }}>Condition</span>
          {' '}— named syndrome or disease
        </span>
        <span>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>†</span>
          {' '}— predominantly adult-onset; pediatric cases documented
        </span>
      </div>

      {/* ── Page heading ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{
          fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
          fontSize: '42px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-1px',
        }}>{letter}</span>
        {entries.length > 0 && (
          <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '12px', fontWeight: 500 }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            {genes.length > 0 && conditions.length > 0 && (
              <> · {genes.length} gene{genes.length !== 1 ? 's' : ''}, {conditions.length} condition{conditions.length !== 1 ? 's' : ''}</>
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

          {/* Genes */}
          {genes.length > 0 && (
            <section>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px',
              }}>
                Gene Symbols ({genes.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {genes.map(entry => (
                  <a
                    key={entry.name}
                    href={entry.href}
                    target="_blank"
                    rel="noopener"
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
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                      (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                      (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe';
                    }}
                  >
                    {entry.name}
                    {entry.dagger && (
                      <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>†</span>
                    )}
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                      <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Conditions */}
          {conditions.length > 0 && (
            <section>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px',
              }}>
                Conditions ({conditions.length})
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {conditions.map(entry => (
                  <a
                    key={entry.name}
                    href={entry.href}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1, lineHeight: 1.4 }}>
                      {entry.name}
                      {entry.dagger && (
                        <span style={{ color: '#f59e0b', marginLeft: '5px', fontWeight: 700, fontSize: '12px' }}>†</span>
                      )}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Bottom attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '32px' }}>
        Data sourced from the{' '}
        <a
          href="https://neuromuscular.wustl.edu"
          target="_blank"
          rel="noopener"
          style={{ color: '#94a3b8', textDecoration: 'none' }}
        >
          Washington University Neuromuscular Disease Center
        </a>.
        For clinical use, always refer to the primary source.
      </p>
    </div>
  );
}
