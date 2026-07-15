from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from migrate_db import migrate
from senlab_markdown import load_text, parse_frontmatter_and_body, parse_heading_sections


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
OUTPUT_PATH = ROOT / "output" / "senlab-public.sql"


def sql(value: object) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def json_text(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def markdown_sections(path: str | None) -> dict[str, str]:
    if not path:
        return {}
    file_path = Path(path)
    if not file_path.exists():
        return {}
    _, body = parse_frontmatter_and_body(load_text(file_path))
    return parse_heading_sections(body)


def citation_title(title: str | None, claim: str | None, point_type: str | None) -> str:
    if title and title.strip():
        return title.strip()
    text = (claim or "").strip()
    if text:
        return text[:34] + ("…" if len(text) > 34 else "")
    return (point_type or "citation").replace("_", " ")


def insert(table: str, columns: list[str], values: list[object]) -> str:
    return f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(sql(v) for v in values)});"


def build_export(conn: sqlite3.Connection) -> list[str]:
    conn.row_factory = sqlite3.Row
    timestamp = datetime.now(timezone.utc).isoformat()
    statements = [
        "DELETE FROM citation_fts;",
        "DELETE FROM citation_topics;",
        "DELETE FROM citations;",
        "DELETE FROM paper_topics;",
        "DELETE FROM topics;",
        "DELETE FROM paper_themes;",
        "DELETE FROM themes;",
        "DELETE FROM papers;",
        "DELETE FROM meta;",
    ]

    public_work_ids = {
        row[0]
        for row in conn.execute(
            "SELECT work_id FROM paper_cards WHERE COALESCE(visibility, 'public') = 'public'"
        )
    }

    paper_columns = [
        "work_id", "canonical_version_id", "title", "authors", "year",
        "publication_status", "journal_or_series", "doi", "field", "subfield",
        "paper_paradigm", "research_question", "why_it_matters", "core_object",
        "approach", "main_claim", "why_in_my_db", "one_line_judgment",
        "ratings_json", "rating_notes_json", "sections_json", "updated_at",
    ]
    paper_rows = conn.execute(
        """
        SELECT w.*, pc.markdown_path, pc.authors, pc.publication_status,
               pc.journal_or_series, pc.doi, pc.research_question, pc.why_it_matters,
               pc.core_object, pc.approach, pc.main_claim, pc.why_in_my_db,
               r.dao, r.fa, r.shi, r.shu, r.qi, r.subjective,
               r.dao_note, r.fa_note, r.shi_note, r.shu_note, r.qi_note,
               r.subjective_note, r.one_line_judgment
        FROM works w
        JOIN paper_cards pc ON pc.work_id = w.work_id
        LEFT JOIN ratings r ON r.work_id = w.work_id
        WHERE COALESCE(pc.visibility, 'public') = 'public'
        ORDER BY w.work_id
        """
    ).fetchall()
    for row in paper_rows:
        ratings = {key: row[key] for key in ("dao", "fa", "shi", "shu", "qi", "subjective")}
        ratings["overall"] = sum(value or 0 for value in ratings.values())
        rating_notes = {key: row[f"{key}_note"] for key in ("dao", "fa", "shi", "shu", "qi", "subjective")}
        statements.append(
            insert(
                "papers",
                paper_columns,
                [
                    row["work_id"], row["canonical_version_id"], row["title"], row["authors"], row["year"],
                    row["publication_status"], row["journal_or_series"], row["doi"], row["field"], row["subfield"],
                    row["paper_paradigm"], row["research_question"], row["why_it_matters"], row["core_object"],
                    row["approach"], row["main_claim"], row["why_in_my_db"], row["one_line_judgment"],
                    json_text(ratings), json_text(rating_notes), json_text(markdown_sections(row["markdown_path"])), timestamp,
                ],
            )
        )

    linked_theme_ids = {
        row[0]
        for row in conn.execute(
            "SELECT DISTINCT theme_id FROM paper_theme_links WHERE work_id IN (SELECT work_id FROM paper_cards WHERE COALESCE(visibility, 'public')='public')"
        )
    }
    for row in conn.execute("SELECT theme_id, name, field FROM themes ORDER BY theme_id"):
        if row["theme_id"] in linked_theme_ids:
            statements.append(insert("themes", ["theme_id", "name", "field"], list(row)))
    for row in conn.execute("SELECT work_id, theme_id FROM paper_theme_links ORDER BY work_id, theme_id"):
        if row["work_id"] in public_work_ids:
            statements.append(insert("paper_themes", ["work_id", "theme_id"], list(row)))

    linked_topic_ids = {
        row[0]
        for row in conn.execute(
            "SELECT DISTINCT topic_id FROM paper_topic_links WHERE work_id IN (SELECT work_id FROM paper_cards WHERE COALESCE(visibility, 'public')='public')"
        )
    }
    for row in conn.execute("SELECT topic_id, name, topic_group FROM topics ORDER BY topic_id"):
        if row["topic_id"] in linked_topic_ids:
            statements.append(insert("topics", ["topic_id", "name", "topic_group"], list(row)))
    for row in conn.execute("SELECT work_id, topic_id FROM paper_topic_links ORDER BY work_id, topic_id"):
        if row["work_id"] in public_work_ids:
            statements.append(insert("paper_topics", ["work_id", "topic_id"], list(row)))

    citation_columns = [
        "citation_id", "work_id", "version_id", "primary_theme_id", "point_type",
        "title", "claim", "interpretation", "use_when", "boundary",
        "safer_formulation", "source_locator", "keywords_json",
        "evidence_excerpt_ids_json", "updated_at",
    ]
    citations = conn.execute(
        """
        SELECT l.*, w.canonical_version_id, w.title AS paper_title
        FROM lenses l
        JOIN works w ON w.work_id = l.work_id
        JOIN paper_cards pc ON pc.work_id = l.work_id
        WHERE COALESCE(pc.visibility, 'public') = 'public'
        ORDER BY l.lens_id
        """
    ).fetchall()
    for row in citations:
        evidence_ids = [
            item[0]
            for item in conn.execute(
                "SELECT excerpt_id FROM lens_excerpt_links WHERE lens_id=? ORDER BY excerpt_id",
                (row["lens_id"],),
            )
        ]
        source_locator = row["source_locator"] or " / ".join(
            dict.fromkeys(
                item[0]
                for item in conn.execute(
                    """
                    SELECT e.location
                    FROM excerpts e JOIN lens_excerpt_links lel ON lel.excerpt_id=e.excerpt_id
                    WHERE lel.lens_id=? AND COALESCE(e.location, '')<>''
                    ORDER BY e.excerpt_id
                    """,
                    (row["lens_id"],),
                )
            )
        )
        title = citation_title(row["title"], row["claim"], row["lens_type"])
        keywords = json.loads(row["keywords"] or "[]")
        values = [
            row["lens_id"], row["work_id"], row["canonical_version_id"], row["theme_id"], row["lens_type"],
            title, row["claim"], row["interpretation"], row["use_when"], row["overclaim_risk"],
            row["safer_formulation"], source_locator, json_text(keywords), json_text(evidence_ids), timestamp,
        ]
        statements.append(insert("citations", citation_columns, values))
        search_keywords = " ".join(keywords)
        statements.append(
            insert(
                "citation_fts",
                ["citation_id", "title", "claim", "interpretation", "use_when", "boundary", "safer_formulation", "keywords", "paper_title"],
                [row["lens_id"], title, row["claim"], row["interpretation"], row["use_when"], row["overclaim_risk"], row["safer_formulation"], search_keywords, row["paper_title"]],
            )
        )
        citation_topic_ids = {
            item[0]
            for item in conn.execute("SELECT topic_id FROM lens_topic_links WHERE lens_id=?", (row["lens_id"],))
        }
        citation_topic_ids.update(
            item[0]
            for item in conn.execute("SELECT topic_id FROM paper_topic_links WHERE work_id=?", (row["work_id"],))
        )
        for topic_id in sorted(citation_topic_ids & linked_topic_ids):
            statements.append(insert("citation_topics", ["citation_id", "topic_id"], [row["lens_id"], topic_id]))

    meta = {
        "paper_count": len(public_work_ids),
        "theme_count": len(linked_theme_ids),
        "topic_count": len(linked_topic_ids),
        "citation_count": len(citations),
        "generated_at": timestamp,
    }
    for key, value in meta.items():
        statements.append(insert("meta", ["key", "value"], [key, value]))
    return statements


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        migrate(conn)
        statements = build_export(conn)
    OUTPUT_PATH.write_text("\n".join(statements) + "\n", encoding="utf-8")
    print(f"Exported {len(statements)} statements to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
