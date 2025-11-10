# Sandustry Clone - Physics Mining Game

## Log
- 2025-11-10: Created Sandustry-inspired mining game with Phaser 3
- Features falling sand physics, mining, and resource collection
- Simplified version focusing on core mechanics
- Live at https://app.vibecodedbyx.com/sandustry-clone

## About Sandustry
Sandustry is a mining and factory automation game where every pixel is a simulated resource. It combines:
- Destructible pixel-based terrain
- Falling sand physics simulation
- Factory building and automation
- Mining and resource processing
- Boss fights and puzzle solving

## Features Implemented
- **Falling Sand Physics**: Sand particles fall and slide realistically
- **Mining System**: Click to mine blocks within range
- **Resource Types**: Sand, Stone, Gold, Bedrock
- **Player Movement**: WASD/Arrow keys with jumping
- **Block Placement**: Right-click to place sand blocks
- **Resource Counter**: Track collected materials
- **Depth Meter**: Shows how deep you've mined
- **Camera Follow**: Smooth camera that follows player
- **Generated World**: 100x150 tile procedural world

## Controls
- **←→** Arrow Keys - Move left/right
- **↑** Arrow Key - Jump
- **Left Click** - Mine block (within range)
- **Right Click** - Place sand block (costs 1 sand)
- Mine within 5 tiles of player

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

## Issues
- No automation/factory building yet (simplified version)
- No save/load system
- Physics could be more sophisticated
- No multiplayer
- Limited to falling sand (no water, fire, etc.)

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
