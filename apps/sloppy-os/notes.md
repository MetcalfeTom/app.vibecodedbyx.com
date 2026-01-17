# SloppyOS

## log
- 2026-01-17: Initial creation (2D desktop version)
- 2026-01-17: Added stream button and virtual pet
- 2026-01-17: Transformed into 3D first-person world
  - Three.js powered 3D environment
  - First-person controls (WASD + mouse look)
  - Pointer lock for immersive navigation
  - 12 floating app monoliths in a circle
  - Neon grid floor with fog
  - Ambient floating particles
  - Click monoliths to launch apps
  - App info popup on hover
  - Preserved pet and LIVE stream button
  - Mobile touch controls
  - Boot sequence and HUD overlay
- 2026-01-17: Added Sneaker Room
  - Enclosed room with neon walls and grid floor
  - 6 glowing 3D sneaker models on pedestals
  - Sneakers rotate and float
  - Each sneaker has unique color scheme and name
  - Exit portal to return to main arena
  - Neon strips on walls
- 2026-01-17: Rebuilt as Neon Mansion Hallway
  - Long corridor (80 units) replacing circular arena
  - 12 doors on walls (6 left, 6 right)
  - Each door has glowing frame, icon sprite, name label
  - Color-coded doors matching app themes
  - Click doors to launch apps or enter Sneaker Room
  - Neon ceiling strips (cyan, magenta, green)
  - Cyan grid floor pattern
  - Collision bounds keep player in hallway
  - Sneaker Room now accessed via special door
  - Room switching system (hallway <-> sneaker room)
  - Preserved boot sequence, HUD, pet, stream button
- 2026-01-17: Updated to 3D-only apps
  - Removed 2D apps from hallway doors
  - Left: Space Flight, Moon Explorer, Minecraft, Doom 3D, Motorbike Racing, Neon Bowling
  - Right: Voxel World, Disco Ball, Space Chess, Bikini Brawl, Eggcraft, Sneaker Room
- 2026-01-17: Added gothic chandeliers
  - 5 chandeliers spaced along hallway ceiling
  - 6 arms with candles and glowing flame orbs
  - Central haunting purple orb on each chandelier
  - Animated flames with flickering glow
  - Gentle swaying motion
  - Point lights for real illumination
- 2026-01-17: Added Khronos Duck model
  - Official glTF sample duck from KhronosGroup repository
  - Placed on glowing yellow pedestal at hallway center
  - Gentle bobbing and rotating animation
  - Yellow spotlight illumination
- 2026-01-17: Added Poly Haven stone textures
  - Dark weathered stone texture (rock_wall_16) from Poly Haven CC0
  - Applied to floor, walls, and ceiling
  - Tiled seamlessly across all surfaces
  - Dimmed neon grid overlay for gothic atmosphere
- 2026-01-17: Added screenshot capture feature
  - SNAP button captures current 3D view
  - Camera flash effect on capture
  - Preview popup with save/close options
  - Downloads as PNG with timestamp
  - Press P key for quick snapshot

## features
- 3D first-person navigation (WASD + mouse)
- Pointer lock for immersive controls
- Neon mansion hallway architecture
  - 80-unit long corridor
  - 8-unit wide, 6-unit high
  - 12 doors spaced 12 units apart
- Doors with colored glow effects
- Emoji icons on sprite labels above doors
- Cyan neon grid floor
- Ceiling with neon strips
- Raycasting for door detection
- Door info popup when looking at door
- Click to launch apps
- Sneaker Room accessible via special door
  - 6 unique 3D sneaker models
  - Glowing pedestals with color rings
  - Floating/rotating animation
  - Exit portal back to hallway
- Room switching system
- Collision detection to stay in bounds
- Boot sequence with mansion-themed messages
- HUD with clock and logo
- Crosshair overlay
- Neon LIVE stream button (Twitch sloppy_ai)
- Virtual pet (bottom right)
  - Egg hatches after 10 clicks
  - 5 evolution stages
  - Pet and Feed interactions
  - Happiness system with localStorage
- Mobile touch controls

## design
- Orbitron + Share Tech Mono fonts
- Cyan, magenta, green, yellow neon palette
- Dark background with atmospheric fog
- Grid floor pattern
- Colored door glows match app themes
- Mansion/corridor aesthetic

## apps included (door layout - 3D only)
Left wall:
1. Space Flight - cyan (3D space exploration)
2. Moon Explorer - purple (3D moon walking)
3. Minecraft - green (3D block building)
4. Doom 3D - red (3D shooter)
5. Motorbike Racing - orange (3D racing)
6. Neon Bowling - magenta (3D bowling)

Right wall:
7. Voxel World - green (3D voxel building)
8. Disco Ball - yellow (3D dance party)
9. Space Chess - blue (3D chess game)
10. Bikini Brawl - orange (3D fighting)
11. Eggcraft - tan (3D egg crafting)
12. Sneaker Room - magenta (special 3D portal)

## todos
- Add more rooms behind doors (not just links)
- Add ambient sounds/music
- Add decorations along hallway walls
- Add flickering light effects
- Add more special rooms like Sneaker Room

## issues
- None yet
