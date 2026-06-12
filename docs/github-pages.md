# GitHub Pages Setup

For the current repository layout, configure GitHub Pages as:

1. Open repository `Settings`.
2. Open `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Choose branch `main`.
5. Choose folder `/ (root)`.
6. Save and wait for deployment.

The repository now has a root-level `index.html` that redirects to `web/index.html`, so Pages does not require moving the web app into the root folder itself.

Expected URL:

`https://fyapeng.github.io/senlab/`

If the page is still unavailable:

- wait 1 to 3 minutes after saving Pages settings
- confirm the branch is `main`
- confirm the folder is `/ (root)` rather than `/docs`
- confirm there is no failed Pages deployment in the repository `Actions` or `Pages` status area
- open `https://fyapeng.github.io/senlab/index.html` directly
