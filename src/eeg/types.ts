import type { FigureOverlay } from '../figureOverlay';

// Content model for the EEG curriculum.
// Mirrors the Neurogenetics Curriculum schema (module → sections → prose, key points,
// one decision-style inline question; end-of-module quiz) so the two sites stay parallel.

export type EegTrack = string; // EEG: foundation | neonatal | abnormal | icu | longitudinal; localization: doctrine | periphery | axis | hemispheres | synthesis

export type EegTag = string; // validated per curriculum by scripts/validate-*.mjs

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
  /** Optional computed figure (widget id) rendered above the prose. */
  figure?: string;
  /** Case sections: the prose is a debrief, collapsed until the learner opens it. */
  discussion?: boolean;
  /** Tracings from the figure registry (src/eeg/figures.json), shown after the prose. */
  figures?: string[];
  /** Exam video clip ids (src/loc/videos.ts), shown after the prose. */
  videos?: string[];
  /** Links to other parts of the site (another curriculum's section, a gene or condition page,
   *  an atlas structure), shown as one small line after the key points. Internal paths only;
   *  validated by scripts/xlinks-lib.mjs. Does not count toward the section word budget. */
  related?: RelatedLink[];
}

export interface RelatedLink {
  href: string; // e.g. "/eeg/m11-critical-care/#s2" or "/neuroradiology/atlas/?age=pma40w&label=Brainstem%2C%20spans%20the%20midline"
  label: string; // plain and specific, e.g. "EEG Module 11: critical care EEG"
}

export interface EegFigure {
  id: string; // e.g. "aes-f26"
  number: number;
  title: string;
  caption: string;
  page: number;
  file: string; // public path
  width: number;
  height: number;
  credit: string;
  licence: string;
  source?: 'aes' | 'shoup';
  /** Path of the attribution file the licence links to. Defaults to the EEG attributions. */
  attribution?: string;
  /** A radiograph or scan, shown on black at a limited width. */
  dark?: boolean;
  /** Numbered pins, outline and lines drawn over the image, with a key under it. */
  overlay?: FigureOverlay;
  /** Widest the image is shown in the card, in CSS pixels. */
  maxWidth?: number;
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
  /** Optional opener shown under `why`: a short parable, a historical note, or both. */
  opener?: { parable?: string; history?: string; source?: string };
  /** Part of the shorter "core path" through the curriculum. */
  core?: boolean;
}
