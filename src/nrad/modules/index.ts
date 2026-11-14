/**
 * Neuroradiology module registry. Add each module JSON here in number order as it is written;
 * the planned modules are listed in src/nrad/curriculum.ts (NRAD_PLAN).
 */
import type { EegModule } from '../../eeg/types';

import m02 from './m02-ct-head.json';

export const NRAD_MODULES: EegModule[] = [
  m02,
] as EegModule[];

export function getNradModule(id: string): EegModule | undefined {
  return NRAD_MODULES.find(m => m.id === id);
}
