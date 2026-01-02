# Neon Flappy

## log
- 2025-01-02: Added chat control - any message = flap, color commands change pipes
- 2025-01-02: Initial creation - neon-styled flappy bird clone

## features
- CHAT CONTROLLED: any message in chat makes the bird flap
- Color commands: !cyan !pink !yellow !green !red !purple !orange !rainbow
- Realtime Supabase subscription for multiplayer control
- Side chat panel showing messages and actions
- Tap/click/spacebar to flap (also works locally)
- Glowing neon pipes with configurable colors
- Rainbow mode cycles through all colors
- Pulsing glow effect on pipes
- High score persistence via localStorage
- Medal system (bronze 10+, silver 20+, gold 30+, trophy 50+)
- New record indicator
- Trail particles behind bird
- Flap and explosion particle effects
- Web Audio sound effects (flap, score, crash)
- Scrolling grid background with scanlines

## technical
- Fixed game dimensions (480x800) scaled with devicePixelRatio
- Canvas rendering with glow via shadowBlur
- Supabase realtime postgres_changes subscription
- neon_flappy_commands table for chat messages
- Collision detection on pipe rectangles
- Orbitron + Rajdhani fonts for retro-futuristic feel
- Touch, click, and keyboard input support
- Mobile-friendly responsive layout

## issues
- None yet

## todos
- Add difficulty progression (smaller gaps, faster pipes over time)
- Add different bird skins
- Add global Supabase leaderboard
- Add speed commands (!fast !slow)
