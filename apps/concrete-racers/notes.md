# Concrete Racers

Concrete blocks hurtling down neon laser tracks. Physics optional. Chaos mandatory.

## log
- 2026-03-15: Initial build. Pseudo-3D racing game (OutRun-style segment projection). Track built from 600 segments with curvature patterns (straights, sweeping curves, hairpins, S-curves) and hills. Track edges are color-cycling neon laser beams with glow (7 colors cycling every 8 segments). Player car is a concrete block with gradient faces, top face perspective, texture lines, headlights, taillights. 5 AI concrete racers with collision (speed reduction, push apart, debris particles). Boost system (Space, 1.5s duration, 5s cooldown) with flame effect and sparks. 3-lap race with countdown, finish screen, lap chime. Position tracking vs AI. Speed lines at high speed. Off-road penalty (speed drain, shake, sparks). Centrifugal force pushes car on curves. Web Audio: sawtooth engine drone, noise boost, crash, triangle lap chime. Mobile touch controls. Inter Tight + IBM Plex Mono typography, dark with neon accents.

## issues
- None yet

## todos
- Track variety (random generation per race)
- Nitro pickups on track
- Car damage / destruction
- Ghost replay
- Leaderboard via Supabase

## notes
- No database — pure frontend
- Track: 600 segments, SEG_LEN 200 units, ROAD_W 1200
- Projection: perspective divide (CAM_D/relZ), 100 segments drawn
- 7 laser colors cycling: magenta, cyan, orange, sky blue, yellow, purple, green
- Player max speed: 200 (300 with boost), auto-accelerate at 60/s
- Boost: 1.5s duration, +300/s accel, 5s cooldown
- AI: 5 cars, speed ~100, steer toward curve center + random wander
- Collision: dz<30 && dx<100, both lose speed, push apart, 8 debris particles
- Centrifugal: curve * speed * 0.15 pushes player laterally
- Off-road: abs(x) > ROAD_W/2, speed *= 0.98 per frame
- Hills: segment hill value shifts projected Y
- Fog: linear fade over 120 segments
