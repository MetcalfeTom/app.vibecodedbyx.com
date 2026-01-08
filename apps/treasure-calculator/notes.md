# Treasure Calculator

## log
- 2026-01-08: Added real-time leaderboard with Supabase
  - Anonymous auth for users
  - Score submission with pirate name
  - Top 10 pirates displayed
  - Gold/silver/bronze ranking colors
  - Tracks level reached and best streak
- 2026-01-08: MAJOR UPDATE - Full 3D with Three.js!
  - 3D ocean with animated water shader
  - 3D treasure chest with opening lid animation
  - 3D gold coins burst from chest on correct answer
  - Sand island environment
  - Palm trees
  - Flickering torches with dynamic lighting
  - Sunset sky with atmospheric effects
  - Camera gently bobs like on a ship
- 2026-01-08: Initial creation - pirate math game with treasure and lore
  - 3 difficulty levels (Cabin Boy, First Mate, Captain)
  - Math operations: +, -, ×, ÷
  - 20 unique nautical lore facts
  - 10 treasure types to discover
  - Streak multiplier for gold

## features
- **REAL-TIME LEADERBOARD** with Supabase backend
- Compete for top pirate rankings
- Submit score with custom pirate name
- **FULL 3D ENVIRONMENT** with Three.js
- Realistic animated ocean water
- 3D treasure chest with hinged lid that opens
- Gold coins with physics (burst upward, fall with gravity)
- Sand island with palm trees
- Torches with flickering flames and dynamic lighting
- Atmospheric sunset sky
- Level 1 (Cabin Boy): Addition & subtraction (1-20)
- Level 2 (First Mate): Adds multiplication (1-12 tables)
- Level 3 (Captain): All operations including division
- Random treasure + nautical lore on each solve
- Gold doubloons with streak multiplier
- Progress tracking per level

## controls
- Type answer and press Enter or click Plunder
- Click level buttons to switch difficulty

## design
- Three.js for 3D rendering
- Water shader from Three.js examples
- Sky shader with sun position
- Pirate fonts: Pirata One, IM Fell English SC
- Colors: Gold, ocean blue, wood brown, parchment
- PBR materials for chest (wood, gold metal)

## technical
- Three.js r160 via CDN
- Water.js and Sky.js from Three.js addons
- Custom coin physics simulation
- Smooth lid animation with lerp

## todos
- Add sound effects (coin jingle, chest creak, waves)
- Add leaderboard
- Add pirate ship in background
- Add seagulls flying
