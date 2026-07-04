# floor-is-lava (Floor Is Lava)

## log
- 2026-07-04: shipped (chat ask: "randomly turns parts of the page bright red zones every few seconds, with a score counter for how long someone avoids standing on lava — make the red sec[…]" — truncated; interpreted the cut-off as telegraphing, so red zones WARN first). 
  - **Floor**: fullscreen CSS grid of stone tiles (70–110px adaptive). Tile lifecycle: stone → **amber warning pulse** (1.4s → 0.65s as difficulty ramps) → **bright lava eruption** (bubbling gradient + glow, 2.6–4s linger) → cooling ember → stone.
  - **You = your pointer** (🧍 marker follows cursor/touch; 💀 on death). rAF collision: pointer's tile in `lava` state → death. 1.8s grace at start.
  - **Difficulty curve** (full spice at 75s): eruptions per round 1 → ~14% of the floor, round cadence 2.2s → 0.9s, telegraph shrinks. Reduced-motion keeps a fixed generous 1.5s warning and kills pulse/bubble animation.
  - **Score**: seconds survived (HUD, tenths) + eruptions counter + best persisted to localStorage. End overlay: CRISPY / NEW RECORD, eruptions dodged, HOP BACK ON.
  - **Audio**: warn tick (square blip), eruption (noise whoosh + saw rumble), death sizzle (bright+mid noise + descending saw). Unlocked on start button.
  - Aesthetic: volcanic — Bakbak One display, cracked-stone tiles, lava yellow-core gradients. WCAG: role=application with instructions, buttons, focus-visible, reduced-motion path.
  - Verified: JS syntax OK, all getElementById ids present.

## issues
- On touch devices your "feet" stay where you last touched — lifting your finger doesn't save you (intentional: that's the game).
- Resize mid-game doesn't rebuild the grid (avoids cheating by resizing); rebuilds between runs.

## todos
- Safe-tile shrink mode ("sudden death" where stone tiles become scarce).
- Two-player split-screen chaos.
- Global leaderboard (Supabase, derived counts).
