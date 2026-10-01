import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';
import { LocHome } from '@/components/loc/LocHome';
import { LOC_MODULES } from '@/src/loc/modules';

export const metadata: Metadata = {
  title: 'Localization & the Neuro Exam | Where Before What',
  description: 'Where before what: twelve interactive modules on localization and the neurologic examination in children, from the first fork between upper and lower motor neuron to building the differential.',
};

export default function Page() {
  return (
    <SectionPage slug="localization" hidePlanned>
      <LocHome modules={LOC_MODULES} />
    </SectionPage>
  );
}
