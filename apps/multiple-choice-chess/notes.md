# Multiple Choice Chess

Tatum's idea (2026-10-02 05:38, "Multiple Choice Chess": Stockfish comes up with the options, based on a few
customizable rules). You play Stockfish; on your turn Stockfish ranks every legal move and a rule deals you a few of them
as A/B/C/D, drawn as coloured arrows under the pieces. After you pick, every option shows its verdict and score.

## How it works
- chess.js 0.10.3 (cdnjs, global `Chess`) for the rules; Stockfish 10 from cdnjs in a blob-worker shim (same trick as Parla).
- `rankAll(fen, legalCount)`: Skill 20, MultiPV = all legal moves (cap 60), `go movetime` 1.1-1.6 s, keeps the latest
  line per multipv, sorts by score for the side to move. Mate scores map to +-(100000 - 100n). Moves missing from the list
  are appended as the worst.
- `dealFrom(rank, n, rule)`: rules `mix` (default, Tatum 05:41: best, worst, a slightly-off move about 60 cp worse, then
  random ones), `gem` (best + traps 150+ cp worse, captures and checks first), `top` (top n), `spread` (evenly through the
  ranking), `chaos` (random). Options per turn 2-5 (default 4).
- Verdict by loss vs best: best <=10 cp, good <=50, inaccuracy <=150, mistake <=300, else blunder. Points 3/2/1/0.
- Opponent: Skill 1/8/20 (gentle/club/brutal) at 250/500/900 ms, MultiPV 1.
- Settings in a `<dialog>`: rule, options, arrows (all / on hover / off, Tatum 05:42-05:43: arrows under the pieces,
  and a switch to turn them off), opponent, side (applies to a new game).
- Saved in localStorage: `mcc_cfg`, `mcc_game` (uci moves + picks), replayed on load.

## Log
- v1.0 (2026-10-02): first version.

## Issues
- Headless test: the engine loads from cdnjs and deals in about 2 s a turn on the test box.

## Todos
- Tatum 05:44 "i'd still like to be able to play against stockfish": the opponent already is Stockfish; if they mean
  free moves (no quiz), that needs tap-to-move.
