import indexData from '@/src/data/index.json';
import genesEnriched from '@/src/data/genes-enriched.json';
import { GeneOfDay, FactoidOfDay, QuestionOfDay } from '@/components/DailyWidgets';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedConditions from '@/components/FeaturedConditions';
import { RotatingCategories, RotatingConditions, RotatingGenes } from '@/components/RotatingWidgets';
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

// 6 featured pediatric NMD conditions — curated WUSTL deep links
const FEATURED_CONDITIONS = [
  { label: 'Duchenne MD',              abbr: 'DMD',  gene: 'DMD',    color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/dmd.html#Duchenne' },
  { label: 'Spinal Muscular Atrophy',  abbr: 'SMA',  gene: 'SMN1',   color: '#dc2626', url: 'https://neuromuscular.wustl.edu/synmot.html#sma5q' },
  { label: 'Myotonic Dystrophy 1',     abbr: 'DM1',  gene: 'DMPK',   color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/pe-eom.html#dm1' },
  { label: 'Emery-Dreifuss MD',        abbr: 'EDMD', gene: 'EMD / LMNA', color: '#db2777', url: 'https://neuromuscular.wustl.edu/msys/contract.html#emd' },
  { label: 'Central Core Disorders',   abbr: 'CCD',  gene: 'RYR1',   color: '#0d9488', url: 'https://neuromuscular.wustl.edu/syncm.html#cc' },
  { label: 'Friedreich Ataxia',        abbr: 'FRDA', gene: 'FXN',    color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#FA' },
];

export default function Home() {
  return (
    <div>
      {/* ── Site hero ────────────────────────────────────────────────── */}
      <SiteHero />

      {/* ── Daily widgets ────────────────────────────────────────────── */}
      <SectionLabel>Today</SectionLabel>
      <div style={{ marginBottom: '12px' }}>
        <GeneOfDay />
      </div>
      <div className="nm-2col" style={{ marginBottom: '36px' }}>
        <FactoidOfDay />
        <QuestionOfDay />
      </div>

      {/* ── Rotating Genes (local pages) ─────────────────────────────── */}
      <SectionLabel>Neuromuscular Genes</SectionLabel>
      <RotatingGenes />

      {/* ── Featured + rotating conditions ─────────────────────────── */}
      <div style={{ marginTop: '28px' }}>
        <SectionLabel>Select Neuromuscular Conditions</SectionLabel>
        <FeaturedConditions conditions={FEATURED_CONDITIONS} />
        <RotatingConditions />
      </div>

      {/* ── Browse by Category + alphabet index ──────────────────────── */}
      <div style={{ marginTop: '28px' }}>
        <SectionLabel>Browse by Category</SectionLabel>
        <CategoryGrid items={CLINICAL_CATEGORIES} />
        <RotatingCategories />
        <div style={{ marginTop: '8px' }}>
          <AlphabetIndex />
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <div className="nm-4col" style={{ marginTop: '36px' }}>
        {[
          { label: 'Source pages',      value: summary.crawledPages.toLocaleString() },
          { label: 'Entries',           value: summary.totalSections.toLocaleString() },
          { label: 'Gene pages',        value: genesEnriched.length.toLocaleString() },
          { label: 'Inheritance tagged', value: summary.withInheritance.toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '14px', padding: '16px 18px',
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

function SiteHero() {
  return (
    <div style={{
      marginBottom: '36px',
      paddingBottom: '28px',
      borderBottom: '1px solid #f1f5f9',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
        lineHeight: 1,
        marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '22px', fontWeight: 600, color: '#94a3b8',
          letterSpacing: '0.4em', textTransform: 'uppercase',
          display: 'block', marginBottom: '4px',
        }}>
          Neuromuscular
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: '72px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>HOM</span>
          <span style={{ fontSize: '28px', fontWeight: 600, color: '#93c5fd', opacity: 0.7, letterSpacing: '0.02em', verticalAlign: 'middle', position: 'relative', top: '-6px' }}>ep</span>
          <span style={{ fontSize: '72px', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>AGE</span>
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, letterSpacing: '0.01em' }}>
        A salute to Dr Alan Pestronk, MD
        <br />
        A (Pediatric) Neuromuscular Resource, Revised
      </p>
    </div>
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
