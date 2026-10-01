import type { Metadata } from 'next';
import { ReviewPage } from '@/components/curriculum/ReviewPage';
import { LOC_MODULES } from '@/src/loc/modules';

export const metadata: Metadata = { title: 'Review | Localization | Where Before What' };

export default function Page() {
  return <ReviewPage kind="loc" modules={LOC_MODULES} />;
}
