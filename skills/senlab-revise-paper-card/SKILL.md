---
name: senlab-revise-paper-card
description: Revise specific fields or sections of an existing SenLab paper card without regenerating the whole paper from scratch. Use when Codex needs to patch research-question wording, methods, results, ratings, publication metadata, or any structured card section based on user supplements or later verification.
---

# SenLab Revise Paper Card

Use this skill only for incremental updates to an already ingested paper card.

## Supported Update Types

- replace one field with corrected wording
- append verified detail to an existing section
- revise a rating and its note
- update publication metadata such as journal, year, DOI, or status
- patch one paradigm-specific block without touching unrelated sections

## Input Discipline

Every change must be classified as one of:

- `replace`: the new content supersedes the old content
- `append`: the new content extends the existing field
- `tighten`: keep the claim but make wording more precise or more cautious
- `verify`: replace a `TODO_VERIFY` placeholder with confirmed content

If the user provides ambiguous notes, do not silently merge them. Convert them into one of the four update types first.

## Editing Rules

- Preserve `work_id` and `canonical_version_id`.
- Edit only the targeted field(s).
- Do not regenerate the entire card unless the user explicitly asks for a full rewrite.
- Keep all analytical prose in Chinese by default.
- Preserve title, authors, journal names, DOI, and necessary technical English.
- If a field becomes doubtful rather than clearer, write a narrower statement and add `TODO_VERIFY`.

## Ratings

If ratings change:

- update both the integer score and the note
- do not change unrelated dimensions
- explain the revision in terms of evidence quality, question importance, execution quality, or reuse value

## Validation

Before finishing:

1. Re-open the edited card and confirm the target field actually changed.
2. Confirm no unrelated section was overwritten.
3. Resync canonical markdown into SQLite.
4. Re-export the website data if the paper is public on the site.
