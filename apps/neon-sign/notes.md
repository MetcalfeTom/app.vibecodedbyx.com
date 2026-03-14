# Neon Sign Generator

Type anything and watch it glow as a pulsating neon sign. Pick your color, tweak the vibe.

## log
- 2026-03-14: Initial build. Type custom text rendered as glowing neon sign on dark brick wall. 9 glow colors (hot pink, cyan, orange, violet, green, yellow, red, white, blue). 7 font styles (Pacifico script, Monoton outline, Bungee Shade block, Sacramento cursive, Rubik Glitch, Press Start 2P pixel, Lexend Mega bold). 4 sliders: glow intensity, pulse speed, flicker randomness, font size. Buzz effect button triggers electrical short-circuit with sparks (canvas particles), jitter, and opacity chaos. Screenshot button renders to 1200x630 canvas with brick texture and glow, copies to clipboard or downloads PNG. Random button picks random text/color/font combo. Multi-layer text-shadow for realistic neon glow. Wall ambient radial gradient matches sign color. Share Tech Mono UI typography.

## issues
- None yet

## todos
- Multiple lines support
- Neon tube mounting brackets/wires visual
- Animation presets (breathing, heartbeat, SOS morse)
- Save/load sign configurations
- Background options (brick, concrete, night sky)

## notes
- No database — pure frontend
- Glow: 4-layer text-shadow (inner bright → outer diffuse)
- Pulse: sine wave on opacity, speed controlled by slider
- Flicker: random opacity drops, frequency controlled by slider
- Buzz: 45-frame electrical effect with canvas spark particles
- Screenshot: renders to offscreen 1200x630 canvas with brick pattern + radial glow
- Fonts loaded from Google Fonts CDN
