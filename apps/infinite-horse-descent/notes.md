# infinite-horse-descent · notes

## log
- 2026-07-16 v1.0: chat "infinite scroll page Infinite Horse Descent — floor counter, teleport to floor 666, pixel horse gets grainier the deeper you go". Floors = 46vh sections appended lazily (ensureFloors on scroll, +12 ahead); phrase per floor deterministic (frng(floor) → 4 depth pools shallow/mid/deep/abyss) + SPECIALS dict (0/13/100/333/500/665/666/667/1000; 666 = ⛧ red radial floor "66.6% static and completely at peace"). HUD floor counter from scrollY/FLOOR_H; body bg lerps through 6 stops sky→dusk→dark→abyss w/ red tint near 666. HORSE: 24×20 char-map sprite drawn via ImageData; grainFor(n)=min(.88, n·.00135) — per-pixel: grain chance → grey noise, ≥600 30% of corrupted px bleed red, deep grain deletes pixels (alpha 0); caption degrades fine→fuzzy→dissolving→at peace→mostly grain. TELEPORT: ensures 680 floors, red flash, instant jump, 66.6Hz saw drone sting.

## issues
- Very deep manual scrolling (5000+) grows DOM (~1 div/floor, light) — no pruning yet; teleport only guarantees 680.
- FLOOR_H from innerHeight at load; resize recomputes but floor you're "on" shifts slightly.

## todos
- DOM pruning above viewport if anyone actually scrolls past ~3000.
- Floor 999→1000 event (the grain wins) could get a visual.
