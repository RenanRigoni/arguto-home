---
name: Arguto B2B Redesign
description: Industrial-operational B2B distributor platform — indigo and orange from the real Arguto mark, condensed display type, disciplined motion
colors:
  brand-900: "#14165a"
  brand-700: "#1f2275"
  brand-600: "#292c95"
  brand-500: "#3d41b0"
  brand-100: "#e4e5f5"
  brand-50: "#f2f3fa"
  accent-600: "#c25e0a"
  accent-500: "#f2811d"
  accent-100: "#fdeedd"
  ink-900: "#14161c"
  ink-700: "#3a3f4a"
  ink-500: "#6a7180"
  ink-400: "#9aa1af"
  surface-0: "#ffffff"
  surface-50: "#fafafb"
  surface-100: "#f3f4f6"
  border: "#e3e5ea"
  border-strong: "#cbcfd8"
  success-600: "#157347"
  warning-600: "#b45309"
  danger-600: "#b42318"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label-mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  gutter: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  section-y: "clamp(2.5rem, 1.8rem + 3vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent-500}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-600}"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.brand-600}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    textColor: "{colors.brand-600}"
  product-card:
    backgroundColor: "{colors.surface-0}"
    rounded: "{rounded.md}"
    padding: "12px"
---

# Design System: Arguto B2B Redesign

## 1. Overview

**Creative North Star: "The Freight Manifest"**

The system reads like the digital instrument of a working distributor, not a
startup performing technology. Every surface behaves like a shipping
manifest or a warehouse label: dense, legible, confident, engineered for
someone who scans it fifty times a day. The condensed display type
(Big Shoulders) exists because it is the closest thing in the Google Fonts
catalog to freight signage and consignment stamps; the engineered sans and
mono (IBM Plex) exist because they read as instruments, not marketing copy.
Indigo and orange are not invented: they are lifted directly from the real
Arguto mark, where the orange arc has sat unused in every stylesheet the
legacy site has shipped since 2020.

This explicitly rejects the generic AI-generated SaaS aesthetic: no
purple/blue gradients, no glassmorphism, no floating fake dashboards, no
hero-metric template, no invented client logos or stats. It also rejects
the legacy site's own look: duplicated Bootstrap, jQuery-era card grids,
zero hierarchy. The system is brand-forward on the home (§ PRODUCT.md
register) and drops into a quieter, product-register mode the moment a
transaction begins (cart, checkout, account).

**Key Characteristics:**
- Condensed, high-contrast display type paired with an engineered body/mono duo
- Two brand colors only, both sourced from the real logo, used with restraint
- Sharp-to-modest radius (never above 10px) — nothing rounded into a bubble
- Flat by default; elevation appears only for floating, dismissable surfaces
- Motion is functional and fast (120–200ms), never decorative or bouncy

## 2. Colors

Restrained strategy: tinted neutrals carry the page, indigo is the singular
identity color, orange is a scarce, deliberate accent.

### Primary
- **Manifest Indigo** (`#292c95`): the brand's own primary, lifted from the
  wordmark. Used for links, the mega menu, primary navigation weight, and
  the `Section` brand-tone background (`ServiceStrip`). Never used as a
  page-wide gradient or background wash.

### Secondary
- **Consignment Orange** (`#f2811d`): the arc from the logo, unused anywhere
  in the legacy CSS. Reserved for the two moments that must win the eye:
  the primary CTA button and the "Oferta" badge. If it appears more than
  twice above the fold, it has been overused.

### Neutral
- **Ledger Ink** (`#14161c` / `#3a3f4a` / `#6a7180` / `#9aa1af`): four steps
  of near-black-to-mid-gray text, each tinted, never pure black.
- **Manifest Paper** (`#ffffff` / `#fafafb` / `#f3f4f6`): card surface,
  page background, and alternating section background, in that order.
- **Hairline** (`#e3e5ea` / `#cbcfd8`): default border and a stronger
  variant for dividers that need to read as structural, not decorative.

### Named Rules
**The Two-Color Rule.** The system has exactly two brand colors: indigo and
orange. Indigo carries identity and navigation. Orange carries action and
scarcity signals (CTA, offer badge, focus ring). No third accent is ever
introduced casually.

**The Scarcity Rule.** Orange never covers a background larger than a
button or a badge. The moment orange becomes a wash or a gradient stop, the
system has slipped into generic SaaS territory.

## 3. Typography

**Display Font:** Big Shoulders (with Arial Narrow, sans-serif fallback)
**Body Font:** IBM Plex Sans (with system-ui fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace fallback)

**Character:** A condensed, industrial display face over an engineered,
faintly technical body face. Neither font has appeared in the last three
years of generic AI-generated interfaces — that is a deliberate, checked
constraint, not an accident.

### Hierarchy
- **Display** (700, `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)`, tight leading,
  -0.01em tracking): the hero `<h1>` only. One per page.
- **Headline** (700, 1.75rem/2.1rem desktop, 1.375rem/1.8rem mobile):
  section titles (`SectionHeading`, `<h2>`).
- **Body** (400, 1rem/1.5rem): running copy, capped at 65–75ch anywhere
  prose appears (institutional pages, product description).
- **Label** (500, 0.875rem/1.25rem): product name in `ProductCard`, nav
  items, form labels. `line-clamp-2` with a fixed min-height wherever
  product names can vary in length.
- **Mono label** (400/500, 0.75–1rem, IBM Plex Mono): product code, price,
  and quantity stepper value. Signals "this is data, not copy."

