# BlockForge

## log
- 2026-04-07: Initial build — 3D voxel mining/building/crafting/survival sandbox in a single HTML file using Three.js 0.160 (importmap). 40x20x40 world with value-noise + fBm terrain, ores (coal/iron), trees, berry bushes. First-person controller with pointer lock, WASD+space, AABB collision, gravity. DDA voxel raycast for mine/place. InstancedMesh per block type, rebuilt on edit, exposed-only faces. 11 block types (grass/dirt/stone/wood/leaf/sand/plank/coal/iron/berry/glass), 3 tools (wood pick/stone pick/axe). 5 crafting recipes. HP + hunger survival with regen. Respawn on death (half inventory drop). VT323 + Press Start 2P typography, sky-blue fog, no textures — flat Lambert color per block.

## features
- WASD movement, SPACE jump, mouse-look (pointer lock)
- Gravity + AABB collision + void death at y<-10
- Left click mines targeted block (raycast DDA), right click places from active slot
- 1–8 hotbar with keyboard slot select and click-to-select
- 8-slot inventory with auto-stacking
- 5 crafting recipes (E to open): planks, wood pick, stone pick, axe, glass
- Stone/coal/iron require a pickaxe (toast warning otherwise)
- HP (10) + hunger (10) bars; hunger drains over time, then HP drains; regen when full-fed
- F to eat berries (+3 hunger)
- Respawn on death drops half inventory
- Terrain: value-noise fBm heightmap, sand at sea level, grass above, ore in deep stone
- Procedural trees + berry bush scatter
- Glass block is transparent
- Sky-blue fog, no external assets

## issues
- No textures — colored cubes only (intentional, keeps load instant)
- Full-world re-mesh on every block edit (fine at 40x20x40, would lag at bigger scale)
- No mobile controls (keyboard/mouse required)
- No day/night cycle, no enemies
- No save — fresh world on reload

## todos
- Dirty chunking so only edited region re-meshes
- Mobile touch joystick + tap-to-mine
- Day/night + simple hostile mobs
- More ores + furnace/smelting recipes
- Save to localStorage
- Real PNG OG image
