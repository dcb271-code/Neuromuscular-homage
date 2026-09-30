import type { Metadata } from 'next';
import './globals.css';
import GlobalSearch from '@/components/GlobalSearch';
import { SECTIONS } from '@/src/sections';

export const metadata: Metadata = {
  title: 'Pons Asinorum — a neurology learning resource',
  description: 'Pons Asinorum: neuromuscular disease index, neuroradiology, localization and the neuro exam, and EEG learning resources.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header style={{ backgroundColor: '#0f172a' }} className="sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-6">
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
                  Pons <span style={{ color: '#60a5fa' }}>Asinorum</span>
                </span>
                <div className="nm-hide-sm" style={{
                  fontSize: '9px',
                  color: 'rgba(148,163,184,0.6)',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'ui-monospace, monospace',
                }}>ponsasinorum.vercel.app</div>
              </div>
            </a>

            {/* Search (neuromuscular index) */}
            <div className="flex-1 min-w-0 max-w-lg">
              <GlobalSearch />
            </div>

            {/* Section nav — desktop */}
            <nav className="hidden md:flex" style={{ gap: '4px', flexShrink: 0 }}>
              {SECTIONS.map(s => (
                <NavLink key={s.slug} href={`/${s.slug}`} color={s.color}>{s.short}</NavLink>
              ))}
            </nav>
            {/* Compact link — mobile */}
            <a href="/browse" className="nm-show-sm"
              style={{
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 600,
                color: '#60a5fa',
                textDecoration: 'none',
              }}
            >A–Z</a>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink({ href, color, children }: { href: string; color: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: 500,
        color: 'rgba(148,163,184,0.9)',
        textDecoration: 'none',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      {children}
    </a>
  );
}
