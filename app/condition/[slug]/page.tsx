import { notFound } from 'next/navigation';
import conditionsData from '@/src/data/conditions-enriched.json';
import genesData from '@/src/data/genes-enriched.json';
import Link from 'next/link';

type Condition = (typeof conditionsData)[number];
type Gene = (typeof genesData)[number];

const condMap = new Map<string, Condition>();
for (const c of conditionsData) condMap.set(c.slug, c);

const geneMap = new Map<string, Gene>();
for (const g of genesData) geneMap.set(g.symbol.toUpperCase(), g);

export function generateStaticParams() {
  return conditionsData.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cond = condMap.get(params.slug);
  if (!cond) return { title: 'Condition not found' };
  return {
    title: `${cond.name} | Neuromuscular HOMEPAGE`,
    description: cond.content?.slice(0, 200) || `Condition page for ${cond.name}`,
  };
}

const INH_STYLE: Record<string, { bg: string; fg: string }> = {
  'autosomal dominant':  { bg: '#eff6ff', fg: '#1d4ed8' },
  'autosomal recessive': { bg: '#faf5ff', fg: '#7c3aed' },
  'x-linked':            { bg: '#fff1f2', fg: '#be185d' },
  'mitochondrial':       { bg: '#fffbeb', fg: '#92400e' },
  'de novo':             { bg: '#f0fdf4', fg: '#166534' },
};

function inhStyle(inh: string) {
  const key = inh.toLowerCase();
  for (const [pattern, style] of Object.entries(INH_STYLE)) {
    if (key.includes(pattern)) return style;
  }
  return { bg: '#f1f5f9', fg: '#475569' };
}

