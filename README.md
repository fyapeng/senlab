# SenLab

SenLab is a local-first research paper database for economics and adjacent fields.

It combines:

- original PDF preservation
- stable work/version identity management
- structured paper cards
- Dao-Fa-Shi-Shu-Qi plus subjective 10-point ratings
- citation lenses for reusable claims
- SQLite-backed indexing
- a static demo web interface for search, detail, and comparison

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

### 4. Export demo web data

```powershell
python .\scripts\export_web_data.py
```

### 5. Open the demo web page

Open [index.html](E:\SenLab\index.html).

## GitHub Repository Setup

When creating `fyapeng/senlab`:

- Repository name: `senlab`
- Visibility: `Private` recommended for now
- Add README: `Off`
- Add .gitignore: `No .gitignore`
- Add license: `No license`

Create the empty repository first, then push the local project so there is no extra merge step.

## Demo Features

- dashboard overview
- ranking page
- search page
- paper detail page
- compare page
- six-dimension 10-point ratings
- locally synchronized canonical content

## Current Demo Papers

- Einav, Finkelstein, and Schrimpf (2015)
- Kamenica and Gentzkow (2011)
