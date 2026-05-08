# gravity-gulp

## log
- 2026-05-08: shipped — high-speed orbital eat-em-up (chat ask: "create a high-speed orbital physics game called Gravity Gulp where you must swallow smaller planets to grow"). Single-screen full-viewport canvas; ~70 procedurally-coloured planets orbiting a central black hole; player is one of them. Goal: reach mass 50 = ignite as a star. Lose if eaten by a bigger body OR fall past the event horizon.
  - **Physics**: black-hole gravity `F = G·M/r²` with softening (`d² + 0.1`) to avoid singularity. Player + every body feel BH pull every frame. `applyOuterPullback` softly tugs strays back when they fly past `d > 2100u`. Speed capped at 1100u/s for player, 900u/s for other bodies. Body-vs-body collisions: bigger eats smaller at 1.6× ratio (so similar-size bodies just bounce — keeps the field alive). Player-vs-body: 1.05× ratio so player can eat almost-equal bodies (more satisfying than 1.6×). Conservation of momentum on consume: `v_new = (m1·v1 + m2·v2) / (m1+m2)`. Area-conserving radius: `r = sqrt(m) × 5.6`.
  - **Player thrust scales inversely with mass**: `acc = 1100 / sqrt(mass)`. Small = nimble (acc ≈ 1100 at mass 1), big = lumbering (acc ≈ 156 at mass 50). The "high-speed" hook works because tiny players dart easily; growing trades agility for staying power. Pursuit-evasion dynamic emerges naturally.
  - **Boost** (Shift / Space / Ctrl / on-screen meter): 2.4× thrust multiplier while held, drains at 0.65/sec, regens at 0.18/sec when released — about 1.5s of boost from full, 5.5s to refill. Spawns ember sparks behind the player.
  - **Spawning**: bodies generated with mass `pow(rand(0.5, 8), 1.6)` → mass range ~0.33 to ~27.86 with heavy left-skew (lots of tiny food). Initial position random angle on radius `360–1700u` from BH; tangential velocity = `sqrt(G·M/d) · rand(0.55, 1.05)` so they enter orbit naturally (some elliptical). Top-up loop keeps body count ≥70.
  - **Black hole**: 9000 mass, 28u event-horizon radius. Visual: outer ember/violet halo glow, 36-segment rotating accretion disk (hue oscillates per segment via sine), cyan photon ring, pitch-black event horizon disk. Touching it = instant death + low-frequency descent SFX + screen shake.
  - **Camera**: lerp-follow player (factor 0.12). Zoom inverse-log of mass: `targetZoom = clamp(1.4 - log(m+1)·0.18, 0.55, 1.4)` so the play area scales out as you grow but stays interactive. Camera shake on big eats / death (clamped, killed entirely under `prefers-reduced-motion`).
  - **Bodies**: each gets a hue from one of 7 palette bands (ember/gold/jade/ice/azure/violet/magenta), procedural color {h, s, l}, optional Saturn-style ring (35% chance for mass > 4), 5 deterministic surface speckles (PRNG seeded from color), lit-side radial gradient + soft halo + 14-segment trail (8 under reduce-motion).
  - **Player visuals**: same body renderer + cyan pulsing aura ring + boost flame at thrust-rear when boosting. Distinctive ember body.
  - **Hazard telegraph**: when a much-bigger body is within 380u, the screen edges flash crimson with a sine pulse. SFX warn-pip plays occasionally at high proximity.
  - **HUD**: top-left mass card with `aria-live="polite"` value + mass-progress bar (0→50 gradient cyan→magenta→gold). Top-center timer. Top-right best-mass (localStorage). Bottom-right boost meter. Bottom-left brand title. Bottom-center pause / mute / restart / boost meter.
  - **Audio**: pure WebAudio synth — `gulp` (rising triangle, pitch scales with mass eaten), `near-miss` (square blip), `eaten` (sawtooth descent + bandpass noise), `fall` (deep sub-bass slide), `boost` (filtered noise), `warn` (high square pip), `ignite` (5-note triangle ascent). Lazy AudioContext on first gesture. Mute toggle.
  - **Win**: mass ≥ 50 → 60-spark gold burst + ignite arpeggio + "IGNITED" end card. **Lose**: eaten or fell into BH → "GULPED" / "SINGULARITY" end card. Stats: final mass, planets eaten, time, best.
  - **Controls**: hold mouse OR W/A/S/D to thrust; on touch, tap-and-hold thrusts toward the touch point. Shift/Space/Ctrl boost. P pause, R restart, M mute. `pointermove` updates aim cursor. `setPointerCapture` so dragging works smoothly off-canvas.
  - **Aesthetic**: Major Mono Display title "gravity gulp" (gulp in ember), Audiowide for HUD numerics + end card titles, Press Start 2P for tiny labels + boost lbl, JetBrains Mono body. Deep purple/black radial bg, ember halo around BH, 240 parallax stars across 3 layers (0.3/0.55/0.85 motion factors).
  - **Accessibility**: rem units, `<canvas role="application">` with descriptive `aria-label` covering controls + win condition, `aria-live="polite"` mass readout, `aria-pressed` toggles on pause+mute, `:focus-visible` outlines, 2.75rem min interactive targets, intro overlay is `role="dialog" aria-modal="true"`, `prefers-reduced-motion` kills screen shake + halves trail length.
  - **OG**: Pollinations cosmic preview (no `referrer` per project note).

## issues
- 70 bodies × 14 trail segments × ~60fps = ~58k line strokes/sec on the worst frame. Desktop fine; low-end mobile may stutter. If it does, the cheapest fix is to skip trail rendering for bodies far off-camera (already culled by w2sX bounds check, but the ctx ops still happen before culling — could move the cull check to before).
- Body-vs-body collision is O(N²) — at N=70 that's 2415 pairs/frame. Fine for now; if N grows beyond ~150 we'd need a spatial hash.
- Player can be spawned briefly on top of an existing body. There's a 1.5s post-spawn invulnerability window so no instant deaths from this, but a body might still bounce them weirdly. Could add a clear-radius check in `makePlayer`.
- Body-vs-body consume happens silently (no SFX) to avoid audio spam — 2415 checks/frame would be a stampede. Could add a low-volume click on big-body consumes.
- Mass distribution `pow(rand(0.5,8), 1.6)` heavily skews to small bodies, which means the early game is easy and the late game starves a bit. Tunable.

## todos
- Power-ups (boosters, speed orbs, micro-black-holes that briefly attach to your body and pull food in) sprinkled around the field.
- Hostile predator AI: bodies above mass 6 actively chase the player when within 600u.
- Comet hazards: occasional fast-moving lines that streak across and shred any body they hit.
- Online leaderboard (Supabase) — submit on win, show top 10 by best mass.
- Arena variants: binary-star map (two BHs orbiting each other), nebula-field (drag everywhere), asteroid-belt (debris between two zones).
- "Hyper-gulp" combo system: eat N bodies within 4s for a multiplier — encourages fast play.
