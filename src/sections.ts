// Top-level learning sections of Pons Asinorum.
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
    tagline: 'Pattern recognition on MRI and CT',
    blurb:
      'Reading neuroimaging the way a neurologist needs to: sequences, anatomy, and the classic patterns behind stroke, demyelination, tumors, infection, and pediatric disorders.',
    color: '#7c3aed',
    status: 'partial',
    now: 'Live now: an interactive pediatric brain MRI atlas, 36 weeks to 18 years',
    planned: [
      'Myelination milestones, age by age',
      'MRI sequences and what each one shows',
      'Stroke territories and time course',
      'Demyelinating and inflammatory patterns',
      'Leukodystrophies and metabolic imaging',
      'Spine and neuromuscular imaging',
    ],
  },
  {
    slug: 'localization',
    name: 'Localization & Neuro Exam',
    short: 'Localization',
    tagline: 'From findings to lesion',
    blurb:
      'The neurological exam as a localization tool: what each finding means, how findings combine, and the classic syndromes at every level from cortex to muscle.',
    color: '#0d9488',
    status: 'soon',
    planned: [
      'The screening exam, step by step',
      'Upper versus lower motor neuron signs',
      'Brainstem syndromes and cranial nerves',
      'Spinal cord levels and syndromes',
      'Root, plexus, nerve, junction, muscle',
    ],
  },
  {
    slug: 'eeg',
    name: 'EEG',
    short: 'EEG',
    tagline: 'Reading the rhythms',
    blurb:
      'Normal rhythms, artifacts, benign variants, and epileptiform patterns, with an emphasis on the pediatric EEG across development.',
    color: '#d97706',
    status: 'soon',
    planned: [
      'Normal awake and sleep EEG by age',
      'Artifacts and benign variants',
      'Interictal epileptiform discharges',
      'Epilepsy syndromes and their EEG signatures',
      'Neonatal EEG and aEEG basics',
    ],
  },
];

export function getSection(slug: string): Section {
  const s = SECTIONS.find(x => x.slug === slug);
  if (!s) throw new Error(`Unknown section: ${slug}`);
  return s;
}
