import type { Metadata } from 'next';
import SectionStub from '@/components/SectionStub';

export const metadata: Metadata = { title: 'EEG | Pons Asinorum' };

export default function Page() {
  return <SectionStub slug="eeg" />;
}
