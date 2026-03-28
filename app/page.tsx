import indexData from '@/src/data/index.json';
import genesData from '@/src/data/genes-enriched.json';
import { GeneOfDay, FactoidOfDay, QuestionOfDay } from '@/components/DailyWidgets';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedConditions from '@/components/FeaturedConditions';
import { RotatingCategories, RotatingConditions } from '@/components/RotatingWidgets';
import HeroSearch from '@/components/HeroSearch';
import Link from 'next/link';

type Summary = {
  crawledPages: number;
  totalSections: number;
  withGenes: number;
  withInheritance: number;
};

const summary = indexData as Summary;

// Hardcoded clinically-focused categories with direct wustl.edu links
const CLINICAL_CATEGORIES = [
  { name: 'Muscular Dystrophies',                  color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/dmd.html' },
  { name: 'Congenital & Pediatric Myopathies',     color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html' },
  { name: 'Motor Neuron Diseases',                 color: '#dc2626', url: 'https://neuromuscular.wustl.edu/synmot.html' },
  { name: 'Peripheral Neuropathies',               color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html' },
  { name: 'NMJ Disorders',                         color: '#0891b2', url: 'https://neuromuscular.wustl.edu/synmg.html' },
  { name: 'Mitochondrial Disorders',               color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html' },
  { name: 'Hereditary Ataxia, Recessive',           color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html' },
  { name: 'Familial Spinal Cord Syndromes (SPG)',  color: '#0d9488', url: 'https://neuromuscular.wustl.edu/spinal/fsp.html' },
  { name: 'Acute Immune Polyneuropathies',         color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/antibody/gbs.htm' },
  { name: 'Myopathy + CNS (Encephalomyopathy)',    color: '#be185d', url: 'https://neuromuscular.wustl.edu/msys/mcns.html' },
  { name: 'Episodic Muscle Weakness',             color: '#d97706', url: 'https://neuromuscular.wustl.edu/mtime/mepisodic.html' },
  { name: 'Myoglobinuria / Rhabdomyolysis',       color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/myoglob.html' },
];

// Featured pediatric NMD conditions — now linking to local pages
const FEATURED_CONDITIONS = [
  { label: 'Duchenne MD',                         abbr: 'DMD',   gene: 'DMD',           color: '#7c3aed', url: '/gene/DMD' },
  { label: 'Becker MD',                           abbr: 'BMD',   gene: 'DMD',           color: '#7c3aed', url: '/gene/DMD' },
  { label: 'Spinal Muscular Atrophy',             abbr: 'SMA',   gene: 'SMN1',          color: '#dc2626', url: '/gene/SMN1' },
  { label: 'Myotonic Dystrophy 1',                abbr: 'DM1',   gene: 'DMPK',          color: '#7c3aed', url: '/gene/DMPK' },
  { label: 'Emery-Dreifuss MD',                   abbr: 'EDMD',  gene: 'EMD / LMNA',    color: '#db2777', url: '/gene/LMNA' },
  { label: 'Childhood Myasthenia Gravis',          abbr: 'MG',    gene: 'CHRNA1 / MUSK', color: '#0891b2', url: '/search?q=myasthenia+gravis' },
  { label: 'Central Core Disorders',              abbr: 'CCD',   gene: 'RYR1',          color: '#0d9488', url: '/gene/RYR1' },
  { label: 'Bethlem Myopathies (COL6/12)',         abbr: 'BTHLM', gene: 'COL6A1-3',      color: '#db2777', url: '/search?q=bethlem' },
  { label: 'Hereditary Neuropathy w/ Pressure Palsies', abbr: 'HNPP', gene: 'PMP22',    color: '#2563eb', url: '/gene/PMP22' },
  { label: 'Friedreich Ataxia',                   abbr: 'FRDA',  gene: 'FXN',           color: '#16a34a', url: '/search?q=friedreich' },
  { label: 'Kearns-Sayre Syndrome "Spectrum"',    abbr: 'KSS',   gene: 'mtDNA',         color: '#d97706', url: '/search?q=kearns-sayre' },
  { label: 'AIDP / Guillain-Barre Syndrome',      abbr: 'GBS',   gene: '',              color: '#0891b2', url: '/search?q=guillain-barre' },
];

// Curated spotlight genes for the homepage
const SPOTLIGHT_GENES = genesData
  .filter(g => g.fullName && (g.ncbiSummary || g.phenotype))
  .slice(0, 12);

export default function Home() {
  return (
    <div>
      {/* ── Search-first hero ──────────────────────────────────────────── */}
      <SearchHero />

      {/* ── Quick entry points ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <QuickLink href="/browse" label="Browse A-Z" />
        <QuickLink href="/search?q=autosomal+dominant" label="Autosomal Dominant" />
        <QuickLink href="/search?q=autosomal+recessive" label="Autosomal Recessive" />
        <QuickLink href="/search?q=x-linked" label="X-Linked" />
        <QuickLink href="/search?q=mitochondrial" label="Mitochondrial" />
      </div>

      {/* ── Two-column: Browse + Daily ─────────────────────────────────── */}
      <div className="nm-home-grid">
        {/* Left column: Browse & Navigate */}
        <div>
          {/* Browse by Category */}
          <SectionLabel>Browse by Category</SectionLabel>
          <CategoryGrid items={CLINICAL_CATEGORIES} />
          <RotatingCategories />
          <div style={{ marginTop: '8px' }}>
            <AlphabetIndex />
          </div>

          {/* Featured Genes */}
          <div style={{ marginTop: '28px' }}>
            <SectionLabel>Featured Genes</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px' }}>
              {SPOTLIGHT_GENES.map(g => (
                <Link
                  key={g.symbol}
                  href={`/gene/${g.symbol}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: '10px', padding: '8px 12px',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                >
                  <span style={{
                    fontSize: '13px', fontWeight: 800, color: '#2563eb',
                    fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
                  }}>
                    {g.symbol}
                  </span>
                  <span style={{
                    fontSize: '10px', color: '#64748b',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {g.fullName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Daily content + Stats */}
        <div>
          <SectionLabel>Today</SectionLabel>
          <div style={{ marginBottom: '12px' }}>
            <GeneOfDay />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <FactoidOfDay />
            <QuestionOfDay />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Source pages',       value: summary.crawledPages.toLocaleString() },
              { label: 'Entries indexed',    value: summary.totalSections.toLocaleString() },
              { label: 'Gene entries',       value: genesData.length.toLocaleString() },
              { label: 'Inheritance tagged', value: summary.withInheritance.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: '12px', padding: '12px 14px',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.5px' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured conditions ──────────────────────────────────────── */}
      <div style={{ marginTop: '32px' }}>
        <SectionLabel>Select Neuromuscular Conditions</SectionLabel>
        <FeaturedConditions conditions={FEATURED_CONDITIONS} />
        <RotatingConditions />
      </div>

      {/* Attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '24px' }}>
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

// ─── Search-first hero ──────────────────────────────────────────────────────────

function SearchHero() {
  return (
    <div style={{
      textAlign: 'center',
      paddingBottom: '24px',
      marginBottom: '8px',
    }}>
      {/* Compact title */}
      <div style={{
        fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '16px', fontWeight: 600, color: '#94a3b8',
          letterSpacing: '0.4em', textTransform: 'uppercase',
          display: 'block', marginBottom: '2px',
        }}>
          Neuromuscular
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: '48px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>HOM</span>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#93c5fd', opacity: 0.7, letterSpacing: '0.02em', verticalAlign: 'middle', position: 'relative', top: '-4px' }}>ep</span>
          <span style={{ fontSize: '48px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>AGE</span>
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
        A salute to Dr Alan Pestronk, MD &middot; A (Pediatric) Neuromuscular Resource, Revised
      </p>

      {/* Prominent search */}
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <HeroSearch />
      </div>

      {/* Suggestion chips */}
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
        Try:{' '}
        {['DMD', 'SMA', 'Duchenne', 'CMT', 'RYR1', 'mitochondrial', 'LMNA'].map(q => (
          <Link
            key={q}
            href={`/search?q=${encodeURIComponent(q)}`}
            style={{
              display: 'inline-block', padding: '2px 8px', margin: '2px',
              borderRadius: '6px', background: '#f1f5f9',
              border: '1px solid #e2e8f0', fontSize: '11px',
              color: '#475569', textDecoration: 'none',
            }}
          >
            {q}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{
      display: 'inline-block', padding: '5px 14px',
      fontSize: '11px', fontWeight: 600,
      borderRadius: '99px', background: '#f8fafc',
      border: '1px solid #e2e8f0', color: '#475569',
      textDecoration: 'none', letterSpacing: '0.02em',
    }}>
      {label}
    </Link>
  );
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const WUSTL_INDEX = 'https://neuromuscular.wustl.edu/alfindex.htm';

function AlphabetIndex() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: '12px', padding: '10px 12px',
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
      gap: '4px', alignItems: 'center',
    }}>
      {ALPHABET.map(letter => (
        <Link key={letter} href={`/browse/${letter}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '26px', height: '26px', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.05em', color: '#475569', background: '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: '5px', textDecoration: 'none',
        }}>
          {letter}
        </Link>
      ))}
      <a href={WUSTL_INDEX} target="_blank" rel="noopener" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '4px', marginLeft: '6px', height: '26px', padding: '0 10px',
        fontSize: '11px', fontWeight: 600, color: '#475569',
        background: '#f1f5f9', border: '1px solid #cbd5e1',
        borderRadius: '5px', textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        A-Z Index
      </a>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}
