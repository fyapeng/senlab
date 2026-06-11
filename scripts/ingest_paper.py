from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
PAPER_TEMPLATE_PATH = ROOT / "templates" / "paper-card.md"


@dataclass
class ExtractedMetadata:
    title: str
    authors: str
    year: int | None
    doi: str
    journal_or_series: str
    publication_status: str
    fulltext: str


def is_suspicious_title(title: str, pdf_stem: str) -> bool:
    normalized = title.strip().lower()
    if not normalized:
        return True
    if normalized == pdf_stem.strip().lower():
        return False
    signals = [
        normalized.startswith("op-"),
        normalized.endswith("..900"),
        len(re.findall(r"[A-Za-z]", normalized)) < 8,
    ]
    return any(signals)


def infer_title_and_authors_from_first_page(first_page_text: str) -> tuple[str, str]:
    lines = [line.strip() for line in first_page_text.splitlines() if line.strip()]
    if not lines:
        return "", ""

    def looks_like_name_line(line: str) -> bool:
        if any(token in line.lower() for token in ("abstract", "introduction", "jel codes")):
            return False
        parts = [p for p in re.split(r"\s+", line) if p]
        if not (2 <= len(parts) <= 5):
            return False
        alpha_parts = [p for p in parts if re.search(r"[A-Za-z]", p)]
        if len(alpha_parts) != len(parts):
            return False
        return all(re.fullmatch(r"[A-Z][A-Za-z\-\.'`]+", p) for p in alpha_parts)

    title_lines: list[str] = []
    author_lines: list[str] = []
    collecting_authors = False

    for line in lines[:30]:
        if not title_lines and len(re.findall(r"[A-Za-z]", line)) < 5:
            continue
        if collecting_authors:
            if looks_like_name_line(line):
                author_lines.append(line)
                continue
            break
        if looks_like_name_line(line) and title_lines:
            collecting_authors = True
            author_lines.append(line)
            continue
        if line.isupper() or (title_lines and len(title_lines) < 4 and len(line) <= 100):
            title_lines.append(line)
            continue
        if title_lines:
            break

    title = " ".join(title_lines).strip()
    title = re.sub(r"\s+", " ", title)
    authors = ", ".join(author_lines).strip()
    return title, authors


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "unknown"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_metadata(pdf_path: Path) -> ExtractedMetadata:
    if PdfReader is None:
        return ExtractedMetadata(
            title=pdf_path.stem,
            authors="",
            year=None,
            doi="",
            journal_or_series="",
            publication_status="TODO_VERIFY",
            fulltext="TODO_VERIFY: pypdf not available for extraction.\n",
        )

    reader = PdfReader(str(pdf_path))
    meta = reader.metadata or {}
    first_page_text = reader.pages[0].extract_text() or "" if reader.pages else ""
    inferred_title, inferred_authors = infer_title_and_authors_from_first_page(first_page_text)
    title = str(meta.get("/Title") or pdf_path.stem).strip()
    authors = str(meta.get("/Author") or "").strip()
    if is_suspicious_title(title, pdf_path.stem) and inferred_title:
        title = inferred_title
    if not authors and inferred_authors:
        authors = inferred_authors
    year = None
    for key in ("/CreationDate", "/ModDate"):
        raw = meta.get(key)
        if raw:
            match = re.search(r"(19|20)\d{2}", str(raw))
            if match:
                year = int(match.group(0))
                break
    fulltext_parts: list[str] = []
    for page in reader.pages:
        fulltext_parts.append(page.extract_text() or "")
    fulltext = "\n\n".join(fulltext_parts).strip()
    return ExtractedMetadata(
        title=title,
        authors=authors,
        year=year,
        doi="",
        journal_or_series="",
        publication_status="TODO_VERIFY",
        fulltext=fulltext,
    )


def ensure_db() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}. Run scripts/init_db.py first.")


def parse_author_slug(authors: str) -> str:
    if not authors:
        return "unknown"
    first = re.split(r",| and |\band\b|;", authors, maxsplit=1)[0]
    parts = [p for p in re.split(r"\s+", first.strip()) if p]
    return slugify(parts[-1] if parts else first)


def parse_title_keywords(title: str, limit: int = 4) -> str:
    words = re.findall(r"[A-Za-z0-9]+", title.lower())
    stop = {
        "the", "and", "of", "to", "in", "a", "an", "on", "for", "with",
        "evidence", "from", "using", "under", "into", "by",
    }
    kept = [w for w in words if w not in stop]
    return "-".join(kept[:limit]) or "paper"


def build_work_id(title: str, authors: str, year: int | None) -> str:
    author = parse_author_slug(authors)
    keywords = parse_title_keywords(title, limit=3)
    year_part = str(year) if year else "undated"
    return slugify(f"{author}-{year_part}-{keywords}")


def build_version_id(work_id: str, label: str) -> str:
    return slugify(f"{work_id}-{label}")


def detect_version_label(path: Path) -> str:
    stem = path.stem.lower()
    if "ssrn" in stem or "working" in stem or "wp" in stem:
        return "working-paper"
    if "draft" in stem:
        return "draft"
    if re.search(r"\bqje\b|\baer\b|\brestud\b|\bjole\b", stem):
        return "published"
    return "uploaded"


def copy_pdf(src: Path, work_id: str, version_id: str) -> Path:
    target_dir = ROOT / "library" / "pdfs" / work_id
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{version_id}{src.suffix.lower()}"
    shutil.copy2(src, target_path)
    return target_path


def write_fulltext(version_id: str, text: str) -> Path:
    target_dir = ROOT / "library" / "fulltext"
    target_dir.mkdir(parents=True, exist_ok=True)
    path = target_dir / f"{version_id}.md"
    path.write_text(text if text else "TODO_VERIFY: full text extraction empty.\n", encoding="utf-8")
    return path


