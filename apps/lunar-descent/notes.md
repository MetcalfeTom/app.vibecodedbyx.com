# Lunar Descent

Land on the moon. Don't crash. Pixel art. Holographic physics.

## log
- 2026-03-15: Initial build. Retro moon landing game at 320x240 native with pixel scaling. Procedural terrain via midpoint displacement (64 segments), flat landing pads with blinking arrow markers. Pixel art lander with body, dome, window (cyan glow), antenna (blinking red tip), landing legs. Physics: gravity 0.012/tick, upward thrust 0.035, side thrust 0.02, velocity damping 0.998. Landing: speed < 2.0 m/s on a pad = success, anything else = crash. Fuel system: starts 100%, decreases per level (min 40%), -0.15/tick main thrust, -0.05/tick side. Holographic effects: terrain edge glows with cycling HSL hue, second offset shimmer layer (sin wave), ghost lander (cyan/magenta offset copies at 15% opacity), CRT scan lines (every 3rd row), color fringe. Parallax starfield (5 colors, blink animation). Earth in sky. Exhaust particles (orange/yellow) + crash explosion (40 particles, 5 colors). Screen shake on crash. Camera follows lander horizontally with lerp. Continuous thrust audio (sawtooth 60Hz + bandpass noise). SFX: landing fanfare, crash explosion, fuel warning beep. HUD: altitude, velocity (color-coded warnings), fuel bar, level, score. Scoring: 100 base + speed bonus + fuel bonus. Progressive difficulty: rougher terrain, fewer/smaller pads, less fuel. Mobile touch controls (left/thrust/right). Press Start 2P + Share Tech Mono typography.

## issues
- None yet

## todos
- Wind/gusts on higher levels
- Asteroid obstacles to dodge
- Bonus targets (bullseye scoring)
- Fuel pickups floating in space
- High score localStorage

## notes
- No database — pure frontend
- Terrain: 64 segments, midpoint displacement, roughness = 60+level*5, range 40-160
- Landing pads: max(1, 3-floor(level/3)) pads, width max(3, 6-level) segments
- Physics: gravity 0.012, thrust 0.035, side 0.02, damping 0.998
- Max landing speed: 2.0 m/s (sqrt(vx²+vy²)), must be on pad
- Fuel: 100-level*5 (min 40), main=-0.15/tick, side=-0.05/tick
- Holographic terrain: hsl(phase*60%360, 100%, 70%), sin offset second layer
- Ghost lander: ±sin(phase*2)*2px offset copies at 15% alpha in cyan/magenta
- Thrust audio: sawtooth 60Hz + bandpass noise 300Hz, fades on release
- Score: 100 + (maxSpeed-speed)*50 + fuel*2 per successful landing
- Camera: lerp 0.08 toward lander X position
