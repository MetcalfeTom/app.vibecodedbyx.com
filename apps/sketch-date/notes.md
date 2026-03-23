# Sketch Date

Pencil-sketch dating dynamics simulator with charcoal sliders and paper textures.

## log
- 2026-03-23: V2 — Added 3 new traits (Intellect, Vulnerability, Intensity) for 8 total. Polished charcoal sliders with radial gradients and active scale. New animations: blinking (random 2-4s), breathing, arm fidgeting, raised eyebrows, thought bubbles, intensity aura, arm reaching, margin doodles, coffee ring stain. 3 new dialogue pools (Deep, Intense, Vulnerable). 2 new badges (Deep Talk, Tension). Updated chemistry formula.
- 2026-03-23: Initial build. 5 sliders (Confidence, Humor, Mystery, Warmth, Awkwardness) control chemistry % and scene. Two hand-drawn figures at a candlelit table rendered with pencil-stroke procedural lines (jittered bezier paths). Chemistry formula weights warmth highest (0.3), with awkwardness penalty, mystery sweet spot bonus, overconfidence penalty. Badges: Spark, Laughter, Blushing, Silence, In Love — activate based on slider combos. Auto-cycling dialogue from 4 pools (low/mid/high chemistry + awkward). Figures lean toward each other at high chemistry, away at high awkwardness. Blush circles, floating hearts, sweat drops. Paper texture via SVG noise BG + ruled lines + notebook margin. Caveat + Special Elite typography, warm paper/charcoal aesthetic.

## issues
- None yet

## todos
- More dialogue lines
- Date outcome summary screen
- Character customization
- Sound effects (pencil scratching)

## notes
- No database — pure frontend
- pencilLine() draws jittered multi-segment paths for hand-drawn feel
- pencilCircle() draws wobbly circles with per-vertex jitter
- Chemistry = conf*0.18 + humor*0.18 + warm*0.22 + myst*0.1 + intel*0.12 + vuln*0.1 + inten*0.1 - awk penalty + sweet spot bonuses
- Mystery bonus between 40-75, overconfidence penalty above 90
- Dialogue rotates every 4 seconds from appropriate pool
- Canvas 320x360, paper grain overlay redrawn each frame
- Candle flame uses oscillating ellipse
- Eye direction shifts based on chemistry (looking at each other)
