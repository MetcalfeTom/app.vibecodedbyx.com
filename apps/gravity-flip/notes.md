# Gravity Flip

Neon physics sandbox where gravity reverses every 5 seconds.

## log
- 2026-03-17: Initial build. Canvas physics sandbox with auto-reversing gravity every 5 seconds. 3 shape types (circle, square, triangle) + random mode. Click to spawn, drag to fling. Rain mode spawns continuous stream. Object-object collisions with mass-based impulse resolution. Bounce sparks on wall/floor impacts. Screen shake + color flash on gravity flip. Gravity field arrows on background. Motion trails via semi-transparent clear. Drag line with arrow indicator for fling direction. Up to 200 objects. Chakra Petch + Fira Code typography, dark void with neon glow.

## issues
- None yet

## todos
- Add gravity well attractors (click to place)
- Adjustable flip interval slider
- Object size slider
- Sound effects on flip and collision
- Black hole mode (center attractor)

## notes
- No database — pure frontend
- Gravity: 700 px/s^2, reverses every 5s
- Restitution: 0.6
- Max 200 objects, oldest removed when exceeded
- Shapes: circle, square, triangle (+ mix random)
- Rain mode: spawns one object per 150ms from top/bottom edge
- Fling: drag distance > 15px triggers velocity fling at 3x drag distance
- 8 neon colors in palette
- Sparks spawned on wall bounce (velocity > 80) and object collision (relSpeed > 40)
