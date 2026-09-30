import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModulePage } from '@/components/eeg/ModulePage';
import { EEG_MODULES, getEegModule } from '@/src/eeg/modules';

export function generateStaticParams() {
  return EEG_MODULES.map(m => ({ module: m.id }));
}

export function generateMetadata({ params }: { params: { module: string } }): Metadata {
  const m = getEegModule(params.module);
  if (!m) return { title: 'Module not found' };
  return { title: `${m.number}. ${m.title} | EEG | Pons Asinorum`, description: m.description };
}

export default function Page({ params }: { params: { module: string } }) {
  const idx = EEG_MODULES.findIndex(m => m.id === params.module);
  if (idx < 0) notFound();
  return <ModulePage module={EEG_MODULES[idx]} prev={EEG_MODULES[idx - 1]} next={EEG_MODULES[idx + 1]} />;
}
