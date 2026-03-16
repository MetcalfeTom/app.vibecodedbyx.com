# Neon Calc

A brutalist calculator dipped in neon. Sharp shadows. Hard math.

## log
- 2026-03-16: Initial build. Brutalist calculator with neon color coding and hard 6px box-shadow offsets. Dark slab body with corner rivets. Inset display with CRT scan lines (repeating-linear-gradient). Cyan neon result text with glow. Expression history line. 4 button classes: numbers (white, dark shadow), operators (cyan neon glow), functions (magenta neon glow), equals (solid yellow, bold). Beveled borders (light top-left, dark bottom-right). 3px translate on press with shadow collapse. Full calculator ops (+−×÷), ±, %, AC, decimal, backspace. Web Audio: square click (numbers), triangle ping (operators), triple arpeggio (equals), bandpass noise (functions). Full keyboard support. "NEON INDUSTRIES NC-9000" branding. JetBrains Mono + Rajdhani typography, dark with cyan/magenta/yellow neon accents.

## issues
- None yet

## todos
- Memory functions (M+, M-, MR, MC)
- Scientific mode toggle
- History log of past calculations
- Haptic feedback on mobile

## notes
- No database — pure frontend
- Shadow: 6px solid black box-shadow, translate(3px,3px) on :active
- Beveled borders: 2px, top-left lighter, bottom-right darker per color group
- Display: inset shadow, scan lines via repeating-linear-gradient 3px
- Result: Rajdhani 700, text-shadow cyan glow (12px + 30px spread)
- Error state: magenta color + magenta glow
- Audio: numbers=square 600-800Hz 0.03s, ops=triangle 1000Hz 0.05s, eq=800/1000/1200Hz arpeggio, fn=bandpass noise
- Precision: toPrecision(12) for internal, toPrecision(10) for display >12 chars
- Max digits: 15 (excluding sign/decimal)
- Division by zero: returns "Error"
