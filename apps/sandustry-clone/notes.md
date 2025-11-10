# Boom Miner - TNT Explosion Mining Game

## Log
- 2025-11-10: Created Sandustry-inspired mining game with Phaser 3
- 2025-11-10: MAJOR UPDATE - Added TNT explosions! Minecraft-style bombing
- Features falling sand physics, mining, and EXPLOSIONS!
- Blow up terrain with TNT for massive resource collection
- Live at https://app.vibecodedbyx.com/sandustry-clone

## About Sandustry
Sandustry is a mining and factory automation game where every pixel is a simulated resource. It combines:
- Destructible pixel-based terrain
- Falling sand physics simulation
- Factory building and automation
- Mining and resource processing
- Boss fights and puzzle solving

## Features Implemented
- **💣 TNT EXPLOSIONS**: Place TNT and blow up huge areas!
- **🔥 Particle Effects**: Beautiful explosion effects with camera shake
- **⛓️ Chain Reactions**: TNT triggers nearby TNT for massive explosions
- **Falling Sand Physics**: Sand particles fall and slide realistically
- **Mining System**: Click to mine blocks within range
- **Resource Types**: Sand, Stone, Gold, Bedrock, TNT
- **Player Movement**: Arrow keys with jumping
- **TNT Placement**: Right-click to place TNT blocks
- **Explosion Radius**: 8-tile radius destroys everything (except bedrock)
- **Resource Collection**: Explosions auto-collect all destroyed materials
- **Resource Counter**: Track collected materials including TNT
- **Depth Meter**: Shows how deep you've mined
- **Camera Follow**: Smooth camera that follows player
- **Generated World**: 100x150 tile procedural world

## Controls
- **←→** Arrow Keys - Move left/right
- **↑** Arrow Key - Jump
- **Left Click** - Mine block (within range)
- **Right Click** - Place TNT block (costs 1 TNT)
- **Middle Click or T Key** - DETONATE ALL TNT! 💥
- Mine/place within 5 tiles of player
- Start with 5 TNT, collect more by mining

## Technical Implementation
- Built with Phaser 3 (3.70.0)
- Tile-based world (8x8 pixel tiles)
- Simple cellular automata for sand physics
- Arcade physics for player
- Real-time world rendering with viewport culling
- Resource tracking system

## World Generation
- Sky: Air (top 10 rows)
- Surface: Random sand/stone/gold distribution
  - 70% Sand
  - 25% Stone
  - 5% Gold
- Bedrock layer at bottom (unbreakable)
- Starting clearing around spawn point

## Physics System
- Sand falls straight down if air below
- Sand slides sideways if blocked
- Update runs every 100ms
- Player has gravity and collision detection

## Explosion Mechanics
- Circular explosion radius (8 tiles)
- Destroys all blocks except bedrock
- Auto-collects resources from destroyed blocks
- Particle effects with red/orange/yellow colors
- Camera shake for impact feel
- Chain reactions when TNT hits TNT
- 100ms delay on chain reactions for cascading effect

## Issues
- No automation/factory building yet (simplified version)
- No save/load system
- Physics could be more sophisticated
- No multiplayer
- Limited to falling sand (no water, fire, etc.)
- Player can be damaged by their own explosions (could add invulnerability)

## Todos
- Add conveyor belts and automation
- Add more material types (water, lava, etc.)
- Add factory buildings (smelters, refiners)
- Add crafting system
- Add better graphics/sprites
- Add sound effects
- Add save/load to localStorage
- Add bosses and enemies
- Add liquid physics
- Add temperature system
- Optimize rendering for larger worlds
