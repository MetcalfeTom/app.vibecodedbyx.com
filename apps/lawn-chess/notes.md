# Lawn Chess (Mole Chess)

Idea: trysonova (a hidden mole that pops out and blocks squares for both sides, a surprise), shaped by Tatum (make it its own game, like Duck Chess; maybe Menagerie Chess later with a different animal per load). 2026-10-02.

## log
- v1.0: chess.js 0.10.3 + a small alpha-beta engine (sleepy d1 / keen d2 / fierce d3 with a 2.5 s fallback to d2), 2 players on one screen, play white/black/random.
  - The mole: under -> (optional rumble) -> up 4-7 plies -> under 3-6 plies. Picks an empty, non-en-passant square weighted by how many moves land on or pass through it.
  - Surprise by default: the page never says "mole" (title, og, description) until it pops; the first pop ever in a browser gets a "Surprise!" line (localStorage `lawn_met`). The rules dialog has a spoiler `<details>` with a "warn me" checkbox (cfg.warn) that turns on the one-turn rumble.
  - A warned square that gets occupied calms down (ev `calm:sq`) instead of popping somewhere unannounced.
  - The mole doesn't burrow if that would leave the side that just moved in check (it waits a turn).
  - Wide screens (>=860px, landscape): status panel beside the board.

## design notes
- The real FEN never has the mole. For move generation a stand-in knight of the side to move sits on the mole square (`work()`), and its own moves are filtered out (`legal()`), so nothing lands on or slides through it and nobody can capture it.
- In the search, `swapMole(g,msq)` after `g.move` gives the stand-in to the new side to move; `swapMole(g,msq,1)` before `g.undo` gives it back to the mover. Bug in the first draft: both calls used g.turn(), so after an undo Black owned a phantom knight and the engine played Ke2.
- Root search uses a window of best-noise-1, so moves outside the noise band are cut early.
- chess.js moves() costs ~1.5 ms in headless; d2 ~0.9 s in an Italian middlegame, d3 hits the 2.5 s deadline there.
- Test hook: `window.__MOLE`.

## issues
- fierce often falls back to depth 2 in busy positions.

## todos
- Tatum: Menagerie Chess, a different garden animal per load (a duck that waddles one square per turn? a camel?). trysonova: duck + mole together.
- trysonova: "floor is lava" chess (tiles vanish under pieces that stand still too long) as another mode.
- Underpromotion choice (auto-queen now).
