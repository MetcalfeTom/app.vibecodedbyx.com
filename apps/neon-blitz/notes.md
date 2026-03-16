# Neon Blitz

Retro neon space shooter with synth music. Blast waves of enemies in a neon void.

## log
- 2026-03-16: Initial build. Vertical scrolling space shooter on 360x640 canvas. Neon wireframe aesthetic — player ship, enemies all drawn with stroked shapes and glow. 4 enemy types: drone (triangle, 1HP, no shoot), gunner (square, 2HP, aimed shots), tank (circle, 4HP, crosshair, aimed shots), elite (diamond, 6HP, fast shots). Wave system: 4+wave*2 enemies per wave, new types unlock at waves 3 and 5, HP scales with wave. Player: 3 lives, power levels 1-3 (single/triple/spread shot), shield powerup, rapid fire powerup. Combo system: consecutive kills within 120 frames build multiplier (up to x10). Synth music: continuous bass (sawtooth+lowpass), 16-step arp (square), lead melody (sine with envelope), kick on quarter notes, hi-hat noise on eighth notes, BPM 140. 5 SFX: shoot, explode (noise+sine), powerup (ascending), die (descending saw), wave complete (ascending arpeggio). Scrolling starfield, subtle grid lines, screen shake on kills/hits. HP bars on damaged enemies. Mobile: touch-drag to move + auto-fire, or L/R/Fire buttons. High score in localStorage. Audiowide + Share Tech Mono typography, cyan/magenta neon palette on dark.

## issues
- None yet

## todos
- Boss enemies every 5 waves
- Bomb/special weapon (screen clear)
- Enemy formations (V-shape, circle, zigzag)
- More powerup types (homing missiles, time slow)
- Leaderboard with Supabase

## notes
- No database — localStorage hi-score only
- Canvas: 360x640, scaled to fit viewport
- Enemy HP scales: base + floor(wave/4)
- Shoot rates decrease with wave (more aggressive): rate - min(wave*2, 30)
- Powerup drop: 12% chance per kill, random type (power/shield/rapid)
- Shield absorbs one hit, rapid fire reduces fireRate by 2 (min 3)
- Power levels: 1=single shot, 2=triple, 3=5-way spread
- Combo: resets after 120 frames without a kill, multiplier capped at 10
- Music: bass notes [A1,A1,C2,D2] repeated, 16-step arp, 16-step lead with rests
- Touch controls: drag on canvas moves player horizontally + auto-fires
