from __future__ import annotations

import json
import re
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
from migrate_db import migrate


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
TOPIC_ALIASES_PATH = ROOT / "config" / "topic-aliases.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _first_author(authors: str) -> str:
    if not authors:
        return ""
    first = re.split(r",| and |\band\b", authors, maxsplit=1)[0]
    parts = first.strip().split()
    return parts[-1].lower() if parts else ""


def _slug(value: str) -> str:
    value = value.strip().lower().replace("_", " ")
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", value).strip("-")


def _topic_aliases() -> dict[str, str]:
    if not TOPIC_ALIASES_PATH.exists():
        return {}
    payload = json.loads(TOPIC_ALIASES_PATH.read_text(encoding="utf-8"))
    return {_slug(alias): _slug(topic_id) for alias, topic_id in payload.items()}


def _normalize_topic(value: str, aliases: dict[str, str]) -> str:
    topic_id = _slug(value)
    return aliases.get(topic_id, topic_id)


def _keyword_items(value: str) -> list[str]:
    items = extract_list_items(value)
    if items:
        return items
    return [item.strip() for item in re.split(r"[,，;；\n]+", compact_text(value)) if item.strip()]


def _sync_topics(
    conn: sqlite3.Connection,
    work_id: str,
    tags: list | None,
    timestamp: str,
    aliases: dict[str, str],
) -> None:
    conn.execute("DELETE FROM paper_topic_links WHERE work_id=?", (work_id,))
    seen: set[str] = set()
    for raw_tag in tags or []:
        topic_id = _normalize_topic(str(raw_tag), aliases)
        if not topic_id or topic_id in seen:
            continue
        seen.add(topic_id)
        conn.execute(
            """
            INSERT INTO topics (topic_id, name, topic_group, created_at, updated_at)
            VALUES (?, ?, '', ?, ?)
            ON CONFLICT(topic_id) DO UPDATE SET updated_at=excluded.updated_at
            """,
            (topic_id, topic_id.replace("-", " "), timestamp, timestamp),
        )
        conn.execute(
            "INSERT OR REPLACE INTO paper_topic_links (work_id, topic_id) VALUES (?, ?)",
            (work_id, topic_id),
        )


def sync_papers(conn: sqlite3.Connection) -> None:
    timestamp = now()
    aliases = _topic_aliases()
    for path in sorted((ROOT / "canonical" / "papers").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        sections = parse_heading_sections(body)
        work_id = fm["work_id"]
        title = fm.get("title", "")
        conn.execute(
            """
            INSERT INTO works (
                work_id, title, normalized_title, first_author, year, field, subfield,
                paper_paradigm, canonical_version_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(work_id) DO UPDATE SET
                title=excluded.title,
                normalized_title=excluded.normalized_title,
                first_author=excluded.first_author,
                year=excluded.year,
                field=excluded.field,
                subfield=excluded.subfield,
                paper_paradigm=excluded.paper_paradigm,
                canonical_version_id=excluded.canonical_version_id,
                updated_at=excluded.updated_at
            """,
            (
                work_id,
                title,
                title.lower().strip(),
                _first_author(fm.get("authors", "")),
                fm.get("year"),
                fm.get("field", ""),
                fm.get("subfield", ""),
                fm.get("paper_paradigm", ""),
                fm.get("canonical_version_id", ""),
                timestamp,
                timestamp,
            ),
        )
        conn.execute(
            """
            INSERT INTO paper_cards (
                work_id, markdown_path, title, authors, year, publication_status,
                journal_or_series, doi, field, subfield, paper_paradigm,
                research_question, why_it_matters, core_object, approach, main_claim,
                why_in_my_db, visibility, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                visibility=excluded.visibility,
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
                fm.get("visibility", "public"),
                timestamp,
            ),
        )

        canonical_version_id = fm.get("canonical_version_id", "")
        if canonical_version_id:
            conn.execute(
                """
                UPDATE paper_versions
                SET publication_status=?, journal_or_series=?, doi=?,
                    is_canonical=1, updated_at=?
                WHERE version_id=? AND work_id=?
                """,
                (
                    fm.get("publication_status", ""),
                    fm.get("journal_or_series", ""),
                    fm.get("doi", ""),
                    timestamp,
                    canonical_version_id,
                    work_id,
                ),
            )

        _sync_topics(conn, work_id, fm.get("tags"), timestamp, aliases)

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
    aliases = _topic_aliases()
    for path in sorted((ROOT / "canonical" / "lenses").glob("*.md")):
        text = load_text(path)
        fm, body = parse_frontmatter_and_body(text)
        sections = parse_heading_sections(body)
        lens_id = fm["lens_id"]
        keyword_items = _keyword_items(sections.get("Keywords", ""))
        conn.execute(
            """
            INSERT OR REPLACE INTO lenses (
                lens_id, work_id, theme_id, markdown_path, lens_type, title, claim,
                interpretation, use_when, overclaim_risk, safer_formulation,
                source_locator, keywords, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                lens_id,
                fm["work_id"],
                fm.get("theme_id", ""),
                str(path),
                fm.get("lens_type", ""),
                compact_text(sections.get("Citation Point Title", "")),
                compact_text(sections.get("Claim I Want To Support", "")) or compact_text(sections.get("Claim I Want to Use", "")),
                compact_text(sections.get("My Interpretation", "")) or compact_text(sections.get("Why I Am Using This Paper Here", "")),
                compact_text(sections.get("Use When", "")) or compact_text(sections.get("Why I Am Using This Paper Here", "")),
                compact_text(sections.get("Overclaim Risk", "")),
                compact_text(sections.get("Safer Formulation", "")),
                compact_text(sections.get("Source Locator", "")),
                json.dumps(keyword_items, ensure_ascii=False),
                timestamp,
            ),
        )
        conn.execute("DELETE FROM lens_excerpt_links WHERE lens_id=?", (lens_id,))
        evidence_text = compact_text(sections.get("Evidence Excerpts", ""))
        if evidence_text:
            evidence_ids = re.findall(r"[a-z0-9][a-z0-9-]*-ex-\d+", evidence_text.lower())
            for excerpt_id in dict.fromkeys(evidence_ids):
                conn.execute(
                    "INSERT OR REPLACE INTO lens_excerpt_links (lens_id, excerpt_id) VALUES (?, ?)",
                    (lens_id, excerpt_id),
                )
        conn.execute("DELETE FROM lens_topic_links WHERE lens_id=?", (lens_id,))
        if not keyword_items:
            keyword_items = [fm.get("lens_type", "")]
        for keyword in keyword_items:
            topic_id = _normalize_topic(str(keyword), aliases)
            if not topic_id:
                continue
            conn.execute(
                """
                INSERT INTO topics (topic_id, name, topic_group, created_at, updated_at)
                VALUES (?, ?, '', ?, ?)
                ON CONFLICT(topic_id) DO UPDATE SET updated_at=excluded.updated_at
                """,
                (topic_id, topic_id.replace("-", " "), timestamp, timestamp),
            )
            conn.execute(
                "INSERT OR REPLACE INTO lens_topic_links (lens_id, topic_id) VALUES (?, ?)",
                (lens_id, topic_id),
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
        migrate(conn)
        sync_papers(conn)
        sync_excerpts(conn)
        sync_lenses(conn)
        sync_themes(conn)
        conn.commit()
    print("Synchronized canonical markdown content into SQLite.")


if __name__ == "__main__":
    main()
