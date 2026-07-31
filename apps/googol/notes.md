# Googol

## log
- 2026-07-31 v1: chat asked for "a clean math incremental — numbers grow, buy upgrades, minimalist UI". Swiss-minimal paper-white page, one giant Instrument Serif number, Klein-blue accent, hairline shop rows — no cards, no chrome. **The game IS the number line**: start at 1, click (+click power, Space works), buy 5 math-named upgrades (successor function +1/click · addition engine +1/s · multiplication ×2 all · d/dt engines compound +1%/s · exponent lever ×10 all; costs scale 1.55×–80×, keys 1–5). **Milestones are real numbers**: π, 42, 365.25, 1729 taxicab, 86,400 s/day, 10⁶, Avogadro 6.022×10²³, sand grains 7.5×10¹⁸, atoms 10⁸⁰, and the goal 10¹⁰⁰ — each toasts in italic serif and logs in "numbers passed". **Prestige = "take the limit"**: at ≥10⁶, gain κ = floor(log₁₀N)−5−κ; each κ is a permanent ×2; resets run (keeps milestones). Win overlay at a googol: "you have counted enough" (keep counting or take the limit). Formatting switches to superscript scientific past 10⁶ (m×10ⁿ with Unicode sups). Fixed 10Hz simulation with catch-up cap; d/dt compounds a per-run apsGrow factor (ceiling 10⁶). Offline progress: base engines × away-time (8h cap), milestone toasts fire first then the "while you were gone" summary stays visible (test caught the overwrite). localStorage save 5s + on hide. 17/17 checks green: formatting, cost scaling, multiplier stacking, d/dt compounding, milestone triggers, limit math (κ gain/subtraction, reset-keeps-κ), win trigger, persistence, offline path.

## issues
- Numbers use doubles — safe to 10³⁰⁸, way past the 10¹⁰⁰ goal; if chat demands beyond-googol content, switch to log-space representation first.
- apsGrow (d/dt compounding) is per-run and intentionally not saved — reload resets the compound factor but not levels; treat as "the derivative needs re-warming" flavor if asked.

## todos
- A second prestige layer (ordinals? ℵ₀ joke) only if chat pushes past googol.
- Subtle tick sound toggle (off by default).
- Buy-max on shift-click.
