# Infinite Quest

## log
- 2026-04-02: Initial build. Procedural text adventure with template-based scene generation. 6 themes, typewriter effect, stats tracking, random events (treasure, monsters, NPCs, secrets), keyboard shortcuts (1-2-3), scrolling adventure log with faded past scenes. Crimson Pro + Fira Code typography, dark parchment aesthetic.

## features
- 6 themes: dungeon, forest, space station, underwater temple, haunted castle, crystal caves
- Template system with fill-in tokens (adj, detail, creature_hint, sight, smell, feature, discovery, light, direction, location)
- Random events: treasure (gold or items), monster encounters (win/lose with damage), NPC meetings (gold/healing/lore), secret discoveries
- Stats: health with bar, gold, items collected, depth (scenes explored)
- Typewriter effect for narrative text
- Keyboard shortcuts 1/2/3 for choices
- Theme shifts every ~25% of scenes
- Past scenes fade in the log
- Game over screen with summary and restart
- Inventory panel shows collected items

## issues
- None yet

## todos
- Could add save/load via localStorage
- Supabase leaderboard for deepest run
- More scene templates per theme for additional variety
- Boss encounters at milestone depths (10, 20, 30...)
- Item usage mechanics (health potions heal, keys unlock doors)
- Sound effects for events
