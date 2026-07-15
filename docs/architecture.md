# SenLab Architecture

SenLab is local-first. The local SQLite database is the canonical index; complete Markdown notes remain private context for AI-assisted reading.

## Layers

1. `papers/`, `versions/`, and `lenses/` hold human-readable canonical Markdown.
2. `data/senlab.db` indexes papers, versions, themes, normalized topics, and citation points.
3. `scripts/export_cloudflare_data.py` exports only records whose paper card has `visibility: public`.
4. Cloudflare D1 stores the public projection. The Worker at `https://senlabapi.fyapeng.com` exposes read-only JSON endpoints.
5. The static website calls the API first and keeps its earlier JSON export as a compatibility fallback.

## Citation points

A citation point is smaller than a paper summary and larger than a quotation. Each point records a claim, interpretation, intended use, boundary, safer formulation, source locator, keywords, and optional excerpt IDs. Excerpts and full Markdown can remain local evidence without being published.

The citation basket in the search page is intentionally stored only in the browser. It helps assemble several points into context for writing or a later AI task without adding account or workflow state.

## Taxonomy

- Themes are the small, stable navigation layer. A paper should normally have one to three.
- Topics are normalized retrieval terms, not bespoke folders. Aliases in `config/topic-aliases.json` collapse spelling and naming variants.
- Keywords belong to individual citation points when they describe a narrow reusable claim.

The theme map remains a global overview. Once the library exceeds 24 papers, the paper map becomes an ego network: the selected paper, its strongest neighbors, and a few central bridge papers. This keeps the map readable as the collection grows.