def write_paper_card(work_id: str, version_id: str, meta: ExtractedMetadata) -> Path:
    target_dir = ROOT / "canonical" / "papers"
    target_dir.mkdir(parents=True, exist_ok=True)
    path = target_dir / f"{work_id}.md"
    if path.exists():
        return path
    template = PAPER_TEMPLATE_PATH.read_text(encoding="utf-8")
    filled = (
        template.replace("work_id:", f"work_id: {work_id}", 1)
        .replace("canonical_version_id:", f"canonical_version_id: {version_id}", 1)
        .replace("title:", f"title: {meta.title}", 1)
        .replace("authors:", f"authors: {meta.authors}", 1)
        .replace("year:", f"year: {meta.year or ''}", 1)
        .replace("publication_status:", f"publication_status: {meta.publication_status}", 1)
        .replace("journal_or_series:", f"journal_or_series: {meta.journal_or_series}", 1)
        .replace("doi:", f"doi: {meta.doi}", 1)
    )
    path.write_text(filled, encoding="utf-8")
    return path


def upsert_records(
    *,
    work_id: str,
    version_id: str,
    src: Path,
    storage_path: Path,
    fulltext_path: Path,
    card_path: Path,
    fingerprint: str,
    meta: ExtractedMetadata,
    version_label: str,
) -> None:
    now = utc_now()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO works (
                work_id, title, normalized_title, first_author, year, field, subfield,
                paper_paradigm, canonical_version_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, '', '', '', ?, ?, ?)
            ON CONFLICT(work_id) DO UPDATE SET
                title=excluded.title,
                normalized_title=excluded.normalized_title,
                first_author=excluded.first_author,
                year=COALESCE(works.year, excluded.year),
                updated_at=excluded.updated_at
            """,
            (
                work_id,
                meta.title,
                slugify(meta.title),
                parse_author_slug(meta.authors),
                meta.year,
                version_id,
                now,
                now,
            ),
        )
        conn.execute(
            """
            INSERT INTO paper_versions (
                version_id, work_id, source_filename, storage_path, fulltext_path,
                fingerprint_sha256, publication_status, journal_or_series, doi,
                version_label, is_canonical, supersedes_version_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NULL, ?, ?)
            ON CONFLICT(version_id) DO UPDATE SET
                storage_path=excluded.storage_path,
                fulltext_path=excluded.fulltext_path,
                publication_status=excluded.publication_status,
                journal_or_series=excluded.journal_or_series,
                doi=excluded.doi,
                updated_at=excluded.updated_at
            """,
            (
                version_id,
                work_id,
                src.name,
                str(storage_path),
                str(fulltext_path),
                fingerprint,
                meta.publication_status,
                meta.journal_or_series,
                meta.doi,
                version_label,
                now,
                now,
            ),
        )
        conn.execute(
            """
            INSERT INTO paper_cards (
                work_id, markdown_path, title, authors, year, publication_status,
                journal_or_series, doi, field, subfield, paper_paradigm,
                research_question, why_it_matters, core_object, approach, main_claim,
                why_in_my_db, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', ?)
            ON CONFLICT(work_id) DO UPDATE SET
                markdown_path=excluded.markdown_path,
                title=excluded.title,
                authors=excluded.authors,
                year=COALESCE(paper_cards.year, excluded.year),
                publication_status=excluded.publication_status,
                journal_or_series=excluded.journal_or_series,
                doi=excluded.doi,
                updated_at=excluded.updated_at
            """,
            (
                work_id,
                str(card_path),
                meta.title,
                meta.authors,
                meta.year,
                meta.publication_status,
                meta.journal_or_series,
                meta.doi,
                now,
            ),
        )
        conn.execute(
            """
            INSERT INTO ratings (
                work_id, dao, fa, shi, shu, qi, subjective,
                dao_note, fa_note, shi_note, shu_note, qi_note, subjective_note,
                one_line_judgment, updated_at
            )
            VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, '', '', '', '', '', '', '', ?)
            ON CONFLICT(work_id) DO NOTHING
            """,
            (work_id, now),
        )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Ingest a paper PDF into the SenLab workspace.")
    parser.add_argument("pdf_path", help="Path to the source PDF")
    parser.add_argument("--work-id", dest="work_id", help="Override generated work_id")
    parser.add_argument("--version-label", dest="version_label", help="Override version label")
    return parser


def main() -> None:
    ensure_db()
    args = build_parser().parse_args()
    src = Path(args.pdf_path)
    if not src.exists():
        raise SystemExit(f"PDF not found: {src}")

    fingerprint = sha256_file(src)
    meta = extract_metadata(src)
    work_id = args.work_id or build_work_id(meta.title, meta.authors, meta.year)
    version_label = args.version_label or detect_version_label(src)
    version_id = build_version_id(work_id, version_label)

    storage_path = copy_pdf(src, work_id, version_id)
    fulltext_path = write_fulltext(version_id, meta.fulltext)
    card_path = write_paper_card(work_id, version_id, meta)
    upsert_records(
        work_id=work_id,
        version_id=version_id,
        src=src,
        storage_path=storage_path,
        fulltext_path=fulltext_path,
        card_path=card_path,
        fingerprint=fingerprint,
        meta=meta,
        version_label=version_label,
    )

    print(f"work_id={work_id}")
    print(f"version_id={version_id}")
    print(f"pdf={storage_path}")
    print(f"fulltext={fulltext_path}")
    print(f"paper_card={card_path}")


if __name__ == "__main__":
    main()
