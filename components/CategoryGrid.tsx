'use client';

const INDEX_URL = 'https://neuromuscular.wustl.edu/alfindex.htm';

type ClinicalCategory = { name: string; color: string; url: string };

export default function CategoryGrid({ items, totalCount }: {
  items: ClinicalCategory[];
  totalCount: number;
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {items.map(cat => (
          <a
            key={cat.name}
            href={cat.url}
            target="_blank"
            rel="noopener"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = cat.color + '80';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${cat.color}18`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: cat.color,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1 }}>{cat.name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ))}
      </div>

      {/* Index card */}
      <a
        href={INDEX_URL}
        target="_blank"
        rel="noopener"
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '14px 16px',
          textDecoration: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#64748b80';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px #64748b18';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Book icon */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: '#64748b' }}>
            <path d="M2 3a1 1 0 0 1 1-1h4a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2H3a1 1 0 0 1-1-1V3z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M14 3a1 1 0 0 0-1-1H9a2 2 0 0 0-2 2v9a2 2 0 0 1 2-2h4a1 1 0 0 0 1-1V3z" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1 }}>Index</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ marginTop: '8px', paddingLeft: '24px' }}>
          <span style={{
            fontSize: '10px', padding: '2px 7px', borderRadius: '99px',
            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
          }}>
            A – Z condition &amp; gene index
          </span>
        </div>
      </a>

      <a
        href="/browse"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '10px',
          padding: '12px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '13px',
          color: '#64748b',
          fontWeight: 500,
        }}
      >
        Browse all {totalCount.toLocaleString()} entries
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </>
  );
}
