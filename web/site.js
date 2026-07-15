const SITE_INDEX_URL = "./web/data/site-index.json";
const PAPER_DATA_BASE = "./web/data/papers/";
const CITATION_DATA_URL = "./web/data/citations.json";
const API_SETTING_KEY = "senlab.apiBase";
const DEFAULT_API_BASE = "https://senlabapi.fyapeng.com";
const apiOverride = new URLSearchParams(window.location.search).get("api");
if (apiOverride !== null) {
  if (apiOverride === "off") localStorage.setItem(API_SETTING_KEY, "");
  else localStorage.setItem(API_SETTING_KEY, apiOverride);
}
const API_BASE = (window.SENLAB_API_BASE ?? localStorage.getItem(API_SETTING_KEY) ?? DEFAULT_API_BASE).replace(/\/$/, "");

const FIELD_LABELS = {
  "health-economics": "健康经济学",
  "applied-micro": "应用微观",
  "microeconomic-theory": "微观理论",
  "information-design": "信息设计",
  "economics": "经济学",
  "econometrics": "计量经济学",
  "public-economics": "公共经济学",
  "labor-economics": "劳动经济学",
};

const SUBFIELD_LABELS = {
  "applied-micro": "应用微观",
  econometrics: "计量经济学",
  theory: "理论",
  "information-design": "信息设计",
  "microeconomic-theory": "微观理论",
};

const PARADIGM_LABELS = {
  empirical_structural: "实证 / 结构估计",
  empirical_reduced_form: "实证 / 简约式",
  reduced_form_IV: "实证 / 工具变量",
  reduced_form_DD: "实证 / 差分法",
  theory: "理论",
  methodology: "计量方法",
  econometrics: "计量方法",
  empirical_review: "综述",
  review: "综述",
  mixed: "混合",
};

const LENS_LABELS = {
  fact: "事实",
  result: "结果",
  mechanism: "机制",
  identification: "识别",
  method: "方法",
  data: "数据",
  theory: "理论",
  policy: "政策",
  counterfactual: "反事实",
  limitation: "边界",
  research_gap: "研究缺口",
  opportunity: "延展",
};

const TOPIC_LABELS = {
  counterfactual: "反事实结果",
  identification_logic: "识别逻辑",
  mechanism_evidence: "机制证据",
  cross_year_substitution: "跨期替代",
  application_example: "应用例子",
  bayes_plausibility: "贝叶斯可行性",
  core_claim: "核心命题",
  method: "方法核心",
};

const LOCATION_LABELS = {
  Abstract: "摘要",
  Introduction: "引言",
  "Introduction, prosecutor example": "引言：检察官例子",
  "Model overview": "模型概览",
};

const SECTION_LABELS = {
  // Common core
  "Research Question": "研究问题",
  "Why It Matters": "问题分量",
  "Core Object": "研究对象",
  Approach: "研究路径",
  "Main Claim": "核心判断",
  // Empirical branch
  "Institutional Setting": "制度背景",
  "Data Source": "数据来源",
  "Identification Logic": "识别逻辑",
  "Main Results": "主要结果",
  "Mechanism Evidence": "机制证据",
  "Counterfactual Or Policy Exercise": "反事实推演",
  // Theory branch
  Players: "参与者",
  "State Space": "状态空间",
  "Action Space": "行动空间",
  "Information Structure": "信息结构",
  Timing: "博弈时序",
  "Objective Functions": "目标函数",
  "Solution Concept": "均衡概念",
  "Key Propositions": "核心命题",
  Conditions: "成立条件",
  "Comparative Statics": "比较静态",
  Applications: "应用场景",
  // Shared
  Limitations: "边界与局限",
};

const DAILY_QUOTES = [
  { text: "The important thing is not to stop questioning.", zh: "重要的是不要停止发问。", author: "Albert Einstein" },
  { text: "Read not to contradict and confute, but to weigh and consider.", zh: "读书不是为了反驳，而是为了权衡与思考。", author: "Francis Bacon" },
  { text: "Research is formalized curiosity.", zh: "研究是被形式化了的好奇心。", author: "Zora Neale Hurston" },
  { text: "Everything should be made as simple as possible, but not simpler.", zh: "一切都应尽量简单，但不能过度简化。", author: "Albert Einstein" },
  { text: "Ideas come from previous ideas.", zh: "思想常常来自更早的思想。", author: "Mark Koyama" },
  { text: "What we know is a drop, what we do not know is an ocean.", zh: "我们所知如水滴，未知如海洋。", author: "Isaac Newton" },
  { text: "The true sign of intelligence is not knowledge but imagination.", zh: "智慧真正的标志不是知识，而是想象力。", author: "Albert Einstein" },
  { text: "Science is organized knowledge. Wisdom is organized life.", zh: "科学是被组织起来的知识，智慧是被组织起来的生活。", author: "Immanuel Kant" },
  { text: "To understand is to perceive patterns.", zh: "理解，就是看见其中的模式。", author: "Isaiah Berlin" },
  { text: "A problem well stated is a problem half solved.", zh: "一个问题若被准确表述，就已经解决了一半。", author: "Charles Kettering" },
  { text: "We are drowning in information, while starving for wisdom.", zh: "我们淹没在信息里，却匮乏于判断。", author: "E. O. Wilson" },
  { text: "The voyage of discovery is not in seeking new landscapes, but in having new eyes.", zh: "发现之旅不在于寻找新风景，而在于拥有新的眼睛。", author: "Marcel Proust" },
];

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMath(root) {
  if (!root || typeof window.renderMathInElement !== "function") return;
  window.renderMathInElement(root, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
    strict: "ignore",
    trust: false,
  });
}

function bindDisclosureGroup(root, groupName) {
  const button = root.querySelector(`[data-toggle-details="${groupName}"]`);
  if (!button) return;
  const items = Array.from(root.querySelectorAll(`[data-detail-group="${groupName}"]`));
  button.addEventListener("click", () => {
    const shouldOpen = !items.every((item) => item.open);
    items.forEach((item) => { item.open = shouldOpen; });
    button.textContent = shouldOpen ? "全部收起" : "展开全部";
    button.setAttribute("aria-expanded", String(shouldOpen));
    if (shouldOpen) renderMath(root);
  });
}

function formatField(value) {
  return FIELD_LABELS[value] || value || "未分类";
}

function humanizeSlug(value) {
  if (!value) return "";
  return String(value).replace(/-/g, " ");
}

function formatSubfield(value) {
  return SUBFIELD_LABELS[value] || FIELD_LABELS[value] || humanizeSlug(value) || "未分类";
}

function formatParadigm(value) {
  return PARADIGM_LABELS[value] || value || "未判定";
}

function formatLensType(value) {
  return LENS_LABELS[value] || value || "未分类";
}

function formatTopic(value) {
  return TOPIC_LABELS[value] || humanizeSlug(value) || "未标记";
}

function formatLocation(value) {
  return LOCATION_LABELS[value] || value || "未知位置";
}

function formatThemeName(theme) {
  if (!theme) return "未链接主题";
  return theme.name || humanizeSlug(theme.theme_id) || "未链接主题";
}

function formatSolarNow() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

function formatClockNow() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function numberToChinese(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value || "");
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (number <= 10) return number === 10 ? "十" : digits[number];
  if (number < 20) return `十${digits[number % 10]}`;
  if (number < 100) {
    const tens = Math.floor(number / 10);
    const ones = number % 10;
    return `${digits[tens]}十${ones ? digits[ones] : ""}`;
  }
  return String(number);
}

function formatLunarNow() {
  try {
    const parts = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(new Date());
    return parts
      .map((part) => {
        if (part.type === "day") return numberToChinese(part.value);
        return part.value;
      })
      .join("");
  } catch {
    return "农历信息暂不可用";
  }
}

function dayPhaseInfo() {
  const hour = new Date().getHours();
  if (hour < 5) return { label: "夜航", note: "适合收束与回看" };
  if (hour < 9) return { label: "晨读", note: "适合打开新问题" };
  if (hour < 13) return { label: "昼研", note: "适合推进主线任务" };
  if (hour < 18) return { label: "午后", note: "适合整理与比较" };
  if (hour < 22) return { label: "晚灯", note: "适合精读与摘录" };
  return { label: "夜思", note: "适合归纳与沉淀" };
}

function dayProgressPercent() {
  const now = new Date();
  return Math.max(0, Math.min(100, (((now.getHours() * 60) + now.getMinutes()) / (24 * 60)) * 100));
}

function quoteForToday() {
  const now = new Date();
  const dayIndex = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
  return DAILY_QUOTES[dayIndex % DAILY_QUOTES.length];
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json();
}

