# age-of-audit

## log
- 2026-05-09: shipped initial cut (chat asks: "create a new app called age-of-audit based on [paul-rinaldi gist]" + "initialize the age-of-audit app with a lane defense core, using billable hours as the main resource, and implement the transition from ancient accountant ages to the final deadline phase"). Lane-defense reimagining of *Age of War* through five tax-accounting eras, ending at "The Deadline" cosmic boss. Single HTML, canvas 2D + emoji-glyph sprites (no PNG assets).
  - **Resources**: Billable Hours (BH, main currency, earned from kills) + CPE Credits (era progression, also from kills) + Sanity (HP, starts 1000, +2/s passive regen).
  - **5 eras** gated by CPE thresholds (0 → 500 → 2,500 → 12,000 → 60,000):
    - **TALLY** (3000 BC, clay) — Tally Clerk / Abacus Slinger / Stone Bearer + Sling Post turret + The First Census (freeze 4s) + Tax Tablet Beast boss.
    - **SCRIBE** (1100 AD, vellum) — Quill Monk / Bell Notary / Parchment Knight + Crossbow Tower + Tithe Bell (90 AoE) + Auditor Bishop boss.
    - **QUILL** (1494, double-entry) — Italian Bookkeeper / Pamphleteer / Dual-Entry Captain + Brass Cannon + Form 4868 Extension (rewind 60s) + Form Inquisitor boss.
    - **SPREADSHEET** (1985, CRT) — Cubicle Drone / Calculator Sniper / Mainframe Tank + Server Rack + Spreadsheet Macro (turrets 2× for 6s) + Y2K Wraith boss.
    - **AI** (2025, Juno) — Junior Associate / Compliance Bot / **Senior Partner** (apex 18,000 BH) + Juno Advisor turret + Audit Override (instakill non-bosses) + **The Deadline** finale (38k HP cosmic clock).
  - **Calendar**: 14-min real-time run mapped Jan 01 → Apr 15. Mid-era bosses spawn at 2:30 / 5:00 / 7:30 / 10:00 if you've reached that era; finale at 12:30. HUD shows the current calendar day + phase label.
  - **Combat loop**: spawn units (1–3 keys) to march right; place turrets on 3 mounts (4 key); kill enemies for BH+CPE; survive the Deadline.
  - **Specials**: Space fires the current era's special (45–60s CD).
  - **Era backdrops**: cuneiform marks (Tally), illuminated arches (Scribe), ledger ruling (Quill), CRT phosphor grid + scanlines (Spreadsheet), neon orbs (AI). Era-tinted CSS variable drives the title shadow + hud accents + card borders.
  - **Aesthetic**: parchment/paper base with 11°/101° fiber grain + multiply blend. Bungee for title, IM Fell English glyphs, Special Elite typewriter body, JetBrains Mono HUD. 3px ink-shadow chunky buttons.
  - **Accessibility**: rem units throughout, semantic main/header/section, role="application" on canvas + control summary aria-label, aria-live on status row, focus-visible outlines in era color, 2.75rem min interactive targets, prefers-reduced-motion kills toast/transition animations, skip link.

## issues
- Office "wall" damage is per-second tick (one chew = e.atk dmg every 1s) — feels right but multiple stacked melee can pile up at the door. Acceptable for v1.
- Final boss currently spawns at 12:30 OR fallback at 14:00 — if player advances slowly and is still in age 1 by 12:30, the Deadline still spawns and will likely wipe them. That's intentional per the design ("April 15 at midnight is non-negotiable") but could be telegraphed harder.
- Senior Partner apex (18,000 BH) is intentionally aspirational — most runs won't see it. Consider lowering once playtested.
- No audio crossfade on era change — sfx.era() plays a fanfare but the bg drone (none implemented) doesn't shift. Could add later.

## todos
- Visual age-up of the office (sprite re-skin already varies palette but could grow taller per era).
- Boss telegraphs (3-2-1 "RETURN ON THE WAY" warning before each boss spawn).
- More units per era (currently 3 + 1 turret; design doc had 3-4 turrets per age — can add).
- IRS / Client / Horror enemy faction tagging in the HUD (the data is there, not surfaced).
- localStorage best-time / best-era-reached.
- Crisis events (random "tax form change" toast that disables one unit type for 10s).
- Multi-phase Deadline boss (current implementation is a single big bag of HP — design called for multi-phase).

## design-notes
The gist (paul-rinaldi/aa42373852b6769c7b4d79647d9118a1) framed this as Age-of-War-but-tax-accountants. The fun pivot is that every era has the same lane-defense skeleton but a totally different vocabulary — clay tablets become spreadsheets become Juno-branded AI assistants. Kept the canvas-2D + emoji-glyph approach so 17+ unique sprites cost ~zero asset bytes.

The Juno suite reference in age 5 is deliberately generic ("Juno Advisor") to avoid unlicensed product naming — the design doc itself flagged licensing as an open question. If/when chat wants the full 4-piece suite (Preparer / Reviewer / Assistant / Advisor), we can add 3 more turret options gated by sub-CPE thresholds within age 5.
