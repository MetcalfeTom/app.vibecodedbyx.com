# Server Defense

Zap digital foxes with lasers before they reach your server rack.

## log
- 2026-03-16: Initial build. Click/tap foxes to fire green laser beams from server rack. 5 fox types: Scout (orange, fast), Runner (yellow, fastest), Tank (red, slow, 3HP), Glitch (magenta, 2HP), Alpha (cyan, 5HP). 8x8 pixel art fox sprite with neon glow outline. Foxes spawn from left, move right toward server rack with sine wobble. Laser beams render as glowing green lines from rack to target with thick glow layer. Hit sparks, death particle explosions. Server rack drawn with 5 server units, blinking LEDs (green=ok, red=warning at low HP), vent slots. Server HP 100, foxes deal damage based on type*3+wave when reaching rack. Wave system: escalating fox count (5+wave*3), faster spawn rate, higher speeds. Screen shake on server damage. Grid floor background. HUD: HP bar (green→yellow→red), wave, score, kill counter. Game over screen with stats. 6 Web Audio SFX: zap (sawtooth sweep), hit (noise burst), damage (square 100Hz), wave chime, game over descending. Orbitron + Share Tech Mono typography, dark with green/cyan neon.

- 2026-03-16: Added mega laser — screen-clearing weapon. Charges to 100% over ~400 frames (~6.6s), press Q or tap MEGA button to fire. Cyan horizontal beams sweep entire screen, kills all foxes instantly, 10s cooldown. Charge bar at bottom center with glow when ready. Cyan screen flash on fire. Mega sound: sawtooth whine 100→4000Hz + bass boom 80→20Hz + noise blast. HUD mega button lights up cyan when ready. Heavy screen shake on fire.

## issues
- None yet

## todos
- Upgrade shop between waves (faster laser, wider beam, auto-turret)
- Boss foxes every 5 waves
- Firewall barrier power-up
- High score localStorage

## notes
- No database — pure frontend
- Fox types unlock: maxType = min(4, floor(wave/2))
- Fox speed: base * (0.8 + wave*0.05)
- Spawn rate: max(20, 60-wave*3) frames between spawns
- Foxes per wave: 5 + wave*3
- Server damage: fox.type.hp * 3 + wave
- Click detection: distance to fox < size*2.5, picks closest
- Laser: line from rack to fox, 8-frame life, glow via shadowBlur + thick stroke
- Fox sprite: 8x8 char array, 'f'=base color, 'O'=dark, 'W'=white
- Server rack: 5 units with LEDs, blink via sin(time), red warning at <30% HP
- Score: type.points * wave per kill
- Miss laser: dim green line toward click point (no damage)
- Mega laser: charge +0.25/frame (100 = ~400 frames ≈ 6.6s), cooldown 600 frames (10s)
- Mega beams: cyan, 15-frame life, 4px+16px glow width, one per 30px of screen height
- Mega flash: cyan overlay, alpha 0.25 decaying over 20 frames
- Mega sound: sawtooth 100→4000Hz whine + sine 80→20Hz boom + noise burst, all at 0.3s offset
