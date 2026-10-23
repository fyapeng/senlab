// Star map: papers are stars, constellations are clusters, lines are in-library citations.
const BASE = import.meta.env.BASE_URL;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export async function initStarmap(root) {
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const tip = root.querySelector(".tip");
  const legend = root.querySelector(".legend");
  const slider = root.querySelector(".timebar input[type=range]");
  const yearLabel = root.querySelector(".timebar .year");
  const playBtn = root.querySelector(".timebar .play");
  const modeBtns = root.querySelectorAll(".timebar [data-mode]");

  const [graph, index] = await Promise.all([
    fetch(`${BASE}data/graph.json`).then((r) => r.json()),
    fetch(`${BASE}data/index.json`).then((r) => r.json()),
  ]);
  const meta = Object.fromEntries(index.map((p) => [p.id, p]));
  const cons = Object.fromEntries(graph.constellations.map((c) => [c.key, c]));
  const maxPr = Math.max(...graph.nodes.map((n) => n.pr));
  const nodes = graph.nodes.map((n, i) => {
    const m = meta[n.id] || {};
    const added = m.ad ? Number(m.ad.slice(0, 4)) + (Number(m.ad.slice(5, 7)) - 1) / 12 : 2026;
    return {
      ...n, m, i,
      r: 1.6 + 6.4 * Math.sqrt(n.pr / maxPr),
      color: cons[n.c]?.color || "#e8c47a",
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
      pub: m.y || 2000,
      add: added,
      vis: 1, sx: 0, sy: 0,
    };
  });
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = graph.cites.map(([a, b]) => ({ a: byId[a], b: byId[b], inner: byId[a].c === byId[b].c })).filter((e) => e.a && e.b);
  const neighbours = new Map(nodes.map((n) => [n.id, new Set()]));
  edges.forEach((e) => { neighbours.get(e.a.id).add(e.b.id); neighbours.get(e.b.id).add(e.a.id); });
  const labelled = new Set([...nodes].sort((a, b) => b.pr - a.pr).slice(0, 8).map((n) => n.id));

  // constellation centroids in world space
  const groups = {};
  nodes.forEach((n) => (groups[n.c] ||= []).push(n));
  const centre = {};
  for (const [k, ns] of Object.entries(groups)) {
    const cx = ns.reduce((s, n) => s + n.x, 0) / ns.length;
    const cy = ns.reduce((s, n) => s + n.y, 0) / ns.length;
    const spread = Math.max(...ns.map((n) => Math.hypot(n.x - cx, n.y - cy)), 0.08);
    centre[k] = { x: cx, y: cy, spread };
  }

  // glow sprites per colour
  const sprites = {};
  const sprite = (color) => {
    if (sprites[color]) return sprites[color];
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.12, color);
    grad.addColorStop(0.35, color + "55");
    grad.addColorStop(1, color + "00");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return (sprites[color] = c);
  };

  // background dust with parallax depth
  const dust = Array.from({ length: 700 }, () => ({
    x: (Math.random() * 2 - 1) * 1.8, y: (Math.random() * 2 - 1) * 1.8,
    d: 0.15 + Math.random() * 0.85, a: 0.15 + Math.random() * 0.5, s: Math.random() < 0.06 ? 1.4 : 0.7,
  }));

  let W = 0, H = 0, DPR = 1;
  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();

  // view state (animated toward targets)
  const view = { theta: 0, zoom: 1, fx: 0, fy: 0, tz: 1, tfx: 0, tfy: 0 };
  let focus = null, hover = null, pinned = null;
  let mode = "pub";
  const years = { pub: [Math.min(...nodes.map((n) => n.pub)), Math.max(...nodes.map((n) => n.pub))],
                  add: [Math.floor(Math.min(...nodes.map((n) => n.add))), Math.ceil(Math.max(...nodes.map((n) => n.add)))] };
  const setSlider = () => {
    slider.min = years[mode][0]; slider.max = years[mode][1]; slider.step = mode === "pub" ? 1 : 0.0833;
    slider.value = slider.max; showYear();
  };
  const showYear = () => {
    const v = Number(slider.value);
    yearLabel.textContent = mode === "pub" ? `发表于 ${Math.round(v)} 年及以前` : `收录于 ${Math.floor(v)} 年 ${Math.min(12, Math.round((v % 1) * 12) + 1)} 月以前`;
  };
  setSlider();
  slider.addEventListener("input", showYear);
  modeBtns.forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    modeBtns.forEach((x) => x.classList.toggle("on", x === b));
    setSlider();
  }));
  let playing = false;
  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "❚❚" : "▶";
    if (playing && Number(slider.value) >= Number(slider.max)) slider.value = slider.min;
  });

  // on wide screens the sky sits right of the intro text and legend
  const R = () => (W < H * 0.8 ? Math.min(W * 0.52, (H - 240) / 2) : Math.min(W * (W > 900 ? 0.82 : 1), H * 1.2) * 0.42);
  const CX = () => W / 2 + (W > 900 ? Math.min(150, W * 0.08) : 0);
  const project = (x, y, depth = 1) => {
    const dx = x - view.fx * depth, dy = y - view.fy * depth;
    // portrait screens: turn the (wide) ring upright
    const th = view.theta * depth + (W < H * 0.8 ? Math.PI / 2 : 0);
    const c = Math.cos(th), s = Math.sin(th);
    const k = R() * view.zoom;
    return [CX() + (dx * c - dy * s) * k, H / 2 + 6 + (dx * s + dy * c) * k];
  };

  const focusOn = (key) => {
    focus = key;
    legend.querySelectorAll("[data-c]").forEach((el) => el.classList.toggle("on", el.dataset.c === key));
    if (!key) { view.tfx = 0; view.tfy = 0; view.tz = 1; return; }
    const c = centre[key];
    view.tfx = c.x; view.tfy = c.y;
    view.tz = Math.max(1.3, Math.min(3.2, 0.55 / c.spread));
  };
  legend.addEventListener("click", (e) => {
    const el = e.target.closest("[data-c]");
    if (!el) return;
    focusOn(focus === el.dataset.c || el.dataset.c === "all" ? null : el.dataset.c);
  });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { focusOn(null); pinned = null; } });

  // pointer
  const pick = (mx, my) => {
    let best = null, bd = Infinity;
    for (const n of nodes) {
      if (n.vis < 0.5) continue;
      const d = Math.hypot(n.sx - mx, n.sy - my);
      if (d < Math.max(10, n.r * view.zoom + 6) && d < bd) { best = n; bd = d; }
    }
    return best;
  };
  const showTip = (n, mx, my) => {
    if (!n) { tip.hidden = true; return; }
    const c = cons[n.c];
    tip.innerHTML = `
      <span class="chip dot" style="--dot:${c.color}">${c.lodge}宿 · ${c.name}</span>
      <b>${n.m.t}</b>
      <span class="m">${n.m.a || ""} · ${n.m.y || ""}${n.m.v ? " · " + n.m.v : ""}</span>
      <span class="m">库内被引 ${n.m.ci} · 中心度第 ${n.m.rk} 位${n.m.s ? " · 有简介" : ""}</span>
      <a class="open" href="${BASE}papers/${n.id}/">打开详情 →</a>`;
    tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.min(W - tw - 12, Math.max(12, mx + 16)) + "px";
    tip.style.top = Math.min(H - th - 12, Math.max(64, my + 16)) + "px";
  };
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    hover = pick(mx, my);
    canvas.style.cursor = hover ? "pointer" : "default";
    if (!pinned) showTip(hover, mx, my);
  });
  canvas.addEventListener("pointerleave", () => { hover = null; if (!pinned) tip.hidden = true; });
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const n = pick(mx, my);
    if (!n) { pinned = null; tip.hidden = true; return; }
    if (e.pointerType === "touch" || matchMedia("(hover: none)").matches) {
      pinned = n; hover = n; showTip(n, mx, my);  // first tap previews, link opens
    } else {
      location.href = `${BASE}papers/${n.id}/`;
    }
  });

  // shooting stars
  const meteors = [];
  let nextMeteor = performance.now() + 4000;

  let last = performance.now();
  let swayT = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduceMotion && !focus && !hover) { swayT += dt; view.theta = 0.07 * Math.sin(swayT * 0.06); }
    const ease = 1 - Math.pow(0.002, dt);
    view.zoom += (view.tz - view.zoom) * ease;
    view.fx += (view.tfx - view.fx) * ease;
    view.fy += (view.tfy - view.fy) * ease;
    if (playing) {
      const v = Number(slider.value) + dt * (mode === "pub" ? 4 : 0.35);
      slider.value = Math.min(Number(slider.max), v);
      showYear();
      if (v >= Number(slider.max)) { playing = false; playBtn.textContent = "▶"; }
    }
    const limit = Number(slider.value);
    const t = now / 1000;

    ctx.clearRect(0, 0, W, H);

    // dust
    for (const s of dust) {
      const [x, y] = project(s.x, s.y, s.d * 0.6);
      if (x < -5 || y < -5 || x > W + 5 || y > H + 5) continue;
      ctx.globalAlpha = s.a * (reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(t * 0.7 + s.x * 9));
      ctx.fillStyle = "#cfd8f0";
      ctx.fillRect(x, y, s.s, s.s);
    }
    ctx.globalAlpha = 1;

    // nebulae
    for (const [k, c] of Object.entries(centre)) {
      const [x, y] = project(c.x, c.y);
      const rad = (c.spread * 1.4 + 0.06) * R() * view.zoom;
      const col = cons[k].color;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      const a = focus && focus !== k ? "06" : "14";
      g.addColorStop(0, col + a);
      g.addColorStop(1, col + "00");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }

    // positions and visibility
    for (const n of nodes) {
      const target = (mode === "pub" ? n.pub : n.add) <= limit + 1e-6 ? 1 : 0;
      n.vis += (target - n.vis) * Math.min(1, dt * 6);
      [n.sx, n.sy] = project(n.x, n.y);
    }
    const active = hover || pinned;
    const near = active ? neighbours.get(active.id) : null;

    // edges
    ctx.lineCap = "round";
    for (const e of edges) {
      const vis = Math.min(e.a.vis, e.b.vis);
      if (vis < 0.02) continue;
      let alpha, color, width;
      if (active && (e.a === active || e.b === active)) { alpha = 0.9; color = "#e8c47a"; width = 1.4; }
      else if (e.inner) { alpha = 0.26; color = e.a.color; width = 0.8; }
      else { alpha = 0.07; color = "#c8d2ff"; width = 0.6; }
      if (focus && e.a.c !== focus && e.b.c !== focus) alpha *= 0.25;
      if (active && !(e.a === active || e.b === active)) alpha *= 0.4;
      ctx.globalAlpha = alpha * vis;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(e.a.sx, e.a.sy); ctx.lineTo(e.b.sx, e.b.sy); ctx.stroke();
    }

    // stars
    for (const n of nodes) {
      if (n.vis < 0.02) continue;
      let alpha = reduceMotion ? 0.95 : 0.72 + 0.28 * Math.sin(t * n.speed + n.phase);
      if (focus && n.c !== focus) alpha *= 0.22;
      if (active && n !== active && !near.has(n.id)) alpha *= 0.35;
      const r = n.r * Math.sqrt(view.zoom) * (n === active ? 1.5 : 1);
      ctx.globalAlpha = alpha * n.vis;
      const sp = sprite(n.color);
      const size = r * 6;
      ctx.drawImage(sp, n.sx - size / 2, n.sy - size / 2, size, size);
      ctx.fillStyle = "#fffaf0";
      ctx.beginPath(); ctx.arc(n.sx, n.sy, Math.max(0.8, r * 0.38), 0, Math.PI * 2); ctx.fill();
    }

    // labels
    ctx.textAlign = "center";
    for (const [k, c] of Object.entries(centre)) {
      if (!groups[k].some((n) => n.vis > 0.5)) continue;
      const [x, y] = project(c.x, c.y);
      const off = (c.spread + 0.05) * R() * view.zoom;
      ctx.globalAlpha = focus && focus !== k ? 0.25 : 0.92;
      ctx.fillStyle = cons[k].color;
      const narrow = W < 600;
      ctx.font = `600 ${focus === k ? 16 : narrow ? 11.5 : 13}px ${getComputedStyle(document.body).getPropertyValue("--serif")}`;
      const name = narrow && focus !== k ? cons[k].name.split(/[、与·]/)[0] : cons[k].name;
      ctx.fillText(`${cons[k].lodge}宿 · ${name}`, Math.min(W - 60, Math.max(60, x)), y - off);
    }
    const narrowLabels = W < 600;
    ctx.font = `11px ${getComputedStyle(document.body).getPropertyValue("--sans")}`;
    for (const n of nodes) {
      const show = (labelled.has(n.id) && !narrowLabels) || n === active || (near && near.has(n.id)) || (focus === n.c && view.zoom > 1.6);
      if (!show || n.vis < 0.5) continue;
      if (focus && n.c !== focus && n !== active) continue;
      ctx.globalAlpha = n === active ? 1 : 0.7;
      ctx.fillStyle = n === active ? "#ffffff" : "#c9cfdf";
      ctx.fillText(`${n.m.a || ""} ${n.m.y || ""}`, n.sx, n.sy + n.r * Math.sqrt(view.zoom) + 13);
    }

    // meteors
    if (!reduceMotion && now > nextMeteor) {
      const a = Math.random() * Math.PI * 2;
      meteors.push({ x: Math.random() * W, y: Math.random() * H * 0.6, vx: Math.cos(a) * 520, vy: Math.abs(Math.sin(a)) * 260 + 80, life: 0 });
      nextMeteor = now + 7000 + Math.random() * 9000;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.life += dt;
      if (m.life > 0.9) { meteors.splice(i, 1); continue; }
      const k = 1 - m.life / 0.9;
      const x2 = m.x + m.vx * m.life, y2 = m.y + m.vy * m.life;
      const g = ctx.createLinearGradient(x2, y2, x2 - m.vx * 0.12, y2 - m.vy * 0.12);
      g.addColorStop(0, "rgba(255,245,220,0.9)");
      g.addColorStop(1, "rgba(255,245,220,0)");
      ctx.globalAlpha = k;
      ctx.strokeStyle = g; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - m.vx * 0.12, y2 - m.vy * 0.12); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
