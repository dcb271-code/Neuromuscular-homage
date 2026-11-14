'use client';

// One config per curriculum. Client-side, because configs carry React components (widgets),
// which cannot cross the server → client boundary as props. Pages pass only the `kind` string.

import type { ComponentType, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/src/curriculum/progress';
import { TRACKS as EEG_TRACKS } from '@/src/eeg/curriculum';
import { SOURCES as EEG_SOURCES, type Source } from '@/src/eeg/sources';
import eegFiguresJson from '@/src/eeg/figures.json';
import type { EegFigure } from '@/src/eeg/types';
import { MontageLab } from '@/components/eeg/MontageLab';
import { TraceLab, PatternViewer } from '@/components/eeg/TraceLab';
import { SpikeCriteria } from '@/components/eeg/SpikeCriteria';
import { AcnsCard } from '@/components/eeg/AcnsCard';
import { LOC_TRACKS } from '@/src/loc/curriculum';
import { LOC_SOURCES } from '@/src/loc/sources';
import { LOC_WIDGETS } from '@/components/loc/widgets';
import { ExamVideos } from '@/components/loc/ExamVideos';
import { NRAD_TRACKS } from '@/src/nrad/curriculum';
import { NRAD_SOURCES } from '@/src/nrad/sources';
import { NRAD_WIDGETS } from '@/components/nrad/widgets';
import { NRAD_FIGURES } from '@/src/nrad/ctFigures';

export type CurriculumKind = 'eeg' | 'loc' | 'nrad';

export interface CurriculumConfig {
  kind: CurriculumKind;
  basePath: string;          // '/eeg'
  crumb: string;             // breadcrumb label for the section
  storageKey: string;
  tracks: Record<string, { name: string; color: string; blurb: string }>;
  sources: Record<string, Source>;
  figures: Record<string, EegFigure>;
  /** Heading over a section's figure strip. Left out, the strip says "Tracings". */
  figureLabel?: string;
  widgets: Record<string, ComponentType<{ accent: string }>>;
  /** Renders a section's exam video clips (localization only). */
  videoStrip?: ComponentType<{ ids: string[]; accent: string }>;
  navExtra?: { href: string; label: string };
  footer: ReactNode;
}

const eegFigures: Record<string, EegFigure> = Object.fromEntries((eegFiguresJson as EegFigure[]).map(f => [f.id, f]));

export const CURRICULA: Record<CurriculumKind, CurriculumConfig> = {
  eeg: {
    kind: 'eeg',
    basePath: '/eeg',
    crumb: 'EEG',
    storageKey: STORAGE_KEYS.eeg,
    tracks: EEG_TRACKS,
    sources: EEG_SOURCES,
    figures: eegFigures,
    widgets: { 'montage-lab': MontageLab, 'trace-lab': TraceLab, 'pattern-viewer': PatternViewer, 'spike-criteria': SpikeCriteria, 'acns-card': AcnsCard },
    navExtra: { href: '/eeg/gallery', label: 'Pattern gallery' },
    footer: (
      <>Tracings are from St. Louis and Frey (eds), Electroencephalography, AES 2016, CC BY-NC-SA 4.0, or reproduced with their author&apos;s permission as stated under each figure (<a href="/eeg/ATTRIBUTIONS.md" target="_blank" rel="noopener noreferrer" className="underline">credits</a>). For education. Not for clinical decision-making; consult primary sources and your attending.</>
    ),
  },
  loc: {
    kind: 'loc',
    basePath: '/localization',
    crumb: 'Localization',
    storageKey: STORAGE_KEYS.loc,
    tracks: LOC_TRACKS,
    sources: LOC_SOURCES,
    figures: {},
    widgets: LOC_WIDGETS,
    videoStrip: ExamVideos,
    footer: (
      <>The interactive figures are calculated from our own models of the anatomy, and exam videos are from the University of Utah NeuroLogic Exam (CC BY-NC-SA); see <a href="/credits/" className="underline">credits</a>. For education. Not for clinical decision-making; consult primary sources and your attending.</>
    ),
  },
  nrad: {
    kind: 'nrad',
    basePath: '/neuroradiology',
    crumb: 'Neuroradiology',
    storageKey: STORAGE_KEYS.nrad,
    tracks: NRAD_TRACKS,
    sources: NRAD_SOURCES,
    figures: NRAD_FIGURES,
    figureLabel: 'Images',
    widgets: NRAD_WIDGETS,
    navExtra: { href: '/neuroradiology/atlas/', label: 'MRI atlas' },
    footer: (
      <>The CT images in this module are real. The slices with numbered pins come from the CQ500 dataset (CC BY-NC-SA 4.0). Its files carry no ages, and most of its patients are adults. The pediatric images are panels from open-access articles (CC BY 4.0), cropped and credited under each one. See <a href="/nrad/ATTRIBUTIONS.md" className="underline">image sources</a> and <a href="/credits/" className="underline">credits</a>. For education. Not for clinical decision-making. Consult primary sources and your attending.</>
    ),
  },
};
