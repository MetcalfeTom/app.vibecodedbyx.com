# SpaceCraft Notes

## Log
- Very gradual acceleration (0.002) from 0 to max cruising speed (2.5), boost allows higher (4.0)
- Takes a long time to reach top speed for realistic space flight feel
- Turning gradually slows ship down (97% speed multiplier per frame)
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