async function getApiJson(path, timeoutMs = 3500) {
  if (!API_BASE) throw new Error("API disabled");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API returned HTTP ${response.status}`);
    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function getPaperData(workId) {
  const localPromise = getJson(`${PAPER_DATA_BASE}${encodeURIComponent(workId)}.json`).catch(() => null);
  try {
    const [paper, localPaper] = await Promise.all([
      getApiJson(`/api/papers/${encodeURIComponent(workId)}`),
      localPromise,
    ]);
    const apiLenses = paper.citation_points || paper.lenses || [];
    const apiExcerpts = paper.excerpts || [];
    return {
      ...(localPaper || {}),
      ...paper,
      sections: { ...(localPaper?.sections || {}), ...(paper.sections || {}) },
      lenses: apiLenses.length ? apiLenses : localPaper?.lenses || [],
      excerpts: apiExcerpts.length ? apiExcerpts : localPaper?.excerpts || [],
    };
  } catch {
    const localPaper = await localPromise;
    if (!localPaper) throw new Error(`Failed to load paper ${workId}`);
    return localPaper;
  }
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

const KNOWLEDGE_COLORS = [
  "#a0532a",
  "#2f6c82",
  "#7a8f3b",
  "#915f9b",
  "#b46d2e",
  "#4a5fa8",
  "#a2465e",
  "#3e8a72",
  "#8b6b2f",
  "#5b7f9a",
];

function topicChip(topic) {
  return `<span class="chip chip-topic">${escHtml(formatTopic(topic.name || topic.topic_id || topic))}</span>`;
}

function truncateLabel(value, maxLength = 26) {
  if (!value) return "";
  const text = String(value).trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function shortPaperTitle(title) {
  if (!title) return "";
  return truncateLabel(String(title).split(":")[0], 24);
}

function buildThemeColorMap(graph) {
  return Object.fromEntries((graph.theme_nodes || []).map((theme, index) => [theme.id, KNOWLEDGE_COLORS[index % KNOWLEDGE_COLORS.length]]));
}

function renderKnowledgeMapSection(site) {
  return `
    <section class="panel section">
      <div class="section-head">
        <div>
          <div class="eyebrow">知识结构</div>
          <h2 class="section-title">交互知识地图</h2>
        </div>
        <div class="knowledge-meta">
          <span class="chip">核心主题 <strong>${site.meta.theme_count}</strong></span>
          <span class="chip">细 topic <strong>${site.meta.topic_count || 0}</strong></span>
        </div>
      </div>
      <div class="knowledge-toolbar">
        <button type="button" class="chip chip-toggle active" data-map-mode="themes">主题网络</button>
        <button type="button" class="chip chip-toggle" data-map-mode="papers">文献网络</button>
        <div class="knowledge-controls" id="knowledge-controls">
          <button type="button" class="chip chip-control" data-knowledge-zoom="out" title="缩小">-</button>
          <button type="button" class="chip chip-control" data-knowledge-zoom="in" title="放大">+</button>
          <button type="button" class="chip chip-control" data-knowledge-zoom="reset" title="重置视图">重置</button>
        </div>
      </div>
      <div class="knowledge-layout">
        <div class="knowledge-stage-column">
          <div class="knowledge-stage-wrap">
            <div class="knowledge-caption">节点大小表示覆盖文献数或综合分，位置由网络中心性决定。文献增多后，文献模式只展示当前文献及其高关联近邻；点击节点即可继续探索。</div>
            <div id="knowledge-stage" class="knowledge-stage"></div>
            <div id="knowledge-legend" class="knowledge-legend"></div>
          </div>
        </div>
        <aside id="knowledge-detail" class="knowledge-detail">
          <div class="knowledge-card"><div class="muted">加载中...</div></div>
        </aside>
      </div>
      <div id="knowledge-related" class="knowledge-related knowledge-related-full"></div>
    </section>
  `;
}

function activateKnowledgeMap(site) {
  const graph = site.knowledge_graph;
  if (!graph || !graph.theme_nodes?.length) return;

  const stage = document.getElementById("knowledge-stage");
  const detail = document.getElementById("knowledge-detail");
  const legend = document.getElementById("knowledge-legend");
  const related = document.getElementById("knowledge-related");
  const controls = document.getElementById("knowledge-controls");
  const toggles = Array.from(document.querySelectorAll("[data-map-mode]"));
  const themeMap = new Map((graph.theme_nodes || []).map((item) => [item.id, item]));
  const paperMap = new Map(site.papers.map((item) => [item.work_id, item]));
  const paperNodeMap = new Map((graph.paper_nodes || []).map((item) => [item.id, item]));
  const colorMap = buildThemeColorMap(graph);
  const themeEdgeMax = Math.max(1, ...(graph.theme_edges || []).map((item) => item.weight || 1));
  const paperEdgeMax = Math.max(1, ...(graph.paper_edges || []).map((item) => item.weight || 1));
  const themeCentrality = new Map((graph.theme_nodes || []).map((item) => [item.id, 0]));
  const paperCentrality = new Map((graph.paper_nodes || []).map((item) => [item.id, 0]));

  let mode = "themes";
  let selectedThemeId = graph.theme_nodes[0]?.id || "";
  let selectedPaperId = graph.paper_nodes[0]?.id || "";
  let currentZoom = 1;
  let themeRotation = -Math.PI / 2;
  let paperRotation = -Math.PI / 2;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartRotX = 0;
  let dragStartRotY = 0;
  let rotAngleX = 0.48;
  let rotAngleY = 0;
  let isDragging = false;
  let movedDuringDrag = false;

  (graph.theme_edges || []).forEach((edge) => {
    themeCentrality.set(edge.source, (themeCentrality.get(edge.source) || 0) + (edge.weight || 0));
    themeCentrality.set(edge.target, (themeCentrality.get(edge.target) || 0) + (edge.weight || 0));
  });
  (graph.paper_edges || []).forEach((edge) => {
    paperCentrality.set(edge.source, (paperCentrality.get(edge.source) || 0) + (edge.weight || 0));
    paperCentrality.set(edge.target, (paperCentrality.get(edge.target) || 0) + (edge.weight || 0));
  });

  const themeCentralityMax = Math.max(1, ...themeCentrality.values());
  const paperCentralityMax = Math.max(1, ...paperCentrality.values());
  const centralityRatio = (value, max) => (max ? value / max : 0);
  const themeTier = (themeId) => {
    const ratio = centralityRatio(themeCentrality.get(themeId) || 0, themeCentralityMax);
    if (ratio >= 0.72) return "core";
    if (ratio >= 0.4) return "bridge";
    return "edge";
  };
  const paperTier = (paperId) => {
    const ratio = centralityRatio(paperCentrality.get(paperId) || 0, paperCentralityMax);
    if (ratio >= 0.68) return "core";
    if (ratio >= 0.34) return "bridge";
    return "edge";
  };
  const tierLabel = (tier) => ({ core: "核心", bridge: "桥接", edge: "外围" }[tier] || "外围");

  const papersForTheme = (themeId) => (themeMap.get(themeId)?.paper_ids || []).map((id) => paperMap.get(id)).filter(Boolean);
  const relatedThemes = (themeId) =>
    (graph.theme_edges || [])
      .filter((edge) => edge.source === themeId || edge.target === themeId)
      .map((edge) => {
        const otherId = edge.source === themeId ? edge.target : edge.source;
        return { edge, theme: themeMap.get(otherId) };
      })
      .filter((item) => item.theme)
      .sort((left, right) => right.edge.weight - left.edge.weight);

  const relatedPapers = (paperId) =>
    (graph.paper_edges || [])
      .filter((edge) => edge.source === paperId || edge.target === paperId)
      .map((edge) => {
        const otherId = edge.source === paperId ? edge.target : edge.source;
        return { edge, paper: paperMap.get(otherId) };
      })
      .filter((item) => item.paper)
      .sort((left, right) => right.edge.weight - left.edge.weight || (right.paper.ratings.overall || 0) - (left.paper.ratings.overall || 0));

  function renderLegend() {
    const themeLegend = (graph.theme_nodes || [])
      .map((theme) => `
          <span class="legend-chip">
            <span class="legend-dot" style="background:${colorMap[theme.id] || "#a0532a"}"></span>
            ${escHtml(theme.name)}
          </span>
        `)
      .join("");
    legend.innerHTML = `
      <span class="legend-chip legend-chip-soft">中心越近表示网络中心性越高</span>
      <span class="legend-chip legend-chip-soft">核心 / 桥接 / 外围 展示文献发展层次</span>
      ${themeLegend}
    `;
  }

  function project3D(x, y, z) {
    const cosY = Math.cos(rotAngleY), sinY = Math.sin(rotAngleY);
    const cosX = Math.cos(rotAngleX), sinX = Math.sin(rotAngleX);
    const xR = x * cosY - z * sinY;
    const zR = x * sinY + z * cosY;
    const yF = y * cosX + zR * sinX;
    const zF = -y * sinX + zR * cosX;
    const focal = 1400;
    const sc = focal / (focal + zF);
    return { sx: xR * sc, sy: -yF * sc, depth: zF, sc };
  }

  function themeSvg(selectedId) {
    const width = 920;
    const height = 580;
    const cx = width / 2;
    const cy = height / 2;
    const nodes = [...graph.theme_nodes];
    const sorted = nodes.sort((a, b) =>
      (themeCentrality.get(b.id) || 0) - (themeCentrality.get(a.id) || 0) ||
      b.paper_count - a.paper_count ||
      a.name.localeCompare(b.name)
    );
    const rings = [
      { key: "core",   r: 90,  hy: 28 },
      { key: "bridge", r: 228, hy: 56 },
      { key: "edge",   r: 356, hy: 84 },
    ];

    const positions = new Map();
    rings.forEach((ring, ri) => {
      const ringNodes = sorted.filter((n) => themeTier(n.id) === ring.key);
      ringNodes.forEach((node, i) => {
        const angle = themeRotation + (Math.PI * 2 * i) / Math.max(ringNodes.length, 1) + (i % 2 === 0 ? -0.1 : 0.12);
        const x3 = ring.r * Math.cos(angle);
        const y3 = Math.sin(angle * 1.7 + ri * 0.62) * ring.hy;
        const z3 = ring.r * Math.sin(angle);
        const proj = project3D(x3, y3, z3);
        positions.set(node.id, { x: cx + proj.sx, y: cy + proj.sy, depth: proj.depth, sc: proj.sc });
      });
    });

    const guides = rings.map((ring) => {
      const pts = Array.from({ length: 64 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 64;
        const p = project3D(ring.r * Math.cos(a), 0, ring.r * Math.sin(a));
        return `${(cx + p.sx).toFixed(1)},${(cy + p.sy).toFixed(1)}`;
      }).join(" ");
      return `<polygon points="${pts}" class="knowledge-orbit" />`;
    }).join("");

    const edges = (graph.theme_edges || [])
      .map((edge) => {
        const s = positions.get(edge.source);
        const t = positions.get(edge.target);
        if (!s || !t) return "";
        const isActive = edge.source === selectedId || edge.target === selectedId;
        const depthAlpha = isActive ? 0.46 : Math.max(0.06, 0.16 - Math.max(0, (s.depth + t.depth) / 2) * 0.0004);
        return `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="rgba(104,120,133,${depthAlpha.toFixed(2)})" stroke-width="${(1 + (edge.weight / themeEdgeMax) * 3.5).toFixed(1)}" />`;
      })
      .join("");

    const byDepth = [...sorted].sort((a, b) => (positions.get(b.id)?.depth || 0) - (positions.get(a.id)?.depth || 0));
    const nodeMarkup = byDepth
      .map((node) => {
        const pos = positions.get(node.id);
        if (!pos) return "";
        const isActive = node.id === selectedId;
        const tier = themeTier(node.id);
        const showLabel = isActive || tier !== "edge";
        const baseR = 14 + node.paper_count * 4.5;
        const r = Math.max(6, baseR * clamp(pos.sc, 0.54, 1.24));
        const depthOpacity = Math.max(0.52, 1 - Math.max(0, pos.depth) * 0.0008);
        return `
          <g class="knowledge-node-group ${isActive ? "active" : ""} tier-${tier}" data-theme-id="${node.id}" tabindex="0">
            <title>${escHtml(node.name)}</title>
            <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${colorMap[node.id] || "#a0532a"}" fill-opacity="${((isActive ? 0.96 : 0.82) * depthOpacity).toFixed(2)}" stroke="${isActive ? "#16202a" : "rgba(22,32,42,0.16)"}" stroke-width="${isActive ? 2.4 : 1.2}" />
            ${showLabel ? `<text x="${pos.x.toFixed(1)}" y="${(pos.y + r + 18).toFixed(1)}" text-anchor="middle" class="knowledge-label">${escHtml(truncateLabel(node.name, 14))}</text>` : ""}
            <text x="${pos.x.toFixed(1)}" y="${(pos.y + 5).toFixed(1)}" text-anchor="middle" class="knowledge-count">${node.paper_count}</text>
          </g>`;
      })
      .join("");

    return `<svg class="knowledge-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="主题网络图">${guides}${edges}${nodeMarkup}</svg>`;
  }

  function paperSvg(selectedId) {
    const width = 920;
    const height = 580;
    const cx = width / 2;
    const cy = height / 2;
    const allPaperNodes = graph.paper_nodes || [];
    const allPaperEdges = graph.paper_edges || [];
    const visibleIds = new Set();
    if (allPaperNodes.length <= 24) {
      allPaperNodes.forEach((paper) => visibleIds.add(paper.id));
    } else {
      visibleIds.add(selectedId);
      allPaperEdges
        .filter((edge) => edge.source === selectedId || edge.target === selectedId)
        .sort((a, b) => (b.weight || 0) - (a.weight || 0))
        .slice(0, 17)
        .forEach((edge) => visibleIds.add(edge.source === selectedId ? edge.target : edge.source));
      allPaperNodes
        .filter((paper) => !visibleIds.has(paper.id))
        .sort((a, b) => (paperCentrality.get(b.id) || 0) - (paperCentrality.get(a.id) || 0))
        .slice(0, Math.max(0, 24 - visibleIds.size))
        .forEach((paper) => visibleIds.add(paper.id));
    }
    const visiblePaperNodes = allPaperNodes.filter((paper) => visibleIds.has(paper.id));
    const visiblePaperEdges = allPaperEdges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
    const visibleThemeIds = new Set(visiblePaperNodes.map((paper) => paper.primary_theme_id));
    const themeOrder = (graph.theme_nodes || []).map((item) => item.id).filter((id) => visibleThemeIds.has(id));
    const grouped = themeOrder.flatMap((themeId) =>
      visiblePaperNodes
        .filter((p) => p.primary_theme_id === themeId)
        .sort((a, b) => (b.overall || 0) - (a.overall || 0) || (b.year || 0) - (a.year || 0))
    );
    const leftovers = visiblePaperNodes.filter((p) => !grouped.find((g) => g.id === p.id)).sort((a, b) => (b.overall || 0) - (a.overall || 0));
    const nodes = [...grouped, ...leftovers];

    const clusterR = 202;
    const themeAnchors = new Map();
    themeOrder.forEach((themeId, i) => {
      const angle = paperRotation + (Math.PI * 2 * i) / Math.max(themeOrder.length, 1);
      themeAnchors.set(themeId, { ax: clusterR * Math.cos(angle), ay: 0, az: clusterR * Math.sin(angle), angle });
    });

    const positions = new Map();
    nodes.forEach((paper) => {
      const anchor = themeAnchors.get(paper.primary_theme_id) || { ax: 0, ay: 0, az: 0, angle: paperRotation };
      const cluster = nodes.filter((p) => p.primary_theme_id === paper.primary_theme_id)
        .sort((a, b) => (paperCentrality.get(b.id) || 0) - (paperCentrality.get(a.id) || 0) || (b.overall || 0) - (a.overall || 0));
      const idx = cluster.findIndex((p) => p.id === paper.id);
      const tier = paperTier(paper.id);
      const band = tier === "core" ? 56 : tier === "bridge" ? 110 : 172;
      const spread = tier === "core" ? 0.18 : tier === "bridge" ? 0.4 : 0.62;
      const offset = cluster.length > 1 ? ((idx / (cluster.length - 1 || 1)) - 0.5) * spread : 0;
      const spreadAngle = anchor.angle + offset;
      const x3 = anchor.ax + Math.cos(spreadAngle) * band;
      const y3 = anchor.ay + Math.sin(offset * Math.PI) * 44;
      const z3 = anchor.az + Math.sin(spreadAngle) * band;
      const proj = project3D(x3, y3, z3);
      positions.set(paper.id, { x: cx + proj.sx, y: cy + proj.sy, depth: proj.depth, sc: proj.sc });
    });

    const edges = visiblePaperEdges
      .map((edge) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return "";
        const isActive = edge.source === selectedId || edge.target === selectedId;
        const depthAlpha = isActive ? 0.38 : Math.max(0.04, 0.12 - Math.max(0, (source.depth + target.depth) / 2) * 0.0003);
        return `<line x1="${source.x.toFixed(1)}" y1="${source.y.toFixed(1)}" x2="${target.x.toFixed(1)}" y2="${target.y.toFixed(1)}" stroke="rgba(104,120,133,${depthAlpha.toFixed(2)})" stroke-width="${(0.8 + (edge.weight / paperEdgeMax) * 2.6).toFixed(1)}" />`;
      })
      .join("");

    const byDepth = [...nodes].sort((a, b) => (positions.get(b.id)?.depth || 0) - (positions.get(a.id)?.depth || 0));
    const nodeMarkup = byDepth.map((paper) => {
      const pos = positions.get(paper.id);
      if (!pos) return "";
      const isActive = paper.id === selectedId;
      const color = colorMap[paper.primary_theme_id] || "#a0532a";
      const tier = paperTier(paper.id);
      const baseR = 8 + Math.max(0, (paper.overall || 0) - 40) * 0.35;
      const radius = Math.max(5, baseR * clamp(pos.sc, 0.54, 1.24));
      const showLabel = isActive || tier === "core";
      const depthOpacity = Math.max(0.52, 1 - Math.max(0, pos.depth) * 0.0008);
      return `
        <g class="knowledge-node-group ${isActive ? "active" : ""} tier-${tier}" data-paper-id="${paper.id}" tabindex="0">
          <title>${escHtml(paper.title || "")}</title>
          <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" fill-opacity="${((isActive ? 0.96 : 0.8) * depthOpacity).toFixed(2)}" stroke="${isActive ? "#16202a" : "rgba(22,32,42,0.12)"}" stroke-width="${isActive ? 2.2 : 1}" />
          ${showLabel ? `<text x="${pos.x.toFixed(1)}" y="${(pos.y + radius + 16).toFixed(1)}" text-anchor="middle" class="knowledge-paper-label">${escHtml(shortPaperTitle(paper.title || ""))}</text>` : ""}
        </g>`;
    }).join("");

    return `<svg class="knowledge-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="文献关系图">${edges}${nodeMarkup}</svg>`;
  }

  function themeDetail(themeId) {
    const theme = themeMap.get(themeId);
    if (!theme) return "";
    const neighbors = relatedThemes(themeId);
    const ratio = Math.round(centralityRatio(themeCentrality.get(themeId) || 0, themeCentralityMax) * 100);
    return `
      <div class="knowledge-card"><div class="eyebrow">当前主题</div><h3>${escHtml(theme.name)}</h3><div class="knowledge-stat-row"><span class="chip chip-tier tier-${themeTier(themeId)}">${tierLabel(themeTier(themeId))}主题</span><span class="chip">${ratio} / 100 中心度</span><span class="chip">${theme.paper_count} 篇文献</span></div><p class="muted">越靠近地图中心，说明它与更多主题共享文献，承担更强的聚合作用。</p></div>
      <div class="knowledge-card"><div class="eyebrow">高频 Topics</div><div class="chip-row">${(theme.top_topics || []).map(topicChip).join("") || '<span class="muted">暂无</span>'}</div></div>
      <div class="knowledge-card"><div class="eyebrow">相邻主题</div><div class="stack-list compact">${neighbors.slice(0, 4).map(({ edge, theme: item }) => `<button type="button" class="stack-item action" data-theme-jump="${item.id}"><strong>${escHtml(item.name)}</strong><div class="muted">共享 ${edge.weight} 篇论文 · ${tierLabel(themeTier(item.id))}层</div></button>`).join("") || '<div class="stack-item"><div class="muted">当前没有共现主题。</div></div>'}</div></div>
    `;
  }

  function paperDetail(paperId) {
    const paper = paperMap.get(paperId);
    const paperNode = paperNodeMap.get(paperId);
    if (!paper || !paperNode) return "";
    const ratio = Math.round(centralityRatio(paperCentrality.get(paperId) || 0, paperCentralityMax) * 100);
    return `
      <div class="knowledge-card"><div class="eyebrow">当前文献</div><h3><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${escHtml(paper.title)}</a></h3><p class="muted">${escHtml(paper.authors || "")}</p><p class="muted">${escHtml(String(paper.year || ""))} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</p><div class="knowledge-stat-row"><span class="chip chip-tier tier-${paperTier(paperId)}">${tierLabel(paperTier(paperId))}文献</span><span class="chip">${ratio} / 100 中心度</span><span class="chip">综合分 ${paper.ratings.overall ?? "-"} / 60</span></div></div>
      <div class="knowledge-card"><div class="eyebrow">主题</div><div class="chip-row">${paper.themes.map((theme) => `<button type="button" class="chip chip-topic chip-action" data-theme-jump="${theme.theme_id}">${escHtml(formatThemeName(theme))}</button>`).join("")}</div></div>
      <div class="knowledge-card"><div class="eyebrow">Topics</div><div class="chip-row">${(paper.topics || []).map(topicChip).join("") || '<span class="muted">暂无</span>'}</div></div>
    `;
  }

  function themeRelatedPanel(themeId) {
    const linkedPapers = papersForTheme(themeId).sort((left, right) => (right.ratings.overall || 0) - (left.ratings.overall || 0) || (right.year || 0) - (left.year || 0));
    return `<div class="knowledge-card knowledge-card-wide"><div class="section-head compact"><div><div class="eyebrow">主题脉络</div><h3 class="knowledge-subtitle">相关文献</h3></div></div><div class="knowledge-related-grid">${linkedPapers.map((paper) => `<button type="button" class="knowledge-mini-card" data-paper-jump="${paper.work_id}"><div class="knowledge-mini-top"><span class="chip chip-tier tier-${paperTier(paper.work_id)}">${tierLabel(paperTier(paper.work_id))}</span><span class="knowledge-mini-score">${paper.ratings.overall ?? "-"} / 60</span></div><strong>${escHtml(truncateLabel(paper.title, 82))}</strong><div class="muted">${escHtml(String(paper.year || ""))} · ${escHtml(paper.authors || "")}</div></button>`).join("")}</div></div>`;
  }

  function paperRelatedPanel(paperId) {
    const neighbors = relatedPapers(paperId);
    return `<div class="knowledge-card knowledge-card-wide"><div class="section-head compact"><div><div class="eyebrow">文献脉络</div><h3 class="knowledge-subtitle">相关文献</h3></div></div><div class="knowledge-related-grid">${neighbors.slice(0, 8).map(({ edge, paper: item }) => `<button type="button" class="knowledge-mini-card" data-paper-jump="${item.work_id}"><div class="knowledge-mini-top"><span class="chip chip-tier tier-${paperTier(item.work_id)}">${tierLabel(paperTier(item.work_id))}</span><span class="knowledge-mini-score">共享 ${edge.shared_theme_ids.length} 个主题</span></div><strong>${escHtml(truncateLabel(item.title, 82))}</strong><div class="muted">${escHtml(String(item.year || ""))} · 综合分 ${item.ratings.overall ?? "-"}</div></button>`).join("") || '<div class="muted">当前没有共享主题的近邻文献。</div>'}</div></div>`;
  }

  function bindDetailActions(root = detail) {
    root.querySelectorAll("[data-theme-jump]").forEach((button) => button.addEventListener("click", () => { mode = "themes"; selectedThemeId = button.getAttribute("data-theme-jump") || selectedThemeId; render(); }));
    root.querySelectorAll("[data-paper-jump]").forEach((button) => button.addEventListener("click", () => { mode = "papers"; selectedPaperId = button.getAttribute("data-paper-jump") || selectedPaperId; render(); }));
  }

  function bindStageActions() {
    stage.querySelectorAll("[data-theme-id]").forEach((node) => {
      node.addEventListener("pointerdown", (event) => event.stopPropagation());
      const jump = () => { if (movedDuringDrag) return; selectedThemeId = node.getAttribute("data-theme-id") || selectedThemeId; render(); };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); jump(); } });
    });
    stage.querySelectorAll("[data-paper-id]").forEach((node) => {
      node.addEventListener("pointerdown", (event) => event.stopPropagation());
      const jump = () => { if (movedDuringDrag) return; selectedPaperId = node.getAttribute("data-paper-id") || selectedPaperId; render(); };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); jump(); } });
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function applyZoom() {
    const inner = stage.querySelector(".knowledge-stage-inner");
    if (inner) inner.style.transform = `scale(${currentZoom})`;
  }

  function bindStageGestures() {
    if (!stage) return;
    stage.onpointerdown = (event) => {
      isDragging = true;
      movedDuringDrag = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartRotX = rotAngleX;
      dragStartRotY = rotAngleY;
      stage.classList.add("dragging");
      stage.setPointerCapture?.(event.pointerId);
    };
    stage.onpointermove = (event) => {
      if (!isDragging) return;
      const dx = event.clientX - dragStartX;
      const dy = event.clientY - dragStartY;
      if (Math.hypot(dx, dy) > 4) movedDuringDrag = true;
      rotAngleY = dragStartRotY + dx * 0.007;
      rotAngleX = clamp(dragStartRotX - dy * 0.007, -Math.PI / 2, Math.PI / 2);
      const svg = mode === "themes" ? themeSvg(selectedThemeId) : paperSvg(selectedPaperId);
      stage.innerHTML = `<div class="knowledge-stage-inner" style="transform:scale(${currentZoom})">${svg}</div>`;
    };
    const stopDragging = () => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove("dragging");
      render();
      window.setTimeout(() => { movedDuringDrag = false; }, 0);
    };
    stage.onpointerup = stopDragging;
    stage.onpointerleave = stopDragging;
    stage.onpointercancel = stopDragging;
  }

  function bindControls() {
    if (!controls) return;
    controls.querySelectorAll("[data-knowledge-zoom]").forEach((button) => {
      button.onclick = () => {
        const action = button.getAttribute("data-knowledge-zoom");
        if (action === "in") currentZoom = Math.min(1.6, currentZoom + 0.15);
        if (action === "out") currentZoom = Math.max(0.7, currentZoom - 0.15);
        if (action === "reset") {
          currentZoom = 1;
          rotAngleX = 0.48;
          rotAngleY = 0;
          render();
          return;
        }
        applyZoom();
      };
    });
  }

  function render() {
    toggles.forEach((button) => button.classList.toggle("active", button.getAttribute("data-map-mode") === mode));
    const svg = mode === "themes" ? themeSvg(selectedThemeId) : paperSvg(selectedPaperId);
    stage.innerHTML = `<div class="knowledge-stage-inner" style="transform:scale(${currentZoom})">${svg}</div>`;
    if (mode === "themes") { detail.innerHTML = themeDetail(selectedThemeId); if (related) related.innerHTML = themeRelatedPanel(selectedThemeId); }
    else { detail.innerHTML = paperDetail(selectedPaperId); if (related) related.innerHTML = paperRelatedPanel(selectedPaperId); }
    bindStageActions();
    bindStageGestures();
    bindDetailActions();
    if (related) bindDetailActions(related);
    bindControls();
  }

  toggles.forEach((button) => button.addEventListener("click", () => { mode = button.getAttribute("data-map-mode") || "themes"; render(); }));
  renderLegend();
  render();
}

