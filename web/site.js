const SITE_INDEX_URL = "./web/data/site-index.json";
const PAPER_DATA_BASE = "./web/data/papers/";

const FIELD_LABELS = {
  "health-economics": "健康经济学",
  "applied-micro": "应用微观",
  "microeconomic-theory": "微观理论",
  "information-design": "信息设计",
};

const PARADIGM_LABELS = {
  empirical_structural: "实证 / 结构",
  empirical_reduced_form: "实证 / 简约式",
  theory: "理论",
  econometrics: "计量",
  review: "综述",
  mixed: "混合",
};

const DAILY_QUOTES = [
  { text: "The important thing is not to stop questioning.", zh: "重要的是不要停止发问。", author: "Albert Einstein" },
  { text: "Read not to contradict and confute, but to weigh and consider.", zh: "读书不是为了反驳，而是为了权衡与思考。", author: "Francis Bacon" },
  { text: "Research is formalized curiosity.", zh: "研究是被形式化了的好奇心。", author: "Zora Neale Hurston" },
  { text: "Everything should be made as simple as possible, but not simpler.", zh: "一切都应尽量简单，但不能过度简化。", author: "Albert Einstein" },
  { text: "Ideas come from previous ideas.", zh: "思想常常来自更早的思想。", author: "Mark Koyama" },
  { text: "What we know is a drop, what we do not know is an ocean.", zh: "我们所知如水滴，未知如海洋。", author: "Isaac Newton" },
];

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatField(value) {
  return FIELD_LABELS[value] || value || "未分类";
}

