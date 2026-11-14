import type { Metadata } from 'next';
import Link from 'next/link';
import SectionPage from '@/components/SectionPage';
import AtlasViewer from '@/components/AtlasViewer';

export const metadata: Metadata = {
  title: 'MRI atlas | Neuroradiology | Where Before What',
  description: 'Interactive pediatric brain MRI atlas from 36 weeks postmenstrual age to 18 years, with T1, T2 and structure labels.',
};

export default function Page() {
  return (
    <SectionPage slug="neuroradiology" hidePlanned>
      <p className="text-[13px] text-slate-500 mb-4">
        <Link href="/neuroradiology" className="font-semibold no-underline hover:underline" style={{ color: '#7c3aed' }}>Neuroradiology curriculum</Link>
        <span className="mx-2 text-slate-300">·</span>Pediatric brain MRI atlas
      </p>
      <AtlasViewer />
    </SectionPage>
  );
}
