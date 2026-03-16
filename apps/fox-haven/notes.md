# Fox Haven

A cozy sanctuary where you feed, name, and watch foxes roam a grassy field.

## log
- 2026-03-16: Initial build. Warm outdoor scene with grassy field, sky gradient, sun, clouds, flowers, butterflies. Up to 10 canvas-drawn foxes with 6 coat types: Red, Silver, Golden, Melanistic, Amber, Platinum — each with body/belly/ear/tail colors. 16 random names (Maple, Acorn, Hazel, etc.). Fox rendering: body ellipse, round head with snout, triangular ears with inner color, dark eyes with shine, nose, whiskers, smile or yawn mouth, wagging tail with white tip, walking legs with paw bob. States: idle (stand), walk (wander to random target), seek (go to food), sleep (curled up with Zzz). Click fox to pet — heart particles, happiness boost, chime sound, info panel shows name (editable input), mood, hunger, coat type. Feed button drops food at mouse position, hungry foxes walk toward it. Nap Time button puts all foxes to sleep (curled pose). Hunger increases over time, happiness decays, low food = faster happiness drain. Yawn animation (random, 0.1% chance/frame). Butterflies with flapping wings, swaying flowers, drifting clouds, grass blades with wind sway. 3 Web Audio SFX: yip (sine sweep), munch (triangle), pet (chime arpeggio). Caveat + Nunito typography, warm pastoral palette.

## issues
- None yet

## todos
- Fox friendship (foxes that stand near each other increase happiness)
- Shelter/den building
- Seasonal weather changes (rain, snow)
- Fox pup breeding when 2 foxes are very happy

## notes
- No database — pure frontend, no persistence
- 6 coat palettes with body/belly/ear/tail colors
- Fox states: idle (80-220f), walk (100-250f, target random X), seek (200f, move to food), sleep (manual toggle)
- Hunger: +0.003/frame, -30 on eat, affects happiness drain when >70
- Happiness: -0.002/frame base, +10 per pet, +15 per eat
- Walking: acceleration toward target * 0.05, damping 0.95, seek speed 1.2x
- Tail: sine(tailPhase) wag, quadratic bezier, white tip circle
- Sleeping pose: curled ellipse body, wrapped tail, closed arc eyes, Zzz text
- Ear wiggle: 10 frames on pet/eat, sin(frame*0.3) * wiggle * 0.3
- Butterflies: 5 ambient, sine wing flap, drift with sin wave offset
- Flowers: 15 random, HSL colored with yellow center, stem sway
- Clouds: 4, multi-ellipse puffy shape, drift rightward, wrap
- Depth sorting: foxes rendered by Y position
