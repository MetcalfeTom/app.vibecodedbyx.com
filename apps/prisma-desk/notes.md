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
- 2026-08-19 (2): v1.1 — JOY LAYER per chat, nothing obscured: right-edge MARKER TABS (7 colored notebook tabs, real anchor nav with focus outlines, hidden <760px so mobile is never covered), per-section WASHI TAPE patterns (stripes/dots on the existing tape pseudo), 4 aria-hidden corner STICKERS (📎🔬☕🌿, opacity .5, pointer-events none), and PROGRESS STAMPS that are DERIVED FROM STATE, never decorative lies: COLLECTED ✓ (records>0), DOUBLE-CHECKED κ (dual-rated>0), INCLUDED! (included>0), DIAMOND DAY ◆ (≥1 computable effect) — each role=img with "progress stamp:" aria-label, spring-in animation (reduced-motion stilled), and the probe proves they VANISH when the state empties. Suite 23/23.
- 2026-08-19 (3): v1.2 — TOOLS TAB per two overlapping chat requests: section 7 "The real toolbox — with fit AND poor fit". Four name-only cards (Zotero collect / Rayyan screen / ResearchRabbit map / Obsidian write) reusing the stage-chip styling; each carries a SAFE-USE note wiring it to THIS desk (Zotero→RIS into section 1; Rayyan→mirror final calls so the flow stays single-source; ResearchRabbit→discoveries enter at "identified", no side doors; Obsidian→archive the JSON export for provenance) and a POOR-FIT line (ten-paper assignment / solo "blinding is mood lighting" / unauditable graph wandering vs reproducible search strings / team tables). ZERO links (probe-asserted). 8th marker tab "tools". Suite 26/26.
