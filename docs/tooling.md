# Tooling

## Required

- Python 3.11+
- SQLite via Python stdlib

## Recommended

- Bundled Codex runtime Python with `pypdf` available
- Node.js 20+ for the future web interface

## Current Notes

- System Python already supports SQLite.
- Codex bundled Python includes `pypdf`.
- `node` and `npm` are not currently on PATH in this environment.
- A standalone SQL server is not required. SQLite is the intended database.

## Suggested Install Later

Install Node.js only when starting the web UI:

- official Node.js LTS release
- optional package manager such as `pnpm`

No separate SQL installation is needed for the current project plan.
