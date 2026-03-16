# Sniper Bugs

A neon terrarium full of bugs that snipe each other with lasers.

## log
- 2026-03-16: Initial build. Pixel art terrarium (260x200 native, 3x scaled) in glass jar. 5 bug types: Scout (green, fast, low damage), Sniper (pink, slow, long range, high damage), Tank (blue, slow, high HP), Assassin (orange, fastest, 3x damage but 1HP), Ghost (purple, medium). Bugs wander autonomously, stop to aim when enemy in range, fire colored laser beams. Aim system: dashed laser sight line with scope dot, fires after aimTime frames. HP bars appear when damaged. Death: explosion particles + corpse that fades. 3 plant types: stalk (with leaves), mushroom (cap with spots, glow), crystal (angular facets). Bugs eat plants for energy, starve without food. Plants grow with sway animation, glow tips when mature. Day/night toggle (night = darker, stronger bug glow, ambient fog). Click above soil to spawn bug, click on soil to plant. Auto-spawns bugs if population drops below 3. Jar glass with reflection highlight, textured soil. Zap and death sounds. Kill counter. Silkscreen + DotGothic16 typography, green neon palette.

## issues
- None yet

## todos
- Team colors (red vs blue faction wars)
- Bug evolution after surviving X kills
- Terrain obstacles (rocks, water puddles)
- Ambient cricket/chirp sounds at night

## notes
- No database — pure frontend
- Canvas: 260x200 native with image-rendering: pixelated at 3x scale
- 5 bug types with different stats: size, speed, HP, damage, range, cooldown, aimTime
- Aim system: bug stops, tracks target, dashed line shows aim, fires after aimTime frames
- Cooldown: bug can't fire again for cooldown frames after shooting
- Energy: drains 0.01/frame, +10 from eating plants, bug dies at 0
- Plant growth: 0.0008/frame (0.3x at night), bugs consume 0.2 growth per eat
- Laser: line from shooter to target, 8-frame life, glow via shadowBlur
- Particles: 6 on hit, 10 on death, gravity 0.08
- Corpses: 4px flat line, fade over 300 frames
- Auto-spawn: 1 bug per 120 frames when <3 alive
- Jar: walls at x=14 and x=246, soil at y=176