### Named Rules
**The No-Inter Rule.** Never fall back to Inter, Roboto, Arial, or
system-ui as a *visible* typeface. Big Shoulders and IBM Plex carry the
entire system; system-ui/Arial exist only as the invisible fallback chain
while a font loads.

## 4. Elevation

Flat by default. The system does not use ambient shadows to fake depth on
static surfaces — a card sits on the page because of its border and
background contrast, not a drop shadow. Shadows are reserved strictly for
surfaces that float above the page and can be dismissed: the mega menu
panel, the mobile drawer, the search suggestions listbox.

### Shadow Vocabulary
- **sm** (`0 1px 2px rgb(20 22 28 / 0.06)`): sticky header at rest, barely
  perceptible separation from the page.
- **md** (`0 4px 12px rgb(20 22 28 / 0.08)`): search suggestions panel,
  small floating controls.
- **lg** (`0 12px 32px rgb(20 22 28 / 0.12)`): mega menu content panel,
  mobile nav drawer — the only surfaces allowed the heaviest shadow.

### Named Rules
**The Floating-Only Rule.** If a shadow is applied to something that
cannot be dismissed or does not float above other content, remove it.
Static cards use a 1px border, not a shadow.

## 5. Components

### Buttons
- **Shape:** 6px radius (`rounded.md`), 44px height, never a pill.
- **Primary:** Consignment Orange background, white text, 0 20px padding.
  Reserved for the single most important action per view (hero CTA, add
  to cart).
- **Secondary:** white background, indigo text, 1.5px `border-strong`
  border; hover moves the border to brand-600. Used for the "second"
  action alongside a primary (e.g. "Quero ser cliente" beside "Ver
  produtos").
- **Ghost:** transparent background, ink-700 text, hover to surface-100.
  Used inside menus and toolbars.
- **Link:** brand-600 text, underline offset 4px, no padding. Used inline
  in prose and as the "Ver todos" pattern in `SectionHeading`.
- **Hover / Focus:** background/border/color transitions only, 120ms,
  `ease-out-expo`. Focus ring is always the 2px orange `:focus-visible`
  outline, 2px offset, regardless of button variant.

### Product Card
- **Shape:** 6px radius, 1px `border` (`#e3e5ea`), white surface.
- **Density:** fixed width (200–220px), fixed 2-line title height via
  `line-clamp-2` — the card never reflows when descriptions vary in
  length. This is the system's signature component: it must render seven
  distinct states (anonymous, authenticated, out of stock, loading, no
  image, offer, multiple-packaging) without changing its outer dimensions.
- **Price:** IBM Plex Mono, semibold, ink-900. Anonymous state replaces
  price entirely with a "Ver preço" outline button — never a blurred or
  grayed-out price, which would imply the number exists but is hidden.
- **Offer badge:** Consignment Orange, top-right, uppercase, 11px.
- **Out-of-stock:** image drops to 60% opacity + light grayscale, a solid
  Danger-600 badge reads "Indisponível" top-left, quantity controls do not
  render at all rather than rendering disabled.

### Search Field (Combobox)
- **Style:** 44–48px height, 1.5px border, indigo border + orange-tinted
  focus ring on focus.
- **Suggestions panel:** white, `lg` shadow, each row a 40×40 thumbnail +
  two-line clamp of the product name. Active row gets a Brand-50 wash, not
  a border.
- **Behavior:** works with JavaScript disabled (native `<form method="get">`
  submit); the combobox layer is a progressive enhancement on top.

### Navigation (Mega Menu)
- **Style:** white bar, 1px bottom hairline border, IBM Plex Sans 500
  weight labels, indigo on hover/open state.
- **Panel:** two-column department/category layout, `lg` shadow, opens
  with 4px translateY + opacity over 120ms, no bounce.
- **Mobile:** full drawer from the left, same typography, accordion for
  category disclosure.

## 6. Do's and Don'ts

### Do:
- **Do** use IBM Plex Sans/Mono and Big Shoulders exclusively for visible
  type — this is the system's clearest fingerprint against generic output.
- **Do** keep orange to CTA + offer badge + focus ring. Everything else
  brand-related is indigo or neutral.
- **Do** keep every card, badge, and control inside the sharp-to-modest
  radius scale (4/6/10px). 10px is the ceiling, on the mega menu panel and
  modal only.
- **Do** render `preco: null` (no session) and `preco: 0` (data error)
  as visibly different states — "Ver preço" button vs. "Preço
  indisponível" text. Collapsing them is a real product bug, not a
  style nit.
- **Do** respect `prefers-reduced-motion` on every transition without
  exception.

### Don't:
- **Don't** use purple/blue gradient backgrounds, glassmorphism, glowing
  cards, or floating fake dashboards — PRODUCT.md's anti-references,
  repeated here on purpose.
- **Don't** use gradient text (`background-clip: text` + gradient) for
  emphasis. Weight and the display typeface carry emphasis instead.
- **Don't** use a colored `border-left`/`border-right` stripe as an accent
  on any card, list item, or callout. Rewrite with a full border, a tint
  background, or a leading icon.
- **Don't** invent metrics, testimonials, client logos, or awards anywhere
  in the system — every institutional claim must trace to a confirmed
  fact per PRODUCT.md.
- **Don't** fall back visibly to Inter, Roboto, or system-ui — see The
  No-Inter Rule.
- **Don't** apply a shadow to a static, non-dismissable surface — see The
  Floating-Only Rule.