function buildShell(site, activePage) {
  const shell = el("div", "site");
  const navLinks = site.nav
    .map((item) => {
      const isActive = item.href.endsWith(`${activePage}.html`) || (activePage === "dashboard" && item.href === "./index.html");
      return `<a class="nav-link ${isActive ? "active" : ""}" href="${item.href}">${item.label}</a>`;
    })
    .join("");

  shell.innerHTML = `
    <header class="topbar">
      <div class="topbar-inner">
        <a href="./index.html" class="brand-lockup">
          <img class="brand-logo intro" src="${site.brand.logo_intro_url}?v=20260612f" alt="Sencium Lab" />
        </a>
        <nav class="nav">${navLinks}</nav>
      </div>
    </header>
    <main class="main" id="page-main"></main>
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-copy">
          <strong>Sencium Lab</strong><br />
          私人文献档案，精读沉淀，引用可用。公众号：${site.brand.wechat_name}
        </div>
        <div class="footer-links">
          <a href="${site.brand.github_url}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:${site.brand.contact_email}">${site.brand.contact_email}</a>
          <span>欢迎来信推荐文献与主题</span>
        </div>
      </div>
    </footer>
  `;

  return shell;
}

function scoreStrip(ratings) {
  const dims = [
    ["道", ratings.dao],
    ["法", ratings.fa],
    ["势", ratings.shi],
    ["术", ratings.shu],
    ["器", ratings.qi],
    ["主观", ratings.subjective],
  ];
  return `
    <div class="score-strip">
      ${dims
        .map(
          ([label, value]) => `
            <div class="score-pill" ${value != null ? `data-score="${value}"` : ""}>
              <strong>${value ?? "—"}</strong>
              <span>${label}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function paperCard(paper) {
  return `
    <article class="paper-card">
      <div class="paper-meta">${escHtml(paper.year || "—")} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
      <h3><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${escHtml(paper.title)}</a></h3>
      <div class="muted">${escHtml(paper.authors || "")}</div>
      ${paper.one_line_judgment ? `<p class="card-judgment">${escHtml(paper.one_line_judgment)}</p>` : ""}
      <div class="muted small">${escHtml(paper.journal_or_series || "期刊待补充")}${paper.doi ? ` · DOI: ${escHtml(paper.doi)}` : ""}</div>
      ${scoreStrip(paper.ratings)}
      <div class="chip-row">
        ${paper.themes.map((theme) => `<span class="chip">${escHtml(theme.name)}</span>`).join("")}
      </div>
      ${paper.topics?.length ? `<div class="chip-row topic-chip-row">${paper.topics.slice(0, 4).map(topicChip).join("")}</div>` : ""}
      <div class="tag-row">
        <a class="button-link" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">查看详情</a>
        <a class="button-link secondary" href="./compare.html?left=${encodeURIComponent(paper.work_id)}">加入对比</a>
      </div>
    </article>
  `;
}

function radarSvg(ratings, maxScore = 10) {
  const dims = [
    { key: "dao", label: "道" },
    { key: "fa", label: "法" },
    { key: "shi", label: "势" },
    { key: "shu", label: "术" },
    { key: "qi", label: "器" },
    { key: "subjective", label: "主观" },
  ];
  const size = 300;
  const center = size / 2;
  const radius = 98;
  const levels = maxScore;
  const step = (Math.PI * 2) / dims.length;
  const polygons = Array.from({ length: levels }, (_, index) => {
    const ratio = (index + 1) / levels;
    const points = dims
      .map((_, i) => {
        const angle = -Math.PI / 2 + step * i;
        const x = center + Math.cos(angle) * radius * ratio;
        const y = center + Math.sin(angle) * radius * ratio;
        return `${x},${y}`;
      })
      .join(" ");
    return `<polygon points="${points}" fill="none" stroke="rgba(104,120,133,0.16)"/>`;
  }).join("");

  const axes = dims
    .map((dim, i) => {
      const angle = -Math.PI / 2 + step * i;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const lx = center + Math.cos(angle) * (radius + 22);
      const ly = center + Math.sin(angle) * (radius + 22);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(104,120,133,0.24)"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#16202a">${dim.label}</text>`;
    })
    .join("");

  const filled = dims
    .map((dim, i) => {
      const score = Number(ratings[dim.key] || 0);
      const ratio = score / levels;
      const angle = -Math.PI / 2 + step * i;
      const x = center + Math.cos(angle) * radius * ratio;
      const y = center + Math.sin(angle) * radius * ratio;
      return `${x},${y}`;
    })
    .join(" ");

  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="300">${polygons}${axes}<polygon points="${filled}" fill="rgba(160,83,42,0.22)" stroke="#a0532a" stroke-width="3"/></svg>`;
}

function statCard(label, value, note) {
  return `<div class="metric-card panel"><div class="eyebrow">${label}</div><div class="metric-value">${value}</div><div class="metric-label">${note}</div></div>`;
}

function renderTimeWidget() {
  const phase = dayPhaseInfo();
  const progress = dayProgressPercent();
  return `
    <div id="time-widget" class="time-widget">
      <div class="eyebrow">此刻</div>
      <div class="time-widget-head">
        <h2 class="section-title clock-now" id="clock-now">${formatClockNow()}</h2>
        <span class="time-phase-chip" id="day-phase-label">${phase.label}</span>
      </div>
      <p class="intro-text time-date-line" id="solar-now">${formatSolarNow()}</p>
      <p class="intro-text time-date-line lunar-line" id="lunar-now">${formatLunarNow()}</p>
      <div class="time-widget-grid">
        <div class="time-mini-card">
          <div class="time-mini-label">今日节律</div>
          <strong id="day-phase-note">${phase.note}</strong>
        </div>
        <div class="time-mini-card">
          <div class="time-mini-label">昼夜进度</div>
          <strong id="day-progress-text">${Math.round(progress)}%</strong>
        </div>
      </div>
      <div class="time-progress" aria-hidden="true">
        <span id="day-progress-bar" style="width:${progress}%"></span>
      </div>
    </div>
  `;
}

function activateClock() {
  const clock = document.getElementById("clock-now");
  const solar = document.getElementById("solar-now");
  const lunar = document.getElementById("lunar-now");
  const phaseLabel = document.getElementById("day-phase-label");
  const phaseNote = document.getElementById("day-phase-note");
  const progressText = document.getElementById("day-progress-text");
  const progressBar = document.getElementById("day-progress-bar");
  if (!clock || !solar || !lunar) return;
  const updateTime = () => {
    const phase = dayPhaseInfo();
    const progress = dayProgressPercent();
    clock.textContent = formatClockNow();
    solar.textContent = formatSolarNow();
    lunar.textContent = formatLunarNow();
    if (phaseLabel) phaseLabel.textContent = phase.label;
    if (phaseNote) phaseNote.textContent = phase.note;
    if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;
  };
  updateTime();
  window.setInterval(updateTime, 1000);
}

async function renderDashboard(site) {
  const main = document.getElementById("page-main");
  const topPapers = site.rankings.overall
    .slice(0, 4)
    .map((id) => site.papers.find((paper) => paper.work_id === id))
    .filter(Boolean);
  const quote = quoteForToday();

  main.innerHTML = `
    <section class="hero hero-dashboard">
      <div class="hero-copy panel">
        <div class="eyebrow">序言</div>
        <h1>Sencium Lab</h1>
        <p class="lead">${site.brand.tagline}</p>
        <p class="intro-text">Sencium Lab 将题目、作者、期刊、六维十分制评分、证据摘录与主题脉络整理为结构化档案，让检索、比较、引用与选题在同一个研究系统内完成。</p>
        <div class="intro-shelf">
          <div class="intro-note">
            <h3 class="intro-note-title">档案</h3>
            <p class="intro-note-text">将题目、作者、期刊、DOI 与核心判断整理为结构化的论文案卡，经年可查。</p>
          </div>
          <div class="intro-note">
            <h3 class="intro-note-title">视角</h3>
            <p class="intro-note-text">从每篇论文中提炼可复用的论断、支撑证据与安全引用边界，构成引用视角。</p>
          </div>
          <div class="intro-note">
            <h3 class="intro-note-title">脉络</h3>
            <p class="intro-note-text">以主题、评分与摘录为基础，逐步积累长期研究可持续扩展的知识脉络。</p>
          </div>
        </div>
      </div>
      <div class="hero-side panel">
        ${renderTimeWidget()}
        <div class="info-card quote-card">
          <div class="eyebrow">今日引句</div>
          <p class="quote-en">“${quote.text}”</p>
          <p class="quote-zh">${quote.zh}</p>
          <p class="quote-author">—— ${quote.author}</p>
        </div>
      </div>
    </section>

    <section class="grid-4">
      ${statCard("收录论文", site.meta.paper_count, "已建立案卡并完成六维十分制评分")}
      ${statCard("研究主题", site.meta.theme_count, "跨论文的主题聚合节点")}
      ${statCard("证据摘录", site.meta.excerpt_count, "可溯源至原文位置的证据块")}
      ${statCard("引用视角", site.meta.lens_count, "可复用的论断与引文边界")}
    </section>

    <section class="panel section">
      <div class="section-head">
        <div>
          <div class="eyebrow">评议体系</div>
          <h2 class="section-title">六维十分制</h2>
        </div>
      </div>
      <div class="grid-3">
        ${site.score_dimensions
          .map(
            (item) => `
              <div class="info-card">
                <h3>${item.label}</h3>
                <p class="muted">${item.desc}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <div class="eyebrow">高分样本</div>
          <h2 class="section-title">当前高分论文</h2>
        </div>
        <a class="button-link secondary" href="./rankings.html">查看完整排序</a>
      </div>
      <div class="grid-2">
        ${topPapers.map((paper) => paperCard(paper)).join("")}
      </div>
    </section>

    <section class="grid-2">
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">主题分布</div>
            <h2 class="section-title">知识地图</h2>
          </div>
        </div>
        <div class="stack-list">
          ${site.theme_distribution
            .slice(0, 8)
            .map(
              (theme) => `
                <div class="stack-item">
                  <strong>${theme.name}</strong>
                  <div class="muted">${theme.paper_count} 篇论文</div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">最近入库</div>
            <h2 class="section-title">最新入档</h2>
          </div>
        </div>
        <div class="stack-list">
          ${site.latest
            .map((workId) => site.papers.find((paper) => paper.work_id === workId))
            .filter(Boolean)
            .map(
              (paper) => `
                <div class="stack-item">
                  <a href="./paper.html?work=${encodeURIComponent(paper.work_id)}"><strong>${paper.title}</strong></a>
                  <div class="muted">${paper.authors || ""}</div>
                  <div class="muted">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  activateClock();
}

async function renderDashboardV2(site) {
  const main = document.getElementById("page-main");
  const topPapers = site.rankings.overall
    .slice(0, 4)
    .map((id) => site.papers.find((paper) => paper.work_id === id))
    .filter(Boolean);
  const quote = quoteForToday();

  main.innerHTML = `
    <section class="hero hero-dashboard">
      <div class="hero-copy panel">
        <div class="eyebrow">序言</div>
        <h1>Sencium Lab</h1>
        <p class="lead">${site.brand.tagline}</p>
        <p class="intro-text">Sencium Lab 将题目、作者、期刊、六维十分制评分、细粒度 topic、证据摘录与中层主题脉络整理为结构化档案，让检索、比较、引用与选题在同一个研究系统内完成。</p>
        <div class="intro-shelf">
          <div class="intro-note">
            <h3 class="intro-note-title">档案</h3>
            <p class="intro-note-text">把题目、作者、期刊、DOI 与核心判断整理成结构化 paper card，长期可检索、可对比。</p>
          </div>
          <div class="intro-note">
            <h3 class="intro-note-title">视角</h3>
            <p class="intro-note-text">从每篇论文中提炼可复用的论断、支撑证据与安全引用边界，形成 citation lenses。</p>
          </div>
          <div class="intro-note">
            <h3 class="intro-note-title">脉络</h3>
            <p class="intro-note-text">用中层 theme 和细 topic 共同组织文献，逐步长成可交互的研究知识网络。</p>
          </div>
        </div>
      </div>
      <div class="hero-side panel">
        ${renderTimeWidget()}
        <div class="info-card quote-card">
          <div class="eyebrow">今日引句</div>
          <p class="quote-en">“${quote.text}”</p>
          <p class="quote-zh">${quote.zh}</p>
          <p class="quote-author">—— ${quote.author}</p>
        </div>
      </div>
    </section>

    <section class="grid-4">
      ${statCard("收录论文", site.meta.paper_count, "已建立案卡并完成六维十分制评分")}
      ${statCard("核心主题", site.meta.theme_count, "适合跨论文聚合与知识地图展示的中层 theme")}
      ${statCard("细 Topics", site.meta.topic_count || 0, "保留对象、方法、制度与术语层面的细粒度 topic")}
      ${statCard("证据与视角", `${site.meta.excerpt_count} / ${site.meta.lens_count}`, "证据摘录与 citation lenses 共同支持后续复用")}
    </section>

    ${renderKnowledgeMapSection(site)}

    <section class="panel section">
      <div class="section-head">
        <div>
          <div class="eyebrow">评分体系</div>
          <h2 class="section-title">六维十分制</h2>
        </div>
      </div>
      <div class="grid-3">
        ${site.score_dimensions
          .map(
            (item) => `
              <div class="info-card">
                <h3>${item.label}</h3>
                <p class="muted">${item.desc}</p>
              </div>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <div class="eyebrow">高分样本</div>
          <h2 class="section-title">当前高分论文</h2>
        </div>
        <a class="button-link secondary" href="./rankings.html">查看完整排序</a>
      </div>
      <div class="grid-2">
        ${topPapers.map((paper) => paperCard(paper)).join("")}
      </div>
    </section>

    <section class="panel section">
      <div class="section-head">
        <div>
          <div class="eyebrow">最近入库</div>
          <h2 class="section-title">最新入档</h2>
        </div>
      </div>
      <div class="grid-2">
        ${site.latest
          .map((workId) => site.papers.find((paper) => paper.work_id === workId))
          .filter(Boolean)
          .map(
            (paper) => `
              <div class="stack-item">
                <a href="./paper.html?work=${encodeURIComponent(paper.work_id)}"><strong>${paper.title}</strong></a>
                <div class="muted">${paper.authors || ""}</div>
                <div class="muted">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;

  activateKnowledgeMap(site);
  activateClock();
}

async function renderRankings(site) {
  const main = document.getElementById("page-main");
  const metric = qs("metric") || "overall";
  const page = Number(qs("page") || "1");
  const pageSize = 12;
  const rankingIds = site.rankings[metric] || site.rankings.overall;
  const rankingPapers = rankingIds.map((id) => site.papers.find((paper) => paper.work_id === id)).filter(Boolean);
  const totalPages = Math.max(1, Math.ceil(rankingPapers.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const visible = rankingPapers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const metricLabels = { overall: "综合", dao: "道", fa: "法", shi: "势", shu: "术", qi: "器", subjective: "主观" };

  main.innerHTML = `
    <section class="panel">
      <div class="section-head">
        <div>
          <div class="eyebrow">排序</div>
          <h1 class="section-title">评分排序</h1>
        </div>
        <div class="chip-row">
          ${Object.entries(metricLabels).map(([key, label]) => `<a class="chip${key === metric ? " active" : ""}" href="./rankings.html?metric=${key}">${label}</a>`).join("")}
        </div>
      </div>
      <div class="list-mode">
        ${visible
          .map((paper, index) => {
            const value = metric === "overall" ? paper.ratings.overall : paper.ratings[metric];
            return `
              <article class="paper-row">
                <div class="paper-row-head">
                  <div>
                    <div class="paper-meta">#${(currentPage - 1) * pageSize + index + 1} · ${escHtml(String(paper.year || "—"))} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
                    <h3 class="paper-row-title"><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${escHtml(paper.title)}</a></h3>
                    <div class="muted">${escHtml(paper.authors || "")}</div>
                    ${paper.one_line_judgment ? `<p class="row-judgment">${escHtml(paper.one_line_judgment)}</p>` : ""}
                  </div>
                  <div class="paper-row-actions">
                    <span class="chip rank-chip" ${value != null ? `data-score="${value}"` : ""}>${metricLabels[metric] || "综合"} <strong>${value ?? "—"}</strong></span>
                    <a class="button-link secondary" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">详情</a>
                  </div>
                </div>
                ${scoreStrip(paper.ratings)}
              </article>
            `;
          })
          .join("")}
      </div>
      <div class="pager">
        <a class="button-link secondary" href="./rankings.html?metric=${metric}&page=${Math.max(1, currentPage - 1)}">上一页</a>
        <span class="muted">第 ${currentPage} / ${totalPages} 页</span>
        <a class="button-link secondary" href="./rankings.html?metric=${metric}&page=${Math.min(totalPages, currentPage + 1)}">下一页</a>
      </div>
    </section>
  `;
}

async function renderSearch(site) {
  const main = document.getElementById("page-main");
  main.innerHTML = `
    <section class="panel search-intro-panel">
      <div class="section-head">
        <div>
          <div class="eyebrow">检索</div>
          <h1 class="section-title">寻找能够支撑写作的文献观点</h1>
          <p class="muted">默认检索可复用的 citation points，也可以切换到论文目录。</p>
        </div>
      </div>
      <div class="search-mode-switch" role="tablist" aria-label="检索对象">
        <button type="button" class="chip chip-toggle active" data-search-mode="citations">引用点</button>
        <button type="button" class="chip chip-toggle" data-search-mode="papers">论文</button>
      </div>
    </section>

    <section id="citation-search-panel">
      <div class="panel citation-toolbar-panel">
        <div class="citation-toolbar">
          <input id="citation-query" class="search-input" type="search" value="${escHtml(qs("q") || "")}" placeholder="搜索机制、结果、方法、政策含义或想支持的论点" aria-label="搜索引用点" />
          <select id="citation-type" class="select" aria-label="引用点类型">
            <option value="">全部类型</option>
            ${Object.entries(LENS_LABELS).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
          <select id="citation-theme" class="select" aria-label="研究主题">
            <option value="">全部主题</option>
            ${(site.themes || []).map((theme) => `<option value="${escHtml(theme.theme_id)}">${escHtml(theme.name)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="citation-layout">
        <div>
          <div id="citation-summary" class="citation-summary muted"></div>
          <div id="citation-results" class="citation-results"></div>
          <div id="citation-pager" class="pager"></div>
        </div>
        <aside class="panel citation-basket" aria-label="引用篮">
          <div class="section-head compact">
            <div><div class="eyebrow">临时工作区</div><h2 class="citation-basket-title">引用篮</h2></div>
            <span id="citation-basket-count" class="chip">0</span>
          </div>
          <div id="citation-basket-items" class="citation-basket-items"></div>
          <div class="citation-basket-actions">
            <button type="button" id="citation-copy-bundle" class="button-link">复制为 AI 上下文</button>
            <button type="button" id="citation-clear-basket" class="button-link secondary">清空</button>
          </div>
          <div id="citation-copy-status" class="muted citation-copy-status" aria-live="polite"></div>
        </aside>
      </div>
    </section>

    <section id="paper-search-panel" class="panel" hidden>
      <div class="search-toolbar">
        <input id="paper-query" class="search-input" type="search" placeholder="按标题、作者、主题搜索" />
        <select id="field-filter" class="select"><option value="">全部领域</option>${[...new Set(site.papers.map((paper) => paper.field).filter(Boolean))].map((field) => `<option value="${field}">${formatField(field)}</option>`).join("")}</select>
        <select id="paradigm-filter" class="select"><option value="">全部范式</option>${[...new Set(site.papers.map((paper) => paper.paper_paradigm).filter(Boolean))].map((item) => `<option value="${item}">${formatParadigm(item)}</option>`).join("")}</select>
      </div>
      <div id="paper-search-results" class="list-mode"></div>
    </section>
  `;

  const basketKey = "senlab.citationBasket";
  const queryInput = document.getElementById("citation-query");
  const typeFilter = document.getElementById("citation-type");
  const themeFilter = document.getElementById("citation-theme");
  const resultsHost = document.getElementById("citation-results");
  const summaryHost = document.getElementById("citation-summary");
  const pagerHost = document.getElementById("citation-pager");
  let offset = 0;
  const limit = 10;
  let visibleItems = [];
  let staticCitationCache = null;
  let basket = [];
  try { basket = JSON.parse(localStorage.getItem(basketKey) || "[]"); } catch { basket = []; }

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const citationContext = (item) => `### ${item.paper_title || "文献"} (${item.year || "—"})\n- 引用点：${item.title || ""}\n- 可支持：${item.claim || ""}\n- 安全表述：${item.safer_formulation || ""}\n- 适用场景：${item.use_when || ""}\n- 使用边界：${item.boundary || item.overclaim_risk || ""}\n- 原文定位：${item.source_locator || ""}`;

  const saveBasket = () => localStorage.setItem(basketKey, JSON.stringify(basket));
  const renderBasket = () => {
    document.getElementById("citation-basket-count").textContent = String(basket.length);
    document.getElementById("citation-basket-items").innerHTML = basket.length
      ? basket.map((item) => `<div class="citation-basket-item"><strong>${escHtml(item.title)}</strong><span class="muted">${escHtml(item.paper_title || "")}</span><button type="button" class="citation-remove" data-remove-citation="${escHtml(item.lens_id || item.citation_id)}" aria-label="移除引用点">×</button></div>`).join("")
      : '<div class="empty compact-empty">从左侧加入观点，随后可一次复制给 AI。</div>';
  };

  const normalizeCitation = (item) => ({ ...item, lens_id: item.lens_id || item.citation_id, boundary: item.boundary || item.overclaim_risk || "" });

  const loadStaticCitations = async () => {
    if (!staticCitationCache) staticCitationCache = (await getJson(CITATION_DATA_URL)).citation_points.map(normalizeCitation);
    return staticCitationCache;
  };

  const fetchCitationResults = async () => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (queryInput.value.trim()) params.set("q", queryInput.value.trim());
    if (typeFilter.value) params.set("type", typeFilter.value);
    if (themeFilter.value) params.set("theme", themeFilter.value);
    try {
      const response = await getApiJson(`/api/citations?${params}`);
      return { items: response.items.map(normalizeCitation), total: response.total, source: "API" };
    } catch {
      const all = await loadStaticCitations();
      const q = queryInput.value.trim().toLowerCase();
      const filtered = all.filter((item) => {
        const text = [item.title, item.claim, item.interpretation, item.use_when, item.safer_formulation, item.overclaim_risk, item.paper_title, ...(item.keywords || []), ...(item.themes || []).map((theme) => theme.name)].join(" ").toLowerCase();
        return (!q || text.includes(q)) && (!typeFilter.value || item.lens_type === typeFilter.value) && (!themeFilter.value || item.theme_id === themeFilter.value);
      });
      return { items: filtered.slice(offset, offset + limit), total: filtered.length, source: "本地镜像" };
    }
  };

  const renderCitationResults = async () => {
    resultsHost.innerHTML = '<div class="empty">正在检索引用点…</div>';
    const response = await fetchCitationResults();
    visibleItems = response.items;
    summaryHost.textContent = `找到 ${response.total} 个引用点 · ${response.source}`;
    resultsHost.innerHTML = visibleItems.length
      ? visibleItems.map((item) => `
          <article class="panel citation-card">
            <div class="citation-card-head">
              <div><span class="chip citation-type-chip">${escHtml(formatLensType(item.lens_type || item.point_type))}</span><h2>${escHtml(item.title || item.claim)}</h2></div>
              <button type="button" class="button-link secondary" data-add-citation="${escHtml(item.lens_id)}">加入引用篮</button>
            </div>
            <div class="citation-paper-line"><a href="./paper.html?work=${encodeURIComponent(item.work_id)}">${escHtml(item.paper_title)}</a><span>${escHtml(item.authors || "")} · ${escHtml(item.year || "—")}</span></div>
            <div class="citation-primary"><div class="eyebrow">可直接使用</div><p>${escHtml(item.safer_formulation || item.claim || "—")}</p></div>
            ${item.claim ? `<div class="citation-field"><strong>可支持</strong><p>${escHtml(item.claim)}</p></div>` : ""}
            ${item.use_when ? `<div class="citation-field"><strong>适用场景</strong><p>${escHtml(item.use_when)}</p></div>` : ""}
            ${item.boundary ? `<div class="citation-field"><strong>使用边界</strong><p>${escHtml(item.boundary)}</p></div>` : ""}
            ${item.source_locator ? `<div class="citation-source">原文定位：${escHtml(item.source_locator)}</div>` : ""}
            <div class="citation-card-actions"><button type="button" class="text-button" data-copy-citation="${escHtml(item.lens_id)}">复制这一条</button><a class="text-button" href="./paper.html?work=${encodeURIComponent(item.work_id)}">查看论文档案</a></div>
          </article>`).join("")
      : '<div class="empty">没有找到符合条件的引用点。</div>';
    const page = Math.floor(offset / limit) + 1;
    const pages = Math.max(1, Math.ceil(response.total / limit));
    pagerHost.innerHTML = `<button type="button" class="button-link secondary" id="citation-prev" ${offset === 0 ? "disabled" : ""}>上一页</button><span class="muted">第 ${page} / ${pages} 页</span><button type="button" class="button-link secondary" id="citation-next" ${offset + limit >= response.total ? "disabled" : ""}>下一页</button>`;
    document.getElementById("citation-prev").onclick = () => { offset = Math.max(0, offset - limit); renderCitationResults(); };
    document.getElementById("citation-next").onclick = () => { offset += limit; renderCitationResults(); };
  };

  let searchTimer;
  const scheduleSearch = () => { window.clearTimeout(searchTimer); offset = 0; searchTimer = window.setTimeout(renderCitationResults, 220); };
  queryInput.addEventListener("input", scheduleSearch);
  typeFilter.addEventListener("change", scheduleSearch);
  themeFilter.addEventListener("change", scheduleSearch);
  resultsHost.addEventListener("click", async (event) => {
    const addButton = event.target.closest("[data-add-citation]");
    const copyButton = event.target.closest("[data-copy-citation]");
    if (addButton) {
      const item = visibleItems.find((entry) => entry.lens_id === addButton.dataset.addCitation);
      if (item && !basket.some((entry) => entry.lens_id === item.lens_id)) { basket.push(item); saveBasket(); renderBasket(); }
    }
    if (copyButton) {
      const item = visibleItems.find((entry) => entry.lens_id === copyButton.dataset.copyCitation);
      if (item) { await copyText(citationContext(item)); copyButton.textContent = "已复制"; }
    }
  });
  document.getElementById("citation-basket-items").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-citation]");
    if (!button) return;
    basket = basket.filter((item) => item.lens_id !== button.dataset.removeCitation); saveBasket(); renderBasket();
  });
  document.getElementById("citation-copy-bundle").onclick = async () => {
    const status = document.getElementById("citation-copy-status");
    if (!basket.length) { status.textContent = "引用篮还是空的。"; return; }
    await copyText(`# SenLab 引用上下文\n\n${basket.map(citationContext).join("\n\n")}`);
    status.textContent = `已复制 ${basket.length} 个引用点。`;
  };
  document.getElementById("citation-clear-basket").onclick = () => { basket = []; saveBasket(); renderBasket(); };

  const renderPaperResults = () => {
    const q = document.getElementById("paper-query").value.trim().toLowerCase();
    const field = document.getElementById("field-filter").value;
    const paradigm = document.getElementById("paradigm-filter").value;
    const filtered = site.papers.filter((paper) => [paper.title, paper.authors, paper.one_line_judgment, ...paper.themes.map((theme) => theme.name), ...(paper.topics || []).map((topic) => topic.name)].join(" ").toLowerCase().includes(q) && (!field || paper.field === field) && (!paradigm || paper.paper_paradigm === paradigm));
    document.getElementById("paper-search-results").innerHTML = filtered.length ? filtered.map((paper) => `<article class="paper-row"><div class="paper-row-head"><div><div class="paper-meta">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div><h3 class="paper-row-title"><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${escHtml(paper.title)}</a></h3><div class="muted">${escHtml(paper.authors || "")}</div><p class="row-judgment">${escHtml(paper.one_line_judgment || "")}</p></div><div class="paper-row-actions"><a class="button-link" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">查看详情</a></div></div></article>`).join("") : '<div class="empty">没有符合条件的论文。</div>';
  };
  ["paper-query", "field-filter", "paradigm-filter"].forEach((id) => document.getElementById(id).addEventListener(id === "paper-query" ? "input" : "change", renderPaperResults));
  document.querySelectorAll("[data-search-mode]").forEach((button) => button.addEventListener("click", () => {
    const citations = button.dataset.searchMode === "citations";
    document.getElementById("citation-search-panel").hidden = !citations;
    document.getElementById("paper-search-panel").hidden = citations;
    document.querySelectorAll("[data-search-mode]").forEach((item) => item.classList.toggle("active", item === button));
  }));

  renderBasket();
  renderPaperResults();
  await renderCitationResults();
}

async function renderCompare(site) {
  const main = document.getElementById("page-main");
  const left = qs("left") || site.papers[0]?.work_id || "";
  const right = qs("right") || site.papers[1]?.work_id || site.papers[0]?.work_id || "";

  main.innerHTML = `
    <section class="panel">
      <div class="section-head">
        <div>
          <div class="eyebrow">对比</div>
          <h1 class="section-title">文献对比</h1>
        </div>
      </div>
      <div class="search-toolbar">
        <select id="left-paper" class="compare-select">
          ${site.papers.map((paper) => `<option value="${paper.work_id}" ${paper.work_id === left ? "selected" : ""}>${paper.title}</option>`).join("")}
        </select>
        <select id="right-paper" class="compare-select">
          ${site.papers.map((paper) => `<option value="${paper.work_id}" ${paper.work_id === right ? "selected" : ""}>${paper.title}</option>`).join("")}
        </select>
        <button id="compare-go" class="button-link">对比</button>
      </div>
      <div id="compare-host"></div>
    </section>
  `;

  const buildTable = async () => {
    const leftPaper = await getPaperData(document.getElementById("left-paper").value);
    const rightPaper = await getPaperData(document.getElementById("right-paper").value);

    document.getElementById("compare-host").innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th>维度</th>
            <th>${escHtml(leftPaper.title)}</th>
            <th>${escHtml(rightPaper.title)}</th>
          </tr>
        </thead>
        <tbody>
          ${[
            ["作者", leftPaper.authors, rightPaper.authors],
            ["期刊", leftPaper.journal_or_series, rightPaper.journal_or_series],
            ["DOI", leftPaper.doi, rightPaper.doi],
            ["领域", formatField(leftPaper.field), formatField(rightPaper.field)],
            ["范式", formatParadigm(leftPaper.paper_paradigm), formatParadigm(rightPaper.paper_paradigm)],
            ["研究问题", leftPaper.research_question, rightPaper.research_question],
            ["研究路径", leftPaper.approach, rightPaper.approach],
            ["核心判断", leftPaper.main_claim, rightPaper.main_claim],
            ["一句判断", leftPaper.one_line_judgment, rightPaper.one_line_judgment],
            ["道", leftPaper.ratings.dao, rightPaper.ratings.dao],
            ["法", leftPaper.ratings.fa, rightPaper.ratings.fa],
            ["势", leftPaper.ratings.shi, rightPaper.ratings.shi],
            ["术", leftPaper.ratings.shu, rightPaper.ratings.shu],
            ["器", leftPaper.ratings.qi, rightPaper.ratings.qi],
            ["主观", leftPaper.ratings.subjective, rightPaper.ratings.subjective],
          ]
            .map(
              ([label, a, b]) => `
                <tr>
                  <th>${escHtml(label)}</th>
                  <td>${escHtml(a) || "—"}</td>
                  <td>${escHtml(b) || "—"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  const runBuildTable = () => {
    buildTable().catch((err) => {
      document.getElementById("compare-host").innerHTML = `<div class="empty">加载失败：${escHtml(err.message)}</div>`;
    });
  };
  document.getElementById("compare-go").addEventListener("click", runBuildTable);
  runBuildTable();
}

async function renderAbout(site) {
  const main = document.getElementById("page-main");
  main.innerHTML = `
    <section class="grid-2">
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">关于系统</div>
            <h1 class="section-title">Sencium Lab 是什么</h1>
          </div>
        </div>
        <p class="intro-text">Sencium Lab 是一套私人学术文献系统，将精读转化为结构化的论文案卡、证据摘录与引用视角，并以六维十分制对每篇论文做出持续可用的研究判断。本地存储，公开可检索。</p>
        <div class="stack-list">
          <div class="stack-item"><strong>索引层</strong><div class="muted">展示题目、作者、期刊、评分与主题，是对外公开的论文目录。</div></div>
          <div class="stack-item"><strong>分析层</strong><div class="muted">展示结构化案卡、论旨展开、证据摘录与引用视角，是主要的分析界面。</div></div>
          <div class="stack-item"><strong>本地层</strong><div class="muted">存储原始 PDF、数据库与工作草稿，不对外公开。</div></div>
        </div>
      </div>
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">评议方法</div>
          <h2 class="section-title">六维十分制</h2>
          </div>
        </div>
        <div class="stack-list">
          ${site.score_dimensions
            .map(
              (item) => `
                <div class="stack-item">
                  <strong>${item.label}</strong>
                  <div class="muted">${item.desc}</div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

async function renderPaper(site) {
  const workId = qs("work") || site.papers[0]?.work_id;
  const main = document.getElementById("page-main");
  if (!workId) {
    main.innerHTML = '<div class="empty">没有可展示的论文。</div>';
    return;
  }

  const paper = await getPaperData(workId);
  document.title = `Sencium Lab · ${paper.title}`;
  const titleLength = (paper.title || "").trim().length;
  const titleClass =
    titleLength >= 90
      ? "paper-title paper-title-xlong"
      : titleLength >= 48
        ? "paper-title paper-title-long"
        : "paper-title";
  const sections = paper.sections || {};
  const detailFields = [
    ["领域", formatField(paper.field)],
    ["子领域", formatSubfield(paper.subfield)],
    ["范式", formatParadigm(paper.paper_paradigm)],
    ["期刊", paper.journal_or_series],
    ["DOI", paper.doi],
    ["研究问题", paper.research_question],
    ["问题分量", paper.why_it_matters],
    ["研究对象", paper.core_object],
    ["方法 / 路径", paper.approach],
    ["核心判断", paper.main_claim],
    ["收录理由", paper.why_in_my_db],
  ];
  const lensTypeCounts = Object.entries(
    paper.lenses.reduce((counts, lens) => {
      const type = lens.lens_type || lens.point_type || "other";
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {})
  );
  const lensMarkup = paper.lenses.length
    ? paper.lenses
        .map((lens, index) => {
          const linkedTheme = paper.themes.find((theme) => theme.theme_id === lens.theme_id);
          const evidenceItems = (lens.evidence_excerpt_ids || [])
            .map((excerptId) => {
              const excerpt = paper.excerpts.find((item) => item.excerpt_id === excerptId);
              const label = excerpt
                ? `${formatTopic(excerpt.topic)} · ${formatLocation(excerpt.location)}`
                : excerptId;
              return `<span class="chip">${escHtml(label)}</span>`;
            })
            .join("");
          const title = lens.title || formatThemeName(linkedTheme || lens);
          return `
            <details class="research-item" data-detail-group="lenses" ${index === 0 ? "open" : ""}>
              <summary>
                <span class="research-type">${escHtml(formatLensType(lens.lens_type || lens.point_type))}</span>
                <strong>${escHtml(title)}</strong>
              </summary>
              <div class="research-item-body">
                <div class="research-primary"><span>可直接使用</span><p>${escHtml(lens.safer_formulation || lens.claim || "—")}</p></div>
                <dl class="research-fields">
                  <dt>支持论点</dt><dd>${escHtml(lens.claim || "—")}</dd>
                  <dt>适用场景</dt><dd>${escHtml(lens.use_when || lens.interpretation || "—")}</dd>
                  <dt>使用边界</dt><dd>${escHtml(lens.boundary || lens.overclaim_risk || "—")}</dd>
                  ${lens.source_locator ? `<dt>原文定位</dt><dd>${escHtml(lens.source_locator)}</dd>` : ""}
                </dl>
                ${evidenceItems ? `<div class="chip-row research-evidence-links">${evidenceItems}</div>` : ""}
              </div>
            </details>`;
        })
        .join("")
    : '<div class="empty compact-empty">该论文的引用视角尚未补完。</div>';
  const excerptMarkup = paper.excerpts.length
    ? paper.excerpts
        .map(
          (excerpt, index) => `
            <details class="research-item evidence-item" data-detail-group="excerpts" ${index === 0 ? "open" : ""}>
              <summary>
                <span class="research-type">证据</span>
                <strong>${escHtml(formatTopic(excerpt.topic))} · ${escHtml(formatLocation(excerpt.location))}</strong>
              </summary>
              <div class="research-item-body">
                <div class="research-primary evidence-primary"><span>证据内容</span><p>${escHtml(excerpt.quote_or_paraphrase || "—")}</p></div>
                <dl class="research-fields">
                  <dt>为何重要</dt><dd>${escHtml(excerpt.why_this_matters || "—")}</dd>
                  <dt>摘录编号</dt><dd class="research-id">${escHtml(excerpt.excerpt_id || "—")}</dd>
                </dl>
              </div>
            </details>`
        )
        .join("")
    : '<div class="empty compact-empty">该论文的证据摘录尚未补完。</div>';

  main.innerHTML = `
    <section class="paper-hero">
      <article class="panel paper-head">
        <div class="eyebrow">论文档案</div>
        <h1 class="${titleClass}">${escHtml(paper.title)}</h1>
        <div class="paper-byline">${escHtml(paper.authors || "")}</div>
        <div class="paper-meta-line">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
        <div class="paper-meta-line">${paper.journal_or_series || "期刊待补充"}${paper.doi ? ` · DOI: ${paper.doi}` : ""}</div>
        <div class="chip-row">
          ${paper.themes.map((theme) => `<span class="chip">${escHtml(formatThemeName(theme))}</span>`).join("")}
        </div>
        ${paper.topics?.length ? `<div class="chip-row topic-chip-row">${paper.topics.map(topicChip).join("")}</div>` : ""}
      </article>
      <article class="panel score-panel">
        <div class="section-head compact">
          <div>
            <div class="eyebrow">评分图谱</div>
            <h2 class="section-title">六维十分制</h2>
          </div>
        </div>
        <div class="radar-wrap">${radarSvg(paper.ratings)}</div>
        ${scoreStrip(paper.ratings)}
      </article>
    </section>

    <section class="paper-layout">
      <div class="detail-stack">
        <article class="detail-card panel">
          <div class="section-head compact">
            <div>
              <div class="eyebrow">案卡</div>
              <h2 class="section-title">论文案卡</h2>
            </div>
          </div>
          <dl>
            ${detailFields.map(([label, value]) => `<dt>${escHtml(label)}</dt><dd>${escHtml(value) || "—"}</dd>`).join("")}
          </dl>
        </article>

        <article class="detail-card panel">
          <div class="section-head compact">
            <div>
              <div class="eyebrow">脉络</div>
              <h2 class="section-title">论旨展开</h2>
            </div>
          </div>
          ${Object.keys(sections)
            .filter((key) => SECTION_LABELS[key] && sections[key])
            .map(
              (key) => `
                <section class="section-block">
                  <h4>${SECTION_LABELS[key] || key}</h4>
                  <p>${escHtml(sections[key])}</p>
                </section>
              `
            )
            .join("")}
        </article>
      </div>

      <aside class="detail-stack paper-aside">
        <article class="detail-card panel research-panel">
          <div class="section-head compact research-panel-head">
            <div>
              <div class="eyebrow">视角</div>
              <h2 class="section-title">引用点 <span class="section-count">${paper.lenses.length}</span></h2>
            </div>
            <button type="button" class="text-button" data-toggle-details="lenses" aria-expanded="false">展开全部</button>
          </div>
          <div class="research-summary-row">
            ${lensTypeCounts.map(([type, count]) => `<span>${escHtml(formatLensType(type))} ${count}</span>`).join("")}
          </div>
          <div class="research-list">${lensMarkup}</div>
        </article>

        <article class="detail-card panel research-panel">
          <div class="section-head compact research-panel-head">
            <div>
              <div class="eyebrow">摘录</div>
              <h2 class="section-title">证据摘录 <span class="section-count">${paper.excerpts.length}</span></h2>
            </div>
            <button type="button" class="text-button" data-toggle-details="excerpts" aria-expanded="false">展开全部</button>
          </div>
          <div class="research-list evidence-list">${excerptMarkup}</div>
        </article>

        <article class="detail-card panel">
          <div class="section-head compact">
            <div>
              <div class="eyebrow">注记</div>
              <h2 class="section-title">评分眉批</h2>
            </div>
          </div>
          <div class="legend-list">
            ${Object.entries({
              道: paper.rating_notes?.dao,
              法: paper.rating_notes?.fa,
              势: paper.rating_notes?.shi,
              术: paper.rating_notes?.shu,
              器: paper.rating_notes?.qi,
              主观: paper.rating_notes?.subjective,
            })
              .map(
                ([label, value]) => `
                  <div class="legend-item">
                    <strong>${label}</strong>
                    <div class="muted">${value || "—"}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      </aside>
    </section>
  `;
  bindDisclosureGroup(main, "lenses");
  bindDisclosureGroup(main, "excerpts");
  main.querySelectorAll("details.research-item").forEach((item) => {
    item.addEventListener("toggle", () => { if (item.open) renderMath(item); });
  });
  renderMath(main);
}

async function bootstrap() {
  const page = document.body.dataset.page;
  const site = await getJson(SITE_INDEX_URL);
  const shell = buildShell(site, page);
  document.getElementById("site-shell").replaceWith(shell);

  if (page === "dashboard") return renderDashboardV2(site);
  if (page === "rankings") return renderRankings(site);
  if (page === "search") return renderSearch(site);
  if (page === "compare") return renderCompare(site);
  if (page === "paper") return renderPaper(site);
  if (page === "about") return renderAbout(site);
}

bootstrap().catch((error) => {
  const host = document.getElementById("site-shell");
  if (host) {
    host.innerHTML = `<div class="main"><div class="empty">页面加载失败：${error.message}</div></div>`;
  }
});
