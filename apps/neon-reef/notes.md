# neon-reef · notes

## log
- 2026-05-19: v1 — **Neon Reef** per stacked chat asks "build a generative neon coral reef app that grows when the mouse moves" + "build a bioluminescent coral reef that grows where the user clicks, with pulsing neon polyps and a slow deep sea ambient drift". Self-contained ~23KB single file, zero deps.
  - **Generative coral builder** · each coral is a list of segments grown procedurally. Trunk starts at the click point pointing up. Each tick (cadence ~50–180ms scaled by coral intensity), `growStep(coral)` picks a recent leaf segment (biased toward the freshest 45% of leaves so new branches keep stacking up, not infill old corals), sprouts a child at parent-angle + random spread (~0.6–1.1 rad), tapered to 86% of parent thickness with a gentle up-bias (15% nudge back toward straight-up) so corals don't fold sideways. Each new segment animates in over 180–320ms with `easeOutCubic` so growth feels organic, not popping.
  - **Click vs drag intensity** · `pointerdown` = intensity 1.0 (max segments 82, faster sprout cadence, bigger pulse flash, bloop sound). `pointermove` with accumulated 110px distance + 220ms cooldown = intensity 0.4 (lighter coral, ~22 segments). Both seed at the cursor.
  - **Pulsing neon polyps** · every leaf segment (children === 0) and fully grown draws a polyp dot at its tip. Polyp radius pulses with `sin(time * 0.004 + (x+y) * 0.013)` so each polyp pulses on its own phase. Inner pip is brighter (almost white) for the bioluminescent core; outer halo is the coral hue with shadowBlur for glow.
  - **Slow deep-sea drift** · 70 plankton particles drift slowly upward (-10 to -35 px/s) with horizontal sin-wobble; brightness flickers on each plankton's own clock. Corals themselves sway with `sin(time * 0.0006 + swayPhase) * swayAmp` applied per-segment scaled by depth (deeper = more sway). Tip-bias on render so root stays anchored.
  - **Sprout flash** · each new segment emits an expanding pulse ring at its base (radius grows from 14 → ~70px over 0.55s, fades alpha to zero). Click-spawn emits a bigger one (22 → 110px, 0.9s).
  - **Scene** · radial-gradient deep-ocean background (deep blue at top → near-black at bottom), 3-pseudo-caustic radial highlights drifting on slow sin/cos (additive blend at 5% alpha) for the underwater light feel.
  - **Audio** · 5-voice low chord drone (41.2/55/82.4/110/138.6 Hz sine + triangle) through LFO-swept lowpass for that submerged ocean feel. Per-sprout: short sine tick (hue→frequency mapping). Per-click: triangle bloop sweep. MUTED by default; toggle via the ♪ button in the corner (button text turns ♬ when on).
  - **Performance** · `MAX_CORALS = 80` cap with FIFO shift when exceeded, plankton/pulse arrays capped, DPR clamped to 2, `dt` clamped to 50ms to avoid tab-out catch-up jank. Each segment uses one `shadowBlur` glow stroke + one bright core overlay — ~3000 strokes/frame at peak handled at 60fps on mid-range.
  - **UI** · Major Mono Display title "NEON · REEF" with chromatic-aberration text-shadow (magenta/cyan offset + cyan glow), Cormorant Garamond italic tagline, JetBrains Mono stats (coral/branch/polyp counts updated 4x/sec). Top-right pill-style buttons: reset / save PNG / drone toggle. Bottom-right italic hint "drag, tap, or click anywhere to seed" fades on first interaction. HUD slightly fades during interaction to keep the canvas the star.
  - **Touch + mouse** · all input via `pointermove/down/up` so phones work natively. Cursor is `crosshair` to telegraph the canvas is interactive.
  - **WCAG basics** · semantic main/canvas (with aria-label), focus-visible cyan outline 2px, prefers-reduced-motion kills transitions, ≥2.4rem button hit areas, 720px breakpoint shrinks the HUD/title for phone screens.
  - **OG image** · Pollinations flux (no `referrer` per project notes).

## issues
- The 80-coral cap with FIFO shift means old corals just vanish — could fade them out over a few seconds for a softer retirement.
- shadowBlur stroke per segment is the perf hotspot; on very weak devices the canvas can drop under 30fps at peak coral count. Acceptable for v1 but could pre-render each coral to an offscreen canvas and just blit on later frames.
- The audio drone gets denser as you spawn more corals (one tick per sprout). Could throttle to ~10 ticks/sec max.
- Plankton sometimes drift through corals; intentional underwater feel but some users may want occlusion.
- No persistence — reload wipes the reef. Could save to localStorage if anyone asks.

## todos
- Multiple coral species: fan corals (planar arc with parallel branches), tube corals (vertical pillars with concentric pulse rings), kelp strands (long swaying chains).
- Mouse-velocity → species mapping (slow = fan, medium = branch, fast = whip).
- Bigger/persistent polyps that occasionally release a glowing seed particle upward.
- A passing school of fish (small triangular silhouettes) that flock with boids and occasionally swim through the field.
- A "tide" timer that gently rocks all corals every ~12s for an extra layer of life.
- Shareable seed URLs (hash → deterministic palette + spawn list for a recreatable reef).
- Click-and-hold to grow a single super-coral in place rather than seeding multiple.
