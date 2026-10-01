import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';
import { CurriculumHome } from '@/components/eeg/CurriculumHome';
import { EEG_MODULES } from '@/src/eeg/modules';

export const metadata: Metadata = {
  title: 'EEG | Where Before What',
  description: 'A pediatric EEG reading curriculum: twelve self-paced modules from electrodes and montages to reading a neonatal or PICU record and writing the report.',
};

export default function Page() {
  return (
    <SectionPage slug="eeg" hidePlanned>
      <CurriculumHome modules={EEG_MODULES} />
    </SectionPage>
  );
}
