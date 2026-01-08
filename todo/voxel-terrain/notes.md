# Voxel Terrain

## log
- 2026-01-05: Initial creation - 3D voxel terrain with first-person controls

## features
- Procedural terrain with multi-octave noise
- Height-based voxel coloring (water, sand, grass, dirt, stone, snow)
- First-person camera with pointer lock
- WASD movement + mouse look
- Jump (space) and sprint (shift)
- Terrain collision and gravity
- Fog for depth
- Shadow mapping
- Optimized geometry (only visible faces rendered)
- Position HUD

## design
- Minecraft-inspired voxel aesthetic
- Sky blue background with fog
- Soft shadows from sun
- Green/brown/grey biome colors
- Crosshair overlay

## technical
- Three.js with ES modules
- PointerLockControls for FPS camera
- BufferGeometry with merged faces for performance
- Height map pre-calculation
- Face culling for hidden voxels
- 64x64 world size, max 24 height

## controls
- WASD: Move
- Mouse: Look
- Space: Jump
- Shift: Sprint
- ESC: Pause/unlock

## issues
- Performance drops with larger world sizes
- No chunk loading (fixed world size)

## todos
- Add chunk-based infinite terrain
- Add block placement/destruction
- Add water physics
- Add trees and vegetation
- Add day/night cycle
