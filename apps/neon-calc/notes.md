# Neon Calc

Sleek neon calculator with glowing buttons and calculation history.

## log
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
