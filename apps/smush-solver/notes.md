# Smush Solver

A helper for the word game Smush (Tatum's idea and rules, 2026-09-28 on stream). Type your board, tap the spicy tile, get every playable word sorted by score, with a look-ahead that says whether you can still use up every tile.

## Rules as Tatum described them
- A central golden tile (infinite uses) plus 8 plain tiles with 5 uses each. Every word must include the golden letter.
- Words are 3+ letters (2-letter words in a list are ignored). The same word can't be played twice.
- All plain uses must be spent: the game ends when they're gone, so the last word has to use exactly what's left.
- Letter values: Scrabble (Tatum 2026-09-30: it really is Scrabble), changeable in the Scoring Facts panel behind the "scoring" button (localStorage `smush_vals`).
- A spicy letter changes after each word (random as far as we care; there's a deterministic algorithm but reverse engineering it is out of scope). Each spicy letter in a word multiplies it by 2 again: they COMPOUND (two = ×4, three = ×8; Tatum 2026-09-30). Multiplier in `smush_spx`.
- PERFECT (the game's achievement: "pangram first, clean plate, no hints: score ×2"): the whole final score doubles when the FIRST word is a pangram and every tile gets used. There is no flat pangram bonus. Multiplier in `smush_px` (1 = off).
- End bonuses (Tatum 22:57-23:04): flat bonuses like "Beat Today's Average +5", "Top 30% today +10", "Beat the Robot +5", "Clean Plate +50" (every letter spent to zero), "Unassisted +25" (no hints) land only on the final score (they never change the advice) and count BEFORE the Perfect ×2 (the ×2 sits at the bottom of the game's score sheet, one example checked).
- Dictionaries (built-in and imported) contain words the real game rejects, so the ✗ button hides a word for good (localStorage `smush_nope`).

## Word lists
- Built-in: words.js, ~42k words = wordslide's hand-written lists (words.js + words-extra.js) + generated plural/-ed/-ing forms (some aren't real words) + glyph-grove's 2-letter list (ignored at MIN 3).
- Bring your own: a local file picker only (.json or .txt). Accepts a JSON array, {"words":[...]} (Tatum's file), any object whose biggest array is the list, an object keyed by words, or plain text. Stored in IndexedDB `smush-solver`/kv/'dict' on the device. NO fetching of URLs (stream rule).

## How the look-ahead works
- Plain letters pool by letter (two tiles with the same letter = 10 uses). State = remaining uses per distinct letter, mixed-radix code (≤ 6^8 = 1.68M) + two 20-bit packed halves (5 bits per letter, guard bit) for a borrow-free fit check.
- A Web Worker (blob from #wk) runs a memoised DP best(state) with repeats allowed, only trying words that contain the first letter still left (order doesn't matter for a partition). That's an upper bound and a fast dead-end test (best < 0 = can't finish even with repeats).
- No repeats: branch and bound over distinct words (bnb), bound = DP value, 250k nodes for the top plan, 4k per candidate; played + ✗ words count as used. after codes: -3 doesn't fit, -2 pending, -1 dead end (proven), -4 no finish found in budget ("risky").
- Timing: 774 candidates for E + RSTALNIO: DP ~2 s in node, ~4 s headless; all rows filled in ~6 s. Big imported lists will be slower; rows show "checking…" meanwhile, scores work at once.

## Look
Hot-sauce label: cream paper, chili red #cf2f19, mustard gold #e0a21f, ink #241913. Fraunces (900, SOFT 100) + Martian Mono. Chunky tiles with 5 pips, the golden tile glows, the spicy tile gets a 🌶️ and a red border.

## log
- 2026-09-30 v1.4.1 (Tatum 23:07-23:08): two more bonuses, Clean Plate +50 (every letter spent to zero, which every solver finish is) and Unassisted +25 (no hints). Defaults now +95 before Perfect; probe full game 46+23+70 → 278 before Unassisted was added.
- 2026-09-30 v1.4 (Tatum): end bonuses in the Scoring panel: BONS list (avg +5, top30 +10, robot +5) as checkboxes ticked by default (`smush_bons`), an "any other" number (`smush_bonex`), and "Perfect doubles the bonuses too" (`smush_bonx`, default on). finalScore = (total+BON)×PX for a Perfect; rows' "final" and the plan's "→" add bon(perf) on display only, so sorting is unchanged. Headless full game along the plan: 46+23+20 → 178 with Perfect. To add a bonus: one entry in BONS.
- 2026-09-30 v1.3 (Tatum 22:33-22:39): the game's real rules. NO pangram bonus (PBONUS + smush_pbonus dropped); instead PERFECT = pangram FIRST + every tile used + no hints → whole score ×PX (smush_px, default 2, panel row). Worker: withPan() = best whole game opening with an unused pangram (top 3 pangrams by DP bound, bnb each), sent as baseP/planP/exactP when needP (opening && PX>1); rows: a pangram row's final = (now+after)×PX, marked ✦ perfect; 'final' is now the WHOLE game score (played + now + after, ×PX if perfect). Rows take the top plan's finish when it opens with them (bigger budget). Spicy COMPOUNDS: each spicy letter multiplies again (SPX^k, two = ×4). Layout fix: .grid rows auto 1fr (the score box was pushed far down on desktop by the long word list).
- 2026-09-30 v1.2: Scoring Facts panel (Tatum 22:30: a button that opens a scoring panel, letter values moved in there): A–Z values (board letters boxed, changed ones red *, still localStorage smush_vals), spicy multiplier (smush_spx, default ×2, score rounds), pangram bonus row moved in from the word-list box; no more value inputs on the tiles; changing a value outside edit mode rebuilds after 250 ms. Tatum 22:33: the game has NO pangram bonus, it has a "Perfect" bonus (×2 score) for a pangram + every tile used → next step.
- 2026-09-28 v1.1: pangram bonus (Tatum 19:58-20:01: a fixed bonus for a pangram as the FIRST word, possibly several pangrams, always open with one): c.pan = uses every plain letter; pangrams pinned on top until the first word, gold PANGRAM badge, bonus amount settable in the word-list box (localStorage `smush_pbonus`, default 0 = unknown). Speed: the DP keeps one word per letter-mix (max value) → 1.8 s built-in / 4.7 s on a 260k list in node; per-row search budget = clamp(3e6/rows, 1000, 4000) plus a 25k retry for rows with no finish found → 0 false 'no finish found' on both test lists (was 184 at a flat 400). NB: timing the worker source with eval() in node is ~20× slow (sloppy-eval scope); use vm.runInThisContext (scratchpad smush/tw.js).
- 2026-09-28 v1: board entry with uses −/+ and letter values, spicy tile tap, ranked candidates (score now / with look-ahead), played ✓ (takes uses from the fullest tile with that letter, undo), ✗ game says no (with undo toast), find box, best finish plan, BYOD file picker, new game keeps letters.

## issues
- Probe: scratchpad smush/mkprobe.py (?g=&p=&sp=&play=N&fresh=1) seeds localStorage and waits for EV.done.

## todos
- end-of-game replay: your words next to the best finish (voice's idea, not promised)
- faster DP for 200k+ word lists if it drags (e.g. drop dominated anagram words, iterative DP)
- expected spicy value in the look-ahead: with compounding, E[mult] = mean over the eligible tiles of SPX^(count of that letter in the word); per-word constant if every tile can be spicy (asked Tatum 22:44 which tiles can be picked)
