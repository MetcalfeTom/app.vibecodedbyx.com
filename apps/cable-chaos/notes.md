# Cable Chaos

Untangle a mess of colorful knotted power cables by dragging nodes apart until no cables cross.

## log
- 2026-04-12: Added bouncy jiggle physics to cables. Each wire has 5 interior spring-damped control points. Points spring toward rest position (lerp between endpoints) and toward neighbors. Gravity sag pulls wires down. Cables render as smooth curves through all points. Dropping a node gives connected cables a velocity kick for satisfying bounce. Scramble gives random initial jiggle. Spring stiffness 12, damping 4, gravity 40.
- 2026-04-12: Initial build. Planar graph untangle puzzle. Procedural level generation: nodes in circle (solvable layout), scrambled into tangled mess. Segment intersection detection for crossing count. 15 neon cable colors with glow/highlight/catenary sag rendering. Crossing cables drawn dimmed with pulsing red X marks at intersection points. Power socket styled nodes with colored rings and prong details. Level scaling: 6 nodes at level 1, +2 per level up to 30. Edge count ~1.5x nodes. Retry/Next/Scramble controls. Move counter, crossing counter, timer. Victory detection (0 crossings), celebration sparks, C-major arpeggio win SFX. Pickup and snap click SFX. Touch + mouse drag support. Subtle grid background, vignette. Chakra Petch + Share Tech Mono typography, dark blue/cyan aesthetic.

## features
- Drag nodes to untangle cables
- Real-time crossing detection with intersection math
- Pulsing red X marks at crossing points
- Cables render with glow, highlight stripe, and catenary droop
- 15 neon cable colors
- Power socket styled nodes with prongs
- Progressive difficulty (6-30 nodes)
- Move counter, crossing counter, timer
- Victory detection + celebration sparks
- Retry, Next Level, Scramble buttons
- Sound effects (pickup, snap, win arpeggio)
- Touch and mouse support
- Responsive layout

## issues
- None known

## todos
- OG preview PNG
- Leaderboard (fewest moves per level)
- Undo button
- Hint system (highlight one node to move)
- More graph generation patterns (grids, random planar)
