# SpaceCraft Notes

## Log
- UI polish: Moved Mode toggle under stream link (top-right) and replaced Boost text with a subtle progress bar below it; bar color shifts from cyan→amber→red as fuel lowers.
- Added Physics mode (inertial): turning doesn't affect velocity; ship coasts until you boost. Boost applies thrust along facing, so it can accelerate, decelerate (retro-burn), or curve your trajectory naturally. Toggle via Mode button (top-left) or UI.
- Mobile UX: Inverted up/down mapping (↑=S, ↓=W), moved Boost to right side of diamond, and ensured on-screen controls hidden on desktop and shown on mobile only.
- Mobile controls: Replaced split bars with centered diamond grid (↑, ←, ⚡, →, ↓) for better fit.
- Boost stronger: increased maxBoostSpeed to 12.0 and boostAcceleration to 0.02 for a snappier, faster boost.
- **Boost acceleration boost**: Boost now accelerates 4x faster (0.008 vs 0.002) and reaches higher top speed (8.0 vs 6.0)
- **Rotational inertia update**: Much slower rotation start (0.003) with gradual ramp-up, continues briefly after release for inertia feel
- Rotation acceleration: now 0.0003 (was 0.0008) for much slower buildup
- Max turn speed reduced to 0.025 (was 0.035) - slower overall rotation
- Added turnDeceleration (0.0005) so rotation gradually stops instead of instant
- Turning decelerates ship more aggressively (0.985 vs 0.995)
- Limited boost fuel system (drains 0.5/frame, recharges 0.15/frame) with color-coded UI
- Very gradual acceleration (0.002) from 0 to max cruising speed (2.5)
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
 - Physics mode uses a velocity vector; arcade mode uses scalar speed with forward direction
