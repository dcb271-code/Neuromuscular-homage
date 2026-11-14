import type { Metadata } from 'next';
import { ReviewPage } from '@/components/curriculum/ReviewPage';
import { NRAD_MODULES } from '@/src/nrad/modules';

export const metadata: Metadata = { title: 'Review | Neuroradiology | Where Before What' };

export default function Page() {
  return <ReviewPage kind="nrad" modules={NRAD_MODULES} />;
}
