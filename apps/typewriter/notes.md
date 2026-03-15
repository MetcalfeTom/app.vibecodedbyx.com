# Mechanical Typewriter

Type on a heavy mechanical typewriter with clacking keys, ink smudges, and the ding of a carriage return.

## log
- 2026-03-15: Initial build. Mechanical typewriter with aged paper, round metal keys, and ink smudge system. Paper has SVG turbulence noise texture, red margin line, slight 3D perspective tilt. Each typed character gets random offset, rotation, and opacity for mechanical imperfection feel. Special Elite font for typewritten text. Round metal keys with radial gradient, inner ring highlight, press animation (translateY + shadow change). 4 key rows + space bar, caps lock, shift (toggle-style), backspace, enter. Web Audio: metal clack (square wave pitch sweep + sine thud), carriage return (sawtooth slide + bell ding), space bar (triangle thud). Ink smudge system: 15% chance per keystroke to add elliptical smudge on canvas layer, with 30% chance of additional ink bleed. Initial age marks (finger smudges) on paper. Physical keyboard and on-screen keyboard both work. Character and line count display. IBM Plex Mono UI + Special Elite text, dark metal/aged paper palette.

## issues
- None yet

## todos
- Print/save as image
- Typewriter ribbon color options (black, red, blue)
- Paper feed animation on enter
- Jam simulation (random stuck key)
- Sound volume control
- Multiple paper sizes

## notes
- No database — pure frontend, no persistence
- Smudge: canvas overlay with 15% trigger rate, elliptical fills at alpha 0.03-0.09
- Character imperfection: translateX ±0.8px, translateY ±0.6px, rotate ±2deg, opacity 0.75-1.0
- Audio: clack = square 800-1400Hz sweep to 200Hz in 40ms + sine 80-120Hz thud
- Carriage return: sawtooth 150→80Hz slide + 2200Hz bell
- Shift/Caps work as toggles (typewriter style, not hold)
- Paper auto-scrolls to bottom on new content
