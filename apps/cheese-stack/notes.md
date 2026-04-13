# Cheese Stack

Stack giant wobbly cheese blocks without toppling the tower.

## log
- 2026-04-13: Initial build. Physics-based stacking with gravity, bounce, friction, rotation damping. 8 cheese types (Cheddar, Gouda, Swiss, Brie, Parmesan, Muenster, Blue Cheese, Pepper Jack) with unique colors and random holes. Swinging drop mechanic with increasing speed. Block-on-block collision with rotational instability from offset. Camera scrolls up as stack grows. Game over on 2+ toppled blocks. Settle detection before next drop. Lilita One + DM Mono typography, warm cheese/wood aesthetic.

## features
- 8 cheese types with unique colors, holes, and sizes
- Physics: gravity, bounce, friction, rotational instability
- Swinging drop mechanic (speed increases with height)
- Block-on-block stacking with weight transfer
- Camera auto-scrolls as tower grows
- Settle detection (must wait before next drop)
- Game over detection (toppled blocks, extreme angles)
- Best score persistence in localStorage
- Touch support
- Wooden table surface

## issues
- Physics is simplified (AABB, no true rotation collision)
- Very tall towers may get laggy with many blocks

## todos
- OG preview PNG
- Leaderboard (height records)
- Special cheese types (explosive, sticky, bouncy)
- Wind gusts at higher levels
- Cheese puns on milestones
- Sound effects
