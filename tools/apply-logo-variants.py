"""Wire best logo variants: full lockup header/footer, symbol favicon + mobile."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def bump_cache(html: str) -> str:
    html = html.replace("favicon.png?v=3", "favicon.png?v=4")
    html = html.replace("favicon.ico?v=3", "favicon.ico?v=4")
    html = html.replace(
        'rel="apple-touch-icon" href="assets/logo/favicon.png?v=4"',
        'rel="apple-touch-icon" href="assets/logo/apple-touch-icon.png?v=4"',
    )
    html = html.replace(
        'rel="apple-touch-icon" href="../assets/logo/favicon.png?v=4"',
        'rel="apple-touch-icon" href="../assets/logo/apple-touch-icon.png?v=4"',
    )
    html = html.replace("main.css?v=hero80", "main.css?v=logo4")
    return html


def make_picture(prefix: str, width: str, height: str, alt: str) -> str:
    return (
        "<picture>\n"
        f'              <source media="(max-width: 480px)" srcset="{prefix}assets/logo/symbol.png?v=4" />\n'
        "              <img\n"
        f'                src="{prefix}assets/logo/logo.png?v=4"\n'
        f'                alt="{alt}"\n'
        f'                width="{width}"\n'
        f'                height="{height}"\n'
        "              />\n"
        "            </picture>"
    )


def update_header_logo(html: str) -> str:
    if "site-header" not in html or "assets/logo/logo.png" not in html:
        return html

    m = re.search(
        r'(<header[\s\S]*?<a class="logo"[^>]*>\s*)'
        r'(?:<picture>[\s\S]*?</picture>|<img\b[^>]*src="(\.\./)?assets/logo/logo\.png[^"]*"[^>]*/?>)',
        html,
        re.IGNORECASE,
    )
    if not m:
        return html

    block = m.group(0)
    alt_m = re.search(r'alt="([^"]*)"', block)
    w_m = re.search(r'width="(\d+)"', block)
    h_m = re.search(r'height="(\d+)"', block)
    alt = alt_m.group(1) if alt_m else "Imperial Solution Company (ISC)"
    width = w_m.group(1) if w_m else "180"
    height = h_m.group(1) if h_m else "56"
    prefix = "../" if "../assets/logo/logo.png" in block else ""
    return (
        html[: m.start()]
        + m.group(1)
        + make_picture(prefix, width, height, alt)
        + html[m.end() :]
    )


def bump_footer_logo(html: str) -> str:
    html = html.replace("logo_dark_background.png?v=2", "logo_dark_background.png?v=4")
    html = html.replace('logo_dark_background.png"', 'logo_dark_background.png?v=4"')
    html = html.replace("logo_dark_background.png?v=4?v=4", "logo_dark_background.png?v=4")
    return html


def main() -> None:
    cache_n = 0
    logo_n = 0
    for path in ROOT.rglob("*.html"):
        original = path.read_text(encoding="utf-8")
        updated = bump_cache(original)
        updated = update_header_logo(updated)
        updated = bump_footer_logo(updated)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            if bump_cache(original) != original:
                cache_n += 1
            logo_n += 1
    print(f"updated {logo_n} html files (cache bumps ~{cache_n})")


if __name__ == "__main__":
    main()
