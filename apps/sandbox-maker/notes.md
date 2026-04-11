# Sandbox Maker

Grid-based level editor — drag and drop walls, bounce pads, spikes, ice, a start point and a goal flag, then hit Play to test your creation as a platformer.

## log
- 2026-04-11: Initial build. Pastel minimalist palette (dusty rose, sage teal, periwinkle, mint, powder blue, warm butter). Tool palette sidebar (7 tools), click/drag painting, 3 grid sizes (20x14, 30x20, 16x10). Play mode with AABB platformer physics: gravity, wall collision, bounce pads, ice friction, spike reset, goal detection. Particle effects on bounce/death/win. Motion trail on player. Mobile touch controls. Clean, well-commented code with 10 numbered sections. Archivo Black + IBM Plex Mono typography.

## features
- 7 tile types: erase, wall, bounce, spike, ice, goal, start
- Click or drag to paint tiles on grid
- Only one Start and one Goal allowed (auto-replaces old)
- 3 grid sizes: 20x14, 30x20, 16x10
- Play mode with platformer physics (WASD/arrows + space/up to jump)
- Ice tiles reduce friction (player slides)
- Bounce pads launch player upward with particle burst
- Spikes reset player to start with death particles
- Goal triggers victory with rainbow particles
- Mobile touch controls (left/right/jump buttons)
- Default floor + start/goal placement on init

## issues
- None known

## todos
- Save/load levels (localStorage or Supabase)
- Share levels via URL-encoded grid data
- More tile types (moving platforms, portals, coins)
- Timer + death counter for challenge mode
- Supabase leaderboard for shared levels
- OG preview PNG
