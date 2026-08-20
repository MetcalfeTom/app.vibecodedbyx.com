# AQUASAVER '96 — a retro aquarium screensaver

## log
- 2026-08-20: v1.0 — built per chat: schooling fish, cursor food pellets, sonar silhouettes, reef map, reset. HONEST BOIDS: 40 fish, 4 species (16 tetra / 10 angel / 9 grunt / 5 shadow) with per-species size/speed/color/depth-band; separation crosses species, alignment+cohesion stay within species; wall steering + depth preference. Probe proves schooling: per-species heading alignment (mean unit-velocity magnitude) RISES above 0.5 after 400 steps from seeded scatter. PELLETS: click/tap drops 3-5 (seeded from position), they sink with sway, fish within 90px steer in at 1.35× speed, eat within 10px ("the school has formed opinions about you. good ones."). SONAR MODE: dark green CRT, range rings + crosshair + rotating sweep (1.1 rad/s); fish tagged when the sweep passes within 0.25 rad and rendered as green silhouettes with exp fade (probe: ≥30/40 pinged after a full rotation); reef as faint outline; optional two-tone 1250Hz ping on each rotation (own toggle). REEF MAP: corner minimap with rocks, per-species fish dots, pellet dots, sonar recolor. RESET restocks the seeded tank EXACTLY (probe: species/x/y snapshot identical; "as promised"). CRT scanline overlay (killed by reduced-motion), light shafts, swaying kelp, bubbles. Keys: space/S/M/R. Probe 13/13 after one real fix: the aria-live HUD only refreshed on rAF, so toggles lagged a frame for screen readers (and sync probes) — toggles now call hud() immediately.

## issues
- aria-live readouts must update synchronously in handlers, not wait for the render loop — the probe caught a one-frame lag that screen readers would feel.

## todos
- a shark that visits if you don't feed them, species picker for pellets, fullscreen button, if chat asks.
