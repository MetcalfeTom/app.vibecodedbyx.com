# Star Conquest

Conquer the galaxy — build fleets, capture planets, crush the enemy empire.

## log
- 2026-03-16: Initial build. Turn-based galactic conquest strategy game. 13 planets connected by 19 hyperspace lanes on a canvas star map. 2 factions: Stellar Alliance (blue, player) vs Crimson Empire (red, AI). Planet types: capital, industrial, agricultural, military, mining — each with different income. 4 unit types: Fighter Sq. (50cr, 3A/2D), Frigate (120cr, 6A/5D), Battlecruiser (300cr, 14A/12D), Bomber Wing (80cr, 8A/1D). 3 building types: Shipyard (build ships), Orbital Defense (+8 combat defense), Mining Complex (+15cr/turn). Click planet to select, click connected planet to send fleet. Fleet movement animates along lanes. Auto-resolved multi-round combat with battle report overlay showing unit losses. AI: builds shipyards, defenses on borders, produces units, attacks when power advantage >1.3x. Win by capturing enemy capital or all enemy planets. Starfield background, planet glow effects, selection rings, fleet movement triangles with engine glow. 5 Web Audio SFX: select, build, launch, victory arpeggio, defeat descend. Orbitron + Chakra Petch typography, deep space blue/red faction palette.

## issues
- None yet

## todos
- Split fleet movement (send partial fleet instead of all)
- Tech tree (research upgrades between turns)
- Planet bombardment before ground assault
- More planet variety and special resources
- Save/load game state to localStorage
- Difficulty settings for AI aggressiveness

## notes
- No database — pure frontend
- 13 planets, 19 lanes defining connectivity graph
- Combat: up to 10 rounds, damage spread equally across defending unit types, random variance 0.7-1.3x
- AI strategy: shipyards first, border defenses, build 3 units/turn max, attack when power > 1.3x target
- Player starts: Sol Prime (capital+shipyard, 4F+2R), Nexus VII (2F), Verdant (1F), 200 credits
- AI starts: Dominion (capital+shipyard, 4F+2R), Wrath (3F), Crimson Keep (1F), 200 credits
- Neutral planets may have 0-2 fighter garrison randomly
- Fleet animation: progress += 0.035/frame, resolves on arrival
- Income collected at start of each player/AI turn
