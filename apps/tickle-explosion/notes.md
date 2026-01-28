# Tickle Explosion Generator

Tickle-activated neon explosion generator with high-speed purple particles.

## Log
- 2026-01-28: Initial creation with purple particle explosions

## Features
- Tickle detection based on cursor velocity
- High-speed purple particle explosions
- Particle trails with neon glow effects
- Custom cursor with power indicator
- Live stats: particle count, explosions, tickle power
- Click/tap for instant explosion
- Touch support for mobile
- Ambient glow builds as tickle power increases

## Mechanics
- Move cursor slowly: small particle streams
- Move cursor fast: builds tickle power (0-100%)
- Tickle power > 80%: triggers full explosion
- Click anywhere: instant medium explosion

## Particle System
- 7 shades of purple/magenta
- Trail rendering with fade
- White hot core
- Neon glow shadows
- Gravity + friction physics
- Variable size and decay

## Technical
- Pure HTML/CSS/JS, canvas-based
- requestAnimationFrame rendering
- Orbitron font
- No external dependencies

## Issues
- None yet

## Todos
- Add sound effects
- Add explosion patterns (spiral, ring, etc.)
- Add color mode toggle
