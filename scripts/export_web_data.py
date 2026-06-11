from __future__ import annotations

import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
OUT_PATH = ROOT / "web" / "data" / "senlab-data.js"


def load_markdown(path: str | None) -> str:
    if not path:
        return ""
    file_path = Path(path)
    if not file_path.exists():
        return ""
    return file_path.read_text(encoding="utf-8")


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        papers = []
        for row in conn.execute(
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
                pc.research_question,
                pc.why_it_matters,
                pc.core_object,
                pc.approach,
                pc.main_claim,
                pc.why_in_my_db,
                r.dao, r.fa, r.shi, r.shu, r.qi, r.subjective,
                r.dao_note, r.fa_note, r.shi_note, r.shu_note, r.qi_note, r.subjective_note,
                r.one_line_judgment
            FROM works w
            LEFT JOIN paper_cards pc ON pc.work_id = w.work_id
            LEFT JOIN ratings r ON r.work_id = w.work_id
            ORDER BY w.year DESC, w.title
            """
        ):
            work_id = row["work_id"]
            themes = [
                dict(theme_id=t["theme_id"], name=t["name"])
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
            excerpts = [
                dict(
                    excerpt_id=e["excerpt_id"],
                    location=e["location"],
                    topic=e["topic"],
                    quote_or_paraphrase=e["quote_or_paraphrase"],
                    why_this_matters=e["why_this_matters"],
                )
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
                dict(
                    lens_id=l["lens_id"],
                    theme_id=l["theme_id"],
                    lens_type=l["lens_type"],
                    claim=l["claim"],
                    interpretation=l["interpretation"],
                    overclaim_risk=l["overclaim_risk"],
                    safer_formulation=l["safer_formulation"],
                )
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
            papers.append(
                {
                    "work_id": work_id,
                    "title": row["title"],
                    "year": row["year"],
                    "field": row["field"],
                    "subfield": row["subfield"],
                    "paper_paradigm": row["paper_paradigm"],
                    "research_question": row["research_question"],
                    "why_it_matters": row["why_it_matters"],
                    "core_object": row["core_object"],
                    "approach": row["approach"],
                    "main_claim": row["main_claim"],
                    "why_in_my_db": row["why_in_my_db"],
                    "ratings": {
                        "dao": row["dao"],
                        "fa": row["fa"],
                        "shi": row["shi"],
                        "shu": row["shu"],
                        "qi": row["qi"],
                        "subjective": row["subjective"],
                    },
                    "rating_notes": {
                        "dao": row["dao_note"],
                        "fa": row["fa_note"],
                        "shi": row["shi_note"],
                        "shu": row["shu_note"],
                        "qi": row["qi_note"],
                        "subjective": row["subjective_note"],
                    },
                    "one_line_judgment": row["one_line_judgment"],
                    "themes": themes,
                    "excerpts": excerpts,
                    "lenses": lenses,
                    "markdown": load_markdown(row["markdown_path"]),
                }
            )

        theme_rows = [
            dict(theme_id=row["theme_id"], name=row["name"], field=row["field"], status=row["status"])
            for row in conn.execute("SELECT theme_id, name, field, status FROM themes ORDER BY name")
        ]

    payload = {
        "meta": {
            "name": "SenLab Demo",
            "paper_count": len(papers),
            "theme_count": len(theme_rows),
        },
        "papers": papers,
        "themes": theme_rows,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("window.SENLAB_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Exported web data to {OUT_PATH}")


if __name__ == "__main__":
    main()
