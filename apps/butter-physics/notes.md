# Butter Physics

## log
- 2026-01-04: Initial creation - butter physics simulation with sliding cubes

## features
- Low-friction "butter" physics simulation
- Cubes that slide smoothly across surfaces
- Click to spawn new cubes
- Drag and release to fling cubes
- Cube-to-cube collision detection and response
- Adjustable "butteriness" slider (friction control)
- Gravity direction toggle (down/up/left/right/none)
- Device tilt support for mobile
- Arrow key controls to push all cubes
- Shake button for chaos
- Motion trails on fast-moving cubes
- Collision counter
- Soft bounce off walls

## physics
- Very high friction coefficient (0.95-0.99 = buttery)
- Elastic-ish collision response with mass consideration
- Angular velocity on collisions
- Wall bouncing with rotation effect
- Gravity can be toggled in any direction

## design
- Butter yellow/gold color palette
- Gradient cubes with shine effect
- Soft shadows for depth
- Motion blur trails
- Nunito font for soft feel
- Dark blue background for contrast

## controls
- Click: Spawn cube at position
- Drag & release: Fling cube with velocity
- Arrow keys: Push all cubes in direction
- Device tilt: Changes gravity direction
- Butteriness slider: Adjust friction
- Spawn: Add 5 random cubes
- Shake: Apply random velocities
- Clear: Remove all cubes
- Gravity: Cycle gravity direction

## technical
- Canvas-based rendering
- Custom physics engine
- AABB collision detection
- requestAnimationFrame loop
- Device orientation API support
- Touch and mouse support

## issues
- None yet

## todos
- Add different shapes (spheres, triangles)
- Add sound effects for collisions
- Add temperature simulation (melting butter)
- Add obstacles/ramps
- Add multiplayer butter fights
