// "Which map does the deficit obey?" Every mechanism respects a different map of the body:
// strokes respect arteries (Pearl 2014, p. 7), axonal neuropathies respect length (p. 76),
// roots respect dermatomes and myotomes (p. 78), single nerves their own territory (pp. 83-88; Brazis 2011, pp. 44-45),
// the cord a level (pp. 66-68), system degenerations a set of tracts (pp. 64, 73), and tumors
// grow across boundaries (p. 10). The map is the bridge from where to what.

export type MapId = 'artery' | 'length' | 'segment' | 'nerve' | 'level' | 'system' | 'none';
export const MAPS: { id: MapId; name: string; obeys: string; suggests: string }[] = [
  { id: 'artery', name: 'Arterial territory', obeys: 'The blood supply: face and arm together, or leg alone', suggests: 'Vascular: sudden onset, maximal at once' },
  { id: 'length', name: 'Length of the axon', obeys: 'Distance from the cell body: toes first, then shins, hands only later', suggests: 'Axonal neuropathy: toxic, metabolic, nutritional or genetic' },
  { id: 'segment', name: 'One root segment', obeys: 'A dermatome and its myotome, with its reflex', suggests: 'Root compression or inflammation' },
  { id: 'nerve', name: 'One nerve territory', obeys: 'The muscles and skin of a single named nerve', suggests: 'Compression, trauma or entrapment; several nerves at once suggest vasculitis' },
  { id: 'level', name: 'A level on the cord', obeys: 'Everything below a line on the trunk, often with the bladder', suggests: 'Cord compression, myelitis or trauma' },
  { id: 'system', name: 'A system of tracts', obeys: 'Particular tracts on both sides, wherever they run', suggests: 'Degeneration or deficiency: genetic, nutritional, toxic' },
  { id: 'none', name: 'No map', obeys: 'Boundaries crossed as the deficit grows', suggests: 'A mass growing through tissue, or several lesions' },
];

export interface MapCase { id: string; pattern: string; answer: MapId; why: string; cite: string }
export const MAP_CASES: MapCase[] = [
  { id: 'mca', pattern: 'A 9-year-old with sickle cell disease: right face and arm suddenly weak, leg only slightly, words will not come.', answer: 'artery', why: 'Face and arm far weaker than leg is the middle cerebral artery\'s territory on the motor strip; the language loss puts it on the left.', cite: 'Pearl 2014, pp. 7, 10' },
  { id: 'vinca', pattern: 'A 6-year-old on chemotherapy: tingling toes for weeks, then shins; the ankle jerks went first; the hands have only just started.', answer: 'length', why: 'The longest axons fail first, so the deficit climbs the legs before it reaches the hands.', cite: 'Pearl 2014, p. 76' },
  { id: 's1', pattern: 'A 15-year-old gymnast: pain shooting from the buttock down the back of the leg to the little toe, a weak push-off and a lost ankle jerk on that side.', answer: 'segment', why: 'Pain, weakness, sensory loss and a reflex that all belong to one segment (S1) mark a root.', cite: 'Pearl 2014, pp. 77-78' },
  { id: 'radial', pattern: 'An 8-year-old after a fracture of the upper arm: the wrist and fingers hang, a numb patch sits on the back of the hand by the thumb, and the triceps is strong.', answer: 'nerve', why: 'Every deficit belongs to the radial nerve below its branch to triceps, and no muscle from another nerve on the same roots is weak.', cite: 'Brazis 2011, pp. 44-45' },
  { id: 'myelitis', pattern: 'A 12-year-old: both legs weak and numb up to the umbilicus over two days, unable to pass urine.', answer: 'level', why: 'A line on the trunk below which everything fails, with the bladder, belongs to the cord.', cite: 'Pearl 2014, pp. 66-68' },
  { id: 'fa', pattern: 'A 13-year-old with high arches: clumsy, no ankle jerks, lost vibration and position sense, yet both toes go up.', answer: 'system', why: 'Absent reflexes with upgoing toes is two systems failing at once (sensory fibers and corticospinal tracts) on both sides, as in Friedreich ataxia.', cite: 'Pearl 2014, p. 64' },
  { id: 'b12', pattern: 'A 16-year-old on a restrictive diet: tingling feet, lost vibration and position sense in the legs, brisk knees and upgoing toes.', answer: 'system', why: 'Dorsal columns and corticospinal tracts together, symmetric and tract-selective: the map of a deficiency, not of a place.', cite: 'Pearl 2014, pp. 73-74' },
  { id: 'tumour', pattern: 'A 10-year-old: a left hand that grew clumsy over two months, then the leg, then morning headaches; the weakness has no clear arterial edge.', answer: 'none', why: 'A deficit that creeps across territories and keeps growing is obeying no vascular map: think of a mass.', cite: 'Pearl 2014, p. 10' },
];

export function checkMap(caseId: string, choice: MapId) {
  const c = MAP_CASES.find(x => x.id === caseId)!;
  return { correct: c.answer === choice, answer: MAPS.find(m => m.id === c.answer)!, why: c.why, cite: c.cite };
}
