# Hidden Hunt

2D hidden object game — find letters camouflaged in procedurally generated scenes to spell mystery words.

## log
- 2026-04-11: Initial build. 5 themed scenes (Enchanted Forest, Desert Ruins, Ocean Depths, Volcanic Cavern, Crystal Tundra), each procedurally generated with seeded RNG. Letters drawn at reduced opacity in theme-matching colors to camouflage them. Click/tap to reveal — gold glow ring on hit, red ring + 2s time penalty on miss. 3 hints per scene (highlights a random unfound letter). Target bar shows word progress. 15 word pool. DM Serif Text + IBM Plex Mono typography, warm gold-on-dark aesthetic.

## features
- 5 procedural scene themes with distinct palettes and elements
- Letters camouflaged by color, opacity, rotation, and size variation
- Click detection with 28px radius tolerance
- Miss penalty adds 2 seconds to timer
- 3 hints per scene — flashing circle around random unfound letter
- Target bar showing word letter slots
- Touch support
- 15 mystery words

## issues
- Scene image stored as ImageData — redrawing on resize regenerates with different seed
- Letters may overlap scene elements making some very hard to spot

## todos
- Difficulty scaling (smaller letters, lower opacity in later scenes)
- Score system based on time + accuracy
- Supabase leaderboard
- Sound effects (chime on find, buzz on miss)
- OG preview PNG
- Zoom/magnifying glass mechanic for mobile
