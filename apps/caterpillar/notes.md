# Caterpillar

## log
- 2026-04-02: Initial build. Neon caterpillar feeding game with growth physics, cocoon animation, and butterfly transformation. Canvas-based, single file, Fredoka + Silkscreen typography. Arrow/WASD + touch joystick controls. Levels with thorns and birds from level 2+. 3 lives system.

## features
- Caterpillar with rainbow neon gradient segments, eyes, antennae
- Spring-based segment physics with wobble
- Leaf eating with green sparkle particles
- Fullness meter (0-100%) — each leaf gives 8-12%
- At 100%: cocoon animation -> burst particles -> butterfly emerges
- Butterfly with gradient wings, flapping animation, particle trail
- Level progression: faster caterpillar, more leaves needed, thorns + birds
- Thorns reduce fullness by 20%, birds cost a life
- 3 lives total
- Fireflies, grass blades, subtle grid background
- Touch joystick for mobile
- Level complete screen with stats

## issues
- Bird collision detection is simple circle check — could feel unfair at edges
- No persistent high scores yet (no Supabase integration)
- Cocoon appears at head position which might be at screen edge

## todos
- Add Supabase leaderboard for highest level reached
- Add sound effects (eating, transformation, damage)
- Add more obstacle variety at higher levels
- Consider power-ups (speed boost, shield, double growth)
- Add score multiplier for eating leaves quickly
