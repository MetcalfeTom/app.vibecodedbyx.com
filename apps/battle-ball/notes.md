# battle-ball

## log
- 2026-05-01: Created. **Habbo Battle-Ball-style isometric tile claim prototype.** 8×8 grid rendered as iso-prism cubes (TW=64 / TH=32 top face + 14px depth). Two-player 60s round: YOU (pink) vs RIVAL (cyan). Click a tile → BFS pathfind from current cell → smooth cell-to-cell tween animation (220ms/step, sine-out ease, hop bob). **Tile rules** (simplified Battle Ball): empty → light claim of stepper's color (1pt); your-light → dark/locked (2pts); your-dark → no-op; opponent-light → steal as your-light; opponent-dark → BLOCKED (pathfinder rejects route). **Bot AI**: every ~0.5–1.1s replans, scores every reachable cell (empty=4, your-light steal=5, own-light double-step=2) minus distance bias, picks weighted-random from top 6 → BFS pathfind. **Render**: depth-sorted by col+row so closer cubes overpaint farther; pieces drawn at their tile's depth so shadow correctly hides under taller adjacent cubes. **Pieces**: chunky pixel avatar — body trunk (rounded rect, 2px ink stroke), accent hat band, head circle, dot eyes, smile arc, drop-shadow ellipse on tile. **HUD**: 3 pills (you/rival score in 'Bungee', timer in 'Bungee'). **Aesthetic**: deep purple bg with pink/cyan/gold radial glows + 36px disco grid overlay (mix-blend overlay, low alpha). Title 'Bungee' "BATTLE·BALL" with chrome-cyan + magenta neon glow + hard offset shadow + 'Silkscreen' subtitle "walk · claim · lock the floor". 'Fraunces' italic 800 for the win/lose title, 'Silkscreen' for HUD labels. **Audio**: lazy WebAudio — square step blips (540Hz player / 380Hz bot), triangle 3-note arp on game-over. **Mobile**: `touch-action: none` on canvas, touch handler routes through same `onClick`. **End modal**: fullscreen blur card showing final score + PLAY AGAIN button (resets grid + pieces + timer). Pollinations OG.

## issues
- Bot AI re-plans only when its current path empties — if its target cell gets locked by you mid-walk, it'll bee-line into a now-blocked tile (BFS at plan time is stale). Could re-validate path each step.
- Hover highlight (outline-only screen-additive stroke on the target tile) doesn't account for tile occlusion if you hover the *side* of a tile — the inverse-projection clamps to the nearest cell which is the right behavior 90% of the time.
- The `sy - TH/2` offset on click-to-grid is a heuristic to make clicks feel like they land on the top face. Edge cases near the top-most row can occasionally pick the wrong tile.
- No multiplayer yet — currently local 1v1 vs greedy bot. Real-time via Supabase Realtime is the obvious next step.
- 60s round + 8×8 grid (64 tiles) means a perfect lock-everything game tops out at 128 pts (all dark). At ~5 steps/sec the round caps how complete the floor can get; seems balanced for "you have to choose between locking your tiles or stealing rival's lights".
- Pure-greedy bot with no defensive thinking — won't double-step its own cells to lock unless they happen to score >= alternatives.

## todos
- Multiplayer via Supabase Realtime (broadcast piece moves + tile state).
- Tile-locked sound effect (different from step blip).
- Particle puff on each step (small dust cloud at feet).
- Power-ups (random tile that grants double-claim or speed-boost).
- More than 2 players.
- Map variants (irregular shapes, holes, walls).
- Difficulty selector for the bot (pacifist / greedy / strategic).
- Replay system that records moves and lets players watch back.
- Per-player faces / hat color customization persisted to localStorage.
- Score animation popup ("+1" / "+2" floats up from claimed tile).
