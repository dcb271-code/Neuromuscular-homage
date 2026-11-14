import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';
import { NradHome } from '@/components/nrad/NradHome';
import { NRAD_MODULES } from '@/src/nrad/modules';

export const metadata: Metadata = {
  title: 'Neuroradiology | Where Before What',
  description: 'Pediatric neuroimaging read against the exam: a six-module curriculum from head ultrasound and CT to MRI, vascular and fetal imaging, with an interactive brain MRI atlas from 36 weeks to 18 years.',
};

export default function Page() {
  return (
    <SectionPage slug="neuroradiology" hidePlanned>
      <NradHome modules={NRAD_MODULES} />
    </SectionPage>
  );
}
