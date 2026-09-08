"""Replace stacked logo PNG with inline symbol + one-line wordmark in headers/footers."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EN_HEADER = """<a class="logo" href="{home}" aria-label="Imperial Solution Company home">
            <img class="logo__mark" src="{prefix}assets/logo/symbol.png?v=5" alt="" width="44" height="44" />
            <span class="logo__text">
              <span class="logo__name">Imperial Solution Company</span>
              <span class="logo__name-ar" lang="ar" dir="rtl">شركة إمبيريال سولووشن</span>
            </span>
          </a>"""

AR_HEADER = """<a class="logo" href="{home}" aria-label="الصفحة الرئيسية لشركة إمبيريال سولووشن">
            <img class="logo__mark" src="{prefix}assets/logo/symbol.png?v=5" alt="" width="44" height="44" />
            <span class="logo__text">
              <span class="logo__name">Imperial Solution Company</span>
              <span class="logo__name-ar" lang="ar" dir="rtl">شركة إمبيريال سولووشن</span>
            </span>
          </a>"""

EN_FOOTER = """<a class="logo" href="{home}" aria-label="ISC home">
                <img class="logo__mark" src="{prefix}assets/logo/symbol.png?v=5" alt="" width="40" height="40" />
                <span class="logo__text">
                  <span class="logo__name">Imperial Solution Company</span>
                  <span class="logo__name-ar" lang="ar" dir="rtl">شركة إمبيريال سولووشن</span>
                </span>
              </a>"""

AR_FOOTER = """<a class="logo" href="{home}" aria-label="ISC">
                <img class="logo__mark" src="{prefix}assets/logo/symbol.png?v=5" alt="" width="40" height="40" />
                <span class="logo__text">
                  <span class="logo__name">Imperial Solution Company</span>
                  <span class="logo__name-ar" lang="ar" dir="rtl">شركة إمبيريال سولووشن</span>
                </span>
              </a>"""

HEADER_RE = re.compile(
    r'<a class="logo"[^>]*>[\s\S]*?</a>',
    re.IGNORECASE,
)


def is_ar(path: Path) -> bool:
    return "ar" in path.parts


def prefix_for(path: Path) -> str:
    return "../" if is_ar(path) else ""


def home_for(path: Path, *, footer: bool = False) -> str:
    return "index.html"


def replace_in_header(html: str, path: Path) -> str:
    m = re.search(r"<header[\s\S]*?</header>", html, re.IGNORECASE)
    if not m:
        return html
    header = m.group(0)
    logo_m = HEADER_RE.search(header)
    if not logo_m:
        return html
    tpl = AR_HEADER if is_ar(path) else EN_HEADER
    new_logo = tpl.format(home=home_for(path), prefix=prefix_for(path))
    new_header = header[: logo_m.start()] + new_logo + header[logo_m.end() :]
    return html[: m.start()] + new_header + html[m.end() :]


def replace_in_footer(html: str, path: Path) -> str:
    m = re.search(r"<footer[\s\S]*?</footer>", html, re.IGNORECASE)
    if not m:
        return html
    footer = m.group(0)
    # Only replace brand logo inside footer__brand if present
    brand_m = re.search(
        r'(<div class="footer__brand">\s*)(<a class="logo"[^>]*>[\s\S]*?</a>)',
        footer,
        re.IGNORECASE,
    )
    if not brand_m:
        return html
    tpl = AR_FOOTER if is_ar(path) else EN_FOOTER
    new_logo = tpl.format(home=home_for(path, footer=True), prefix=prefix_for(path))
    new_footer = (
        footer[: brand_m.start(2)] + new_logo + footer[brand_m.end(2) :]
    )
    return html[: m.start()] + new_footer + html[m.end() :]


def bump_css(html: str) -> str:
    return re.sub(r"main\.css\?v=[^\"]+", "main.css?v=logoLine1", html)


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        original = path.read_text(encoding="utf-8")
        updated = replace_in_header(original, path)
        updated = replace_in_footer(updated, path)
        updated = bump_css(updated)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            n += 1
    print(f"updated {n} html files")


if __name__ == "__main__":
    main()
