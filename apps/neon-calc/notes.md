# Neon Calc

Cyberpunk minimalist scientific calculator. Pink + electric blue glassmorphism, hand-written recursive-descent expression parser, no history log.

## log
- 2026-05-12: **Rewrite — cyberpunk minimal scientific calc + glassmorphism**. Chat ask bundle: "create a cyberpunk neon calculator with a glowing pink and electric blue glassmorphism UI" + "make it minimalist with no history log" + "keep the interface focused and sharp with that neon glow" + earlier "high-performance neon calculator with advanced math functions". Dropped the old 4-function calc + history sidebar entirely. New design: single centered glass card with 28px border radius, 32px backdrop-filter blur saturate(180%), inset top highlight + bottom shadow rims, bottom-edge pink→blue gradient line, soft pink+blue inset glow. Cosmic radial-gradient bg with slow 30s nebula drift behind, 1px scanline overlay at mix-blend overlay for grain. Two-tone palette only — pink (#ff3aaf, #ff7ad2) + electric blue (#06f6ff, #6efaff) + ink white. DEG/RAD toggle pill + memory readout in top row. Display: black inset frame, Share Tech Mono prev expression, Orbitron 700 cur result in cyan with 14/30px shadow text-glow, magenta error variant, blinking caret. **Expression parser** (recursive descent, hand-written) — numbers (incl scientific notation), constants (π/pi/e), binary + − × ÷ ^ %, unary ± , postfix factorial, parens, implicit × via '·', and functions sin/cos/tan/asin/acos/atan (DEG or RAD), log/ln/sqrt/cbrt/abs/exp + variadic min/max/pow. Buttons: 6-row × 5-col grid covering memory (MC/MR/M+/M−) + AC + clear, trig + parens, inverse trig + x² + ⌫, log/ln/√/∛/xʸ, eˣ/10ˣ/1÷x/π/e, numeric pad + ÷/×/−/+ + ±/%/x!/ANS/=. ANS recalls last result with implicit ×. = sweeps a flashy pink→blue gradient. Each btn has glassmorphism inset top/bottom highlights, 4px outer shadow, color-coded hover-glow (cyan for fn, pink for op/mem, pink-soft for clear). Pressed state scales down and glows in currentColor. Keyboard: 0-9, +−×÷^%(), Enter/=, Backspace, Esc clears, ! factorial, P inserts π. Mobile-responsive (single column, btn shrinks <380px). prefers-reduced-motion disables drift + caret blink. 31 buttons total. No localStorage, no history, no clutter.
- 2026-03-22: Initial build. Standard 4-function calculator with ±, %, backspace. Keyboard support (0-9, +-*/, Enter, Esc, Backspace). Color-coded buttons: numbers (neutral), operators (teal glow), equals (pink), functions (blue), clear (orange). History sidebar shows last 50 calculations, click to reuse result. History persisted to localStorage. Responsive: sidebar stacks below on mobile. Chakra Petch + IBM Plex Mono typography, dark neon aesthetic.

## issues
- None yet

## todos
- Scientific mode (sin, cos, sqrt, pow)
- Keyboard shortcut hints
- Copy result on click

## notes
- No database — pure frontend, localStorage only
- Key: neon-calc-hist
- History capped at 50 entries
- Chained operations evaluate left-to-right
- Division by zero returns "Error"
- Decimal precision capped at 10 digits, trailing zeros stripped
- Font size auto-scales for long numbers (>8 chars: 28px, >12: 22px)
