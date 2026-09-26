# Hex Editor: the haunted IDE

A ghost "writes" a small program (typewriter animation) and hides a classic security hole ("curse") in it. Click the cursed line before your 3 candles go out. Then a side-by-side reveal: what the ghost wrote vs what we'd normally write, with a plain-words explanation. Idea and program list: marcipopsis (Twitch, 2026-09-26). "Heks" is Dutch for witch, pronounced hex (marci).

## log
- 2026-09-26 v1: six programs, each skinned like its language's classic editor:
  - To-do list, JavaScript (devtools dark): XSS via innerHTML
  - Password vault, C64 BASIC: password in the code + endless guesses (2 curses)
  - Cloud Coffin file share, Python (IDLE cream): path traversal (+ no owner check, mentioned in the why)
  - Mail program, Turbo C++ blue: command injection through std::system
  - AI agenda, C# (Visual Studio): prompt injection + an AI with every tool that runs without confirmation (2 curses)
  - Coffin door, C (green phosphor vi), bonus: gets() buffer overflow
  - Candy: each curse found = 3 minus wrong clicks so far on that file (min 1). Progress + best per program in localStorage 'hexEditor'.

## issues
- Nothing is ever executed: the programs are display-only data (LANGS in the page script). Keep it that way. Never eval user text or load code from URLs.
- `#ide{display:grid}` beat the hidden attribute → global `[hidden]{display:none!important}`.
- On phones the grid needs minmax(0,1fr), or the code's min-content width scrolls the whole page sideways.
- Headless probe: scratchpad gaunt/hexprobe.js + runhex.sh (#menu, #win|i|top|ide|rev, #lose|i, #og|0). The BASIC gutter is empty, so compare the <code> text, not the whole line.

## todos
- marci's next idea: a haunted AUTOCOMPLETE — the ghost offers completions for a half-written line, some dangerous; pick the safe one.
- More programs per language (random pick), a shared candy leaderboard (supabase), a witch hat for the ghost (heks).
