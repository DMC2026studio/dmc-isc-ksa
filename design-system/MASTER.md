# ISC Design System — Master

> **LOGIC:** When building a page, first check `design-system/pages/[page-name].md`.
> If it exists, its rules **override** this Master file.
> Otherwise, follow these rules strictly.

---

**Project:** Imperial Solution Company (ISC)  
**Stack:** HTML5 · CSS3 · Vanilla JavaScript · PHP (forms)  
**Location:** Dammam, Eastern Province, Kingdom of Saudi Arabia  
**Generated with:** ui-ux-pro-max (adapted to approved ISC brand)  
**Design dials:** Variance 5/10 · Motion 3/10 · Density 3/10 (spacious)

---

## Positioning (non-negotiable)

ISC is a **Saudi localisation platform** that brings proven international manufacturing technologies into the Kingdom through partnership and develops local production capability.

**Formula:** International Technology + Strategic Partnership + Technology Transfer + Saudi Localisation

**Do not position as:** generic contractor, trading company, construction template, or company with fabricated history/projects.

**Capability language:** use *establishing / planned / in development / localisation roadmap* — never claim active manufacturing unless supplied content confirms it.

**Content placeholders when data is missing:**
- `[CONTENT TO BE PROVIDED]`
- `[PARTNER LOGO PENDING APPROVAL]`
- `[TECHNICAL DATA PENDING]`
- `[PROJECT REFERENCE PENDING]`

Never invent certifications, ISO, Saudi Made, Vision 2030 logos, partners, stats, awards, capacity, or project values.

**CMS-ready content (Phase 9):** expandable catalogues live in `content/` — see `content/README.md` and `design-system/pages/cms-architecture.md`. Do not add a CMS framework unless explicitly instructed.

---

## Visual personality

| Be | Avoid |
|----|--------|
| Industrial, premium, engineering-led | Generic construction templates |
| Institutional, modern GCC | SaaS / startup aesthetics |
| Clean, precise, confident | Glassmorphism, neon, purple themes |
| Technically credible | Fake portfolios / fake statistics |
| Restrained motion | Excessive parallax / scroll-jacking |

**Inspiration only (reference image):** strong hero imagery, editorial layouts, diagonal/architectural cuts, asymmetric sections, clear CTA hierarchy. **Do not copy** the reference layout or its orange system.

---

## Colour tokens (approved palette only)

| Token | Hex | Role |
|-------|-----|------|
| `--color-primary-green` | `#084828` | Primary brand, primary CTA |
| `--color-secondary-green` | `#78C078` | Accent, highlights, Arabic wordmark harmony |
| `--color-industrial-navy` | `#103048` | Dark surfaces, footer, navy CTAs |
| `--color-off-white` | `#F4F6F1` | Page background |
| `--color-charcoal` | `#202A27` | Primary text |
| `--color-medium-grey` | `#6B7370` | Secondary text |
| `--color-light-grey` | `#E2E6E4` | Borders, dividers, muted surfaces |

**Supporting tints:** `#E7F3EA` `#CDE8D2` `#A6D8AD` `#78C078` · `#E3EBF1` `#C7D6E2` `#9CB6C9` `#103048`

**Gradients (sparingly):** `#084828 → #78C078` · `#103048 → #3A556B` · `#084828 → #103048`

**Forbidden as dominant:** orange CTAs, gold as primary accent, random off-brand colours.

**Contrast:** body text ≥ 4.5:1 on light and dark surfaces. Primary CTA on green uses white text.

---

## Typography

| Role | Family | Notes |
|------|--------|--------|
| English UI / body | **Manrope** (primary) + **Inter** fallback | Technical, readable, professional |
| Arabic | **Noto Sans Arabic** | Always loaded — never browser fallback only |
| Display / H1 | Manrope 600–700 | Strong but not oversized marketing type |
| Labels / meta | Manrope 500, slight tracking | Engineering/document hierarchy |

**Scale (rem @ 16px root):**

| Token | Size | Line-height | Use |
|-------|------|-------------|-----|
| `--text-xs` | 0.75rem | 1.4 | Meta, captions |
| `--text-sm` | 0.875rem | 1.5 | Secondary, nav |
| `--text-base` | 1rem | 1.65 | Body |
| `--text-lg` | 1.125rem | 1.6 | Lead |
| `--text-xl` | 1.25rem | 1.4 | H3 |
| `--text-2xl` | 1.5rem | 1.3 | H2 mobile |
| `--text-3xl` | 1.875rem | 1.25 | H2 desktop |
| `--text-4xl` | 2.25rem | 1.2 | H1 mobile |
| `--text-5xl` | 3rem | 1.15 | H1 desktop |

Measure: long copy max ~68ch.

---

## Spacing & layout

**Density:** spacious (ui-ux-pro-max dial 3/10)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

| Layout | Value |
|--------|-------|
| `--container-max` | 1200px |
| `--container-wide` | 1400px |
| `--gutter` | 24px (16px mobile) |
| Grid | 12-column desktop · stack mobile |
| Radius | `--radius-sm: 2px` · `--radius-md: 4px` · `--radius-lg: 6px` (sparingly) |
| Shadows | Restrained: hairline borders preferred over heavy elevation |

