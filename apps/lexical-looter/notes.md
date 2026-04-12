# Lexical Looter

First-person shooter where you blast misspelled words out of existence.

## log
- 2026-04-12: Spelling-only overhaul — removed grammar and punctuation enemies entirely. Expanded TYPOS from 10 to 30 commonly misspelled words (mispell, concensus, acquaintence, privlege, succesful, tommorrow, beleive, millenium, etc). Expanded DECOYS from 12 to 20 correctly-spelled single words. Updated bosses to spelling-themed. Renamed Grammar Hammer → Spell Smasher. spawnRandom now picks 78% typos / 22% decoys.
- 2026-04-12: Click-on-word targeting — hit detection now uses text bounding box instead of radius, must click directly on the word. Enemies clamped to stay within visible camera area (steer back if projected off edges). Spawn arc narrowed to forward-facing ~216 degrees.
- 2026-04-12: Retro pixel art hellscape overhaul. Canvas renders at low res (2x for 768p, 3x for larger) with image-rendering:pixelated. Apocalyptic background: gradient burning sky, mountain silhouettes, ruin columns with jagged tops, fire columns with flicker, lava crack ground, floating ember particles, CRT scanlines. Silkscreen + DotGothic16 pixel fonts. Pixel-art weapons (Red Pen, Grammar Hammer, Syntax Shotgun). Pixel crosshair and border-based enemy plates. Added 12 decoy enemies (correct words/phrases) — shooting them costs -20pts and -8HP, breaks combo. Removed type labels from all non-boss enemies for true skill test. Adaptive pixel scale for 768p resolution support.
- 2026-04-12: Initial build. 3D perspective FPS with mouse aiming. 10 typo enemies (teh, recieve, definately...), 8 grammar enemies (your wrong, their going, should of...), 5 punctuation enemies, 3 boss types (Run-on Sentence, Passive Voice, Txtspk). 3 weapons: Red Pen (fast/light), Grammar Hammer (slow/heavy), Syntax Shotgun (spread). Wave-based progression, enemies float in 3D and approach player. Combo system with multiplier. Letter explosion particles on kill. Correction text shown on enemy death. HP system, wave healing, boss healing. Chakra Petch + Fira Code typography, red/yellow neon on dark.

## features
- Pixel art rendering at adaptive low-res (2x/3x scale) with image-rendering:pixelated
- Apocalyptic hellscape background: burning sky, ruins, fire columns, lava cracks, embers, scanlines
- 3D pseudo-FPS with mouse aim and click-to-shoot
- 30 misspelled word enemies + 20 correctly-spelled decoys (no labels — true skill test!)
- Shooting correct words penalizes: -pts, -8HP, breaks combo
- 3 spelling-themed boss types every 5 waves
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
- Weapon pickup drops from bosses
- Leaderboard via Supabase
- Sound effects (typing sounds, corrections)
- More boss types
- OG preview PNG
