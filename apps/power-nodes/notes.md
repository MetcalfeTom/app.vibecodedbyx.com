# Power Nodes

## log
- 2026-03-29: V1 — 2D top-down RPG puzzle game. 5 levels of increasing complexity. Player walks through dungeon, activates magical power nodes by stepping on them (or pressing E/space to toggle adjacent). Nodes are color-coded; matching nodes power doors that require N activations of that color. Animated energy beams connect active nodes to their doors. Doors show required count, dissolve when powered. Exit portal unlocks when all doors open. Crystals as decorative elements. Ambient floating particles. WebAudio tones for steps/activation/doors/exit. Mobile dpad + action button. Cinzel + JetBrains Mono typography, purple/dark dungeon aesthetic.

## features
- 5 hand-crafted puzzle levels
- WASD/arrow keys movement
- Step on nodes to activate, E/space to toggle adjacent nodes
- Color-coded nodes (pink, blue, yellow, green, orange, purple)
- Doors require N nodes of matching color
- Animated dashed energy beams from nodes to powered doors
- Door shows required count, dissolves when opened
- Exit portal with concentric ring animation
- Crystal decorations with diamond glow
- Ambient floating particles in node colors
- Particle bursts on node activation and door opening
- Player character with glow and eyes
- WebAudio SFX (step, activate, door open, level complete)
- Mobile touch controls (dpad + action button)
- Move counter per level
- Restart button (R key or button)

## issues
- None currently

## todos
- More levels
- Push-block mechanics
- Timed puzzles
- Node chain reactions
- Minimap for larger levels
- Par score display (target moves)

## notes
- Tile types: FLOOR=0, WALL=1, NODE=2, DOOR=3, EXIT=4, CRYSTAL=5, VOID=6
- Node colors indexed into NODE_COLORS array
- Doors check activated node count by color to determine open/closed
- Energy beams: animated dashed lines with scrolling dash offset
- Tile size auto-calculated to fit viewport
- Levels defined as flat map arrays with separate node/door/exit metadata
