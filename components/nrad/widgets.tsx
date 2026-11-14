'use client';

// Interactive figures for the neuroradiology curriculum, keyed by Section.figure.
import type { ComponentType } from 'react';
import { CtWindowLab } from './CtWindowLab';
import { HemorrhageSorter } from './HemorrhageSorter';

export const NRAD_WIDGETS: Record<string, ComponentType<{ accent: string }>> = {
  'ct-window-lab': CtWindowLab,
  'hemorrhage-sorter': HemorrhageSorter,
};
