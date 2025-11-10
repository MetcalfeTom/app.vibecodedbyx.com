# Creature Catcher - Pokemon Clone

## Log
- 2025-11-10: Initial creation of Pokemon-style creature catching game
- Built with vanilla JavaScript and HTML5 Canvas (no external game engine)
- Features: overworld exploration, random encounters, creature catching, inventory system
- 10 different creature types with varying rarities and catch rates
- Procedurally generated 30x30 tile map with grass, trees, walls
- Game live at https://app.vibecodedbyx.com/pokemon-clone

## Features
- **Overworld Exploration**: Arrow key movement through a tile-based map
- **Random Encounters**: Walk through grass for 15% chance to encounter wild creatures
- **Battle System**: Turn-based catching mechanics with health bars
- **Creature Collection**: 10 unique creatures with emoji sprites
- **Rarity System**: Creatures have different encounter rates (common to legendary)
- **Catch Mechanics**: Success based on creature's catch rate and current health
- **Inventory**: Track Pokeballs (start with 10) and caught creatures
- **Camera System**: Follows player around the map
- **Stats Tracking**: Encounters, caught creatures, remaining Pokeballs

## Creature Types
1. 🔥 Flamey (Common, 50% catch)
2. 💧 Aqua (Common, 50% catch)
3. 🍃 Leafy (Common, 50% catch)
4. ⚡ Sparky (Uncommon, 40% catch)
5. 🪨 Rocky (Uncommon, 40% catch)
6. ❄️ Frosty (Rare, 35% catch)
7. 👻 Ghosty (Very Rare, 30% catch)
8. 🐉 Drago (Epic, 20% catch)
9. ⭐ Starry (Legendary, 15% catch)
10. 🌟 Legendary (Mythic, 10% catch)

## Controls
- Arrow Keys: Move player
- SPACE: Throw Pokeball (in battle)
- ESC: Run from battle

## Technical Implementation
- Canvas-based rendering with tile system (32px tiles)
- Procedural map generation
- State machine (overworld/battle states)
- Input debouncing for smooth movement
- Camera follows player with offset calculation
- Rarity-weighted random selection for encounters
- Dynamic catch rate based on creature health

## Issues
- No way to get more Pokeballs (game ends when you run out)
- No persistent storage (progress resets on refresh)
- Limited to 10 Pokeballs total

## Todos
- Add Pokeball shop or way to earn more
- Add localStorage to save progress
- Add creature stats and levels
- Add multiple areas/maps
- Add sound effects and music
- Add animations for catching/battles
- Add creature abilities or types
- Consider adding battle system (not just catching)
