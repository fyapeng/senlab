// Star map: papers are stars, constellations are clusters, lines are in-library citations.
//
// Performance notes: the dust field is pre-rendered once per resize, nebulae and star glows are
// sprites (no per-frame gradients), citation lines are batched into one stroke per colour, fonts
// are resolved once, and the loop pauses when the sky is off-screen or the tab is hidden and
// drops to ~30 fps while nothing is moving.
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
  const zoomBtns = root.querySelectorAll("[data-zoom]");
  let running = false, visible = true, lastDraw = 0, last = performance.now(), swayT = 0, busyUntil = 0;
  const meteors = [];
  let nextMeteor = performance.now() + 4000;

  const [graph, index] = await Promise.all([
    fetch(`${BASE}data/graph.json`).then((r) => r.json()),
    fetch(`${BASE}data/index.json`).then((r) => r.json()),
  ]);
  const css = getComputedStyle(document.body);
  const SERIF = css.getPropertyValue("--serif").trim() || "serif";
  const SANS = css.getPropertyValue("--sans").trim() || "sans-serif";

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
  const edges = graph.cites.map(([a, b]) => ({ a: byId[a], b: byId[b], inner: byId[a]?.c === byId[b]?.c })).filter((e) => e.a && e.b);
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

  // sprites: star glow and nebula halo per colour, rendered once
  const makeSprite = (size, stops) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  };
  const glow = {}, halo = {};
  const glowOf = (col) => (glow[col] ||= makeSprite(64, [[0, "rgba(255,255,255,1)"], [0.12, col], [0.35, col + "55"], [1, col + "00"]]));
  const haloOf = (col) => (halo[col] ||= makeSprite(128, [[0, col + "26"], [0.5, col + "10"], [1, col + "00"]]));

  // dust: drawn once per resize into an offscreen layer
  const dust = Array.from({ length: 650 }, () => ({ x: Math.random(), y: Math.random(), a: 0.12 + Math.random() * 0.45, s: Math.random() < 0.06 ? 1.4 : 0.7 }));
  const dustLayer = document.createElement("canvas");

  let W = 0, H = 0, DPR = 1;
  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = root.clientWidth; H = root.clientHeight;
    for (const c of [canvas, dustLayer]) { c.width = W * DPR; c.height = H * DPR; }
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const d = dustLayer.getContext("2d");
    d.setTransform(DPR, 0, 0, DPR, 0, 0);
    d.fillStyle = "#cfd8f0";
    for (const s of dust) { d.globalAlpha = s.a; d.fillRect(s.x * W, s.y * H, s.s, s.s); }
    wake();
  };

  // view state (animated toward targets)
  const view = { theta: 0, zoom: 1, fx: 0, fy: 0, tz: 1, tfx: 0, tfy: 0 };
  let focus = null, hover = null, pinned = null;
  let mode = "pub";
  const years = { pub: [Math.min(...nodes.map((n) => n.pub)), Math.max(...nodes.map((n) => n.pub))],
                  add: [Math.floor(Math.min(...nodes.map((n) => n.add))), Math.ceil(Math.max(...nodes.map((n) => n.add)))] };
  const showYear = () => {
    const v = Number(slider.value);
    yearLabel.textContent = mode === "pub" ? `发表于 ${Math.round(v)} 年及以前` : `收录于 ${Math.floor(v)} 年 ${Math.min(12, Math.round((v % 1) * 12) + 1)} 月以前`;
  };
  const setSlider = () => {
    slider.min = years[mode][0]; slider.max = years[mode][1]; slider.step = mode === "pub" ? 1 : 0.0833;
    slider.value = slider.max; showYear(); wake();
  };
  setSlider();
  slider.addEventListener("input", () => { showYear(); wake(); });
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
    wake();
  });

  // geometry: on wide screens the sky sits right of the intro text; x spans ±1, y about ±0.85
  const portrait = () => W < H * 0.8;
  const R = () => (portrait()
    ? Math.min(W * 0.52, (H - 240) / 2)
    : Math.min((W - (W > 900 ? 2 * Math.min(150, W * 0.08) + 120 : 60)) / 2.1, (H - 200) / 1.75));
  const CX = () => W / 2 + (W > 900 ? Math.min(150, W * 0.08) : 0);
  const CY = () => H / 2 + 6;
  const angle = () => view.theta + (portrait() ? Math.PI / 2 : 0);
  const project = (x, y) => {
    const dx = x - view.fx, dy = y - view.fy, th = angle();
    const c = Math.cos(th), s = Math.sin(th), k = R() * view.zoom;
    return [CX() + (dx * c - dy * s) * k, CY() + (dx * s + dy * c) * k];
  };
  // screen -> world (inverse of project)
  const unproject = (sx, sy) => {
    const th = -angle(), k = R() * view.zoom;
    const x = (sx - CX()) / k, y = (sy - CY()) / k;
    return [view.fx + x * Math.cos(th) - y * Math.sin(th), view.fy + x * Math.sin(th) + y * Math.cos(th)];
  };

  const focusOn = (key) => {
    focus = key;
    legend.querySelectorAll("[data-c]").forEach((el) => el.classList.toggle("on", el.dataset.c === key));
    if (!key) { view.tfx = 0; view.tfy = 0; view.tz = 1; }
    else {
      const c = centre[key];
      view.tfx = c.x; view.tfy = c.y;
      view.tz = Math.max(1.3, Math.min(3.2, 0.55 / c.spread));
    }
    wake();
  };
  legend.addEventListener("click", (e) => {
    const el = e.target.closest("[data-c]");
    if (!el) return;
    focusOn(focus === el.dataset.c || el.dataset.c === "all" ? null : el.dataset.c);
  });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { focusOn(null); pinned = null; tip.hidden = true; } });

  // zoom: buttons, ctrl/⌘ + wheel and trackpad pinch (plain wheel keeps scrolling the page)
  const zoomAt = (factor, sx = CX(), sy = CY()) => {
    const [wx, wy] = unproject(sx, sy);
    const z = Math.max(0.7, Math.min(6, view.tz * factor));
    view.zoom = view.tz = z;
    const [nx, ny] = unproject(sx, sy);
    view.fx = view.tfx = view.fx + (wx - nx);
    view.fy = view.tfy = view.fy + (wy - ny);
    wake();
  };
  canvas.addEventListener("wheel", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX - rect.left, e.clientY - rect.top);
  }, { passive: false });
  zoomBtns.forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.zoom === "reset") { focusOn(null); return; }
    zoomAt(b.dataset.zoom === "in" ? 1.4 : 1 / 1.4);
  }));

  // pointer: hover, click, drag to pan
  const pick = (mx, my) => {
    let best = null, bd = Infinity;
    for (const n of nodes) {
      if (n.vis < 0.5) continue;
      const d = Math.hypot(n.sx - mx, n.sy - my);
      if (d < Math.max(10, n.r * Math.sqrt(view.zoom) + 6) && d < bd) { best = n; bd = d; }
    }
    return best;
  };
  const showTip = (n, mx, my) => {
    if (!n) { tip.hidden = true; return; }
    const c = cons[n.c];
    tip.innerHTML = `
      <span class="chip dot" style="--dot:${c.color}">${c.lodge ? c.lodge + "宿 · " : ""}${c.name}</span>
      <b>${n.m.t}</b>
      <span class="m">${n.m.a || ""} · ${n.m.y || ""}${n.m.v ? " · " + n.m.v : ""}</span>
      <span class="m">库内被引 ${n.m.ci} · 中心度第 ${n.m.rk} 位${n.m.s ? " · 有简介" : ""}</span>
      <a class="open" href="${BASE}papers/${n.id}/">打开详情 →</a>`;
    tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.min(W - tw - 12, Math.max(12, mx + 16)) + "px";
    tip.style.top = Math.min(H - th - 12, Math.max(64, my + 16)) + "px";
  };
  const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    const [mx, my] = local(e);
    if (pick(mx, my)) return;
    drag = { x: mx, y: my, fx: view.fx, fy: view.fy, moved: false };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    const [mx, my] = local(e);
    if (drag) {
      if (Math.hypot(mx - drag.x, my - drag.y) > 4) drag.moved = true;
      if (drag.moved) {
        const th = -angle(), k = R() * view.zoom;
        const dx = (mx - drag.x) / k, dy = (my - drag.y) / k;
        view.fx = view.tfx = drag.fx - (dx * Math.cos(th) - dy * Math.sin(th));
        view.fy = view.tfy = drag.fy - (dx * Math.sin(th) + dy * Math.cos(th));
        canvas.style.cursor = "grabbing";
        wake();
      }
      return;
    }
    if (e.pointerType === "touch") return;
    const n = pick(mx, my);
    if (n !== hover) { hover = n; wake(); }
    canvas.style.cursor = hover ? "pointer" : "grab";
    if (!pinned) showTip(hover, mx, my);
  });
  const endDrag = (e) => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    canvas.style.cursor = "grab";
    if (moved) e.stopPropagation();
    canvas._suppressClick = moved;
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", () => { drag = null; });
  canvas.addEventListener("pointerleave", () => { if (hover) { hover = null; wake(); } if (!pinned) tip.hidden = true; });
  canvas.addEventListener("click", (e) => {
    if (canvas._suppressClick) { canvas._suppressClick = false; return; }
    const [mx, my] = local(e);
    const n = pick(mx, my);
    if (!n) { pinned = null; tip.hidden = true; wake(); return; }
    if (e.pointerType === "touch" || matchMedia("(hover: none)").matches) {
      pinned = n; hover = n; showTip(n, mx, my); wake();   // first tap previews; the link opens
    } else {
      location.href = `${BASE}papers/${n.id}/`;
    }
  });

  // loop control: pause off-screen / hidden tab; ~30 fps when idle
  function wake() {
    busyUntil = performance.now() + 1200;
    if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); }, { threshold: 0.02 }).observe(root);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
  // the sky can start at 0×0 (e.g. a hidden tab or pane); follow the element, not just the window
  new ResizeObserver(resize).observe(root);

  const stats = { frames: 0, ms: 0 };
  window.__sky = stats;

  function frame(now) {
    if (!visible || document.hidden || !W || !H) { running = false; return; }
    const moving = playing || drag || now < busyUntil || Math.abs(view.tz - view.zoom) > 1e-3 ||
      Math.abs(view.tfx - view.fx) > 1e-4 || Math.abs(view.tfy - view.fy) > 1e-4;
    if (!moving && now - lastDraw < 33) { requestAnimationFrame(frame); return; }
    const t0 = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now; lastDraw = now;
    if (!reduceMotion && !focus && !hover && !drag) { swayT += dt; view.theta = 0.07 * Math.sin(swayT * 0.06); }
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
    const kR = R() * view.zoom;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.drawImage(dustLayer, 0, 0);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // nebulae (sprites)
    for (const [k, c] of Object.entries(centre)) {
      const [x, y] = project(c.x, c.y);
      const rad = (c.spread * 1.5 + 0.07) * kR;
      ctx.globalAlpha = focus && focus !== k ? 0.35 : 1;
      ctx.drawImage(haloOf(cons[k].color), x - rad, y - rad, rad * 2, rad * 2);
    }

    // positions and visibility
    for (const n of nodes) {
      const target = (mode === "pub" ? n.pub : n.add) <= limit + 1e-6 ? 1 : 0;
      n.vis += (target - n.vis) * Math.min(1, dt * 6);
      const p = project(n.x, n.y);
      n.sx = p[0]; n.sy = p[1];
    }
    const active = hover || pinned;
    const near = active ? neighbours.get(active.id) : null;

    // edges, batched: one path per colour group
    ctx.lineCap = "round";
    const batches = new Map();
    const hot = [];
    for (const e of edges) {
      const vis = Math.min(e.a.vis, e.b.vis);
      if (vis < 0.5) continue;
      if (active && (e.a === active || e.b === active)) { hot.push(e); continue; }
      const key = e.inner ? e.a.color : "cross";
      let b = batches.get(key);
      if (!b) batches.set(key, (b = { path: new Path2D(), dim: [] }));
      const dim = focus && e.a.c !== focus && e.b.c !== focus;
      const target = dim ? (b.dimPath ||= new Path2D()) : b.path;
      target.moveTo(e.a.sx, e.a.sy); target.lineTo(e.b.sx, e.b.sy);
    }
    const fade = active ? 0.4 : 1;
    for (const [key, b] of batches) {
      const base = key === "cross" ? 0.07 : 0.26;
      ctx.strokeStyle = key === "cross" ? "#c8d2ff" : key;
      ctx.lineWidth = key === "cross" ? 0.6 : 0.8;
      ctx.globalAlpha = base * fade; ctx.stroke(b.path);
      if (b.dimPath) { ctx.globalAlpha = base * fade * 0.25; ctx.stroke(b.dimPath); }
    }
    if (hot.length) {
      const p = new Path2D();
      hot.forEach((e) => { p.moveTo(e.a.sx, e.a.sy); p.lineTo(e.b.sx, e.b.sy); });
      ctx.globalAlpha = 0.9; ctx.strokeStyle = "#e8c47a"; ctx.lineWidth = 1.4; ctx.stroke(p);
    }

    // stars
    const sz = Math.sqrt(view.zoom);
    ctx.fillStyle = "#fffaf0";
    for (const n of nodes) {
      if (n.vis < 0.02 || n.sx < -40 || n.sy < -40 || n.sx > W + 40 || n.sy > H + 40) continue;
      let alpha = reduceMotion ? 0.95 : 0.72 + 0.28 * Math.sin(t * n.speed + n.phase);
      if (focus && n.c !== focus) alpha *= 0.22;
      if (active && n !== active && !near.has(n.id)) alpha *= 0.35;
      const r = n.r * sz * (n === active ? 1.5 : 1);
      ctx.globalAlpha = alpha * n.vis;
      const size = r * 6;
      ctx.drawImage(glowOf(n.color), n.sx - size / 2, n.sy - size / 2, size, size);
      const core = Math.max(0.8, r * 0.38);
      ctx.fillRect(n.sx - core, n.sy - core, core * 2, core * 2);
    }

    // constellation labels
    ctx.textAlign = "center";
    const narrow = W < 600;
    for (const [k, c] of Object.entries(centre)) {
      if (!groups[k].some((n) => n.vis > 0.5)) continue;
      const [x, y] = project(c.x, c.y);
      const off = (c.spread + 0.05) * kR;
      ctx.globalAlpha = focus && focus !== k ? 0.25 : 0.92;
      ctx.fillStyle = cons[k].color;
      ctx.font = `600 ${focus === k ? 16 : narrow ? 11.5 : 13}px ${SERIF}`;
      const name = narrow && focus !== k ? cons[k].name.split(/[、与·：]/)[0] : cons[k].name;
      ctx.fillText(`${cons[k].lodge ? cons[k].lodge + "宿 · " : ""}${name}`, Math.min(W - 60, Math.max(60, x)), y - off);
    }

    // paper labels: top stars, the hovered one and its neighbours; zooming in reveals more
    ctx.font = `11px ${SANS}`;
    let shown = 0;
    for (const n of nodes) {
      const zoomedIn = view.zoom > 2.2 && n.r * sz > 3.2;
      const show = (labelled.has(n.id) && !narrow) || n === active || (near && near.has(n.id)) || (focus === n.c && view.zoom > 1.6) || zoomedIn;
      if (!show || n.vis < 0.5 || n.sx < 0 || n.sy < 0 || n.sx > W || n.sy > H) continue;
      if (focus && n.c !== focus && n !== active) continue;
      if (++shown > 60 && n !== active) continue;
      ctx.globalAlpha = n === active ? 1 : 0.7;
      ctx.fillStyle = n === active ? "#ffffff" : "#c9cfdf";
      ctx.fillText(`${n.m.a || ""} ${n.m.y || ""}`, n.sx, n.sy + n.r * sz + 13);
    }

    // meteors
    if (!reduceMotion && now > nextMeteor) {
      const a = Math.random() * Math.PI * 2;
      meteors.push({ x: Math.random() * W, y: Math.random() * H * 0.6, vx: Math.cos(a) * 520, vy: Math.abs(Math.sin(a)) * 260 + 80, life: 0 });
      nextMeteor = now + 7000 + Math.random() * 9000;
    }
    ctx.lineWidth = 1.3;
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.life += dt;
      if (m.life > 0.9) { meteors.splice(i, 1); continue; }
      const x2 = m.x + m.vx * m.life, y2 = m.y + m.vy * m.life;
      ctx.globalAlpha = 0.8 * (1 - m.life / 0.9);
      ctx.strokeStyle = "rgba(255,245,220,0.9)";
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - m.vx * 0.1, y2 - m.vy * 0.1); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    stats.frames++; stats.ms += performance.now() - t0;
    requestAnimationFrame(frame);
  }

  canvas.style.cursor = "grab";
  resize();
}
