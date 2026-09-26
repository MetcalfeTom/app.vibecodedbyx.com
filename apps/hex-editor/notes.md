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
- 2026-09-26: each curse also says what people would say when it hits them ("someone downloaded my files", "it just crashed"), marci: use the words people use when their computer doesn't work.
  - Candy: each curse found = 3 minus wrong clicks so far on that file (min 1). Progress + best per program in localStorage 'hexEditor'.
- 2026-09-26: HAUNTED AUTOCOMPLETE (marci: "autocomplete that gives wrong completion", "dangerous options"), 7th menu card. 8 half-written lines (py/js/c/cs: SQL, innerHTML, strcpy, md5 passwords, Math.random sessions, exec, BinaryFormatter, verify=False); the ghost types, a listbox pops up with 3 completions. Cursed ones wear tempting tags (★ recommended / fixes the error), the safe one has none; options + rounds are shuffled. Safe pick +2 candy, cursed = candle out; 3 out ends the run. After each pick: what people say + all three with verdicts. Summary at the end; best in SAVE.best.auto {candy,lost,safe,of}. Keys: ↑↓, Enter/Tab/Space, 1-3, or click.
  - Recall desktop has a ghost shortcut (hex-editor.lnk, Haunted files) that opens /hex-editor/?bare=1 in a window.

## issues
- Scroll with into(el) (window.scrollTo), never scrollIntoView: the app also runs in an iframe on the Recall desktop, and scrollIntoView scrolls the parent page too.
- Nothing is ever executed: the programs are display-only data (LANGS in the page script). Keep it that way. Never eval user text or load code from URLs.
- `#ide{display:grid}` beat the hidden attribute → global `[hidden]{display:none!important}`.
- On phones the grid needs minmax(0,1fr), or the code's min-content width scrolls the whole page sideways.
- Autocomplete probe: gaunt/autoprobe.js + mkhexa.sh/runhexa.sh (#good full run, #bad 3 misses, #shot popup open).
- Headless probe: scratchpad gaunt/hexprobe.js + runhex.sh (#menu, #win|i|top|ide|rev, #lose|i, #og|0). The BASIC gutter is empty, so compare the <code> text, not the whole line.

## todos
- More autocomplete lines (C++ / BASIC skins aren't used yet); a daily ghost (same 8 for everyone that day).
- More programs per language (random pick), a shared candy leaderboard (supabase), a witch hat for the ghost (heks).
