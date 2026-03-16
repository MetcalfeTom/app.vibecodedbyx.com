# Neon Voodoo

Pin your bad luck to a neon voodoo doll. Release it. Feel better.

## log
- 2026-03-16: Initial build. Canvas-drawn voodoo doll with stitch texture. Ellipse head and body, line limbs with cross-stitch pattern. X-eyes in purple neon glow, stitched zigzag mouth, faint heart on chest. Click doll to place a pin — prompts for bad luck text (16 random placeholders). Pins render with shaft line, glowing colored sphere head (8 neon colors), and floating label text. Pin placement triggers wobble animation (damped oscillation), stab sound (sawtooth sweep + bass impact), and particle burst. Remove tool: click near a pin to pull it out with particles. Clear All: removes all pins. Banish: epic particle explosion, rising spirit particles, heavy wobble, ascending arpeggio sound. Background: faint occult circle, pentagram lines, rotating Norse rune ring. Hit detection: ellipse test for head/body, line-distance test for limbs. Responsive scaling. Touch support. Creepster + Share Tech Mono typography, deep purple/dark palette.

## issues
- None yet

## todos
- Shake phone to banish (DeviceMotion API)
- Pin animations (wiggle over time)
- Doll customization (color, accessories)
- Share doll screenshot with pins
- Community bad luck wall (Supabase)

## notes
- No database — pure frontend
- Doll: ellipse head (28x32), body (35x55), line limbs (12-14px wide), all scaled by dollScale
- Hit detection: (rx/a)²+(ry/b)²≤1 for ellipses, projection + perpendicular distance for limbs
- Stitch pattern: perpendicular cross-marks every 8px along limb lines
- Pin: shaft (#888 line), head (4px circle with shadowBlur glow), label (9px text above)
- Wobble: amplitude * sin(phase*0.3), decays *0.92 per frame
- Banish: 20 particles per pin + 5 spirit particles, wobble=15
- Background: r=140*scale occult circle, pentagram (5-point skip-2), 12 Norse runes rotating
- Audio: pin=sawtooth 2000→200Hz + sine 80Hz, remove=triangle 800→400Hz, banish=5-note ascending sawtooth arpeggio
- 8 pin colors: pink, cyan, green, yellow, orange, purple, blue, rose
- 16 random bad luck placeholders for input prompt
