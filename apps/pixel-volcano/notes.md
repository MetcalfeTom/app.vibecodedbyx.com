# Pixel Volcano

Click to erupt a pixel volcano and watch lava rain from the sky.

## log
- 2026-03-14: Initial build. Canvas 2D physics volcano. Click/tap triggers eruption (60+ frames), hold for sustained eruption. Lava particles with gravity (0.18), bounce on volcano slope and ground, splash sub-particles on hard impact. 3 temperature tiers: white-yellow hot, orange, dark red. Color cooling over time (per-particle cooling rate). Lava settles as cooled dark deposits (up to 3000). Smoke particles from crater (ambient + eruption). Crater glow pulses when idle, intensifies during eruption. Volcano drawn from polygon points with gradient fill and rock texture. Pixel-snapping (3px grid) for blocky look. Screen shake during eruption. Web Audio rumble (dual oscillator sawtooth+triangle) and burst pops. Stats counter (eruptions, active particles, total lava). Silkscreen + DotGothic16 typography, dark volcanic red/orange palette with starfield.

- 2026-03-14: Added village at volcano base. Buildings on both sides with roofs, windows, doors (random hue variety). 24 villagers with pixel stick-figure bodies, animated legs/arms, randomized skin & shirt colors. Villager AI: wander near home, flee when lava within 80px (run away with panic "!" indicator, arms raised). Lava contact turns villager into pixel ghost — ghost floats upward with wavy bottom, wobble drift, and fades out. Ghost spawn poof + eerie sine sound. Buildings get destroyed by grounded lava (show as rubble). Villagers respawn slowly (1 per 300 frames) when not erupting. Stats updated with villager count and ghost total.

## issues
- None yet

## todos
- Lava flows down the sides (stream simulation)
- Day/night cycle affected by eruption intensity
- Multiple volcano sizes
- Volcanic lightning during big eruptions

## notes
- No database — pure frontend
- Max particles: 6000 lava, 400 smoke, 3000 settled
- Pixel size: 3px grid snapping
- Gravity: 0.18, bounce: vy *= -0.3, friction: vx *= 0.7
- Cooling rate: 0.992-0.997 per frame (randomized per particle)
- Ground collision: getGroundY() approximates volcano slope
- Eruption: 60 + power*40 frames, 8 particles/frame * power
- Hold mouse/touch for sustained eruption
