#!/usr/bin/env python3
"""Standardise Phase 2 primary navigation across EN HTML pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAV = """            <ul class="site-nav__list">
              <li><a class="site-nav__link" data-nav-link href="index.html">Home</a></li>
              <li><a class="site-nav__link" data-nav-link href="about.html">About</a></li>
              <li><a class="site-nav__link" data-nav-link href="products-services.html">Products / Services</a></li>
              <li><a class="site-nav__link" data-nav-link href="partners.html">Partners</a></li>
              <li><a class="site-nav__link" data-nav-link href="references.html">Projects</a></li>
              <li><a class="site-nav__link" data-nav-link href="documents.html">Downloads</a></li>
              <li><a class="site-nav__link" data-nav-link href="contact.html">Contact</a></li>
            </ul>"""

MOBILE = """          <ul class="mobile-nav__list">
            <li><a class="mobile-nav__link" href="index.html">Home</a></li>
            <li><a class="mobile-nav__link" href="about.html">About</a></li>
            <li><a class="mobile-nav__link" href="products-services.html">Products / Services</a></li>
            <li><a class="mobile-nav__link" href="partners.html">Partners</a></li>
            <li><a class="mobile-nav__link" href="references.html">Projects</a></li>
            <li><a class="mobile-nav__link" href="documents.html">Downloads</a></li>
            <li><a class="mobile-nav__link" href="contact.html">Contact</a></li>
            <li><a class="mobile-nav__link" href="rfq.html">Request an RFQ</a></li>
          </ul>"""

NAV_RE = re.compile(
    r'<ul class="site-nav__list">.*?</ul>',
    re.DOTALL,
)
MOBILE_RE = re.compile(
    r'<ul class="mobile-nav__list">.*?</ul>',
    re.DOTALL,
)


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if 'class="site-nav__list"' not in text:
            continue
        new = NAV_RE.sub(NAV, text, count=1)
        if 'class="mobile-nav__list"' in new:
            new = MOBILE_RE.sub(MOBILE, new, count=1)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("updated", path.name)
        else:
            print("unchanged", path.name)


if __name__ == "__main__":
    main()
