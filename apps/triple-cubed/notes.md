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
- v1.7.1 (2026-10-03): helper lists Two's aims first (★) then the other buildable long words, up to 6, "+N more" (Tatum: "5 long words still buildable" but only 2 shown: the count was longs, the list was aims only); word spans joined with spaces so they wrap (nowrap spans with no gap overflowed the page). Dark-edge lines carry their own reason (", no long word fits it now"), the Two-side message used to tack it on after the last item.
- v1.7.2 (2026-10-03): helper box stays small (Tatum: "only has room for 4 long words on one row", "3,383 long words still buildable might be a lot for a small box"): four words per edge in a grid, a "+N more" link opens up to 60 and "fewer" folds it back; untouched edges just say "wide open, N long words could still go here" (aims are alphabetical, not ranked, so listing them for an empty edge meant ABSORPTIOMETERS first).
- v1.7 (2026-10-02): Tatum: "quite sad seeing the golden highlights blinking out because of a far off move" (tile counting: a move anywhere can use up the letters an edge's last long words need). Now: preview() warns "puts out the X edge" (status.warn, douse()) before you play; the dark line names the letter (canBuild() before the move, culprit()); Two's choose() also charges far-off moves that starve a glowing edge (B[j] + stillBuild, d -= base). Helper mode (Tatum, opt in, #helpb, localStorage triple-cubed-helper): a list under the buttons with each glowing edge's count of still-buildable long words and Two's top 3 aims there (letters already down in gold); falls back to any long word when no aim fits.
- v1.6 (2026-10-02): word tray (Tatum: "click tiles in your rack, it should place them on a little preview row" + "a horizontal/vertical toggle ... then a ghost outline can follow your mouse"): tapped/typed tiles line up in `tray` (rack indices, tap a tray tile to take it back), #dir toggles across/down (arrow keys too, saved in localStorage triple-cubed-dir), a mouse hover shows the ghost word (lay() hops over letters already down, red when it runs off the board), a click drops it. Touch: a word of 2+ shows its ghost on the first tap and goes down on the second tap of the same cell. One tile + one tap still works like before. `sel` is gone.
- v1.5 (2026-10-02): the eight gold squares glow from the start and an edge's go dark once no 15-letter word (any in the list, `longs`) can still be built along it from the letters not on the board (Tatum); glow() is cached by board, status says "the X edge went dark". Two never plays on a glowing square while it has another move (Tatum: "Two just stole another triple word tile"), and edgeOne keeps an aims-dead edge worth TW.open while it still glows. Endgame (Tatum): with the bag empty, going out costs Two 1.5× your rack's points (0 if you can't play anything), kept tiles cost 0.5×. Board rows were uneven: the centre star made row 8 ~30% taller (Tatum spotted it); grid rows are now minmax(0,1fr).
- v1.4 (2026-10-02): Two leaves the gold squares alone (Tatum: "Two kept taking the triple word tiles"): an untouched open edge is worth 45 while some target can still be built from the letters not on the board (emptyOK), a dead edge is worth 0 so its golds are fair game. The end card tells the story: best word and who played it, your points vs Two's, the edge that came closest (most letters while a long word still fit, S.close) and a word that would have fit.
- v1.3 (2026-10-02): Two's tiles slide from its rack to their squares (Tatum). Two aims at buildable long words (Tatum: "aim for very specific 15 letter words that are particularly buildable"): t15.fc = 1,573 words from build15.py (makeable from the bag, the stretches between golds are words in Two's vocabulary so it can lay them along the edge in one move, few hooks, common gold letters); edge planning uses aims = t15 ∩ your list, the 'you can finish now' check still uses every long word. Rack keeping: +5 per kept letter a live edge still needs (non-gold squares).
- v1.2 (2026-10-02): Two takes 1-2 s and fidgets with its rack while it thinks (Tatum: so you don't feel you hold the team up); confetti on a ×27 (Tatum: it's the win condition). Two's setup sense: edgeOne() per edge, trust factor by how many 15-letter words still fit, +hook per empty edge square with a tile just inside it, pool = top 40 by score + up to 400 moves touching an edge or the row inside it. Debug: window.__TCfast skips the pauses; __TC.edges(board), __TC.TW weights, __TC.bigTrie() (Two on the full list).
- v1.1 (2026-10-02): load your own word list (Tatum: .txt, first word per line, a-z 2-15 letters, ≥500 words; stored in IndexedDB 'triple-cubed'/'lists'/'mine', 'use built-in' resets). Two's vocabulary = ai.fc ∩ your list; edges checked against your list's 15-letter words. Tile counting: an edge whose fitting words all need letters that are already on the board counts as dead.
- v1.0 (2026-10-02): first version. 15x15 classic squares, Two with an open rack, live word + score preview, swap, pass (press twice), end card.

## issues
- Tatum: the built-in word list misses words; bring-your-own word list is wanted (Tatum has a list with 15-letter words).

## todos
- v1.3 sims (ptc11: timeline per Two turn 'fixed/aims fitting'): edges now stall rather than die, e.g. 4 letters with 4 targets for 25 tiles, because Two rarely has a legal word that drops the exact letter on the exact square. Next idea: when stuck, Two swaps only the letters it doesn't need, or a 2-turn lookahead for hooks under the target squares.
- The ×27 is still basically unreachable: self-play (probes ptc5-ptc8, two cooperative players, even with Two on the full 270k list) never landed one in 12 games; edges die at 4-5 letters (no word fits, or the letters it needs are used up). Only 3 of 5,812 fifteen-letter words have both 6-letter edge stretches as words (troubleshooters, whippersnappers, snippersnappers); 92 have 5+5. Tatum's idea: precompute for each 15-letter word how its 12 non-gold letters can be laid (which stretches are words, which need hooks), and let Two commit to one target per edge.
- End card that tells the story of the game (closest edge, best word).
- Two's tiles flying: fromRack()/fly() clone tiles to body (.cell clips overflow), Web Animations, skipped with reduced motion and __TCfast.
- Tatum's input idea: tap tiles into a tray, an across/down toggle, a ghost of the word that follows the pointer, then place.
- Tile counting, next level: weigh setups two turns out by the chance you draw the missing letters.
- Drag tiles onto the board; blanks.
