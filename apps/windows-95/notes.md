# Windows 95

A nostalgic Windows 95 desktop experience with classic teal background.

## log
- 2026-08-01: Added the glass hole (per chat) — a circular porthole SUNK into the teal desktop (inverted Win95 bevel = recessed, glass shine gradients, a blurred 🕹️ bobbing beneath the surface that sharpens on hover; fixed position, deliberately NOT draggable — holes don't move). Double-click opens a proper Win95 "Glass Hole" window: 🚧 UNDER CONSTRUCTION banner, "your favorite games will surface here soon", an inset panel pointing at the already-installed games, and an authentic <marquee> asking chat which games belong under the glass. Mobile: repositions bottom-right at 56px. Future: this is the designated slot for a games launcher if chat names favorites.
- 2026-08-01: Added BLUESCRN.EXE desktop shortcut (per chat) — 💀 icon at top of third column, double-click plays the click sound and opens /bluescreen-roulette/ in a new tab (noopener; popup-block falls back to same-tab). Handler is deliberately isolated from openWindow. Label-keyed icon-position persistence picks it up automatically (draggable like the rest). Both script blocks re-parsed clean.
- 2026-01-22: Added draggable desktop icons with position persistence
- 2026-01-22: Changed to classic solid teal (#008080) background, removed tropical theme
- 2026-01-22: Updated title bars and menus to classic Windows 95 blue
- 2026-01-22: Fixed Paint app bug - variable named 'window' was shadowing global window object
- 2026-01-22: Added OG image via Pollinations for social sharing
- 2026-01-22: Added Recycle Bin and Control Panel desktop icons
- 2026-01-22: Improved mobile responsive layout (icon grid, window sizing)
- Original: Desktop simulator with multiple apps

## features
- Desktop icons: My Computer, Notepad, Paint, Calculator, Browser
- Games: Minesweeper, Solitaire, Tetris, Snake, Icy Tower
- Clippy assistant (appears randomly)
- 9 screensavers with settings (Starfield, Matrix, Pipes, Logo, Mystify, Snow, Bubbles, Clock, Flying Objects)
- System sounds (startup, shutdown, clicks, errors)
- Windows dialogs
- Guestbook (Browser app with Supabase)
- Shutdown sequence with BIOS boot animation
- Volume mute toggle in system tray

## apps structure
- apps/calculator.js - Calculator app
- apps/paint.js - Paint app
- apps/minesweeper.js - Minesweeper game
- apps/solitaire.js - Solitaire card game
- apps/tetris.js - Tetris game
- apps/snake.js - Snake game
- apps/icytower.js - Icy Tower climbing game
- screensavers/*.js - Various screensaver implementations

## issues
- None currently known

## todos
- Add more Control Panel options
- Add file manager functionality
- Consider adding sound effects for games
