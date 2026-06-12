---
name: senlab-ingest-paper
description: Deterministically ingest a paper PDF into the SenLab workspace before any analysis. Use when Codex needs to assign work/version IDs, copy the PDF into the library, extract full text, initialize database records, or create a draft paper card for a new paper or a new version of an existing work.
---

# SenLab Ingest Paper

Use this skill only for the deterministic intake stage.

## Required Steps

1. Initialize the SenLab database if it does not exist.
2. Run the ingestion script on the source PDF.
3. Capture `work_id`, `version_id`, canonical storage path, and full-text path.
4. Do not draft free-form analysis before the intake step succeeds.

## Rules

- Prefer the ingestion script over manual copying.
- Treat `work_id` as stable across versions.
- Treat `version_id` as specific to the uploaded PDF.
- Do not delete earlier versions when a newer one appears.
- If title or author parsing looks suspicious, keep the intake result and mark the identity for review rather than inventing replacements silently.
- Treat PDF-extracted metadata as noisy by default, especially for journal PDFs.
- If the detected title is all caps, convert it to standard title case before it becomes canonical metadata.
- Remove layout artifacts from titles, including trailing `*`, dagger markers, footnote numerals, and line-break noise, unless the symbol is genuinely part of the title.
- Normalize author names to standard English name form rather than OCR casing or punctuation artifacts.
- Preserve the official publication title and author spelling when they can be verified from the paper first page or journal metadata.

## Validation

Confirm all of the following:

- the PDF exists under `library/pdfs/`
- the extracted text exists under `library/fulltext/`
- the paper card draft exists under `canonical/papers/`
- the database has one `works` row and one `paper_versions` row for the ingested file
