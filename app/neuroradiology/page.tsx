import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';
import AtlasViewer from '@/components/AtlasViewer';

export const metadata: Metadata = {
  title: 'Neuroradiology | Where Before What',
  description: 'Interactive pediatric brain MRI atlas from 36 weeks postmenstrual age to 18 years, with T1, T2 and neonatal structure labels.',
};

export default function Page() {
  return (
    <SectionPage slug="neuroradiology">
      <AtlasViewer />
    </SectionPage>
  );
}