export default function ConditionPage({ params }: { params: { slug: string } }) {
  const cond = condMap.get(params.slug);
  if (!cond) notFound();

  // Resolve associated genes
  const linkedGenes = cond.genes
    .map(sym => geneMap.get(sym.toUpperCase()))
    .filter((g): g is Gene => !!g);

  // Find other conditions that share genes
  const relatedConditions = conditionsData.filter(c =>
    c.slug !== cond.slug &&
    c.genes.some(g => cond.genes.includes(g))
  ).slice(0, 8);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/browse" style={{ color: '#64748b', textDecoration: 'none' }}>Browse</Link>
        <span>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>{cond.name}</span>
      </nav>

      {/* Condition header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px', margin: '0 0 10px 0', lineHeight: 1.2 }}>
          {cond.name}
        </h1>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {cond.inheritance.map(inh => {
            const s = inhStyle(inh);
            return (
              <span key={inh} style={{ fontSize: '12px', fontWeight: 600, color: s.fg, background: s.bg, padding: '3px 10px', borderRadius: '99px' }}>
                {inh}
              </span>
            );
          })}
          {cond.category && (
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', background: '#f1f5f9', padding: '3px 10px', borderRadius: '99px' }}>
              {cond.category}
            </span>
          )}
          {cond.adultOnset && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fde68a' }}>
              Adult-onset
            </span>
          )}
          {cond.omimIds.length > 0 && (
            <a href={`https://omim.org/entry/${cond.omimIds[0]}`} target="_blank" rel="noopener"
              style={{ fontSize: '12px', fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', padding: '3px 10px', borderRadius: '99px', textDecoration: 'none', border: '1px solid #bfdbfe' }}>
              OMIM {cond.omimIds[0]}
            </a>
          )}
        </div>
      </div>

      {/* Primary WUSTL link */}
      <a
        href={cond.wustlUrl}
        target="_blank"
        rel="noopener"
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '12px', padding: '14px 18px',
          textDecoration: 'none', marginBottom: '28px',
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
            {cond.wustlUrl.replace('https://neuromuscular.wustl.edu/', '')}
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* Content preview */}
      {cond.content && (
        <Section title="Overview" subtitle="From WUSTL Neuromuscular">
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
            {cond.content.replace(/\s+/g, ' ').trim()}
          </p>
        </Section>
      )}

      {/* Associated genes */}
      {linkedGenes.length > 0 && (
        <Section title="Associated Genes">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
            {linkedGenes.map(gene => (
              <Link
                key={gene.symbol}
                href={`/gene/${gene.symbol}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', background: '#fff',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <span style={{
                  fontSize: '14px', fontWeight: 800, color: '#2563eb',
                  fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
                }}>
                  {gene.symbol}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500 }}>
                    {gene.fullName || gene.rawName}
                  </div>
                  {gene.locus && (
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{gene.locus}</div>
                  )}
                </div>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M4 2L10 6L4 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
          {/* Genes not in our database */}
          {cond.genes.filter(g => !geneMap.has(g.toUpperCase())).length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
              Other genes: {cond.genes.filter(g => !geneMap.has(g.toUpperCase())).join(', ')}
            </div>
          )}
        </Section>
      )}

      {/* OMIM links */}
      {cond.omimIds.length > 0 && (
        <Section title="OMIM Entries">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cond.omimIds.map(id => (
              <a
                key={id}
                href={`https://omim.org/entry/${id}`}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid #bfdbfe', background: '#eff6ff',
                  textDecoration: 'none',
                  fontSize: '13px', fontWeight: 600, color: '#1d4ed8',
                }}
              >
                OMIM #{id}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Related conditions */}
      {relatedConditions.length > 0 && (
        <Section title="Related Conditions" subtitle="Shared genes">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
            {relatedConditions.map(rc => (
              <Link
                key={rc.slug}
                href={`/condition/${rc.slug}`}
                style={{
                  display: 'block', padding: '10px 12px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', background: '#fff',
                  textDecoration: 'none', transition: 'border-color 0.15s',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  {rc.name}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {rc.genes.slice(0, 3).map(g => (
                    <span key={g} style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', fontFamily: 'ui-monospace, monospace' }}>
                      {g}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* External resources for this condition */}
      <Section title="External Resources">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
          <ExtLink label="WUSTL Neuromuscular" url={cond.wustlUrl} color="#991b1b" desc="Washington University Disease Center" />
          {cond.omimIds[0] && <ExtLink label="OMIM" url={`https://omim.org/entry/${cond.omimIds[0]}`} color="#1d4ed8" desc="Online Mendelian Inheritance in Man" />}
          <ExtLink label="PubMed" url={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(cond.name)}+neuromuscular`} color="#4338ca" desc="Biomedical Literature" />
          <ExtLink label="GeneReviews" url={`https://www.ncbi.nlm.nih.gov/books/NBK1116/?term=${encodeURIComponent(cond.name)}`} color="#b45309" desc="NCBI Expert-Authored Reviews" />
          <ExtLink label="Orphanet" url={`https://www.orpha.net/en/disease?search=${encodeURIComponent(cond.name)}`} color="#0d9488" desc="Portal for Rare Diseases" />
          <ExtLink label="NORD" url={`https://rarediseases.org/?s=${encodeURIComponent(cond.name)}`} color="#7c3aed" desc="National Organization for Rare Disorders" />
        </div>
      </Section>

      {/* Footer attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        Data sourced from the{' '}
        <a href="https://neuromuscular.wustl.edu" target="_blank" rel="noopener" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Washington University Neuromuscular Disease Center
        </a>.
        For clinical use, always refer to primary sources.
      </p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h2>
        {subtitle && <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>{subtitle}</span>}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
        {children}
      </div>
    </section>
  );
}

function ExtLink({ label, url, color, desc }: { label: string; url: string; color: string; desc: string }) {
  return (
    <a href={url} target="_blank" rel="noopener"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px', borderRadius: '10px',
        border: '1px solid #e2e8f0', background: '#fff',
        textDecoration: 'none', transition: 'border-color 0.15s',
      }}
    >
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{label}</div>
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{desc}</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
