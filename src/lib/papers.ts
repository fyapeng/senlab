// Small text helpers shared by the homepage, constellation pages and paper pages.

// One-line gist: the 道 rating note states what the paper establishes; fall back to the summary's first sentence.
export const gist = (p: any): string =>
  p.rating_notes?.dao || (p.summary || "").replace(/\*/g, "").split("。")[0];

// Every summary opens with a bold conclusion paragraph. Split it off as plain lead text, keep the rest as markdown.
export const splitLead = (summary: string): { lead: string; rest: string } => {
  const m = (summary || "").match(/^\*\*([\s\S]*?)\*\*\s*(?:\n\s*\n|$)([\s\S]*)$/);
  return m ? { lead: m[1].trim(), rest: m[2] } : { lead: "", rest: summary || "" };
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Generated text cites papers as [id] or [id1; id2]: turn them into short links, drop ids not in the library,
// and split paragraphs on blank lines. Returns HTML.
export const citeHtml = (text: unknown, byId: Record<string, any>, base: string): string =>
  // the model sometimes answers a field with a list of points; each becomes a paragraph
  (Array.isArray(text) ? text.map(String).join("\n\n") : typeof text === "string" ? text : text == null ? "" : String(text))
    .split(/\n\s*\n/).map((para) => "<p>" + esc(para.trim()).replace(/\[([^\]]+)\]/g, (_m, inner: string) => {
    const links = inner.split(/[;,，；\s]+/).filter((id) => byId[id])
      .map((id) => `<a class="cite" href="${base}papers/${id}/" title="${esc(byId[id].title)}">${esc(byId[id].authors_short)} ${byId[id].year}</a>`);
    return links.length ? `<span class="cites">（${links.join("；")}）</span>` : "";
  }) + "</p>").join("");

// Members of a constellation in reading order: by year, then by centrality.
export const chrono = (ps: any[]): any[] =>
  [...ps].sort((a, b) => (Number(a.year) || 9999) - (Number(b.year) || 9999) || a.metrics.rank - b.metrics.rank);
