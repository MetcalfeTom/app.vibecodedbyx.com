# Triple Cubed

Tatum's idea (2026-10-02 stream): the classic tile word game, but collaborative. You and an AI teammate ("Two") share one score
and chase the ×27: one word along an edge across all three triple-word squares. Two is a genius at helping but never gives hints;
it only helps through its moves.

## Art direction
- Look: a night card table. Green felt (#0d3b2f), ivory tiles (#f3e8cf) with ink letters, brass accent (#e7b75a).
- Squares: 3W crimson, 2W rose, 3L teal, 2L pale blue, ★ centre. A triple glows brass while its edge is still open (all 3 golds empty) and has letters.
- Fonts: Gloock (title, tiles), Spline Sans Mono (UI).

## How it works
- engine.js: global `TC`. 15x15 classic layout, 98 tiles (no blanks), 7-tile rack, +50 for all seven.
  `evaluate(board, placed, isWord)` validates + scores; `moves(board, rack, trie, isWord)` is Appel–Jacobson anchor generation with cross-check masks.
  `edgeFits(board, edge, longWords, isWord, limit)` counts which 15-letter words still fit an edge (letters + crossing words); `edgeOpen` = all three golds empty.
- words.fc: the full list (an-array-of-english-words, 2-15 letters, 270k words) for checking your words. ai.fc: Two's vocabulary (32k friendly words).
  Front-coded: each line = chr(48 + shared prefix length) + suffix. Built by the scratchpad mkdict.py.
- Two's move: all its legal moves, top 40 by score + top 60 touching an edge, value = score + 1.4 × change in edgeValue.
  edgeValue: +12 per open edge, +4 per letter on it that still fits a 15-letter word, −18 if no word fits anymore,
  +90 if your current rack can finish a fitting word (Two knows your tiles; it never tells). Two never takes a ×27 itself.
- State in localStorage 'triple-cubed-v1' (resume on reload), best score + ×27 count in 'triple-cubed-best'.
- Keys: type a letter to pick that tile, Enter plays, Backspace takes the last tile back, Esc deselects.

## log
- v1.0 (2026-10-02): first version. 15x15 classic squares, Two with an open rack, live word + score preview, swap, pass (press twice), end card.

## issues
- Tatum: the built-in word list misses words; bring-your-own word list is wanted (Tatum has a list with 15-letter words).

## todos
- Load your own word list (a .txt file, one word per line), kept in IndexedDB.
- Tile counting for Two (Tatum): weigh edge setups by the chance the missing letters are still unseen (bag + your rack), for setups more than one turn out.
- Drag tiles onto the board; blanks.
