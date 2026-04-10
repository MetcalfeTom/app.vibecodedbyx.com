# Void Beacon

Cursed lighthouse sim — sweep a light beam across dark waters to reveal sea monsters.

## log
- 2026-04-10: Initial build. Mouse/touch controls beam angle from lighthouse. 6 monster types (Abyssal Eel, Kraken Tentacle, Deep One, Leviathan Eye, Shadow Maw, Jellybloom), each with unique canvas-drawn animation. Sanity system — revealing monsters drains sanity, too many visible at once accelerates drain. Screen shake at low sanity, red vignette, game over when sanity hits 0. Score = unique monsters revealed. Monsters drift slowly toward lighthouse. Fog particles, wave layers, lighthouse with lamp glow. WebAudio dread drones on reveal. Creepster + Special Elite typography, pitch-black ocean aesthetic.

## features
- 6 hand-drawn monster types with unique animations
- Physics-based beam cone with inner/outer glow
- Sanity mechanic (drains on reveal, slow regen in darkness)
- Screen shake and red vignette at low sanity
- Monsters drift toward lighthouse over time
- Score tracking (unique reveals)
- Fog particle layer
- WebAudio reveal/death sounds
- Touch support

## issues
- No high score persistence
- Monsters can overlap
- No difficulty scaling announcement

## todos
- Supabase high score leaderboard
- More monster types
- Night phases (calm → storm)
- Lighthouse upgrades (wider beam, brighter light)
- OG preview PNG
