const SITE_INDEX_URL = "./web/data/site-index.json";
const PAPER_DATA_BASE = "./web/data/papers/";

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
  mechanism: "机制",
  method: "方法",
  data: "数据",
  theory: "理论",
  policy: "政策",
  counterfactual: "反事实",
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

function formatLunarNow() {
  try {
    return new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  } catch {
    return "农历信息暂不可用";
  }
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
      </div>
      <div class="knowledge-layout">
        <div class="knowledge-stage-wrap">
          <div class="knowledge-caption">节点大小表示覆盖文献数或综合分，连线表示共享主题关系。点击节点可查看详细脉络。</div>
          <div id="knowledge-stage" class="knowledge-stage"></div>
          <div id="knowledge-legend" class="knowledge-legend"></div>
        </div>
        <aside id="knowledge-detail" class="knowledge-detail"></aside>
      </div>
    </section>
  `;
}

function activateKnowledgeMap(site) {
  const graph = site.knowledge_graph;
  if (!graph || !graph.theme_nodes?.length) return;

  const stage = document.getElementById("knowledge-stage");
  const detail = document.getElementById("knowledge-detail");
  const legend = document.getElementById("knowledge-legend");
  const toggles = Array.from(document.querySelectorAll("[data-map-mode]"));
  const themeMap = new Map((graph.theme_nodes || []).map((item) => [item.id, item]));
  const paperMap = new Map(site.papers.map((item) => [item.work_id, item]));
  const paperNodeMap = new Map((graph.paper_nodes || []).map((item) => [item.id, item]));
  const colorMap = buildThemeColorMap(graph);
  const themeEdgeMax = Math.max(1, ...(graph.theme_edges || []).map((item) => item.weight || 1));
  const paperEdgeMax = Math.max(1, ...(graph.paper_edges || []).map((item) => item.weight || 1));

  let mode = "themes";
  let selectedThemeId = graph.theme_nodes[0]?.id || "";
  let selectedPaperId = graph.paper_nodes[0]?.id || "";

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
    legend.innerHTML = (graph.theme_nodes || [])
      .map(
        (theme) => `
          <span class="legend-chip">
            <span class="legend-dot" style="background:${colorMap[theme.id] || "#a0532a"}"></span>
            ${escHtml(theme.name)}
          </span>
        `
      )
      .join("");
  }

  function themeSvg(selectedId) {
    const nodes = [...graph.theme_nodes];
    const width = 760;
    const height = 460;
    const cx = width / 2;
    const cy = height / 2;
    const rx = 250;
    const ry = 150;
    const sorted = nodes.sort((left, right) => right.paper_count - left.paper_count || left.name.localeCompare(right.name));
    const positions = new Map();
    sorted.forEach((node, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / Math.max(sorted.length, 1);
      positions.set(node.id, {
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
      });
    });

    const edges = (graph.theme_edges || [])
      .map((edge) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return "";
        const isActive = edge.source === selectedId || edge.target === selectedId;
        return `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="rgba(104,120,133,${isActive ? 0.42 : 0.16})" stroke-width="${1 + (edge.weight / themeEdgeMax) * 4}" />`;
      })
      .join("");

    const nodeMarkup = sorted
      .map((node) => {
        const pos = positions.get(node.id);
        const radius = 14 + node.paper_count * 5;
        const isActive = node.id === selectedId;
        return `
          <g class="knowledge-node-group ${isActive ? "active" : ""}" data-theme-id="${node.id}" tabindex="0">
            <circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${colorMap[node.id] || "#a0532a"}" fill-opacity="${isActive ? 0.96 : 0.82}" stroke="${isActive ? "#16202a" : "rgba(22,32,42,0.16)"}" stroke-width="${isActive ? 2.4 : 1.2}" />
            <text x="${pos.x}" y="${pos.y + radius + 18}" text-anchor="middle" class="knowledge-label">${escHtml(node.name)}</text>
            <text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" class="knowledge-count">${node.paper_count}</text>
          </g>
        `;
      })
      .join("");

    return `<svg class="knowledge-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="主题网络图">${edges}${nodeMarkup}</svg>`;
  }

  function paperSvg(selectedId) {
    const width = 760;
    const height = 460;
    const cx = width / 2;
    const cy = height / 2;
    const themeOrder = (graph.theme_nodes || []).map((item) => item.id);
    const grouped = themeOrder.flatMap((themeId) =>
      (graph.paper_nodes || [])
        .filter((paper) => paper.primary_theme_id === themeId)
        .sort((left, right) => (right.overall || 0) - (left.overall || 0) || (right.year || 0) - (left.year || 0))
    );
    const leftovers = (graph.paper_nodes || [])
      .filter((paper) => !grouped.find((item) => item.id === paper.id))
      .sort((left, right) => (right.overall || 0) - (left.overall || 0));
    const nodes = [...grouped, ...leftovers];
    const positions = new Map();

    let cursor = -Math.PI / 2;
    themeOrder.forEach((themeId) => {
      const cluster = nodes.filter((paper) => paper.primary_theme_id === themeId);
      if (!cluster.length) return;
      const span = (Math.PI * 2 * cluster.length) / Math.max(nodes.length, 1);
      cluster.forEach((paper, index) => {
        const angle = cursor + (span * (index + 0.5)) / cluster.length;
        const radial = 168 + ((paper.overall || 0) / 60) * 24;
        positions.set(paper.id, {
          x: cx + Math.cos(angle) * radial,
          y: cy + Math.sin(angle) * (radial * 0.78),
        });
      });
      cursor += span;
    });
    leftovers.forEach((paper, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / Math.max(leftovers.length, 1);
      positions.set(paper.id, {
        x: cx + Math.cos(angle) * 140,
        y: cy + Math.sin(angle) * 108,
      });
    });

    const edges = (graph.paper_edges || [])
      .map((edge) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return "";
        const isActive = edge.source === selectedId || edge.target === selectedId;
        return `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="rgba(104,120,133,${isActive ? 0.38 : 0.1})" stroke-width="${0.8 + (edge.weight / paperEdgeMax) * 2.8}" />`;
      })
      .join("");

    const nodeMarkup = nodes
      .map((paper) => {
        const pos = positions.get(paper.id);
        const isActive = paper.id === selectedId;
        const color = colorMap[paper.primary_theme_id] || "#a0532a";
        const radius = 8 + Math.max(0, (paper.overall || 0) - 40) * 0.35;
        return `
          <g class="knowledge-node-group ${isActive ? "active" : ""}" data-paper-id="${paper.id}" tabindex="0">
            <circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${color}" fill-opacity="${isActive ? 0.96 : 0.8}" stroke="${isActive ? "#16202a" : "rgba(22,32,42,0.12)"}" stroke-width="${isActive ? 2.2 : 1}" />
            <text x="${pos.x}" y="${pos.y + radius + 14}" text-anchor="middle" class="knowledge-paper-label">${escHtml((paper.title || "").split(":")[0])}</text>
          </g>
        `;
      })
      .join("");

    return `<svg class="knowledge-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="文献关系图">${edges}${nodeMarkup}</svg>`;
  }

  function themeDetail(themeId) {
    const theme = themeMap.get(themeId);
    if (!theme) return "";
    const linkedPapers = papersForTheme(themeId);
    const neighbors = relatedThemes(themeId);
    return `
      <div class="knowledge-card">
        <div class="eyebrow">当前主题</div>
        <h3>${escHtml(theme.name)}</h3>
        <p class="muted">覆盖 ${theme.paper_count} 篇论文，是当前文献库中的一个中层聚合主题。</p>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">高频 Topics</div>
        <div class="chip-row">
          ${(theme.top_topics || []).map(topicChip).join("") || '<span class="muted">暂无</span>'}
        </div>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">相关主题</div>
        <div class="stack-list compact">
          ${neighbors
            .slice(0, 6)
            .map(
              ({ edge, theme: item }) => `
                <button type="button" class="stack-item action" data-theme-jump="${item.id}">
                  <strong>${escHtml(item.name)}</strong>
                  <div class="muted">与当前主题共享 ${edge.weight} 篇论文</div>
                </button>
              `
            )
            .join("") || '<div class="stack-item"><div class="muted">当前没有共现主题。</div></div>'}
        </div>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">关联文献</div>
        <div class="stack-list compact">
          ${linkedPapers
            .map(
              (paper) => `
                <button type="button" class="stack-item action" data-paper-jump="${paper.work_id}">
                  <strong>${escHtml(paper.title)}</strong>
                  <div class="muted">${escHtml(String(paper.year || ""))} · 综合分 ${paper.ratings.overall ?? "—"}</div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function paperDetail(paperId) {
    const paper = paperMap.get(paperId);
    const paperNode = paperNodeMap.get(paperId);
    if (!paper || !paperNode) return "";
    const neighbors = relatedPapers(paperId);
    return `
      <div class="knowledge-card">
        <div class="eyebrow">当前文献</div>
        <h3><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${escHtml(paper.title)}</a></h3>
        <p class="muted">${escHtml(paper.authors || "")}</p>
        <p class="muted">${escHtml(String(paper.year || ""))} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</p>
        <p class="muted">综合分 ${paper.ratings.overall ?? "—"} / 60</p>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">主题</div>
        <div class="chip-row">
          ${paper.themes.map((theme) => `<button type="button" class="chip chip-topic chip-action" data-theme-jump="${theme.theme_id}">${escHtml(formatThemeName(theme))}</button>`).join("")}
        </div>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">Topics</div>
        <div class="chip-row">
          ${(paper.topics || []).map(topicChip).join("") || '<span class="muted">暂无</span>'}
        </div>
      </div>
      <div class="knowledge-card">
        <div class="eyebrow">相关文献</div>
        <div class="stack-list compact">
          ${neighbors
            .slice(0, 8)
            .map(
              ({ edge, paper: item }) => `
                <button type="button" class="stack-item action" data-paper-jump="${item.work_id}">
                  <strong>${escHtml(item.title)}</strong>
                  <div class="muted">共享 ${edge.shared_theme_ids.length} 个主题 · 综合分 ${item.ratings.overall ?? "—"}</div>
                </button>
              `
            )
            .join("") || '<div class="stack-item"><div class="muted">当前没有共享主题的近邻文献。</div></div>'}
        </div>
      </div>
    `;
  }

  function bindDetailActions() {
    detail.querySelectorAll("[data-theme-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = "themes";
        selectedThemeId = button.getAttribute("data-theme-jump") || selectedThemeId;
        render();
      });
    });
    detail.querySelectorAll("[data-paper-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        mode = "papers";
        selectedPaperId = button.getAttribute("data-paper-jump") || selectedPaperId;
        render();
      });
    });
  }

  function bindStageActions() {
    stage.querySelectorAll("[data-theme-id]").forEach((node) => {
      const jump = () => {
        selectedThemeId = node.getAttribute("data-theme-id") || selectedThemeId;
        render();
      };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          jump();
        }
      });
    });
    stage.querySelectorAll("[data-paper-id]").forEach((node) => {
      const jump = () => {
        selectedPaperId = node.getAttribute("data-paper-id") || selectedPaperId;
        render();
      };
      node.addEventListener("click", jump);
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          jump();
        }
      });
    });
  }

  function render() {
    toggles.forEach((button) => button.classList.toggle("active", button.getAttribute("data-map-mode") === mode));
    if (mode === "themes") {
      stage.innerHTML = themeSvg(selectedThemeId);
      detail.innerHTML = themeDetail(selectedThemeId);
    } else {
      stage.innerHTML = paperSvg(selectedPaperId);
      detail.innerHTML = paperDetail(selectedPaperId);
    }
    bindStageActions();
    bindDetailActions();
  }

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.getAttribute("data-map-mode") || "themes";
      render();
    });
  });

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
  return `
    <div id="time-widget">
      <div class="eyebrow">此刻</div>
      <h2 class="section-title" id="clock-now">${formatClockNow()}</h2>
      <p class="intro-text" id="solar-now">${formatSolarNow()}</p>
      <p class="intro-text" id="lunar-now">${formatLunarNow()}</p>
    </div>
  `;
}

