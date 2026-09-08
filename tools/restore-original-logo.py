"""Restore original logo PNGs and keep header/footer logos image-based."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HEADER_RE = re.compile(
    r'<a class="logo"[^>]*>[\s\S]*?</a>',
    re.IGNORECASE,
)


def is_ar(path: Path) -> bool:
    return "ar" in path.parts


def prefix(path: Path) -> str:
    return "../" if is_ar(path) else ""


def header_logo(path: Path) -> str:
    p = prefix(path)
    if is_ar(path):
        return (
            f'<a class="logo" href="index.html" aria-label="الصفحة الرئيسية لشركة إمبيريال سولووشن">\n'
            f'            <img\n'
            f'              src="{p}assets/logo/logo.png?v=6"\n'
            f'              alt="شركة إمبيريال سولووشن (ISC)"\n'
            f'              width="180"\n'
            f'              height="56"\n'
            f'            />\n'
            f'          </a>'
        )
    return (
        f'<a class="logo" href="index.html" aria-label="Imperial Solution Company home">\n'
        f'            <img\n'
        f'              src="{p}assets/logo/logo.png?v=6"\n'
        f'              alt="Imperial Solution Company (ISC)"\n'
        f'              width="180"\n'
        f'              height="56"\n'
        f'            />\n'
        f'          </a>'
    )


def footer_logo(path: Path) -> str:
    p = prefix(path)
    if is_ar(path):
        return (
            f'<a class="logo" href="index.html" aria-label="ISC">\n'
            f'                <img\n'
            f'                  src="{p}assets/logo/logo_dark_background.png?v=6"\n'
            f'                  alt="شركة إمبيريال سولووشن"\n'
            f'                  width="160"\n'
            f'                  height="50"\n'
            f'                />\n'
            f'              </a>'
        )
    return (
        f'<a class="logo" href="index.html" aria-label="ISC home">\n'
        f'                <img\n'
        f'                  src="{p}assets/logo/logo_dark_background.png?v=6"\n'
        f'                  alt="Imperial Solution Company"\n'
        f'                  width="160"\n'
        f'                  height="50"\n'
        f'                />\n'
        f'              </a>'
    )


def replace_header(html: str, path: Path) -> str:
    m = re.search(r"<header[\s\S]*?</header>", html, re.IGNORECASE)
    if not m:
        return html
    header = m.group(0)
    logo_m = HEADER_RE.search(header)
    if not logo_m:
        return html
    new_header = header[: logo_m.start()] + header_logo(path) + header[logo_m.end() :]
    return html[: m.start()] + new_header + html[m.end() :]


def replace_footer(html: str, path: Path) -> str:
    m = re.search(r"<footer[\s\S]*?</footer>", html, re.IGNORECASE)
    if not m:
        return html
    footer = m.group(0)
    brand_m = re.search(
        r'(<div class="footer__brand">\s*)(<a class="logo"[^>]*>[\s\S]*?</a>)',
        footer,
        re.IGNORECASE,
    )
    if not brand_m:
        return html
    new_footer = footer[: brand_m.start(2)] + footer_logo(path) + footer[brand_m.end(2) :]
    return html[: m.start()] + new_footer + html[m.end() :]


def bump_css(html: str) -> str:
    return re.sub(r"main\.css\?v=[^\"]+", "main.css?v=logoOrig1", html)


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        original = path.read_text(encoding="utf-8")
        updated = replace_header(original, path)
        updated = replace_footer(updated, path)
        updated = bump_css(updated)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            n += 1
    print(f"updated {n} html files")


if __name__ == "__main__":
    main()
