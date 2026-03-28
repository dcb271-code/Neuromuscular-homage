import { notFound } from 'next/navigation';
import genesData from '@/src/data/genes-enriched.json';
import Link from 'next/link';

type Gene = (typeof genesData)[number];

const geneMap = new Map<string, Gene>();
for (const g of genesData) {
  geneMap.set(g.symbol.toUpperCase(), g);
}

export function generateStaticParams() {
  return genesData.map(g => ({ symbol: g.symbol }));
}

export function generateMetadata({ params }: { params: { symbol: string } }) {
  const gene = geneMap.get(params.symbol.toUpperCase());
  if (!gene) return { title: 'Gene not found' };
  const title = `${gene.symbol} — ${gene.fullName || gene.rawName}`;
  return {
    title: `${title} | Neuromuscular HOMEPAGE`,
    description: gene.phenotype || gene.ncbiSummary || `Gene page for ${gene.symbol}`,
  };
}

// ─── Inheritance badge colors ──────────────────────────────────────────────────

const INH_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  'autosomal dominant':  { bg: '#eff6ff', fg: '#1d4ed8', label: 'AD' },
  'autosomal recessive': { bg: '#faf5ff', fg: '#7c3aed', label: 'AR' },
  'x-linked':            { bg: '#fff1f2', fg: '#be185d', label: 'XL' },
  'x-linked recessive':  { bg: '#fff1f2', fg: '#be185d', label: 'XLR' },
  'x-linked dominant':   { bg: '#fff1f2', fg: '#9f1239', label: 'XLD' },
  'mitochondrial':       { bg: '#fffbeb', fg: '#92400e', label: 'MT' },
  'de novo':             { bg: '#f0fdf4', fg: '#166534', label: 'DN' },
  'digenic':             { bg: '#fef3c7', fg: '#78350f', label: 'DI' },
};

function inhBadge(inh: string) {
  const key = inh.toLowerCase();
  for (const [pattern, style] of Object.entries(INH_STYLE)) {
    if (key.includes(pattern)) return style;
  }
  return { bg: '#f1f5f9', fg: '#475569', label: '' };
}

// ─── External link definitions ────────────────────────────────────────────────

