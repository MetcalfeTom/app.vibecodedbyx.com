# solar-sandbox (Solar Sandbox)

## log
- 2026-07-04: shipped (chat ask: "full interactive solar system simulator with adjustable mass, gravity, and size for each planet — realistic n-body physics, all hand-rolled canvas, no libraries"). ZERO external scripts.
  - **N-body physics**: every body attracts every body (full O(n²) pairwise), semi-implicit (symplectic) Euler with 6 substeps/frame + softening (SOFT2=4). **Stability verified headlessly**: Earth seeded at r=150 stays within 149.9–150.5 over ~90 sim-seconds; Mercury stable at 70. System momentum zeroed at seed (sun gets counter-velocity) so nothing drifts.
  - **Bodies**: Sun + 8 planets, REAL relative masses (Earth=1: Jupiter 318, Saturn 95…, ×0.18 vs a 60k sun so mutual perturbations exist but the default system is stable), circular-orbit seeding `v=√(GM/r)`, Saturn gets a ring, sun gets radial glow.
  - **Per-planet controls** (click a body or its chip): **mass ×0.01–×1000** (log slider — crank Jupiter and watch the system destabilize), **size ×0.2–×8** (visual + collision radius), focus camera, remove (sun non-removable).
  - **Universe controls**: gravity G ×0.1–×10 (log), time speed 0–×3, pause, trails toggle (ring-buffer polylines, 340 pts planets / 160 asteroids), reset (also restores G).
  - **Asteroid fling**: drag from empty space = dashed aim preview → releases a 0.02-mass asteroid at 1.6× drag velocity. **Collisions merge** (momentum-conserving, volume-additive radius, larger body wins the name; merged counter in HUD; sun happily eats infalling planets).
  - **Camera**: wheel zoom-to-cursor (0.12–8×), right-drag pan, focus button. Deterministic cheap starfield. FPS + body counters.
  - Mobile: 🪐 tab toggles the control panel; tap selects, drag flings.
  - WCAG: role=application canvas w/ instructions, aria-pressed toggles, labelled sliders, focus-visible.
  - Verified: syntax OK, zero libs, ids present, orbital stability test green.

## issues
- O(n²) pairwise — fine up to a few hundred asteroids; would need Barnes-Hut beyond that.
- Cranking mass/G to extremes with high time-speed can slingshot bodies to infinity (physically honest; reset exists).
- Two-finger pinch zoom not implemented (wheel only); mobile relies on buttons/fling.

## todos
- Pinch zoom.
- Velocity vectors toggle + per-body speed readout.
- "What-if" presets (binary sun, rogue Jupiter, no Neptune).
- Barnes-Hut if chat demands asteroid fields.
