/**
 * EEG module registry. To add a module: create the JSON (schema in ../types.ts), import it
 * here in curriculum order, run `node scripts/validate-eeg.mjs`. No other code changes.
 */
import type { EegModule } from '../types';

import m01 from './m01-signals.json';
import m02 from './m02-read-and-report.json';
import m03 from './m03-artifacts.json';
import m04 from './m04-normal-by-age.json';
import m05 from './m05-variants.json';
import m06 from './m06-neonatal-maturation.json';
import m07 from './m07-neonatal-abnormal.json';
import m08 from './m08-interictal.json';
import m09 from './m09-syndromes.json';
import m10 from './m10-seizures-status.json';
import m11 from './m11-critical-care.json';
import m12 from './m12-supervised-reading.json';

export const EEG_MODULES: EegModule[] = [
  m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12,
] as EegModule[];

export function getEegModule(id: string): EegModule | undefined {
  return EEG_MODULES.find(m => m.id === id);
}
