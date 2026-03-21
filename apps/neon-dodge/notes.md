# Neon Dodge

Dodge glowing orbs in a neon arcade arena. Survive as long as you can.

## log
- 2026-03-21: Initial build. Canvas dodge game with mouse/touch/WASD controls. Orbs spawn from edges aimed at player with spread, wave system every 8s with increasing spawn rate and speed. Player trail (30 points), particle bursts on death/wave, screen shake. HUD shows time, wave, dodged count. localStorage high score. Orbitron + Share Tech Mono typography, cyan/magenta neon aesthetic with grid background.

## issues
- None yet

## todos
- Power-ups (slow-mo, shield, shrink)
- Leaderboard via Supabase
- Sound effects
- Different orb types (homing, splitting)

## notes
- No database — pure frontend
- Player speed 280px/s, orb speed scales with wave
- Spawn interval decreases from 0.8s to 0.12s minimum
- 6 orb colors for visual variety
- Collision uses distance check (player radius 14 + orb radius 8)
- Screen shake decays over time on hit
