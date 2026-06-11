from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable


def run(script_name: str) -> None:
    subprocess.run([PYTHON, str(ROOT / "scripts" / script_name)], check=True)


def main() -> None:
    run("init_db.py")
    run("seed_demo_content.py")
    run("export_web_data.py")
    print("Built SenLab demo artifacts.")


if __name__ == "__main__":
    main()
