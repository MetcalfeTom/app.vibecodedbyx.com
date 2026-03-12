# Pass Forge

Generate strong passwords instantly with toggleable character sets and adjustable length.

## log
- 2026-03-12: Initial build. crypto.getRandomValues for secure generation, 4 toggleable char sets (upper/lower/digits/symbols), length slider 8-64, strength meter (entropy bits), color-coded password display, copy to clipboard. Instrument Serif + Azeret Mono typography, cyan/purple on dark palette.

## issues
- None yet

## todos
- Could add exclude ambiguous chars option (0/O, l/1)
- Passphrase mode (word-based)

## notes
- No database — pure frontend, zero tracking
- Uses Web Crypto API (crypto.getRandomValues) for secure randomness
- Guarantees at least one char from each active set when length allows
- Strength calculated as entropy bits = length * log2(pool_size)
