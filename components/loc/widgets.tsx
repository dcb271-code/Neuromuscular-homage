'use client';

// Interactive figures for the localization curriculum, keyed by Section.figure.
import type { ComponentType } from 'react';
import { Localizer } from './Localizer';
import { CordSim } from './CordSim';
import { BrainstemSim } from './BrainstemSim';
import { VisualFields } from './VisualFields';
import { CasePlayer } from './CasePlayer';
import { ComaLevels, ExamOrder, GaitByLevel, ReflexTimeline, RootNerve, WhereWhen } from './SmallWidgets';
import { CASES } from '@/src/loc/cases';
import { DermatomeLevel, DermatomeMap } from './DermatomeMap';
import { AphasiaSwitches, LesionLadder, LesionVoices, MapSort, Pretest, VertigoSorter } from './DoctrineWidgets';

type W = ComponentType<{ accent: string }>;

const caseWidgets: Record<string, W> = Object.fromEntries(
  CASES.map(c => {
    const Comp: W = ({ accent }) => <CasePlayer accent={accent} c={c} />;
    Comp.displayName = `Case_${c.id}`;
    return [`case:${c.id}`, Comp];
  }),
);

const variant = (v: 'intro' | 'full' | 'floppy' | 'motor-unit'): W => {
  const Comp: W = ({ accent }) => <Localizer accent={accent} variant={v} />;
  Comp.displayName = `Localizer_${v}`;
  return Comp;
};

export const LOC_WIDGETS: Record<string, W> = {
  localizer: variant('full'),
  'localizer-intro': variant('intro'),
  'localizer-floppy': variant('floppy'),
  'localizer-motor-unit': variant('motor-unit'),
  'exam-order': ExamOrder,
  'reflex-timeline': ReflexTimeline,
  'root-nerve': RootNerve,
  'cord-sim': CordSim,
  'brainstem-sim': BrainstemSim,
  'gait-by-level': GaitByLevel,
  'visual-fields': VisualFields,
  'coma-levels': ComaLevels,
  'where-when': WhereWhen,
  'lesion-voices': LesionVoices,
  pretest: Pretest,
  'lesion-ladder': LesionLadder,
  'map-sort': MapSort,
  'aphasia-switches': AphasiaSwitches,
  'vertigo-sorter': VertigoSorter,
  'dermatome-map': DermatomeMap,
  'dermatome-level': DermatomeLevel,
  ...caseWidgets,
};
