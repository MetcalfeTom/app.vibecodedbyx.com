# gem-cascade (Gem Cascade)

## log
- 2026-06-28: shipped (chat ask: "bejeweled clone, dark theme no neon, achievement system, cascade multiplier for four-in-a-row; + szymcioooo wants a 1000-gem mode and a survival mode"). ORIGINAL match-3 (genre mechanic) with own faceted-gem art — not Bejeweled assets/name.
  - **Engine**: 8×8 canvas (DPR-scaled), 6 gem types each a distinct SHAPE + muted jewel colour (ruby diamond / sapphire circle / emerald rounded-square / amethyst hex / topaz triangle / quartz oval) — shape+colour = colourblind-friendly, faceted via gradient + highlight + specular. Offset-ease state machine: idle→swap→(clear→fall cascade)|revert. `findMatches` scans rows+cols for runs≥3 (returns set + count + maxRun); illegal swaps auto-revert; gravity `collapse` + refill with fall offsets; `hasMoves` auto-reshuffle when stuck; `fillNoMatch` seeds a match-free board. Verified in node: 0 initial matches, 4-run detected, 0 holes after collapse.
  - **Cascade multiplier (four-in-a-row)**: score = `count·10·combo·runMult` where runMult = ×2 for a 4-run, ×3 for 5+. A gold "FOUR/FIVE IN A ROW · ×N" flash pops over the board. `combo` increments per cascade step (maxCombo tracked).
  - **3 modes** (mode-btn bar): **Endless** (chase the cascade), **1000 Gems** (goal line counts down from 1,000; win overlay on reach → "Millennium" achievement), **Survival** (a heat meter drains over time, ramping faster the longer you last; each clear refills it `min(40, count·3.6)`; hits 0 → Game Over overlay with survived-time/gems/score). Survival meter shown only in that mode; play timer for the 1000-gem result.
  - **Achievements (11, localStorage `gem-cascade-ach-v1`)**: First Spark, Four-in-a-Row, Five Aligned, Chain Reaction (×3 combo), Cascade Master (×5), Gem Collector (100), Vault Keeper (500), Survivor (60s survival), Jeweler (5k), Crown Jewels (25k), Millennium (finish 1000-gem). Sidebar list (dim→gold on unlock) + gold toast + chime. `surv60` is checked each survival second; others on clear / endgame.
  - **Aesthetic**: dark, NO neon — slate `#14161b`, panels, **gold `#c9a44c`** accent, Cinzel display + Cormorant italic taglines + IBM Plex Mono HUD. Subtle audio (select blip, combo-pitched clear, achievement chime).
  - **WCAG**: canvas role=application + control-summary aria-label, role=group on modes, aria-live goal/overlay/toast, focus-visible gold, mode buttons ≥2.4rem, rem units, prefers-reduced-motion eases toast only.
  - Verified: syntax OK; engine + runMult unit-tested; 11 achievements; all mode/overlay/survival wiring present.

## issues
- Survival drain ramp (`SURV_DRAIN0 + survivalTime*0.16`) is a first pass — may need tuning for difficulty feel.
- maxCombo/bestMatch reset each new game, so combo/4-run achievements must be earned within one game (intended).
- No move-limit/score-attack timer mode yet (could add).

## todos
- Special gems (clear-row/clear-colour) from 4/5 matches, like the genre.
- Score-attack (60s) mode; daily seed.
- Per-mode high scores in localStorage.
- Tune survival curve; add a "danger" pulse when the meter is low.
