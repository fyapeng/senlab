#!/usr/bin/env python3
"""Batch ingest all PDFs from a source directory into the SenLab library.

Parses filenames in the format:
    wNsM.Title (Author et al., Year).pdf
    wNsM.Title (Author & Author, Year).pdf
    wNsM.Title (Author, Year).pdf
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

# Add scripts dir to path for ingest_paper imports
sys.path.insert(0, str(Path(__file__).parent))
from ingest_paper import (
    build_version_id,
    build_work_id,
    copy_pdf,
    detect_version_label,
    ensure_db,
    extract_metadata,
    find_existing_fingerprint,
    parse_title_keywords,
    sha256_file,
    slugify,
    upsert_records,
    write_fulltext,
    write_paper_card,
)


def parse_filename(stem: str) -> tuple[str | None, str | None, int | None]:
    """Parse 'wNsM.Title (Author ..., Year)' stem.

    Returns (title, first_author_last, year) or (None, None, None) on failure.
    """
    m = re.match(r"^w\d+s\d+\.(.*)", stem)
    if not m:
        return None, None, None
    rest = m.group(1)
    m2 = re.search(r"^(.*?)\s*\(([^()]+),\s*(\d{4})\)\s*$", rest)
    if not m2:
        return None, None, None
    title = m2.group(1).strip().replace("：", ": ").replace("？", "? ")
    author_part = m2.group(2).strip()
    year = int(m2.group(3))
    # First word of author part = first author's last name
    first_author = re.split(r"[\s&]", author_part)[0].rstrip(".,")
    return title, first_author, year


def ingest_one(src: Path, dry_run: bool = False) -> str:
    """Ingest a single PDF. Returns a status string."""
    fingerprint = sha256_file(src)
    duplicate = find_existing_fingerprint(fingerprint)
    if duplicate:
        version_id, work_id = duplicate
        return f"SKIP (already ingested as {work_id})"

    fname_title, fname_author, fname_year = parse_filename(src.stem)

    meta = extract_metadata(src)

    # Override title with filename-parsed value when available and better
    if fname_title:
        meta.title = fname_title
    # Override year with filename-parsed value when available and better
    if fname_year and (not meta.year or meta.year < 1900 or meta.year > 2030):
        meta.year = fname_year
    elif fname_year:
        meta.year = fname_year  # filename year is authoritative

    # Build work_id from filename-parsed author/year for clean, predictable IDs
    if fname_author and fname_year:
        work_id = build_work_id(meta.title, fname_author, fname_year)
    else:
        work_id = build_work_id(meta.title, meta.authors, meta.year)

    version_label = detect_version_label(src)
    version_id = build_version_id(work_id, version_label)

    if dry_run:
        return f"DRY-RUN work_id={work_id}  title={meta.title!r}  year={meta.year}  author={fname_author}"

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
    return f"OK  work_id={work_id}  card={card_path.name}"


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Batch-ingest PDFs into SenLab.")
    parser.add_argument("source_dir", help="Directory containing PDF files")
    parser.add_argument("--dry-run", action="store_true", help="Parse only, do not write")
    args = parser.parse_args()

    src_dir = Path(args.source_dir)
    if not src_dir.is_dir():
        raise SystemExit(f"Not a directory: {src_dir}")

    if not args.dry_run:
        ensure_db()

    pdfs = sorted(src_dir.glob("*.pdf"))
    if not pdfs:
        raise SystemExit(f"No PDF files found in {src_dir}")

    print(f"Found {len(pdfs)} PDF(s) in {src_dir}\n")
    ok = skip = fail = 0
    for pdf in pdfs:
        display_name = pdf.name[:60].encode("ascii", errors="replace").decode("ascii")
        try:
            status = ingest_one(pdf, dry_run=args.dry_run)
            tag = status.split()[0]
            if tag in ("OK", "DRY-RUN"):
                ok += 1
            elif tag == "SKIP":
                skip += 1
            print(f"  {display_name:<60}  {status}")
        except Exception as exc:
            fail += 1
            print(f"  {display_name:<60}  ERROR: {exc}")

    print(f"\nDone: {ok} ingested, {skip} skipped (duplicate), {fail} errors.")


if __name__ == "__main__":
    main()
