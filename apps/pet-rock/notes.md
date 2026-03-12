# Pet Rock

A digital pet rock that sends passive-aggressive messages and refuses to move.

## log
- 2026-02-14: Initial build. CSS rock with eyes, speech bubble with typewriter effect, 8 interaction buttons with ~80 unique messages. Move escalation system (12 unique refusals then counter). Drag/swipe on rock triggers move refusal with shake animation. Idle messages after 12-20s. Courier Prime typography, warm paper/stone palette.

## issues
- None yet

## todos
- Could add seasonal mood changes
- Rock aging system (cracks over time)
- Share your rock's best quotes

## notes
- No database — pure frontend personality simulator
- 8 actions: Pet, Move, Feed, Talk, Play, Name, Compliment, Ignore
- Each action has 6-13 unique passive-aggressive responses
- Move has an escalation system — unique responses for first 12 attempts, then a counter
- Rock eyes react: squint on hover, narrow when annoyed, wide when shocked
- Drag/swipe on rock = move attempt (shake animation + refusal)
- Idle timer sends unprompted snarky messages every 12-20s
- Stats track interactions, move attempts, and "moved: never"
