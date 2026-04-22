# Slime Melt

## log
- 2026-04-22: Created. Physics-based goo-painting toy. Drag anywhere to drip neon slime that falls, pools, sticks, and merges via metaball rendering. **Metaball technique**: 3 stacked canvases — `#scene` (static metal ledges + grid + floor), `#slime` (soft radial gradients per particle, with CSS `filter: blur(7px) contrast(22) brightness(1.08) saturate(1.35)` applied to the whole canvas), `#shine` (sharp upper-left highlight blobs with `mix-blend-mode: screen`). The blur+contrast on the slime layer auto-merges overlapping soft blobs into sharp gooey clusters — the classic 2D metaball cheat. **Physics**: particle system, max 1400. Each particle `{x, y, vx, vy, r:8–12, color, stuck, age}`. Integration: `vy += gravity*dt` (default 780), horizontal damping `0.985^(dt*60)`, vertical damping `0.992^(dt*60)`. **Particle-particle**: spatial-hash grid (24px cells), soft circle–circle resolution at `(ra+rb)*0.82` minimum distance with 0.5 overlap split + viscous normal impulse (relVel×0.35). **Platform collisions**: AABB-closest-point to each particle circle, push out along normal, kill `vDotN×1.2` of velocity, then `vx *= 0.78` horizontal friction. If the normal points upward (`ny < -0.7`, i.e. particle sitting on top of a platform), extra `vx *= 0.86` friction and clamp tiny `|vy| < 30` to `vy = 12` for that slow syrup-ooze creep. Walls bounce at 0.2 restitution. Particles are flagged `stuck` when barely moving and touching anything — stuck particles on the floor skip physics to preserve framerate. **Spawn**: drag-to-paint pipe spawns `flow` (1–6) particles per move event at 16ms throttle, with position jitter ±14/±8 and velocity inherited from drag direction (×0.45) + downward bias. `flow` slider controls drip density; `gravity` slider 0–1600. **Colors**: 5 neon fills (lime #7dff5b / pink #ff3ea0 / cyan #3efffb / amber #ffc233 / violet #b368ff) + "rainbow mix" mode that randomizes per particle for tie-dye pours. Each color has matching `light` (highlight) and `dark` (unused, reserved) tones. **Scene**: 7 static metal ledges — 3 lanes (0.28/0.5/0.72 of H) each with 2 staggered platforms + 1 high narrow ledge at H*0.16 + floor bar at H-28. Platforms drawn w/ linear gradient (`#3b4256 → #232836 → #13161f`) + top rim highlight + decorative bolt dots. **UI**: Rubik Moonrocks "SLIME MELT" title in lime with triple-offset ink shadow + Fredoka "drag · drip · ooze" subtitle; controls panel backdrop-blur with color swatches, flow slider, gravity slider, clear + shake buttons. "Shake" = 28-amp CSS translate wobble on `.stage` for 1.5s + kicks all particles with random (-210 to +210) vx and -360 to 0 vy (unsticks everything). Drop counter top-right. Hint bottom-center fades on first drip. **Seed demo**: 14 random-colored drops from top center spawn on load for instant visual. Palette: deep navy bg (#060810 → #0d1426 → #111a2e), metallic ledges, 5 neon slimes, lime/pink/cyan accents. Rubik Moonrocks + Fredoka + JetBrains Mono. Mobile-friendly (touch-action none, responsive chrome, panel scales down).

## features
- Drag to paint slime anywhere
- Metaball merging via CSS filter: blur + contrast (classic 2D trick)
- Real 2D soft-body physics: gravity + particle-particle collisions + platform collisions
- Slime drips and oozes down ledges with sticky friction
- Pools on floor, stacks on itself, merges into gooey clusters
- 5 neon colors + rainbow mix mode
- Shiny highlight pass (screen-blended upper-left specular per particle)
- Flow slider (particles per drip event)
- Gravity slider (0–1600)
- Shake button wobbles the scene + launches everything in the air
- Clear button, particle count HUD
- Responsive: works fullscreen on desktop and mobile

## issues
- CSS `filter: contrast(22)` is expensive on large viewports — can drop below 60fps with 1000+ particles on weaker GPUs.
- The contrast filter also slightly clips colors near the edges of blobs; `saturate(1.35)` compensates but ultra-pastel hues look flatter than their source.
- Particle-particle collisions are iterative single-pass (no substeps), so very dense piles can jitter slightly. Adding substeps would smooth but halves perf.
- "Stuck" particles on floor are frozen after 60 stuck-frames — they won't respond to new particles falling on top until shake is pressed. Trade-off for 60fps.
- Metaball filter doesn't work in very old browsers (IE/old Safari). Modern browsers only.
- Platforms don't have a "corner rounding" for the slime — it sometimes hangs a bit square at platform edges instead of forming a proper droplet. Minor visual nit.

## todos
- Drip droplet formation at platform edges (when enough mass accumulates, spawn a falling child blob)
- Heat mode: point a "flame" cursor at slime to re-liquefy stuck slime
- Colored light behind slime (screen-blend radial gradients) for even more glow
- Physics substeps for denser piles without jitter
- Export PNG of the current splatter
- Drawable platform mode: user sketches their own ledges
- Gravity vector toggle (sideways / upward / zero-G)
- Sound: viscous squelches when blobs merge, gentle splats on floor contact
- Particle radius slider (different slime sizes)
- "Two-tone" slime that blends across piles (true color mixing per pixel)
