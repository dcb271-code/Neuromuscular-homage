// scripts/build-questions.js
// Patches resources onto existing 20 questions and appends 80 new ones.
// Run with: node scripts/build-questions.js

const fs = require('fs');
const filePath = 'src/data/daily.json';
const daily = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ── Resources for the original 20 questions (index-matched) ──────────────────
const existingResources = [
  { label: "GeneReviews: Duchenne & Becker MD",           url: "https://www.ncbi.nlm.nih.gov/books/NBK1119/" },
  { label: "GeneReviews: Charcot-Marie-Tooth Neuropathies", url: "https://www.ncbi.nlm.nih.gov/books/NBK1358/" },
  { label: "GeneReviews: Spinal Muscular Atrophy",         url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/" },
  { label: "NORD: Limb-Girdle Muscular Dystrophies",       url: "https://rarediseases.org/rare-diseases/limb-girdle-muscular-dystrophies/" },
  { label: "NORD: Malignant Hyperthermia",                 url: "https://rarediseases.org/rare-diseases/malignant-hyperthermia/" },
  { label: "NORD: Dysferlinopathy",                        url: "https://rarediseases.org/rare-diseases/dysferlinopathy/" },
  { label: "NORD: Inclusion Body Myositis",                url: "https://rarediseases.org/rare-diseases/inclusion-body-myositis/" },
  { label: "GeneReviews: Emery-Dreifuss MD",               url: "https://www.ncbi.nlm.nih.gov/books/NBK1218/" },
  { label: "GeneReviews: X-Linked Myotubular Myopathy",   url: "https://www.ncbi.nlm.nih.gov/books/NBK1398/" },
  { label: "NORD: Amyotrophic Lateral Sclerosis",          url: "https://rarediseases.org/rare-diseases/amyotrophic-lateral-sclerosis/" },
  { label: "NORD: Giant Axonal Neuropathy",                url: "https://rarediseases.org/rare-diseases/giant-axonal-neuropathy/" },
  { label: "NORD: Antisynthetase Syndrome",                url: "https://rarediseases.org/rare-diseases/antisynthetase-syndrome/" },
  { label: "GeneReviews: McArdle Disease (GSD Type V)",    url: "https://www.ncbi.nlm.nih.gov/books/NBK1393/" },
  { label: "NORD: Inclusion Body Myositis",                url: "https://rarediseases.org/rare-diseases/inclusion-body-myositis/" },
  { label: "GeneReviews: RYR1-Related Myopathies",         url: "https://www.ncbi.nlm.nih.gov/books/NBK1316/" },
  { label: "GeneReviews: MELAS",                           url: "https://www.ncbi.nlm.nih.gov/books/NBK1233/" },
  { label: "NORD: Myasthenia Gravis",                      url: "https://rarediseases.org/rare-diseases/myasthenia-gravis/" },
  { label: "GeneReviews: Spinal Muscular Atrophy",         url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/" },
  { label: "GeneReviews: Pompe Disease",                   url: "https://www.ncbi.nlm.nih.gov/books/NBK1261/" },
  { label: "NORD: Hypokalemic Periodic Paralysis",         url: "https://rarediseases.org/rare-diseases/hypokalemic-periodic-paralysis/" },
];

daily.questions = daily.questions.map((q, i) => ({ ...q, resource: existingResources[i] }));

// ── 80 new questions ──────────────────────────────────────────────────────────
const newQuestions = [

  // ── Muscular Dystrophies ───────────────────────────────────────────────────
  {
    question: "A 16-year-old boy has bilateral facial weakness (cannot close eyes tightly, puff cheeks, or whistle), bilateral foot drop, and right-sided scapular winging. His father and paternal uncle have similar, milder findings. Genetic testing shows a contracted D4Z4 repeat array of 6 units on chromosome 4q35 with a permissive 4A haplotype. What is the diagnosis?",
    choices: [
      "Facioscapulohumeral muscular dystrophy type 1 (FSHD1)",
      "Emery-Dreifuss muscular dystrophy (LMNA)",
      "LGMD R1 (calpainopathy)",
      "Becker muscular dystrophy"
    ],
    answer: 0,
    explanation: "FSHD1 is caused by contraction of the D4Z4 macrosatellite repeat on chromosome 4q35 to ≤10 units (normal >10), combined with a permissive 4A haplotype allowing expression of DUX4. The result is aberrant DUX4 expression in muscle, causing apoptosis and progressive facioscapulohumeral weakness with characteristic asymmetry. Facial involvement, scapular winging, and foot drop in an AD family pattern are classic.",
    resource: { label: "GeneReviews: Facioscapulohumeral MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1443/" }
  },
  {
    question: "A 50-year-old man of French-Canadian descent presents with progressive ptosis, dysphagia (especially solids), and proximal arm weakness over 8 years. His mother required a feeding tube at age 55. Muscle biopsy shows intranuclear filamentous inclusions on electron microscopy. Which gene is mutated?",
    choices: [
      "DMPK (CTG repeat expansion)",
      "PABPN1 (GCG repeat expansion)",
      "FXN (GAA repeat expansion)",
      "HTT (CAG repeat expansion)"
    ],
    answer: 1,
    explanation: "Oculopharyngeal muscular dystrophy (OPMD) is caused by a GCG trinucleotide repeat expansion in PABPN1, typically from the normal 6 repeats to 8–13 repeats. It presents in the 5th–6th decade with ptosis and dysphagia as the cardinal features, followed by proximal limb weakness. Intranuclear tubulofilamentous inclusions on EM are pathognomonic. The disease is enriched in French-Canadian, Bukharan Jewish, and Iberian populations.",
    resource: { label: "NORD: Oculopharyngeal Muscular Dystrophy", url: "https://rarediseases.org/rare-diseases/oculopharyngeal-muscular-dystrophy/" }
  },
  {
    question: "A 14-year-old boy has early contractures of both elbows and Achilles tendons, followed by slowly progressive humeroperoneal weakness. ECG shows first-degree AV block. His older brother has a pacemaker. Emerin protein is absent on Western blot of peripheral blood lymphocytes. What is the inheritance pattern and gene?",
    choices: [
      "Autosomal dominant — LMNA",
      "X-linked recessive — EMD",
      "Autosomal recessive — CAPN3",
      "X-linked dominant — FLNA"
    ],
    answer: 1,
    explanation: "Absent emerin protein (tested from peripheral blood lymphocytes or skin fibroblasts) confirms X-linked Emery-Dreifuss MD due to EMD mutations. The EDMD triad is: (1) early joint contractures, (2) humeroperoneal weakness, (3) cardiac conduction disease. X-linked inheritance is confirmed by the affected brother pattern. LMNA causes autosomal dominant EDMD2 with the same clinical triad but emerin is present.",
    resource: { label: "GeneReviews: Emery-Dreifuss MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1218/" }
  },
  {
    question: "A 2-year-old boy has severe hypotonia from birth, cannot sit independently, and MRI of the brain shows bilateral periventricular white matter T2 hyperintensities. CK is 400 IU/L. Nerve conduction studies show demyelinating changes. Which gene is most likely responsible?",
    choices: [
      "DMD (Dystrophin)",
      "LAMA2 (Merosin / Laminin α2)",
      "COL6A1 (Collagen VI)",
      "SEPN1 (Selenoprotein N)"
    ],
    answer: 1,
    explanation: "Merosin-deficient congenital muscular dystrophy (MDC1A/LAMA2-CMD) classically combines: severe early hypotonia, inability to achieve independent walking in most, markedly elevated CK, white matter changes on brain MRI (reflecting laminin α2 absence in CNS vasculature), and peripheral nerve demyelination on NCS. COL6 mutations cause Bethlem/Ullrich, with contractures and near-normal CK. SEPN1 causes rigid spine syndrome without white matter changes.",
    resource: { label: "GeneReviews: LAMA2-Related MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1540/" }
  },
  {
    question: "An 18-year-old woman has proximal limb weakness and CK 8,000 IU/L. She also has dilated cardiomyopathy requiring a cardiac transplant evaluation. Muscle biopsy shows dystrophic changes with reduced alpha-dystroglycan glycosylation. Testing confirms FKRP mutations. What is the LGMD subtype?",
    choices: [
      "LGMD R1 (CAPN3 — calpainopathy)",
      "LGMD R9 (FKRP — fukutin-related proteinopathy)",
      "LGMD R2 (DYSF — dysferlinopathy)",
      "LGMD R6 (SGDD — delta-sarcoglycanopathy)"
    ],
    answer: 1,
    explanation: "LGMD R9 (previously LGMD2I) is caused by FKRP mutations and is one of the most common LGMDs in Northern European populations. Cardiac involvement (dilated cardiomyopathy) occurs in ~30% and can precede or dominate the muscle phenotype. FKRP encodes a glycosyltransferase; loss reduces alpha-dystroglycan glycosylation, reducing its binding to extracellular matrix. The milder phenotype is the most common LGMD2I; the severe end overlaps Walker-Warburg spectrum.",
    resource: { label: "NORD: Limb-Girdle Muscular Dystrophies", url: "https://rarediseases.org/rare-diseases/limb-girdle-muscular-dystrophies/" }
  },
  {
    question: "A 10-year-old boy has proximal muscle contractures at the fingers, elbows, and ankles, with mild proximal weakness. He has 'follicular hyperkeratosis' skin changes over his knees. CK is 300 IU/L. His father has milder, similar contractures. What is the diagnosis?",
    choices: [
      "Emery-Dreifuss MD (EMD/LMNA)",
      "Bethlem myopathy (COL6A1/A2/A3)",
      "Ullrich congenital muscular dystrophy (COL6A1/A2/A3)",
      "Rigid spine syndrome (SELENON)"
    ],
    answer: 1,
    explanation: "Bethlem myopathy is caused by dominant COL6A mutations and features the distinctive combination of proximal weakness, contractures (particularly of fingers, elbows, wrists, and ankles), and follicular hyperkeratosis over bony prominences. CK is mildly elevated or normal. Prognosis is generally good — most remain ambulatory. Ullrich CMD is the severe recessive allelic condition (COL6, biallelic) with hyperlaxity distally and contractures proximally, often requiring wheelchair and ventilatory support.",
    resource: { label: "GeneReviews: Collagen VI-Related Dystrophies", url: "https://www.ncbi.nlm.nih.gov/books/NBK1435/" }
  },
  {
    question: "A 7-year-old boy with Duchenne MD is started on deflazacort. His parents ask how this differs from prednisone. Which statement is most accurate?",
    choices: [
      "Deflazacort has equivalent weight gain and similar cataract risk compared to prednisone",
      "Deflazacort causes less weight gain than prednisone but has a higher risk of asymptomatic cataracts",
      "Deflazacort is superior to prednisone in preserving ambulation by 5 additional years",
      "Deflazacort is preferred because it does not cause adrenal suppression"
    ],
    answer: 1,
    explanation: "Deflazacort is FDA-approved specifically for DMD (2017) and is associated with less weight gain and cushingoid features than prednisone/prednisolone — a significant benefit in boys who already face obesity risks. However, deflazacort carries a meaningfully higher incidence of asymptomatic posterior subcapsular cataracts (requiring annual ophthalmology screening). Both extend ambulation by approximately 2–3 years. Neither eliminates adrenal suppression with chronic use.",
    resource: { label: "GeneReviews: Duchenne & Becker MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1119/" }
  },
  {
    question: "A 30-year-old man with Becker MD develops progressive exertional dyspnea. Echo shows LVEF of 32% with diffuse hypokinesis. He walks independently with mild proximal weakness. What is the recommended approach to cardiac management?",
    choices: [
      "Await symptoms before starting therapy; echo annually",
      "Start ACE inhibitor and beta-blocker regardless of symptoms; consider ICD if LVEF remains <35%",
      "Cardiac transplant evaluation only if LVEF <20%",
      "Corticosteroids will reverse the cardiomyopathy"
    ],
    answer: 1,
    explanation: "Dilated cardiomyopathy in DMD/BMD follows a predictable course; current guidelines recommend starting ACE inhibitors (or ARBs) by age 10 in DMD, and for BMD as soon as cardiomyopathy is detected — even before symptoms. Beta-blockers are added for established LV dysfunction. ICD consideration follows standard heart failure criteria (LVEF <35%). Corticosteroids do not reverse established DMD cardiomyopathy. Annual cardiac surveillance (echo or MRI) is standard from age 10.",
    resource: { label: "GeneReviews: Duchenne & Becker MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1119/" }
  },
  {
    question: "A 26-year-old woman is found to have a CTG repeat of 900 in DMPK. She has mild grip myotonia, minimal distal weakness, cataracts, and daytime hypersomnolence. Her mother has 200 repeats with mild symptoms. What process explains the mother-to-daughter repeat expansion?",
    choices: [
      "De novo repeat expansion from a normal allele",
      "Anticipation — intergenerational repeat expansion during maternal meiosis",
      "X-inactivation skewing",
      "Epigenetic silencing of the DMPK promoter"
    ],
    answer: 1,
    explanation: "Myotonic dystrophy type 1 (DM1) demonstrates anticipation: the CTG repeat tends to expand further with each generation, particularly with maternal transmission. Maternal meiosis is especially prone to expansion, which is why congenital DM1 (>1,000 repeats, most severe) is almost exclusively transmitted from mothers. This expansion correlates with increasing disease severity and earlier onset across generations. The mother's 200-repeat allele expanded to 900 in the daughter, causing more significant disease.",
    resource: { label: "GeneReviews: Myotonic Dystrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1431/" }
  },
  {
    question: "A 45-year-old man presents with proximal weakness, grip myotonia, and multisystem involvement. Unlike DM1, he has predominantly proximal (not distal) weakness, no facial weakness, and no congenital form. Genetic testing shows CCTG repeat expansion in intron 1 of CNBP. What is the diagnosis?",
    choices: [
      "Myotonic dystrophy type 1 (DM1 — DMPK CTG)",
      "Myotonic dystrophy type 2 (DM2 — CNBP CCTG)",
      "Myotonia congenita (CLCN1)",
      "Proximal myotonic myopathy (PROMM, separate entity)"
    ],
    answer: 1,
    explanation: "DM2 (myotonic dystrophy type 2) is caused by a CCTG repeat expansion in intron 1 of CNBP (ZNF9). Unlike DM1, weakness is proximal > distal, facial involvement is mild or absent, there is no congenital form, and the course is generally milder. Both share multisystem involvement (cataracts, cardiac arrhythmia, insulin resistance). The repeat expansion in DM2 is far larger than in DM1 (thousands vs. hundreds of repeats) but antisense selection makes sequencing-based sizing unreliable.",
    resource: { label: "GeneReviews: Myotonic Dystrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1431/" }
  },

  // ── Congenital Myopathies ──────────────────────────────────────────────────
  {
    question: "A full-term neonate has profound axial hypotonia, facial weakness, high-arched palate, and poor suck. CK is 60 IU/L. Muscle biopsy shows type 1 fiber predominance and numerous rod-shaped inclusions on Gomori trichrome stain (red-purple rods against blue-green background). What is the most common gene mutated in this condition?",
    choices: [
      "ACTA1 (actin alpha 1)",
      "NEB (nebulin)",
      "RYR1 (ryanodine receptor 1)",
      "MTM1 (myotubularin)"
    ],
    answer: 1,
    explanation: "Nemaline myopathy is characterized by nemaline rods (Z-disc-derived protein aggregates) on Gomori trichrome stain, representing a heterogeneous group of myopathies. NEB mutations (encoding nebulin) are the most common cause, accounting for ~50% of cases, usually in a severe neonatal or typical congenital form with autosomal recessive inheritance. ACTA1 mutations cause ~25% of nemaline myopathy and tend toward more severe or neonatal lethal phenotypes. MTM1 causes centronuclear, not nemaline, myopathy.",
    resource: { label: "GeneReviews: Nemaline Myopathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1310/" }
  },
  {
    question: "A 3-year-old girl has mild hypotonia, proximal weakness, and rigid spine (limited neck flexion and thoracolumbar flexion). Respiratory function shows a forced vital capacity (FVC) disproportionately low relative to limb weakness. Muscle biopsy shows multiple small cores scattered across fibers. Which gene is most likely mutated?",
    choices: [
      "RYR1 (large single central core)",
      "SELENON/SEPN1 (multiminicore + rigid spine)",
      "NEB (nemaline rods)",
      "MTM1 (central nuclei)"
    ],
    answer: 1,
    explanation: "Rigid spine muscular dystrophy (RSMD1) / SELENON-related myopathy is characterized by the combination of early rigid spine (limited spinal flexion), marked early respiratory involvement out of proportion to limb weakness, and multiminicore pattern on biopsy. SELENON encodes selenoprotein N, an ER-resident protein involved in redox regulation. Early initiation of nocturnal NIV is critical, as respiratory failure can precede significant limb weakness. RYR1 multiminicore disease exists but rigid spine is less prominent.",
    resource: { label: "NORD: Rigid Spine Muscular Dystrophy", url: "https://rarediseases.org/rare-diseases/rigid-spine-muscular-dystrophy-1/" }
  },
  {
    question: "A male neonate is born via C-section for fetal distress after reduced fetal movements throughout pregnancy. He requires immediate intubation. He has marked hypotonia, ophthalmoplegia, and a characteristic 'inverted V' open mouth. CK is 30 IU/L. Muscle biopsy shows fibers with centrally placed nuclei and a halo of myofibril-free sarcoplasm. His mother has mild proximal weakness. What should be tested in the mother?",
    choices: [
      "Serum creatine kinase and acetylcholine receptor antibodies",
      "MTM1 gene mutation carrier status",
      "Repeat-primed PCR for CTG expansion in DMPK",
      "Electromyography for myotonic discharges"
    ],
    answer: 2,
    explanation: "This neonate has congenital myotonic dystrophy (DM1), the most severe form, transmitted almost exclusively from an affected mother. The mother's mild symptoms (grip myotonia, mild distal weakness) represent adult-onset DM1; maternal meiotic repeat expansion produced congenital DM1 (CTG >1,000) in the baby. Repeat-primed PCR for DMPK CTG expansion should be performed in the mother. XLMTM (MTM1) could cause similar biopsy findings but is X-linked and the mother would need carrier testing differently — and importantly, myotonic discharges in the mother would help confirm DM1.",
    resource: { label: "GeneReviews: Myotonic Dystrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1431/" }
  },
  {
    question: "A 5-year-old boy develops rigidity of all muscles and hyperthermia during halothane induction for tonsillectomy. His father had a 'reaction' to anesthesia 10 years ago. He has no weakness at baseline. Which of the following congenital myopathies carries the highest risk of malignant hyperthermia susceptibility?",
    choices: [
      "Nemaline myopathy (NEB mutations)",
      "Central core disease (RYR1 dominant gain-of-function mutations)",
      "X-linked myotubular myopathy (MTM1)",
      "SELENON-related myopathy"
    ],
    answer: 1,
    explanation: "Central core disease (CCD) caused by dominant RYR1 gain-of-function mutations is strongly linked to malignant hyperthermia susceptibility (MHS). The same RYR1 channel dysfunction that causes pathological Ca²⁺ release under volatile anesthetics (MH crisis) produces the structural myopathy. All patients with RYR1 mutations — even those with minimal symptoms — should be considered MH-susceptible and receive a non-triggering anesthetic. Non-triggering agents include propofol, ketamine, nitrous oxide, and neuromuscular blockers (non-depolarizing).",
    resource: { label: "GeneReviews: RYR1-Related Myopathies", url: "https://www.ncbi.nlm.nih.gov/books/NBK1316/" }
  },
  {
    question: "A 15-year-old boy with known X-linked myotubular myopathy (MTM1 mutation) is stable on home mechanical ventilation. His parents ask about gene therapy prospects. Which statement best represents the current status?",
    choices: [
      "AAV-MTM1 gene therapy (resamirigene bilparvovec) showed early efficacy but was paused due to serious hepatotoxicity in high-weight patients",
      "Gene therapy is approved for XLMTM and has been commercially available since 2022",
      "No gene therapy trials have been attempted for XLMTM",
      "AAV gene therapy is contraindicated because MTM1 is on the X chromosome"
    ],
    answer: 0,
    explanation: "The AT132 (resamirigene bilparvovec) AAV8-MTM1 gene therapy trial showed remarkable early efficacy — several ventilator-dependent infants achieved independent breathing. However, the trial was paused in 2021 after three deaths from severe hepatotoxicity, occurring particularly in older/heavier boys, likely related to dose and pre-existing liver disease. Being X-linked does not prevent AAV therapy (AAV infects both sexes). This case illustrates the critical importance of monitoring for hepatotoxicity in AAV gene therapy trials.",
    resource: { label: "GeneReviews: X-Linked Myotubular Myopathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1398/" }
  },

  // ── SMA and Motor Neuron Disease ──────────────────────────────────────────
  {
    question: "A 4-month-old girl is referred after newborn screening identified 0 copies of SMN1 by MLPA. She has normal tone and is meeting motor milestones. She has 4 copies of SMN2. Without treatment, what is the most likely natural history, and what is the recommended first-line approach?",
    choices: [
      "She will develop SMA type 1; treat with nusinersen intrathecally within 6 months",
      "She is likely pre-symptomatic SMA type 3–4; treat immediately with onasemnogene abeparvovec or nusinersen before symptom onset",
      "With 4 SMN2 copies she may remain asymptomatic; observe without treatment",
      "She has SMA type 2; begin risdiplam orally at diagnosis and defer gene therapy"
    ],
    answer: 1,
    explanation: "4 SMN2 copies predicts SMA type 3–4 phenotype (later onset, milder), but WITHOUT treatment, weakness and motor regression will occur. Pre-symptomatic treatment dramatically improves outcomes across all SMA types — children treated before symptoms achieve near-normal development. Onasemnogene abeparvovec (gene therapy, single IV dose) is preferred for children <2 years. Nusinersen or risdiplam are alternatives. Observation without treatment is not recommended given the transformative effect of early intervention.",
    resource: { label: "GeneReviews: Spinal Muscular Atrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/" }
  },
  {
    question: "A 52-year-old man presents with slowly progressive bulbar weakness, gynecomastia, and infertility. Examination shows facial and tongue fasciculations, perioral tremor, and mild proximal limb weakness with areflexia. Serum CK is 450 IU/L. What is the diagnosis and inheritance?",
    choices: [
      "ALS with bulbar onset — autosomal dominant (SOD1)",
      "Kennedy disease (SBMA) — X-linked recessive (AR CAG expansion)",
      "Oculopharyngeal MD — autosomal dominant (PABPN1)",
      "Myasthenia gravis with anti-MuSK antibodies"
    ],
    answer: 1,
    explanation: "Kennedy disease (spinal and bulbar muscular atrophy, SBMA) is caused by CAG repeat expansion in the androgen receptor (AR) gene — X-linked, affects males only. Key features: bulbofacial fasciculations/perioral tremor, LMN weakness (no UMN signs), gynecomastia and testicular atrophy (androgen insensitivity), elevated CK, and elevated serum testosterone/LH. Slow progression — most patients remain ambulatory for decades. There is NO UMN involvement, distinguishing it from ALS. Female carriers are asymptomatic.",
    resource: { label: "GeneReviews: Kennedy Disease (SBMA)", url: "https://www.ncbi.nlm.nih.gov/books/NBK1302/" }
  },
  {
    question: "A 35-year-old woman with SOD1-ALS (p.A5V mutation) is evaluated for tofersen therapy. Her CSF neurofilament light chain (NfL) level is markedly elevated. After 6 months of intrathecal tofersen, SOD1 protein in CSF falls by 60% and NfL normalizes, but she reports no change in strength. What is the most accurate interpretation?",
    choices: [
      "Tofersen is ineffective; switch to riluzole monotherapy",
      "Target engagement is confirmed; NfL normalization suggests slower neuronal injury, and functional benefit may lag or be seen in pre-symptomatic cases",
      "The tofersen dose is insufficient; increase to maximum dose",
      "CSF NfL is not a reliable biomarker for ALS drug response"
    ],
    answer: 1,
    explanation: "Tofersen (FDA-approved 2023 for SOD1-ALS) reduces SOD1 protein in CSF by ~35–60% and consistently reduces CSF/plasma NfL — a biomarker of neuronal injury. In the VALOR trial, the primary functional endpoint was not met, but NfL reduction and open-label extension data suggest neuroprotection. Earlier treatment (pre-symptomatic carriers) appears to show more functional benefit. Target engagement without immediate functional change reflects the irreversibility of lost motor neurons — prevention of further loss is the goal.",
    resource: { label: "PubMed: Tofersen for SOD1-ALS (Miller 2022)", url: "https://pubmed.ncbi.nlm.nih.gov/36129998/" }
  },
  {
    question: "A 19-year-old man presents with rapidly progressive upper and lower limb weakness over 6 months. He has bilateral hand wasting, fasciculations, and hyperreflexia in the legs. No family history. Genetic testing finds a pathogenic FUS mutation (p.R521C). What features distinguish FUS-ALS from typical sporadic ALS?",
    choices: [
      "FUS-ALS exclusively affects the upper motor neurons",
      "FUS-ALS typically has very early onset (teens–30s), rapid progression, and cytoplasmic FUS inclusions rather than TDP-43 inclusions",
      "FUS-ALS is always autosomal recessive and requires testing of both parents",
      "FUS-ALS responds well to riluzole monotherapy with longer survival than sporadic ALS"
    ],
    answer: 1,
    explanation: "FUS-ALS accounts for ~4% of familial ALS and is distinguished by very young onset (sometimes teenage), rapid progression, and dominantly pathological FUS inclusions in motor neurons (not TDP-43, which characterizes ~97% of all ALS). The p.R521C and other NLS-domain mutations cause cytoplasmic FUS mislocalization. Any ALS presentation in a patient under 25 should prompt urgent FUS genetic testing. Survival is generally shorter than typical ALS. FUS-ALS is autosomal dominant in most cases.",
    resource: { label: "NORD: Amyotrophic Lateral Sclerosis", url: "https://rarediseases.org/rare-diseases/amyotrophic-lateral-sclerosis/" }
  },
  {
    question: "A 42-year-old man has progressive bilateral leg spasticity and gait difficulty for 8 years. He cannot run. DTRs are brisk with bilateral Babinski signs. Lower extremity MRI shows no compressive lesion. No weakness in the arms. Brain MRI shows a thin corpus callosum. His brother is similarly affected. Which gene is most likely?",
    choices: [
      "SPAST (spastin — SPG4, most common HSP)",
      "ATL1 (atlastin — SPG3A, early childhood onset)",
      "CYP7B1 (SPG5, complicated HSP with cerebellar ataxia)",
      "REEP1 (SPG31)"
    ],
    answer: 0,
    explanation: "Hereditary spastic paraplegia type 4 (SPG4), caused by SPAST mutations, is the most common HSP subtype, accounting for ~40% of all autosomal dominant HSP. It causes 'pure' HSP (bilateral leg spasticity with bladder urgency; arms usually spared) but can have a thin corpus callosum as an incidental finding. Onset is variable (childhood to late adult). SPG3A (ATL1) typically presents in early childhood and is the second most common AD-HSP. CYP7B1/SPG5 causes cerebellar ataxia in addition to spasticity ('complicated' HSP).",
    resource: { label: "GeneReviews: Hereditary Spastic Paraplegia (SPG4)", url: "https://www.ncbi.nlm.nih.gov/books/NBK1509/" }
  },

  // ── Peripheral Neuropathies ────────────────────────────────────────────────
  {
    question: "A 20-year-old woman presents after her first episode of foot drop following a 2-hour bus ride with her leg crossed. Nerve conduction studies show focal conduction block at the fibular head with mild background slowing of motor conduction velocities bilaterally. She had a similar episode 2 years ago. Her father has had multiple pressure palsies. What is the diagnosis?",
    choices: [
      "Charcot-Marie-Tooth type 1A (PMP22 duplication)",
      "Hereditary neuropathy with liability to pressure palsies (HNPP — PMP22 deletion)",
      "Multifocal motor neuropathy",
      "Peroneal nerve entrapment neuropathy (sporadic)"
    ],
    answer: 1,
    explanation: "HNPP is caused by deletion of one PMP22 copy on chromosome 17p12. Clinically: recurrent focal mononeuropathies at common pressure points (peroneal at fibular head, ulnar at elbow, median at carpal tunnel), each episode typically resolving over weeks. Background NCS shows diffuse but mild slowing (not as severe as CMT1A duplication). Family history of similar episodes is common. CMT1A causes uniform slowing without episodic focal palsy. Spontaneous recovery distinguishes HNPP episodes from irreversible mononeuropathies.",
    resource: { label: "GeneReviews: Hereditary Neuropathy with Pressure Palsies", url: "https://www.ncbi.nlm.nih.gov/books/NBK1389/" }
  },
  {
    question: "A previously healthy 25-year-old man develops rapidly ascending weakness over 5 days, starting with bilateral foot tingling. He had diarrhea 3 weeks earlier. Examination shows areflexia, mild distal weakness, preserved cognition. CSF shows elevated protein (120 mg/dL) with normal WBC count (albuminocytologic dissociation). NCS shows absent H-reflexes, prolonged F-waves, and conduction block. What is the next step?",
    choices: [
      "MRI brain and spine with gadolinium to exclude demyelinating disease",
      "IVIG 2 g/kg over 5 days OR plasmapheresis 5 exchanges over 2 weeks",
      "High-dose IV methylprednisolone for 5 days",
      "Lumbar puncture for IgG index and oligoclonal bands"
    ],
    answer: 1,
    explanation: "Guillain-Barré syndrome (AIDP) requires prompt treatment with either IVIG (2 g/kg over 5 days) or therapeutic plasma exchange (5 exchanges over 2 weeks) — both are equally effective. Steroids (corticosteroids) are NOT beneficial in AIDP and are specifically contraindicated — multiple trials showed no benefit or harm. Combined IVIG + PE is no better than either alone. Lumbar puncture (already done) confirms albuminocytologic dissociation. MRI is not the immediate priority when GBS is clinically clear.",
    resource: { label: "NORD: Guillain-Barré Syndrome", url: "https://rarediseases.org/rare-diseases/guillain-barre-syndrome/" }
  },
  {
    question: "A 45-year-old woman has had symmetric distal sensorimotor neuropathy for 3 years with progressive worsening. NCS shows slowing of motor conduction velocities and prolonged distal latencies in multiple nerves. CSF protein is 95 mg/dL. She initially responded to a prednisone course but relapsed. Which diagnosis requires consideration of long-term maintenance immunotherapy?",
    choices: [
      "Guillain-Barré syndrome (AIDP) — treatment-responsive remission expected",
      "Chronic inflammatory demyelinating polyneuropathy (CIDP)",
      "POEMS syndrome (monoclonal plasma cell disorder)",
      "CMT1A (PMP22 duplication) — corticosteroid-responsive demyelinating neuropathy"
    ],
    answer: 1,
    explanation: "CIDP is defined by progressive or relapsing-remitting demyelinating neuropathy lasting >8 weeks, with CSF protein elevation and NCS demyelinating features. Treatment response followed by relapse on steroid taper is characteristic. Long-term maintenance is typically required — options include IVIG (every 3–6 weeks), subcutaneous Ig, or steroids. Efgartigimod and rilzabrutinib are emerging CIDP therapies. CMT1A does not respond to immunotherapy. POEMS requires treatment of the underlying plasma cell clone.",
    resource: { label: "NORD: Chronic Inflammatory Demyelinating Polyneuropathy", url: "https://rarediseases.org/rare-diseases/chronic-inflammatory-demyelinating-polyneuropathy-cidp/" }
  },
  {
    question: "A 70-year-old man has a 3-year course of slowly progressive distal leg sensory loss and ataxic gait. Serum IgM is 3,800 mg/dL with an IgM kappa monoclonal spike. Anti-myelin-associated glycoprotein (anti-MAG) antibodies are strongly positive. NCS shows prominent prolongation of distal motor latencies out of proportion to conduction velocity slowing. What is the best characterization?",
    choices: [
      "CIDP — treat with IVIG",
      "Anti-MAG neuropathy associated with IgM MGUS — predominantly sensory, responds better to rituximab than IVIG",
      "Multifocal motor neuropathy — treat with IVIG",
      "AL amyloidosis neuropathy — treat with plasma cell clone-directed therapy"
    ],
    answer: 1,
    explanation: "Anti-MAG neuropathy is a distal, predominantly sensory (ataxic) demyelinating neuropathy associated with IgM MGUS and anti-MAG antibodies. The NCS signature is disproportionately prolonged distal latencies (widened action potential due to terminal demyelination). IVIG has limited efficacy; rituximab (anti-CD20) targeting the IgM-secreting B-cell clone is currently the most effective treatment, with ~50% of patients showing improvement. The slow, ataxia-predominant course and IgM MGUS context distinguish it from CIDP.",
    resource: { label: "PubMed: Anti-MAG Neuropathy Review", url: "https://pubmed.ncbi.nlm.nih.gov/26381073/" }
  },
  {
    question: "A 55-year-old man has pure motor, asymmetric arm weakness with wasting of intrinsic hand muscles. No sensory symptoms. NCS shows conduction block in motor nerves not at common entrapment sites. He has anti-GM1 IgM antibodies. DTRs are reduced. No Babinski signs. What treatment is indicated?",
    choices: [
      "Plasma exchange (plasmapheresis)",
      "IVIG 2 g/kg every 4–8 weeks (maintenance)",
      "High-dose prednisone 60 mg/day",
      "Cyclophosphamide plus rituximab"
    ],
    answer: 1,
    explanation: "Multifocal motor neuropathy (MMN) presents as pure motor, asymmetric neuropathy with conduction block on NCS and anti-GM1 IgM antibodies (~50%). It mimics motor neuron disease but has NO upper motor neuron signs. IVIG (2 g/kg induction, then maintenance every 4–8 weeks) is the treatment of choice and is typically highly effective. Unlike CIDP, MMN does NOT respond to plasma exchange or corticosteroids — corticosteroids may actually worsen MMN. This drug-class distinction is a classic board point.",
    resource: { label: "PubMed: Multifocal Motor Neuropathy (van Schaik 2018)", url: "https://pubmed.ncbi.nlm.nih.gov/29501197/" }
  },
  {
    question: "A 62-year-old man presents with a painful, length-dependent, small-fiber neuropathy, carpal tunnel syndrome, and a new diagnosis of cardiomyopathy with increased wall thickness on echo. His father died of heart failure at 64. Serum and urine protein electrophoresis are negative. What is the most likely diagnosis?",
    choices: [
      "AL amyloidosis (immunoglobulin light chain) — screen for plasma cell dyscrasia",
      "Hereditary transthyretin amyloidosis (hATTR — TTR mutation) — genetic testing indicated",
      "POEMS syndrome — look for VEGF elevation",
      "Fabry disease — measure alpha-galactosidase A activity"
    ],
    answer: 1,
    explanation: "Hereditary TTR amyloidosis (hATTR) classically presents as painful small-fiber peripheral neuropathy (often length-dependent with autonomic features), bilateral carpal tunnel syndrome, and hypertrophic cardiomyopathy with 'granular sparkling' echo pattern — all in the setting of a negative serum/urine SPEP (ruling out AL). Positive family history strongly supports hereditary TTR. TTR gene sequencing confirms; treatments include tafamidis (TTR stabilizer), patisiran and inotersen (RNA-targeted therapies). Val30Met is the most common worldwide TTR mutation.",
    resource: { label: "GeneReviews: Hereditary TTR Amyloidosis", url: "https://www.ncbi.nlm.nih.gov/books/NBK1194/" }
  },
  {
    question: "A 12-year-old boy has burning pain and paresthesias in his hands and feet triggered by exercise and fever. He has angiokeratomas on his lower trunk. Ophthalmology notes cornea verticillata. Renal function shows microalbuminuria. His maternal uncle had similar symptoms. What is the diagnosis and first-line treatment?",
    choices: [
      "Refsum disease (PHYH mutation) — dietary restriction of phytanic acid",
      "Fabry disease (GLA mutation, X-linked) — enzyme replacement therapy with agalsidase",
      "Hereditary transthyretin amyloidosis — tafamidis",
      "HSAN type 1 (SPTLC1) — serine supplementation"
    ],
    answer: 1,
    explanation: "Fabry disease (alpha-galactosidase A deficiency, GLA — X-linked) classically presents in boys with acroparesthesias (burning pain, heat/exercise-triggered), angiokeratomas, cornea verticillata, and progressive renal/cardiac disease. Maternal uncle inheritance is consistent with X-linked. Enzyme replacement therapy (agalsidase alfa or beta) is the standard treatment and reduces neuropathic pain and organ progression. Migalastat (pharmacological chaperone) is an oral alternative for patients with amenable mutations.",
    resource: { label: "GeneReviews: Fabry Disease", url: "https://www.ncbi.nlm.nih.gov/books/NBK1292/" }
  },
  {
    question: "A 10-year-old boy presents with progressive retinitis pigmentosa, ataxia, peripheral neuropathy, anosmia, and ichthyosis. His serum phytanic acid is markedly elevated. What dietary restriction is essential?",
    choices: [
      "Low-fat diet to reduce all dietary lipids",
      "Strict avoidance of phytanic acid sources (dairy fat, fatty fish, ruminant meat)",
      "Ketogenic diet to promote fatty acid oxidation",
      "Low-phenylalanine diet"
    ],
    answer: 1,
    explanation: "Refsum disease (PHYH or PEX7 mutations) causes accumulation of phytanic acid — a branched-chain fatty acid from dietary chlorophyll-containing foods. Since humans cannot catabolize phytanic acid without the peroxisomal enzyme phytanoyl-CoA hydroxylase, strict dietary elimination of sources (dairy fat, fatty fish, beef/lamb) can halt or reverse some symptoms. Plasmapheresis is used acutely for rapid phytanic acid reduction. The 5-feature syndrome (retinitis pigmentosa + ataxia + neuropathy + anosmia + ichthyosis) is diagnostic.",
    resource: { label: "GeneReviews: Refsum Disease", url: "https://www.ncbi.nlm.nih.gov/books/NBK1353/" }
  },
  {
    question: "A 7-year-old boy has a demyelinating neuropathy (MCV 15 m/s) with onset of foot drop at age 2. He has scoliosis, distal wasting, and onion-bulb formation on nerve biopsy. His parents are unaffected. What type of mutation is most likely?",
    choices: [
      "Inherited PMP22 duplication from an affected parent",
      "De novo dominant mutation in PMP22, MPZ, or EGR2 causing Dejerine-Sottas disease",
      "Autosomal recessive GDAP1 mutation",
      "X-linked connexin-32 (GJB1) mutation"
    ],
    answer: 1,
    explanation: "Dejerine-Sottas disease (DSS) / congenital hypomyelinating neuropathy presents with severe early-onset demyelinating neuropathy (often MCV <10–15 m/s), scoliosis, and marked nerve hypertrophy with onion bulbs. Most cases are caused by de novo dominant mutations in PMP22, MPZ, or EGR2 — parents are typically unaffected. This distinguishes DSS from CMT1A (inherited from affected parent) and from HMSNIII. Genetic testing of parents (both negative) combined with extreme slowing and severe early onset is the clinical clue.",
    resource: { label: "GeneReviews: Charcot-Marie-Tooth Neuropathies", url: "https://www.ncbi.nlm.nih.gov/books/NBK1358/" }
  },
  {
    question: "A 35-year-old woman develops diplopia, ptosis, and symmetric ascending weakness 4 weeks after Campylobacter jejuni gastroenteritis. Her reflexes are absent. Cerebellar ataxia is prominent. Anti-GQ1b IgG antibodies are positive at high titer. The most likely diagnosis is:",
    choices: [
      "AIDP (Guillain-Barré syndrome, classic form)",
      "Miller Fisher syndrome (MFS) — a GBS variant",
      "Bickerstaff brainstem encephalitis",
      "Myasthenia gravis (anti-AChR positive)"
    ],
    answer: 1,
    explanation: "Miller Fisher syndrome (MFS) is defined by the triad of ophthalmoplegia, ataxia, and areflexia. Anti-GQ1b IgG antibodies are present in >90% of cases and are essentially diagnostic. MFS is considered a GBS variant with a generally favorable prognosis; most patients recover fully within weeks to months without specific treatment (IVIG can be given if severe). Bickerstaff brainstem encephalitis overlaps with MFS but includes altered consciousness and is associated with MRI brainstem changes. Campylobacter is the most common preceding infection for GBS/MFS.",
    resource: { label: "PubMed: Miller Fisher Syndrome (Shahrizaila 2013)", url: "https://pubmed.ncbi.nlm.nih.gov/23954378/" }
  },

  // ── NMJ Disorders ─────────────────────────────────────────────────────────
  {
    question: "A 34-year-old woman has ptosis, diplopia, and fatigable proximal limb weakness. Serum acetylcholine receptor (AChR) antibodies are negative. Single-fiber EMG shows increased jitter and blocking. She responds partially to pyridostigmine. What is the next most useful diagnostic test?",
    choices: [
      "Tensilon (edrophonium) test",
      "Anti-MuSK and anti-LRP4 antibody testing",
      "Chest CT for thymoma",
      "Repetitive nerve stimulation at 3 Hz"
    ],
    answer: 1,
    explanation: "In seronegative MG (AChR antibody negative), the next priority is testing for anti-MuSK antibodies (~40–50% of seronegative generalized MG) and anti-LRP4 antibodies (~10%). These define distinct clinical subtypes with different treatment approaches: MuSK-MG responds poorly to pyridostigmine and thymectomy is not beneficial; rituximab is often effective. True seronegative MG (negative for all three antibodies) exists but is a diagnosis of exclusion. SFEMG is already the most sensitive diagnostic test and has been done.",
    resource: { label: "NORD: Myasthenia Gravis", url: "https://rarediseases.org/rare-diseases/myasthenia-gravis/" }
  },
  {
    question: "A 48-year-old man with generalized AChR-positive MG is evaluated for thymectomy. CT shows no thymoma. He has been on pyridostigmine and prednisone for 2 years with incomplete control. What does the MGTX trial (Wolfe et al., 2016) indicate about thymectomy in non-thymomatous MG?",
    choices: [
      "Thymectomy provides no benefit in non-thymomatous MG",
      "Extended transsternal thymectomy improves clinical outcomes and reduces steroid requirements in AChR-positive MG aged 18–65",
      "Thymectomy is only beneficial if performed within 1 year of diagnosis",
      "Thymectomy is equivalent to medical management for MuSK-positive MG"
    ],
    answer: 1,
    explanation: "The MGTX RCT (NEJM 2016) demonstrated that extended transsternal thymectomy significantly improved QMG scores and reduced prednisone requirements and hospitalization rates in AChR-positive, non-thymomatous MG patients aged 18–65. This established thymectomy as standard of care for this group — a change from prior uncertainty. Thymectomy is NOT beneficial for MuSK-MG or late-onset MG in some guidelines. Robotic/thoracoscopic approaches are now used in many centers.",
    resource: { label: "PubMed: MGTX Trial (Wolfe 2016)", url: "https://pubmed.ncbi.nlm.nih.gov/27509108/" }
  },
  {
    question: "A 60-year-old male smoker develops bilateral ptosis, proximal limb weakness worse in the legs, and dry mouth. Strength improves briefly after repeated contractions (post-exercise facilitation). 3 Hz repetitive nerve stimulation shows 15% decrement, and 50 Hz stimulation shows 200% increment. Chest CT shows a hilar mass. What is the pathophysiology?",
    choices: [
      "Post-synaptic AChR blockade by IgG antibodies (myasthenia gravis)",
      "Presynaptic impairment of acetylcholine vesicle release due to VGCC antibodies (Lambert-Eaton myasthenic syndrome)",
      "Presynaptic toxin cleavage of SNARE proteins (botulism)",
      "Absent acetylcholinesterase at the NMJ (COLQ-CMS)"
    ],
    answer: 1,
    explanation: "Lambert-Eaton myasthenic syndrome (LEMS) is a presynaptic NMJ disorder caused by IgG antibodies against voltage-gated calcium channels (VGCC P/Q-type). Reduced Ca²⁺ influx impairs ACh vesicle fusion, causing proximal weakness (legs > arms), hyporeflexia, autonomic features, and post-exercise facilitation. >100% increment on high-frequency RNS is pathognomonic. ~60% of LEMS is paraneoplastic (SCLC most common). Treatment: 3,4-diaminopyridine (amifampridine) symptomatically; treat underlying malignancy.",
    resource: { label: "NORD: Lambert-Eaton Myasthenic Syndrome", url: "https://rarediseases.org/rare-diseases/lambert-eaton-myasthenic-syndrome/" }
  },
  {
    question: "A 5-year-old boy presents with fatigable ptosis, hypotonia, and feeding difficulties since infancy. AChR and MuSK antibodies are negative. His twin sister is unaffected. Repetitive nerve stimulation shows a decremental response. Genetic testing identifies compound heterozygous mutations in DOK7. Pyridostigmine makes him worse. What treatment is appropriate?",
    choices: [
      "Increase pyridostigmine to higher doses",
      "Albuterol (salbutamol) or ephedrine — beta-adrenergic agonists",
      "Rituximab for seronegative autoimmune MG",
      "3,4-diaminopyridine (amifampridine)"
    ],
    answer: 1,
    explanation: "DOK7 congenital myasthenic syndrome (DOK7-CMS) is caused by recessive mutations in the DOK7 adaptor protein, which is essential for MuSK signaling and NMJ development. It presents with limb-girdle predominant weakness, ptosis, and fatigue — without response to (or worsening with) pyridostigmine. Beta-2 adrenergic agonists (albuterol/salbutamol, ephedrine) are the effective treatment, promoting NMJ maturation and AChR clustering. This is the opposite of autoimmune MG treatment, and the distinction is a critical clinical point.",
    resource: { label: "GeneReviews: Congenital Myasthenic Syndromes", url: "https://www.ncbi.nlm.nih.gov/books/NBK1168/" }
  },
  {
    question: "A 3-month-old infant presents with descending paralysis: first poor feeding and weak cry, then loss of head control, then arm weakness. Pupils are poorly reactive (dilated). He has no fever. His mother fed him honey in warm tea 2 weeks ago. Stool culture grows Clostridium botulinum. What is the mechanism of toxin action?",
    choices: [
      "Post-synaptic ACh receptor blockade",
      "Presynaptic cleavage of SNARE complex proteins (SNAP-25, VAMP/synaptobrevin, syntaxin), preventing ACh vesicle fusion",
      "Presynaptic VGCC antibody blockade (as in LEMS)",
      "Inhibition of acetylcholinesterase at the NMJ"
    ],
    answer: 1,
    explanation: "Botulinum toxin (7 serotypes) is a zinc-endopeptidase that cleaves presynaptic SNARE complex proteins (SNAP-25 for type A/E, VAMP/synaptobrevin for type B/D/F, syntaxin for type C) — preventing ACh vesicle docking and fusion, causing flaccid paralysis. Honey contains C. botulinum spores that colonize the infant intestine. Key distinguishing features from MG: descending paralysis (not ascending as in GBS), pupil involvement (mydriasis), no fever, normal sensory exam, autonomic features. Treatment: BabyBIG (botulism immune globulin) in infants.",
    resource: { label: "NORD: Botulism", url: "https://rarediseases.org/rare-diseases/botulism/" }
  },
  {
    question: "A 2-week-old term neonate has difficulty feeding, weak cry, and hypotonia. Her mother has known myasthenia gravis (AChR antibody positive) managed with pyridostigmine. The neonate's AChR antibodies are positive. What is the expected course?",
    choices: [
      "This is congenital myasthenic syndrome — genetic, lifelong, requires chronic pyridostigmine",
      "This is transient neonatal myasthenia due to passive maternal AChR antibody transfer — resolves spontaneously in 2–8 weeks",
      "This is congenital AChR deficiency — treat with 3,4-DAP",
      "This requires thymectomy in the first year of life"
    ],
    answer: 1,
    explanation: "Transient neonatal myasthenia occurs in ~10–15% of infants born to mothers with AChR-positive MG, due to passive placental transfer of maternal IgG AChR antibodies. It is self-resolving as maternal antibodies are catabolized over 2–8 weeks. Supportive care ± pyridostigmine may be needed acutely. This is completely distinct from congenital myasthenic syndromes (genetic, non-autoimmune, lifelong). The neonatal AChR antibodies originate from the mother, not from the infant's own immune system.",
    resource: { label: "NORD: Myasthenia Gravis", url: "https://rarediseases.org/rare-diseases/myasthenia-gravis/" }
  },

  // ── Mitochondrial Disorders ────────────────────────────────────────────────
  {
    question: "A 22-year-old woman has a 3-year history of myoclonic jerks, progressive cerebellar ataxia, and generalized seizures. Her maternal grandmother had deafness and diabetes. Muscle biopsy shows ragged-red fibers (RRF) on Gomori trichrome and succinate dehydrogenase-positive, COX-negative fibers. Which mtDNA mutation is most likely?",
    choices: [
      "m.3243A>G (tRNA-Leu — MELAS)",
      "m.8344A>G (tRNA-Lys — MERRF)",
      "Large-scale mtDNA deletion (Kearns-Sayre/CPEO)",
      "m.11778G>A (ND4 — Leber hereditary optic neuropathy)"
    ],
    answer: 1,
    explanation: "MERRF (Myoclonic Epilepsy with Ragged-Red Fibers) is most commonly caused by m.8344A>G in the mitochondrial tRNALys gene. The clinical hallmarks are myoclonus, ataxia, seizures, and RRF on muscle biopsy. Hearing loss, dementia, and peripheral neuropathy are variable. Maternal inheritance pattern (grandmother with deafness/diabetes suggesting mitochondrial disease) supports the diagnosis. m.3243A>G is the MELAS mutation. Large-scale deletions cause KSS. LHON causes only optic neuropathy.",
    resource: { label: "GeneReviews: MERRF", url: "https://www.ncbi.nlm.nih.gov/books/NBK1520/" }
  },
  {
    question: "A 14-month-old presents with hypotonia, developmental regression, and feeding difficulties after a viral illness. MRI shows bilateral symmetric T2 hyperintensities in the basal ganglia and brainstem. Plasma lactate is 5.2 mmol/L. What syndrome best fits, and what gene family is most commonly implicated?",
    choices: [
      "MELAS — mitochondrial tRNA mutations",
      "Leigh syndrome — SURF1, complex I subunit genes, or POLG (dozens of nuclear-encoded genes)",
      "Kearns-Sayre syndrome — large-scale mtDNA deletion",
      "MERRF — m.8344A>G"
    ],
    answer: 1,
    explanation: "Leigh syndrome (subacute necrotizing encephalomyelopathy) presents in infancy–early childhood with developmental regression after illness, hypotonia, and bilateral symmetric MRI lesions in basal ganglia/brainstem. Elevated lactate reflects oxidative phosphorylation failure. Genetically heterogeneous: SURF1 (Complex IV assembly) is most commonly identified, but mutations in >75 genes (Complex I subunits, POLG, mtDNA-encoded genes) cause the Leigh phenotype. Mitochondrial DNA whole-genome sequencing plus nuclear gene panels are needed for complete workup.",
    resource: { label: "GeneReviews: Leigh Syndrome", url: "https://www.ncbi.nlm.nih.gov/books/NBK84506/" }
  },
  {
    question: "A 16-year-old boy has bilateral ptosis and progressive external ophthalmoplegia since age 12, pigmentary retinopathy, and a recent ECG showing complete heart block. His CK is mildly elevated. Muscle biopsy shows RRF and COX-negative fibers. A large-scale mtDNA deletion is confirmed on Southern blot. What is the diagnosis, and what is the most urgent intervention?",
    choices: [
      "CPEO with RRF — observation and annual cardiology review",
      "Kearns-Sayre syndrome — cardiac pacing for complete heart block (risk of sudden death)",
      "MELAS — initiate L-arginine supplementation",
      "MERRF — optimize seizure management with valproate"
    ],
    answer: 1,
    explanation: "Kearns-Sayre syndrome (KSS) is defined by: onset <20 years, CPEO, and pigmentary retinopathy, PLUS at least one of: cardiac conduction block, CSF protein >100 mg/dL, or cerebellar ataxia. All caused by large-scale single mtDNA deletions. Cardiac conduction block (even first-degree AV block) requires prompt cardiology referral — complete heart block in KSS can cause sudden cardiac death and permanent pacing is often indicated. Valproate should be avoided in mitochondrial disease (hepatotoxicity risk).",
    resource: { label: "GeneReviews: Mitochondrial DNA Deletion Syndromes", url: "https://www.ncbi.nlm.nih.gov/books/NBK1203/" }
  },
  {
    question: "A 28-year-old man has painless bilateral, sequential visual loss over 2 months (right eye first, then left eye 8 weeks later). Central scotoma. He smokes heavily. His maternal cousin had the same presentation. No other neurological findings. Fundoscopy shows circumpapillary telangiectasia. Which mutation is responsible in ~70% of cases?",
    choices: [
      "m.3243A>G (tRNA-Leu)",
      "m.11778G>A (ND4 subunit of Complex I — LHON)",
      "m.8344A>G (tRNA-Lys)",
      "Large-scale mtDNA deletion"
    ],
    answer: 1,
    explanation: "Leber hereditary optic neuropathy (LHON) causes painless, bilateral (usually sequential) optic neuropathy in young adults, predominantly males. The m.11778G>A mutation (ND4) accounts for ~70% of LHON globally; m.3460G>A and m.14484T>C are the other primary mutations. Maternal inheritance and male predominance (incomplete penetrance, with environmental modifiers like smoking). Idebenone (CoQ10 analog) is an FDA-approved treatment for LHON. The circumpapillary telangiectasia is an acute-phase fundoscopic finding.",
    resource: { label: "GeneReviews: Leber Hereditary Optic Neuropathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1174/" }
  },
  {
    question: "A 4-year-old girl presents with intractable seizures, developmental regression, and hepatic dysfunction. Muscle biopsy shows mtDNA depletion. Her mother is asymptomatic. Sequencing reveals compound heterozygous POLG mutations. Valproate was started for seizures 2 months ago. What is the most urgent action?",
    choices: [
      "Increase valproate dose for better seizure control",
      "Discontinue valproate immediately — it is contraindicated in POLG disease (fatal hepatotoxicity)",
      "Add levetiracetam to valproate for combination therapy",
      "Initiate coenzyme Q10 supplementation and continue valproate"
    ],
    answer: 1,
    explanation: "POLG-related disorders (including Alpers-Huttenlocher syndrome) are caused by recessive POLG mutations and cause mtDNA depletion/deletion in liver and brain. Valproate is absolutely contraindicated in POLG disease: it causes severe, often fatal hepatotoxicity in this context, likely by further impairing mitochondrial function. This is a life-threatening drug interaction. Alternative anticonvulsants (levetiracetam, phenobarbital, clonazepam) should be used. This contraindication applies to any suspected mitochondrial disease until genetic testing is complete.",
    resource: { label: "GeneReviews: POLG-Related Disorders", url: "https://www.ncbi.nlm.nih.gov/books/NBK26471/" }
  },
  {
    question: "A mother asks whether her mitochondrial disorder can be passed to her son. She carries a pathogenic m.3243A>G mutation with 40% heteroplasmy in blood. What is the most accurate counseling statement?",
    choices: [
      "Her son has a 50% chance of inheriting the mutation, following Mendelian autosomal dominant rules",
      "Mitochondrial DNA is maternally inherited; all of her children are at risk, but the level of heteroplasmy and resulting disease severity are unpredictable due to mitotic segregation",
      "Her son cannot be affected since MELAS predominantly affects females",
      "If the mutation is not detected in her son's blood at birth, he will remain unaffected"
    ],
    answer: 1,
    explanation: "MtDNA follows strict maternal inheritance — all children of an affected mother are at risk regardless of sex. However, the proportion of mutant mtDNA (heteroplasmy) varies dramatically between tissues and between generations due to mitotic segregation and a mitochondrial genetic bottleneck during oogenesis. Blood heteroplasmy may not reflect muscle or CNS heteroplasmy. Severity and age of onset cannot be predicted from blood heteroplasmy alone. This unpredictability makes prenatal counseling complex; preimplantation genetic testing and mitochondrial donation (in licensed centers) are options.",
    resource: { label: "GeneReviews: MELAS", url: "https://www.ncbi.nlm.nih.gov/books/NBK1233/" }
  },

  // ── Ataxias ───────────────────────────────────────────────────────────────
  {
    question: "A 15-year-old girl has progressive gait ataxia, areflexia, dysarthria, and cardiomyopathy. Genetic testing shows homozygous GAA trinucleotide repeat expansion in the FXN gene (1,200 repeats on both alleles). What is the mechanism of pathology?",
    choices: [
      "Toxic gain-of-function from the expanded GAA repeat RNA",
      "Epigenetic silencing of FXN by the GAA repeat, reducing frataxin protein and causing mitochondrial iron accumulation",
      "Frataxin protein misfolding causing toxic aggregates in Purkinje cells",
      "Loss of frataxin destabilizes coenzyme Q10 synthesis"
    ],
    answer: 1,
    explanation: "Friedreich ataxia is caused by autosomal recessive GAA repeat expansion in intron 1 of FXN. The repeat expansion causes heterochromatin formation (epigenetic silencing) that suppresses FXN transcription, reducing frataxin protein. Frataxin is essential for iron-sulfur cluster assembly in mitochondria; its loss causes mitochondrial iron accumulation, oxidative stress, and neurodegeneration — predominantly of dorsal root ganglia, spinocerebellar tracts, and corticospinal tracts. Cardiomyopathy affects ~80% of patients and is the leading cause of death.",
    resource: { label: "GeneReviews: Friedreich Ataxia", url: "https://www.ncbi.nlm.nih.gov/books/NBK1281/" }
  },
  {
    question: "A 17-year-old girl with Friedreich ataxia is found to have progressive hypertrophic cardiomyopathy on echo. She has been following a clinical trial. The FDA approved omaveloxolone (Skyclarys) for Friedreich ataxia in 2023. What is its mechanism?",
    choices: [
      "It replaces frataxin protein directly via enzyme replacement",
      "It activates the Nrf2 pathway, enhancing antioxidant response and reducing mitochondrial oxidative stress",
      "It is an iron chelator removing excess mitochondrial iron",
      "It is an antisense oligonucleotide reducing the GAA repeat expansion"
    ],
    answer: 1,
    explanation: "Omaveloxolone (Skyclarys, FDA 2023) is the first approved treatment for Friedreich ataxia. It is a semisynthetic triterpenoid that activates the Nrf2 transcription factor, upregulating antioxidant response element genes, improving mitochondrial function, and reducing reactive oxygen species. It does not restore frataxin levels directly. The pivotal MOXIe trial showed slowing of neurological decline on the modified FA Rating Scale. It is indicated for patients aged ≥16 years. Cardiac management follows standard hypertrophic cardiomyopathy guidelines.",
    resource: { label: "PubMed: Omaveloxolone FA Trial (Lynch 2021)", url: "https://pubmed.ncbi.nlm.nih.gov/33544422/" }
  },
  {
    question: "A 9-year-old girl has cerebellar ataxia, oculomotor apraxia, and bilateral conjunctival telangiectasias. She has had 3 sinopulmonary infections this year. Serum AFP is elevated. Lymphocyte count is low and immunoglobulins are reduced. Which gene is mutated?",
    choices: [
      "FXN (frataxin — Friedreich ataxia)",
      "ATM (ataxia-telangiectasia mutated kinase)",
      "APTX (aprataxin — ataxia with oculomotor apraxia type 1)",
      "SETX (senataxin — AOA type 2)"
    ],
    answer: 1,
    explanation: "Ataxia-telangiectasia (AT) is caused by biallelic loss-of-function mutations in ATM, encoding a DNA damage-response kinase. The classic features are cerebellar ataxia (onset age 1–4), oculomotor apraxia, conjunctival/skin telangiectasias, combined immunodeficiency (IgA/IgG deficiency, lymphopenia), markedly elevated serum AFP, and extreme radiosensitivity. Patients have ~100-fold increased cancer risk (lymphomas, leukemias). AFP elevation (a unique biomarker in AT) helps distinguish AT from other early-onset ataxias. Radiation and radiomimetic drugs must be avoided.",
    resource: { label: "GeneReviews: Ataxia-Telangiectasia", url: "https://www.ncbi.nlm.nih.gov/books/NBK26468/" }
  },
  {
    question: "A 40-year-old man has slowly progressive gait ataxia, dysarthria, and dysphagia. He also has spasticity and dystonia. His father and grandfather were similarly affected, with onset in their 30s. Genetic testing reveals CAG repeat expansion in ATXN3 (46 repeats). What is the most common worldwide spinocerebellar ataxia?",
    choices: [
      "SCA1 (ATXN1)",
      "SCA2 (ATXN2)",
      "SCA3 — Machado-Joseph disease (ATXN3)",
      "SCA6 (CACNA1A)"
    ],
    answer: 2,
    explanation: "SCA3 (Machado-Joseph disease, caused by CAG repeat in ATXN3) is the most common autosomal dominant spinocerebellar ataxia worldwide, particularly prevalent in populations of Portuguese/Azorean descent. Clinical features include cerebellar ataxia, pyramidal signs, extrapyramidal features, peripheral neuropathy, and progressive gaze palsy. The polyglutamine-expanded ataxin-3 forms nuclear aggregates in neurons. Anticipation occurs (earlier onset with more repeats in subsequent generations). Normal ATXN3 repeat <44; disease ≥61.",
    resource: { label: "GeneReviews: SCA3 / Machado-Joseph Disease", url: "https://www.ncbi.nlm.nih.gov/books/NBK1196/" }
  },
  {
    question: "A 24-year-old woman has progressive ataxia with clinical features identical to Friedreich ataxia: areflexia, dorsal column sensory loss, and cardiomyopathy. However, frataxin levels are normal and no GAA repeat expansion is found. Her serum vitamin E is undetectable. What is the diagnosis and treatment?",
    choices: [
      "Spinocerebellar ataxia type 1 (SCA1 — no treatment)",
      "Ataxia with vitamin E deficiency (AVED — TTPA mutation) — high-dose vitamin E supplementation",
      "Ataxia-telangiectasia (ATM) — supportive care only",
      "Refsum disease (PHYH) — dietary restriction"
    ],
    answer: 1,
    explanation: "Ataxia with vitamin E deficiency (AVED) is caused by autosomal recessive mutations in TTPA (tocopherol transfer protein), impairing hepatic incorporation of alpha-tocopherol into VLDL. The phenotype is clinically indistinguishable from Friedreich ataxia (FA-like, with cardiomyopathy, areflexia, and dorsal column signs) but frataxin levels are normal. Critically, AVED is one of the few treatable ataxias: high-dose oral vitamin E supplementation stabilizes or reverses neurological symptoms. Measuring serum vitamin E in all FA-like presentations is essential to avoid missing this treatable cause.",
    resource: { label: "GeneReviews: Ataxia with Vitamin E Deficiency", url: "https://www.ncbi.nlm.nih.gov/books/NBK1176/" }
  },

  // ── Metabolic & Channelopathies ───────────────────────────────────────────
  {
    question: "A 22-year-old man develops severe myalgia and dark urine (myoglobinuria) after a 20-mile hiking trip. He has had similar milder episodes after prolonged fasting. CK peaks at 85,000 IU/L. At rest he is completely normal. Ischemic forearm exercise test shows appropriate lactate AND ammonia rise. What is the most likely diagnosis?",
    choices: [
      "McArdle disease (PYGM) — no lactate rise on exercise test",
      "Carnitine palmitoyltransferase II deficiency (CPT2 — long-chain fatty acid oxidation disorder)",
      "Very-long-chain acyl-CoA dehydrogenase deficiency (VLCAD)",
      "Phosphofructokinase deficiency (Tarui disease)"
    ],
    answer: 1,
    explanation: "CPT2 deficiency is the most common cause of recurrent exercise-induced myoglobinuria in adults. Triggers are prolonged low-intensity exercise (fatty acid-dependent), fasting, fever, and cold — unlike McArdle disease (brief intense exercise triggers, 'second wind'). The ischemic forearm exercise test is NORMAL in CPT2 (glycolysis is intact — normal lactate rise), distinguishing it from glycogenolytic/glycolytic defects. Between episodes CK normalizes and strength is normal. The CPT2 enzyme controls mitochondrial entry of long-chain fatty acids as acylcarnitines.",
    resource: { label: "GeneReviews: Carnitine Palmitoyltransferase II Deficiency", url: "https://www.ncbi.nlm.nih.gov/books/NBK1253/" }
  },
  {
    question: "A 12-year-old boy complains of muscle stiffness when starting to move (e.g., first few steps after sitting). Stiffness improves with continued movement ('warm-up phenomenon'). No weakness. CK is 350 IU/L. His older sister has the same complaint but milder. Nerve conduction is normal. EMG shows myotonic discharges without clinical myotonia on exam. Which gene and inheritance pattern?",
    choices: [
      "SCN4A (Nav1.4) — autosomal dominant (paramyotonia congenita)",
      "CLCN1 (chloride channel) — autosomal dominant (Thomsen disease) or recessive (Becker myotonia)",
      "DMPK (CTG repeat) — autosomal dominant (myotonic dystrophy type 1)",
      "KCNJ2 (Kir2.1) — autosomal dominant (Andersen-Tawil syndrome)"
    ],
    answer: 1,
    explanation: "Myotonia congenita is caused by mutations in CLCN1 (muscle chloride channel). Loss of chloride channel function prolongs membrane repolarization, causing repetitive action potentials (myotonia). Two forms: Thomsen disease (AD, milder) and Becker myotonia (AR, more severe — transient weakness on initiation of movement). Both show warm-up phenomenon (stiffness improves with repeated contractions), normal strength, and no systemic involvement. Mexiletine is the first-line pharmacotherapy for symptomatic myotonia. DM1 (DMPK) has systemic features and distal weakness.",
    resource: { label: "NORD: Myotonia Congenita", url: "https://rarediseases.org/rare-diseases/myotonia-congenita/" }
  },
  {
    question: "A 20-year-old man develops pronounced facial stiffness after eating ice cream, and muscle stiffness in his hands that worsens (not improves) with repeated contractions in cold weather. No weakness at rest. His father has identical cold-triggered stiffness. Nerve conduction and EMG are performed in a warm room and are normal. What is the diagnosis?",
    choices: [
      "Myotonia congenita (CLCN1) — warm-up phenomenon expected",
      "Paramyotonia congenita (SCN4A) — paradoxical worsening of myotonia with exercise and cold",
      "Hyperkalemic periodic paralysis (SCN4A) — myotonia with cold-triggered paralysis",
      "Schwartz-Jampel syndrome (HSPG2) — continuous myotonia and skeletal dysplasia"
    ],
    answer: 1,
    explanation: "Paramyotonia congenita (PMC) is caused by dominant SCN4A (Nav1.4) mutations and is distinguished by paradoxical myotonia — stiffness that WORSENS with repeated contractions (opposite of the warm-up phenomenon in CLCN1 myotonia). Cold is the classic trigger; even eating cold food triggers facial stiffness. Attacks can progress to flaccid weakness. EMG done at room temperature may be normal; cold challenge provokes myotonic discharges. Mexiletine is effective. PMC and hyperkalemic PP are allelic SCN4A disorders; some patients have both.",
    resource: { label: "NORD: Paramyotonia Congenita", url: "https://rarediseases.org/rare-diseases/paramyotonia-congenita/" }
  },
  {
    question: "A 14-year-old boy presents with episodic flaccid limb weakness lasting hours, associated with bidirectional ventricular tachycardia on ECG (QTc 490 ms). He has hypertelorism, low-set ears, and small mandible. Between episodes he is neurologically normal. What is the diagnosis?",
    choices: [
      "Hypokalemic periodic paralysis type 1 (CACNA1S)",
      "Andersen-Tawil syndrome (KCNJ2 — triad of periodic paralysis + cardiac arrhythmia + dysmorphic features)",
      "Hyperkalemic periodic paralysis (SCN4A)",
      "Timothy syndrome (CACNA1C — QT prolongation + autism + syndactyly)"
    ],
    answer: 1,
    explanation: "Andersen-Tawil syndrome (ATS) is caused by dominant KCNJ2 mutations (Kir2.1 inward-rectifier K⁺ channel) and is defined by the triad: (1) episodic flaccid weakness (periodic paralysis, usually hypokalemic), (2) cardiac arrhythmia (bidirectional VT, QTc prolongation, PVCs), and (3) dysmorphic features (hypertelorism, micrognathia, low-set ears, clinodactyly, small hands/feet). Not all three features need be present simultaneously. The cardiac arrhythmia can be life-threatening; ICD implantation may be required. Acetazolamide and potassium supplementation reduce paralytic attacks.",
    resource: { label: "GeneReviews: Andersen-Tawil Syndrome", url: "https://www.ncbi.nlm.nih.gov/books/NBK1273/" }
  },
  {
    question: "A 17-year-old boy presents with exercise-induced stiffness that is electrically SILENT on EMG (no myotonic discharges). After exercise his muscles feel 'locked' but relax with warmth. CK is normal. His maternal uncle had similar symptoms. What is the diagnosis?",
    choices: [
      "Myotonia congenita (CLCN1) — myotonic discharges always present on EMG",
      "Brody disease (ATP2A1 — SERCA1 deficiency) — electrically silent contracture",
      "Paramyotonia congenita (SCN4A) — cold-triggered with worsening on exercise",
      "Rippling muscle disease (CAV3) — ripples visible on percussion"
    ],
    answer: 1,
    explanation: "Brody disease is caused by autosomal recessive ATP2A1 mutations (SERCA1, the sarcoplasmic/endoplasmic reticulum Ca²⁺-ATPase of fast-twitch muscle). Impaired Ca²⁺ re-uptake after contraction delays relaxation, causing exercise-induced stiffness — but crucially, the muscle is electrically silent on EMG (no myotonic discharges), distinguishing it from all myotonic disorders. The 'contracture' is biochemical, not electrical. Rare; AD form with partial SERCA1 deficiency also described. No approved treatment; calcium channel blockers and dantrolene may help symptomatically.",
    resource: { label: "PubMed: Brody Disease Review", url: "https://pubmed.ncbi.nlm.nih.gov/10830384/" }
  },
  {
    question: "A 16-year-old boy has a triad of hypertrophic cardiomyopathy, proximal myopathy (CK 2,500 IU/L), and mild intellectual disability. His maternal grandfather had a pacemaker and similar muscle weakness. Muscle biopsy shows vacuolar myopathy with lysosomal glycogen accumulation but NORMAL acid alpha-glucosidase enzyme activity. What is the diagnosis?",
    choices: [
      "Pompe disease (GAA deficiency) — enzyme activity would be low",
      "Danon disease (LAMP2 — X-linked) — normal GAA activity, autophagosome accumulation",
      "GSD type III (GSD-III, debranching enzyme) — liver + muscle, usually AR",
      "GSD type IV (branching enzyme) — rare, liver-predominant"
    ],
    answer: 1,
    explanation: "Danon disease is caused by X-linked mutations in LAMP2 (lysosome-associated membrane protein 2). The clinical triad is hypertrophic cardiomyopathy (severe, often requiring transplant), skeletal myopathy with elevated CK, and intellectual disability (variable). Muscle biopsy shows vacuolar myopathy with autophagic vacuoles and glycogen accumulation — but GAA enzyme activity is NORMAL (unlike Pompe). Maternal grandfather transmission is consistent with X-linked. Cardiac disease is life-threatening, often requiring ICD or transplant. No approved disease-modifying therapy exists.",
    resource: { label: "GeneReviews: Danon Disease", url: "https://www.ncbi.nlm.nih.gov/books/NBK1218/" }
  },
  {
    question: "A 30-year-old woman with generalized myalgia is found to have CK of 3,200 IU/L on routine labs. She started a new medication 6 weeks ago. She has no weakness on exam. Her medication is most likely which of the following?",
    choices: [
      "Metformin (biguanide)",
      "High-intensity statin (atorvastatin 80 mg)",
      "ACE inhibitor",
      "Beta-blocker"
    ],
    answer: 1,
    explanation: "Statin-induced myopathy is the most common drug-induced muscle disease. High-intensity statins (atorvastatin 40–80 mg, rosuvastatin 20–40 mg) carry the highest myotoxicity risk. Spectrum: myalgia alone (most common), myositis with CK elevation, and rare rhabdomyolysis. Risk factors: high dose, drug interactions (CYP3A4 inhibitors like azithromycin, gemfibrozil), hypothyroidism, renal/hepatic disease. Anti-HMGCR antibodies indicate immune-mediated necrotizing myopathy (IMNM) — a rare but serious statin-triggered autoimmune condition requiring immunosuppression even after statin discontinuation.",
    resource: { label: "PubMed: Statin Myopathy (Stroes 2015 EAS Consensus)", url: "https://pubmed.ncbi.nlm.nih.gov/25694464/" }
  },
  {
    question: "You are performing EMG on a 55-year-old man with proximal leg weakness. Needle electrode shows spontaneous activity (fibrillation potentials and positive sharp waves) in the resting muscle. What does this finding indicate?",
    choices: [
      "This is a normal finding in resting skeletal muscle — no significance",
      "Active denervation OR active myopathy with muscle fiber necrosis — indicating ongoing muscle membrane instability",
      "This is diagnostic for ALS only and requires urgent referral",
      "Fibrillation potentials are only seen in radiculopathy, not myopathy"
    ],
    answer: 1,
    explanation: "Fibrillation potentials and positive sharp waves (spontaneous activity in resting muscle) represent membrane instability of individual muscle fibers. They occur in: (1) denervation (axon loss from any cause — neuropathy, radiculopathy, anterior horn cell disease), and (2) active myopathy with fiber necrosis (inflammatory myopathies, muscular dystrophies — the necrotic fibers lose the influence of motor nerve terminals). Their presence narrows the differential to conditions with ongoing fiber damage; their distribution (proximal vs. distal, paraspinal vs. limb) guides further diagnosis. They do NOT occur in normal muscle.",
    resource: { label: "NORD: Electromyography — aaem.com educational", url: "https://www.aanem.org/Patients/Muscle-and-Nerve-Disorders/EMG" }
  },
  {
    question: "A 10-year-old boy presents to the emergency department with dark urine after a febrile illness. CK is 45,000 IU/L. Urinalysis shows large blood without RBCs on microscopy (myoglobinuria). Creatinine is rising. Which intervention is most important to prevent acute kidney injury?",
    choices: [
      "Furosemide diuresis to concentrate urine",
      "Aggressive IV fluid resuscitation with isotonic saline to maintain urine output >3 mL/kg/hr; consider urinary alkalinization",
      "Sodium bicarbonate alone without IV fluids",
      "Emergent dialysis for all CK >10,000"
    ],
    answer: 1,
    explanation: "Myoglobin precipitates in renal tubules (especially in acidic concentrated urine), causing acute tubular necrosis. The cornerstone of rhabdomyolysis management is aggressive IV normal saline hydration targeting urine output >200–300 mL/hr (or 3 mL/kg/hr in children) to flush myoglobin. Urinary alkalinization (sodium bicarbonate added to IV fluids) reduces myoglobin precipitation and may be beneficial, though evidence is less robust. Furosemide can worsen tubular concentration and acidification. Dialysis is reserved for refractory hyperkalemia or renal failure — not routine at any CK threshold.",
    resource: { label: "PubMed: Rhabdomyolysis Management (Bosch 2009)", url: "https://pubmed.ncbi.nlm.nih.gov/19450125/" }
  },
  {
    question: "A 60-year-old man with rapidly progressive symmetric proximal weakness has a CK of 6,000 IU/L. EMG shows active myopathic changes with fibrillations. Muscle biopsy shows necrotic and regenerating fibers with sparse inflammation and MHC-I upregulation. Anti-HMGCR antibodies are positive. He took atorvastatin for 5 years. He stopped 2 months ago but is getting worse. What is the diagnosis and treatment?",
    choices: [
      "Statin myopathy — resolves with statin discontinuation alone",
      "Immune-mediated necrotizing myopathy (IMNM) triggered by statin — requires immunosuppressive therapy despite statin cessation",
      "Polymyositis — treat with high-dose prednisone",
      "Sporadic inclusion body myositis — no effective immunotherapy"
    ],
    answer: 1,
    explanation: "Anti-HMGCR immune-mediated necrotizing myopathy (IMNM) is a statin-associated autoimmune myopathy in which statins trigger an autoimmune response targeting HMGCR (the statin's target enzyme). Unlike simple statin myotoxicity, IMNM does NOT resolve with statin cessation — it is a true autoimmune disease requiring immunosuppression (prednisone plus IVIG and/or steroid-sparing agents like azathioprine or rituximab). Biopsy shows necrosis without significant inflammation (distinguishing it from polymyositis). Anti-HMGCR antibody titer correlates with disease activity.",
    resource: { label: "PubMed: Anti-HMGCR IMNM (Mammen 2011)", url: "https://pubmed.ncbi.nlm.nih.gov/21194947/" }
  },
  {
    question: "A 12-year-old girl has slowly progressive proximal weakness. EMG shows myopathic features. Muscle biopsy shows numerous 'rimmed vacuoles' in >20% of fibers and filamentous inclusions on electron microscopy. There is no inflammation. CK is 800 IU/L. Genetic testing identifies compound heterozygous GNE mutations. What is the diagnosis?",
    choices: [
      "Sporadic inclusion body myositis (sIBM) — acquired, age >50",
      "GNE myopathy (hereditary inclusion body myopathy / Nonaka myopathy) — distal > proximal, spares quadriceps",
      "VCP-related myopathy (multisystem proteinopathy)",
      "LGMD R3 (alpha-sarcoglycanopathy)"
    ],
    answer: 1,
    explanation: "GNE myopathy (formerly HIBM / Nonaka myopathy) is caused by recessive GNE mutations affecting UDP-GlcNAc epimerase (sialic acid biosynthesis). It presents in young adults (teens–30s) with distal > proximal weakness, characteristically SPARING the quadriceps even in advanced disease. Rimmed vacuoles on biopsy are the hallmark, with TDP-43 and IBM-style inclusions. This is genetically determined, not autoimmune — immunosuppression is ineffective. Aceneuramic acid (sialic acid) supplementation is in clinical trials. Distinguished from sIBM by young age and AR inheritance.",
    resource: { label: "GeneReviews: GNE Myopathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1365/" }
  },
  {
    question: "A 6-year-old boy with SMA type 1 is on nusinersen (started at age 4). His parents ask about switching to onasemnogene abeparvovec. Which statement is most accurate?",
    choices: [
      "Onasemnogene abeparvovec can be given at any age and replaces nusinersen permanently",
      "Onasemnogene abeparvovec is currently approved up to age 2 (or weight limit 21 kg); at age 6 he would not qualify based on current label",
      "Switching is contraindicated because prior AAV exposure from onasemnogene causes immune reactions",
      "Nusinersen and onasemnogene can be safely combined for additive benefit"
    ],
    answer: 1,
    explanation: "Onasemnogene abeparvovec (Zolgensma) is FDA-approved for SMA patients <2 years of age (US label), based on the AVXS-101 trials showing the most dramatic benefit in very young/pre-symptomatic patients. At age 6, this boy exceeds the approved age range. Nusinersen (intrathecal ASO) and risdiplam (oral) remain appropriate long-term options across all ages. Pre-existing anti-AAV9 antibodies are an exclusion criterion for onasemnogene. Combination therapy is being studied but is not standard of care.",
    resource: { label: "GeneReviews: Spinal Muscular Atrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/" }
  },
  {
    question: "A 40-year-old woman presents with subacute proximal weakness, a heliotrope rash, Gottron's papules, and V-sign erythema. CK is 2,800 IU/L. Chest CT shows ground-glass opacities. Myositis antibody panel shows anti-MDA5 positivity. What is the most critical concern in her management?",
    choices: [
      "High risk of thymoma — obtain chest CT",
      "Rapidly progressive interstitial lung disease (ILD) — a potentially fatal complication of anti-MDA5 dermatomyositis",
      "High risk of cardiac arrhythmia — initiate continuous telemetry",
      "Rhabdomyolysis — aggressive hydration required"
    ],
    answer: 1,
    explanation: "Anti-MDA5 (melanoma differentiation-associated gene 5) antibody-positive dermatomyositis is associated with clinically amyopathic DM and rapidly progressive interstitial lung disease (RP-ILD), which carries a high mortality (30–50% within 6 months if untreated). This is the most urgent concern — ILD progression can be rapid even when muscle disease is mild. Early aggressive immunosuppression (high-dose steroids + calcineurin inhibitor + IVIG or rituximab) is required. ILD surveillance with HRCT and pulmonary function tests is mandatory at diagnosis.",
    resource: { label: "PubMed: Anti-MDA5 DM and ILD (Romero-Bueno 2020)", url: "https://pubmed.ncbi.nlm.nih.gov/32198013/" }
  },
  {
    question: "An 8-year-old girl with a progressive myopathy has a muscle biopsy showing lipid droplet accumulation in type 1 fibers on oil red O stain, with normal acid alpha-glucosidase activity and normal CPT2 sequence. She has mild proximal weakness and responds dramatically to riboflavin supplementation. Which gene is most likely?",
    choices: [
      "ETFDH (electron transfer flavoprotein dehydrogenase) — riboflavin-responsive MADD",
      "CPT2 (carnitine palmitoyltransferase II)",
      "ACADL (long-chain acyl-CoA dehydrogenase)",
      "GAA (Pompe disease)"
    ],
    answer: 0,
    explanation: "Riboflavin-responsive multiple acyl-CoA dehydrogenase deficiency (MADD/glutaric aciduria type II) due to ETFDH mutations presents with lipid storage myopathy, proximal weakness, and dramatic response to riboflavin (vitamin B2). ETFDH encodes a component of the electron transfer chain that requires FAD (riboflavin-derived). Lipid droplets accumulate when fatty acid beta-oxidation is impaired. Riboflavin response distinguishes this from other lipid myopathies. Riboflavin + CoQ10 supplementation is the treatment. Urinary organic acids show multiple acylcarnitine elevations on acylcarnitine profile.",
    resource: { label: "PubMed: Riboflavin-Responsive MADD (Liang 2009)", url: "https://pubmed.ncbi.nlm.nih.gov/19370074/" }
  },
  {
    question: "A 55-year-old man presents with acute onset of severe unilateral shoulder and periscapular pain, followed within days by rapid proximal arm weakness and winging of the scapula. CK is 400 IU/L. EMG shows active denervation in a non-dermatomal pattern affecting the suprascapular and long thoracic nerves. MRI brachial plexus shows no mass. What is the most likely diagnosis?",
    choices: [
      "Cervical radiculopathy (C5–C6)",
      "Neuralgic amyotrophy (Parsonage-Turner syndrome / idiopathic brachial plexopathy)",
      "Multifocal motor neuropathy",
      "LGMD affecting shoulder-girdle muscles"
    ],
    answer: 1,
    explanation: "Neuralgic amyotrophy (Parsonage-Turner syndrome) presents with acute severe shoulder pain followed by rapid weakness and atrophy in the brachial plexus distribution — often affecting individual named nerves (suprascapular, long thoracic, anterior interosseous). EMG confirms active denervation in a multifocal, non-dermatomal pattern. Idiopathic form (most common) is thought to be immune-mediated, often triggered by infection, surgery, or vaccination. Hereditary NA (SEPT9 mutations) is clinically identical but recurrent. Most patients recover substantially over 1–3 years; high-dose steroids may shorten the painful phase.",
    resource: { label: "PubMed: Parsonage-Turner Syndrome (van Alfen 2011)", url: "https://pubmed.ncbi.nlm.nih.gov/21798399/" }
  },
  {
    question: "A 3-year-old girl has recurrent episodes of hypoglycemia and hypotonia during illness or fasting. Liver is enlarged. Between episodes she has mild proximal weakness. Biopsy of liver shows PAS-positive glycogen and reduced debranching enzyme activity. Which GSD subtype is this?",
    choices: [
      "GSD type I (glucose-6-phosphatase deficiency — von Gierke disease)",
      "GSD type III (amylo-1,6-glucosidase / debranching enzyme deficiency — Cori/Forbes disease)",
      "GSD type V (muscle phosphorylase / McArdle disease)",
      "GSD type II (acid alpha-glucosidase / Pompe disease)"
    ],
    answer: 1,
    explanation: "GSD type III (Cori/Forbes disease) is caused by amylo-1,6-glucosidase (debranching enzyme, AGL gene) deficiency. Glycogen accumulates with shortened outer chains in liver and/or muscle. Clinical features: hepatomegaly, hypoglycemia with fasting, and variable muscle involvement (myopathy + elevated CK). Unlike GSD I, fasting hypoglycemia is less severe (amino acid gluconeogenesis is intact). Unlike McArdle disease (GSD V), liver is also involved. Diagnosis: enzyme assay in blood or muscle, AGL gene sequencing. Management: frequent feeding, high-protein diet.",
    resource: { label: "GeneReviews: GSD Type III", url: "https://www.ncbi.nlm.nih.gov/books/NBK26372/" }
  },
  {
    question: "A 28-year-old man with SMA type 3 (walks independently, mild proximal weakness) asks about monitoring and preventive care. Which complication requires specific surveillance?",
    choices: [
      "Cardiac arrhythmia — annual Holter monitoring",
      "Respiratory failure and scoliosis — spirometry and spine imaging annually",
      "Renal impairment — annual renal function panel",
      "Hepatotoxicity from nusinersen — annual LFTs"
    ],
    answer: 1,
    explanation: "All SMA types require respiratory monitoring (spirometry, especially supine FVC) because diaphragmatic weakness can develop insidiously — even in ambulatory type 3 patients. Scoliosis is common and progressive, particularly with prolonged sitting. Annual respiratory function testing and spine surveillance with X-ray are standard. Nusinersen is intrathecally delivered and does not require hepatic monitoring. Cardiac arrhythmia is NOT a primary SMA complication (unlike DMD or Emery-Dreifuss MD). The respiratory and musculoskeletal complications drive morbidity in SMA.",
    resource: { label: "GeneReviews: Spinal Muscular Atrophy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1352/" }
  },
  {
    question: "A 45-year-old man has slowly progressive, symmetric proximal and distal weakness. EMG shows mixed neurogenic and myopathic features. Muscle biopsy shows intranuclear filamentous inclusions on EM, rimmed vacuoles, and TDP-43 positive inclusions. His father had dementia and bone pain. Serum alkaline phosphatase is elevated. What gene is most likely mutated?",
    choices: [
      "GNE (GNE myopathy — AR distal myopathy)",
      "VCP (multisystem proteinopathy — myopathy + Paget bone disease + FTD)",
      "MATR3 (matrin-3 — vocal cord and pharyngeal weakness + myopathy)",
      "HNRNPA2B1 (multisystem proteinopathy type)"
    ],
    answer: 1,
    explanation: "VCP (valosin-containing protein) mutations cause multisystem proteinopathy (MSP), previously called IBMPFD (Inclusion Body Myopathy + Paget disease of Bone + Frontotemporal Dementia). Not all three features need be present, but muscle disease + elevated alkaline phosphatase + FTD in a familial AD pattern is classic. Biopsy shows rimmed vacuoles and TDP-43 inclusions — identical histology to sIBM but in a younger patient with family history and multisystem involvement. VCP encodes an AAA+ ATPase for protein quality control; mutations impair ubiquitin-proteasome clearance.",
    resource: { label: "GeneReviews: VCP-Related Multisystem Proteinopathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1423/" }
  },
  {
    question: "A 25-year-old woman has bilateral symmetric sensorineural hearing loss, exercise intolerance, and a stroke-like episode at age 23 with a parieto-occipital lesion on MRI not conforming to any vascular territory. Lactate is 3.8 mmol/L. Her mother has diabetes and hearing loss. Genetic testing of muscle mtDNA shows 72% heteroplasmy for m.3243A>G. She is started on L-arginine. What is the rationale?",
    choices: [
      "L-arginine is an antioxidant that directly quenches reactive oxygen species in mitochondria",
      "L-arginine is an NO precursor that promotes vasodilation, improving cerebral blood flow during acute stroke-like episodes in MELAS",
      "L-arginine supplementation restores mtDNA copy number",
      "L-arginine inhibits mitochondrial cytochrome c oxidase to reduce oxidative stress"
    ],
    answer: 1,
    explanation: "In MELAS, stroke-like episodes are thought to result in part from impaired nitric oxide (NO) production in cerebral vessels (due to arginine depletion), causing vasospasm and metabolic crisis. IV L-arginine (NO precursor) during acute stroke-like episodes has been shown to reduce their severity and duration. Oral L-arginine prophylaxis is used long-term. The m.3243A>G mutation causes mitochondrial dysfunction that disproportionately affects high-energy tissues (brain, cochlea, pancreas, cardiac muscle). Maternal inheritance and multisystem involvement are characteristic.",
    resource: { label: "GeneReviews: MELAS", url: "https://www.ncbi.nlm.nih.gov/books/NBK1233/" }
  },
  {
    question: "A 19-year-old woman has had three episodes of painless optic neuropathy affecting one eye at a time over 5 years. Visual acuity is 20/200 in the left eye and 20/400 in the right. Brain and orbital MRI with gadolinium show no enhancement or demyelinating plaques. AQP4 and MOG antibodies are negative. What should be tested next?",
    choices: [
      "Repeat MRI with thinner slices to detect missed MS plaques",
      "Mitochondrial DNA testing for LHON mutations (m.11778G>A, m.3460G>A, m.14484T>C)",
      "Anti-AChR antibodies for ocular myasthenia gravis",
      "Genetic testing for hereditary optic neuropathy (OPA1 — autosomal dominant optic atrophy)"
    ],
    answer: 1,
    explanation: "Sequential painless bilateral optic neuropathy in a young woman without MRI lesions and negative AQP4/MOG antibodies raises strong suspicion for LHON (Leber hereditary optic neuropathy). Testing for the three primary LHON mutations (m.11778G>A ~70%, m.3460G>A ~15%, m.14484T>C ~15%) on blood mtDNA is the next step. While LHON has male predominance (~80–90% of affected individuals), females do develop the disease. Idebenone (EPI-743 analog) is FDA-approved for LHON. OPA1 mutations cause dominant optic atrophy, which is bilateral and gradual rather than sequential and acute.",
    resource: { label: "GeneReviews: Leber Hereditary Optic Neuropathy", url: "https://www.ncbi.nlm.nih.gov/books/NBK1174/" }
  },
  {
    question: "A 16-year-old girl has 3 months of bilateral ptosis and fatigable diplopia. Ice pack test is positive. AChR antibodies are positive at 28 nmol/L. Thyroid function tests are normal. Chest CT shows an anterior mediastinal mass. What is the next appropriate step?",
    choices: [
      "Start oral pyridostigmine and observe the mediastinal mass for 6 months",
      "Surgical resection of the thymoma (extended thymectomy) plus pyridostigmine — thymoma-MG requires thymectomy regardless of age",
      "Initiate rituximab for thymoma-associated MG",
      "Perform stereotactic radiosurgery of the thymoma first"
    ],
    answer: 1,
    explanation: "Thymoma-associated MG (approximately 15% of MG cases) requires surgical resection of the thymoma regardless of patient age, as thymoma is a neoplasm with malignant potential (WHO classification A, AB, B1, B2, B3). Extended transsternal thymectomy is the standard approach. Pyridostigmine is started for symptomatic management while surgical planning proceeds. Unlike non-thymomatous MG (where thymectomy age criteria apply), thymoma itself drives the recommendation — this is a cancer surgery indication, not just a MG management decision.",
    resource: { label: "NORD: Myasthenia Gravis", url: "https://rarediseases.org/rare-diseases/myasthenia-gravis/" }
  },
  {
    question: "A 33-year-old man develops severe myalgia and weakness in his thighs and shoulders after starting a new antiretroviral regimen for HIV. His CK is 18,000 IU/L. Muscle biopsy shows ragged-red fibers and mtDNA depletion. Which drug class is most likely responsible?",
    choices: [
      "Protease inhibitors (ritonavir)",
      "Nucleoside/nucleotide reverse transcriptase inhibitors (NRTIs — particularly zidovudine/AZT)",
      "Integrase inhibitors (dolutegravir)",
      "CCR5 antagonists (maraviroc)"
    ],
    answer: 1,
    explanation: "Nucleoside reverse transcriptase inhibitors (NRTIs), particularly zidovudine (AZT), cause mitochondrial myopathy by inhibiting mitochondrial DNA polymerase gamma (POLG), leading to mtDNA depletion in muscle. The result is a mitochondrial myopathy with ragged-red fibers, COX-negative fibers, and mtDNA depletion on biopsy — indistinguishable histologically from inherited mitochondrial myopathy. Switching to alternative antiretrovirals (non-NRTI based) leads to gradual improvement. This is an important iatrogenic cause of mitochondrial myopathy.",
    resource: { label: "PubMed: NRTI Mitochondrial Toxicity Review", url: "https://pubmed.ncbi.nlm.nih.gov/11244046/" }
  },
  {
    question: "A 20-year-old man presents with exercise-induced muscle cramps, myoglobinuria, and a CK of 250 IU/L at baseline. Ischemic forearm exercise test shows no lactate rise AND no ammonia rise. What is the most likely diagnosis?",
    choices: [
      "McArdle disease (PYGM) — no lactate rise only",
      "Myoadenylate deaminase deficiency (AMPD1) — no ammonia rise only",
      "Combined glycogenolytic and purine nucleotide cycle defect — or technical failure of the test",
      "Mitochondrial myopathy — both rises would be impaired"
    ],
    answer: 2,
    explanation: "In the ischemic (or non-ischemic) forearm exercise test: (1) No lactate rise + normal ammonia rise → glycogenolytic/glycolytic defect (McArdle, PFK deficiency, etc.); (2) Normal lactate rise + no ammonia rise → myoadenylate deaminase deficiency (AMPD1 mutations); (3) No rise in BOTH → either combined defect, inadequate effort, or technical failure (the most common explanation). When both are absent, the test should be repeated with careful attention to patient effort and ischemic occlusion. True combined defects exist but are rare.",
    resource: { label: "PubMed: Forearm Exercise Test Review (Vladutiu 2012)", url: "https://pubmed.ncbi.nlm.nih.gov/22543274/" }
  },
  {
    question: "A 9-year-old girl has slow and stuttering speech, difficulty swallowing, and tongue atrophy. She has progressive facial weakness and nasal voice. She is otherwise cognitively intact. No limb weakness. EMG shows fasciculations and chronic denervation in tongue and facial muscles. What diagnosis should be specifically considered in a child with this bulbar LMN phenotype?",
    choices: [
      "Bulbar-onset ALS",
      "Fazio-Londe disease / Brown-Vialetto-Van Laere syndrome (SLC52A2 or SLC52A3 riboflavin transporter deficiency)",
      "Myasthenia gravis (bulbar form)",
      "Kennedy disease (SBMA)"
    ],
    answer: 1,
    explanation: "Brown-Vialetto-Van Laere syndrome (BVVLS) / Fazio-Londe disease is caused by mutations in riboflavin transporter genes (SLC52A2 or SLC52A3), causing riboflavin deficiency in neural tissue. It presents in children/young adults with progressive bulbar palsy, sensorineural hearing loss, facial weakness, respiratory insufficiency, and LMN findings — but NO upper motor neuron signs and preserved cognition. Crucially, high-dose riboflavin supplementation can dramatically reverse or halt progression — making diagnosis urgent. This is a treatable motor neuron disease that mimics bulbar ALS.",
    resource: { label: "PubMed: BVVLS Riboflavin Therapy (Foley 2014)", url: "https://pubmed.ncbi.nlm.nih.gov/24459126/" }
  },
  {
    question: "A 14-year-old boy with severe scoliosis has an FVC of 38% predicted in the upright position and 22% supine (orthopnea). He has Duchenne MD and is still ambulatory. What is the recommended respiratory intervention?",
    choices: [
      "Tracheostomy and invasive ventilation immediately",
      "Nocturnal non-invasive positive pressure ventilation (NIPPV/BiPAP) — initiate based on respiratory criteria",
      "Observation; initiate NIPPV only when FVC falls below 20%",
      "Lung volume recruitment exercises only (air stacking)"
    ],
    answer: 1,
    explanation: "In DMD, current guidelines recommend initiating nocturnal non-invasive ventilation (BiPAP) when: FVC <50%, or when nocturnal hypoventilation is demonstrated (SpO2 <95% or end-tidal/transcutaneous CO2 elevation), or when orthopnea develops. This boy's FVC of 38% and marked orthopnea (>10% supine drop) meets clear criteria. Early initiation prolongs survival and quality of life. Tracheostomy (invasive ventilation) is reserved for failure of NIPPV or patient/family preference. Air stacking is a useful adjunct to maintain chest wall compliance but does not replace ventilatory support.",
    resource: { label: "GeneReviews: Duchenne & Becker MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1119/" }
  },
  {
    question: "A 50-year-old woman has a 15-year history of slowly progressive, painless weakness with wrist drop and foot drop. Her reflexes are diminished distally. NCS shows marked reduction in CMAP amplitudes with normal or near-normal conduction velocities bilaterally, consistent with axonal neuropathy. Her brother has a similar neuropathy. What gene is most commonly mutated in hereditary axonal neuropathy (CMT2)?",
    choices: [
      "PMP22 (CMT1A — demyelinating, conduction velocity slowing)",
      "MFN2 (CMT2A — axonal, most common CMT2 subtype)",
      "MPZ (CMT1B — demyelinating, variable age of onset)",
      "GDAP1 (CMT4A — autosomal recessive demyelinating)"
    ],
    answer: 1,
    explanation: "CMT2A, caused by dominant MFN2 mutations (mitofusin 2), is the most common subtype of axonal CMT (CMT type 2), accounting for ~20% of CMT2 cases. The NCS pattern is axonal: reduced CMAP amplitudes with relatively preserved (normal or near-normal) conduction velocities, reflecting axon loss rather than myelin dysfunction. CMT2A can be severe with early onset. CMT1A (PMP22 duplication) is the most common CMT overall but is demyelinating. MFN2 encodes a mitochondrial fusion protein critical for axonal mitochondrial transport.",
    resource: { label: "GeneReviews: CMT2A (MFN2-Related)", url: "https://www.ncbi.nlm.nih.gov/books/NBK1323/" }
  },
  {
    question: "You are evaluating a 5-year-old boy with a 3-year history of progressive proximal weakness. He has markedly elevated CK (15,000 IU/L), calf pseudohypertrophy, and Gowers' sign. Genetic testing of the DMD gene by MLPA and sequencing is negative — no deletion, duplication, or point mutation detected. What is the next appropriate step?",
    choices: [
      "Muscle biopsy is unnecessary; the diagnosis is excluded by negative genetic testing",
      "Muscle biopsy for dystrophin immunostaining and Western blot — deep intronic mutations, structural rearrangements, or epigenetic changes may be missed by standard panels",
      "Repeat MLPA in 12 months to check for somatic mosaicism",
      "Diagnose as LGMD and begin rehabilitation only"
    ],
    answer: 1,
    explanation: "Standard DMD genetic testing (MLPA + Sanger/NGS sequencing) misses approximately 1–2% of pathogenic variants — including deep intronic mutations causing pseudoexon inclusion, complex rearrangements, and somatic mosaicism. In a phenotypically classic DMD presentation (age, CK, calf pseudohypertrophy, Gowers'), muscle biopsy with dystrophin immunohistochemistry and Western blot should be performed: absent or markedly reduced dystrophin confirms the diagnosis and permits targeted RNA-level testing (RT-PCR) to identify the causative variant. Whole-genome sequencing and RNA sequencing of muscle are increasingly used.",
    resource: { label: "GeneReviews: Duchenne & Becker MD", url: "https://www.ncbi.nlm.nih.gov/books/NBK1119/" }
  },
  {
    question: "A 30-year-old woman has a 4-year history of progressive fatigue, proximal weakness, and hair loss. She is found to have anti-signal recognition particle (SRP) antibodies and CK of 9,000 IU/L. Muscle biopsy shows necrotic and regenerating fibers with MHC-I upregulation and minimal lymphocytic inflammation. What is the diagnosis and recommended initial treatment?",
    choices: [
      "Polymyositis — prednisone 1 mg/kg/day monotherapy",
      "Anti-SRP immune-mediated necrotizing myopathy (IMNM) — combination immunotherapy with prednisone + IVIG ± rituximab",
      "Dermatomyositis — prednisone + hydroxychloroquine",
      "Inclusion body myositis — no effective immunotherapy"
    ],
    answer: 1,
    explanation: "Anti-SRP IMNM is one of two antibody-defined IMNM subtypes (anti-SRP and anti-HMGCR). It presents with aggressive, often severe weakness and very high CK, and responds poorly to prednisone alone. Current evidence favors combination therapy: high-dose prednisone + IVIG (monthly) as initial treatment, with rituximab added for refractory cases. Anti-SRP antibody titers correlate with disease activity. The muscle biopsy shows necrotizing myopathy without the dense inflammation of polymyositis — this distinction is critical, as treatment approaches differ.",
    resource: { label: "PubMed: IMNM Consensus (Mammen 2020)", url: "https://pubmed.ncbi.nlm.nih.gov/32487399/" }
  },
  {
    question: "A 13-year-old girl has been evaluated for apparent 'stress-related' weakness. She fatigues rapidly during the school day but improves after napping. She has bilateral ptosis that worsens in the afternoon and a 'myasthenic snarl' (horizontal smile). Repetitive nerve stimulation shows 18% decrement at 3 Hz. She has no thymoma. Which test would be most specific for the diagnosis?",
    choices: [
      "Anti-AChR antibodies — if positive, diagnostic",
      "Single-fiber EMG — most sensitive and specific test for NMJ transmission failure, even if antibodies are negative",
      "Tensilon (edrophonium) test — most specific test available",
      "Thyroid function tests — myasthenia is often thyroid-related in teenagers"
    ],
    answer: 1,
    explanation: "Single-fiber EMG (SFEMG) is the most sensitive test for neuromuscular junction dysfunction, detecting abnormal jitter and blocking in >95% of generalized MG even in seronegative cases. RNS decrement (already positive at 18%) supports NMJ disease, but SFEMG is more sensitive for confirming the diagnosis. Edrophonium (Tensilon) test has fallen out of favor due to cardiovascular risks. AChR antibodies are positive in ~85% of generalized MG but this patient may be in the seronegative 15%. SFEMG is the gold standard confirmatory test.",
    resource: { label: "NORD: Myasthenia Gravis", url: "https://rarediseases.org/rare-diseases/myasthenia-gravis/" }
  },
  {
    question: "A 65-year-old man has a 2-year history of wasting and weakness in both hands. He cannot extend his wrists or fingers on the right, and has prominent thenar wasting bilaterally. He recently noticed difficulty rising from a chair. There are NO sensory symptoms. EMG shows chronic denervation in C8-T1 distribution bilaterally and diffuse fasciculations including the tongue. He has brisk jaw jerk and bilateral Babinski signs. What is the most likely diagnosis?",
    choices: [
      "Multifocal motor neuropathy (MMN)",
      "Amyotrophic lateral sclerosis (ALS) — combined upper and lower motor neuron signs",
      "Cervical myelopathy with bilateral C8 radiculopathy",
      "Kennedy disease (SBMA)"
    ],
    answer: 1,
    explanation: "The combination of lower motor neuron signs (fasciculations, atrophy, denervation on EMG including bulbar region) AND upper motor neuron signs (Babinski, brisk jaw jerk) at multiple levels (bulbar, cervical, lumbar) fulfills El Escorial/revised Awaji criteria for definite ALS. Tongue fasciculations confirm bulbar LMN involvement. MMN is pure LMN without UMN signs. Kennedy disease is X-linked, has LMN only, and involves gynecomastia/endocrine features. Cervical myelopathy would not explain tongue fasciculations or brisk jaw jerk.",
    resource: { label: "NORD: Amyotrophic Lateral Sclerosis", url: "https://rarediseases.org/rare-diseases/amyotrophic-lateral-sclerosis/" }
  },

];

daily.questions = [...daily.questions, ...newQuestions];

fs.writeFileSync(filePath, JSON.stringify(daily, null, 2));
console.log(`Done. Total questions: ${daily.questions.length}`);
