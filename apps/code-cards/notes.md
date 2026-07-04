# Code Cards — Debug Battle

## log
- 2026-07-04: v2 — complete rebuild as real-time debug battle. Two players share a screen with broken code, race to click the buggy line. 16 curated puzzles across JS/Python/React/TS/CSS/Vue/Node with real bugs (assignment vs comparison, off-by-one, missing await, SQL injection, state mutation, hook rules, infinite loop, typos, logic inversions, etc.). Wrong guess = bug jumps to new line + 1.5s cooldown. First to 5 wins. P1 uses blue buttons or keys 1-9, P2 uses red buttons or keys Q-O. 18s timer per round. Basic syntax highlighting (keywords, strings, comments, functions, numbers). Web Audio SFX (correct arpeggio, wrong buzz, bug-move chirp, tick, win fanfare). Fira Code + Bricolage Grotesque + Instrument Serif. Dark editor aesthetic.
- 2026-07-04: v1 — card battler (replaced by v2).

## issues
- None yet

## todos
- Solo mode vs timer (no P2)
- Online multiplayer via Supabase Realtime
- Difficulty tiers (easy bugs vs subtle logic errors)
- More puzzles (Rust, Go, SQL, shell)
- Bug hint system (progressive clues as timer runs down)
- Leaderboard (fastest times)
