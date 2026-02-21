'use client';

type ClinicalCategory = { name: string; color: string; url: string };

export default function CategoryGrid({ items }: {
  items: ClinicalCategory[];
}) {
  return (
    <div className="nm-3col">
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
  );
}
