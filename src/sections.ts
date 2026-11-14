// Top-level learning sections of Where Before What.
// Used by the landing page, the header nav, and the section stub pages.

export type SectionStatus = 'live' | 'partial' | 'soon';

export type Section = {
  slug: string;
  name: string;
  short: string;        // compact label for the header nav
  tagline: string;      // one-line, sentence case
  blurb: string;        // 1–2 sentences for the landing card
  color: string;        // accent color
  status: SectionStatus;
  now?: string;        // what is already live, for 'partial' sections
  planned: string[];    // topic list shown on stub pages
};

export const SECTIONS: Section[] = [
  {
    slug: 'neuromuscular',
    name: 'Neuromuscular',
    short: 'Neuromuscular',
    tagline: 'Diseases, genes, inheritance',
    blurb:
      'A searchable index of neuromuscular disease built on the Washington University Neuromuscular Disease Center pages, with gene and condition pages, a daily gene, and board-style questions.',
    color: '#3b82f6',
    status: 'live',
    planned: [],
  },
  {
    slug: 'neuroradiology',
    name: 'Neuroradiology',
    short: 'Neuroradiology',
    tagline: 'Imaging, read against the exam',
    blurb:
      'Reading pediatric neuroimaging the way a neurologist needs to, with every finding traced back to the deficit it would cause. Six modules on head ultrasound, CT, MRI, vascular and fetal imaging, with an interactive brain MRI atlas from 36 weeks to 18 years.',
    color: '#7c3aed',
    status: 'partial',
    now: 'Live now: CT of the head in children, and the pediatric brain MRI atlas',
    planned: [
      'Head ultrasound',
      'MRI: how to read it, with myelination milestones',
      'MRI pathology',
      'Vascular imaging and arterial territories',
      'Fetal MRI',
    ],
  },
  {
    slug: 'localization',
    name: 'Localization & Neuro Exam',
    short: 'Localization',
    tagline: 'From findings to lesion',
    blurb:
      'Working out where the problem is before deciding what it is, the habit this site is named for. Twelve interactive modules on localization and the neurologic examination in children, from telling upper from lower motor neuron weakness to building a differential.',
    color: '#0d9488',
    status: 'live',
    planned: [],
  },
  {
    slug: 'eeg',
    name: 'EEG',
    short: 'EEG',
    tagline: 'Reading pediatric EEG',
    blurb:
      'A pediatric EEG reading curriculum: twelve self-paced modules from electrodes and montages to reading a neonatal or PICU record and writing the report, with decision questions, quizzes and faculty sign-offs.',
    color: '#d97706',
    status: 'live',
    planned: [
      'A waveform viewer with openly licensed tracings',
      'Filter and sampling lab',
      'Pattern gallery in flashcard style',
    ],
  },
];

export function getSection(slug: string): Section {
  const s = SECTIONS.find(x => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}
