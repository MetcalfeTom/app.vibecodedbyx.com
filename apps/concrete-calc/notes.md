# Concrete Calculator

A brutalist calculator forged from concrete and steel. Math has never been this heavy.

## log
- 2026-03-15: Initial build. Brutalist industrial calculator with concrete/steel aesthetic. SVG feTurbulence noise textures for concrete body and background. Metal text effect on display via background-clip gradient (white→gray→dark→highlight). Massive grey buttons with multi-layer box-shadow depth (3px pressed offset), beveled borders (light top-left, dark bottom-right), linear gradient faces. 4 corner rivets with inset cross detail. Header with "CONCRETE INDUSTRIES MODEL CI-7400" branding. Footer with fake serial number and voltage rating. Standard calculator ops (+−×÷), ±, %, AC, decimal, backspace. Expression history line above result. Keyboard support (0-9, operators, Enter, Escape, Backspace). Web Audio: heavy mechanical clicks (filtered noise bursts at varying pitch), low thunk on equals/clear. IBM Plex Mono + Inter Tight 900 typography, all-grey monochrome palette with copper-tinted operator text.

## issues
- None yet

## todos
- Memory functions (M+, M-, MR, MC)
- Scientific mode (sin, cos, sqrt, pow)
- Paper tape printout animation
- Haptic feedback on mobile

## notes
- No database — pure frontend
- Concrete texture: SVG feTurbulence (baseFrequency 0.65-0.8, 4-5 octaves) as background-image
- Metal text: linear-gradient background-clip with 4-stop gray gradient + drop-shadow filter
- Button depth: 3px box-shadow offset, translateY(2px) on :active, inset shadow swap
- Rivets: radial gradient circles with pseudo-element cross marks
- Audio: noise buffer clicks (0.06s, lowpass filtered), sine thunk (60Hz, 0.12s decay)
- Max display: 15 chars, auto-shrink at 8+ and 12+ chars
- Division by zero: shows "ERROR"
- Precision: toPrecision(10) for long results
