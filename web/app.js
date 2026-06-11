const data = window.SENLAB_DATA || { meta: {}, papers: [], themes: [] };

const state = {
  query: "",
  selectedWorkId: data.papers[0]?.work_id || null,
  compareLeft: data.papers[0]?.work_id || null,
  compareRight: data.papers[1]?.work_id || data.papers[0]?.work_id || null,
};

const dims = [
  { key: "dao", label: "道" },
  { key: "fa", label: "法" },
  { key: "shi", label: "势" },
  { key: "shu", label: "术" },
  { key: "qi", label: "器" },
  { key: "subjective", label: "主观" },
];

function getPaper(workId) {
  return data.papers.find((paper) => paper.work_id === workId);
}

function renderMeta() {
  const host = document.getElementById("meta-strip");
  host.innerHTML = "";
  [
    `Papers ${data.meta.paper_count || 0}`,
    `Themes ${data.meta.theme_count || 0}`,
    "SQLite-backed",
  ].forEach((text) => {
    const span = document.createElement("span");
    span.className = "meta-pill";
    span.textContent = text;
    host.appendChild(span);
  });
}

function filteredPapers() {
  const q = state.query.trim().toLowerCase();
  if (!q) return data.papers;
  return data.papers.filter((paper) => {
    const haystack = [
      paper.title,
      paper.field,
      paper.subfield,
      paper.paper_paradigm,
      paper.main_claim,
      paper.research_question,
      ...paper.themes.map((theme) => theme.name),
      ...paper.lenses.map((lens) => lens.lens_type + " " + lens.claim),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function renderPaperList() {
  const host = document.getElementById("paper-list");
  host.innerHTML = "";
  filteredPapers().forEach((paper) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "paper-item" + (paper.work_id === state.selectedWorkId ? " active" : "");
    card.innerHTML = `
      <h4>${paper.title}</h4>
      <p>${paper.year || ""} · ${paper.field || ""} · ${paper.paper_paradigm || ""}</p>
      <p>${paper.one_line_judgment || ""}</p>
    `;
    card.addEventListener("click", () => {
      state.selectedWorkId = paper.work_id;
      state.compareLeft = paper.work_id;
      render();
    });
    host.appendChild(card);
  });
}

function setSummaryFields(paper) {
  const host = document.getElementById("summary-fields");
  host.innerHTML = "";
  const fields = [
    ["Field", paper.field],
    ["Subfield", paper.subfield],
    ["Paradigm", paper.paper_paradigm],
    ["Research Question", paper.research_question],
    ["Why It Matters", paper.why_it_matters],
    ["Core Object", paper.core_object],
    ["Approach", paper.approach],
    ["Main Claim", paper.main_claim],
    ["Why In My DB", paper.why_in_my_db],
  ];
  fields.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value || "—";
    host.append(dt, dd);
  });
}

function buildRadarSvg(paper) {
  const size = 320;
  const center = size / 2;
  const radius = 110;
  const levels = 5;
  const angleStep = (Math.PI * 2) / dims.length;

  const levelPolygons = Array.from({ length: levels }, (_, idx) => {
    const ratio = (idx + 1) / levels;
    const points = dims
      .map((_, i) => {
        const angle = -Math.PI / 2 + angleStep * i;
        const x = center + Math.cos(angle) * radius * ratio;
        const y = center + Math.sin(angle) * radius * ratio;
        return `${x},${y}`;
      })
      .join(" ");
    return `<polygon points="${points}" fill="none" stroke="rgba(102,119,132,0.16)" />`;
  }).join("");

  const axes = dims
    .map((dim, i) => {
      const angle = -Math.PI / 2 + angleStep * i;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const labelX = center + Math.cos(angle) * (radius + 24);
      const labelY = center + Math.sin(angle) * (radius + 24);
      return `
        <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(102,119,132,0.22)" />
        <text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#1f2a33">${dim.label}</text>
      `;
    })
    .join("");

  const points = dims
    .map((dim, i) => {
      const score = Number(paper.ratings[dim.key] || 0);
      const ratio = score / levels;
      const angle = -Math.PI / 2 + angleStep * i;
      const x = center + Math.cos(angle) * radius * ratio;
      const y = center + Math.sin(angle) * radius * ratio;
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <svg viewBox="0 0 ${size} ${size}" width="100%" height="320" aria-label="ratings radar">
      ${levelPolygons}
      ${axes}
      <polygon points="${points}" fill="rgba(156, 79, 40, 0.22)" stroke="#9c4f28" stroke-width="3" />
    </svg>
  `;
}

function renderRatings(paper) {
  document.getElementById("radar-chart").innerHTML = buildRadarSvg(paper);
  const notes = document.getElementById("rating-notes");
  notes.innerHTML = "";
  dims.forEach((dim) => {
    const div = document.createElement("div");
    div.className = "rating-note";
    div.innerHTML = `<strong>${dim.label} ${paper.ratings[dim.key] ?? "—"}</strong><span>${paper.rating_notes[dim.key] || ""}</span>`;
    notes.appendChild(div);
  });
}

function renderThemesAndLenses(paper) {
  const themesHost = document.getElementById("themes");
  const lensesHost = document.getElementById("lenses");
  themesHost.innerHTML = "";
  lensesHost.innerHTML = "";

  paper.themes.forEach((theme) => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = theme.name;
    themesHost.appendChild(span);
  });

  paper.lenses.forEach((lens) => {
    const div = document.createElement("article");
    div.className = "stack-card";
    div.innerHTML = `
      <h4>${lens.lens_type.toUpperCase()} · ${lens.theme_id}</h4>
      <p><strong>Claim:</strong> ${lens.claim || "—"}</p>
      <p><strong>Interpretation:</strong> ${lens.interpretation || "—"}</p>
      <p><strong>Safer formulation:</strong> ${lens.safer_formulation || "—"}</p>
    `;
    lensesHost.appendChild(div);
  });
}

function renderExcerpts(paper) {
  const host = document.getElementById("excerpts");
  host.innerHTML = "";
  paper.excerpts.forEach((excerpt) => {
    const div = document.createElement("article");
    div.className = "stack-card";
    div.innerHTML = `
      <h4>${excerpt.location} · ${excerpt.topic}</h4>
      <p>${excerpt.quote_or_paraphrase || "—"}</p>
      <p><strong>Why this matters:</strong> ${excerpt.why_this_matters || "—"}</p>
    `;
    host.appendChild(div);
  });
}

function renderDetail() {
  const paper = getPaper(state.selectedWorkId) || data.papers[0];
  if (!paper) return;
  document.getElementById("paper-title").textContent = paper.title;
  document.getElementById("paper-subtitle").textContent = `${paper.year || ""} · ${paper.field || ""} · ${paper.subfield || ""} · ${paper.paper_paradigm || ""}`;
  document.getElementById("one-line-judgment").textContent = paper.one_line_judgment || "";
  document.getElementById("markdown-view").textContent = paper.markdown || "";
  setSummaryFields(paper);
  renderRatings(paper);
  renderThemesAndLenses(paper);
  renderExcerpts(paper);
}

function fillCompareSelects() {
  const left = document.getElementById("compare-left");
  const right = document.getElementById("compare-right");
  [left, right].forEach((select) => {
    select.innerHTML = "";
    data.papers.forEach((paper) => {
      const option = document.createElement("option");
      option.value = paper.work_id;
      option.textContent = `${paper.year || ""} · ${paper.title}`;
      select.appendChild(option);
    });
  });
  left.value = state.compareLeft;
  right.value = state.compareRight;
  left.onchange = (event) => {
    state.compareLeft = event.target.value;
    renderCompare();
  };
  right.onchange = (event) => {
    state.compareRight = event.target.value;
    renderCompare();
  };
}

function renderCompare() {
  const leftPaper = getPaper(state.compareLeft);
  const rightPaper = getPaper(state.compareRight);
  const host = document.getElementById("compare-table");
  if (!leftPaper || !rightPaper) {
    host.innerHTML = "";
    return;
  }
  const rows = [
    ["Field", leftPaper.field, rightPaper.field],
    ["Paradigm", leftPaper.paper_paradigm, rightPaper.paper_paradigm],
    ["Research Question", leftPaper.research_question, rightPaper.research_question],
    ["Approach", leftPaper.approach, rightPaper.approach],
    ["Main Claim", leftPaper.main_claim, rightPaper.main_claim],
    ["Dao", leftPaper.ratings.dao, rightPaper.ratings.dao],
    ["Fa", leftPaper.ratings.fa, rightPaper.ratings.fa],
    ["Shi", leftPaper.ratings.shi, rightPaper.ratings.shi],
    ["Shu", leftPaper.ratings.shu, rightPaper.ratings.shu],
    ["Qi", leftPaper.ratings.qi, rightPaper.ratings.qi],
    ["Subjective", leftPaper.ratings.subjective, rightPaper.ratings.subjective],
  ];
  host.innerHTML = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>Dimension</th>
          <th>${leftPaper.title}</th>
          <th>${rightPaper.title}</th>
        </tr>
      </thead>
      <tbody>
        ${rows
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
}

function bindSearch() {
  const input = document.getElementById("search-input");
  input.value = state.query;
  input.addEventListener("input", (event) => {
    state.query = event.target.value;
    const papers = filteredPapers();
    if (!papers.find((paper) => paper.work_id === state.selectedWorkId) && papers[0]) {
      state.selectedWorkId = papers[0].work_id;
    }
    renderPaperList();
    renderDetail();
  });
}

function render() {
  renderMeta();
  renderPaperList();
  renderDetail();
  fillCompareSelects();
  renderCompare();
}

bindSearch();
render();
