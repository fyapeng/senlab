import { defineConfig } from "astro/config";
import { localApi } from "./local-api.mjs";

export default defineConfig({
  site: "https://fyapeng.com",
  base: "/senlab",
  trailingSlash: "always",
  vite: { plugins: [localApi()] },
});
