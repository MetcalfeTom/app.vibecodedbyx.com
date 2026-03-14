# Ghost Server Room

Chaotic idle game where you manage a haunted server room. Fix bugs, fight ghosts and demons, keep uptime alive.

## log
- 2026-03-14: Initial build. Idle game where fixing bugs earns souls but spawns ghosts (60%) and demons (30%+, scaling). Bug queue with severity levels (med/high/crit), click to fix. Ghosts float around canvas, clickable to swat for souls. Demons have HP, power scaling, cost souls to banish, attack servers/uptime. 6 upgrades: Auto-Patcher, Demon Ward, Soul Siphon, New Server, Server Shield, Mass Exorcism. Uptime system: bugs/demons/ghosts drain it, servers recover it, 0% = emergency reboot. Canvas server room with animated racks, floating ghosts, angular demons with horns, fire particles, static noise. Creepster + Share Tech Mono typography, ghost cyan/demon red/bug green palette.

## issues
- None yet

## todos
- Server room events (power outage, haunted surge)
- Ghost types with different behaviors
- Prestige system (reset for permanent buffs)
- Leaderboard via Supabase

## notes
- No database — pure frontend with no save system yet
- Bug spawn rate scales with total fixes and demon count
- Demon chance: 30% base + 0.5% per total fix (capped at 70%)
- Uptime drain: bugs -0.02/frame, ghosts -0.01/frame, demons -0.03/frame per power
- Upgrade cost scaling: baseCost * 1.8^level
- Canvas: server racks, ghost sprites (oval + wavy bottom), demon sprites (angular + horns)
