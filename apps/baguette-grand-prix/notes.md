# baguette-grand-prix

## log
- 2026-05-03: shipped — pseudo-3D pole-position-style racer w/ baguette protagonist + butter-slick patches.
  - Track: 10-segment build (curves + hills), ~720 segs total, 3 laps.
  - Render: standard segment projection (camDepth/cameraZ), grass/rumble/road/lane line polygons per seg, sprites pass back-to-front, finish checker band on the last 10-seg run.
  - Butter slicks: per-seg `butter` lateral position (-1..1). Player within 0.42 lateral range → `griplessT = 1.1s` slip cooldown, steering muted to 32% + drift wobble, bandpass-noise hiss.
  - Player physics: maxSpeed = SEG_LEN*60 ≈ 12000 u/s. accelRate 0.55× max, brakeRate 1.10×, drag 0.18×. Off-road clamp speed to 55%.
  - Centrifugal: track curve pushes player outward proportional to speed; reduced when sliding (less authority).
  - Audio: sawtooth+triangle engine bus pitched by speed (80→500Hz), throttle bump, butter hiss = bandpass-filtered noise burst, lap chime, finish 4-note arp.
  - Aesthetic: French bistro tricolor (bleu/blanc/rouge) accents, Bagel Fat One title, Cormorant italic tagline, IBM Plex Mono HUD, Major Mono Display numerals. Tricolor banner roadside signs w/ 🥖.
  - Accessibility: rem units, 44px+ targets, semantic main/header, aria-live HUD, role="application" canvas with key summary, prefers-reduced-motion kills pop animations, focus-visible outlines, skip-link, overlays use inert toggle pattern.
  - Touch: 4 floating circular buttons (steer L/R, brake, accel) on coarse-pointer.
  - Persistence: best lap time in localStorage as `baguette-grand-prix-best`.

## issues
- Camera does not lerp into corners — could feel slightly stiffer than e.g. F-Zero. Could add lateral camera shift = -seg.curve * speedRatio * SOME_LERP for more dramatic cornering.
- Lap detection is purely z-wraparound; no ghost/AI cars yet.
- No drift slip particles — the butter-tint overlay is the only visual feedback. Could add tiny yellow specks at wheel positions during griplessT.
- Track is fixed (procedural seed not exposed). Could randomize per session if chat asks.

## todos
- AI rival baguettes (rendered as smaller scaled sprites along the track w/ projection).
- Random track variant button on start screen.
- Subtle camera lateral lean on corners.
- Speedometer needle / gauge visualization.
- Optional: split-screen multiplayer — one player WASD, other arrow keys.
