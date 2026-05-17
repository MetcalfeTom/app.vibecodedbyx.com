# neon-velocity · notes

## log
- 2026-05-17: v1 — **retro synthwave endless racer with a scrolling circuit-board floor + glowing electronic-component obstacles** per chat ask: "build a retro synthwave racing game called neon-velocity with glowing obstacles and a scrolling circuit board floor." Single file ~32KB. Full-viewport canvas, pseudo-3D perspective, procedural synthwave music.
  - **Pseudo-3D projection**: `projectZ(z) → { y, scale }` using `t = z / (z + Z_DEPTH)` (Z_DEPTH=18). World z=0 = car bumper, z=60 = horizon. `projectXZ(x, z)` maps lane position (-1..1) onto the perspective-correct screen x using `roadHalf = ROAD_HALF_NEAR * W * scale`. Mid-screen horizon at H × 0.50.
  - **CIRCUIT BOARD FLOOR** (the chat's headline ask):
    - 4-layer rendering each frame:
      1. **Asphalt base** — solid #0a002a rectangle below horizon
      2. **22 horizontal pink "trace" lines** scrolling along z (`bgScroll % 4` wrap), each perspective-scaled, alpha-faded with distance (0.25→0.80 from far to near), with 6px shadowBlur magenta glow
      3. **6 vertical cyan "lane traces"** converging from bottom to vanishing point — drawn at lane positions [-0.85, -0.55, -0.25, 0.25, 0.55, 0.85], 1.4px stroke with 8px cyan shadowBlur
      4. **2 bright magenta outer rails** at x=±1.0, 2.2px stroke, heavy pink glow
      5. **Circuit nodes**: at every horizontal-trace × vertical-lane intersection, draw a small dot — colour alternates magenta/cyan based on `(i + lx*10) % 2` so the grid reads as a real circuit board with mixed-colour solder points. Dot radius scales with perspective depth.
  - **Synthwave sky** (CSS): 9 hand-positioned twinkling stars (radial-gradient pseudo) over a 5-stop vertical gradient that fades from deep purple at the top through a magenta band at 62% (the iconic horizon glow) to transparent below. Static — sells the "you're driving at sunset forever" aesthetic.
  - **Iconic slatted sun** centered on the horizon: 5-stop radial-gradient (gold → orange → magenta → deep purple), half-circle clip path, then darkened horizontal slats every 8px that scroll up at `bgScroll × 0.15` speed (so they appear to fall away as you race forward — classic synthwave motion). Outer magenta glow ring at 18% opacity.
  - **Jagged mountain silhouette** behind the road, drawn from a deterministic noise function (`sin(i*1.7) + sin(i*3.3+1.2)`) for 16 peaks. Solid dark-purple fill + cyan outline glow (8px shadowBlur).
  - **4 GLOWING OBSTACLE TYPES** (the second headline ask):
    - **🟧 Resistor** — long horizontal box in amber `#ffba1a` with 4 dark-purple stripes (the colour bands!) + leg wires extending past either end. 25 dmg.
    - **🟪 Capacitor** — magenta rounded cylinder `#ff2db4` with white top-rim ellipse + +/- markings on the body. 30 dmg.
    - **🟢 Transistor** — lime `#b8ff5a` semicircle "cup" shape with 3 leg wires extending downward. 22 dmg.
    - **▪️ Chip** — dark rectangle with red `#ff4060` outline + red corner orientation-dot + 10 glowing pins (5 top, 5 bottom). 35 dmg.
    - Each gets 18px shadowBlur in its own glow colour. Sized in world units (w: 0.30-0.60, h: 0.20-0.50 of road half-width / 180px depth-scaled) so they're properly perspective-aware. Drawn far-to-near so close ones occlude far ones.
  - **🔵 Cyan power orbs**: cyan radial-gradient pulsing glow with bright white core, +12 shield + 60 score on collect. 20% of obstacle spawns.
  - **Spawn cadence**: 1.2s at start, drops to 0.32s minimum as `distance` climbs (every 60m shaves 0.0006s off the interval).
  - **Player car** (bottom of road, locked at z=0.4): chunky chrome-purple chassis with cyan windshield, two forward-projecting yellow headlight beam triangles, two magenta tail-light squares with 12px glow, dark wheel-arch cutouts. Car tilts ±slightly when steering via `rotate(-steerVel × 0.06)`. Soft elliptical shadow below.
  - **Steering**: `_l`/`_r` flags from `A`/`D` or `←`/`→` set target velocity ±2.2, smoothed via `steerVel += (target - vel) × 0.15`. Lane position clamped to ±0.85 so you can't leave the rails. Touch: pointer-press buttons left/right that show on coarse pointers (mobile).
  - **Speed system**: starts at 380 u/s, eases asymptotically toward 1400 u/s via `speed += (max-speed) × 0.0035 × dt × 60`. Speed feeds the bgScroll (the perspective floor scrolls faster as you accelerate) AND the obstacle approach rate (faster = harder dodging).
  - **Collision**: lateral hit-test when obstacle z ∈ (0, 0.6) — `dx = |obstacle.x - car.x|` vs lateral box `(type.w × 0.5) + 0.18`. Hits flash a red overlay (220ms), spawn 18 particles in the obstacle's glow colour at the car's screen position, play `sndHit` (120→60Hz sawtooth descent), and -dmg.
  - **HUD** (top-right, 4 stacked cards): SPEED (amber, 3-digit padded), DIST·M (cyan, integer metres), SCORE (magenta, dist + dodged×25), SHIELD (lime → amber warn at <60 → red+pulse danger at <25).
  - **Procedural synthwave music** starts on game-start (after user gesture so AudioContext is allowed). 140 BPM 16-step sequence: kick on 1+5+9+13, snare on 8+16, square-wave arpeggio (A-minor pentatonic up: 110/138/164/220/261/311/329/440Hz ×2) sprinkled on weak beats. Snare is bandpass-noise burst + 200Hz triangle. Master gain 0.32 with 0.4s fade-out on `stopMusic`.
  - **Hit sound**: 120Hz sawtooth + 60Hz sub at delay. **Orb chime**: 660/990/1320Hz major-triad ascending sine arpeggio.
  - **Start overlay**: pink Bungee title with cyan 4px offset shadow, magenta panel border with cyan 8px hard offset + pink 40px glow. Stats overlay on game-over with NEW badges on score + distance high-scores (lime + glow). localStorage `neon-velocity-v1` persists `{best, bestDist}`.
  - **Aesthetic**: pure synthwave palette (#ff2db4 / #2df0ff / #ffba1a / #b8ff5a / #ff4060). Bungee for big titles, Audiowide for HUD numbers, Major Mono Display for labels, Share Tech Mono for body. All borders SHARP (border-radius: 0). Chunky hard-offset shadows.
  - **WCAG**: rem units, semantic main/header/h1, canvas with `aria-label` describing controls, `role="status" aria-live="polite"` on HUD cards, `role="dialog" aria-modal="true" aria-labelledby` on overlays, `:focus-visible` 3px amber outline 3px offset, ≥44px tap targets on overlay buttons + touch pads, `prefers-reduced-motion` kills all keyframe animations + transitions.
  - **OG image**: Pollinations flux seed 80608.

## issues
- The slatted sun's "slat scroll" uses the bgScroll value modulo 8 — at very low or paused speeds it doesn't visibly animate. Acceptable since the sun is a static decoration.
- Spawn cadence floor of 0.32s + max obstacle width ~60% road = at peak difficulty you can occasionally get into an unwinnable "wall" pattern if two large obstacles spawn back-to-back covering both halves of the road. Rare (~5% of late-game runs) but worth tracking.
- No "boost" mechanic — speed is purely auto-incrementing. Could add a temporary boost (Q/Space) for a small action layer.
- Music sequencer uses setInterval — not perfectly tight on lower-end mobile browsers. Acceptable for casual play.
- No "lives" system — game is one-life with HP regen via orbs only. Could add a 3-life mode for casual users.
- The car doesn't actually accelerate visually (no engine particles / motion blur on the road). The bg scroll DOES speed up but the car stays at the same screen size since it's locked at z=0.4. Could add motion-blur trails behind the car.
- Touch buttons are large (4.4rem) and overlap the bottom of the road on small viewports. Acceptable but could become draggable.

## todos
- Boost meter + Q/Space tap-to-boost (consumes meter, refills slowly)
- Daily seed challenge — same obstacle/orb sequence for everyone today
- 3-lives "casual" mode
- Slipstream mechanic — passing close to obstacles charges a bonus combo
- More obstacle types: diode, inductor, LED array
- Multiplayer ghost car (Supabase Realtime broadcast of car.x + speed)
- Achievement system: "10 km milestone" / "100 dodges" / "max speed reached" / "no-hit km"
- Mute toggle UI (currently no in-game mute — game over stops music, restart re-plays)
- Procedural background variations: occasional "tunnel" segments (rails arch over the road), checkpoint flags every 1000m
- Leaderboard via Supabase (anon)
- Camera-shake on hits
- Skin select: pink-car / cyan-car / amber-car
