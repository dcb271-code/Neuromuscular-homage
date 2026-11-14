// "Taught in": a small line on a gene or condition page naming the curriculum sections that
// teach it. Built from the modules' `related` fields (src/curriculum/xlinks.ts).

import Link from 'next/link';
import { taughtIn } from '@/src/curriculum/xlinks';

export function TaughtInLine({ path }: { path: string }) {
  const links = taughtIn(path);
  if (!links.length) return null;
  return (
    <nav aria-label="Taught in the curricula" style={{ marginTop: '10px', fontSize: '12.5px', color: '#64748b', lineHeight: 1.6 }}>
      <span style={{ fontWeight: 600 }}>Taught in: </span>
      {links.map((l, k) => (
        <span key={l.href}>
          {k > 0 && <span aria-hidden="true" style={{ color: '#cbd5e1', margin: '0 6px' }}>·</span>}
          <Link href={l.href} style={{ color: '#2563eb', textDecoration: 'none' }}>{l.label}</Link>
        </span>
      ))}
    </nav>
  );
}
