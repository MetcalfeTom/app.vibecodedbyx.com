# Color Cycler

## log
- 2026-01-05: Initial creation - rapid color cycling with seizure warning

## features
- Mandatory photosensitivity warning screen
- Must acknowledge warning before entering
- Three cycling modes: Rainbow, Random, Strobe
- Adjustable speed (10ms to 500ms per color)
- Color preview strip
- Cycle counter
- Exit button always visible during cycling
- Keyboard controls (Space/Enter to toggle, Escape to stop)

## safety measures
- Warning screen blocks access until acknowledged
- Checkbox confirmation required
- Easy stop button always visible
- Escape key emergency stop
- Controls fade during cycling for visibility

## modes
- Rainbow: Cycles through 24 rainbow colors in order
- Random: Random HSL colors at full saturation
- Strobe: Black and white alternating

## design
- Inter font
- Dark theme
- Glassmorphism controls panel
- Gradient buttons
- Responsive design

## technical
- Pure HTML/CSS/JavaScript
- setInterval for cycling
- HSL colors for random mode
- No external dependencies

## issues
- None yet

## todos
- Add custom color palette option
- Add music sync mode
- Add full screen mode
- Add color history display
