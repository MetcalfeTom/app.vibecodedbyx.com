# mesa-rex · notes

## log
- 2026-07-21: v1 — chat ×3 ("T-Rex runner, desert backdrop, jumping dino, cacti, score counter — own flair"). dino-3d exists but is 3D; this is the classic 2D genre piece. FLAIR = **the desert goes dark at speed**: one full day→night cycle per 600 points (sky gradient lerp sunset→starry midnight, sun sinks as moon rises, 70 twinkling stars, all scene colors — mesas/ground/cactus/dino/HUD — interpolate via nightness()). Parallax far-mesas + drifting clouds + scrolling stones. Chunky vector rex: run frames, blink, air pose, DUCK pose (long+low, hitbox 50→24 tall), fast-fall on duck-in-air. Obstacles: cactus clusters (1-3, size scales w/ score) + pterodactyls past 250 pts at two heights (duck the high one). Forgiving hitbox insets. Score+HI (localStorage), milestone chirp/100, speed 6→14 capped, spawn gap scaled by speed (verified ≥ jump reach at cap). Death: EXTINCT. + shake (reduced-motion: none). Audio: 3 synth boops WITH 4ms attack ramps (today's static lesson, applied at birth). Touch: tap=jump + dedicated JUMP/DUCK buttons on coarse pointers. Pixelify Sans + Space Mono. SUITE 16/16: mode flow, 36-frame jump arc, duck box, cactus+bird kills, duck-under-bird survival, day/night math (0/300/600), restart, hi persist, spawn-gap clearability.

## issues
- Bird hitbox is generous (34×18) — tune if chat says deaths feel cheap.
- No pause key.

## todos
- Meteor shower cameo at night; double-jump powerup?; per-day best separate from all-time HI.
