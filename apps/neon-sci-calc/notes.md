# Scientific Calculator

## log
- 2026-03-29: V1 — Dry neon scientific calculator. 40 buttons in 5-column grid. Basic arithmetic, parentheses, power (xʸ). Trig (sin/cos/tan + inverse via 2nd key). log/ln + 10ˣ/eˣ. Square, square root, reciprocal, absolute value, modulo, negate. Constants π and e. RAD/DEG toggle. Memory (MC/MR/M+/M−). Full keyboard input. Expression shown above result. IBM Plex Mono typography, green neon on dark minimal aesthetic.

## features
- Basic: +, −, ×, ÷, parentheses
- Powers: x², √x, xʸ
- Trig: sin, cos, tan (+ inverse via 2nd shift)
- Logarithms: log (base 10), ln (natural)
- Inverse functions: 10ˣ, eˣ (via 2nd shift)
- Constants: π, e
- Utility: 1/x, |x|, ±, %, backspace
- Memory: MC, MR, M+, M−
- RAD/DEG mode toggle
- 2nd/shift key for inverse trig and exponentials
- Full keyboard support (0-9, operators, Enter, Backspace, Escape)
- Expression display above result
- Error handling for invalid expressions

## issues
- None currently

## todos
- Factorial function
- Hyperbolic trig (sinh, cosh, tanh)
- History log of calculations
- Copy result to clipboard
- Hex/Oct/Bin mode

## notes
- Evaluation uses Function constructor with strict validation (only math chars allowed)
- formatNum uses toPrecision(12) to avoid floating point noise
- Shift state resets after one shifted press
- ^ converted to ** for JS evaluation
- Display symbols (×, ÷, −) converted back to JS operators for eval
