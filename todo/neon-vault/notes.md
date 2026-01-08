# Neon Vault

## log
- 2025-12-29: Initial creation
  - Cybersecurity logic puzzle game
  - Two modes: Crack and Design
  - Crack: Use hints to deduce 4-digit code
  - Design: Create custom code with chosen hints
  - Share challenges via encoded strings
  - 14 different hint types available
  - 4 preset training vaults (Easy to Expert)
  - Keyboard number input supported
  - Sound effects for feedback
  - Attempt counter tracks guesses
  - High-tech hacker interface aesthetic
  - Scanline CRT effect overlay

## issues
- None so far

## todos
- Could add leaderboard for fastest cracks
- Could add timed challenge mode
- Could add more hint types
- Could add difficulty ratings

## notes
### Hint types:
- Code length
- Digit sum
- First/last digit reveal
- Contains specific digit
- Even/odd digit count
- Ascending/descending order
- First > last comparison
- No repeating digits
- Has zero / no zero
- Max/min digit reveal

### Challenge encoding:
- Base64 encoded JSON
- Contains: { code: "XXXX", hints: [...] }
- Can be shared as text string

### Preset difficulties:
- Easy: 1234 (ascending, contains 2)
- Medium: 4826 (sum 20, all even)
- Hard: 7531 (descending, all odd)
- Expert: 9174 (multiple deduction required)
