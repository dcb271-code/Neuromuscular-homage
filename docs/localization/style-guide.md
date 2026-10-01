# Style guide: localization prose

_Written 2026-10-01. Applies to module prose, openers, key points, questions, case text and widget copy in `/localization`._

## The voice

Write the way a good science writer explains a hard idea to a curious, intelligent reader: think of Malcolm Gladwell or Jonah Lehrer at their best. The prose is conversational but professional, and it moves. It starts from something concrete (a child on the ward, a historical figure, a puzzle that seems not to add up) and lets the explanation grow out of it. Sentences vary in length and mostly run in full, connected thoughts, joined with ordinary words like *because*, *which*, *so* and *but*. The reader should feel led through an argument, not handed a list of slogans.

Professional means the facts carry the piece. Every clinical claim keeps its citation, and no story, quotation or historical detail is invented. Narrative non-fiction gets into trouble exactly when a writer improves a quote or a scene; we never do. Hypothetical patients are presented as hypothetical ("Picture a...", "Suppose a...", "A typical story runs like this..."), and real history comes from a cited page.

## Readability, sources and spelling

- **Easy to follow comes first.** Each sentence should make sense on one reading. Prefer one idea per sentence, keep most sentences under about 25 words, and break up any sentence over about 38. Metaphors must clarify; if a reader has to decode one ("a commandment that politeness makes easy to break"), say the plain thing instead.
- **Don't name the books in the prose.** Write the claim itself and let the parenthetical citation carry the source: "A child who is nervous will often give a false negative on strength testing (DeMyer, p. 252)", not "DeMyer adds that...". Historical figures (Broca, Babinski, Bayes) are named as part of history, not as sources. A short quoted phrase keeps its citation in parentheses.
- **American spelling** throughout: tumor, fiber, center, gray, behavior, hemorrhage, edema, ischemia, maneuver, recognize, pediatric. Code identifiers and file names are never changed for spelling.

## Habits to remove

These patterns make text read as machine-written. `node scripts/style-loc.mjs <module> -v` counts most of them.

| Habit | Example from our draft | Rewrite |
|---|---|---|
| The clipped aphorism, often closing a paragraph | "Two damaged pathways, one intersection." | Fold the point into the sentence that earns it: "...so the only place both pathways can be damaged at once is the cerebral peduncle." |
| "Not X but Y" antithesis | "Parsimony is a strategy, not a law of nature." | "Parsimony is a useful strategy, but nature doesn't promise to follow it, and children with two problems at once are common enough to keep in mind." |
| The colon reveal | "Machines fail in more than one way: a part stops, a part races..." | "Machines break in different ways. Sometimes a part simply stops, and sometimes it runs too hard." |
| "This, then that" couplets and imperatives as headlines | "Localize first, then test the localization." | "The order matters because a test can only confirm or refute a prediction you've already made." |
| Stock phrases | "the difference is the whole diagnosis", "until proven otherwise", "here is the point", "same X, different Y", "quietly" | Say the specific thing: "that difference is what separates the junction from every other level." |
| Triplet rhythm everywhere | "a weak hand, a blind half-field, numb skin" in every paragraph | Use a list of three when there really are three; otherwise one good example beats three quick ones. |
| Rhetorical-question chains | "Is the deficit real? Where is it? What is it?" | One question, if it's the reader's real question, then answer it in prose. |
| Short dramatic sentences for emphasis | "In a child it does not." | Let emphasis come from the content, inside a full sentence. |

Watch for new tics too. A rewrite that opens every section with "Picture..." or ends every section with a reflective sentence has only swapped one formula for another. Vary the openings: a historical scene, a case, a question a resident actually asks, a surprising observation from a book, or a plain statement of the problem.

## What to keep

- Every citation, internal link and figure placement. `node scripts/check-preserve-loc.mjs <module>` fails if one is lost.
- Answer keys: the correct option stays at the same index and every question keeps four options. You may reword stems, options and explanations if the meaning is unchanged.
- **Bold** for the few terms a reader should carry away, `**Sub-heading**` lines where a section genuinely has parts, and "- " lists for real lists (differentials, steps, features).
- The `> **Bedside trick.**` callouts, rewritten in the same voice.
- No em dashes. Contractions are fine in moderation. Second person ("you") is fine, but avoid "I".

## Length

A rewritten section may be up to about 20% longer than the original, and must stay under 650 words (the validator stops at 700). Key points stay as 3 to 5 plain, complete sentences that a reader could flag for review; they summarize, they don't perform.

## Checks

```
node scripts/style-loc.mjs <module> -v      # tic counts and flagged sentences
node scripts/check-preserve-loc.mjs <module> # nothing lost against git HEAD
node scripts/validate-loc.mjs <module>       # schema and content rules
```

Targets per module: short sentences under 8%, antithesis 2 or fewer, colon reveals 6 or fewer, no stock phrases, paragraph-ending zingers 3 or fewer, semicolons under 4 per 1000 words. The counts are a guide; a flagged sentence that reads naturally can stay.

## A worked example

Module 1, section 3, before and after. The original opened with the abstract claim ("The address is half the answer. The other half is what the lesion is *doing* there, because one address can speak in opposite voices.") and built the idea from labels. The rewrite opens with two children whose eyes both turn left, one seizing and one weak, and lets the reader discover why the same sign means opposite things. The citations, the four kinds of sign and the figure are all unchanged. See `src/loc/modules/m01-where-before-what.json`, section "Lesions that go quiet, and lesions that fire".
