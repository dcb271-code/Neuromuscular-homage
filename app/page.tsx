import indexData from '@/src/data/index.json';
import { GeneOfDay, FactoidOfDay, QuestionOfDay } from '@/components/DailyWidgets';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedConditions from '@/components/FeaturedConditions';

type Summary = {
  crawledPages: number;
  totalSections: number;
  withGenes: number;
  withInheritance: number;
};

const summary = indexData as Summary;

// Hardcoded clinically-focused categories with direct wustl.edu links
const CLINICAL_CATEGORIES = [
  { name: 'Neuromuscular Syndromes',               color: '#64748b', url: 'https://neuromuscular.wustl.edu/' },
  { name: 'Muscular Dystrophies',                  color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/dmd.html' },
  { name: 'Congenital & Pediatric Myopathies',     color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html' },
  { name: 'Motor Neuron Diseases',                 color: '#dc2626', url: 'https://neuromuscular.wustl.edu/synmot.html' },
  { name: 'Peripheral Neuropathies',               color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html' },
  { name: 'NMJ Disorders',                         color: '#0891b2', url: 'https://neuromuscular.wustl.edu/synmg.html' },
  { name: 'Mitochondrial Disorders',               color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html' },
  { name: 'Inherited Ataxias',                     color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html' },
  { name: 'Familial Spinal Cord Syndromes (SPG)',  color: '#0d9488', url: 'https://neuromuscular.wustl.edu/spinal/fsp.html' },
  { name: 'Acute Immune Polyneuropathies',         color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/antibody/gbs.htm' },
  { name: 'Myopathy + CNS (Encephalomyopathy)',    color: '#be185d', url: 'https://neuromuscular.wustl.edu/msys/mcns.html' },
  { name: 'Episodic Muscle Weakness',             color: '#d97706', url: 'https://neuromuscular.wustl.edu/mtime/mepisodic.html' },
];

// Hardcoded featured pediatric NMD conditions
const FEATURED_CONDITIONS = [
  {
    label: 'Duchenne MD',
    abbr: 'DMD',
    gene: 'DMD',
    color: '#7c3aed',
    url: 'https://neuromuscular.wustl.edu/musdist/dmd.html#DYSTROPHINOPATHIES',
  },
  {
    label: 'Becker MD',
    abbr: 'BMD',
    gene: 'DMD',
    color: '#7c3aed',
    url: 'https://neuromuscular.wustl.edu/musdist/dmd.html#Becker',
  },
  {
    label: 'Spinal Muscular Atrophy',
    abbr: 'SMA',
    gene: 'SMN1',
    color: '#dc2626',
    url: 'https://neuromuscular.wustl.edu/synmot.html#SMA%205q:%20Classification%20(without%20treatment)',
  },
  {
    label: 'Myotonic Dystrophy 1',
    abbr: 'DM1',
    gene: 'DMPK',
    color: '#7c3aed',
    url: 'https://neuromuscular.wustl.edu/musdist/pe-eom.html#Myotonic%20Dystrophy%201%20(DM1)',
  },
  {
    label: 'Emery-Dreifuss MD',
    abbr: 'EDMD',
    gene: 'EMD / LMNA',
    color: '#db2777',
    url: 'https://neuromuscular.wustl.edu/msys/contract.html',
  },
  {
    label: 'AIDP / Guillain–Barré Syndrome',
    abbr: 'GBS',
    gene: '',
    color: '#0891b2',
    url: 'https://neuromuscular.wustl.edu/antibody/gbs.htm',
  },
  {
    label: 'Myasthenia Gravis',
    abbr: 'MG',
    gene: 'CHRNA1 / MUSK',
    color: '#0891b2',
    url: 'https://neuromuscular.wustl.edu/synmg.html#Myasthenia%20Gravis:%20Autoimmune',
  },
  {
    label: 'Mitochondrial Myopathies',
    abbr: 'Mito',
    gene: 'mtDNA / nDNA',
    color: '#d97706',
    url: 'https://neuromuscular.wustl.edu/mitosyn.html#MITOCHONDRIAL%20DISORDERS',
  },
  {
    label: 'Friedreich Ataxia',
    abbr: 'FRDA',
    gene: 'FXN',
    color: '#16a34a',
    url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#Friedreich%20Ataxia',
  },
  {
    label: 'Limb-Girdle Muscular Dystrophy',
    abbr: 'LGMD',
    gene: 'Multiple',
    color: '#7c3aed',
    url: 'https://neuromuscular.wustl.edu/musdist/lg.html',
  },
  {
    label: 'Collagen VI Myopathies (Bethlem / Ullrich)',
    abbr: 'COL6',
    gene: 'COL6A1-3',
    color: '#db2777',
    url: 'https://neuromuscular.wustl.edu/syncm.html',
  },
  {
    label: 'Hereditary Neuropathy w/ Pressure Palsies',
    abbr: 'HNPP',
    gene: 'PMP22',
    color: '#2563eb',
    url: 'https://neuromuscular.wustl.edu/time/hmsn.html#Hereditary%20Liability%20to%20Pressure%20Palsies%20(HNPP)',
  },
];

export default function Home() {
  return (
    <div>
      {/* ── Site hero ────────────────────────────────────────────────── */}
      <SiteHero />

      {/* ── Daily widgets ────────────────────────────────────────────── */}
      <SectionLabel>Today</SectionLabel>

      {/* Gene of the Day — full width */}
      <div style={{ marginBottom: '12px' }}>
        <GeneOfDay />
      </div>

      {/* Factoid + Question side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '36px',
      }}>
        <FactoidOfDay />
        <QuestionOfDay />
      </div>

      {/* ── Featured conditions ──────────────────────────────────────── */}
      <SectionLabel>Common Pediatric Neuromuscular Conditions</SectionLabel>
      <FeaturedConditions conditions={FEATURED_CONDITIONS} />

      {/* ── Browse by Category + vertical alphabet sidebar ───────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: '20px',
        alignItems: 'start',
        marginTop: '28px',
      }}>
        {/* Vertical alphabet index */}
        <div>
          <SectionLabel>Index</SectionLabel>
          <AlphabetIndex />
        </div>

        {/* Category grid */}
        <div>
          <SectionLabel>Browse by Category</SectionLabel>
          <CategoryGrid
            items={CLINICAL_CATEGORIES}
            totalCount={summary.totalSections}
          />
        </div>
      </div>

      {/* ── Stats bar at bottom ──────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginTop: '36px',
      }}>
        {[
          { label: 'Source pages',      value: summary.crawledPages.toLocaleString() },
          { label: 'Entries',           value: summary.totalSections.toLocaleString() },
          { label: 'With gene data',    value: summary.withGenes.toLocaleString() },
          { label: 'Inheritance tagged', value: summary.withInheritance.toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.5px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Attribution */}
      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '16px' }}>
        Data sourced from the{' '}
        <a href="https://neuromuscular.wustl.edu" target="_blank" rel="noopener"
          style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Washington University Neuromuscular Disease Center
        </a>.
        For clinical use, always refer to the primary source.
      </p>
    </div>
  );
}

function SiteHero() {
  return (
    <div style={{
      marginBottom: '36px',
      paddingBottom: '28px',
      borderBottom: '1px solid #f1f5f9',
    }}>
      {/* Main title */}
      <div style={{
        fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
        lineHeight: 1,
        marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#94a3b8',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          Neuromuscular
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#60a5fa',
            letterSpacing: '-2px',
          }}>HOM</span>
          <span style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#93c5fd',
            opacity: 0.7,
            letterSpacing: '0.02em',
            verticalAlign: 'middle',
            position: 'relative',
            top: '-4px',
          }}>ep</span>
          <span style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#60a5fa',
            letterSpacing: '-2px',
          }}>AGE</span>
        </span>
      </div>

      {/* Subheader */}
      <p style={{
        fontSize: '13px',
        color: '#64748b',
        margin: 0,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      }}>
        A salute to Dr Alan Pestronk, MD
        <span style={{ margin: '0 8px', color: '#cbd5e1' }}>·</span>
        A (Pediatric) Neuromuscular Resource, Revised
      </p>
    </div>
  );
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const INDEX_BASE = 'https://neuromuscular.wustl.edu/alfindex.htm';

function AlphabetIndex() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '8px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    }}>
      {ALPHABET.map(letter => (
        <a
          key={letter}
          href={`${INDEX_BASE}#${letter}`}
          target="_blank"
          rel="noopener"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '22px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: '#475569',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          {letter}
        </a>
      ))}
      {/* Full index link */}
      <a
        href={INDEX_BASE}
        target="_blank"
        rel="noopener"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '4px',
          height: '22px',
          fontSize: '10px',
          fontWeight: 500,
          color: '#64748b',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '5px',
          textDecoration: 'none',
        }}
      >
        ↗
      </a>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#94a3b8',
      marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}
