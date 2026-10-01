import type { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';

export const metadata: Metadata = { title: 'Localization & Neuro Exam | Where Before What' };

export default function Page() {
  return <SectionPage slug="localization" />;
}
