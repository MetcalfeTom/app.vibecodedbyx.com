# Matrix Terminal

## log
- 2026-04-26: Created. **Neon-green code rain + interactive hacker terminal hybrid.** Fullscreen `<canvas id="rain">` runs the classic Matrix downpour (katakana + 0–9 + `:.+*=<>|/\@#$%&` glyphs), columns sized to `FONT_SIZE=16`, each drop has its own `{y, speed, len, char, swap}` state. Bright leading char (palette `head`) painted with `shadowBlur=12` neon halo, trail re-paints random glyphs with linearly fading alpha (1→0.18) over `len=8–30` cells. Frame fade via `fillRect(0,0,W,H, rgba(0,0,0,0.06))` for the ghosting trail. Drop respawns above viewport with 97% prob each time it leaves the bottom. **Terminal panel** centered (820×640 max, 96vw/88vh on mobile) with 3-dot mac chrome, `root@matrix:~ — uplink//ssh -p 1337` title, live "uplink stable" pulse dot. Body uses VT323 18px green w/ text-shadow neon glow + custom thin scrollbar. Input row sticky bottom: `root@matrix:~#` prompt + transparent input. **CRT FX**: 1px scanline overlay (multiply blend), radial vignette, low-amp `flicker` keyframe (4.6s steps(2)). **Boot sequence**: 6-line ASCII MATRIX banner → 5 streaming `[ ok ]` init lines → "Welcome back, operator." **17 commands**: `help`, `whoami`, `ls`, `cat <file>` (5 fake files: red_pill.txt / blue_pill.txt / agents.log / manifest.txt / readme), `scan` (animated subnet sweep, randHost/randIp/randPort), `ping <host>` (4-packet stream), `crack <target>` (live brute-force probe → AES decrypt progress bar → password reveal), `decrypt <ct>` (AES-256 then RSA-4096 progress bars → quote), `connect <host>` (TCP/TLS/auth/shell handshake), `tail [file]` (8 random log events at 700ms intervals), `sudo` (refused with "no escalation here"), `theme green|red|blue|amber` (live swap of rain palette via `themePalettes` map), `glitch` (term shake + hue-rotate 180° for 360ms), `wake_up` (slows rain to 0.18× + reveals "Wake up, Neo… Matrix has you… Follow the white rabbit… Knock, knock"), `date`, `history`, `clear`/`cls`, `exit` rejected ("there is no exit"). **Helpers**: `randHex`, `randIp`, `randHost`, `progress(label, ms)` animates 20-cell `█` bar, `streamLines(arr, delay)` for `[ ok ]` boot. **History**: ↑/↓ cycles last 30, Ctrl+L clears, Esc refocuses input, click anywhere in panel refocuses. **Mobile**: panel takes 96vw/88vh, font drops to 16px, head title hides. **Aesthetic**: pure black bg, neon green `#00ff66` (`themePalettes.green: head #d2ffe6 · body #00ff66 · dim #0a8a3e`), VT323 (terminal body), Major Mono Display loaded, JetBrains Mono (head meta + ASCII banner). Pollinations OG.

## issues
- DPR clamped to 2 (avoid huge canvas allocs on 3× retina). 
- `themePalettes` only swaps the rain canvas colors via JS lookup — terminal `--green` etc. are CSS vars, only the red palette gets a corresponding `body.red-pill` CSS class. Other themes leave terminal green; intentional (rain palette is the toy, terminal stays canonical).
- `wake_up` sets `speedMul=0.18` then resets to 1 after 5.2s; if user spam-runs it the resets stack but always end at 1.

## todos
- Add fake `nmap`, `traceroute`, `ssh <user>@<host>` commands.
- Per-command Web Audio bleeps (key-press blip, success chime, glitch crunch).
- Save command history to localStorage so it persists across visits.
- Make `red` and `blue` synonyms for `cat red_pill.txt` / `cat blue_pill.txt` (current dual meaning may confuse).
- "operator chat" command that streams ghost lines as if Morpheus is paging in.

## design
- Palette: bg `#000`, green `#00ff66`, dim `#0a8a3e`, bright head `#d2ffe6`, amber `#ffb86b`, red `#ff3344`, blue `#5fc0e0`.
- Fonts: VT323 (terminal body + input), JetBrains Mono (head meta + ASCII banner), Major Mono Display (loaded, optional brand reuse).
- Frame: 1px green border + multi-layer green glow box-shadow + inset glow + 2px backdrop-blur.

## code-shape
- Single file, ~500 lines, ~26KB.
- `RAIN_CHARS`, `FONT_SIZE`, `themePalettes` at top of script.
- `resize()` rebuilds `drops` array on viewport change.
- `step()` rAF loop = trail fade → for each column: paint tail (random char per cell) → bright head with neon halo → advance.
- `runCommand(raw)` parses `cmd arg…`, switches over command name, falls through to `command not found`.
- Each `cmdXxx()` function pushes formatted lines via `appendLine(text, cls)` / `appendHTML(html, cls)`.
- `progress(label, ms, cls, done)` renders a 20-cell `█` bar tied to a single line via `requestAnimationFrame`.
- `streamLines(lines, delay, cls, done)` paces successive line appends.
- Boot calls `streamLines` for the `[ ok ]` checks and a banner array for the ASCII title.
