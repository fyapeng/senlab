---
name: senlab-revise-lenses
description: Revise SenLab excerpts and citation lenses for an existing paper without rebuilding the full analysis. Use when Codex needs to add a new excerpt, rewrite a safer formulation, split one vague lens into several precise lenses, retire a weak lens, or align evidence with updated card content.
---

# SenLab Revise Lenses

Use this skill only after the paper card already exists.

## Supported Update Types

- add one new excerpt
- revise one excerpt explanation
- add, replace, split, merge, or delete a lens
- relink a lens to different excerpts
- rewrite overclaim risk or safer formulation
- add or revise citation-point title, use-when guidance, source locator, or retrieval keywords
- revise lens-theme linkage after taxonomy changes

## Excerpt Rules

- Keep excerpt IDs stable when only revising wording.
- Create a new excerpt ID only when the evidence block is materially different.
- Every excerpt must still have `location`, `topic`, `quote_or_paraphrase`, and `why_this_matters`.
- Write explanations in Chinese unless exact English phrasing is required.

## Lens Rules

- Keep lens IDs stable when the lens function remains the same.
- Create a new lens ID when the reusable function changes materially.
- Delete a lens only if it is redundant, unsupported, or misclassified.
- Every lens must still state:
  - a recognizable citation-point title
  - why this paper is used here
  - which claim is supported
  - when it is useful
  - which excerpts or source location support it when available
  - what the overclaim risk is
  - what the safer formulation is

## Precision Bar

- Prefer fewer and sharper lenses over broad summary lenses.
- If user supplements narrow the claim, tighten the lens instead of keeping a vague formulation.
- If card content changes, re-check whether the lens still matches the paper's actual contribution.

## Validation

Before finishing:

1. Confirm quantitative or delicate claims have an excerpt or source locator when available.
2. Confirm no excerpt or lens ID was changed unnecessarily.
3. Resync canonical markdown into SQLite.
4. Re-export website data if the paper is public on the site.
