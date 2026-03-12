# Neon Slime

Physics sandbox with glowing neon slime blobs that stretch, bounce, and stick to walls.

## log
- 2026-03-12: Initial build. Soft-body physics with spring-mass system, 5 neon colors cycling, 5 tools (Spawn, Fling, Pull, Cut, Clear). Particles form ring+center blobs connected by springs with cross braces. Wall sticking when velocity low enough, wall glow effect. Blob-blob collision via particle repulsion. Quadratic curve rendering for smooth blob outlines. Radial gradient fills + neon glow shadows. Fling slingshot with preview line. Gravity well pull tool. Cut tool breaks springs and unsticks particles. Chakra Petch typography.

## issues
- None yet

## todos
- Could add blob merging when close enough
- Dripping effect when stuck to ceiling
- Sound effects on bounce/stick

## notes
- No database — pure frontend physics sandbox
- Soft-body: each blob = ring of particles + center particle connected by springs
- Springs break at 4x rest length (blob tears apart)
- Wall stick triggers when impact velocity < 2.5
- 5 colors: green, purple, cyan, pink, gold — cycle on spawn
- Max 1200 particles for performance
- Blob-blob collision is O(n*m) on particles but early-exits if centers far apart
