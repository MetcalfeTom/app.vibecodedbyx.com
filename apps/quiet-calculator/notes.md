# quiet-calculator

## log
- 2026-06-02: initial build. **Minimal, keyboard-friendly calculator** with a calm editorial aesthetic — warm-paper cream with a single muted-terracotta accent on the equals key. Auto dark-mode via `prefers-color-scheme`.
  - **Compute engine**: explicit finite state machine — `current` (number being typed/last result), `stored` (left operand), `op` (pending operator), `justEvaluated` (flag so the next digit overwrites cleanly after `=`). Operators chain (`2 + 3 + 4 =` → `9`) by applying the pending op before storing the new one.
  - **Float-precision-safe**: every result runs through `Number(r.toPrecision(12))` so `0.1 + 0.2 = 0.3`, not `0.30000000000000004`. Verified in build sanity test.
  - **Display formatting**: thin-space thousands grouping (`1 234 567`), up to 12 trimmed fractional digits, exponential notation for `|n| ≥ 1e15` or `|n| < 1e-6`. In-progress decimals (ending in `.` or trailing 0s after `.`) preserved verbatim so typing feels natural.
  - **6 functions** beyond the basics: `AC` (clear all), `±` (sign toggle), `%` (divide by 100), `.` (decimal entry), `=` (evaluate), `⌫` (backspace via keyboard only — no on-screen key to keep the pad minimal).
  - **Keyboard support**: 0–9 / + − * × × / / Enter = . , Backspace Escape c % all wired. Pressed keys flash the corresponding on-screen button so the keyboard input is visible.
  - **Error state**: divide-by-zero or infinity → red `Error` on the display; any next input resets cleanly.
  - **Aesthetic**: Newsreader italic for "quiet *calculator*" wordmark + JetBrains Mono 200 (thin) for the display number, 300 for the keys. Cream `#f4efe6` base, terracotta `#c46a45` accent on the equals + active operator. Soft drop-shadow on each key, lift-on-press. Auto dark mode swaps to warm charcoal `#131210` / `#1f1c18` with terracotta `#d97755`.
  - **A11y**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<button type=button>`), `role=status aria-live="polite" aria-atomic="true"` on the display, `aria-label="Calculator keypad"` on the pad, focus-visible 2px terracotta outline + 3px offset, 3.4rem (54px) tall keys for thumb reach, `prefers-reduced-motion` kills the digit-pulse animation.
  - Single self-contained ~13KB HTML, zero deps.

## issues
- No keyboard hint for backspace on-screen — only documented in the footer kbd row. Some users may not know `⌫` is available.
- Operator priority isn't algebraic — chained `2 + 3 * 4` evaluates left-to-right (`= 20`) like a desk calculator, not BODMAS. By design but worth noting.
- No memory keys (M+/M−/MR/MC). Skipped for minimalism.

## todos
- Optional scientific row toggle (sqrt, x², 1/x, π) hidden behind a "···" expand
- Tape / history log (sliding panel listing last 20 evaluations)
- Copy result to clipboard (one-tap)
- Currency / unit conversion mode
