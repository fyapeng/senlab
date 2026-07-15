---
name: senlab-build-lenses
description: Create SenLab citation points and optional evidence excerpts from an already ingested and analyzed paper. Use when Codex needs to turn a paper into searchable, reusable support for future writing, literature synthesis, comparison, or research design.
---

# SenLab Build Lenses

Use this skill after the paper card is already reasonably complete.

## Primary Goal

The primary output is a set of distinct citation points: claims the user can later find, understand, and reuse in writing. The full paper-card Markdown and extracted full text are the evidence context for AI generation. Separate excerpt files are optional unless a quantitative result, theorem, assumption, or delicate interpretation benefits from a location anchor.

Create roughly 6-15 citation points when the paper supports that many genuinely different writing functions. Do not meet a quota by paraphrasing the same contribution repeatedly.

## Optional Excerpts

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

Write excerpt explanations in Chinese by default. Preserve original English wording only when quoting the paper title, journal name, equation notation, or a technical expression that should remain exact.

## Citation Point Types

Use only:

- `fact`
- `result`
- `mechanism`
- `identification`
- `method`
- `data`
- `theory`
- `policy`
- `counterfactual`
- `limitation`
- `research_gap`
- `opportunity`

## Citation Point Structure

Each citation point must answer:

- what short title makes it recognizable in search results
- why I am using this paper here
- which claim the paper supports
- when this point is useful in writing or research design
- which excerpt or source location supports the claim when a precise anchor is useful
- how the point should be phrased safely in a paper
- what the overclaim risk is
- which high-information keywords improve retrieval

`Safer Formulation` should be a polished sentence that can be copied into a Chinese academic draft with an author-year citation placeholder. It must not claim more than the source supports.

`Use When` should name concrete writing situations, not restate the claim.

`Source Locator` can be a section, table, figure, proposition, appendix, or page range. Leave it blank when the paper card does not support a reliable locator; do not invent one.

Write lens prose in Chinese by default so the public-facing database remains linguistically consistent.

## Theme Discipline

- Reuse existing mid-level themes whenever possible.
- Each paper should normally link to 1-3 themes.
- Do not create a new theme for a one-paper-specific concept; use keywords/topics instead.
- Prefer distinct high-information citation points over vague summary points.
