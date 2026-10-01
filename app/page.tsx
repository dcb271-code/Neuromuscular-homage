import Link from 'next/link';
import indexData from '@/src/data/index.json';
import genesEnriched from '@/src/data/genes-enriched.json';
import { SECTIONS, type Section } from '@/src/sections';
import { EEG_MODULES } from '@/src/eeg/modules';
import { LOC_MODULES } from '@/src/loc/modules';
import eegFigures from '@/src/eeg/figures.json';

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
          <strong>Where before what.</strong> The oldest rule in neurology: find the lesion before you
          name the disease. A weak hand, a lost reflex, a child who stopped walking are addresses first and
          diagnoses second. Fix the address and the list of suspects writes itself; skip it and the list is
          everyone. The sections here keep that order, from muscle and nerve to image to rhythm.
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
          <span style={{ fontSize: 'clamp(36px, 11vw, 60px)', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>WHERE</span>
          <span style={{ fontSize: 'clamp(36px, 11vw, 60px)', fontWeight: 600, color: '#93c5fd', letterSpacing: '-1px' }}>BEFORE</span>
          <span style={{ fontSize: 'clamp(36px, 11vw, 60px)', fontWeight: 800, color: '#60a5fa', letterSpacing: '-2px' }}>WHAT</span>
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, letterSpacing: '0.01em' }}>
        <em>localize the lesion before you name the disease</em>
        <br />
        A (Pediatric) Neurology Learning Resource
      </p>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const live = section.status === 'live';
  const partial = section.status === 'partial';
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
          color: live || partial ? '#16a34a' : '#94a3b8',
          background: live || partial ? '#f0fdf4' : '#f8fafc',
          border: `1px solid ${live || partial ? '#bbf7d0' : '#e2e8f0'}`,
          padding: '2px 7px', borderRadius: '99px',
        }}>
          {live ? 'Live' : partial ? 'Atlas live' : 'Coming soon'}
        </span>
      </div>

      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
        {section.name}
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
        {section.blurb}
      </p>

      {live && section.slug === 'neuromuscular' ? (
        <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
          <Stat value={genesEnriched.length.toLocaleString()} label="gene pages" />
          <Stat value={summary.totalSections.toLocaleString()} label="entries" />
          <Stat value={summary.crawledPages.toLocaleString()} label="source pages" />
        </div>
      ) : live && section.slug === 'eeg' ? (
        <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
          <Stat value={String(EEG_MODULES.length)} label="modules" />
          <Stat value={String(EEG_MODULES.reduce((n, m) => n + m.sections.length, 0))} label="sections" />
          <Stat value={String(EEG_MODULES.reduce((n, m) => n + m.quiz.length + m.sections.filter(s => s.question).length, 0))} label="questions" />
          <Stat value={String(eegFigures.length)} label="tracings" />
        </div>
      ) : live && section.slug === 'localization' ? (
        <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
          <Stat value={String(LOC_MODULES.length)} label="modules" />
          <Stat value={String(LOC_MODULES.reduce((n, m) => n + m.sections.filter(s => s.figure).length, 0))} label="interactive figures" />
          <Stat value={String(LOC_MODULES.reduce((n, m) => n + m.quiz.length + m.sections.filter(s => s.question).length, 0))} label="questions" />
        </div>
      ) : partial ? (
        <div style={{ display: 'grid', gap: '4px', marginTop: '4px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: section.color }}>{section.now}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Next: {section.planned.slice(0, 2).join(' · ')}</div>
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
