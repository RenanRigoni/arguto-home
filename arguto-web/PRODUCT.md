# Product

## Register

brand

Note: the home is brand-forward (this file's default). Internal transactional
surfaces to be built later (carrinho, checkout, meus pedidos, meus dados) are
`product` register — efficiency-first, motion stays functional and never
slows the purchase path. Override per task when working on those.

## Users

**Existing B2B customers** (repeat buyers, already cadastrados via CNPJ/CPF).
Context: desktop at work, often a commercial/warehouse environment, sometimes
Android mobile. Job to be done: find a product fast, check price after login,
reorder, check order history. They already trust Arguto — the redesign must
not make them relearn where things are.

**Prospective B2B customers** (new visitors evaluating whether to become a
customer). Job to be done: understand what Arguto distributes, why buying
through Arguto makes sense versus a competitor, which segments/brands are
carried, how to register.

## Product Purpose

Redesign of the Arguto (LUFIR Comércio e Representação LTDA) B2B distribution
e-commerce homepage. Replaces a legacy ASP.NET WebForms frontend — 24.17 MB
page weight, 118 requests, triplicated jQuery, duplicated Bootstrap, zero SEO,
zero `<h1>`, 1/119 images with `alt` — with a modern Next.js frontend, while
preserving 100% of Protheus integration, business rules, and the existing
admin portal. Success: "this looks like the digital platform of a serious
distributor," not a startup pretending to be technological, and dramatically
faster/lighter/accessible without making the existing buyer relearn where to
buy.

## Brand Personality

Three words: **Sério, operacional, confiável.** A consolidated distributor
with a modern digital platform — not a startup trying to look techy. Voice:
direct, commercial, zero marketing fluff. No invented metrics, testimonials,
or client logos — every institutional claim traces to a confirmed fact.

## Anti-references

- Generic AI-generated SaaS landing: purple/blue gradients, glassmorphism,
  floating fake dashboards, hero-metric template, invented stats.
- Generic playful retail e-commerce template.
- The legacy site itself: dated Bootstrap look, no visual hierarchy, banner
  carousels, jQuery-era interaction patterns.
- Fake social proof of any kind: no invented customer counts, SKU counts,
  testimonials, awards, geographic reach.

## Design Principles

1. Preserve the legacy system's business logic and routes — only the
   presentation layer changes. Never invent new backend behavior to justify
   a design choice.
2. Never fabricate data. Every institutional claim must trace to a confirmed
   fact (docs/05-HOME-SPEC.md §2); omit what isn't confirmed rather than
   invent it.
3. Product discovery is immediately accessible — a repeat buyer never wades
   through marketing content before reaching the catalog.
4. Performance is a stated feature, not an afterthought. The legacy 24 MB /
   118-request home is the explicit baseline being beaten, not a coincidence.
5. Distinctive, disciplined motion on the brand-forward home — real
   personality and a sense of technical polish — without ever slowing down
   or obscuring the transactional product-register surfaces.

## Accessibility & Inclusion

WCAG 2.2 AA. Full keyboard operability (mega menu, search combobox, mobile
drawer) with visible focus at all times. `prefers-reduced-motion` respected
by every motion addition — no exceptions. Descriptive `alt` on 100% of
images (legacy baseline was 1 of 119). Minimum AA contrast on all text and
meaningful icons.
