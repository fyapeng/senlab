---
name: senlab-build-lenses
description: Create SenLab excerpts and citation lenses from an already ingested and analyzed paper. Use when Codex needs to extract evidence blocks, map them to reusable claims, identify overclaim risk, and connect papers to precise themes for future writing, literature synthesis, or topic generation.
---

# SenLab Build Lenses

Use this skill after the paper card is already reasonably complete.

## Excerpts

Extract only high-value evidence blocks:

- research-question statements
- identification logic
- proposition or theorem statements
- main quantitative results
- mechanism evidence
- explicit limitations

Every excerpt must include:

- `excerpt_id`
- `location`
- `topic`
- `quote_or_paraphrase`
- `why_this_matters`

## Lens Types

Use only:

- `fact`
- `mechanism`
- `method`
- `data`
- `theory`
- `policy`
- `counterfactual`
- `opportunity`

## Lens Structure

Each lens must answer:

- why I am using this paper here
- which claim the paper supports
- which excerpts support that claim
- what the overclaim risk is
- what the safer formulation is

## Theme Discipline

- Link only to precise themes.
- Prefer a small number of high-information lenses over many vague lenses.
- Avoid summary lenses that merely restate the paper card.
