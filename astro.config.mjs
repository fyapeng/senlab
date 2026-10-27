import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import { localApi } from "./local-api.mjs";

const base = "/senlab";
// old URLs of renamed papers (written by pipeline/export_site.py from config/id_renames.yaml); Astro places the
// redirect page under base but takes the destination as written, so the destination carries base itself
const redirectsFile = new URL("./src/data/redirects.json", import.meta.url);
const redirects = Object.fromEntries(Object.entries(existsSync(redirectsFile) ? JSON.parse(readFileSync(redirectsFile, "utf-8")) : {})
  .map(([from, to]) => [from, base + to]));

export default defineConfig({
  site: "https://fyapeng.com",
  base,
  trailingSlash: "always",
  redirects,
  vite: { plugins: [localApi()] },
});
