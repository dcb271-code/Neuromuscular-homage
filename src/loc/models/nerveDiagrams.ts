// Schematic nerve diagrams for the lesion ladders (src/loc/models/ladder.ts). Our own drawings:
// branch order follows Gray's Anatomy 1918 (public domain; plates 788, 818, 832) and the ladder
// sources (Brazis 2011, pp. 43-45, 93, 95, 322-327; Pearl 2014, pp. 49-52, 83, 87-88).
// Pure data: each rung of a ladder names where its lesion sits and which branches it removes.

export interface DiagramPart {
  id: string;
  d: string;                                            // SVG path
  kind: 'trunk' | 'branch' | 'other' | 'struct';         // other = a different nerve or pathway
  label?: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end' };
}
export interface DiagramRung { at: [number, number]; lost: string[]; hit?: string[] }
export interface NerveDiagram { viewBox: string; parts: DiagramPart[]; boxes?: { x: number; y: number; w: number; h: number; text: string }[]; rungs: Record<string, DiagramRung> }

export const NERVE_DIAGRAMS: Record<string, NerveDiagram> = {
  facial: {
    viewBox: '0 0 680 288',
    boxes: [
      { x: 8, y: 14, w: 120, h: 34, text: 'Motor cortex' },
      { x: 110, y: 104, w: 130, h: 92, text: '' },
    ],
    parts: [
      { id: 'cb', kind: 'other', d: 'M60 48 C60 90 120 110 150 140', label: { x: 64, y: 78, text: 'to the opposite face', anchor: 'start' } },
      { id: 'cb2', kind: 'other', d: 'M20 48 C20 120 100 150 146 146', label: { x: 8, y: 214, text: 'Forehead input comes from both hemispheres', anchor: 'start' } },
      { id: 'nucleus', kind: 'struct', d: 'M142 150 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', label: { x: 150, y: 176, text: 'VII nucleus' } },
      { id: 'pons-label', kind: 'struct', d: '', label: { x: 118, y: 190, text: 'Pons', anchor: 'start' } },
      { id: 'gaze', kind: 'other', d: 'M196 128 h28 v16 h-28 z', label: { x: 210, y: 122, text: 'gaze center' } },
      { id: 'cst', kind: 'other', d: 'M228 104 V196', label: { x: 236, y: 190, text: 'motor tract', anchor: 'start' } },
      { id: 'iac', kind: 'trunk', d: 'M158 150 H330' },
      { id: 'viii', kind: 'other', d: 'M250 138 H322', label: { x: 286, y: 130, text: 'VIII: hearing' } },
      { id: 'petrosal', kind: 'branch', d: 'M330 150 C360 120 400 80 460 64', label: { x: 466, y: 68, text: 'Tears (lacrimal gland)', anchor: 'start' } },
      { id: 'trunk1', kind: 'trunk', d: 'M330 150 C344 160 350 172 352 186' },
      { id: 'stapedius', kind: 'branch', d: 'M352 186 C390 182 420 176 450 176', label: { x: 456, y: 180, text: 'Stapedius: damps loud sound', anchor: 'start' } },
      { id: 'trunk2', kind: 'trunk', d: 'M352 186 C356 200 358 210 360 218' },
      { id: 'chorda', kind: 'branch', d: 'M360 218 C400 214 430 210 470 212', label: { x: 476, y: 216, text: 'Taste, front of tongue; saliva', anchor: 'start' } },
      { id: 'trunk3', kind: 'trunk', d: 'M360 218 C362 232 364 242 366 250' },
      { id: 'f-temporal', kind: 'branch', d: 'M366 250 C400 236 430 230 470 236', label: { x: 476, y: 240, text: 'Forehead', anchor: 'start' } },
      { id: 'f-lower', kind: 'branch', d: 'M366 250 C400 254 430 258 470 262 M366 250 C400 262 430 272 470 280', label: { x: 476, y: 272, text: 'Eye closure, mouth, chin', anchor: 'start' } },
    ],
    rungs: {
      face: { at: [366, 246], lost: ['f-temporal', 'f-lower'] },
      taste: { at: [357, 204], lost: ['f-temporal', 'f-lower', 'trunk3', 'chorda'] },
      stapedius: { at: [345, 170], lost: ['f-temporal', 'f-lower', 'trunk3', 'chorda', 'trunk2', 'stapedius'] },
      tears: { at: [318, 150], lost: ['f-temporal', 'f-lower', 'trunk3', 'chorda', 'trunk2', 'stapedius', 'trunk1', 'petrosal'] },
      canal: { at: [286, 146], lost: ['f-temporal', 'f-lower', 'trunk3', 'chorda', 'trunk2', 'stapedius', 'trunk1', 'petrosal', 'iac', 'viii'] },
      pons: { at: [150, 150], lost: ['f-temporal', 'f-lower', 'trunk3', 'trunk2', 'trunk1', 'iac'], hit: ['nucleus', 'gaze', 'cst'] },
      cortex: { at: [128, 31], lost: ['f-lower'], hit: ['cb'] },
    },
  },
  radial: {
    viewBox: '0 0 680 268',
    boxes: [{ x: 8, y: 20, w: 78, h: 30, text: 'C7 root' }],
    parts: [
      { id: 'root-median', kind: 'other', d: 'M86 35 C140 30 200 30 260 34', label: { x: 266, y: 38, text: 'Median nerve: pronation, wrist flexion', anchor: 'start' } },
      { id: 'cord', kind: 'trunk', d: 'M86 42 C110 70 130 90 150 104' },
      { id: 'axillary', kind: 'branch', d: 'M150 104 C190 84 220 76 260 74', label: { x: 266, y: 78, text: 'Axillary nerve: deltoid', anchor: 'start' } },
      { id: 'trunk-ax', kind: 'trunk', d: 'M150 104 C170 120 185 130 200 136' },
      { id: 'triceps', kind: 'branch', d: 'M200 136 C240 120 270 114 300 112', label: { x: 306, y: 116, text: 'Triceps; skin, back of arm', anchor: 'start' } },
      { id: 'groove', kind: 'trunk', d: 'M200 136 C250 150 300 158 340 162', label: { x: 268, y: 170, text: 'spiral groove' } },
      { id: 'br', kind: 'branch', d: 'M340 162 C380 146 410 138 440 136', label: { x: 446, y: 140, text: 'Brachioradialis', anchor: 'start' } },
      { id: 'wrist', kind: 'branch', d: 'M350 168 C390 168 410 168 440 168', label: { x: 446, y: 172, text: 'Wrist extensors', anchor: 'start' } },
      { id: 'trunk-elbow', kind: 'trunk', d: 'M340 162 C360 176 372 190 380 200' },
      { id: 'superficial', kind: 'branch', d: 'M380 200 C410 196 430 194 460 196', label: { x: 466, y: 200, text: 'Skin, back of hand by the thumb', anchor: 'start' } },
      { id: 'pin', kind: 'branch', d: 'M380 200 C400 220 420 236 460 244', label: { x: 466, y: 248, text: 'Finger and thumb extensors', anchor: 'start' } },
    ],
    rungs: {
      pin: { at: [398, 218], lost: ['pin'] },
      groove: { at: [300, 158], lost: ['pin', 'superficial', 'trunk-elbow', 'br', 'wrist', 'groove'] },
      axilla: { at: [182, 126], lost: ['pin', 'superficial', 'trunk-elbow', 'br', 'wrist', 'groove', 'triceps', 'trunk-ax'] },
      cord: { at: [118, 76], lost: ['pin', 'superficial', 'trunk-elbow', 'br', 'wrist', 'groove', 'triceps', 'trunk-ax', 'axillary', 'cord'] },
      c7: { at: [86, 35], lost: ['triceps', 'wrist', 'pin', 'root-median'], hit: ['cord'] },
    },
  },
  footdrop: {
    viewBox: '0 0 680 262',
    boxes: [{ x: 8, y: 20, w: 78, h: 30, text: 'L5 root' }],
    parts: [
      { id: 'sup-gluteal', kind: 'other', d: 'M86 35 C140 30 200 28 250 30', label: { x: 256, y: 34, text: 'Superior gluteal nerve: hip abduction', anchor: 'start' } },
      { id: 'sciatic', kind: 'trunk', d: 'M86 42 C120 70 160 96 220 112', label: { x: 150, y: 112, text: 'sciatic nerve' } },
      { id: 'hamstrings', kind: 'branch', d: 'M180 100 C220 86 250 80 290 78', label: { x: 296, y: 82, text: 'Hamstrings', anchor: 'start' } },
      { id: 'tibial', kind: 'trunk', d: 'M220 112 C260 114 290 118 320 122', label: { x: 268, y: 106, text: 'tibial' } },
      { id: 'tibpost', kind: 'branch', d: 'M320 122 C350 112 380 108 410 108', label: { x: 416, y: 112, text: 'Inversion (tibialis posterior)', anchor: 'start' } },
      { id: 'calf', kind: 'branch', d: 'M320 122 C350 134 380 142 410 144', label: { x: 416, y: 148, text: 'Plantar flexion; skin of the sole', anchor: 'start' } },
      { id: 'common', kind: 'trunk', d: 'M220 112 C250 140 270 160 300 176', label: { x: 230, y: 168, text: 'common peroneal', anchor: 'end' } },
      { id: 'superficialp', kind: 'branch', d: 'M300 176 C340 182 370 186 410 188', label: { x: 416, y: 192, text: 'Eversion; skin, outer shin and top of foot', anchor: 'start' } },
      { id: 'deep', kind: 'branch', d: 'M300 176 C320 200 340 216 380 228', label: { x: 386, y: 232, text: 'Dorsiflexion, toe extension; first web space', anchor: 'start' } },
    ],
    rungs: {
      deep: { at: [320, 200], lost: ['deep'] },
      common: { at: [272, 158], lost: ['deep', 'superficialp', 'common'] },
      sciatic: { at: [150, 84], lost: ['deep', 'superficialp', 'common', 'tibial', 'tibpost', 'calf', 'hamstrings', 'sciatic'] },
      l5: { at: [86, 35], lost: ['deep', 'superficialp', 'sup-gluteal', 'tibpost'], hit: ['sciatic'] },
    },
  },
};
