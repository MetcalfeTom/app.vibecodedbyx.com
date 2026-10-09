# Neon Dodge

Dodge glowing orbs in a neon arcade arena. Survive as long as you can.

## log
- 2026-03-21: Initial build. Canvas dodge game with mouse/touch/WASD controls. Orbs spawn from edges aimed at player with spread, wave system every 8s with increasing spawn rate and speed. Player trail (30 points), particle bursts on death/wave, screen shake. HUD shows time, wave, dodged count. localStorage high score. Orbitron + Share Tech Mono typography, cyan/magenta neon aesthetic with grid background.

- 2026-10-09: The leaderboard module died at load on the live host (static `import supabase from '/supabase-config.js'`, but the live config has no default export). Now a tolerant dynamic import (`m.default || m.supabase || (await m.supabaseSession()).client`); with no database the board says "Scores offline" and the game is unaffected. Tested headless with no config and with a fake no-default config (select + insert).

## issues
- None yet

- 2026-03-23: Added Supabase leaderboard. neon_dodge_scores table (username, score, wave, dodged). Name prompt on first death, cached in localStorage. Top 10 board shown on death screen. Highlights your own scores.

## todos
- Power-ups (slow-mo, shield, shrink)
- Sound effects
- Different orb types (homing, splitting)

## notes
- Supabase table: neon_dodge_scores (username, score, wave, dodged, user_id)
- Player speed 280px/s, orb speed scales with wave
- Spawn interval decreases from 0.8s to 0.12s minimum
- 6 orb colors for visual variety
- Collision uses distance check (player radius 14 + orb radius 8)
- Screen shake decays over time on hit
