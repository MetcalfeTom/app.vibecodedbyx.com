# Shield Blast

## log
- 2026-03-29: V1 — Neon defensive shield game. Central core with rotating aim shield. Click/tap to fire cyan plasma bolts at incoming emoji bugs. 10 bug types with different HP, speed, and size. Bugs wobble toward core on sine paths. Multi-HP bugs show health bars. Waves increase bug count and difficulty, unlock harder bug types. 5 HP core with heart display, heals 1 between waves. Score popups, explosion particles, screen shake. WebAudio SFX (shoot, hit, explode, damage, wave start) with noise burst for explosions. Audiowide + Share Tech Mono typography, cyan-on-dark space aesthetic.

## features
- Central core defense with aim shield arc
- Click/tap to fire plasma bolts
- 10 emoji bug types: bug, beetle, ant, mosquito, cockroach, bee, cricket, spider, scorpion, ladybug
- Each bug type has unique HP, speed, and size
- Bugs wobble on sine paths toward core
- Multi-HP bugs show health bars
- Wave system: 4+wave*3 bugs per wave, speed scales with wave
- Higher waves unlock tougher bug types
- 5 HP core, heal 1 between waves
- Heart display changes color when low
- Score popups (+10*wave per kill)
- Explosion particles on kill (5 random neon colors)
- Spark particles on hit
- Screen shake on kills and core damage
- WebAudio SFX with noise burst for explosions
- Starfield background
- Touch and mouse support

## issues
- None currently

## todos
- Power-ups (shield expand, multi-shot, slow motion)
- Boss bugs every 5 waves
- Score leaderboard
- Different bolt types
- Shield special ability (area blast on cooldown)

## notes
- Bug unlock by wave: waves 1-2 use bugs 0-4, waves 3-4 use 0-7, wave 5+ all 10
- Bug HP scales: base HP + floor(wave/4)
- Speed multiplier: 1 + wave * 0.08
- Bolt speed: 12px/frame, cooldown: 8 frames
- Wobble: perpendicular to bug-to-core direction, sine wave
- Shield radius: 60px, core radius: 20px