function activateClock() {
  const clock = document.getElementById("clock-now");
  const solar = document.getElementById("solar-now");
  const lunar = document.getElementById("lunar-now");
  if (!clock || !solar || !lunar) return;
  const updateTime = () => {
    clock.textContent = formatClockNow();
    solar.textContent = formatSolarNow();
    lunar.textContent = formatLunarNow();
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

    ${renderKnowledgeMapSection(site)}

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
    <section class="panel">
      <div class="section-head">
        <div>
          <div class="eyebrow">检索</div>
          <h1 class="section-title">论文搜索</h1>
        </div>
      </div>
      <div class="search-toolbar">
        <input id="query" class="search-input" type="search" placeholder="按标题、作者、主题搜索" />
        <select id="field-filter" class="select">
          <option value="">全部领域</option>
          ${[...new Set(site.papers.map((paper) => paper.field).filter(Boolean))].map((field) => `<option value="${field}">${formatField(field)}</option>`).join("")}
        </select>
        <select id="paradigm-filter" class="select">
          <option value="">全部范式</option>
          ${[...new Set(site.papers.map((paper) => paper.paper_paradigm).filter(Boolean))].map((item) => `<option value="${item}">${formatParadigm(item)}</option>`).join("")}
        </select>
      </div>
      <div id="search-results" class="list-mode"></div>
      <div id="search-pager" class="pager"></div>
    </section>
  `;

  const queryInput = document.getElementById("query");
  const fieldFilter = document.getElementById("field-filter");
  const paradigmFilter = document.getElementById("paradigm-filter");
  const host = document.getElementById("search-results");
  const pager = document.getElementById("search-pager");
  let currentPage = 1;
  const pageSize = 10;

  const renderResults = () => {
    const q = queryInput.value.trim().toLowerCase();
    const field = fieldFilter.value;
    const paradigm = paradigmFilter.value;
    const filtered = site.papers.filter((paper) => {
      const haystack = [
        paper.title,
        paper.authors,
        paper.field,
        paper.subfield,
        paper.paper_paradigm,
        paper.one_line_judgment,
        ...paper.themes.map((theme) => theme.name),
        ...(paper.topics || []).map((topic) => topic.name),
      ]
        .join(" ")
        .toLowerCase();
      return (!q || haystack.includes(q)) && (!field || paper.field === field) && (!paradigm || paper.paper_paradigm === paradigm);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    host.innerHTML = filtered.length
      ? visible
          .map(
            (paper) => `
              <article class="paper-row">
                <div class="paper-row-head">
                  <div>
                    <div class="paper-meta">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
                    <h3 class="paper-row-title"><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${paper.title}</a></h3>
                    <div class="muted">${paper.authors || ""}</div>
                    <div class="muted">${paper.journal_or_series || "期刊待补充"}</div>
                  </div>
                  <div class="paper-row-actions">
                    <a class="button-link" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">查看详情</a>
                    <a class="button-link secondary" href="./compare.html?left=${encodeURIComponent(paper.work_id)}">加入对比</a>
                  </div>
                </div>
              </article>
            `
          )
          .join("")
      : '<div class="empty">没有符合条件的论文。</div>';

    pager.innerHTML = filtered.length
      ? `
          <a class="button-link secondary" href="#" id="search-prev">上一页</a>
          <span class="muted">第 ${currentPage} / ${totalPages} 页</span>
          <a class="button-link secondary" href="#" id="search-next">下一页</a>
        `
      : "";

    const prev = document.getElementById("search-prev");
    const next = document.getElementById("search-next");
    if (prev) prev.onclick = (event) => { event.preventDefault(); currentPage = Math.max(1, currentPage - 1); renderResults(); };
    if (next) next.onclick = (event) => { event.preventDefault(); currentPage = Math.min(totalPages, currentPage + 1); renderResults(); };
  };

  queryInput.addEventListener("input", () => { currentPage = 1; renderResults(); });
  fieldFilter.addEventListener("change", () => { currentPage = 1; renderResults(); });
  paradigmFilter.addEventListener("change", () => { currentPage = 1; renderResults(); });
  renderResults();
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
    const leftPaper = await getJson(`${PAPER_DATA_BASE}${encodeURIComponent(document.getElementById("left-paper").value)}.json`);
    const rightPaper = await getJson(`${PAPER_DATA_BASE}${encodeURIComponent(document.getElementById("right-paper").value)}.json`);

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

  const paper = await getJson(`${PAPER_DATA_BASE}${encodeURIComponent(workId)}.json`);
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

  main.innerHTML = `
    <section class="paper-hero">
      <article class="panel paper-head">
        <div class="eyebrow">论文档案</div>
        <h1 class="${titleClass}">${paper.title}</h1>
        <div class="paper-byline">${paper.authors || ""}</div>
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
                  <p>${sections[key]}</p>
                </section>
              `
            )
            .join("")}
        </article>
      </div>

      <div class="detail-stack">
        <article class="detail-card panel">
          <div class="section-head compact">
            <div>
              <div class="eyebrow">视角</div>
              <h2 class="section-title">引用视角</h2>
            </div>
          </div>
          <div class="stack-list">
            ${paper.lenses.length
              ? paper.lenses
                  .map((lens) => {
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
                return `
                  <div class="stack-item">
                    <strong>${formatLensType(lens.lens_type)} · ${escHtml(formatThemeName(linkedTheme || lens))}</strong>
                    <div class="muted"><strong>支持论点：</strong>${escHtml(lens.claim || "—")}</div>
                    <div class="muted"><strong>为何使用：</strong>${escHtml(lens.interpretation || "—")}</div>
                    <div class="muted"><strong>过度延伸风险：</strong>${escHtml(lens.overclaim_risk || "—")}</div>
                    <div class="muted"><strong>更稳妥的说法：</strong>${escHtml(lens.safer_formulation || "—")}</div>
                    ${evidenceItems ? `<div class="chip-row">${evidenceItems}</div>` : ""}
                  </div>
                `;
                  })
                  .join("")
              : '<div class="empty">该论文的引用视角尚未补完。</div>'}
          </div>
        </article>

        <article class="detail-card panel">
          <div class="section-head compact">
            <div>
              <div class="eyebrow">摘录</div>
              <h2 class="section-title">证据摘录</h2>
            </div>
          </div>
          <div class="stack-list">
            ${paper.excerpts.length
              ? paper.excerpts
                  .map(
                (excerpt) => `
                  <div class="stack-item">
                    <strong>${formatTopic(excerpt.topic)} · ${formatLocation(excerpt.location)}</strong>
                    <div class="muted"><strong>证据内容：</strong>${escHtml(excerpt.quote_or_paraphrase || "—")}</div>
                    <div class="muted"><strong>为何重要：</strong>${escHtml(excerpt.why_this_matters || "—")}</div>
                    <div class="muted"><strong>摘录编号：</strong>${escHtml(excerpt.excerpt_id || "—")}</div>
                  </div>
                `
              )
                  .join("")
              : '<div class="empty">该论文的证据摘录尚未补完。</div>'}
          </div>
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
      </div>
    </section>
  `;
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
