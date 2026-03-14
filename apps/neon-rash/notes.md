# Neon Rash

High-speed neon motorbike racing with combat. Punch rivals off their bikes on a glowing cyberpunk highway.

## log
- 2026-03-14: Initial build. 3D motorbike racing game using Three.js. Road Rash-inspired combat racing on neon oval circuit track. 6 racers with staggered start. Procedural track with 400 segments, sinusoidal curves. Cyan left edge, magenta right edge neon lines. Neon posts with glow orbs every 8 segments. Player bike: accelerate/brake/steer with arrow keys or WASD. Combat: Z punch left, X punch right, C kick — damage + knockback + speed reduction. AI racers weave lanes and punch back. HP system: crashes at 0 HP (2s respawn), slow regen. 3-lap race. Position tracking across all racers. Third-person chase camera with lerp. Countdown sequence. Bike models: body, seat, fork, wheels with neon torus rings, rider torso+head+visor. Ground grid, starfield, fog. Web Audio engine hum and punch sounds. Mobile: touch steer + punch/kick buttons, device tilt. Orbitron + Share Tech Mono typography, cyan/magenta neon palette.

## issues
- importmap + module script gives expected "new Function" validation errors (works fine in browser)
- AI difficulty may need tuning

## todos
- Weapon pickups (chains, clubs like Road Rash)
- Speed boost pads on track
- More track variety (hills, sharp turns)
- Crash ragdoll animation
- Leaderboard via Supabase
- Engine audio with continuous oscillator tied to speed

## notes
- No database — pure frontend
- Three.js 0.163.0 via CDN importmap
- Track: 400 segments, oval with sin/cos perturbations, 14m width
- Max speed: player 1.2, AI 0.85-1.2 (randomized)
- Punch: 12-20 damage, 30 frame cooldown
- Kick: 18-28 damage, 45 frame cooldown, more knockback
- AI punch: 8-15 damage, 60 frame cooldown, 2% chance per frame when close
- HP regen: 0.02 per frame when not crashed
- Crash: 2s timer, then respawn with min 20 HP
- Camera: lerp 0.06 toward 8 units behind, 4 units above player
- Lane offset: -1 to 1, mapped to track width minus 1.5m margin each side
