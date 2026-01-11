# Neon Cigarette Factory

## Log
- 2026-01-11: Added massive neon giraffe
  - Towering yellow giraffe built from primitives
  - Green neon rings on neck
  - Glowing cyan eyes, magenta hooves and horns
  - Emits green toxic gas clouds from rear
  - Subtle swaying animation
- 2026-01-11: Initial creation
  - 3D factory scene with Three.js
  - Spawns exactly 500 glowing cigarette sticks
  - Conveyor belt carries them to collection bin
  - Neon bloom post-processing
  - Pulsing glowing tips on each cigarette

## Features
- **500 Cigarettes**: Spawns exactly 500 glowing sticks
- **Conveyor Belt**: Moves cigarettes from machine to bin
- **Collection Bin**: Cigarettes fall and stack in bin
- **Neon Glow**: Bloom post-processing for that neon look
- **Pulsing Tips**: Each cigarette has a glowing ember tip
- **Orbit Controls**: Drag to rotate, scroll to zoom
- **MASSIVE NEON GIRAFFE**: Towering yellow giraffe with glowing spots
- **Toxic Gas Clouds**: Green glowing gas clouds emit from the giraffe

## Design
- Orbitron font for industrial feel
- Cyan/Magenta neon color scheme
- Dark factory atmosphere with fog
- Three.js with UnrealBloomPass

## Technical
- Three.js r160 via CDN
- OrbitControls for camera
- EffectComposer for bloom
- 500 individual Group objects

## Todos
- Add smoke particles from factory stacks
- Add machine animation (moving parts)
- Add sound effects (machinery hum)
