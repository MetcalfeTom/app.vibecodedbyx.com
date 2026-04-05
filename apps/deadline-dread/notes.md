# Deadline Dread

## log
- 2026-04-05: Initial build — productivity timer with digital health system. HP drains per second of inactivity, configurable duration/idle threshold/damage. Real activity tracking (mouse, keyboard, touch), dread messages, damage flash, background color shift at low HP, event log, session completion healing. Anybody + DM Mono typography, dark red horror palette.

## features
- Digital health bar (100 HP) with 10 segments, color transitions (green→yellow→red)
- HP drains continuously during idle (configurable: 3/5/10/20 per minute)
- Real activity detection: mouse movement, clicks, keyboard, touch, scroll
- "I'm Active" button for manual check-in + small HP heal
- Configurable: 5/15/25/45/60 min sessions, 30s/60s/2min idle threshold
- 15 dread messages shown during idle ("THE DEADLINE APPROACHES", "TICK. TOCK.", etc.)
- 4 death messages on HP depletion
- Background shifts to dark red at danger, pulses at critical
- Damage flash effect on health bar
- Session completion heals +20 HP
- Revive mechanic: restart with 50% HP after death
- Full event log with timestamps and color-coded entries
- Stats: idle time, total damage, active streak, sessions completed

## issues
- Activity detection only works while tab is focused
- No sound/notification support
- No persistent storage — refreshing loses progress

## todos
- Add Supabase session history (date, duration, HP remaining, idle time)
- Desktop notification on idle threshold
- Sound effects (heartbeat at low HP, alarm on idle)
- Break timer between sessions (5 min rest)
- Daily/weekly stats dashboard
- OG image
