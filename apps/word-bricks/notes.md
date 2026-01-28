# Word Bricks

Physics-based chat sandbox where messages fall as stackable blocks.

## Log
- 2026-01-28: Initial creation with canvas physics, Supabase real-time sync, drag interaction

## Features
- Canvas-based physics engine (gravity, collision, bounce)
- Real-time Supabase subscription for multiplayer brick drops
- Drag and throw bricks with mouse/touch
- Controls: Clear all, Add random, Toggle gravity, Explode
- Colorful palette with text-sized bricks

## Technical
- No external physics libraries - custom implementation
- Brick-to-brick collision with velocity transfer
- sessionStorage not needed (real-time sync handles persistence)

## Issues
- None yet

## Todos
- Consider adding brick deletion on double-click
- Could add sound effects on collision
