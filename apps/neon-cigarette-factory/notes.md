# Neon Cigarette Factory

## Log
- 2026-01-11: Added GOLDEN SPRINGLOCK SUIT
  - FNAF-inspired animatronic suit on factory floor
  - Opens invitingly, then SNAPS SHUT periodically
  - Eyes glow red when triggered
  - Shakes violently during snap animation
  - Red warning light flashes when triggered
  - Resets after 3 seconds to snap again
- 2026-01-11: Replaced giraffe with MASSIVE NEON GODZILLA
  - Towering green kaiju built from primitives
  - Iconic cyan dorsal spines that glow
  - Menacing red glowing eyes
  - Massive segmented tail with spines
  - T-rex style arms, huge legs with claws
  - Blasts green toxic gas from MOUTH and TAIL
  - Breathing animation and tail sway
- 2026-01-11: Added massive neon giraffe (replaced)
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
- **MASSIVE NEON GODZILLA**: Towering green kaiju with cyan dorsal spines
- **Dual Gas Blasts**: Green toxic gas from both mouth AND tail
- **GOLDEN SPRINGLOCK SUIT**: FNAF animatronic that snaps shut with red glowing eyes

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
