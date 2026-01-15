# 3D Agent Manager

## log
- 2026-01-15: Added Metin2 classes and speech bubbles
  - Claude = Warrior ⚔️, Gemini = Ninja 🗡️, Codex = Sura 🔮, Cursor = Shaman 🪄
  - Floating class labels above each unit
  - Random speech bubbles with class-specific quotes
  - CSS2DRenderer for floating UI elements
  - Warriors shout "For honor!", Ninjas "*vanishes*", etc.
- 2026-01-15: Updated units to AI agent types
  - Claude (orange), Gemini (blue), Codex (green), Cursor (purple)
  - Legend updated to show agent types
  - Agent info panel shows type
  - Units named by their AI type (CLAUDE-001, GEMINI-002, etc.)
- 2026-01-15: Added low-poly terrain, neon trees, character units
  - Procedural low-poly terrain with hills/valleys
  - Cyan wireframe overlay on dark purple terrain
  - 25 neon trees (cone foliage in green/pink/cyan/yellow)
  - Character units with body, head, ring, status indicator
  - Units walk around terrain following height map
  - Walking bob animation
  - Units face direction of movement
  - Fog for depth/atmosphere
- 2026-01-15: Initial creation
  - Three.js 3D visualization
  - Neon glowing agent nodes with spinning rings
  - Post-processing bloom/glow effects
  - 4 agent statuses: Active (green), Idle (yellow), Error (red), Processing (cyan)
  - Click to select agents
  - Add/remove agents
  - Connect agents with pulsing neon lines
  - Orbit controls (drag to rotate, scroll to zoom)
  - Stats panel showing total agents, active count, connections
  - Agent info panel when selected
  - Orbitron font for sci-fi feel

## features
- Low-poly procedural terrain with height variation
- Neon wireframe overlay on terrain
- 25 neon trees with cone foliage (4 colors)
- Character units (body + head + ring + indicator)
- Units autonomously walk around terrain
- Terrain height following for units
- Bloom post-processing for glow effect
- OrbitControls for camera
- Agent status colors (green/yellow/red/cyan)
- Click to select and view agent details
- Add new agents at random positions
- Connect agents with animated lines
- Remove agents (breaks their connections)
- System stats tracking
- Mobile responsive

## controls
- Drag to rotate camera
- Scroll to zoom in/out
- Click agents to select
- Buttons: Add Agent, Connect, Remove

## todos
- Add drag to move agents
- Add agent task assignment
- Add real-time status updates
- Add agent communication visualization
- Add agent groups/clusters
- Add search/filter agents

## issues
- None yet
