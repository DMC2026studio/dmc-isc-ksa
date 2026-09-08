# Page override: Arabic RTL system

Inherits `design-system/MASTER.md`.

## Intent

`/ar/` is a **true RTL** experience — not English layout with translated strings.

## Document

```html
<html lang="ar" dir="rtl">
```

## Typography

- **Noto Sans Arabic** (400/500/600/700) loaded via `css/main.css`
- No Latin tracking on Arabic text
- Higher line-height for connected scripts
- No forced `text-transform: uppercase` on Arabic labels

## Mirroring

Header, nav, mobile drawer, hero, grids, cards, forms, breadcrumbs, process diagrams, footer, directional icons/arrows.

## Content policy

Do **not** machine-translate or invent Arabic marketing copy.

Where approved Arabic has not been supplied, use:

`[ARABIC CONTENT TO BE PROVIDED]`

class: `ar-pending` / `placeholder-content`

**UI chrome** (nav, primary CTAs, form field labels) may use short provisional Arabic labels so the RTL system can be tested — replace with approved glossary when supplied.

## Language switch

`EN | العربية` maps `/page.html` ↔ `/ar/page.html` via `js/language.js`.

## hreflang

Each pair must include:

- `hreflang="en"`
- `hreflang="ar"`
- `hreflang="x-default"` → English URL

## Breakpoints to verify

375 · 390 · 430 · 768 · 1024 · 1440
