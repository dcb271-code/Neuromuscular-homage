# The Neurogenetics Portal learning curriculum: a brief for building a companion EEG site

_Written 2026-09-30 from the code at `neurogenetics.app` (repo `neurogenetics-portal`). It is for
a Claude agent building a complementary EEG learning site or page. It describes what exists,
why it is shaped that way, and which parts to copy and which to leave behind._

---

## 0. The one-paragraph version

The portal teaches clinical neurogenetics to clinicians and trainees in two ways.
**(A) Slide modules** (`/learn/<topic>`): six 30-slide, 10-question, board-style modules. Each
is a paged deck of numbered bullets, one "Clinical Pearl" per slide, a cited source line,
gene pills that jump into the live gene pages, and an answer-with-explanation quiz. The
modules cover epilepsy/channelopathies, mitochondrial disease, movement disorders, muscle,
the motor unit, and brain malformations.
**(B) Computed teaching figures** (`/learn/variant-types/*`, and step 1 of every variant
page's Learning View): figures that *run a model*, not pictures of one. A toy gene is spliced,
translated and NMD-called on screen, and the same engine then runs on the real transcript of
whatever variant the reader looked up.
(B) is the newer design and the owner's direction of travel. An EEG companion should take
(A)'s content discipline and (B)'s "compute, don't draw" philosophy, and should avoid (A)'s
visual chrome, which predates the portal's current palette rules.

---

## 1. The audience and the stance

- **Audience:** practising neurologists, neurology and genetics trainees, and genetic
  counsellors. The owner is a clinician-developer in paediatric neurogenetics. Readers are
  assumed to know medicine but not necessarily the molecular or electrophysiological
  mechanism.
- **Register:** a senior colleague teaching at the bedside, not a textbook. Slides open with
  why the topic matters clinically, move to mechanism, and land on what you would do
  differently on Monday.
- **The organising question is always clinical:** "what should I order / avoid / tell the
  family?" Mechanism is taught because it predicts management. For example, SCN1A
  loss-of-function sits in inhibitory interneurons, so sodium-channel blockers make Dravet
  worse.
- **Humility is part of the content.** "Not for clinical decision-making. Consult primary
  sources" is in every module footer. Contested or fast-moving claims are dated and cited.
  Investigational therapies are never presented as available.
- **Teach intuitions in human units.** This is the owner's explicit preference across the
  portal. Examples: "1 in 51 people carry a rare missense in SCN1A; 1 in 5,200 a truncating
  one", and "protein ends after 273 of 539 residues → NMD predicted". Prefer a sentence a
  person can picture to a score.

---

## 2. Generation A: the slide modules (mechanics)

### 2.1 Anatomy of a module

```
app/learn/<slug>/page.tsx            ~12 lines: metadata + <XModule/>
components/<topic>/<X>Module.tsx     ~700-line client component (deck + quiz + outline)
lib/data/<topic>-slides.ts           SLIDES: Slide[] (30) + <X>_QUIZ: QuizQuestion[] (10)
public/<slug>/images/*.svg           bespoke diagrams (e.g. heteroplasmy threshold, ETC)
public/<slug>/source-slides/*.png    screenshots from the owner's own lecture decks, cited
app/learn/page.tsx                   the index: one card per module (emoji, title, subtitle,
                                     description, slide/quiz counts, gene tags, status)
```

**Data shape.** This is the contract. Keep it, because it is what makes content editable.

```ts
interface Slide {
  id: number; part: number; partTitle: string;
  title: string; subtitle?: string;            // subtitle = the slide's thesis in one line
  body: string[];                              // 4–6 dense numbered points, rarely >7
  clinicalPearl?: string;                      // ONE practice-changing takeaway
  image?: string; imageAlt?: string;           // alt text doubles as the caption
  imagePosition?: 'right' | 'below' | 'full';
  imageGrid?: { src: string; label: string; alt?: string }[];   // 2×2, e.g. MRI patterns
  gene?: string;                               // renders a mono pill → /gene/<SYMBOL>
  source?: string;                             // "Author et al., Journal Year; …"
}
interface QuizQuestion {
  question: string; options: string[]; correctIndex: number;
  explanation: string;                         // teaches why the right answer is right AND why the tempting wrong one is wrong
  topic: string;                               // shown in results so the reader knows what to revisit
}
```

### 2.2 Structure of the 30 slides

- **5–7 "Parts"**, each with its own colour, an icon, and a short label for the part-jump
  chips.
- The arc is always the same:
  1. **Foundations** (why it matters, core biology)
  2. **Mechanism families or diagnostic approach**
  3. **Named entities** (syndromes / genes), one per slide
  4. **Cross-cutting synthesis** (for epilepsy: "GoF vs LoF — same gene, opposite
     treatment", "Timing is everything — age-of-onset signatures", "Medication selection by
     channelopathy")
  5. **Two or three annotated clinical cases**
  6. **A "Key pearls" closing slide**
- **Case slides use a fixed voice:** PRESENTATION → INITIAL WORKUP → (evolution) → GENETIC
  TESTING → MANAGEMENT → FOLLOW-UP, in capitalised lead-ins. The pearl then generalises the
  case ("Red flags for Dravet: onset 5–8 months, febrile hemiclonic status… genetics should
  NOT wait for MRI abnormality").
- **The closing slide** is a list of 🔑 one-liners that could be taped to a workstation
  ("Neonatal burst-suppression with normal MRI → rapid trio WES").

### 2.3 Interaction

- Previous / Next buttons, a progress bar ("Slide 12 of 30 · 40% complete"), and a
  scroll-to-top on every change.
- A sticky outline sidebar on desktop, collapsible on mobile. Part chips below the slide
  jump to the first slide of each part.
- Images are click-to-zoom in a lightbox (Esc closes). A broken image hides itself rather
  than showing a broken box.
- **The quiz** follows a strict sequence:
  1. Select, then "Check Answer". Nothing is revealed until the reader commits.
  2. The reveal colours the correct option and strikes through the reader's wrong one.
  3. The explanation appears.
  4. The results page shows a score ring and a per-question topic list with ✓/✗, plus
     "Try Again".
- **Curator layer (Supabase):** admins can edit a slide or quiz item and append slides to a
  part. Edits go through **draft → publish**; a visitor sees nothing until an admin
  publishes. A per-module **Further Reading** list is typed review / primary / guideline /
  trial / textbook. The static TypeScript is the baseline; overrides merge on top, so the
  page works with the database down.

### 2.4 Content discipline

These are the rules the existing content actually follows.

- **Every slide cites.** The `source` line names the review or guideline behind its claims.
  The module footer lists the load-bearing sources (e.g. Gorman 2016 Nat Rev Dis Primers,
  GeneReviews, Parikh 2015 GIM for mito; Zuberi 2022 ILAE gene curation for epilepsy).
- **Numbers are specific and sourced.** Examples: "lactate sensitivity only 34–62%,
  specificity 83–100% (Parikh 2015 Delphi)"; "113 gene–disease associations (Heath 2025)".
- **Bold claims come in CAPS sparingly**, reserved for the fact that flips management:
  "NEVER give lamotrigine", "Complex II is ENTIRELY nuclear-encoded".
- **Explain the counter-intuitive** at the point where a clinician would get it wrong:
  - a normal lactate does not exclude mitochondrial disease
  - single mtDNA deletions are usually undetectable in blood in adults
  - a de novo single deletion carries <1% sibling recurrence
- **Pitfall slides are first-class** ("Testing Pitfalls: Which Tissue, Which Test?"). The
  most common mistake gets named outright.
- **Gene pills tie teaching to live data.** A slide about SCN1A links to the portal's SCN1A
  page (constraint, ClinVar, lollipop, therapy card). The module teaches the pattern; the
  gene page shows the evidence.

---

## 3. Generation B: computed teaching figures (philosophy + mechanics)

This is where the portal is heading. It is the part most worth carrying into an EEG site.

### 3.1 "Compute, don't draw"

The figures run a real model, and what is on screen is the model's output.
`lib/learn/toy-gene.ts` builds a seeded, stop-free coding sequence, applies the edit,
splices, translates, finds the first in-frame stop, and applies an explicit, cited NMD rule
set. When the reader drags a variant along the exon, the premature stop and the NMD fate
are **recomputed**, so the reader learns the frame arithmetic because it actually happens.
The same engine then runs on the **real** transcript of whatever variant the reader opened.
The toy teaches; the real case confirms.

Rules that came with it:
- **Pure engine, unit-tested, no I/O.** The UI is a thin view over deterministic functions.
- **One engine behind every picture.** The coding figure, the splice step and the ACMG card
  read the same inputs, so they cannot disagree. Anything a model cannot know is labelled
  (e.g. "illustrative toy gene", "NMDetective-B, not PVS1"), never drawn as fact.
- **Walk-through + explore.** Each figure has a guided five-step "deck" (keyboard ←/→,
  scoped to the focused figure, never the whole window) and a free-play mode with sliders
  and preset chips ("the frameshift that escapes NMD").
- **Data-derived vs mechanistic rules are visually distinct.** Rules the clinical
  classifier uses are drawn solid. Rules that come from data fitting, with limited direct
  validation, are **hatched** and captioned. Uncertainty is part of the lesson.
- **Refuse to guess.** Where the model cannot decide, the picture shows nothing (null) or a
  dashed, dimmed state, never a confident guess.

### 3.2 Embedding in the clinical tool: "Learning Mode"

- A **Learning Mode** toggle in the nav turns on a simplified, stepwise view of each variant
  page:
  - "0 · Is this gene known to cause disease?"
  - "1 · What kind of change is it?"
  - "How rare is it?"
  - …
- Each step is **collapsed by default** and its row carries the verdict alone ("Frameshift
  in exon 15 of 16 · new stop in last exon · escapes NMD"). Opening it shows the figure.
- **Jargon is defined in place:** a dotted-underline term (`GlossaryTerm`) or a "?"
  (`InfoTip`), both through ONE shared popover primitive and ONE glossary file that also
  powers a `/glossary` page. Never invent a second tooltip style.
- Guided **tours** (overlay + popovers) walk a newcomer through a page.

---

## 4. Aesthetics

### 4.1 The current rules (follow these, not the older modules)

- **Warm neutral ramp** (stone-like greys, `#fafaf9` → `#1c1917`), not Tailwind's cool
  slate. Type is **Source Sans 3** for text and **IBM Plex Mono** for data (gene symbols,
  HGVS, numbers).
- **Hairline card separation:** one 1px border, no border + shadow + tint triple.
- **Colour is meaning, never decoration.** Red / orange / amber / green are *spent* on
  classification on this site (pathogenic → benign; **amber = VUS**), so UI chrome and
  warnings never use them. A warning is a `Notice`: a 3px left rule plus a heading, in
  neutral or the "clinical" sky ramp, never a yellow box.
- **Figure tokens** (`components/learn/figure-ui.tsx`), each with one meaning:
  - exon/CDS blue `#2563eb`
  - premature stop / NMD red `#dc2626`
  - in-frame teal `#0d9488`
  - frameshift / cryptic / uncertain violet `#7c3aed`
  - ink `#111827`, sub `#4b5563`, mute `#9ca3af`, line `#d1d5db`
  - hatch patterns for "no data" and "data-derived rule"
- **Missing data is drawn as missing:** hatched, never zero. A coverage gap must never read
  as "no variants". A low-confidence estimate is greyed with "≈".
- **At a glance: a title, ONE sentence, a small pill.** Everything else goes behind hover
  or expand. The owner pushed back twice on text-heavy first drafts.
- **Phone-first.** The owner reads on a phone. Check every layout at 390 px, with no
  horizontal scroll.

### 4.2 What the slide modules do that you should not copy

The slide modules predate these rules. They use:
- a sky → violet gradient header
- emoji part icons (⚡🔬🏥📋💊🧩)
- per-part rainbow tints that include amber, orange and rose
- a 💡 emoji on the pearl box
- ~700-line components duplicated per module (a deliberate choice in May 2026, now a
  maintenance cost)
- some diagram SVGs with hard-coded Arial and a green → amber → red gradient

For an EEG site:
- use one shared deck component parameterised by module
- use the warm neutral ramp
- give parts a restrained palette whose hues do not collide with any clinical encoding
- use shape or position for part identity rather than emoji

---

## 5. Didactic design, distilled

These principles recur across both generations.

1. **Anchor every mechanism to a decision.** If a fact would not change what a clinician
   orders, avoids, or says, it is background, not a bullet.
2. **Show the error you are preventing.** Name the tempting wrong move ("ordering only blood
   mtDNA for a suspected single deletion") and why it fails.
3. **Build patterns in parts, then synthesise across them.** A slide like "age of onset is
   a diagnostic fingerprint: hours/days → KCNQ2 or metabolic; months → SCN1A; years →
   CACNA1A" only lands after the per-gene slides.
4. **Cases close the loop.** They are realistic, staged in time, and end in a pearl that
   generalises.
5. **Retrieval practice with explanation.** Quiz questions are clinical vignettes, and the
   explanation teaches the distractors too.
6. **Let the reader manipulate the mechanism.** Sliders over real models beat static
   diagrams. Walk-through first, then free play.
7. **Label your epistemic tier.** Mechanism, validated rule, data-derived heuristic, and
   prediction each look different. "Possible outcomes — which one the cell uses is what an
   RNA study shows."
8. **Link teaching to live evidence.** From a concept, one click reaches the real gene page
   with ClinVar, gnomAD, curation and therapy data.
9. **Never let a teaching number read as a classification or a prescription.** Decision
   support is cited; "not prescribing" is stated.

---

## 6. Suggestions for the EEG companion

These are **proposals, not portal decisions.** Confirm with the owner.

**Where the two sites meet**

The epilepsy module already leans on EEG: burst-suppression in KCNQ2/STXBP1 neonates,
multifocal discharges emerging in Dravet, and age-of-onset signatures. An EEG site can own
the electrophysiology those slides assume. A slide on "burst-suppression" should be able to
link out to the EEG page, and the EEG page should link back to `/gene/KCNQ2` and the
epilepsy module.

**Generation-B ideas for EEG** (each is a pure, testable model with a view on top):

- **Montage calculator.** Put a synthetic dipole (or a few) on a toy head. Compute the scalp
  potentials, then render referential, bipolar double-banana, and average-reference
  montages from the **same** potentials. The reader moves the dipole and watches phase
  reversals appear and move. The lesson: localisation is arithmetic on differences, and a
  montage is a choice of subtraction.
- **Filter and sampling lab.** Take a known signal (spike, sharp wave, alpha, artefact) and
  apply high-pass, low-pass and notch filters and sampling rate. Show what each does to a
  spike's morphology. The lesson is why "sharp" depends on the filter.
- **Pattern → mechanism → gene.** Keep the vocabulary cautious: "associated with", "suggests",
  never pathognomonic unless it truly is. Examples:
  - hypsarrhythmia and the infantile-spasms genes
  - burst-suppression in neonatal channelopathies and metabolic disease
  - photoparoxysmal response
  - the evolution of EEG findings in Dravet over the first years
- **Artefact vs cerebral.** Explore paired examples, with each discriminating feature
  highlighted on hover.

**Carry over from generation A**

- Keep the slide / quiz data contract, the 5–7-part arc ending in cases and a pearls slide,
  and board-style vignette quizzes with teaching explanations.
- Cite every slide; date anything fast-moving; footer "not for clinical decision-making".
- Draft → publish curator notes, if the site has editors.

**Shared visual language:** the warm neutral ramp, Source Sans 3 / IBM Plex Mono, one
Notice style, and hover definitions from one glossary. **Keep the colour semantics
disjoint from the portal's:** if the EEG site also links to variant classifications, never
use amber/orange/red/green for EEG chrome. Pick trace and channel colours from blue, teal,
violet and neutral, and let polarity or phase be carried by line style as well as hue.

**Engineering habits the portal found worth having**

- The model lives in pure functions with unit tests.
- A figure's keyboard handling is scoped to that figure.
- Every figure has a "no data" state that is visibly different from a "zero" state.
- Every page is checked at phone width before it ships.

---

## 7. Pointers into the repo (for an agent with access)

| What | Where |
|---|---|
| Slide module shell (epilepsy = channelopathies) | `components/epilepsy/EpilepsyModule.tsx`, `lib/data/epilepsy-slides.ts` |
| Mito module (richest: image grid, lightbox, error-hiding images) | `components/mito/MitoModule.tsx`, `lib/data/mito-slides.ts` |
| Module index cards | `app/learn/page.tsx` |
| Curator overrides + Further Reading | `lib/hooks/useModuleData.ts`, `lib/learn-overrides.ts`, `components/learn/{SlideEditor,QuizEditor,FurtherReadingSection}.tsx` |
| Computed-figure primitives + tokens | `components/learn/figure-ui.tsx` |
| Computed figures | `components/learn/CodingVariantPanel.tsx`, `SplicingOutcomePanel.tsx`; engine `lib/learn/toy-gene.ts` (+ tests) |
| Learning Mode stepwise view | `components/variant/SimplifiedVariantView.tsx` |
| Definitions (one primitive, one glossary) | `components/ui/{Tooltip,GlossaryTerm,InfoTip}.tsx`, `lib/data/glossary.ts` |
| The one alert surface | `components/ui/Notice.tsx`, `components/ui/NoticeDisclosure.tsx` |
| Design history | `docs/superpowers/specs/2026-05-15-neuromuscular-learning-modules-design.md`, `CLAUDE.md` |
