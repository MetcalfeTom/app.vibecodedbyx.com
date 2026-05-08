# glitch-7

## log
- 2026-05-08: shipped — invented 7-glyph stack-based esolang puzzle game (chat ask: "invent a cryptic esolang and build a puzzle game for it"). The language is named after its instruction count.
  - **Spec** (7 instructions, all single-character):
    - `▲` push 1 (the only literal — every other number must be composed)
    - `▼` pop top
    - `◆` duplicate top
    - `◈` swap top two
    - `+` pop a, pop b → push (a + b)
    - `×` pop a, pop b → push (a × b)
    - `!` print top of stack (does NOT pop)
  - **Interpreter**: a 30-line `run(prog)` that ignores any non-glyph character (so the program text stays readable with whitespace + comments), throws on stack-underflow with a useful error, has a 5000-step ceiling to prevent runaway loops (no loops in the language but defensive). Returns `{stack, stdout, trace, steps}` so a future "step debugger" can replay.
  - **8 puzzles** escalating in difficulty: P0 echo_1 (stack `[1]`), P1 the_2 (stdout `[2]`), P2 stack_pair (stack `[1, 2]`), P3 print_four (stdout `[4]`), P4 count_three (stdout `[1, 2, 3]` — exploits `!` not popping), P5 print_eight (stdout `[8]` — multiplicative composition), P6 swap_dance (stack `[1, 3]` — forces use of `◈`), P7 print_42 (stdout `[42]` = 6×7 — composition of three sub-builds). Each puzzle declares its target as either a final `stack` state or an `stdout` sequence; the interpreter result is checked against whichever the puzzle declares.
  - **Verified solvable** before ship — node-tested example programs against the interpreter for all 8 puzzles, all match (P7 example: `▲▲▲++◆+▲▲▲++◆+▲+×!` produces stdout `[42]`).
  - **UI**: glyph palette of 7 clickable buttons (each shows the glyph + a tiny mnemonic like "push 1" / "dup" / "swap" / "add"), a Major Mono Display textarea editor that accepts both palette-clicks and direct typing, RUN button that executes + grades, CLEAR resets the editor, NEXT advances on accepted programs. `Ctrl+Enter` / `Cmd+Enter` runs the program — common code-editor reflex.
  - **Result panel** shows `stack` and `stdout` arrays after every run + a Press Start 2P verdict line ("✓ ACCEPTED · +200 · perfect" lime, "✗ stdout should be [42]" rose).
  - **Score model**: +200 per puzzle solved, +100 perfect-puzzle bonus (no failed runs on that puzzle), -25 per failed run. Local end-of-match overlay shows score + solved-count.
  - **Aesthetic**: deep ink-black bg with pink+cyan radial glows + 2px CRT scanline overlay, Major Mono Display title with a chromatic-aberration triple shadow (pink + cyan + magenta), JetBrains Mono labels, Fraunces italic puzzle descriptions, Press Start 2P verdict line. Editor textarea has a cyan border with glow, tagged "PROG" in a corner pill.
  - **Audio**: 3 Web Audio synths — keypress 660Hz blip (random ±60Hz so successive presses sound distinct), accept 4-note triangle arpeggio, reject 180Hz sawtooth.

## issues
- The language is intentionally minimalist; some "obvious" puzzles (e.g. produce a specific 5-element stack) become tedious. P7's 18-glyph solution is approaching the upper limit of fun.
- No loops or conditionals — turing-incomplete. That's by design (puzzles have to be solvable by composition, not control flow), but limits expressiveness.
- No tracing UI — the interpreter records a trace per glyph but the UI doesn't show the step-by-step stack evolution. Could add a "step" mode later.
- Editor accepts arbitrary text (whitespace ignored at parse) but doesn't lint glyphs that aren't in the language. Stray characters silently no-op.

## todos
- Step-debugger: visualise the stack after each glyph executes.
- More puzzles: print prime sequences, sum of N pushes, fibonacci-style targets.
- "Golf" mode: solve in fewest glyphs possible, score by inverse length.
- A 9th instruction `?` that pops a value and skips one glyph if 0 — would add conditionality and make the language Turing-complete via fixed-point. Bigger scope, V2.
- Online leaderboard sharing programs (Supabase mirror of chroma-sort's pattern).
- Per-puzzle "show example solution" button (locked behind 3+ failed attempts).
