# solar-sandbox (Solar Sandbox)

## log
- 2026-07-04: **ISS LEO marker + real named moons** (chat ask). (1) **🛰 ISS**: cosmetic low-Earth-orbit marker — a pixel station (core + two solar-panel struts) riding Earth's LIVE position on a fast 0.9× angular orbit at radius max(earth.r+3, 9), with a translucent orbit ring + 44-point fading blue trail + 'ISS' label at zoom. NOT a physics body: Earth's Hill sphere here is smaller than its own drawn radius, so a simulated satellite would be sun-stripped — documented in-code. Toggle button, resets trail on toggle, tracks Earth even when Earth's orbit is perturbed. (2) **Real named moons** replacing the placeholder set: **Io + Europa** (Jupiter), **Rhea + Titan** (Saturn), **Titania** (Uranus), **Triton** (Neptune, seeded RETROGRADE like the real thing). Real relative masses (Earth=1); orbit distances COMPRESSED into each giant's ~⅓-Hill-radius stable zone. **Rigorously chosen**: a headless harness tested candidates over 3–5 sim-minutes — Ganymede, Callisto, Oberon all get solar-tide-ejected at their real ratios (min distance collapses toward 0 or escapes to 1000+), so they're honestly OMITTED. Final 6-moon set verified ALL STABLE over 5 sim-minutes (Io 11.9–12.8, Europa 14.8–18.1, Rhea 9.0–10.0, Titan 13.6–16.8, Titania 9.1–11.7, Triton 12.4–13.7). Physics wins; the code comments say which real moons couldn't make the cut and why. Verified: syntax OK, no ext libs, ids present.
- 2026-07-04 (rotetomate's asks): **grid + prediction trails + moons**. (1) **Background grid**: world-space lines every 100 units (adaptive ×2 spacing when zoomed out, cap ~60 lines), axes tinted blue, ▦ toggle. (2) **⇢ future toggle**: clones the live system each frame and runs the SAME `integrate()` forward 70 frames (physics refactored into a pure integrator reusable for prediction — real step keeps merging separate), drawing dashed per-body paths + endpoint dots. Live-updates as you drag mass/G sliders, works while paused — you can aim disasters before unpausing. (3) **Moons**: MUNIT 0.18→2.2 (real ratios preserved) so gas giants have workable Hill spheres; Jupiter/Saturn visual radii shrunk (9.5/8.5) so moon orbits clear the disc. Ship set = **Io (13), Europa (17), Titan (14)** — headless-verified over 2 sim-minutes: Io 12.8–13.7, Europa 14.8–18.0, Titan 12.8–14.7, Earth 141–159 (livelier but bound). **Ganymede honestly cut**: tested at 21/22/23, resonance-ejected by Io+Europa every time (2.5–481 range) — three packed moons don't fit the compressed scale. Rocky planets can't hold moons at all here (Hill sphere smaller than their drawn radius) — physics wins, documented in-code.
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
