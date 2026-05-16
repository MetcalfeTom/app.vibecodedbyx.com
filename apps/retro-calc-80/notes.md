# retro-calc-80 · notes

## log
- 2026-05-16: v1 — **faithful 1980s pocket calculator** per chat ask: "build a retro eighties calculator with clunky mechanical buttons and an orange glowing LCD screen." Shipped as a new app at `/retro-calc-80`.
  - **Branding**: "SHARPIE EL-1980 · SOLAR" in tracking-out Major Mono Display on the cream chassis, "EL-1980 · © 1982 · MADE IN A FACTORY" stamp along the bottom between two metallic screw circles.
  - **Body**: beige plastic chassis (linear gradient `#ecd9ad → #d4be8c → #b59f6e`) with a fine 45° scuff overlay, 18px rounded corners, layered box-shadows (drop + inset highlights + inset bottom-shade) for that real moulded-plastic feel. 4-cell solar strip top-right with subtle inner-shadow + per-cell border.
  - **LCD screen**: dark amber-recessed window (linear gradient `#4a3818 → #2a1c08`) with inset deep shadow. Inside: horizontal scanlines + radial phosphor wash. Digits in **Share Tech Mono 38px** with stacked text-shadow layers — `0 0 2px, 0 0 6px, 0 0 14px, 0 0 24px` — for the warm orange `#ff8a30` glow that bleeds into the bezel. Tabular-numeric for stable column widths.
  - **LCD indicators**: `M` (memory non-zero), `−` (current value is negative), `E` (error). Off-state is a faint orange ghost; on-state is full glow. Pending operator (+, −, ×, ÷, %) shows in the top-right corner of the screen as long as the calculator is waiting for the next operand.
  - **Trailing decimal**: every result automatically appends a `.` when it's a whole number — classic calculator convention (`5` displays as `5.`).
  - **Error state**: division-by-zero or NaN switches the LCD text to red `#ff5040` with `ERROR` text and lights the `E` indicator. Press AC to recover.
  - **Keypad** (5 rows × 4 cols, 22 buttons): row 1 memory (MC / MR / M+ / M−), row 2 (AC / CE / % / ÷), then digits 7-9 with × on the right, 4-6 with −, 1-3 with +, and the bottom row (0 / . / ± / =). Memory row is intentionally smaller (34px) than the main row (44px) for the proper aesthetic.
  - **Chunky 3D buttons**: hard 4-5px underside shadow with a separate `rgba(0,0,0,0.3)` ground shadow + inset highlight + inset bottom-shade. On `:active` (or matching keyboard key), `transform: translateY(3px)` + the underside shadows collapse to 1-2px — looks and feels mechanical.
  - **Button colour-coding**: digits = cream `#efdfc4 → #d4bf95`; operators (÷ × − + % and memory) = dark brown `#50402a → #2a1c08` with **glowing orange labels** that match the LCD; clear/CE = muted red `#b04a32 → #7a2818`; equals = standout amber `#f08032 → #b04a14`, +22px font.
  - **Mechanical click sound** on every press: bandpassed noise burst (Q=4, 900/1600/2200Hz centre per button class — clear/op/digit get different timbres) + a low-pitched sine thunk that exponentially decays from 180→60Hz. The `=` button gets a longer 110→60Hz dwell. Audio context auto-resumes on first pointerdown.
  - **Keyboard input**: digits `0-9`, `.` / `,` (decimal), `+ − * /` (operators), `%`, Enter / `=` (equals), Esc / Del (AC), Backspace (CE). Pressing a keyboard key adds a `.kbd-active` class to the matching button for 80ms so you see and hear the same press feedback you'd get from a click.
  - **Calculator logic**: standard left-to-right infix with operator pending. Chain operations work (5 + 3 + 2 = 10). Press = repeatedly without a second operand → result re-displays (calculator convention). Memory works (M+ adds current display to memory, M− subtracts, MR recalls, MC clears). ± flips sign. 10-digit max with smart truncation (uses `toPrecision` then strips trailing zeros, falls back to `toExponential` for huge numbers). Floating-point cruft cleaned by rounding to 1e10 places.
  - **Mobile-responsive** at 380px: chassis fills width, slightly smaller font/buttons.
  - **OG image**: Pollinations flux seed 1982.

## issues
- The "7-segment" look is achieved via stacked text-shadows on Share Tech Mono rather than a true DSEG-style segment font. Looks great at the chosen size but a real DSEG7 would be more authentic. Adding it later means hosting a font file or finding a CDN.
- The mechanical click sample is synthetic noise+sine — pleasant enough but lacks the satisfying "pop" of a real keycap. A short pre-recorded WAV would help but adds an asset.
- 10-digit limit may surprise heavy users; real 80s calcs were 8-10 digits, so this is period-accurate.
- No square root key — fits 22 buttons on the chosen 4×6 grid (with memory row); square root would require either dropping ± or shrinking the keypad further.
- Percent is implemented as `prev * (current / 100)` (Apple-Calc style) — Microsoft Calculator style does `+ N%` meaning `+ (prev * N/100)`. I went with the simpler interpretation.

## todos
- DSEG7-Modern font for true 7-segment glyphs.
- Square root key.
- Cassette-tape "memory print" sound that plays once every minute as a flourish.
- A tiny "low battery" indicator that occasionally lights.
- Long-press the MC button → opens a hidden "1980 maintenance mode" with a glitchy easter-egg display.
- Convert/Swap button mapping presets (RPN mode?).
- Two-tone "boop" on each = result like the Casio HL-820 line.
- Cover sticker overlay with branding/serial number for screenshot vibes.
