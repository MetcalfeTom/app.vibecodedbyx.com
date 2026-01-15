# CRT Calculator

## log
- 2026-01-15: Initial creation
  - Retro console-style calculator
  - Green phosphor CRT display with glow effects
  - Scanline overlay effect
  - Mechanical click sounds for every button:
    - Normal clicks for numbers
    - Higher pitched clicks for operators
    - Satisfying thunk for equals
    - Error beep for clear
  - Vignette and curved screen simulation
  - Power LED with pulse animation
  - Full keyboard support
  - VT323 and Share Tech Mono fonts

## features
- CRT phosphor green display with glow
- Scanline overlay effect
- Screen vignette (curved CRT simulation)
- Mechanical click sounds (Web Audio API)
- Different sounds for different button types
- Button press animations with shadows
- Expression history above result
- Power LED indicator
- Keyboard support (0-9, +, -, *, /, Enter, Escape, Backspace)
- Negate and percent functions
- Error handling for divide by zero

## controls
- Click buttons or use keyboard
- Numbers: 0-9 keys
- Operators: +, -, *, /
- Equals: Enter or =
- Clear: Escape or C
- Backspace: Delete last digit
- Decimal: . key

## todos
- Add memory functions (M+, M-, MR, MC)
- Add scientific mode
- Add history log
- Add screen flicker on error
- Save last result to localStorage

## issues
- None yet
