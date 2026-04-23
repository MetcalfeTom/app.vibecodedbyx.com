# Orbitorium

## log
- 2026-04-23: Created. Chaotic particle physics sandbox. **1200 default / 2000 max particles** on a full-screen canvas, rendered via additive `globalCompositeOperation='lighter'` over a trail-fade overlay (adjustable 2–30% alpha `fillRect` per frame). **3 well types** placed by clicking: **Attract** (pink `#ff5ea1`, pulls particles inward), **Repel** (cyan `#5ec2ff`, shoves outward at 1.2×), **Hole** (amber `#ffdf5e`, pulls at 1.6× AND consumes particles within 22px → respawn from random edge with inward velocity). **Physics**: `F = G·mass/r²` with softening (`r² + 1600` denominator) to prevent singularities, `G=26000`, attract adds `+F`, repel adds `-F·1.2`, hole adds `+F·1.6`. Per-frame: integrate accel → damping ×0.998 → position step → bounds wrap (or bounce if wrap off). dt clamped to 0.05s to prevent tab-background explosion. **Rendering**: each particle is a 2–3px radial-gradient dot in HSL hue (static mode uses particle's birth-hue; rainbow mode maps speed→hue 180–360). Glow mode boosts outer shadow radius 1.6×. Wells draw as halo + concentric rings + rotating arrow lines (inward tick for attract, outward for repel). Black holes draw 3 rotating accretion rings (amber / orange / red) + pitch-black event horizon disk + thin amber rim. **Interactions**: click = place well (current tool), drag on existing well = move it, shift-click = delete, right-click on empty = cycle tool, right-click on well = delete. **Keyboard**: Space = burst 120 particles radial at cursor, R = reset (clear wells, reseed 1 attract at center), C = clear wells only, W = toggle wrap, G = toggle center pull (mild gravity well at viewport center), H = toggle rainbow, 1/2/3 = select tool. **Audio**: Web Audio synth — sndPlace (type-pitched: attract 320Hz tri, repel 480Hz tri, hole 120Hz saw + noise), sndPop (880Hz blip on well delete), sndBurst (200→60Hz sub + noise sweep on spacebar), sndReset (descending sine), sndSwallow (60ms 180Hz blip, throttled 120ms to avoid audio spam when many particles consumed at once). ♪ toggle top-right. **UI**: top-left brand with Syne Mono eyebrow "PARTICLE · SANDBOX · ∞" + Major Mono Display "ORBITOR**I**UM" title (I in amber) + Cormorant Garamond italic tagline "Drop wells. Slingshot stars. Feed a black hole. The only law is pull." Bottom toolbar: 3 tool pill buttons (active glows in tool color), burst/reset/clear actions, settings gear toggle. Settings panel (slide-up): particles count slider (100–2000), gravity strength (0–2×), trail fade (2–30%), 4 pill chips (wrap/center/rainbow/glow). Top-right HUD: live particle count / well count / FPS in Syne Mono. **Seed scene**: 1 attract well at viewport center + 1200 particles placed in a random 400-radius cloud around center with small random tangential velocity so they immediately start orbiting. Hint bar "click to place a well · drag to move · shift-click to delete · space = burst" fades after first interaction. **Mobile**: @720px breakpoint — toolbar wraps, title shrinks, tool buttons become icon-only. `touch-action:none` on canvas for drag physics. Pollinations OG.

## features
- 3 interactive well types (attract / repel / black hole) with distinct visuals
- Up to 2000 particles with real inverse-square gravity + softening
- Black holes consume + respawn particles continuously
- Space-bar cursor burst for instant chaos
- Rainbow speed-mapped coloring toggle
- Adjustable trail fade for painterly or crisp trails
- Center-pull option for "always returns home" mode
- Wrap vs bounce boundary modes
- Keyboard + mouse + touch controls
- Mobile-responsive toolbar

## issues
- Particle count >1500 on low-end mobile can drop below 30fps — gravity math is O(n·wells), wells rarely exceed 6, so this is mostly render cost (glow shadowBlur is the hog).
- Two wells very close together can launch particles at near-relativistic speeds before damping catches up — intentional chaos but can cause visible tunneling through walls.
- Black hole at screen edge + wrap off can starve as consumed particles respawn from random edge and immediately get sucked back in — creates a "feeding frenzy" on that edge.
- Trail fade at 2% with hundreds of fast particles looks like full motion-blur smear; crank to 10%+ for crisp.
- `sndSwallow` throttle is 120ms — with 10+ particles consumed in one frame you only hear one blip. Intentional.

## todos
- Spinner wells (tangential force, make particles orbit not fall in)
- Collision between particles (currently pass through each other)
- Save/load scene as URL hash
- Record a short GIF/WebM of the current canvas
- Preset scenes dropdown (binary stars, galaxy spiral, accretion disk)
- Particle trails with proper stored history instead of fade overlay
- Gravity well mass slider (per-well, not global)
