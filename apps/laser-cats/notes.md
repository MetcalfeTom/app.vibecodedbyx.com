# Laser Cats

## log
- 2026-04-07: Initial build — laser pointer chaos sim. Red dot follows cursor with smooth lerp + wobble + glow trail. 4 procedurally drawn cats in 6 color palettes (black, orange tabby, white, brown, grey, tuxedo). State machine: idle → chasing → crouching → pouncing → landing. Cat eyes track the laser, pupils dilate when hunting. Pounce counter tracks all attempts. Rubik Mono One + Space Mono typography, warm brown/red arcade aesthetic.

## features
- Laser pointer with smooth follow, glow, wobble, and trailing particles
- 4 initial cats, click to spawn more (max 12)
- 6 cat color palettes with per-cat spot patterns
- Procedural side-view cat drawing: body, belly, head, ears with inner pink, eyes with iris tracking, nose, mouth, whiskers, wagging tail, walking legs
- State machine per cat: idle/chasing/crouching/pouncing/landing
- Cats lerp toward laser when it's within 500px range
- Within 180px, cats crouch for 20 frames then pounce (lerped arc)
- Eye irises track the laser direction
- Pupils become slit-shaped when hunting, dilated when pouncing
- Blinking, ear twitching, tail wagging ambient animation
- Cats face left/right depending on laser position
- Y-sorted depth rendering
- Pounce counter in HUD
- Mouse + touch support
- Cursor hidden (laser replaces it)

## issues
- Cats can clip into each other (no separation)
- Pounce animation is simple lerp arc, not true physics
- No sound (could add meows, paw taps)
- Cats lose laser briefly if you move faster than their chase speed — feature, not bug

## todos
- Sound: meows, purrs, paw taps on pounce
- Different cat sizes / kittens
- Snack drops to distract cats
- Camera shake on pounce land
- OG image
