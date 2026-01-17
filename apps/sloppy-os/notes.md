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

## apps included (door layout)
Left wall:
1. Secret Shredder - red
2. Bug Zap - cyan
3. Tech Church - gold
4. Neon Weather - blue
5. Neon Aquarium - magenta
6. Pixel Bonfire - orange

Right wall:
7. Terminal Escape - green
8. Candle Sailor - blue
9. SLOPPY Dashboard - magenta
10. BAGS Tracker - green
11. Rugpull Simulator - red
12. Sneaker Room - magenta (special portal)

## todos
- Add more rooms behind doors (not just links)
- Add ambient sounds/music
- Add decorations along hallway walls
- Add flickering light effects
- Add more special rooms like Sneaker Room

## issues
- None yet
