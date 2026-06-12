---
name: senlab-update-taxonomy
description: Update SenLab themes, keywords, and paper-theme links for existing papers. Use when Codex needs to add or rename a theme, revise a paper's keyword set, tighten theme granularity, or move a paper from a vague bucket to a more precise thematic position.
---

# SenLab Update Taxonomy

Use this skill only for themes, keywords, and theme-link maintenance.

## Supported Objects

- theme names and descriptions
- paper-theme links
- paper-level tags or keywords stored in canonical metadata
- theme consolidation or splitting decisions

## Taxonomy Rules

- Prefer precise themes over broad umbrellas.
- Do not create near-duplicate themes that differ only in wording.
- If renaming a theme, preserve its identity unless the conceptual scope changes materially.
- If conceptual scope changes materially, create a new theme and relink papers deliberately.

## Keyword Rules

- Keywords should improve future search and reuse, not merely repeat the title.
- Prefer 4 to 8 high-information keywords.
- Keep original-language technical terms only when translation would reduce precision.

## Update Procedure

1. Identify whether the request changes keywords, themes, or both.
2. Edit the relevant canonical object or metadata block.
3. Re-check all linked papers affected by a renamed or split theme.
4. Resync the database and rebuild exported web data.

## Validation

- The revised theme names remain distinct.
- The target paper links only to themes that truly fit.
- Keyword changes increase precision rather than volume.
