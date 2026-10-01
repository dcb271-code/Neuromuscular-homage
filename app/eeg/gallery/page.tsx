import type { Metadata } from 'next';
import { GalleryPage } from '@/components/eeg/GalleryPage';
import { EEG_MODULES } from '@/src/eeg/modules';
import figures from '@/src/eeg/figures.json';
import type { EegFigure } from '@/src/eeg/types';

export const metadata: Metadata = {
  title: 'Pattern gallery | EEG | Where Before What',
  description: 'EEG tracings from the AES introductory atlas, as a browsable gallery and a name-the-pattern quiz.',
};

export default function Page() {
  return <GalleryPage figures={figures as EegFigure[]} modules={EEG_MODULES} />;
}
