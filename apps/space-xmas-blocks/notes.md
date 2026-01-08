# Space Xmas Blocks

## log
- 2025-12-25: Major refinements - smooth physics controls, floating island terrain, collision system
  - Ship controls now use velocity-based physics with momentum and drag
  - Mouse look has smooth interpolation for cinematic feel
  - Camera rolls when strafing for immersion
  - Voxel terrain now generates beautiful floating islands with biomes (snow, forest, candy, presents)
  - Proper collision detection with camera shake, screen flash, and particle explosions
  - Engine glow changes color when boosting (cyan -> orange)

## issues
- Large island generation can be slow on first load (25 islands with procedural noise)
- Mobile controls may need tuning for responsiveness

## todos
- Add sound effects for engine, collision, boost
- Consider adding collectible ornaments for score
- Maybe add procedural music

## notes
- Uses fbm noise for natural terrain generation
- Each island has its own floating animation offset for variation
- Collision particles inherit block color for satisfying feedback
