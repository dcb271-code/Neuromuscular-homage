import Link from 'next/link';
import { getSection, SECTIONS } from '@/src/sections';

// Placeholder page for a section that is not built yet.
// Keeps the site's visual language so the landing links never 404.
export default function SectionStub({ slug }: { slug: string }) {
  const section = getSection(slug);
  const others = SECTIONS.filter(s => s.slug !== slug);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <nav style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Pons Asinorum</Link>
        <span>/</span>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>{section.name}</span>
      </nav>

      <div style={{ marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: section.color, background: section.color + '14', padding: '3px 8px', borderRadius: '99px',
          }}>
            {section.tagline}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0',
            padding: '2px 7px', borderRadius: '99px',
          }}>
            In development
          </span>
        </div>
        <h1 style={{
          fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
          fontSize: 'clamp(28px, 7vw, 40px)', fontWeight: 800, color: section.color,
          letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 10px',
        }}>
          {section.name}
        </h1>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0, maxWidth: '620px' }}>
          {section.blurb}
        </p>
      </div>

      <SectionLabel>Planned topics</SectionLabel>
      <div style={{ display: 'grid', gap: '8px', marginBottom: '32px' }}>
        {section.planned.map((topic, i) => (
          <div key={topic} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px',
          }}>
            <span style={{
              width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: section.color, background: section.color + '14',
            }}>
              {i + 1}
            </span>
            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{topic}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Other sections</SectionLabel>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {others.map(s => (
          <Link key={s.slug} href={`/${s.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, color: '#334155', textDecoration: 'none',
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '99px', padding: '6px 12px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
            {s.name}
            {s.status === 'live' && <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>LIVE</span>}
          </Link>
        ))}
      </div>
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
