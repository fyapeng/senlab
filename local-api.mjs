// Vite dev-server plugin with local-only endpoints, active in `astro dev` only (never in the built site):
//   POST /senlab/_local/rate  {id, ratings}    -> rewrite `ratings:` in content/papers/<id>.md
// After a write the site data is re-exported so the page shows the new values.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content", "papers");
const DIMS = ["dao", "fa", "shi", "shu", "qi", "subjective"];

let exportTimer = null;
function scheduleExport() {
  clearTimeout(exportTimer);
  exportTimer = setTimeout(() => {
    const py = path.join(ROOT, ".venv", "Scripts", "python.exe");
    spawn(py, [path.join(ROOT, "pipeline", "export_site.py")], { cwd: path.join(ROOT, "pipeline"), stdio: "ignore" });
  }, 1200);
}

const readBody = (req) => new Promise((resolve, reject) => {
  let s = "";
  req.on("data", (c) => (s += c));
  req.on("end", () => resolve(s));
  req.on("error", reject);
});

export function localApi() {
  return {
    name: "senlab-local-api",
    enforce: "pre",
    apply: "serve",
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.includes("/_local/") || req.method !== "POST") return next();
          const reply = (code, obj) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(obj)); };
          try {
            const body = JSON.parse((await readBody(req)) || "{}");
            const id = String(body.id || "");
            const file = path.join(CONTENT, `${id}.md`);
            if (!/^[a-z0-9-]+$/.test(id) || !fs.existsSync(file)) return reply(404, { error: "unknown id" });

            const route = req.url.split("?")[0].replace(/\/$/, "");

            if (route.endsWith("/rate")) {
              const r = body.ratings || {};
              const clean = DIMS.filter((k) => Number.isInteger(r[k]) && r[k] >= 1 && r[k] <= 10).map((k) => `${k}: ${r[k]}`);
              const text = fs.readFileSync(file, "utf8");
              const line = `ratings: {${clean.join(", ")}}`;
              const next = /^ratings:.*$/m.test(text) ? text.replace(/^ratings:.*$/m, line) : text.replace(/^---\n/, `---\n${line}\n`);
              fs.writeFileSync(file, next, "utf8");
              scheduleExport();
              return reply(200, { id, ratings: Object.fromEntries(clean.map((s) => s.split(": ").map((x, i) => (i ? Number(x) : x)))) });
            }
            return reply(404, { error: "unknown endpoint" });
          } catch (e) {
            return reply(500, { error: String(e) });
          }
        });
    },
  };
}
