# Neon Aquarium

Deep-sea aquarium with glowing jellyfish and bioluminescent coral.

## log
- 2026-03-17: Initial build. Full-page canvas deep-sea scene. 8 jellyfish with unique color palettes, pulsing bell animation, flowing tentacles with tip glow, oral arms, ambient radial glow. 12 bioluminescent corals in 3 types: branching (with tip glow), fan (membrane + ribs), tube (with mouth glow). 7 coral color palettes. Light rays from above with gentle sway. 80 plankton motes drifting. Bubbles rising. Click/tap to attract jellyfish toward cursor. Jellyfish physics: pulse thrust, drift, damping, wrapping. Dark ocean gradient background with seafloor.

## issues
- None yet

## todos
- Additional sea creatures (small fish schools, sea turtles)
- Click to spawn new jellyfish
- Day/night cycle affecting light rays
- Ambient ocean sounds
- Keyboard palette cycling (like Neon Lava)

## notes
- No database — pure frontend
- 8 jellyfish color palettes, 7 coral palettes
- 3 coral types: branch, fan, tube
- Jellyfish sorted by size for depth layering
- Performance: simple shapes, no pixel shader needed
