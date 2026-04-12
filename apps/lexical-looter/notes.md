# Lexical Looter

First-person shooter where you blast misspelled words out of existence.

## log
- 2026-04-12: Spelling Bee mode (v1.2.0) — 4th difficulty option with 30 competition-level misspelled words (diphtheria, bougainvillea, chrysanthemum, etc) + 30 correctly-spelled decoys. 35% decoy rate (vs 22% normal). Shooting correct words costs 25 HP (vs 8). All tiers unlocked from wave 1. Rounds labeled "BEE ROUND" with unique banner text.
- 2026-04-12: Cosmetic shop (v1.1.0) — spend combo points on 5 word skins (Default/Toxic/Frost/UV/Plasma) and 5 crosshair styles (Cross/Diamond/Circle/Skull/Star). Combo points earned from kills (multiplied by combo). All unlocks persisted in localStorage. Shop accessible from start screen + pause menu.
- 2026-04-12: Version display + source download — v1.0.0 tag shown bottom-right, "source.zip" link downloads the full game as a single HTML file via Blob. Subtle styling that doesn't interfere with gameplay.
- 2026-04-12: Todos cleanup — (1) Weapon pickups: boss kills drop glowing powerups (Rapid Pen, Mega Pen, Heal Kit, Combo Lock) that float in 3D and drift toward player, collect on proximity, buff bars in HUD. (2) Supabase leaderboard: score submit on death with name input (localStorage), top 10 display on game-over, gold/silver/bronze styling. Table: lexical_looter_scores. (3) 3 boss types cycling every 5 waves: Snake (multi-segment serpent), Swarm (many small fast enemies), Splitter (splits into 2 halves on death). (4) OG preview PNG added.
- 2026-04-12: Mouse-look camera + 3D background objects — camera yaw pans smoothly based on mouse X position (±17°, lerped). 3D projection now rotates world coords by camYaw. 2D background layers parallax at 3 depths (far mountains, mid ruins/fires, near lava cracks). 20 decorative 3D objects scattered around the world: burning pillars with fire tops, floating glowing runes, skull piles, broken swords, tall obelisks with pulsing tips, hanging cages with chains. All depth-sorted and projected through the 3D engine.
- 2026-04-12: Custom words + language selector — custom word input on start screen (comma-separated, saved to localStorage). Auto-typo generator creates misspellings via letter swaps, doubling, dropping, vowel replacement, and common substitutions. 5 language packs (English/Spanish/French/German/Portuguese) with ~20 curated typo/correct pairs each. Custom+language words mix into spawn pool at 30% rate when present.
- 2026-04-12: 50 tiered words + snake boss + difficulty selector — 5 tiers of 10 misspellings each (easy→nightmare) that unlock as waves progress. 25 matching decoys. Snake boss every 5 waves: multi-segment serpent where each segment is a misspelled word, segments follow the head in a chain. 3 snake sizes (4/5/6 segments). Difficulty selector on start screen (Easy/Normal/Hard) affects speed, tier unlock rate. Tightened screen-edge clamping for better word visibility. Narrowed spawn angle.
- 2026-04-12: Audio & pause — WebAudio SFX (shoot, hit, kill, miss, penalty buzz, wave fanfare, reload, boss rumble, death). Dark ambient music (drone oscillators + filtered noise pad with LFO pulsing). ESC pause menu with SFX/Music volume sliders. Cursor visible on start screen. Pause button in HUD.
- 2026-04-12: Spelling-only overhaul — removed grammar and punctuation enemies entirely. Expanded TYPOS from 10 to 30 commonly misspelled words (mispell, concensus, acquaintence, privlege, succesful, tommorrow, beleive, millenium, etc). Expanded DECOYS from 12 to 20 correctly-spelled single words. Updated bosses to spelling-themed. Renamed Grammar Hammer → Spell Smasher. spawnRandom now picks 78% typos / 22% decoys.
- 2026-04-12: Click-on-word targeting — hit detection now uses text bounding box instead of radius, must click directly on the word. Enemies clamped to stay within visible camera area (steer back if projected off edges). Spawn arc narrowed to forward-facing ~216 degrees.
- 2026-04-12: Retro pixel art hellscape overhaul. Canvas renders at low res (2x for 768p, 3x for larger) with image-rendering:pixelated. Apocalyptic background: gradient burning sky, mountain silhouettes, ruin columns with jagged tops, fire columns with flicker, lava crack ground, floating ember particles, CRT scanlines. Silkscreen + DotGothic16 pixel fonts. Pixel-art weapons (Red Pen, Grammar Hammer, Syntax Shotgun). Pixel crosshair and border-based enemy plates. Added 12 decoy enemies (correct words/phrases) — shooting them costs -20pts and -8HP, breaks combo. Removed type labels from all non-boss enemies for true skill test. Adaptive pixel scale for 768p resolution support.
- 2026-04-12: Initial build. 3D perspective FPS with mouse aiming. 10 typo enemies (teh, recieve, definately...), 8 grammar enemies (your wrong, their going, should of...), 5 punctuation enemies, 3 boss types (Run-on Sentence, Passive Voice, Txtspk). 3 weapons: Red Pen (fast/light), Grammar Hammer (slow/heavy), Syntax Shotgun (spread). Wave-based progression, enemies float in 3D and approach player. Combo system with multiplier. Letter explosion particles on kill. Correction text shown on enemy death. HP system, wave healing, boss healing. Chakra Petch + Fira Code typography, red/yellow neon on dark.

## features
- Pixel art rendering at adaptive low-res (2x/3x scale) with image-rendering:pixelated
- Apocalyptic hellscape background: burning sky, ruins, fire columns, lava cracks, embers, scanlines
- 3D pseudo-FPS with mouse aim and click-to-shoot
- 50 tiered misspelled words (5 tiers x 10) + 25 correctly-spelled decoys (no labels — true skill test!)
- Tiers unlock with wave progression, weighted toward hardest available tier
- Shooting correct words penalizes: -pts, -8HP, breaks combo
- 3 boss types every 5 waves: Snake serpent, Swarm rush, Splitter (splits on death)
- Boss kills drop weapon pickups: Rapid Pen, Mega Pen, Heal Kit, Combo Lock
- Cosmetic shop: 5 word skins + 5 crosshair styles, purchased with combo points earned from kills
- Supabase leaderboard with top 10 on game-over screen
- Difficulty selector: Easy/Normal/Hard/Spelling Bee — affects speed, tier unlock, word pools
- 3 pixel-art weapons: Red Pen, Spell Smasher, Syntax Shotgun (unlock at waves 3 & 6)
- Combo multiplier system (x1-x5)
- Letter explosion particles and correction text on kills
- Wave-based with scaling difficulty
- Reload mechanic (R key), weapon switching (1/2/3)
- Mobile touch support
- Silkscreen + DotGothic16 pixel typography

## issues
- None known

## todos
- None — all original todos completed!
