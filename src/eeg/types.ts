// Content model for the EEG curriculum.
// Mirrors the Neurogenetics Curriculum schema (module → sections → prose, key points,
// one decision-style inline question; end-of-module quiz) so the two sites stay parallel.

export type EegTrack = 'foundation' | 'neonatal' | 'abnormal' | 'icu' | 'longitudinal';

export type EegTag =
  | 'EEG Fundamentals'
  | 'Normal & Variants'
  | 'Neonatal & ICU'
  | 'Abnormal & Ictal'
  | 'Clinical Decision-Making';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explanation: string; // why the right answer is right AND why the tempting wrong one is wrong
}

export interface Section {
  title: string;
  /** Markdown subset: **bold**, *italic*, "- " bullets, "1. " numbered, pipe tables,
   *  [[module-id|Display]] internal links, [Label](https://…) external citations.
   *  Blank line between paragraphs. A line that is only **Bold** becomes a sub-heading. */
  content: string;
  keyPoints: string[]; // 3–5, flaggable for review
  question?: QuizQuestion; // one decision-oriented inline question
  /** Optional computed figure rendered above the prose. */
  figure?: 'montage-lab' | 'filter-lab' | 'curriculum-map';
}

export interface Resource {
  label: string;
  url: string;
  note?: string;
}

export interface EegModule {
  id: string; // e.g. "m01-signals"; also the URL segment
  number: number; // 1–12
  title: string;
  short: string; // for cards and the map, e.g. "Signals, montages"
  description: string; // one sentence for the card
  why: string; // the one-line rationale that opens the module page
  track: EegTrack;
  tags: EegTag[];
  difficulty: Difficulty;
  duration: string; // "40 min"
  color: string; // accent hex, shared by track
  objectives: string[];
  sections: Section[];
  quiz: QuizQuestion[]; // 5–7 board-style vignettes
  resources: Resource[]; // "Read and watch": free external material, linked not copied
  signOff: string; // what a faculty reader checks before the module counts as done
  sources: string[]; // keys into src/eeg/sources.ts
}
