# Gravity Wells

Neon physics sandbox with gravity spheres and glowing debris.

## log
- 2026-03-17: Initial build. Canvas physics sandbox. Two well types: attractors (cyan, pull) and repulsors (pink, push). Click to place wells, spray mode for continuous debris. Gravitational physics with G=180, absorption at dist<12 with spark burst. Debris: neon-colored particles with motion trails, glow, speed cap 15, wall bounce, life decay. 10-color neon palette. Pulsing well cores with radial gradients, field rings, type labels. Grid background. Screen shake on well placement/detonation. Detonate button pushes all debris from center. Scroll spawns mini-bursts. Keyboard shortcuts (1/2/3 for modes, space/d detonate, c clear). Seeds 2 wells + debris burst on load. Touch support. Orbitron + Share Tech Mono typography, dark void with cyan/pink neon aesthetic.

## issues
- None yet

## todos
- Add well dragging (move placed wells)
- Debris-to-debris collision
- Well-to-well gravitational interaction
- Color modes (monochrome, rainbow gradient by speed)
- Well strength slider
- Sound effects (Web Audio hum near wells)

## notes
- No database — pure frontend
- Canvas fullscreen, no scaling needed
- Max 30 wells, 1500 debris, 3000 sparks
- Fade trail: rgba(5,5,10,0.15) per frame
- Damping: 0.997 per frame
- Absorption radius: 12px from well center
