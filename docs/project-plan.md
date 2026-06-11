# SenLab Project Plan

## Goal

Build a local-first research paper database with:

- original PDF preservation
- stable work/version identity management
- structured markdown objects
- SQLite-backed querying
- Dao-Fa-Shi-Shu-Qi plus subjective ratings
- citation lens support for future writing and research design

## Core Objects

- `work`: stable identity for one research work
- `paper_version`: one specific PDF version of a work
- `paper_card`: normalized structured markdown note
- `excerpt`: evidence block with location
- `lens`: reusable citation or argument interface
- `theme`: thematic aggregation layer
- `rating`: fixed 5+1 judgment layer

## Architecture

### Storage Layer

- `library/pdfs/`
- `library/fulltext/`
- `canonical/papers/`
- `canonical/excerpts/`
- `canonical/lenses/`
- `canonical/themes/`

### Index Layer

- SQLite database at `data/senlab.db`

### Workflow Layer

- deterministic ingestion scripts
- Codex skill for structured analysis and normalization

## Version Model

- `work_id` remains stable across working paper and published versions
- `version_id` identifies the concrete PDF
- old versions are retained and marked `superseded`
- one version can be marked canonical for default display and citation

## Near-Term Build Scope

1. SQLite schema
2. PDF ingest script
3. Draft full-text extraction
4. Standard markdown templates
5. Strict SenLab paper workflow skill
6. Future web app against the SQLite database
