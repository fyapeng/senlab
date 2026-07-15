# Publishing Workflow

Run commands from the SenLab project root with the `codex` Conda environment.

## After adding or revising papers

```powershell
conda run -n codex python .\scripts\sync_canonical_to_db.py
conda run -n codex python .\scripts\export_web_data.py
conda run -n codex python .\scripts\export_cloudflare_data.py
```

Review the public SQL export before uploading it. It must not contain private paths, PDFs, full Markdown, or excerpt text.

## Update D1 and deploy the API

Copy `output/senlab-public.sql` to the private API repository's ignored `data` directory, then run there:

```powershell
npx wrangler d1 execute senlab --remote --file .\data\senlab-public.sql
npm run check
npm run deploy
```

The import is idempotent because it replaces the public projection inside one transaction. Schema changes should be added as a new numbered file in the API repository's `migrations` directory and applied before the data import.

## Public API

- `/api/meta`
- `/api/papers` and `/api/papers/:work_id`
- `/api/citations`
- `/api/themes`
- `/api/network/themes`
- `/api/network/papers?work_id=...`

The frontend API base defaults to `https://senlabapi.fyapeng.com`. Use `?api=off` for local fallback testing.
