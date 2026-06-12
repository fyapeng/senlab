# GitHub Pages Setup

For the current repository layout, configure GitHub Pages as:

1. Open repository `Settings`.
2. Open `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Choose branch `main`.
5. Choose folder `/ (root)`.
6. Save and wait for deployment.

The repository now serves the dashboard directly from the root-level `index.html`. Static assets and exported JSON remain under `web/`.

Expected URL:

`https://fyapeng.github.io/senlab/`

If the page is still unavailable:

- wait 1 to 3 minutes after saving Pages settings
- confirm the branch is `main`
- confirm the folder is `/ (root)` rather than `/docs`
- confirm there is no failed Pages deployment in the repository `Actions` or `Pages` status area
- open `https://fyapeng.github.io/senlab/index.html` directly
