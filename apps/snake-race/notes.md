# Snake Race — notes

## log
- 2026-08-28 v1.0: initial build. Snake (player) vs Serpent (BFS AI, 3 skills: Garden 5.4 c/s err .16 · Jungle 6.3 err .06 · Viper 7.0 err .012) or local 2P (Snake WASD, Serpent arrows). 36×22 grid ring track w/ 8 chicane blocks, 4 ordered gates (finish checkered at x=18 bottom lane; 1 right, 2 top, 3 left), 3 laps. Apples (+2 length to cap 16, 1.2s ×1.6 boost, 3 always on track), 4 chevron pads (0.9s boost). Crash (wall/any body) = 0.7s stun, −2 length (min 4), auto-steer to best open turn. AI rubber band ±2 gates → ×1.12 / ×0.9. Race ends when player finishes (vs AI) or both finish (2P). Best time per skill in localStorage `snake-race-v1` (only on wins). Faster One + Kode Mono. Probed desktop 62/62, mobile 13/13 (bot player finishes 3 laps in ~32s; Jungle serpent reaches lap 3 with 0 crashes).

## architecture
- Single `<script>`; engine + render in one closure. `window.__X` test seam: `{G, freeze, step(n), bfs, blocked, steer, passed, progress, GATES, PADS, grid, fmt}`. `step(n)` advances n×1/60s synchronously then draws — probes set `freeze=true` first.
- Loop = rAF + 50ms setTimeout fallback (whichever fires first), so background tabs / headless keep ticking. One synchronous `draw()` at boot.
- Static track is pre-rendered once to a 2× offscreen canvas; per frame only apples/pads/snakes/fx are drawn on top.
- Ranking uses static BFS distance fields per gate (`FIELD[g]`); the AI recomputes a dynamic BFS (bodies blocked) every step it moves (≤7/s, 792 cells — cheap).
- HUD DOM writes are diffed (`setText`) so nothing re-renders per frame unless it changed. Countdown/GO overlay is cleared by race state (`G.time>0.8`), not a timer.

## issues
- Difficulty badge (`.dif`) hides ≤640px — the full "SERPENT · JUNGLE" pushed the position label out of its card on 375px screens.
- A perfect bot beats Jungle by ~1 gate; humans are slower, so Jungle should feel like a fair fight and Viper a real threat. If chat says Viper is unbeatable, lower its base to 6.7 before touching err.
- The AI never crashes with the mistake model (it only picks a *safe* suboptimal direction). If chat wants a dumber Garden serpent, make mistakes occasionally pick blocked cells.

## todos
- Ghost of your best lap; more tracks (data-driven `rect()` calls make this cheap); swipe for P2 on tablets; Twitch-chat-driven apple drops.
