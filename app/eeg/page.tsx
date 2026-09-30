import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';

export const metadata: Metadata = { title: 'EEG | Pons Asinorum' };

export default function Page() {
  return <SectionPage slug="eeg" />;
}
