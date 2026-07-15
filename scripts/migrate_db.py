from __future__ import annotations

import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
SCHEMA_PATH = ROOT / "data" / "schema.sql"


def _columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}


def _add_column(conn: sqlite3.Connection, table: str, definition: str) -> None:
    name = definition.split()[0]
    if name not in _columns(conn, table):
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {definition}")


def migrate(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    _add_column(conn, "paper_cards", "visibility TEXT NOT NULL DEFAULT 'public'")
    _add_column(conn, "lenses", "title TEXT")
    _add_column(conn, "lenses", "use_when TEXT")
    _add_column(conn, "lenses", "source_locator TEXT")
    _add_column(conn, "lenses", "keywords TEXT")
    conn.executescript(
        """
        CREATE INDEX IF NOT EXISTS idx_paper_cards_visibility ON paper_cards(visibility);
        CREATE INDEX IF NOT EXISTS idx_paper_theme_theme ON paper_theme_links(theme_id);
        CREATE INDEX IF NOT EXISTS idx_paper_topic_topic ON paper_topic_links(topic_id);
        CREATE INDEX IF NOT EXISTS idx_lenses_work_type ON lenses(work_id, lens_type);
        CREATE INDEX IF NOT EXISTS idx_lenses_theme ON lenses(theme_id);
        CREATE INDEX IF NOT EXISTS idx_lens_topic_topic ON lens_topic_links(topic_id);
        """
    )


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        migrate(conn)
    print(f"Migrated database at {DB_PATH}")


if __name__ == "__main__":
    main()
