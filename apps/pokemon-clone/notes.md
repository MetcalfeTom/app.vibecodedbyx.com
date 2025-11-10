# Creature Catcher - Pokemon Clone

## Log
- 2025-11-10: Initial creation of Pokemon-style creature catching game
- 2025-11-10: Major update - Added city and route system with map transitions
- Built with vanilla JavaScript and HTML5 Canvas (no external game engine)
- Features: overworld exploration, random encounters, creature catching, inventory system
- 10 different creature types with varying rarities and catch rates
- Multiple maps: Starter Town, Route 1 (60 tiles long), Oak City
- Game live at https://app.vibecodedbyx.com/pokemon-clone

## Features
- **Overworld Exploration**: Arrow key movement through a tile-based map
- **Multiple Maps**: 3 different maps - 2 cities and 1 route
  - Starter Town: 30x30 starting town with Pokemon Center, Mart, and houses
  - Route 1: 30x60 long route with grass patches on both sides
  - Oak City: 35x30 larger city with gym and more buildings
- **Map Transitions**: Walk through exits to transition between maps
- **Cities with Buildings**: Buildings rendered with house emojis, doors marked
- **Proper Routes**: Long vertical route with grass patches on sides and clear path in center
- **Random Encounters**: Walk through grass for 15% chance to encounter wild creatures (only in grass!)
- **Battle System**: Turn-based catching mechanics with health bars
- **Creature Collection**: 10 unique creatures with emoji sprites
- **Rarity System**: Creatures have different encounter rates (common to legendary)
- **Catch Mechanics**: Success based on creature's catch rate and current health
- **Inventory**: Track Pokeballs (start with 10) and caught creatures
- **Camera System**: Follows player around the map
- **Stats Tracking**: Encounters, caught creatures, remaining Pokeballs
- **Map Name Display**: Shows current map name in top-left corner

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

## Map Structure
- **Starter Town** (30x30): Starting location with Pokemon Center, Mart, player house. Exit north to Route 1.
- **Route 1** (30x60): Long vertical route connecting Starter Town to Oak City. Heavy grass patches on both sides with clear path down the center.
- **Oak City** (35x30): Larger city with Gym building, Pokemon Center, and multiple houses. Entry from Route 1 to the south.

## Issues
- No way to get more Pokeballs (game ends when you run out)
- No persistent storage (progress resets on refresh)
- Limited to 10 Pokeballs total
- Doors to Pokemon Center/Mart don't lead anywhere yet

## Todos
- Add interiors for Pokemon Center and Mart
- Add Pokeball shop in Mart
- Add healing in Pokemon Center
- Add localStorage to save progress
- Add creature stats and levels
- Add more routes and cities
- Add sound effects and music
- Add animations for catching/battles
- Add creature abilities or types
- Consider adding battle system (not just catching)
- Add NPCs and trainers
