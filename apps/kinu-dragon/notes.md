# Kinu the Dragon

WASD keyboard platformer — run, jump, and double-jump through procedural levels collecting gems and dodging spikes.

## log
- 2026-04-12: Seed-based level generation. Mulberry32 seeded PRNG replaces all Math.random() in generateLevel (37 calls). Human-readable seed names (AdjectiveNoun###, e.g. "AncientFang742"). Seed displayed in HUD (click to copy). Seed shown on game over/level complete screens. Same seed = same level layout, gems, spikes, trampolines, moving platforms, portals.
- 2026-04-12: Added trampolines (green bouncy pads, 1.7x jump power, spring coil animation), moving platforms (horizontal/vertical oscillation, carry Kinu, orange glow), and portal pairs (cyan/magenta spinning rings, bidirectional teleport with cooldown, sparkle FX). 8 petting/boop achievements (boop snoot mechanic with small hitbox).
- 2026-04-12: Added petting mechanic — click/tap Kinu to pat with hand animation and heart particles. totalPets stat tracked. 2 petting achievements (Good Boy, Dragon Whisperer).
- 2026-04-12: Added 100-achievement hunter system. 12 categories (Distance, Gems, Score, Deaths, Levels, Jumps, Air, Crouch, Time, Runs, Records, Feats). Stats tracked in localStorage (totalGems, totalDist, totalScore, totalDeaths, totalJumps, totalDoubleJumps, totalCrouches, levelsCompleted, totalPlaySec, totalRuns, plus single-run records). Achievement panel overlay, toast notifications, progress bar, win screen at 100/100. Creative/weird milestone descriptions. Hooked into all game events (jump, gem collect, die, level complete, resetGame, update loop).
- 2026-04-12: Converted to WASD platformer with gravity and ground tiles. Procedural level generation (120+ columns), obsidian ground tiles with yellow crystal highlights, floating platforms, red spike hazards, diamond gem pickups, goal marker. Double-jump, tile-based collision, camera follow. Mobile touch zones (left/middle/right). Level complete screen with bonus scoring.
- 2026-04-12: Rethemed to black & yellow palette.
- 2026-04-12: Initial build as side-scrolling flyer.

## features
- WASD / Arrow key movement with Space to jump
- Double-jump (2 jumps before landing)
- Procedural level generation with ground, platforms, gaps, spikes
- Obsidian ground tiles with yellow crystal edge highlights
- Floating platforms with neon yellow top glow
- Red spike hazards (triangular)
- Diamond gem pickups (4 yellow variants)
- Goal marker at end of level
- Smooth camera follow
- Mobile touch controls (left/jump/right zones)
- Canvas-drawn black dragon with yellow accents
- Parallax star background
- Particle effects on jump, collect, death
- Black & yellow color scheme throughout

## issues
- None known

## todos
- Multiple levels with increasing difficulty
- Supabase leaderboard
- Moving platforms
- Enemy creatures
- Fire breath attack
- Coins counter / shop
- Sound effects
- OG preview PNG
