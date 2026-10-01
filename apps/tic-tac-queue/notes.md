# Tic Tac Queue

Tic-tac-toe with a FIFO queue of marks: Tatum's idea (sloppy.live chat, 2026-10-01 01:23 UTC: "tic-tac-toe but with a FIFO data structure for your previous moves, so your earliest X or O disappears"). Deli-counter look: every mark wears a ticket number (1 = oldest), the mark that leaves on your move goes pale, wobbles and says "next out".

## log
- v1 (2026-10-01): vs bot (rookie / sharp / perfect, "bot goes first" swap) or 2 players on one device. Marks each: 2, 3 (default) or 4 (Tatum 01:26). 2 only works with Tatum's 01:27 rule: the row is checked BEFORE the oldest leaves (you briefly hold three; a winning move keeps all three on show). Memory mode (Tatum 01:29): no tickets, no "next out", no order in the aria labels. Oracle toggle: "with perfect play X wins in N moves" / "goes round in circles". Draw = the same position three times. Score vs bot in localStorage (ttq_score), settings in ttq_cfg. Keyboard: arrows move between cells, 1-9 place, N new game. Board on the right on wide screens.

## the solver (inline worker)
- Retrograde analysis of every reachable position per variant, at load in a Web Worker (k3 ~0.3 s, k4 ~0.5 s, k2 instant in headless). Queue code = digits (cell+1), oldest lowest; key = (xCode*10000 + oCode)*2 + turn. Returns sorted Float64 keys + Int16 vals (1000+n = side to move wins in n plies, 2000+n = loses in n plies, missing = draw/cycle); main thread binary-searches.
- Every non-winning move is expanded, even where a win was on offer (first build pruned those, so positions after a missed win read as "draw": caught by the og shot, oracle said circles where X had a win in 1).
- Results (first player = X): 3 marks: X wins in 13 plies (7 X moves), 116k positions. 2 marks (check before leaving): X wins in 7 plies (4 moves), 6.6k positions, every position decided (no draws). 4 marks: X wins in 11 plies (6 moves), 375k positions. So "perfect" going first can't be beaten; you can beat it only when you go first and play perfectly.
- Bot: perfect = take a win, else the fastest forced win, else a draw, else the slowest loss (random among ties). Sharp = 22% random moves, rookie = 60%.

## issues

## todos
- Voice ideas: puzzle mode ("win in 2" from a half-played board, the solver can pick them), the perfect bot owning up when it goes first that it can't lose.
- Online duel (Bluff Duel's relay code could carry it).

## notes
- Scratch harness: session c15135b2 scratchpad `ttq/` (sw/test.html = app + probe.js: per variant solve time, start value, 30 perfect-vs-perfect games match the start value, a perfect side never throws a won position vs random; sw/og.html + og.js = og/phone shots via live.sh). dbg.js = node check of the worker (`node dbg.js 3`, `node dbg.js 2 p`).
