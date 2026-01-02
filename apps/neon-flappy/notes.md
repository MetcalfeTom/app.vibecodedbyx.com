# Neon Flappy

## log
- 2025-01-02: Initial creation - neon-styled flappy bird clone

## features
- Tap/click/spacebar to flap
- Glowing neon pipes in random colors (magenta, cyan, yellow, pink, green)
- Pulsing glow effect on pipes
- High score persistence via localStorage
- Medal system (bronze 10+, silver 20+, gold 30+, trophy 50+)
- New record indicator
- Trail particles behind bird
- Flap and explosion particle effects
- Web Audio sound effects (flap, score, crash)
- Scrolling grid background with scanlines
- Difficulty via consistent pipe gap and speed

## technical
- Fixed game dimensions (480x800) scaled with devicePixelRatio
- Canvas rendering with glow via shadowBlur
- Collision detection on pipe rectangles
- Orbitron + Rajdhani fonts for retro-futuristic feel
- Touch, click, and keyboard input support
- Mobile-friendly with touch scroll prevention

## issues
- None yet

## todos
- Add difficulty progression (smaller gaps, faster pipes over time)
- Add different bird skins
- Add Supabase leaderboard
- Add day/night theme toggle
