# woolly-wander

## log
- 2026-06-02: initial build. **Cozy top-down sheep-herding game**. Tiny shepherd walks the pasture, marshmallow sheep flee from them, lavender pen in the bottom-right corner with an opening on the left. Each day adds one more sheep; 2-minute sundown timer.
  - **Sheep flock behavior**: per-tick (1) random wander direction re-rolled every ~1.4s, (2) FLEE from shepherd within 90px (falloff strength), (3) sheep-sheep avoidance within 26px, (4) mild cohesion within 80px. Velocity damped 0.85 and capped at 50px/s normally / 120px/s when fleeing.
  - **Pen entry** = sheep rect-test on the pen bounds → `penned=true`, happy-bounce squash + 6-puff wool burst.
  - **Penned sheep** wander gently inside the pen and bounce off the walls so the corral feels alive.
  - **Shepherd** moves with WASD / arrows (keyboard) or the virtual joystick (touch-only via `@media (hover:none) and (pointer:coarse)`). Walk-cycle bobs the hat 1px on alternating leg frames.
  - **Marshmallow sheep sprite**: 3 overlapping circles for the puff body + 3 fluff bumps for the outer cloud silhouette, pink face oval, 1×1 pixel eyes, brown legs. Bobs ±3px in idle, squash-scales 12% during the happy-bounce.
  - **Tiny shepherd sprite**: pixel-rendered straw hat (with rose ribbon), pastel rose tunic with crimson belt, pixel arms + walk-cycling legs, diagonal crook with curl. Eye-pixel flips to face movement direction.
  - **Day flow**: 3 + day sheep, 2-minute sundown. Win = all penned → next day. Loss = timer hits 0 with sheep still loose → reset to day 1 (best-day localStorage stays).
  - **Aesthetic**: peach sky strip → rolling hill silhouette → mint pasture, drifting clouds (4, looping horizontally), 40 grass tufts, lavender pen with polka-dot pattern + brown plank fence with corner posts + "PEN" label.
  - **Palette**: --sky #fcd8c0, --grass #c4e8a8, --pen #e8d8f8, --rose #f598b0, --fence #7a4a30, --cream #fff7e6.
  - **A11y**: rem-everywhere, semantic markup, role=status aria-live HUD, role=dialog overlays, aria-label on canvas describing controls, focus-visible rose outline, prefers-reduced-motion kills bob + cloud drift, 2.75rem touch targets, virtual joystick only shown on touch-primary devices.
  - Single self-contained ~28KB HTML, zero deps.

## issues
- No audio (yet) — a soft bleat on shepherd-contact + chime on penning would help the cozy mood.
- Penning is binary (in or out) — no "good push" feedback when a sheep gets closer to the gap.
- Difficulty curve is just +1 sheep per day. Could shrink the pen, add obstacles, or add a stubborn ram archetype.

## todos
- Web Audio synth: bleat (sawtooth glide), chime on pen entry, soft "tucked in" arp on day complete
- Lofi piano music engine (port from /pixel-paw-cafe) — toggleable bottom-right
- Pollinations OG image already wired (flux seed 8881)
- Day-night cycle visual: sky tints orange→indigo as timer ticks
- "Stuck inside" mechanic: penned sheep occasionally try to escape so day-N stays interesting
