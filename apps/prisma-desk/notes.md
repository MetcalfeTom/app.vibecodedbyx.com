# PRISMA Desk — a transparent meta-analysis workbench

## log
- 2026-08-19: v1.0 — built across THREE chat requests landing mid-build, deployed once.
  - PICO protocol header (persisted), RIS + BibTeX paste parsers (local, title-dedup), literature records table.
  - DUAL-RATER SCREENING: raters A/B decide independently per record; agreement advances (inc+inc→screened, exc+exc→excluded), disagreement→conflict stage with resolve buttons; live COHEN'S κ over dual-rated records with plain-language read (probe hand-case: (inc,inc)×2,(exc,exc),(inc,exc) → po=.75, pe=.5, κ=0.50 exact). Full-text stage: include / exclude-with-reason.
  - PRISMA FLOW derived live from record stages (SVG boxes+arrows, exclusion reasons listed, conflicts held at screening — the diagram footer states "nothing is typed into this diagram").
  - EXTRACTION + CALCULATOR CHECKS: per-included row n/m/sd ×2 groups, input validation (n≥2, sd>0 else null), Hedges g with small-sample J, variance, CI — formulas PRINTED on the page. Pooling: inverse-variance fixed + DerSimonian-Laird random, Q, τ², I². MATH PROBED against hand values: g=J·d with J=1−3/151 for the 20/20 case; identical pair → Q=0, I²=0, fixed==random; heterogeneous pair → τ²>0, I²>50%, random CI wider.
  - EDITABLE FOREST PLOT: SVG squares sized by weight (model-aware), CI whiskers, pooled diamond, fixed/random toggle, zero-line, re-renders on any table edit; aria-label narrates the pooled effect.
  - RISK-OF-BIAS: 3 domains (randomization/blinding/attrition) low/some/high per included study, persisted.
  - HONEST LIMITS section: not RevMan/metafor, DL-not-REML named, continuous-two-group only, no funnel/RoB tooling — "every number derivable by hand against the printed formulas is the one guarantee".
  - HANDWRITTEN NOTEBOOK RESTYLE (3rd request): CSS-only — ruled paper + red margin, cursive SYSTEM stack (--hand, no font CDN) for headings/buttons/th, wavy underlines, taped index-card panels ±.25° (reduced-motion flattens), Georgia prose; DATA SURFACES (tables, mono formulas, calc output) deliberately kept crisp for traceability.
  - Zero external assets; localStorage 'prisma-desk-v1'; JSON export. Probe 19/19. Screenshots reviewed.

## issues
- seeded-screenshot scripts using importText+scrollTo captured before render once — probe covers rendering; don't chase screenshot seeds.

## todos
- binary outcomes (log OR), funnel plot, CSV export, if researchers in chat want more.
