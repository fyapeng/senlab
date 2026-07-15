# SenLab

SenLab is a local-first research paper database for economics and adjacent fields.

It combines:

- original PDF preservation
- stable work/version identity management
- structured paper cards
- Dao-Fa-Shi-Shu-Qi plus subjective 10-point ratings
- citation points for claims that can be searched, reused, and safely quoted
- SQLite-backed indexing
- a static web interface backed by a Cloudflare Worker + D1 public API

## Repository Scope

This repository should contain code, templates, workflows, schema, and the web app.

It should not track:

- private PDF libraries
- extracted full texts
- personal canonical notes
- the live SQLite database file

See `.gitignore` for the local-only paths.

## Quick Start

### 1. Initialize the database

```powershell
python .\scripts\init_db.py
```

### 2. Ingest a paper PDF

```powershell
python .\scripts\ingest_paper.py "D:\path\to\paper.pdf"
```

### 3. Seed the demo content

```powershell
python .\scripts\seed_demo_content.py
```

### 4. Export the local web fallback

```powershell
python .\scripts\export_web_data.py
```

### 5. Export the public Cloudflare dataset

```powershell
python .\scripts\export_cloudflare_data.py
```

The generated SQL is written to `output/senlab-public.sql` and is deliberately ignored by Git.

### 6. Open the web page

Open [index.html](E:\SenLab\index.html).

## Data Boundaries

- `data/senlab.db`, PDFs, full Markdown notes, excerpts, and local paths stay local.
- Only records marked `visibility: public` are exported to D1.
- The public API contains bibliographic fields, themes/topics, ratings, and citation points; it contains no PDFs or full-text notes.
- The API source lives in the private `fyapeng/senlab-api` repository.

See [docs/architecture.md](docs/architecture.md) for the system design and [docs/publishing.md](docs/publishing.md) for the update workflow.

## Demo Features

- dashboard overview
- ranking page
- citation-first search page and citation basket
- paper detail page
- compare page
- six-dimension 10-point ratings
- API-first loading with local static fallback

## Current Demo Papers

- Einav, Finkelstein, and Schrimpf (2015)
- Kamenica and Gentzkow (2011)
