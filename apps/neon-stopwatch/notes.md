# Neon Stopwatch

A clean neon stopwatch. Start. Stop. Lap. That's it.

## log
- 2026-03-16: Initial build. Minimal neon stopwatch with large cyan time display (MM:SS) and dimmer milliseconds below. Circular start/stop and lap/reset buttons. Start=cyan glow, Stop=magenta glow. Lap splits with best (cyan highlight) and worst (magenta) markers when 2+ laps. Scrollable lap list showing split time and total time, newest first. Glow pulse animation while running. Triangle wave beeps on start/stop/lap/reset (880/440/660/330Hz). Keyboard: Space/Enter=start/stop, L=lap/reset. requestAnimationFrame timing with performance.now for accuracy. JetBrains Mono typography, dark with cyan/magenta neon.

## issues
- None yet

## todos
- Countdown timer mode
- Dark/light theme toggle
- Export laps as CSV
- Fullscreen mode

## notes
- No database — pure frontend
- Timing: performance.now() for sub-ms accuracy, elapsed accumulates on stop
- Display: MM:SS main + .000 milliseconds, padStart formatting
- Laps: split = current total - lapStart, array with split+total
- Best/worst: min/max split times, only highlighted when 2+ laps
- Buttons: circular 80-100px, border glow via box-shadow
- Audio: triangle wave beeps, different frequencies per action
- Running animation: text-shadow pulse 1s infinite on time display
