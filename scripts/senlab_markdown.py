from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import yaml


def load_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter_and_body(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---"):
        return {}, text
    match = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if not match:
        return {}, text
    raw_frontmatter = match.group(1)
    try:
        frontmatter = yaml.safe_load(raw_frontmatter) or {}
    except yaml.YAMLError:
        frontmatter = parse_loose_frontmatter(raw_frontmatter)
    body = match.group(2)
    return frontmatter, body


def parse_loose_frontmatter(raw_frontmatter: str) -> dict[str, Any]:
    data: dict[str, Any] = {}
    for line in raw_frontmatter.splitlines():
        if not line.strip() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            items = [item.strip().strip("'\"") for item in value[1:-1].split(",") if item.strip()]
            data[key] = items
        elif value.isdigit():
            data[key] = int(value)
        else:
            data[key] = value.strip("'\"")
    return data


def parse_heading_sections(body: str) -> dict[str, str]:
    sections: dict[str, list[str]] = {}
    current_heading: str | None = None
    for line in body.splitlines():
        heading_match = re.match(r"^(##|###|####)\s+(.*)$", line.strip())
        if heading_match:
            current_heading = heading_match.group(2).strip()
            sections.setdefault(current_heading, [])
            continue
        if current_heading is not None:
            sections[current_heading].append(line)
    return {key: "\n".join(value).strip() for key, value in sections.items()}


def extract_list_items(section_text: str) -> list[str]:
    items: list[str] = []
    for line in section_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            items.append(stripped[2:].strip().strip("`"))
    return items


def extract_score_and_note(section_text: str) -> tuple[int | None, str]:
    score = None
    note = ""
    for line in section_text.splitlines():
        stripped = line.strip()
        if stripped.lower().startswith("- score:"):
            raw = stripped.split(":", 1)[1].strip()
            score = int(raw) if raw.isdigit() else None
        elif stripped.lower().startswith("- note:"):
            note = stripped.split(":", 1)[1].strip()
    return score, note


def compact_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()
