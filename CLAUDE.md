# SenLab — Claude Code Project Guide

SenLab is a personal academic library for health economics research. It ingests paper PDFs, maintains structured canonical metadata in Markdown + SQLite, and serves a static website from exported JSON.

## Repository Layout

```
canonical/papers/     Markdown paper cards (gitignored — local only)
canonical/excerpts/   Excerpt records (gitignored)
canonical/lenses/     Citation lens records (gitignored)
canonical/themes/     Theme taxonomy (gitignored)
library/pdfs/         Ingested PDFs (gitignored)
library/fulltext/     Extracted full-text markdown (gitignored)
data/senlab.db        SQLite database (gitignored)
scripts/              Python pipeline scripts
web/                  Static site source and exported JSON data
skills/               SenLab-specific workflow skills (see below)
```

## Skills

Project-specific skills live in `skills/`. Read the relevant SKILL.md before starting any SenLab workflow task — do not rely on memory alone.

| Task | Skill file |
|------|------------|
| Ingest a new PDF | `skills/senlab-ingest-paper/SKILL.md` |
| Build or fill a paper card | `skills/senlab-build-paper-card/SKILL.md` |
| Revise an existing paper card | `skills/senlab-revise-paper-card/SKILL.md` |
| Build citation lenses | `skills/senlab-build-lenses/SKILL.md` |
| Revise lenses | `skills/senlab-revise-lenses/SKILL.md` |
| Update themes / taxonomy | `skills/senlab-update-taxonomy/SKILL.md` |
| Full end-to-end pipeline | `skills/senlab-paper-workflow/SKILL.md` |

**When to auto-invoke**: If the user asks to ingest papers, fill cards, build lenses, or run the pipeline — read the matching skill first, then act. No slash command required.

## Standard Pipeline Order

1. `python scripts/batch_ingest.py <pdf_dir>` — ingest PDFs, creates canonical cards
2. Edit / fill `canonical/papers/*.md` (follow `senlab-build-paper-card`)
3. `python scripts/sync_canonical_to_db.py` — sync markdown → SQLite
4. `python scripts/export_web_data.py` — export SQLite → `web/data/*.json`
5. `git add web/data/ scripts/` → `git commit` → `git push origin main`

Only `scripts/` and `web/data/` are tracked in git. Everything under `canonical/`, `library/`, and `data/` is local-only (gitignored).

## Metadata Verification

When filling paper cards, **always verify journal, DOI, and author list via web search** before writing them as canonical. PDF extraction is noisy. Use `WebSearch` to look up the paper title + first author and confirm:
- Journal name and volume/issue
- DOI (search CrossRef or the publisher site)
- Full author list

Mark genuinely uncertain fields as `TODO_VERIFY` rather than guessing.

## Key Conventions

- All analytical prose in paper cards is written in **Chinese (Simplified)**.
- Ratings (道法势术器主观) use integers **1–5** only.
- `work_id` format: `{first-author-lastname}-{year}-{title-keywords}` (slugified).
- `version_id` format: `{work_id}-{label}` where label is `uploaded`, `working-paper`, `published`, etc.
- After any canonical edit, always re-run sync + export before committing.
