# Neon Aquarium

A glowing 3D aquarium where neon fish change color every time you type. Watch them swim and pulse.

## log
- 2026-03-15: Initial build. 3D aquarium using Three.js with 12 neon fish. Glass tank with edge wireframe, sand floor (displaced plane), 18 seaweed plants with sway animation, 10 rocks (dodecahedron). Fish: ellipsoid body + cone tail + dorsal fin + eyes, each with emissive material and point light for glow effect. Fish AI: random target points, smooth steering, tail wagging, speed variation, gentle bobbing. Chat input at bottom — typing a message hashes the text to a new hue and all fish smoothly transition to new color palette. Color flash overlay on send. Fish get an excitement burst (speed boost + new targets) on each message. Auto-chat: random bot messages trigger color changes every 8-20s. Bubbles rise from random points with wobble. Caustic spotlight drifts across sand. Camera gently orbits. Anybody + IBM Plex Mono typography, deep ocean dark palette with bioluminescent accents.

## issues
- importmap + ES module gives expected "new Function" validation errors (works in browser)

## todos
- Different fish species/shapes
- Click fish to see info
- Feed the fish (click to drop food, fish chase it)
- Day/night cycle
- Supabase chat for real multiplayer color changes
- Treasure chest decoration with bubbles

## notes
- No database — local chat only with auto-bot messages
- Three.js 0.163.0 via CDN importmap
- 12 fish, each with unique hue offset from global hue
- Color hash: char code accumulation, modulo 1000, mapped to 0..1 hue
- Fish speed: 0.3-0.8 base, +0.2 burst on chat, decays at 0.998/frame
- Retarget: every 150-400 frames, fish picks new random point in tank
- Tank: 30x14x16 units, glass MeshPhysicalMaterial, BackSide rendering
- Plants: 5-11 blades per cluster, sine-wave sway
- Bubbles: spheres rising at 0.01-0.03/frame, removed at tank top
- Camera: gentle sinusoidal orbit around center
