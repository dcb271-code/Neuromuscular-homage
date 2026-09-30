// Citation registry for the EEG curriculum.
// Every PMID here was checked against PubMed esummary on 2026-09-30 (first author, year,
// journal, title). Cite in content as [Kane 2017](https://pubmed.ncbi.nlm.nih.gov/30214992/).
// A claim that cannot be tied to one of these (or to a linked guideline) is cut, not hedged.

export interface Source {
  key: string;
  citation: string;
  pmid?: string;
  url?: string; // for sources without a PMID
}

export const SOURCES: Record<string, Source> = {
  abend2013: { key: 'abend2013', pmid: '23794680', citation: 'Abend NS, et al. Electrographic seizures in pediatric ICU patients: cohort study of risk factors and mortality. Neurology. 2013;81(4):383-391.' },
  acgme2020: { key: 'acgme2020', url: 'https://www.acgme.org/globalassets/pdfs/milestones/childneurologymilestones.pdf', citation: 'Accreditation Council for Graduate Medical Education. Child Neurology Milestones. 2020.' },
  andre2010: { key: 'andre2010', pmid: '20510792', citation: 'André M, et al. Electroencephalography in premature and full-term infants. Developmental features and glossary. Neurophysiol Clin. 2010;40(2):59-124.' },
  benbadis2003: { key: 'benbadis2003', pmid: '12684557', citation: 'Benbadis SR, et al. Overinterpretation of EEGs and misdiagnosis of epilepsy. J Clin Neurophysiol. 2003;20(1):42-44.' },
  benbadis2008: { key: 'benbadis2008', pmid: '18264016', citation: 'Benbadis SR, et al. Errors in EEG interpretation and misdiagnosis of epilepsy. Which EEG patterns are overread? Eur Neurol. 2008;59(5):267-271.' },
  beniczky2017: { key: 'beniczky2017', pmid: '28838815', citation: 'Beniczky S, et al. Standardized computer-based organized reporting of EEG: SCORE, second version. Clin Neurophysiol. 2017;128(11):2334-2346.' },
  blumcke2019: { key: 'blumcke2019', pmid: '30892268', citation: 'Blümcke I, et al. Roadmap for a competency-based educational curriculum in epileptology: report of the Epilepsy Education Task Force of the ILAE. Epileptic Disord. 2019;21(2):129-140.' },
  borusiak2010: { key: 'borusiak2010', pmid: '20002145', citation: 'Borusiak P, et al. Prevalence of epileptiform discharges in healthy children: new data from a prospective study using digital EEG. Epilepsia. 2010;51(7):1185-1188.' },
  herman2015: { key: 'herman2015', pmid: '25626778', citation: 'Herman ST, et al. Consensus statement on continuous EEG in critically ill adults and children, part I: indications. J Clin Neurophysiol. 2015;32(2):87-95.' },
  hirschE2022: { key: 'hirschE2022', pmid: '35503716', citation: 'Hirsch E, et al. ILAE definition of the idiopathic generalized epilepsy syndromes. Epilepsia. 2022;63(6):1475-1499.' },
  hirschLJ2021: { key: 'hirschLJ2021', pmid: '33475321', citation: "Hirsch LJ, et al. American Clinical Neurophysiology Society's Standardized Critical Care EEG Terminology: 2021 version. J Clin Neurophysiol. 2021;38(1):1-29." },
  kane2017: { key: 'kane2017', pmid: '30214992', citation: 'Kane N, et al. A revised glossary of terms most commonly used by clinical electroencephalographers and updated proposal for the report format of the EEG findings. Revision 2017. Clin Neurophysiol Pract. 2017;2:170-185.' },
  katyal2024: { key: 'katyal2024', pmid: '39360148', citation: 'Katyal R, et al. Education Research: EEG education in child neurology and neurodevelopmental disabilities residencies: a survey of US and Canadian program directors. Neurol Educ. 2024;3(1):e200112.' },
  kural2020: { key: 'kural2020', pmid: '32321764', citation: 'Kural MA, et al. Criteria for defining interictal epileptiform discharges in EEG: a clinical validation study. Neurology. 2020;94(20):e2139-e2147.' },
  kuratani2016: { key: 'kuratani2016', pmid: '27482791', citation: 'Kuratani J, et al. American Clinical Neurophysiology Society Guideline 5: minimum technical standards for pediatric electroencephalography. J Clin Neurophysiol. 2016;33(4):320-323.' },
  moeller2017: { key: 'moeller2017', pmid: '30800772', citation: 'Moeller JJ, et al. A video-based introductory EEG curriculum for neurology residents and other EEG learners. MedEdPORTAL. 2017;13:10570.' },
  murray2008: { key: 'murray2008', pmid: '17626147', citation: 'Murray DM, et al. Defining the gap between electrographic seizure burden, clinical expression and staff recognition of neonatal seizures. Arch Dis Child Fetal Neonatal Ed. 2008;93(3):F187-F191.' },
  nascimento2022: { key: 'nascimento2022', pmid: '35904042', citation: 'Nascimento FA, et al. Competency-based EEG education: a list of "must-know" EEG findings for adult and child neurology residents. Epileptic Disord. 2022;24(5):979-982.' },
  nascimento2023: { key: 'nascimento2023', pmid: '39359319', citation: 'Nascimento FA, et al. Education Research: Competency-based EEG education: an online routine EEG examination for adult and child neurology residents. Neurol Educ. 2023;2(4):e200094.' },
  currentPractice: { key: 'currentPractice', citation: 'Normal pediatric EEG: neonates and children. In: Ebersole JS, et al., eds. Current Practice of Clinical Electroencephalography. Wolters Kluwer. (Edition and chapter authors not confirmed.)' },
  payne2014: { key: 'payne2014', pmid: '24595203', citation: 'Payne ET, et al. Seizure burden is independently associated with short term outcome in critically ill children. Brain. 2014;137(Pt 5):1429-1438.' },
  pressler2021: { key: 'pressler2021', pmid: '33522601', citation: 'Pressler RM, et al. The ILAE classification of seizures and the epilepsies: modification for seizures in the neonate. Epilepsia. 2021;62(3):615-628.' },
  shellhaas2011: { key: 'shellhaas2011', pmid: '22146359', citation: "Shellhaas RA, et al. The American Clinical Neurophysiology Society's guideline on continuous electroencephalography monitoring in neonates. J Clin Neurophysiol. 2011;28(6):611-617." },
  specchio2022: { key: 'specchio2022', pmid: '35503717', citation: 'Specchio N, et al. International League Against Epilepsy classification and definition of epilepsy syndromes with onset in childhood. Epilepsia. 2022;63(6):1398-1442.' },
  stlouis2016: { key: 'stlouis2016', url: 'https://www.ncbi.nlm.nih.gov/books/NBK390356/', citation: 'St. Louis EK, Frey LC, eds. Electroencephalography (EEG): An Introductory Text and Atlas of Normal and Abnormal Findings in Adults, Children, and Infants. American Epilepsy Society; 2016.' },
  tatum2016: { key: 'tatum2016', pmid: '27482790', citation: 'Tatum WO, et al. American Clinical Neurophysiology Society Guideline 7: guidelines for EEG reporting. J Clin Neurophysiol. 2016;33(4):328-332.' },
  topjian2013: { key: 'topjian2013', pmid: '23164815', citation: 'Topjian AA, et al. Electrographic status epilepticus is associated with mortality and worse short-term outcome in critically ill children. Crit Care Med. 2013;41(1):215-223.' },
  tsuchida2013: { key: 'tsuchida2013', pmid: '23545767', citation: 'Tsuchida TN, et al. American Clinical Neurophysiology Society standardized EEG terminology and categorization for the description of continuous EEG monitoring in neonates. J Clin Neurophysiol. 2013;30(2):161-173.' },
  wusthoff2025: { key: 'wusthoff2025', pmid: '39752571', citation: 'Wusthoff CJ, et al. The American Clinical Neurophysiology Society guideline on indications for continuous electroencephalography monitoring in neonates. J Clin Neurophysiol. 2025;42(1):1-11.' },
  zuberi2022: { key: 'zuberi2022', pmid: '35503712', citation: 'Zuberi SM, et al. ILAE classification and definition of epilepsy syndromes with onset in neonates and infants. Epilepsia. 2022;63(6):1349-1397.' },
};

export function sourceUrl(s: Source): string | undefined {
  return s.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/` : s.url;
}

/** PubMed link helper for content authors: pm('kane2017') → https://pubmed.ncbi.nlm.nih.gov/30214992/ */
export function pm(key: string): string {
  const s = SOURCES[key];
  if (!s) throw new Error(`Unknown source key: ${key}`);
  return sourceUrl(s) ?? '';
}
