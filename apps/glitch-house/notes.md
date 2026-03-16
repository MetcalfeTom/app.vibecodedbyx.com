# Glitch House

Click rooms in a haunted house. Things break. Reality glitches.

## log
- 2026-03-16: Initial build. 4x3 grid of 12 named rooms (Attic, Bedroom, Hallway, Library, Nursery, Kitchen, Parlor, Cellar, Crypt, Tower). Click any room to trigger: screen shake, chromatic aberration, glitch block artifacts (colored rectangles with shift), scan line disruptions, static noise overlay, per-room distortion wobble, red glowing eyes in windows, creepy symbols (occult unicode), ghost text entities ("GET OUT", "BEHIND YOU", etc.), color inversion flashes. Each click raises room haunt level (flickering window light, red overlay, symbol visibility). Global corruption level escalates with more clicks — more intense effects, more artifacts. Title text glitches with block characters. Rooms have windows with cross panes, flickering lights. Roof with triangular shape that wobbles at high corruption. Dead grass on ground with sway. CRT scan lines overlay. 3 audio layers: sawtooth drone sweep, sparse crackle noise, high-pitched screech at high intensity. Creepster + VT323 typography, deep purple/dark palette.

## issues
- None yet

## todos
- Random ambient events (doors slamming, lights out, figure in hallway)
- Room-specific hauntings (kitchen knives, nursery rocking chair)
- Progressive narrative (text reveals story with more clicks)
- Jumpscare with full-screen flash at max corruption

## notes
- No database — pure frontend
- 12 rooms in 4x3 grid, responsive to screen size
- Haunt level: +0.2 per click, affects flicker/symbols/overlay intensity
- Corruption: global 0..1, +0.03 per click, decays *0.9995/frame
- Glitch blocks: 3+corruption*10 per click, colored rectangles with horizontal shift
- Scan lines: 5 per click, move vertically with speed drift
- Ghost text: 30%+corruption*30% chance per click, drift + glitch offset
- Static noise: ImageData pixel manipulation, density = staticNoise*0.02
- Chromatic aberration: canvas drawImage offset, decays *0.9/frame
- Inversion: difference blend white overlay, corruption*40% chance
- Eyes: appear 10-70 frames after click, red glow with pupils
- Shake: intensity 8+corruption*15, decays *0.9/frame
- Title glitch: random block chars replace letters for 20 frames
- Audio: sawtooth 40-70Hz drone, sparse crackle (5% density), square screech >0.7 intensity
