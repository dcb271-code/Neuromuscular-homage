# Design Brief: Building an EEG Companion to the Neurogenetics Curriculum

> **For:** a Claude agent (or developer) building a sister site that teaches EEG to the same residents.
> **Source of truth:** the Neurogenetics Curriculum repo (`Neurogenetics-Curriculum`, Next.js 14 app). Everything below describes how that site actually works so the EEG site can feel like the same product family, not a copy with the names changed.
> **Written:** 2026-09-30

---

## 1. Philosophy: what this curriculum believes

1. **Mechanism over memorization.** Every fact is taught with its *why*. The house rule from the depth pass: reading-view prose must teach **beyond** the slide bullets by adding mechanism, clinical reasoning, and caveats. A section that only restates its slides is incomplete.
   - *EEG translation:* don't just name a pattern. Explain the physiology that generates it (cortical pyramidal-cell dipoles, thalamocortical circuits, why suppression means the background has been lost), then what it changes at the bedside.

2. **Diagnosis matters because it changes management.** The organizing question is always "what do I *do* differently?" The epilepsy module frames genetic diagnosis as moving "from a syndromic label to a **mechanism** — and mechanism is what tells you which drug will help and which will harm."
   - *EEG translation:* every pattern should end at a decision: treat or don't, image, send genetics, escalate monitoring, reassure.

3. **Accuracy is the top priority, and it's enforced.**
   - Every specific number (yields, thresholds, ranges, percentages) carries an inline source.
   - Citations are linked PubMed entries in the form `[Author Year](https://pubmed.ncbi.nlm.nih.gov/PMID/)`, about 2 per section, reserved for landmark or archetypal facts: seminal discoveries, major guidelines, pivotal trials.
   - **Every PMID is independently verified** (title, journal, year) before it ships. Wrong attributions have been caught and fixed this way.
   - A claim that can't be sourced is **cut, not hedged**. "Often / may / can" without a number counts as a smell.
   - Fast-moving claims (drug choices, approvals) name the guideline or approval they rest on.
   - The same number must match exactly wherever it appears across modules. There have been dedicated "cross-module numeric consistency" passes.
   - Superlatives are tempered ("among the highest-yielding", not "the highest").
   - *EEG translation:* anchor definitions and criteria to the **ACNS Standardized Critical Care EEG Terminology**, **ILAE 2017 seizure/epilepsy classification** and the **ILAE 2022 syndrome definitions**, the **IFCN glossary**, and neonatal EEG guidelines (e.g., ACNS neonatal terminology). Verify every one before citing it.

4. **Honest, professional clinical language.** The site uses person-respecting descriptors ("distinctive features", not "dysmorphic" for patients) but keeps precise technical terms. Uncertainty is stated plainly. The communication sections model *what to say and what not to say*.

5. **An integration layer, not a pile of facts.** Modules own their facts and cross-link instead of re-teaching (`[[diagnostic-yields|Diagnostic Yields]]`). The capstone modules (Clinical Decision-Making, Virtual Cases) are explicitly *reasoning* layers that tie the threads together.

6. **Small, verified, logged increments.** Improvement happens through a disciplined `/goal` loop (see §8): one scoped change per session, a concrete "Done when", and an append-only log. No "various improvements".

---

## 2. Audience and framing

- **Learners:** neurology residents doing structured, self-paced study alongside teaching conferences. The content is board-relevant but clinically framed.
- **Unit of time:** the curriculum is organized as **10 one-hour blocks** containing 25 modules. Each module is 15–30 min and is tagged `beginner | intermediate | advanced`.
- **Voice:** an expert attending teaching at the bedside. It's explanatory, direct, and willing to say "this is the diagnosis most often invoked (sometimes incorrectly)…". It is not a textbook and not a bullet dump.

---

## 3. Didactic architecture

### 3.1 Curriculum shape
```
Blocks (1-hour)  →  Modules (15–30 min)  →  Sections (5–7 per module)
                                               ├─ slides (2–3 per section, shown inline)
                                               ├─ prose (≈250–600 words, mechanism-first)
                                               ├─ Key Points box (3–5 high-yield bullets, flaggable)
                                               └─ 1 inline question (vignette + explanation)
                                            → end-of-module Quiz (5–7 board-style vignettes)
Curriculum-level: Baseline assessment (25 Q, no feedback) → … → Comprehensive exam (50 Q, 76% pass)
```

The progression runs **Foundations → Methods → Disease groups → Cross-cutting → Clinical reasoning → Integrative cases**. The final block always contains a reasoning-framework module followed by multi-step virtual patient cases.

