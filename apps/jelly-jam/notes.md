# jelly-jam

## log
- 2026-05-30: initial build. Soft-body physics playground with chaotic gravity. 14-point perimeter-spring rig per jelly (puyo-physics-style), center body + per-perimeter springs (k=28) + neighbor cohesion (0.22). 6 fruit-flavored palettes (berry/lemon/lime/plum/sky/orange) each with body/highlight/lowlight/face colors. **Gravity modes**: down/up/cursor (pulls toward pointer)/vortex (tangential swirl around center + slight pull)/zero/chaos (smoothly rotating vector with random jolts). Mode chip + SVG arrow indicator with live rotation. Click to drop; drag a jelly to rubber-band it (dashed line preview); throw on release. **Squash injection** = on wall + jelly-jelly impacts, perimeter points aligned with impact normal get pushed inward (k = min(0.5, mag·0.0035)) while perpendicular points get small wobble — produces convincing splat on collision. Web Audio synth: sub-sine thump (160→70Hz, 0.18s exp decay) + bandpass-filtered noise burst (Q=1.4) per squish, throttled to 35ms. Pop synth on spawn. Eyes track velocity, blink every 3–8s; smile flips to surprise when launched/falling fast. Soft drop-shadow under each jelly (blur 2.5px). Stats: live count / chaos meter (avg speed normalized, EMA-smoothed) / squish counter. Keyboard: 1-5 + C = gravity, Space shake, D drop, R rain (12 jellies staggered 70ms), X clear, M mute. **Aesthetic**: warm zine-paper (`#f4e8d0` cream + dot grid), Bowlby One SC title with CMYK-shift triple shadow (berry+sky), Space Grotesk body, JetBrains Mono stats, chunky 0-radius stamped buttons with 2-3px hard offset shadow + ink-press effect. WCAG-AA: semantic markup (`<main>`/`<h1>`/`<header>`/`<nav>` + `<button type=button>`), aria-pressed on gravity toggles, role=status + aria-live on stats + sr-only announcement region, role=application + descriptive aria-label on canvas, focus-visible berry outline 3px, 2.75rem min touch targets, prefers-reduced-motion kills arrow transition + collapses title shadow.

## issues
- chaos mode + lots of jellies (≥40) can produce high chaos scores that overshoot the perimeter springs briefly — clamped via DAMP/SPRING_K but visible on slow devices
- vortex mode arrow indicator rotates continuously which conflicts slightly with the cubic-bezier transition; intentional (looks alive)
- pollinations OG image is a flux-generated risograph mock — may take a cold-load minute the first time

## todos
- gravity flip on impact mode (gravity inverts every N seconds tied to chaos meter)
- "freeze frame" toggle so users can pause and admire a chaotic moment
- color-swap on impact (cross-pollinate palette between two colliding jellies)
- jellies that grow when they eat each other (mass merge mode)
