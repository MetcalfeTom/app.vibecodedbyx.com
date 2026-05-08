# neon-harvest

## log
- 2026-05-08: shipped — cozy real-time garden with chill growth cycles (chat ask: "create a neon-harvest app for the desktop with chill growth cycles"). 5×4 grid of 20 plots; click an empty plot with a seed selected → plant; click a growing plot with the watering can selected → water (+50% growth for 30s); click a ready (gold-ringed bobbing) plot → harvest for coins. Boot bankroll 50 coins. **Real-time growth**: each plot stores a `plantedAt` ms timestamp; growth percentage = `(now - plantedAt) / seedGrowMs` per tick (1Hz); closing the tab and reopening continues growth where it left off — no idle-game grinding required, just check back when you remember. Watered phase contributes 1.5× to effective elapsed time, computed analytically rather than integrating per-tick so a single `wateredUntil` field suffices.
  - **5 seed types**: 🌱 sprout (cost 2c · 30s · pays 4c, lime glow), 🌻 sunflower (6 · 90s · 14, gold), 🍄 mushroom (8 · 120s · 22, pink), 🌹 rose (14 · 180s · 38, rose), 🍓 berry (20 · 240s · 60, hot rose). Payout multipliers were tuned so each tier is roughly 2× hourly rate of the next-cheaper, with rose/berry needing patience to compete with quick-cycling sprouts; chat can rebalance.
  - **Watering can** (💧, dashed-border tool button): grants the selected plot a 30s window of +50% growth speed; re-watering refreshes the window. Visual cue = cyan border + cyan inset glow on the plot.
  - **Growth visuals**: each plot has a `conic-gradient(from -90deg, ring-color N%, transparent)` progress ring rendered via `::before` pseudo-element, masked to a circular border-stripe (radial mask 70% transparent → black). Ring colour switches to lime when ready. Stage glyph cycles through `· ⋅ ↟ ↟` quartiles before the actual crop emoji appears at 100%. Ready plots gently bob via `bob` keyframe (1.6s ease-in-out) so the eye is drawn to them. `prefers-reduced-motion: reduce` no-ops both the bob and the harvest float-up coin animation.
  - **HUD pills** (top-centre): coins (gold), harvested (lime crops counter), growing (cyan in-progress counter). aria-live=polite so screen readers announce updates.
  - **Persistence**: full state saved to `localStorage['neon-harvest-v1']` `{coins, cropsHarvested, plots, selectedSeed}` on every mutation. Plot timestamps survive reloads.
  - **Audio**: 4 gentle Web Audio synths — plant (440Hz triangle + 660Hz sine pair), water (900→720Hz triangle pair), harvest (3-note triangle arpeggio C5-E5-B5), error (220Hz sawtooth blip). Lazy-init on first user gesture.
  - **Activity log**: bottom panel shows the last 8 events (planted X in plot N · watered plot N · harvested X · +N coins · etc.) with colour-coded lines (lime for harvests, cyan for plants/water, gold for hints, dim for misses). Boot logs "★ neon harvest · plant a seed to begin ★".
  - **Reset garden**: footer button wipes all plots and resets coins to 50 with a confirmation prompt.
  - **Aesthetic**: deep navy `#0a0420` base + 3 radial glows (pink/cyan/violet) + dotted grid mask; soil-purple gradient garden frame with inner shadow; Fraunces italic "neon harvest" with the lime non-italic accent; Bricolage Grotesque body; JetBrains Mono pills + log; emoji crops with per-seed drop-shadow glow tint.
  - **Accessibility**: rem units, semantic `<main>`, `<header role=banner>`, `role="grid"` on garden, `role="group"` on seed picker, `aria-label` on every plot + button, `aria-pressed` on the seed/tool toggle, `aria-live="polite"` on HUD pills + log, focus-visible cyan outlines, ≥2.4rem touch targets on seed buttons + plots.
  - **Sloppy-desktop integration**: 🌱 dock icon added to `apps/sloppy-desktop/` that spawns a 720×560 window containing an `<iframe src="../neon-harvest/">`. The iframe runs the standalone app independently — its localStorage is the same `neon-harvest-v1` whether opened directly or via the desktop, so progress carries across both entry points. `open harvest` also added to the desktop terminal's `open` command.

## issues
- Iframe inside sloppy-desktop loads a full second copy of the app per window. Fine for one window; opening multiple harvest windows would each have their own DOM but share localStorage, which would race on save. Not a real concern at one-window-per-user.
- Watering math approximates the boost as a linear multiplier over the watered window. If a plot is watered after some growth has already accumulated, the math is correct (time-segmented). Edge case: re-watering before the previous window expires resets `wateredUntil` rather than extending — by design, simpler model.
- Five seed tiers may feel sparse over time. A "compost" / quality multiplier would add depth without breaking the chill vibe.
- No "ripe-but-rotting" mechanic — once ready, plots wait forever. Could add a 2× growth-time decay to crops left unharvested, but that fights the chill ethos.
- 1-second tick means the progress ring updates jaggedly at small plot sizes. requestAnimationFrame would be smoother but eats battery.

## todos
- Decoration pass: tiny ambient particles drifting across the garden frame.
- Sprinkler upgrade: an unlockable item that auto-waters all plots every minute for a coin cost.
- Greenhouse expansion: spend N coins to unlock a 2nd 5×4 grid.
- Seed shop modal with rare seeds (🌷 tulip, 🥕 carrot, 🎃 pumpkin) priced higher.
- Daily-streak bonus that grants a free seed when the user opens the app on consecutive calendar days.
- Music toggle — soft synth pad / lo-fi loop.
- Pollinations-rendered crop art for harvest reveal (one-shot per crop type).
