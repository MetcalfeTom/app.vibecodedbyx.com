# Pirate Ship

Steer your pirate ship and blast sea monsters with cannons.

## log
- 2026-03-17: Initial build. Canvas-based pirate ship simulator. Ship with sail, mast, cannons, flag. Steering with A/D or arrows, W for speed boost, SPACE to fire dual cannons. Camera follows ship. 3 monster types: kraken (8+ HP, tentacles, slow), serpent (5+ HP, segmented body, medium), shark (3+ HP, fast). Monsters chase ship with wobble AI, attack on contact. Wave system: escalating difficulty, monsters spawn in groups. HP bars on damaged monsters. Explosions, debris, wake trail particles. Steering wheel HUD overlay rotates with ship. Mobile touch buttons (port/fire/starboard). Game over with auto-respawn. Pirata One + JetBrains Mono typography, dark ocean aesthetic.

## issues
- None yet

## todos
- Treasure chests floating in ocean for bonus points
- Ship upgrades (faster reload, more damage, hull repair)
- Boss monsters at wave milestones
- Minimap
- Sound effects (cannon fire, monster roars, waves)

## notes
- No database — pure frontend
- Infinite open ocean, camera follows ship
- Wave difficulty scales with wave number (monster HP, speed, count)
- Dual cannon fire with recoil smoke
