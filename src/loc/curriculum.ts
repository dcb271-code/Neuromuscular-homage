// Localization curriculum: tracks and curriculum-level metadata (docs/localization/design-spec.md).

export const LOC_TRACKS: Record<string, { name: string; color: string; blurb: string }> = {
  doctrine: { name: 'The doctrine', color: '#0d9488', blurb: 'Modules 1 to 3 make the case for localizing before diagnosing, treat the examination as a set of experiments, and teach the first and most useful split, between upper and lower motor neuron.' },
  periphery: { name: 'The periphery', color: '#2563eb', blurb: 'Modules 4 and 5: the motor unit, and the maps of roots, plexus and nerves.' },
  axis: { name: 'The neuraxis', color: '#7c3aed', blurb: 'Modules 6 to 8: the spinal cord, the brainstem, and the loops of cerebellum and basal ganglia.' },
  hemispheres: { name: 'The hemispheres', color: '#4f46e5', blurb: 'Modules 9 and 10: the cortex and visual pathway, and what to do when the lesion is everywhere.' },
  synthesis: { name: 'Synthesis', color: '#475569', blurb: 'Modules 11 and 12 turn an address and a time course into a differential, and then put the method to work on six cases you examine yourself.' },
};

export const LOC_RESOURCES = [
  { name: 'PediNeuroLogic Exam (University of Utah)', url: 'https://neurologicexam.med.utah.edu/pediatric/html/home_exam.html', note: 'Videos of the normal exam from newborn to 2½ years, with descriptions. Free; videos CC BY-NC-SA.' },
  { name: 'NeuroLogic Exam (University of Utah)', url: 'https://neurologicexam.med.utah.edu/adult/html/home_exam.html', note: 'The adult and older-child exam, element by element, with normal and abnormal videos.' },
];

export const LOC_TEXTS = [
  'Brazis PW, Masdeu JC, Biller J. Localization in Clinical Neurology. 6th ed. 2011.',
  'Pearl PL, Emsellem HA. Neuro-Logic: A Primer on Localization. 2014.',
  "Biller J, Gruener G, Brazis PW. DeMyer's The Neurologic Examination: A Programmed Text. 6th ed.",
  'Fisch A. Neuroanatomy: Draw It to Know It. 2nd ed. 2012.',
  'Arslan O. Neuroanatomical Basis of Clinical Neurology. 2nd ed. 2014.',
  'Neurological Clinical Examination: A Concise Guide. 3rd ed. 2012.',
];
