# Glass Tower Destroyer

## log
- 2026-04-18: Created. Physics-based shatter game using Matter.js (CDN 0.19.0). Cannon in bottom-left fires a heavy wrecking ball at pointer click; glass blocks shatter into shards when hit. Three level layouts cycling per `n % 3`: stacked-frame pillars+beams, alternating brick wall, pyramid. Decorative glass orb on top from level 2+. Per-block HP scales with area (one hit for small blocks, two for big ones). Shards spawn with inherited velocity, drawn as semi-transparent polygons from Matter body vertices. Shatter sound: noise burst + triangle "chink" ping. Cannon sound: square sweep + sine thud. Camera shake on fire + big impacts. Custom canvas rendering (ignores Matter's default renderer): gradient + edge highlight + diagonal inner shine + cracks when HP drops but not zero. Anton + Poiret One + JetBrains Mono typography, cyan/magenta neon-night palette.

## issues
- Matter.js default world gravity is 1, bumped to 1.1 for heavier block collapse feel.
- Audio requires user gesture (Start button triggers ensureAudio + first fire also resumes).
- Shard cap 180 to prevent memory growth on big chain shatters; oldest recycled first. Shards also auto-despawn after 5s.
- Win condition loose: counts blocks with `position.y < H - 20`. A block can technically fall off the side and never despawn, but walls keep them in. Shards are filtered by off-screen.
- Level difficulty ramps by increasing `floors` and decreasing ammo (8 → 3 shots floor), which could make late levels unwinnable — may need to tune per-level block HP too.

## todos
- More tower archetypes: cantilever, arch, domino chain, moving pendulum.
- Special weapons: bomb (AOE), double shot, piercing laser.
- Replay camera / slow-mo on final shatter.
- Local best score persistence (localStorage).
- Background music loop to match the neon demolition vibe.

## design
- Palette: bg #0a0e1a → #17243d, glass #a5e3ff, edge #eaf8ff, accent pink #ff2e88, cyan #00e5ff, gold #ffd23a
- Fonts: Anton (display numbers + title), Poiret One (unused but loaded for future elegance), JetBrains Mono (UI)
- Cannon fixed at x=90, y=H-90 with rotating barrel tracking mouse
- Aim line: dashed 4,6 pink from cannon to pointer
- Crosshair: 40×40 circle + cross hairs following pointer
