# Neon Giraffe Clicker

## Log
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
- Add more hat types (cowboy, wizard, etc.)
- Add achievements
- Save progress to localStorage
- Add more upgrade tiers
