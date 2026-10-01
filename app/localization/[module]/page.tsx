import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModulePage } from '@/components/curriculum/ModulePage';
import { LOC_MODULES, getLocModule } from '@/src/loc/modules';

export function generateStaticParams() {
  return LOC_MODULES.map(m => ({ module: m.id }));
}

export function generateMetadata({ params }: { params: { module: string } }): Metadata {
  const m = getLocModule(params.module);
  if (!m) return { title: 'Module not found' };
  return { title: `${m.number}. ${m.title} | Localization | Where Before What`, description: m.description };
}

export default function Page({ params }: { params: { module: string } }) {
  const idx = LOC_MODULES.findIndex(m => m.id === params.module);
  if (idx < 0) notFound();
  return <ModulePage kind="loc" module={LOC_MODULES[idx]} prev={LOC_MODULES[idx - 1]} next={LOC_MODULES[idx + 1]} />;
}
