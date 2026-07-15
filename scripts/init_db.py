from __future__ import annotations

import sqlite3
from pathlib import Path

from migrate_db import migrate


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"
def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        migrate(conn)
    print(f"Initialized database at {DB_PATH}")


if __name__ == "__main__":
    main()