const EXT_LINKS: { key: keyof Gene['externalLinks']; label: string; color: string; description: string }[] = [
  { key: 'wustl', label: 'WUSTL Neuromuscular', color: '#991b1b', description: 'Washington University Disease Center' },
  { key: 'omim', label: 'OMIM', color: '#1d4ed8', description: 'Online Mendelian Inheritance in Man' },
  { key: 'clinGen', label: 'ClinGen', color: '#7c3aed', description: 'Clinical Genome Resource' },
  { key: 'g2p', label: 'G2P', color: '#0d9488', description: 'Gene-to-Phenotype (EBI)' },
  { key: 'geneReviews', label: 'GeneReviews', color: '#b45309', description: 'NCBI Expert-Authored Reviews' },
  { key: 'ncbiGene', label: 'NCBI Gene', color: '#0369a1', description: 'National Center for Biotechnology Information' },
  { key: 'pubmed', label: 'PubMed', color: '#4338ca', description: 'Biomedical Literature' },
  { key: 'uniprot', label: 'UniProt', color: '#0f766e', description: 'Universal Protein Resource' },
  { key: 'decipher', label: 'DECIPHER', color: '#be185d', description: 'DatabasE of genomiC varIation and Phenotype in Humans' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function GenePage({ params }: { params: { symbol: string } }) {
  const gene = geneMap.get(params.symbol.toUpperCase());
  if (!gene) notFound();

  const hasRichData = gene.phenotype || gene.mechanism || gene.hallmarks.length > 0;
  const hasSummary = gene.ncbiSummary || gene.phenotype;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/browse" style={{ color: '#64748b', textDecoration: 'none' }}>Browse</Link>
        <span>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>{gene.symbol}</span>
      </nav>

      {/* Gene header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <h1 style={{
            fontSize: '36px', fontWeight: 800, color: '#1e293b',
            fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
            letterSpacing: '-1px', margin: 0,
          }}>
            {gene.symbol}
          </h1>
          {gene.adultOnset && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fde68a' }}>
              Adult-onset
            </span>
          )}
        </div>

        <p style={{ fontSize: '18px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
          {gene.fullName || gene.rawName}
        </p>

        {/* Key facts row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {gene.locus && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '3px 10px', borderRadius: '99px' }}>
              {gene.locus}
            </span>
          )}
          {gene.chromosome && !gene.locus && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '3px 10px', borderRadius: '99px' }}>
              Chr {gene.chromosome}
            </span>
          )}
          {gene.inheritance.map(inh => {
            const style = inhBadge(inh);
            return (
              <span key={inh} style={{
                fontSize: '12px', fontWeight: 600,
                color: style.fg, background: style.bg,
                padding: '3px 10px', borderRadius: '99px',
              }}>
                {inh}
              </span>
            );
          })}
          {gene.omim && (
            <a href={`https://omim.org/entry/${gene.omim}`} target="_blank" rel="noopener"
              style={{ fontSize: '12px', fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', padding: '3px 10px', borderRadius: '99px', textDecoration: 'none', border: '1px solid #bfdbfe' }}>
              OMIM {gene.omim}
            </a>
          )}
          {gene.geneType && (
            <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
              {gene.geneType}
            </span>
          )}
        </div>

        {/* Aliases */}
        {gene.aliases.length > 0 && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
            <span style={{ fontWeight: 600 }}>Also known as: </span>
            {gene.aliases.join(', ')}
          </div>
        )}
      </div>

      {/* ── Primary WUSTL link ──────────────────────────────────────────── */}
      <a
        href={gene.wustlUrl}
        target="_blank"
        rel="noopener"
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '12px', padding: '14px 18px',
          textDecoration: 'none', marginBottom: '28px',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800, fontFamily: 'monospace' }}>W</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>
            View full entry on WUSTL Neuromuscular
          </div>
          <div style={{ fontSize: '11px', color: '#b91c1c', opacity: 0.7, marginTop: '1px' }}>
            {gene.wustlUrl.replace('https://neuromuscular.wustl.edu/', '')}
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* ── Gene Summary (NCBI RefSeq) ──────────────────────────────────── */}
      {gene.ncbiSummary && (
        <Section title="Gene Summary" subtitle="RefSeq / NCBI">
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
            {gene.ncbiSummary}
          </p>
        </Section>
      )}

      {/* ── Clinical Phenotype ──────────────────────────────────────────── */}
      {gene.phenotype && (
        <Section title="Clinical Phenotype">
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
            {gene.phenotype}
          </p>
        </Section>
      )}

      {/* ── Molecular Mechanism ─────────────────────────────────────────── */}
      {gene.mechanism && (
        <Section title="Molecular Mechanism">
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
            {gene.mechanism}
          </p>
        </Section>
      )}

      {/* ── Clinical Hallmarks ──────────────────────────────────────────── */}
      {gene.hallmarks.length > 0 && (
        <Section title="Clinical Hallmarks &amp; Key Evidence">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gene.hallmarks.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#eff6ff', border: '1px solid #bfdbfe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#2563eb', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.55, margin: '0 0 4px 0' }}>
                    {h.point}
                  </p>
                  {h.citation && (
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                      {h.citation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Associated Conditions ───────────────────────────────────────── */}
      {gene.associatedConditions.length > 0 && (
        <Section title="Associated Conditions">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
            {gene.associatedConditions.map((c, i) => {
              const inhList = c.inheritance?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
              return (
                <Link
                  key={i}
                  href={`/condition/${c.slug}`}
                  style={{
                    display: 'block',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3, marginBottom: '4px' }}>
                    {c.name}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {inhList.slice(0, 3).map(inh => {
                      const s = inhBadge(inh);
                      return (
                        <span key={inh} style={{ fontSize: '10px', fontWeight: 500, padding: '1px 6px', borderRadius: '99px', background: s.bg, color: s.fg }}>
                          {inh}
                        </span>
                      );
                    })}
                    {c.category && (
                      <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: '#f1f5f9', color: '#64748b' }}>
                        {c.category}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── External Resources ──────────────────────────────────────────── */}
      <Section title="External Resources">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
          {EXT_LINKS.map(link => {
            const url = gene.externalLinks[link.key];
            if (!url) return null;
            return (
              <a
                key={link.key}
                href={url}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', background: '#fff',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: link.color, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{link.label}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{link.description}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            );
          })}
        </div>
      </Section>

      {/* ── Related genes (same category) ───────────────────────────────── */}
      <RelatedGenes current={gene} allGenes={genesData} />

      {/* Footer attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        Gene data compiled from the{' '}
        <a href="https://neuromuscular.wustl.edu" target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Washington University Neuromuscular Disease Center
        </a>
        , NCBI Gene, and OMIM.
        For clinical use, always refer to primary sources.
      </p>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h2>
        {subtitle && (
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>{subtitle}</span>
        )}
      </div>
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '14px', padding: '20px',
      }}>
        {children}
      </div>
    </section>
  );
}

function RelatedGenes({ current, allGenes }: { current: Gene; allGenes: readonly Gene[] }) {
  // Find genes in the same categories
  const related = allGenes.filter(g =>
    g.symbol !== current.symbol &&
    g.categories.some(c => current.categories.includes(c))
  ).slice(0, 8);

  if (related.length === 0) return null;

  return (
    <Section title="Related Genes">
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {related.map(g => (
          <Link
            key={g.symbol}
            href={`/gene/${g.symbol}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              border: '1px solid #e2e8f0', background: '#f8fafc',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', fontFamily: 'ui-monospace, monospace' }}>
              {g.symbol}
            </span>
            {g.fullName && (
              <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {g.fullName}
              </span>
            )}
          </Link>
        ))}
      </div>
    </Section>
  );
}
