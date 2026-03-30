# Gravity Box

## log
- 2026-03-30: V1 — Neon physics sandbox with draggable shapes and gravity toggles. 4 shape types (box, circle, triangle, star) with neon glow and inner detail lines. Click to spawn, drag to throw. 6 gravity modes: Low Grav, Micro, Zero G, Normal, Heavy, Reverse. Circle-based collision with elastic response and mass weighting. Motion trails on moving shapes. Wall bounce with rotation impulse. Max 80 bodies. Subtle grid background. Chakra Petch + IBM Plex Mono typography, dark with multi-color neon shapes.

## features
- 4 shape types: box (with cross), circle (with ring), triangle, 5-point star
- Click anywhere to spawn shapes
- Drag existing shapes to reposition and throw
- Fling velocity on release
- 6 gravity modes (Low, Micro, Zero, Normal, Heavy, Reverse)
- Circle-based collision detection with elastic response
- Mass proportional to size squared
- Rotation with angular velocity
- Wall collision adds rotational spin from linear velocity
- Neon glow on all shapes (shadowBlur)
- Inner detail lines (cross on boxes, ring on circles)
- Motion trails (fade over time, only when moving)
- Speed cap at 15px/frame
- Max 80 bodies (oldest removed when exceeded)
- Subtle background grid
- Wall glow border
- Gravity direction indicator arrow
- Body counter display

## issues
- None currently

## todos
- Size slider for spawning
- Friction/bounciness controls
- Attractors (gravity wells on click-hold)
- Explosive mode (shapes shatter on collision)
- Color theme toggle

## notes
- Default gravity: 0.04 (low)
- Damping: 0.9985
- Restitution: 0.65-0.9 random per body
- Collision overlap resolution: half per body
- Trail length: max 15 points, decay 0.07/frame
- Trail only records when speed > 0.5
- Canvas alpha clear 0.18 for motion blur effect
