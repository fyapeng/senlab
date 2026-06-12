from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from senlab_markdown import (
    compact_text,
    extract_list_items,
    extract_score_and_note,
    load_text,
    parse_frontmatter_and_body,
    parse_heading_sections,
)


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sync_papers(conn: sqlite3.Connection) -> None:
    timestamp = now()
    for path in sorted((ROOT / "canonical" / "papers").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        sections = parse_heading_sections(body)
        work_id = fm["work_id"]
        title = fm.get("title", "")
        conn.execute(
            """
            UPDATE works
            SET title=?, year=?, field=?, subfield=?, paper_paradigm=?, canonical_version_id=?, updated_at=?
            WHERE work_id=?
            """,
            (
                title,
                fm.get("year"),
                fm.get("field", ""),
                fm.get("subfield", ""),
                fm.get("paper_paradigm", ""),
                fm.get("canonical_version_id", ""),
                timestamp,
                work_id,
            ),
        )
        conn.execute(
            """
            INSERT INTO paper_cards (
                work_id, markdown_path, title, authors, year, publication_status,
                journal_or_series, doi, field, subfield, paper_paradigm,
                research_question, why_it_matters, core_object, approach, main_claim,
                why_in_my_db, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(work_id) DO UPDATE SET
                markdown_path=excluded.markdown_path,
                title=excluded.title,
                authors=excluded.authors,
                year=excluded.year,
                publication_status=excluded.publication_status,
                journal_or_series=excluded.journal_or_series,
                doi=excluded.doi,
                field=excluded.field,
                subfield=excluded.subfield,
                paper_paradigm=excluded.paper_paradigm,
                research_question=excluded.research_question,
                why_it_matters=excluded.why_it_matters,
                core_object=excluded.core_object,
                approach=excluded.approach,
                main_claim=excluded.main_claim,
                why_in_my_db=excluded.why_in_my_db,
                updated_at=excluded.updated_at
            """,
            (
                work_id,
                str(path),
                title,
                fm.get("authors", ""),
                fm.get("year"),
                fm.get("publication_status", ""),
                fm.get("journal_or_series", ""),
                fm.get("doi", ""),
                fm.get("field", ""),
                fm.get("subfield", ""),
                fm.get("paper_paradigm", ""),
                compact_text(sections.get("Research Question", "")),
                compact_text(sections.get("Why It Matters", "")),
                compact_text(sections.get("Core Object", "")),
                compact_text(sections.get("Approach", "")),
                compact_text(sections.get("Main Claim", "")),
                compact_text(sections.get("Why In My Database", "")),
                timestamp,
            ),
        )

        dao, dao_note = extract_score_and_note(sections.get("Dao", ""))
        fa, fa_note = extract_score_and_note(sections.get("Fa", ""))
        shi, shi_note = extract_score_and_note(sections.get("Shi", ""))
        shu, shu_note = extract_score_and_note(sections.get("Shu", ""))
        qi, qi_note = extract_score_and_note(sections.get("Qi", ""))
        subjective, subjective_note = extract_score_and_note(sections.get("Subjective", ""))
        conn.execute(
            """
            INSERT INTO ratings (
                work_id, dao, fa, shi, shu, qi, subjective,
                dao_note, fa_note, shi_note, shu_note, qi_note, subjective_note,
                one_line_judgment, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(work_id) DO UPDATE SET
                dao=excluded.dao,
                fa=excluded.fa,
                shi=excluded.shi,
                shu=excluded.shu,
                qi=excluded.qi,
                subjective=excluded.subjective,
                dao_note=excluded.dao_note,
                fa_note=excluded.fa_note,
                shi_note=excluded.shi_note,
                shu_note=excluded.shu_note,
                qi_note=excluded.qi_note,
                subjective_note=excluded.subjective_note,
                one_line_judgment=excluded.one_line_judgment,
                updated_at=excluded.updated_at
            """,
            (
                work_id,
                dao,
                fa,
                shi,
                shu,
                qi,
                subjective,
                dao_note,
                fa_note,
                shi_note,
                shu_note,
                qi_note,
                subjective_note,
                compact_text(sections.get("One-Line Judgment", "")),
                timestamp,
            ),
        )
        conn.execute("DELETE FROM paper_theme_links WHERE work_id=?", (work_id,))
        for theme_id in extract_list_items(sections.get("Theme Links", "")):
            conn.execute(
                "INSERT OR REPLACE INTO paper_theme_links (work_id, theme_id) VALUES (?, ?)",
                (work_id, theme_id),
            )


def sync_excerpts(conn: sqlite3.Connection) -> None:
    timestamp = now()
    for path in sorted((ROOT / "canonical" / "excerpts").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        sections = parse_heading_sections(body)
        conn.execute(
            """
            INSERT OR REPLACE INTO excerpts (
                excerpt_id, work_id, version_id, markdown_path, location, topic, status,
                quote_or_paraphrase, why_this_matters, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                fm["excerpt_id"],
                fm["work_id"],
                fm["version_id"],
                str(path),
                fm.get("location", "") or compact_text(sections.get("Location", "")),
                fm.get("topic", ""),
                fm.get("status", ""),
                compact_text(sections.get("Quote Or Paraphrase", "")),
                compact_text(sections.get("Why This Matters", "")),
                timestamp,
            ),
        )


def sync_lenses(conn: sqlite3.Connection) -> None:
    timestamp = now()
    for path in sorted((ROOT / "canonical" / "lenses").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        sections = parse_heading_sections(body)
        lens_id = fm["lens_id"]
        conn.execute(
            """
            INSERT OR REPLACE INTO lenses (
                lens_id, work_id, theme_id, markdown_path, lens_type, claim, interpretation,
                overclaim_risk, safer_formulation, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                lens_id,
                fm["work_id"],
                fm.get("theme_id", ""),
                str(path),
                fm.get("lens_type", ""),
                compact_text(sections.get("Claim I Want To Support", "")) or compact_text(sections.get("Claim I Want to Use", "")),
                compact_text(sections.get("My Interpretation", "")) or compact_text(sections.get("Why I Am Using This Paper Here", "")),
                compact_text(sections.get("Overclaim Risk", "")),
                compact_text(sections.get("Safer Formulation", "")),
                timestamp,
            ),
        )
        conn.execute("DELETE FROM lens_excerpt_links WHERE lens_id=?", (lens_id,))
        evidence_text = compact_text(sections.get("Evidence Excerpts", ""))
        if evidence_text:
            for excerpt_id in [item.strip() for item in evidence_text.split(",") if item.strip()]:
                conn.execute(
                    "INSERT OR REPLACE INTO lens_excerpt_links (lens_id, excerpt_id) VALUES (?, ?)",
                    (lens_id, excerpt_id),
                )


def sync_themes(conn: sqlite3.Connection) -> None:
    timestamp = now()
    for path in sorted((ROOT / "canonical" / "themes").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        conn.execute(
            """
            INSERT OR REPLACE INTO themes (theme_id, markdown_path, name, field, status, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                fm["theme_id"],
                str(path),
                fm.get("name", ""),
                fm.get("field", ""),
                fm.get("status", ""),
                timestamp,
            ),
        )


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}")
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        sync_papers(conn)
        sync_excerpts(conn)
        sync_lenses(conn)
        sync_themes(conn)
        conn.commit()
    print("Synchronized canonical markdown content into SQLite.")


if __name__ == "__main__":
    main()