function formatParadigm(value) {
  return PARADIGM_LABELS[value] || value || "未判定";
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
    return "农历信息不可用";
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

function buildShell(site, activePage) {
  const shell = el("div", "site");
  const navLinks = site.nav
    .map(
      (item) =>
        `<a class="nav-link ${item.href.endsWith(`${activePage}.html`) || (activePage === "dashboard" && item.href === "./index.html") ? "active" : ""}" href="${item.href}">${item.label}</a>`
    )
    .join("");
  shell.innerHTML = `
    <header class="topbar">
      <div class="topbar-inner">
        <a href="./index.html" class="brand-lockup">
          <img class="brand-logo intro" src="${site.brand.logo_intro_url}" alt="Sencium Lab" />
        </a>
        <nav class="nav">${navLinks}</nav>
      </div>
    </header>
    <main class="main" id="page-main"></main>
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-copy">
          <strong>Sencium Lab</strong><br />
          Curated from a local-first SenLab database. 公众号：${site.brand.wechat_name}
        </div>
        <div class="footer-links">
          <a href="${site.brand.github_url}" target="_blank" rel="noreferrer">GitHub Project</a>
          <a href="mailto:${site.brand.contact_email}">${site.brand.contact_email}</a>
          <span>欢迎来信推荐文献或指出问题。</span>
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
            <div class="score-pill">
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
      <div class="paper-meta">${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
      <h3><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${paper.title}</a></h3>
      <div class="muted">${paper.authors || ""}</div>
      <div class="muted">${paper.journal_or_series || "期刊待补充"}${paper.doi ? ` · DOI: ${paper.doi}` : ""}</div>
      <div class="muted">${paper.one_line_judgment || ""}</div>
      ${scoreStrip(paper.ratings)}
      <div class="chip-row">
        ${paper.themes.map((theme) => `<span class="chip">${theme.name}</span>`).join("")}
      </div>
      <div class="tag-row">
        <a class="button-link" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">查看详情</a>
        <a class="button-link secondary" href="./compare.html?left=${encodeURIComponent(paper.work_id)}">加入对比</a>
      </div>
    </article>
  `;
}

function radarSvg(ratings) {
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
  const levels = 5;
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

async function renderDashboard(site) {
  const main = document.getElementById("page-main");
  const topPapers = site.rankings.overall.slice(0, 4).map((id) => site.papers.find((paper) => paper.work_id === id)).filter(Boolean);
  const quote = quoteForToday();
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy panel">
        <div class="eyebrow">Intro</div>
        <h1>Sencium Lab</h1>
        <p>${site.brand.tagline}</p>
        <p class="intro-text">这个站点从本地数据库中提取结构化论文信息、评分、证据片段、citation lenses 与主题关联，用来支持长期文献积累、选题判断与引用复用。</p>
        <div class="tag-row">
          <span class="tag">SQLite backed</span>
          <span class="tag">Canonical paper cards</span>
          <span class="tag">Citation lenses</span>
          <span class="tag">道法势术器 + 主观</span>
        </div>
      </div>
      <div class="hero-side panel">
        <div id="time-widget">
          <div class="eyebrow">Now</div>
          <h2 class="section-title" id="clock-now">${formatClockNow()}</h2>
          <p class="intro-text" id="solar-now">${formatSolarNow()}</p>
          <p class="intro-text" id="lunar-now">${formatLunarNow()}</p>
        </div>
        <div class="info-card">
          <div class="eyebrow">Quote of the Day</div>
          <p class="intro-text">“${quote.text}”</p>
          <p class="muted">${quote.zh}</p>
          <p class="muted">— ${quote.author}</p>
        </div>
      </div>
    </section>

    <section class="grid-4">
      ${statCard("论文总数", site.meta.paper_count, "已进入公开索引的论文")}
      ${statCard("主题总数", site.meta.theme_count, "主题级知识节点")}
      ${statCard("证据片段", site.meta.excerpt_count, "可回链到论文位置的证据块")}
      ${statCard("引用接口", site.meta.lens_count, "可复用的 citation lenses")}
    </section>

    <section class="panel section">
      <div class="section-head">
        <div>
          <div class="eyebrow">Scoring Framework</div>
          <h2 class="section-title">道法势术器 + 主观</h2>
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
          <div class="eyebrow">Top Ranked</div>
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
            <div class="eyebrow">Themes</div>
            <h2 class="section-title">主题分布</h2>
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
            <div class="eyebrow">Latest</div>
            <h2 class="section-title">最近入库</h2>
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
  const clock = document.getElementById("clock-now");
  const solar = document.getElementById("solar-now");
  const lunar = document.getElementById("lunar-now");
  if (clock && solar && lunar) {
    const updateTime = () => {
      clock.textContent = formatClockNow();
      solar.textContent = formatSolarNow();
      lunar.textContent = formatLunarNow();
    };
    updateTime();
    window.setInterval(updateTime, 1000);
  }
}

async function renderRankings(site) {
  const main = document.getElementById("page-main");
  const metric = qs("metric") || "overall";
  const page = Number(qs("page") || "1");
  const pageSize = 12;
  const rankingIds = site.rankings[metric] || site.rankings.overall;
  const rankingPapers = rankingIds
    .map((id) => site.papers.find((paper) => paper.work_id === id))
    .filter(Boolean);
  const totalPages = Math.max(1, Math.ceil(rankingPapers.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const visible = rankingPapers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  main.innerHTML = `
    <section class="panel">
      <div class="section-head">
        <div>
          <div class="eyebrow">Rankings</div>
          <h1 class="section-title">评分排序</h1>
        </div>
        <div class="chip-row">
          ${[
            ["overall", "综合"],
            ["dao", "道"],
            ["fa", "法"],
            ["shi", "势"],
            ["shu", "术"],
            ["qi", "器"],
            ["subjective", "主观"],
          ]
            .map(([key, label]) => `<a class="chip" href="./rankings.html?metric=${key}">${label}</a>`)
            .join("")}
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
                    <div class="paper-meta">#${(currentPage - 1) * pageSize + index + 1} · ${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</div>
                    <h3 class="paper-row-title"><a href="./paper.html?work=${encodeURIComponent(paper.work_id)}">${paper.title}</a></h3>
                    <div class="muted">${paper.authors || ""}</div>
                    <div class="muted">${paper.journal_or_series || ""}</div>
                  </div>
                  <div class="paper-row-actions">
                    <span class="chip">${metric === "overall" ? "综合" : metric} ${value ?? "—"}</span>
                    <a class="button-link secondary" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">详情</a>
                  </div>
                </div>
                <div class="paper-row-summary">${paper.one_line_judgment || ""}</div>
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
          <div class="eyebrow">Search</div>
          <h1 class="section-title">检索</h1>
        </div>
      </div>
      <div class="search-toolbar">
        <input id="query" class="search-input" type="search" placeholder="按标题、作者、主题、判断关键词搜索" />
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
                    <div class="muted">${paper.journal_or_series || ""}</div>
                  </div>
                  <div class="paper-row-actions">
                    <a class="button-link" href="./paper.html?work=${encodeURIComponent(paper.work_id)}">查看详情</a>
                    <a class="button-link secondary" href="./compare.html?left=${encodeURIComponent(paper.work_id)}">加入对比</a>
                  </div>
                </div>
                <div class="paper-row-summary">${paper.one_line_judgment || ""}</div>
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
          <div class="eyebrow">Compare</div>
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
        <button id="compare-go" class="button-link">更新对比</button>
      </div>
      <div id="compare-host"></div>
    </section>
  `;
  const buildTable = () => {
    const leftPaper = site.papers.find((paper) => paper.work_id === document.getElementById("left-paper").value);
    const rightPaper = site.papers.find((paper) => paper.work_id === document.getElementById("right-paper").value);
    if (!leftPaper || !rightPaper) return;
    document.getElementById("compare-host").innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th>维度</th>
            <th>${leftPaper.title}</th>
            <th>${rightPaper.title}</th>
          </tr>
        </thead>
        <tbody>
          ${[
            ["作者", leftPaper.authors, rightPaper.authors],
            ["期刊", leftPaper.journal_or_series, rightPaper.journal_or_series],
            ["领域", formatField(leftPaper.field), formatField(rightPaper.field)],
            ["范式", formatParadigm(leftPaper.paper_paradigm), formatParadigm(rightPaper.paper_paradigm)],
            ["研究问题", leftPaper.research_question, rightPaper.research_question],
            ["方法/路径", leftPaper.approach, rightPaper.approach],
            ["主结论", leftPaper.main_claim, rightPaper.main_claim],
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
                  <th>${label}</th>
                  <td>${a ?? "—"}</td>
                  <td>${b ?? "—"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };
  document.getElementById("compare-go").addEventListener("click", buildTable);
  buildTable();
}

async function renderAbout(site) {
  const main = document.getElementById("page-main");
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy panel">
        <div class="eyebrow">About</div>
        <img src="${site.brand.logo_intro_url}" alt="Sencium Lab intro" />
        <p style="margin-top:18px">${site.brand.tagline}</p>
        <p class="intro-text">这个站点展示的是从本地 SQLite 研究数据库导出的公开快照。完整 PDF、全文提取、私有笔记和 live database 仍保留在本地工作区，不直接暴露在 GitHub 仓库中。</p>
      </div>
      <div class="hero-side panel">
        <div class="info-card">
          <div class="eyebrow">Contact</div>
          <p class="intro-text">如果你有推荐文献、纠错建议或合作想法，欢迎直接来信。</p>
          <p class="muted"><a href="mailto:${site.brand.contact_email}">${site.brand.contact_email}</a></p>
        </div>
      </div>
    </section>
    <section class="grid-2">
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">Contact</div>
            <h2 class="section-title">联系与推荐</h2>
          </div>
        </div>
        <div class="stack-list">
          <div class="stack-item"><strong>GitHub</strong><div class="muted"><a href="${site.brand.github_url}" target="_blank" rel="noreferrer">${site.brand.github_url}</a></div></div>
          <div class="stack-item"><strong>Email</strong><div class="muted"><a href="mailto:${site.brand.contact_email}">${site.brand.contact_email}</a></div></div>
          <div class="stack-item"><strong>公众号</strong><div class="muted">${site.brand.wechat_name}</div></div>
        </div>
      </div>
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="eyebrow">Publishing Model</div>
            <h2 class="section-title">公开策略</h2>
          </div>
        </div>
        <div class="stack-list">
          <div class="stack-item"><strong>索引层</strong><div class="muted">标题、作者、期刊、评分、主题、摘要与排序可公开展示。</div></div>
          <div class="stack-item"><strong>详情层</strong><div class="muted">论文详情页按需加载结构化信息与选定 excerpt / lens。</div></div>
          <div class="stack-item"><strong>本地层</strong><div class="muted">原始 PDF、live SQLite、未公开长文笔记保留在本地工作区。</div></div>
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
  const sections = paper.sections || {};
  const detailFields = [
    ["领域", formatField(paper.field)],
    ["子领域", formatField(paper.subfield)],
    ["范式", formatParadigm(paper.paper_paradigm)],
    ["期刊", paper.journal_or_series],
    ["DOI", paper.doi],
    ["研究问题", paper.research_question],
    ["为什么重要", paper.why_it_matters],
    ["研究对象", paper.core_object],
    ["方法 / 路径", paper.approach],
    ["主结论", paper.main_claim],
    ["为什么进入我的库", paper.why_in_my_db],
  ];
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy panel">
        <div class="eyebrow">Paper Detail</div>
        <h1>${paper.title}</h1>
        <p>${paper.authors || ""}</p>
        <p>${paper.year || "—"} · ${formatField(paper.field)} · ${formatParadigm(paper.paper_paradigm)}</p>
        <p>${paper.journal_or_series || "期刊待补充"}${paper.doi ? ` · DOI: ${paper.doi}` : ""}</p>
        <div class="tag-row">
          ${paper.themes.map((theme) => `<span class="tag">${theme.name}</span>`).join("")}
        </div>
      </div>
      <div class="hero-side panel">
        <div>
          <div class="eyebrow">One-line Judgment</div>
          <p class="intro-text">${paper.one_line_judgment || ""}</p>
        </div>
        ${scoreStrip(paper.ratings)}
      </div>
    </section>
    <section class="paper-layout">
      <div class="detail-stack">
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Structured Card</div>
              <h2 class="section-title">结构化论文卡</h2>
            </div>
          </div>
          <dl>
            ${detailFields.map(([label, value]) => `<dt>${label}</dt><dd>${value || "—"}</dd>`).join("")}
          </dl>
        </article>
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Rendered Sections</div>
              <h2 class="section-title">结构化内容渲染</h2>
            </div>
          </div>
          ${[
            "Research Question",
            "Why It Matters",
            "Core Object",
            "Approach",
            "Main Claim",
            "Institutional Setting",
            "Data Source",
            "Identification Logic",
            "Main Results",
            "Mechanism Evidence",
            "Counterfactual Or Policy Exercise",
            "Limitations",
          ]
            .filter((key) => sections[key])
            .map(
              (key) => `
                <section class="section-block">
                  <h4>${{
                    "Research Question": "研究问题",
                    "Why It Matters": "为什么重要",
                    "Core Object": "研究对象",
                    "Approach": "研究路径",
                    "Main Claim": "主结论",
                    "Institutional Setting": "制度背景",
                    "Data Source": "数据来源",
                    "Identification Logic": "识别逻辑",
                    "Main Results": "主要结果",
                    "Mechanism Evidence": "机制证据",
                    "Counterfactual Or Policy Exercise": "反事实 / 政策分析",
                    "Limitations": "局限",
                  }[key]}</h4>
                  <p>${sections[key]}</p>
                </section>
              `
            )
            .join("")}
        </article>
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Lenses</div>
              <h2 class="section-title">引用接口</h2>
            </div>
          </div>
          <div class="stack-list">
            ${paper.lenses
              .map(
                (lens) => `
                  <div class="stack-item">
                    <strong>${lens.lens_type.toUpperCase()} · ${lens.theme_id || "unlinked"}</strong>
                    <div class="muted">${lens.claim || ""}</div>
                    <div class="muted">更安全的表述：${lens.safer_formulation || "—"}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Evidence</div>
              <h2 class="section-title">Excerpts</h2>
            </div>
          </div>
          <div class="stack-list">
            ${paper.excerpts
              .map(
                (excerpt) => `
                  <div class="stack-item">
                    <strong>${excerpt.location} · ${excerpt.topic}</strong>
                    <div class="muted">${excerpt.quote_or_paraphrase}</div>
                    <div class="muted">为何重要：${excerpt.why_this_matters}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      </div>
      <div class="detail-stack">
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Ratings</div>
              <h2 class="section-title">六维图</h2>
            </div>
          </div>
          <div class="radar-wrap">${radarSvg(paper.ratings)}</div>
          <div class="legend-list">
            ${Object.entries({
              道: paper.rating_notes.dao,
              法: paper.rating_notes.fa,
              势: paper.rating_notes.shi,
              术: paper.rating_notes.shu,
              器: paper.rating_notes.qi,
              主观: paper.rating_notes.subjective,
            })
              .map(
                ([label, value]) => `
                  <div class="legend-item">
                    <strong>${label}</strong>
                    <div class="muted">${value || ""}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
        <article class="detail-card panel">
          <div class="section-head">
            <div>
              <div class="eyebrow">Rendered Source</div>
              <h2 class="section-title">Paper Card 原文</h2>
            </div>
          </div>
          <pre>${paper.markdown}</pre>
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
  if (page === "dashboard") return renderDashboard(site);
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
