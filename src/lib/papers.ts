// Small text helpers shared by the homepage, constellation pages and paper pages.

// One-line gist: the 道 rating note states what the paper establishes; fall back to the summary's first sentence.
export const gist = (p: any): string =>
  p.rating_notes?.dao || (p.summary || "").replace(/\*/g, "").split("。")[0];

// Every summary opens with a bold conclusion paragraph. Split it off as plain lead text, keep the rest as markdown.
export const splitLead = (summary: string): { lead: string; rest: string } => {
  const m = (summary || "").match(/^\*\*([\s\S]*?)\*\*\s*(?:\n\s*\n|$)([\s\S]*)$/);
  return m ? { lead: m[1].trim(), rest: m[2] } : { lead: "", rest: summary || "" };
};

// Members of a constellation in reading order: by year, then by centrality.
export const chrono = (ps: any[]): any[] =>
  [...ps].sort((a, b) => (Number(a.year) || 9999) - (Number(b.year) || 9999) || a.metrics.rank - b.metrics.rank);
