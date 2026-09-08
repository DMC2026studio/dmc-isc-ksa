#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
files = list(ROOT.glob("*.html")) + list(ROOT.glob("ar/*.html"))

for f in files:
    text = f.read_text(encoding="utf-8")
    is_ar = f.parent.name == "ar"
    icon = "../assets/logo/favicon.png?v=isc" if is_ar else "assets/logo/favicon.png?v=isc"
    ico = "../favicon.ico?v=isc" if is_ar else "favicon.ico?v=isc"
    replacement = (
        f'<link rel="icon" href="{icon}" type="image/png" sizes="any" />\n'
        f'    <link rel="shortcut icon" href="{ico}" />\n'
        f'    <link rel="apple-touch-icon" href="{icon}" />'
    )
    new, n = re.subn(r'<link rel="icon"[^>]*>', replacement, text, count=1)
    if n:
        f.write_text(new, encoding="utf-8")
        print("updated", f.relative_to(ROOT))
    else:
        print("NO CHANGE", f.relative_to(ROOT))