---

## Breakpoints

| Name | Min-width |
|------|-----------|
| `sm` | 480px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1440px |
| `3xl` | 1920px |

Validate: 375 · 390 · 430 · 768 · 1024 · 1280 · 1440 · 1920. No horizontal scroll.

---

## Components (foundation)

### Buttons
1. **Primary** — Request an RFQ → `bg primary-green`, white text  
2. **Secondary** — Talk to ISC → outline navy or green  
3. **Tertiary** — Partner with ISC → text / ghost link  
4. **On dark** — secondary green fill or white outline  

Radius: 2–4px. Hover: 200ms colour/opacity shift. No layout-shifting scale. `cursor: pointer`. Focus-visible ring: secondary green / navy.

### Cards
Modular, thin border (`--color-light-grey`), off-white or white surface, minimal shadow. Use for interactive groupings (pillars, products, partners). Prefer editorial image+text layouts over “everything is a card.”

**Card types:** Pillar · Product · Partner · Reference · Technical · Certification (placeholder-ready)

### Navigation
Sticky header on scroll. Skip link to `#main`. Desktop: logo · primary nav · language · RFQ CTA. Mobile: full-height drawer, focus trap, Escape to close. Pad content for sticky header height.

### Footer
Navy/charcoal surface. Logo (light usage), pillars links, company links, contact placeholders, language, legal. No fabricated claims.

### Section header
Eyebrow (optional) · H2 · short supporting sentence · optional technical rule line.

---

## Conversion hierarchy

1. **REQUEST AN RFQ** (primary)  
2. **TALK TO ISC** (secondary)  
3. **PARTNER WITH ISC** (tertiary)

Audiences: contractors/consultants · industrial/energy buyers · international manufacturers.

---

## Motion rules

- Subtle only: fade-up ~12px, 300–400ms, ease-out  
- Image reveal / hover border or opacity  
- Accordion height transitions  
- **Respect `prefers-reduced-motion: reduce`** — disable non-essential motion  
- Max 1–2 key motions per viewport  
- No parallax, no scroll-jacking, no loading splash screens

---

## Imagery

Prefer: facilities, manufacturing environments, materials, façades, cladding, PPE/FRC, workshops, machinery.  
Avoid: generic handshakes, fake boardrooms, implying partner work was ISC’s.  
Treatment: full-bleed hero where appropriate; optional subtle diagonal crop *inspired by* reference — not copied. Desaturate overlays with navy/green scrims for text contrast.

---

## Logo

Asset: `assets/logo/logo.png` (master — do not redraw/recolour/distort).  
Usage contexts: light header, sticky header, dark footer, mobile. Clear space ≥ 0.5× emblem height. Never stretch.

---

## Bilingual / RTL

- English primary (`/` LTR)  
- Arabic true RTL under `/ar/` — see `design-system/pages/arabic-rtl.md`  
- `dir="rtl"` `lang="ar"` on Arabic documents  
- **Noto Sans Arabic** always loaded (never system-only)  
- Mirror: nav, mobile drawer, hero, grids, cards, forms, breadcrumbs, process diagrams, footer, directional icons  
- Language switcher: `EN | العربية` maps `/page.html` ↔ `/ar/page.html`  
- hreflang: `en`, `ar`, and `x-default` → English  
- Body copy: do not invent Arabic — use `[ARABIC CONTENT TO BE PROVIDED]` until approved

---

## Accessibility

- Semantic landmarks: `header` `nav` `main` `footer`  
- Sequential headings  
- Visible `:focus-visible`  
- Touch targets ≥ 44×44px  
- Form labels + error text (not colour alone)  
- Alt text on meaningful images; empty alt on decorative  
- Skip link  
- Keyboard-operable menus and accordions

---

## Anti-patterns

- Fake stats, clients, projects, certs  
- Orange-dominant or gold-dominant UI  
- SaaS glass / bento / startup gradients  
- Oversized decorative type  
- Heavy card grids everywhere  
- Bootstrap / Tailwind / React / jQuery

---

## Pre-delivery checklist

- [ ] Brand palette only  
- [ ] Logo unaltered  
- [ ] No fabricated content  
- [ ] RFQ CTA visible in header + key sections  
- [ ] `prefers-reduced-motion` respected  
- [ ] Focus states visible  
- [ ] Mobile nav usable by keyboard  
- [ ] RTL shell not broken  
- [ ] Contrast ≥ 4.5:1 body text  
- [ ] Tested at listed breakpoints  

---

## Homepage wireframe (this phase)

1. Skip link + Header  
2. Hero — brand, positioning line, primary/secondary CTA, industrial visual plane  
3. Positioning strip — localisation formula  
4. Three pillars — Manufacturing · Façade · **Industrial Supplies (priority)**  
5. Model teaser — partnership / technology transfer  
6. Industrial Supplies deeper teaser  
7. Audiences / next actions  
8. RFQ band  
9. Footer  

Placeholders for unsupplied copy and media. **Do not fill with invented content.**
