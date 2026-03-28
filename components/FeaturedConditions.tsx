'use client';

import Link from 'next/link';

type Condition = {
  label: string;
  abbr: string;
  gene: string;
  color: string;
  url: string;
};

export default function FeaturedConditions({ conditions }: { conditions: Condition[] }) {
  // Detect local vs external links
  const isLocal = (url: string) => url.startsWith('/');

  return (
    <div className="nm-3col" style={{ marginBottom: '28px' }}>
      {conditions.map(cond => {
        const local = isLocal(cond.url);
        const Wrapper = local ? Link : 'a';
        const linkProps = local
          ? { href: cond.url }
          : { href: cond.url, target: '_blank' as const, rel: 'noopener' };

        return (
          <Wrapper
            key={cond.abbr}
            {...linkProps}
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
            onMouseEnter={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.borderColor = cond.color + '80';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 10px ${cond.color}18`;
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.borderColor = cond.color + '30';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700,
                color: cond.color,
                background: cond.color + '12',
                padding: '1px 7px', borderRadius: '99px', flexShrink: 0,
              }}>
                {cond.abbr}
              </span>
              {local ? (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <path d="M4 2L10 6L4 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b', lineHeight: 1.35, marginBottom: cond.gene ? '4px' : 0 }}>
              {cond.label}
            </span>
            {cond.gene && (
              <span style={{ fontSize: '10px', color: '#3b82f6', fontFamily: 'ui-monospace, monospace' }}>
                {cond.gene}
              </span>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}
