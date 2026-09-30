import type { Metadata } from 'next';
import SectionStub from '@/components/SectionStub';

export const metadata: Metadata = { title: 'Neuroradiology | Pons Asinorum' };

export default function Page() {
  return <SectionStub slug="neuroradiology" />;
}
