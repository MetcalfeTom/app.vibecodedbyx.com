# Quaternion Orbit Visualizer

## log
- 2026-01-18: Added w-opacity mapping and ternary glitch effect
  - Trail opacity now maps to |w| component
  - Shader-based per-vertex opacity
  - Glitch effect triggers when w < 0.15 (ternary state)
  - Screen shake, chromatic aberration, scan lines
  - Random ternary state labels (NULL, VOID, NaN, etc.)
- 2026-01-18: Initial creation
  - 3D quaternion rotation visualization
  - Neon orbital trails
  - Live quaternion component display
  - Multiple presets

## features
- 3D scene with orbiting spheres
- Each orbit uses quaternion rotations
- Neon glow trails following each orbit
- Live quaternion display (w, x, y, z)
- Controls:
  - Rotation speed
  - Trail length
  - Number of orbits (1-8)
  - Axis toggles (X, Y, Z)
- Presets:
  - Gimbal Lock demo
  - SLERP demo
  - Chaotic rotations
  - Synchronized orbits
- Camera controls (drag to rotate, scroll to zoom)

## design
- Orbitron + JetBrains Mono fonts
- Cyan/magenta neon color scheme
- Glowing spheres with trails
- Reference axes (RGB = XYZ)
- Grid floor

## controls
- Drag: rotate camera
- Scroll: zoom
- Sliders: adjust parameters
- Axis buttons: toggle rotation axes

## todos
- Add SLERP interpolation visualization
- Add quaternion multiplication demo
- Add euler angle comparison
- Add gimbal lock demonstration

## issues
- None yet
