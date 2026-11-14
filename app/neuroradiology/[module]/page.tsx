import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModulePage } from '@/components/curriculum/ModulePage';
import { NRAD_MODULES, getNradModule } from '@/src/nrad/modules';

export function generateStaticParams() {
  return NRAD_MODULES.map(m => ({ module: m.id }));
}

export function generateMetadata({ params }: { params: { module: string } }): Metadata {
  const m = getNradModule(params.module);
  if (!m) return { title: 'Module not found' };
  return { title: `${m.number}. ${m.title} | Neuroradiology | Where Before What`, description: m.description };
}

export default function Page({ params }: { params: { module: string } }) {
  const idx = NRAD_MODULES.findIndex(m => m.id === params.module);
  if (idx < 0) notFound();
  return <ModulePage kind="nrad" module={NRAD_MODULES[idx]} prev={NRAD_MODULES[idx - 1]} next={NRAD_MODULES[idx + 1]} />;
}
