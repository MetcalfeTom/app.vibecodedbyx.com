# Neon Giraffe Clicker

## Log
- 2026-09-26: Neon savanna night backdrop (pure CSS, no files): body::before = tiling star field + glowing moon (`--moon` position, moved to 84% 30% on phones so it clears the trophy button), masked to fade toward the ground, soft twinkle; body::after = inline SVG (40vh, repeat-x) with a synthwave perspective grid floor, glowing magenta horizon at ~25vh, two acacia silhouettes and a tiny distant giraffe. Phones: upgrades are ONE swipeable strip at the bottom (was four wrapped rows covering the giraffe), game area padded above it; h1 centered.
- 2026-09-26: 🏆 Achievements — 13 fart-themed trophies (First Toot, Gust Front, Category Five, Kaboom, Repeat Offender, Crab Whisperer, Hydra, Dressed Up, Mad Milliner, Robot Butler, Sleep Farter, Gas Tycoon, Gas Giant). `achStats` {farts, booms, crabs, afk} + `achGot` saved in the neonGiraffe save (`ach`, `stats`); old saves are credited quietly (no toast flood). Checked in updateUpgradeButtons(); gold toast slides up from the bottom one at a time with a 3-note chime; 🏆 n/13 button beside the stats opens the Trophy Shelf dialog (Escape/backdrop close, focus returns).
- 2026-09-26: progress SAVES now (localStorage 'neonGiraffe': clicks + owned counts + time; every 5 s, on buy, on hide/pagehide). Auto-clickers keep earning while you're away (max 2 h) → WELCOME BACK toast with the amount. Giraffe drawing scaled 0.855 and shifted so tall hats (wizard) and the hooves are no longer cut off by the 300×400 canvas. og.png (real screenshot) replaces the emoji og:image.
- 2026-01-11: Initial creation
  - Neon giraffe with animated wobble
  - Click to fart and earn points
  - "YOU CLICKED THE GIRAFFE!" popup text
  - Procedural fart sounds (Web Audio API)
  - Green fart cloud particles
  - Upgrades: Extra Head, Top Hat, Party Hat, Crown, Auto-Clicker
  - Multiple heads with individual hats
  - Health bar depletes from excessive farting
  - Giraffe explodes into neon bones when health reaches zero
  - 3 second respawn timer
  - Health regenerates slowly over time

## Features
- **Click the Giraffe**: Each click triggers a fart sound and earns points
- **Health System**: Too much farting depletes health, causing explosion
- **Neon Bones**: Skull, leg, rib, spine, hoof bones fly everywhere on explosion
- **Upgrades**:
  - Extra Head: +50% clicks per head, adds another neck/head
  - Top Hat: Fancy black top hat with magenta band
  - Party Hat: Colorful cone with pom pom
  - Crown: Golden crown with gems
  - Auto-Clicker: Passive clicks per second

## Technical
- Canvas 2D rendering
- Web Audio API for procedural sounds
- CSS animations for text popups
- Particle systems for farts and bones

## Todos
- More hats? (already 8: top, party, crown, viking, beret, propeller, wizard, sombrero)
- Achievements done — maybe secret ones (e.g. click the crab 50 times)
- Add more upgrade tiers