### 3.2 The "pedagogical spine"
Each module is designed around **one arc**, so it reads as a journey rather than a grab-bag. The Clinical Decision-Making module's spine, for example:

> choose the test → read the result → act on the result → manage the diagnosis → counsel the family → communicate & coordinate

Each section also gets a **distinct visual hook** (a decision tree, a say/don't-say contrast, a blind-spots table, a surveillance table, decision-point cards, a care-team map), so the deck varies from slide to slide.

### 3.3 Assessment design (important)
- **Inline questions** test the *decision*, not flat recall. Example: "negative WES in progressive ataxia → next step?"
- **Distractors are plausible, and the explanation teaches.** It explains why the right answer is right *and* why the tempting wrong one is wrong. The model explanation for SCN2A walks through gain- vs loss-of-function and why age of onset works as a proxy.
- Answer positions are **shuffled** so no quiz is "always B". This was audited and fixed.
- Inline feedback is immediate ("Correct. / Not quite." plus the explanation). The **baseline** assessment deliberately gives *no* feedback, because it measures the starting point. The **comprehensive** exam gives full explanations and tags each item with `sourceModules`, `difficulty`, and `category`.

### 3.4 Retrieval and review
- **Flag any Key Point** to add it to a personal Review list.
- **Review page:** flagged key points plus **missed quiz questions**, with a **Flashcard mode**.
- **Notes tab:** per-module notes (for logged-in users).
- **Progress:** sections read (auto-tracked as you scroll), slides completed, quiz completed and score. The quiz unlocks after the sections are completed. There's a "Continue where you left off" banner and per-block progress rings on the home page.

### 3.5 Integrative cases
Virtual cases (e.g., *Case 1: Neonatal Seizures*) unfold over several sections: **Presentation → workup → interpretation → management**. Bolded, reasoned paragraphs ("**Why this matters for the differential.**") make the clinician's thinking explicit at each step.

---

## 4. Content model (copy this schema)

```ts
type Tag = "Basic Genetics" | "Neurogenetics" | "Advanced" | "Clinical Decision-Making";
// EEG site: e.g. "EEG Fundamentals" | "Pattern Recognition" | "Advanced" | "Clinical Decision-Making"

interface Section { title: string; content: string; contentHtml?: string; keyPoints: string[] }
interface QuizQuestion { question: string; options: string[]; answer: number /*0-based*/; explanation: string }
interface Module {
  id: string; title: string; description: string;
  tags: Tag[]; difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;               // "25 min"
  color: string;                  // accent family
  learningObjectives: string[];
  sections: Section[];
  quiz: QuizQuestion[];           // end-of-module
  inlineQuiz?: QuizQuestion[];    // one per section, same index
  slideDistribution?: number[];   // slides per section when uneven
}
```

- There is **one JSON file per module** in `data/modules/`, registered in curriculum order in `data/modules/index.ts`. Adding a module requires no other code changes.
- **Content markup** is a deliberately tiny markdown subset rendered by `components/formatted-content.tsx`:
  - `**bold**` for emphasis and key terms (roughly 2–6 per paragraph)
  - a line that is only `**Bold heading**` becomes a sub-heading
  - `*italic*` for Latin/terms and gene symbols
  - `- ` bullet lists, optionally with a preamble line
  - pipe tables
  - `[[module-id|Display]]` for internal cross-links
  - `[Label](https://…)` for external citations, which open in a new tab
  - Paragraphs are separated by blank lines.
- **Readability rule:** avoid walls of text. Break with sub-headings, bullets, and tables, and don't put wiki-links inside table rows.
- There is an admin override layer: authorized editors can edit sections and quiz items in-app (stored in Supabase and published over the JSON).

---

## 5. Mechanics (app features to mirror)

| Surface | Behavior |
|---|---|
| **Home** (`/`) | Hero; tag filter chips (All / each tag, each with its own active color); 10 **block cards**, each with a color bar, total minutes, a progress ring, and module cards; "Continue learning" banner; "Test Your Knowledge" card. |
| **Module page** (`/modules/[id]`) | A sticky compact header (back link · title · tag badges) plus a tab bar: **Learn · Slides · Notes · Quiz**, with Learn as the default and a check mark on completed tabs. |
| **Learn tab** | Left sticky sidebar listing sections (check or circle icons plus a % bar; becomes a drawer on mobile). The main column is `max-w-2xl`. Each section is numbered `01`, `02`… (monospace), and the number turns into a green check once read. Order inside a section: inline slides (click → full-screen lightbox with zoom/keyboard) → prose → **Key Points** card → inline question. `hr` between sections; a completion footer offers "Take Quiz". |
| **Slides tab** | The full deck as a vertical gallery with a lightbox (keyboard and pinch-zoom). It's view-only. |
| **Quiz** (`/modules/[id]/quiz`) | End-of-module board vignettes. The score is saved and missed items feed Review. |
| **Print** (`/modules/[id]/print`) | Clean print layout with `.no-print` chrome removed. |
| **Assessments** | Baseline (pre) and Comprehensive (post) exams, with last attempt and score shown. |
| **Review** | Flagged key points plus missed questions, with flashcard mode. |
| **Search** | Command-palette search dialog across modules and sections. |
| **Dashboard** | Admin/faculty view of residents' progress. |
| **Auth** | Lightweight username/password login with a JWT cookie (30 days). Progress, flags, notes, and attempts are stored per resident in Supabase. Content is fully readable logged-out. |
| **PWA** | Manifest, icons, service worker. |

**Stack:** Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui primitives (Radix), `lucide-react` icons, `next-themes` (light/dark), Supabase, `jose`. Slides are rendered with Puppeteer.

---

## 6. Aesthetics

### 6.1 App UI
- **Look:** quiet and editorial, in the Linear/Vercel school. Lots of whitespace, hairline borders (`border-border/40–60`), `rounded-lg`/`rounded-xl` cards, soft `bg-card/60`, and no heavy shadows.
- **Type:** **Inter** (`--font-inter`). Body text is `text-base text-muted-foreground` with generous leading (~1.85). Headings are `font-semibold tracking-tight`. Small-caps-style labels use `text-[10px] uppercase tracking-widest` (e.g., "KEY POINTS"). Numerals use `font-mono tabular-nums`.
- **Color tokens** (HSL CSS variables, shadcn convention):
  - Light: background white, foreground `240 10% 3.9%`, **primary violet `262 83% 58%`**, muted `240 4.8% 95.9%`, radius `0.5rem`.
  - Dark: background `240 10% 3.9%`, card `240 10% 5.5%`, primary `263 70% 65%`.
  - Success states are green-500 (read checks, completion banner). Tag colors: blue (basic), violet (core domain), amber (advanced), teal (clinical decision-making).
- **Motion:** small and fast only. `fade-in` 0.25s (6px rise), `fade-in-up` 0.35s, `slide-in-left` 0.2s.
- **Brand mark:** a white double-helix on a rounded violet gradient tile (`#8b5cf6 → #6d28d9`, with a subtle top sheen), rotated 22°.
  - *EEG sibling suggestion:* keep the **same tile geometry, gradient treatment, stroke weight, and rotation**, but swap the helix for a stylized EEG trace (a few stacked channel lines with a spike-wave). Use a sibling hue (e.g., a teal or indigo gradient) so the two sites read as one family.
- **Tables** (`.inline-table`): an inverted header row (foreground-on-background) in uppercase 11px, zebra rows, and a bold first column.

### 6.2 Slide design system (`scripts/slide-design-system.mjs`)
Slides are **generated from HTML/CSS by code** (one `scripts/gen-<module>.mjs` per module) and rendered with Puppeteer to 1920×1080 JPGs plus a `manifest.json` in `public/slides/<module>/`. They are not hand-made in PowerPoint.

- **Readability first:** body text at least 28px, headings 64px+, minimal content per slide.
- The chrome is an **8px module-accent bar** at the top and a 52px footer (module name · slide n/N).
- **Each module has its own accent palette** (`accent / light / dark`), and related modules share a hue family (e.g., the foundations modules are all blues).
- **Primitives:** title slide (big title, subtitle, "Topics" list), section label, stat cards (large number plus label), color-coded cards in green/amber/red/violet/blue/rose/teal, 2/3-column grids, flow diagrams with connectors, dark-header tables, image frames with an italic credit line, and a numbered **Key Takeaways** slide.
- Each deck opens with a title slide and closes with takeaways. Slides map to sections in order, 2–3 per section.
- **Images:** only open-license sources (Wikimedia, NIH public domain), logged in `public/images/sourced/ATTRIBUTIONS.md` with license and author and credited on the slide.

---

## 7. How this maps onto an EEG site

### 7.1 Suggested block map (a starting outline to adapt, not settled content)
1. **Foundations:** neurophysiologic basis of the EEG; 10–20 system, electrodes, montages (bipolar vs referential) and localization by phase reversal; filters, sensitivity, and paper speed.
2. **The normal EEG across ages:** neonatal (conceptional-age maturation), infant/child, adult; wake and sleep architecture; normal variants that mimic pathology (benign variants are a key "don't over-read" module).
3. **Artifacts:** physiologic vs non-physiologic, and how to prove that something is artifact.
4. **Interictal abnormalities:** slowing (focal/generalized), epileptiform discharges (definition criteria), and their predictive value.
5. **Seizures & epilepsy syndromes on EEG:** ILAE framework; generalized vs focal; age-dependent syndromes (IESS/hypsarrhythmia, CAE, JME, SeLECTS, LGS…).
6. **Neonatal EEG & aEEG:** background grading, burst-suppression, neonatal seizures.
7. **Critical care EEG:** ACNS terminology (main terms and modifiers), the ictal–interictal continuum, NCSE, cEEG indications, prognostication after cardiac arrest.
8. **Genetic & metabolic EEG signatures** (the bridge to the sibling site): e.g., Angelman, Rett, Dravet/SCN1A, KCNQ2, CDKL5, pyridoxine-dependent epilepsy, CLN2, and others. Every "characteristic pattern" claim needs a verified source.
9. **Reporting & pitfalls:** writing the impression, the clinical correlation statement, over-reading as a source of harm.
10. **Clinical reasoning + virtual EEG cases:** when to order routine vs sleep-deprived vs ambulatory vs video-EEG vs cEEG, then integrative cases.

### 7.2 EEG-specific features worth adding (no neurogenetics equivalent)
- **A real waveform viewer** (canvas/SVG) for teaching tracings, with montage switching, adjustable sensitivity and filters, and a 10-s page. Static images alone undersell EEG. Use synthetic or de-identified, openly licensed tracings only, and log their provenance the same way as `ATTRIBUTIONS.md`.
- **"Read this page" questions:** show an annotated or unannotated tracing, ask for a localization or classification, then reveal the annotated overlay alongside the explanation. These are the EEG analogue of the vignette MCQ.
- **Pattern gallery** in the Review/flashcard style: pattern image on the front, name + criteria + clinical significance on the back.
- Keep inline questions *decision*-oriented ("which finding changes management?"), not "name this wave" alone.

### 7.3 Interoperability with the neurogenetics site
- Reuse the **same schema, markup subset, tab structure, progress model, and assessment shapes** so the two sites could share components or one day merge.
- Cross-link to sibling modules by full URL where the content genuinely overlaps (neurogenetics `epilepsy`, `pharmacogenetics`, `iem`, `mitochondrial`, `virtual-cases`). Numbers restated from the sibling site must match it **exactly**.
- Use the same tag semantics and color logic, and the same accuracy and citation standards.

---

## 8. Process: how content gets built and maintained

- **Design spec first** for any new module (`docs/superpowers/specs/…`): purpose, identity (id, title, tags, difficulty, duration, color, placement), pedagogical spine, a section table (coverage item closed plus visual hook), accuracy approach, assessment plan, out-of-scope list, "Done when", and checkpointed sequencing.
- **A coverage checklist** (`docs/curriculum-coverage.md`) is the north-star topic map, organized by domain with ✅ / ⚠️ / ❌ / ➖ status per topic tied to a module id. Create the EEG equivalent **before** writing content.
- **An improvement log** (`docs/improvement-log.md`) keeps a `## Queued` list and an append-only `## History`. Each entry records Target / Change / Outcome (commit) / Followups.
- **The `/goal` loop:** read state → propose 2–3 candidates across content quality, coverage, and housekeeping → pick one → set a concrete 30–60 min "Done when" → execute → log → suggest a commit. Banned: bundling unrelated changes, vague log entries, inventing coverage topics.
- **Build order per module:** JSON sections + inline quiz → final quiz → slide generator → render → flip coverage marks. `npm run build` must pass.

---

## 9. Non-negotiables checklist for the EEG agent

- [ ] Each section follows prose (mechanism → bedside decision) → Key Points → one decision-style inline question.
- [ ] Every specific number or criterion has a linked, **independently verified** citation. If it can't be sourced, cut it.
- [ ] No "always-B" answer keys, and every distractor gets a teaching explanation.
- [ ] Slides are code-generated at 1920×1080 with ≥28px body text, a module accent bar, title and takeaways slides, and 2–3 slides per section.
- [ ] All images are open-license and logged with attribution.
- [ ] Quiet editorial UI: Inter, shadcn tokens, light and dark themes, restrained motion, sibling brand mark.
- [ ] A coverage checklist + improvement log + scoped `/goal`-style iteration from day one.
- [ ] Respectful patient language and honestly stated uncertainty.
