# Page override: CMS-ready content architecture

Inherits `design-system/MASTER.md`.

## Intent

Structured content under `content/` powers expandable catalogues without redesigning HTML layouts. Frontend remains HTML/CSS/Vanilla JS.

## Mount points

```html
<div data-content="products" data-content-category="frc"></div>
<div data-content="references" data-content-status="published,pending"></div>
<div data-content="partners"></div>
<div data-content="documents" data-content-status="published,pending"></div>
<div data-content="careers"></div>
```

## Reference types

`partner-reference` → UI tag **Partner reference** (`data-ref-type="partner"`)  
`isc-project` → UI tag **ISC project** (`data-ref-type="isc"`)

Never conflate the two.

## Backend switch

`content/config.json` → `"source": "api"` + `php/content-api.php`
