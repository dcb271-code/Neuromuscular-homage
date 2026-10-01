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
  ...caseWidgets,
};
