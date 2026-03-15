# Neon Tower

Stack glowing neon blocks as high as you can — but physics fights back.

## log
- 2026-03-15: Initial build. Three.js tower stacker with physics. Blocks swing back and forth, tap/click/space to drop. Overhang gets sliced off and falls with physics. Perfect placement (< 0.15 units) snaps to center with streak counter and chime. Swing speed increases with height. At 20+ blocks, every 5th block triggers crumble — bottom blocks shatter into debris chunks with gravity, bounce, fade. Game over when block misses entirely or gets too small. All remaining blocks topple with physics on game over. 10 neon colors with emissive materials and edge wireframes, point lights per block. Camera orbits slowly, rises with tower. Screen shake on crumble/collapse. Web Audio: drop thud, crumble rumble (filtered noise), perfect chime (triangle arpeggio). Hi-score in localStorage. Bungee Shade + Chakra Petch typography, dark purple/magenta palette with starfield.

## issues
- None yet

## todos
- Combo multiplier for consecutive perfects
- Block skins / themes
- Leaderboard via Supabase
- Wind physics at higher levels

## notes
- No database — localStorage for best score
- Three.js via importmap CDN (0.163.0)
- Swing alternates X/Z axis each level
- Swing speed: 3.5 + level * 0.08
- Perfect threshold: 0.15 units
- Crumble starts at level 20, every 5 levels
- Crumble removes 3 + (level-20)/8 bottom blocks
- Gravity: -18, bounce: vy *= -0.3, friction: 0.7
- Debris life: 3-5s, fade in last 1s
- Block height: 0.5 units, base size: 3.0
