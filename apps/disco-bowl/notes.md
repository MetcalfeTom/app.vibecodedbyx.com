# Disco Bowl

3D disco bowling with a disco ball and exploding glitter pins.

## log
- 2026-03-15: Initial build. Three.js 3D bowling game. Disco ball with mirror facets rotates above lane, color-cycling spotlights. 10 neon pins in standard triangle layout, each different color with emissive materials and point lights. Bowling ball with mirror facets, oscillating aim indicator, power meter (hold space/click). Pin physics: ball-pin and pin-pin collision with knockback, gravity, bounce. Glitter explosion on pin hit (25 particles per pin, random velocity, rotation, fade). 10-frame scoring with strike/spare detection. Web Audio: bowl rumble, pin crash (noise + triangle), strike fanfare. Camera follows ball during roll, returns to overview after. Bungee Shade + Lexend Mega typography, purple/magenta/cyan disco palette.

## issues
- None yet

## todos
- Spin/curve ball control
- Lane oil patterns
- Multiplayer via Supabase
- Leaderboard

## notes
- No database — pure frontend
- Three.js via importmap CDN (0.163.0)
- Pin layout: standard 1-2-3-4 triangle, 0.6 unit spacing
- Power meter: 0-1 range, hold to charge
- Pin collision radius: 0.25 units
- Glitter particles: 25 per pin hit, life 1.0 with 0.015 decay
- 10 frames, 2 rolls per frame (except strike)
