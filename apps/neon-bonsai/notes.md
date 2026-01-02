# Neon Bonsai

## log
- 2026-01-02: Initial creation - interactive glowing bonsai tree

## features
- Procedurally generated bonsai tree
- Clickable leaves that glow on interaction
- Soft pentatonic chime sounds (Web Audio API)
- 4 leaf colors: green, pink, cyan, gold
- Subtle breathing animation on leaves
- Starfield background with twinkling
- Glow counter tracking interactions
- Touch support for mobile

## design
- Deep dark background with atmospheric gradients
- Neon glow effects using radial gradients
- Cormorant Garamond font for elegant text
- Minimalist UI - hint fades after first click
- Zen/meditative aesthetic

## technical
- Canvas-based rendering
- Recursive branch generation algorithm
- Web Audio API for synthesized chimes
- RequestAnimationFrame for smooth animation
- Responsive canvas sizing

## audio
- Pentatonic scale (C4-E5) for harmonious random chimes
- Sine wave oscillator with low-pass filter
- Gentle attack/decay envelope
- Audio context created on first user interaction

## issues
- None yet

## todos
- Add wind effect making leaves sway
- Add ambient background drone option
- Save/share tree seeds
- Add seasonal color themes
