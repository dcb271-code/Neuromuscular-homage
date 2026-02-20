'use client';

type Condition = {
  label: string;
  abbr: string;
  gene: string;
  color: string;
  url: string;
};

export default function FeaturedConditions({ conditions }: { conditions: Condition[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '28px',
    }}>
      {conditions.map(cond => (
        <a
          key={cond.abbr}
          href={cond.url}
          target="_blank"
          rel="noopener"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            border: `1px solid ${cond.color}30`,
            borderRadius: '12px',
            padding: '12px 14px',
            textDecoration: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = cond.color + '80';
            (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 10px ${cond.color}18`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = cond.color + '30';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: cond.color,
              background: cond.color + '12',
              padding: '1px 7px',
              borderRadius: '99px',
              flexShrink: 0,
            }}>
              {cond.abbr}
            </span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b', lineHeight: 1.35, marginBottom: cond.gene ? '4px' : 0 }}>
            {cond.label}
          </span>
          {cond.gene && (
            <span style={{ fontSize: '10px', color: '#3b82f6', fontFamily: 'ui-monospace, monospace' }}>
              {cond.gene}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
