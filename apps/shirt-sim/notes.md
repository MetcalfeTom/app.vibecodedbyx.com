# shirt-sim

## log
- 2026-05-03: fixed neck-hole collision + arm-reach cap (chat ask).
  - **Neck hole was always permeable** regardless of cloth orientation — the 6 inner-hole points were unconditionally exempt from head collision, so the head could phase through them at any angle. You could "win" by waving the cloth past the head sideways.
  - **Fix**: built a 7-point ring polygon around the inner hole — `(0,0) (1,0) (2,1) (2,2) (2,3) (1,4) (0,4)` clockwise — recomputed each frame from live cloth positions. New `pointInPoly` test asks: is the head's center actually inside that polygon? Inner-hole points only skip head collision IF yes. Otherwise they collide normally and the head can no longer phase through. Now the cloth has to genuinely be threaded onto the head.
  - **Fitness gate**: `fitnessNow` short-circuits to 0 unless the head is inside the hole polygon. Meter can no longer creep up just by hovering the cloth near the face.
  - **Arm reach cap** (`MAX_REACH = 230`): each hand is tethered to its shoulder; if input would push the hand past 230px from shoulder, position is clamped back onto the reach circle. Prevents flinging hands across the screen and yanking the cloth into infinite stretch (which broke verlet's stability).
  - **Reach visualization**: faint dashed circle drawn around each shoulder in that hand's color (blue/orange) while playing, so the limit is visible before the player bumps into it.
- 2026-05-03: shipped — QWOP-flavored cloth-physics shirt-on simulator.
  - **Two-hand control**: WASD = LEFT hand (blue), arrows = RIGHT hand (orange). Each hand permanently grips one bottom corner of the cloth (last-row corners pinned to the hand position). Hand speed 320 px/s, clamped to canvas + can't enter the head circle or torso rect.
  - **Cloth**: verlet-integrated 5×7 grid, 35 points, REST length 26px (auto-scaled on small viewports). Structural constraints (horizontal+vertical, k=1) + diagonal shear constraints (k=0.5) for cloth-like sag. Gravity 720, damping 0.985, 6 solver iterations per frame.
  - **Neck hole**: top-center 3 columns × top 2 rows (6 cells) marked as `NECK_INDICES`. These points are EXEMPT from head + torso collision so the head can pass through that region. Visually the cells in this region aren't rendered → a real opening in the shirt.
  - **Collision**: head (circle) and torso (rect) push out non-neck cloth points each iteration. Torso uses nearest-edge push-out so points don't get stuck inside.
  - **Win condition**: per-frame fitness = `headScore × hemBelow × (0.4 + 0.6×topScore)` where headScore = 1 - distance(neck-center, head-center) / (head.r × 1.6); hemBelow = 1 if hem mean y > head bottom; topScore = 1 - |topRowMeanY - headY| / (head.r × 2.5). When fitness > 0.42, fill meter at 55/sec × (fit-0.4); decay 18/sec otherwise. Reach 100% to win. Best time persisted.
  - **Aesthetic**: front view of bare-torsoed character (skin + jeans + simple cap of hair + miserable mouth) in a bedroom — yellow striped wallpaper, wood-plank floor, mirror with cardboard frame on left wall, woven hamper on right. Bowlby One SC chunky title (SHIRT in white, separator in blue, SIM in white), Cormorant italic tagline, IBM Plex Mono HUD pills, VT323 numerals. Hands rendered as colored mittens with letter labels (L/R), connected to character shoulders by a stylized skin-toned arm sleeve. Faint dashed gold guide line connects the cloth's neck-hole center to the head center to help the player aim.
  - **Cloth visual**: alternating orange/dark-orange horizontal stripes per row, white inner-collar ring + dark outer ring around the neck hole that follows the cloth's deformation in real time, dark outline around the cloth boundary.
  - **Audio**: 80Hz sine + 240Hz lowpass room tone; soft fabric whisper (bandpass-noise burst) when total cloth velocity > 80; 4-note major arpeggio on win; pause click; 220Hz square on reset.
  - **Loop**: fixed-step 1/120s w/ accumulator + spiral-of-death guard.
  - **Persistence**: best time (`shirt-sim-best`) + attempts counter (`shirt-sim-tries`).
  - **Accessibility**: rem units, 44px+ targets, semantic dialogs with inert toggling, role="application" canvas with detailed control summary, aria-live HUD, focus-visible outlines, skip-link, prefers-reduced-motion kills the meter transition.

## issues
- Cloth can occasionally clip through itself or settle in inverted folds — that's part of the QWOP charm but does mean some attempts feel impossible.
- The 6-solver-iteration verlet pass is fast but not super stable at high stretch. Hard yanks on hands can cause jitter on the cloth's distant points.
- Hand controls are 8-direction only (key-based). A mouse-controlled fallback could be added.
- The "neck hole" is a square region of skipped cells, not a true round hole — at extreme tilts the visible opening looks rectangular.
- No mobile touch controls (the game needs simultaneous two-hand input which is hard to do well on a phone). Listed as todo.

## todos
- Touch controls: virtual joystick per side for mobile (left half = left hand, right half = right hand).
- More garments unlocked at win counts (sweater = 5×9 with sleeves, jacket = full grid + zipper).
- Difficulty modifier — caffeine mode (faster gravity, slipperier hands).
- Replay sharing / leaderboards via Supabase.
- Cuffs → render the bottom corners as fabric tubes the hand pokes out of (more "you're holding the hem" affordance).
