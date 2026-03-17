# Neon Aquarium

Neon fish that evolve legs and walk on the sea floor.

## log
- 2026-03-17: Initial build. Canvas aquarium with 8 neon fish species. 5 evolution stages: fish → thickened fins → nubs → small legs → full walking legs with feet. XP from eating food (tap to drop). Evolved fish walk on sea floor with 4-legged gait animation, can jump back in water for food. Underwater environment with light rays, bumpy sea floor, swaying plants. Bubbles on eating and random idle. Evolution sparkle particles. Fish chase nearest food, idle wander when none. Anybody + IBM Plex Mono typography, deep ocean palette.

## issues
- None yet

## todos
- Different fish species with unique shapes
- Predator fish that eat smaller fish
- Day/night cycle
- Decorations (coral, rocks) the fish interact with
- Sound effects (bubbles, eating, evolution chime)

## notes
- No database — pure frontend
- Max 25 fish, 15% chance to spawn new on tap
- Evolution XP thresholds: 0, 15, 35, 60, 100
- Food gives 3-5 XP per piece, drops 2-3 per tap
- Walking speed: 20-35 px/s
- Stage 0: basic fish. Stage 1: thick pectoral fins. Stage 2: leg nubs. Stage 3: jointed small legs. Stage 4: full 4-legged walk with feet
- Evolved fish sink to floor, walk with alternating leg phases
- Floor at 82% of canvas height
