# Windows 95

A nostalgic Windows 95 desktop experience with classic teal background.

## log
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
