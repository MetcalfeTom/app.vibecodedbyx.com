# py-playground

## log
- 2026-10-03: the beginner course moved to its own app, sloppy-teaches-programming (general + game tracks, for fannar22). Here the 🎓 learn button opens that app; first visits get the sierpinski demo again. An already open lesson card still works and can be closed (old lessons code kept for that).
- 2026-05-09: shipped — browser Python playground for isskren (chat ask: "can we build a simple browser-based python playground for isskren?"). Powered by Pyodide v0.26.4 (CPython compiled to WebAssembly). Python runs entirely in the user's tab — no server, no backend, no code-execution endpoint to secure. The Pyodide WASM + Python stdlib (~6 MB combined) downloads once from jsdelivr on first visit, then the browser caches it for next time.
  - **Two-pane layout**: left = Monaco-lite textarea editor with line-number gutter (rendered via absolutely-positioned overlay so the textarea can stay a single native control), right = scrolling output terminal. Stack vertically below 760px viewport.
  - **Editor**: 4-space-indenting Tab key, Cmd/Ctrl+Enter to run, auto-save to `localStorage['py-playground-code-v1']` on every keystroke. Char + line counter in the pane head.
  - **Output terminal**: stdout in default text color, stderr in crimson, info lines (info messages, separators between runs) in dim italic. The terminal autoscrolls on new output. Each run is separated by a divider line so the user can see exactly what came from this invocation vs. last.
  - **Status pill** in the header: amber pulsing dot during boot/run, acid green when ready, crimson on failure. Pill text shows the loaded Python version once boot completes (e.g. `ready · python 3.12.1`).
  - **Boot overlay** with a fake-progress bar — Pyodide doesn't expose a real download-progress event, so we tick a sigmoid-easing approximation up to 90% during `loadPyodide()` then snap to 100% on completion. Better than a spinner with no signal.
  - **8 example snippets** preloaded into the dropdown:
    - hello world (plain `print`)
    - **Sierpinski via XOR** — 1-line fractal (the snippet from the prior chat thread)
    - **Y combinator** — anonymous recursion via the fixed-point combinator
    - **Quine** — self-printing program
    - Mandelbrot ASCII (~70×26 grid)
    - Sieve of Eratosthenes (primes ≤ 200)
    - Word-frequency via `collections.Counter`
    - Walrus operator demo (Python 3.8+ assignment-expression)
  - **Run-it-yourself flow**: select an example → editor loads with the code → hit Run → output appears with the last run's wall-clock ms in the pane header. Selecting a different example or editing the code persists immediately.
  - **Aesthetic**: Audiowide title "Py · Playground", Cormorant Garamond italic tagline, JetBrains Mono everywhere for the actual code/output, Press Start 2P for the tiny status pill text. Cyan + acid-green + amber palette; deep navy radial bg.
  - **Accessibility**: rem units, semantic `<main>` / `<header>` / `<section>`, `aria-label` on the editor textarea, `aria-live="polite"` on the status pill + output, `:focus-visible` outlines, 2.75rem (44px) min interactive targets, skip link, `prefers-reduced-motion` removes pulsing-dot animation + boot-bar transition.
  - **No outbound network calls beyond Pyodide's own indexURL fetches**. The user's code never leaves the tab.

- 2026-10-03: SLOPPY TEACHES PROGRAMMING (fannar22: "is there a program … that teaches users how to program … a total beginner … with zero experience", named it "Sloppy AI Teaching Programming", asked for classic Hello World and a game at the end). 🎓 learn button + a lesson card above the panes: 11 lessons (Hello World/print, maths, variables, f-strings, if/elif/else, lists, for, while, functions, times-table project, final boss = guess-the-number game with Fannar's "Yahoo, you got it right first try!"). A first visit (no saved code) opens lesson 1; progress in localStorage 'py-playground-lessons-v1' {on, at, done}. In a lesson, ▶ run executes in a FRESH dict namespace (`runPythonAsync(code, {globals})`), then checks: optional `py` expression in that namespace, then `ok(stdout, ns, code)` → true or a hint string. Friendly error notes for IndentationError / NameError / SyntaxError / EOFError / int() ValueError.
  - input() now works everywhere: setStdin → window.prompt (Cancel = EOF), and stdout is unbuffered (setStdout write) so "Your guess: " shows before the answer.
  - Enter auto-indents (keeps indent, +4 after a ':'), for phones without Tab.
  - Probes: scratchpad hm/ppy2.js runs every lesson's hint as the answer (11/11 pass) with a scripted prompt guesser.

## issues
- ~6 MB cold-load. Acceptable for a tool you visit once a day, painful for a 30-second drive-by. Could mitigate by lazy-loading Pyodide ONLY when the user first hits Run (instead of on page boot) — saves the data for visitors who just want to read the snippets.
- No syntax highlighting in the editor — it's a plain `<textarea>`. CodeMirror or Monaco would add ~300 KB and a heavier toolbar. For "simple but cool" a plain editor wins.
- (fixed 2026-10-03) input() goes through a prompt() box.
- No package install UI. Pyodide can `pip install` packages via `await pyodide.loadPackage(...)` or `await micropip.install(...)`, but for a snippet playground the stdlib is 95% of what users want and the install adds latency.

## todos
- DONE in sloppy-teaches-programming: fannar22 asked for TWO tracks: General Programming and Game Programming. The current 11 lessons are the general track ending in a game; a game track (dice, rock-paper-scissors, text adventure, …) is the next step.
- Lazy-load Pyodide on first Run instead of on boot (saves bandwidth for visitors who just read).
- Save/load named snippets to localStorage (current state is one global slot).
- Share snippet via URL fragment (encode the code as base64 in `#code=...`).
- Allow `await` at top level (already works via `runPythonAsync`) — surface that in an example.
- Light syntax-highlighting via a tiny tokenizer (keywords, strings, comments) without bringing in CodeMirror.
- A "download as .py file" button.
- Plot rendering: Pyodide ships matplotlib; route plot output into the right pane as an image.
