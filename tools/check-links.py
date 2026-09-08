#!/usr/bin/env python3
"""Scan HTML for broken local href/src references."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATTR = re.compile(r"""(?:href|src)=["']([^"'#?]+)""", re.I)
SKIP = ("http://", "https://", "mailto:", "tel:", "data:", "//")


def main() -> None:
    html_files = list(ROOT.glob("*.html")) + list(ROOT.glob("ar/*.html"))
    broken: list[tuple[str, str]] = []
    for f in html_files:
        text = f.read_text(encoding="utf-8", errors="replace")
        for match in ATTR.finditer(text):
            url = match.group(1)
            if url.startswith(SKIP):
                continue
            target = (f.parent / url).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                continue
            if not target.exists():
                broken.append((str(f.relative_to(ROOT)), url))
    print(f"BROKEN {len(broken)}")
    for path, url in broken:
        print(f"{path} -> {url}")


if __name__ == "__main__":
    main()
