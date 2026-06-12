from __future__ import annotations

import json
import sqlite3
from collections import Counter
from pathlib import Path

from senlab_markdown import load_text, parse_frontmatter_and_body, parse_heading_sections


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
WEB_DATA = ROOT / "web" / "data"


def load_markdown(path: str | None) -> str:
    if not path:
        return ""
    file_path = Path(path)
    if not file_path.exists():
        return ""
    return load_text(file_path)


def parse_card_sections(markdown_path: str | None) -> dict[str, str]:
    markdown = load_markdown(markdown_path)
    if not markdown:
        return {}
    _, body = parse_frontmatter_and_body(markdown)
    return parse_heading_sections(body)


def nav_items() -> list[dict[str, str]]:
    return [
        {"href": "./index.html", "label": "总览"},
        {"href": "./rankings.html", "label": "评分排序"},
        {"href": "./search.html", "label": "检索"},
        {"href": "./compare.html", "label": "文献对比"},
        {"href": "./about.html", "label": "关于"},
    ]


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        papers = []
        paradigm_counter: Counter[str] = Counter()
        field_counter: Counter[str] = Counter()
        theme_counter: Counter[str] = Counter()
        theme_name_map: dict[str, str] = {}

        paper_rows = conn.execute(
            """
            SELECT
                w.work_id,
                w.title,
                w.year,
                w.field,
                w.subfield,
                w.paper_paradigm,
                w.canonical_version_id,
                pc.markdown_path,
                pc.authors,
                pc.research_question,
                pc.why_it_matters,
                pc.core_object,
                pc.approach,
                pc.main_claim,
                pc.why_in_my_db,
                pc.journal_or_series,
                pc.doi,
                r.dao, r.fa, r.shi, r.shu, r.qi, r.subjective,
                r.dao_note, r.fa_note, r.shi_note, r.shu_note, r.qi_note, r.subjective_note,
                r.one_line_judgment
            FROM works w
            LEFT JOIN paper_cards pc ON pc.work_id = w.work_id
            LEFT JOIN ratings r ON r.work_id = w.work_id
            ORDER BY w.year DESC, w.title
            """
        ).fetchall()

        for row in paper_rows:
            work_id = row["work_id"]
            themes = [
                {"theme_id": t["theme_id"], "name": t["name"]}
                for t in conn.execute(
                    """
                    SELECT t.theme_id, t.name
                    FROM themes t
                    JOIN paper_theme_links ptl ON ptl.theme_id = t.theme_id
                    WHERE ptl.work_id = ?
                    ORDER BY t.name
                    """,
                    (work_id,),
                )
            ]
            for theme in themes:
                theme_counter[theme["theme_id"]] += 1
                theme_name_map[theme["theme_id"]] = theme["name"]

            excerpts = [
                {
                    "excerpt_id": e["excerpt_id"],
                    "location": e["location"],
                    "topic": e["topic"],
                    "quote_or_paraphrase": e["quote_or_paraphrase"],
                    "why_this_matters": e["why_this_matters"],
                }
                for e in conn.execute(
                    """
                    SELECT excerpt_id, location, topic, quote_or_paraphrase, why_this_matters
                    FROM excerpts
                    WHERE work_id = ?
                    ORDER BY excerpt_id
                    """,
                    (work_id,),
                )
            ]

            lenses = [
                {
                    "lens_id": l["lens_id"],
                    "theme_id": l["theme_id"],
                    "lens_type": l["lens_type"],
                    "claim": l["claim"],
                    "interpretation": l["interpretation"],
                    "overclaim_risk": l["overclaim_risk"],
                    "safer_formulation": l["safer_formulation"],
                }
                for l in conn.execute(
                    """
                    SELECT lens_id, theme_id, lens_type, claim, interpretation, overclaim_risk, safer_formulation
                    FROM lenses
                    WHERE work_id = ?
                    ORDER BY lens_id
                    """,
                    (work_id,),
                )
            ]

            sections = parse_card_sections(row["markdown_path"])
            overall_score = sum((row["dao"] or 0, row["fa"] or 0, row["shi"] or 0, row["shu"] or 0, row["qi"] or 0))
            paper_detail = {
                "work_id": work_id,
                "title": row["title"],
                "year": row["year"],
                "authors": row["authors"],
                "field": row["field"],
                "subfield": row["subfield"],
                "paper_paradigm": row["paper_paradigm"],
                "journal_or_series": row["journal_or_series"],
                "doi": row["doi"],
                "research_question": row["research_question"],
                "why_it_matters": row["why_it_matters"],
                "core_object": row["core_object"],
                "approach": row["approach"],
                "main_claim": row["main_claim"],
                "why_in_my_db": row["why_in_my_db"],
                "one_line_judgment": row["one_line_judgment"],
                "ratings": {
                    "dao": row["dao"],
                    "fa": row["fa"],
                    "shi": row["shi"],
                    "shu": row["shu"],
                    "qi": row["qi"],
                    "subjective": row["subjective"],
                    "overall": overall_score,
                },
                "rating_notes": {
                    "dao": row["dao_note"],
                    "fa": row["fa_note"],
                    "shi": row["shi_note"],
                    "shu": row["shu_note"],
                    "qi": row["qi_note"],
                    "subjective": row["subjective_note"],
                },
                "themes": themes,
                "excerpts": excerpts,
                "lenses": lenses,
                "sections": sections,
            }
            papers.append(paper_detail)
            if row["paper_paradigm"]:
                paradigm_counter[row["paper_paradigm"]] += 1
            if row["field"]:
                field_counter[row["field"]] += 1
            write_json(WEB_DATA / "papers" / f"{work_id}.json", paper_detail)

        rankings = {
            "overall": sorted(papers, key=lambda item: (item["ratings"]["overall"], item["ratings"]["subjective"] or 0, item["year"] or 0), reverse=True),
            "dao": sorted(papers, key=lambda item: (item["ratings"]["dao"] or 0, item["year"] or 0), reverse=True),
            "fa": sorted(papers, key=lambda item: (item["ratings"]["fa"] or 0, item["year"] or 0), reverse=True),
            "shi": sorted(papers, key=lambda item: (item["ratings"]["shi"] or 0, item["year"] or 0), reverse=True),
            "shu": sorted(papers, key=lambda item: (item["ratings"]["shu"] or 0, item["year"] or 0), reverse=True),
            "qi": sorted(papers, key=lambda item: (item["ratings"]["qi"] or 0, item["year"] or 0), reverse=True),
            "subjective": sorted(papers, key=lambda item: (item["ratings"]["subjective"] or 0, item["year"] or 0), reverse=True),
        }
        ranking_ids = {key: [paper["work_id"] for paper in value] for key, value in rankings.items()}
        latest_ids = [paper["work_id"] for paper in sorted(papers, key=lambda item: (item["year"] or 0, item["work_id"]), reverse=True)[:6]]

        theme_rows = [
            {
                "theme_id": row["theme_id"],
                "name": row["name"],
                "field": row["field"],
                "status": row["status"],
                "paper_count": theme_counter.get(row["theme_id"], 0),
            }
            for row in conn.execute("SELECT theme_id, name, field, status FROM themes ORDER BY name")
        ]

        site_index = {
            "brand": {
                "title": "Sencium Lab",
                "tagline": "为长期研究积累而建的本地优先文献系统。",
                "github_url": "https://github.com/fyapeng/senlab",
                "contact_email": "contact@fyapeng.com",
                "wechat_name": "申椿",
                "logo_url": "./web/assets/logo-horizontal-clean-dark.svg",
                "logo_intro_url": "./web/assets/logo-horizontal-intro-dark.svg",
            },
            "nav": nav_items(),
            "meta": {
                "paper_count": len(papers),
                "theme_count": len(theme_rows),
                "excerpt_count": sum(len(paper["excerpts"]) for paper in papers),
                "lens_count": sum(len(paper["lenses"]) for paper in papers),
                "updated_from_local_db": True,
            },
            "score_dimensions": [
                {"key": "dao", "label": "道", "desc": "研究问题的重要性与方向感。"},
                {"key": "fa", "label": "法", "desc": "识别、理论或论证逻辑的可信度。"},
                {"key": "shi", "label": "势", "desc": "制度、数据、时代与文献窗口的优势。"},
                {"key": "shu", "label": "术", "desc": "执行质量、推导组织与实证实现。"},
                {"key": "qi", "label": "器", "desc": "数据、模型、制度与工具的复用价值。"},
                {"key": "subjective", "label": "主观", "desc": "对当前研究议程的个人价值判断。"},
            ],
            "papers": [
                {
                    "work_id": paper["work_id"],
                    "title": paper["title"],
                    "year": paper["year"],
                    "authors": paper["authors"],
                    "field": paper["field"],
                    "subfield": paper["subfield"],
                    "paper_paradigm": paper["paper_paradigm"],
                    "journal_or_series": paper["journal_or_series"],
                    "doi": paper["doi"],
                    "one_line_judgment": paper["one_line_judgment"],
                    "ratings": paper["ratings"],
                    "themes": paper["themes"],
                    "excerpt_count": len(paper["excerpts"]),
                    "lens_count": len(paper["lenses"]),
                }
                for paper in papers
            ],
            "themes": theme_rows,
            "theme_distribution": [
                {"theme_id": theme_id, "name": theme_name_map.get(theme_id, theme_id), "paper_count": count}
                for theme_id, count in theme_counter.most_common()
            ],
            "field_distribution": [{"name": name, "paper_count": count} for name, count in field_counter.most_common()],
            "paradigm_distribution": [{"name": name, "paper_count": count} for name, count in paradigm_counter.most_common()],
            "rankings": ranking_ids,
            "latest": latest_ids,
        }

    write_json(WEB_DATA / "site-index.json", site_index)
    print(f"Exported site index and {len(papers)} paper detail files to {WEB_DATA}")


if __name__ == "__main__":
    main()
