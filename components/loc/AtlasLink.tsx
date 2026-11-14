// "See it on MRI": a small link from a localization widget to the matching structure in the
// pediatric MRI atlas. Only lesion sites that map cleanly onto one labelled structure have a
// target (src/loc/atlas-links.json); everything else renders nothing.

import Link from 'next/link';
import atlas from '@/src/loc/atlas-links.json';

type Target = { age: string; label: string; name: string; ageName: string };
const TARGETS = atlas.targets as Record<string, Target>;

export const ATLAS_PATH = '/neuroradiology/atlas/';

export function atlasHref(age: string, label: string): string {
  return `${ATLAS_PATH}?age=${encodeURIComponent(age)}&label=${encodeURIComponent(label)}`;
}

export function SeeOnMri({ site, accent }: { site: string | null | undefined; accent: string }) {
  const t = site ? TARGETS[site] : undefined;
  if (!t) return null;
  return (
    <p className="mt-2 text-[12px] leading-snug">
      <Link href={atlasHref(t.age, t.label)} className="font-semibold underline-offset-2 hover:underline" style={{ color: accent }}>
        See {t.name} on MRI
      </Link>
      <span className="text-slate-400"> (atlas template {t.ageName})</span>
    </p>
  );
}
