import Link from 'next/link';
import indexData from '@/src/data/index.json';
import genesEnriched from '@/src/data/genes-enriched.json';
import { SECTIONS, type Section } from '@/src/sections';

type Summary = { crawledPages: number; totalSections: number; withGenes: number; withInheritance: number };
const summary = indexData as Summary;

export default function Landing() {
  return (
    <div>
      <LandingHero />

      <SectionLabel>Sections</SectionLabel>
      <div className="nm-2col" style={{ marginBottom: '36px' }}>
        {SECTIONS.map(s => <SectionCard key={s.slug} section={s} />)}
      </div>

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
        padding: '18px 20px', marginBottom: '28px',
      }}>
        <SectionLabel>About the name</SectionLabel>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65, margin: 0 }}>
          <em>Pons asinorum</em>, the bridge of asses, is Euclid&apos;s fifth proposition: the first
          theorem in the <em>Elements</em> that stopped beginners cold, and the one that showed who
          would go on. Neurology has its own bridges. This site collects them, section by section,
          as a study resource for trainees.
        </p>
      </div>

      <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '24px' }}>
        Neuromuscular data sourced from the{' '}
        <a href="https://neuromuscular.wustl.edu" target="_blank" rel="noopener"
          style={{ color: '#94a3b8', textDecoration: 'none' }}>
          Washington University Neuromuscular Disease Center
        </a>
        , NCBI Gene, and OMIM. For clinical use, always refer to primary sources.
      </p>
    </div>
  );
}

function LandingHero() {
  return (
    <div style={{
      marginBottom: '36px', paddingBottom: '28px',
      borderBottom: '1px solid #f1f5f9', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace', lineHeight: 1, marginBottom: '12px' }}>
        <span style={{
          fontSize: 'clamp(11px, 3.2vw, 13px)', fontWeight: 600, color: '#94a3b8',
          letterSpacing: '0.4em', textTransform: 'uppercase', display: 'block', marginBottom: '10px',
        }}>
          Neurology · Learning
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.35em' }}>
          <span style={{ fontSize: 'clamp(40px, 12vw, 64px)', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>PONS</span>
          <span style={{ fontSize: 'clamp(40px, 12vw, 64px)', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>ASINORUM</span>
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, letterSpacing: '0.01em' }}>
        <em>the bridge of asses</em>
        <br />
        A (Pediatric) Neurology Learning Resource
      </p>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const live = section.status === 'live';
  return (
    <Link href={`/${section.slug}`} className="nm-card-link" style={{
      display: 'flex', flexDirection: 'column', gap: '10px',
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
      padding: '18px 20px 16px', textDecoration: 'none',
      borderTop: `3px solid ${section.color}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: section.color, background: section.color + '14', padding: '3px 8px', borderRadius: '99px',
        }}>
          {section.tagline}
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          color: live ? '#16a34a' : '#94a3b8',
          background: live ? '#f0fdf4' : '#f8fafc',
          border: `1px solid ${live ? '#bbf7d0' : '#e2e8f0'}`,
          padding: '2px 7px', borderRadius: '99px',
        }}>
          {live ? 'Live' : 'Coming soon'}
        </span>
      </div>

      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
        {section.name}
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
        {section.blurb}
      </p>

      {live ? (
        <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
          <Stat value={genesEnriched.length.toLocaleString()} label="gene pages" />
          <Stat value={summary.totalSections.toLocaleString()} label="entries" />
          <Stat value={summary.crawledPages.toLocaleString()} label="source pages" />
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
          Planned: {section.planned.slice(0, 3).join(' · ')}
        </div>
      )}
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginRight: '4px' }}>{value}</span>
      {label}
    </span>
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
