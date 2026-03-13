# Neon Desk

Mini desktop environment with neon-lit draggable icons and floating windows.

## log
- 2026-03-13: Initial build. Full desktop metaphor with 8 draggable icons, window management (drag, resize, minimize, maximize, close, focus), taskbar with items + clock, start menu. Apps: Terminal (8 commands: help, date, whoami, ls, clear, cowsay, matrix, uptime), Notepad (textarea), Calculator (4-function with display), Clock (live time/date), Files (mock directory listing), About, Theme Colors (6 accent presets), Beats (8-step sequencer with Web Audio beeps). Cyberpunk grid wallpaper. Orbitron + Share Tech Mono typography, dark navy with cyan/magenta/green neon accents.

## issues
- None yet

## todos
- Persist window positions in localStorage
- Drag-to-desktop file creation
- Window snap to edges
- More terminal commands
- System tray with notifications

## notes
- No database — pure frontend
- Window z-index increments on focus
- Icons are draggable on desktop
- Duplicate prevention: most apps only open once (except terminal/notepad)
- Calculator state tracked per window ID
- Beats sequencer uses AudioContext square wave oscillator
- Touch events supported for mobile window dragging
