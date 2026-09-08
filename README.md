# Imperial Solution Company (ISC) — Website

Official bilingual website for **Imperial Solution Company**, Dammam, Kingdom of Saudi Arabia.

Built by **DMC Creatives Studio** for industrial B2B procurement, localisation partnerships, and supply.

**Stack:** HTML5 · CSS3 · Vanilla JavaScript · PHP (form stubs)  
**Not used:** React, Next.js, Vue, Bootstrap, Tailwind, jQuery

---

## Preview locally

```bash
python -m http.server 8080
```

| Locale | URL |
|--------|-----|
| English | http://localhost:8080/ |
| Arabic (RTL) | http://localhost:8080/ar/ |
| Live preview | https://dmc2026studio.github.io/dmc-isc-ksa/ |

---

## Commercial milestones (approved quotation)

| # | Scope | Amount | Status |
|---|--------|--------|--------|
| 1 | Logo & stationery | ₹40,000 | Prior |
| **2** | **Website Design** — Home, About, Products/Services, Partners, Projects, Downloads, Contact | **₹25,000** | **Payment received — in delivery** |
| 3 | Website Development — CMS, bilingual RTL production, WhatsApp, email routing, SEO live, GBP, SSL, analytics | ₹25,000 | Next (after design approval) |
| 4 | Brochure & datasheets | ₹25,000 | Pending |
| 5 | Final delivery / QA / IP | ₹10,000 | Pending |

Details: `docs/PHASE-2-WEBSITE-DESIGN.md` · `docs/PHASE-3-WEBSITE-DEVELOPMENT.md`

---

## Repository structure

```
/
├── index.html                 # English homepage
├── *.html                     # English site pages
├── ar/                        # Arabic RTL pages
├── assets/
│   ├── logo/                  # Logo + favicon (canonical)
│   ├── images/                # Photography / WebP
│   └── documents/             # Public document library
├── css/                       # Design system stylesheets
├── js/                        # Site behaviour modules
├── php/                       # Contact / RFQ / careers / content API stubs
├── content/                   # CMS-ready JSON + schemas (en / ar)
├── design-system/             # Brand & page specifications
├── docs/                      # Internal briefs & references
├── tools/                     # Dev utilities (link check, favicon)
├── favicon.ico                # Browser default icon
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Brand tokens

| Token | Hex |
|-------|-----|
| Primary green | `#084828` |
| Secondary green | `#78C078` |
| Industrial navy | `#103048` |
| Off-white | `#F4F6F1` |
| Charcoal | `#202A27` |

Canonical logo: `assets/logo/logo.png`  
Favicon: `assets/logo/favicon.png` (+ root `favicon.ico`)

---

## Content rules

Do **not** invent projects, customers, certifications, ISO claims, Saudi Made / Vision 2030 marks, awards, or capacity figures.  
Manufacturing status must use: **planned** · **under development** · **being established**.  
Partner work must be labelled **Partner reference** — never as ISC delivery history.

---

## Launch checklist

1. Set live domain in `content/site.json`, `sitemap.xml`, `robots.txt`, and canonicals  
2. Configure PHP SMTP for contact / RFQ / careers  
3. Publish approved partner & product JSON in `content/en/` and `content/ar/`  
4. Replace Privacy / Terms placeholders with legal text  
5. Re-crawl sitemap after go-live

---

## Forms

| Form | Handler |
|------|---------|
| Contact | `php/contact-handler.php` |
| RFQ | `php/rfq-handler.php` |
| Careers | `php/careers-handler.php` |

Handlers return honest 501 until SMTP/API is configured.

---

© Imperial Solution Company · Built by DMC Creatives Studio
