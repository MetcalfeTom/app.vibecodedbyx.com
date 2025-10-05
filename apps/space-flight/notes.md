# SpaceCraft Notes

## Log
- Rotation acceleration: starts slow (0.008) and speeds up to max (0.035) when held
- Turning slows ship down more gradually now (0.995 vs 0.97 - 6x gentler)
- Limited boost fuel system (drains 0.5/frame, recharges 0.15/frame) with color-coded UI
- Very gradual acceleration (0.002) from 0 to max cruising speed (2.5), boost allows much higher (6.0)
- Boost makes significant difference and is limited resource - strategic use required
- Takes a long time to reach top speed for realistic space flight feel
- Added camera inertia with smooth lerp follow (cameraLerpFactor: 0.08) for more cinematic flight feel
- Ship rotates in place, world moves relative to ship
- Voxel asteroids and blocky UFOs in dark starfield
- Nebula clouds with infinite wrapping effect

## Issues
- None currently

## Todos
- Consider adding collision detection
- Could add more voxel object variety
- Potential for shooting mechanics

## Technical Notes
- Uses THREE.js with importmap
- Camera smoothly follows ship using lerp for position and up vector
- World group contains all objects that move relative to ship
- Ship stays at origin and rotates, world translates
