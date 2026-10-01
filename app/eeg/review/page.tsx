import type { Metadata } from 'next';
import { ReviewPage } from '@/components/curriculum/ReviewPage';
import { EEG_MODULES } from '@/src/eeg/modules';

export const metadata: Metadata = { title: 'Review | EEG | Where Before What' };

export default function Page() {
  return <ReviewPage kind="eeg" modules={EEG_MODULES} />;
}
