# ISC Content Architecture (Phase 9)

CMS-ready structured data for the static frontend.

**Frontend stays:** HTML · CSS · Vanilla JS  
**No CMS framework** is installed. This folder is the portable content contract.

---

## Purpose

All expandable site content lives here as JSON so later backends can replace files without redesigning pages:

| Future backend | How it maps |
|----------------|-------------|
| PHP / MySQL | `php/content-api.php` reads DB → same JSON shape |
| WordPress | Custom post types / ACF → export or REST to this shape |
| Headless CMS | Collection schemas mirror `content/schemas/` |
| Custom admin | CRUD writes into `content/{locale}/*.json` or DB |

---

## Collections

| File | Content type |
|------|----------------|
| `pages.json` | Static page fields / SEO |
| `product-categories.json` | FRC, PPE, MRO, etc. |
| `products.json` | Individual products |
| `sector-solutions.json` | Sector solution cards |
| `manufacturing-technologies.json` | GRC/GRP/GRG, chemicals, pipes… |
| `partners.json` | Technology & industry partners |
| `references.json` | Partner references **and** ISC projects |
| `documents.json` | Company profile, datasheets, brochures |
| `careers.json` | Job openings |
| `news.json` | News / updates |

Locales: `content/en/` · `content/ar/`

---

## Status field

Every item:

```json
"status": "draft" | "pending" | "published"
```

Frontend (`js/content.js`) publishes **only** `published` items by default.  
Do not invent products, partners, or projects — leave `items: []` until approved.

---

## Product shape

See `schemas/product.schema.json`:

Name · Slug · Category · Short Description · Full Description · Applications · Technical Specifications · Standards · Certifications · Datasheet · Images · Related Products

---

## Reference shape

See `schemas/reference.schema.json`:

`type`: `partner-reference` | `isc-project`

Partner · Project · Location · Technology · Description · Images · Attribution · External URL

UI must distinguish **Partner reference** vs **ISC project** (`data-ref-type`).

---

## Documents

See `schemas/document.schema.json` and `documents.html`.

Types: `company-profile` · `datasheet` · `technical` · `brochure`

Files live under `assets/documents/` when supplied; JSON holds metadata + path.

---

## Frontend usage

```html
<div data-content="references" data-content-empty="pending"></div>
<script src="js/content.js" defer></script>
```

```js
ISC.Content.get("references").then(function (items) { ... });
```

Config: `content/config.json` → `source: "json" | "api"`

When moving to MySQL/API, set `"source": "api"` and `"apiBase": "/php/content-api.php"`.

---

## Adding content without redesign

1. Add an item to the relevant JSON (or future admin).  
2. Set `"status": "published"`.  
3. Pages that mount `data-content="…"` render automatically.  
4. No layout redesign required for new products, partners, references, technologies, news, or careers.
