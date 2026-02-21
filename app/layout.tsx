import type { Metadata } from 'next';
import './globals.css';
import GlobalSearch from '@/components/GlobalSearch';

export const metadata: Metadata = {
  title: 'Neuromuscular Homage — neuromuscular.wustl.edu',
  description: 'Searchable index of neuromuscular diseases, genes, and inheritance patterns — sourced from neuromuscular.wustl.edu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header style={{ backgroundColor: '#0f172a' }} className="sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
            {/* Brand */}
            <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", monospace',
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '-0.5px',
                  color: '#f1f5f9',
                }}>
                  Neuromuscular{' '}
                  <span style={{ color: '#60a5fa' }}>
                    HOME
                    <span style={{ fontSize: '9px', verticalAlign: 'middle', opacity: 0.75, fontWeight: 600, letterSpacing: '0.02em' }}>ep</span>
                    AGE
                  </span>
                </span>
                <div style={{
                  fontSize: '9px',
                  color: 'rgba(148,163,184,0.6)',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'ui-monospace, monospace',
                }}>neuromuscular.wustl.edu</div>
              </div>
            </a>

            {/* Search */}
            <div className="flex-1 max-w-lg">
              <GlobalSearch />
            </div>

            {/* Nav */}
            <nav className="nm-hide-sm" style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              <NavLink href="/browse">Browse</NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        padding: '5px 12px',
        fontSize: '12px',
        fontWeight: 500,
        color: 'rgba(148,163,184,0.9)',
        textDecoration: 'none',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </a>
  );
}
