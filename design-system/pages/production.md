# Page override: Production optimisation (Phase 10)

Inherits `design-system/MASTER.md`.

## SEO

Every page: unique title, meta description, canonical, Open Graph, Twitter card, H1, semantic landmarks, hreflang EN/AR/x-default.

Artifacts: `sitemap.xml`, `robots.txt`, `content/site.json` (update `siteOrigin` before launch).

Product pages (`frc`, `ppe`, `mro`, `industrial-supplies`, `sector-solutions`) are `index,follow`.

## Performance

- WebP sources via `<picture>` where generated
- `loading="lazy"` / `decoding="async"` via `js/performance.js`
- Font: Manrope + Noto Sans Arabic only (`display=swap`), preconnect
- No framework JS libraries
- `css/production.css` for tap targets, focus, overflow

## Accessibility

Skip link, focus-visible, 44px targets, labelled forms, ARIA on nav/drawer, alt text (empty only when decorative).

## Forms

Validation · error · loading · success · file checks · honeypot (`company_website`) with server stub.
