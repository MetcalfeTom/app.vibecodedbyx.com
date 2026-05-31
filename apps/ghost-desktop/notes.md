# ghost-desktop · notes

## log
- 2026-05-13: Shipped v1. Per chat: "1995 operating system with haunted windows." Full fake Win95 with classic chrome — teal `#008080` desktop, `#c0c0c0` silver windows with proper 2-tone bevel borders (light top/left + dark bottom/right + inset shadow tokens for the chunky raised/inset 3D look), navy `#000080`→azure `#1084d0` linear-gradient title bars with white Silkscreen 700 text, single-character X/_ control buttons that depress on :active, classic File/Edit/View/Help menu bar with underlined hotkeys, status bar at bottom. Body text in VT323 monospace, all UI in Silkscreen 7-9px for that pixel-true MS Sans Serif feel. CRT scanlines via `repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 3px)` at multiply blend + outer-vignette radial overlay for the curved-tube feel. **Apps** (5 built):
  - **README.HAUNTED.TXT** (Notepad) — contenteditable inset div, default text "welcome to ghost os 95...", phantom typing pulls from a 12-entry pool of ghost messages ("help me", "we are still here", "13:66:66", "the cursor watches", "do NOT close this file", "i was here in 1995", "ERROR: SOUL.DLL not found", etc.) appending 80-160ms-per-char with a `.ghost-text` italic blue-purple span style.
  - **My Computer** — 8-tile file grid (3½ Floppy A:, C:\ DOS, D:\ DATA, GHOST:\ ??, My Documents, Control Panel, Printers, Dial-Up). Double-click any drive triggers "Access Denied — currently being haunted" dialog.
  - **Recycle Bin** — 6 files with line-through text (yourself.exe, 1995.bak, ghost.dll, do_not_open.txt, screams\, passwords.txt). "Empty Bin" button shows "The bin cannot be emptied. The contents have made it their home."
  - **Minesweeper** — 8×8 grid, 10 mines, classic LED-red counter + reset-face + LED-red timer, proper neighbour-flood reveal, colored numbers (n1=blue, n2=green, n3=red, etc.). **Haunted twist**: 18% chance per click the mines rearrange themselves (preserving the clicked cell as safe), so bombs are "never where you thought." Whisper sound plays when they shift. Win = "You won. But the mines kept moving." Loss = "they were never where you thought they were."
  - **System Properties** — Ghost OS 95 Plus!, GhostPentium III @ 666 MHz, 13 MB RAM (∞ used), Disk C:\ 666GB/666GB, GHOST:\ ?? GB, SoundBlaster Spectral 16, 640×480 256 colors, 14.4kbps dial-up WAILING, live uptime counter ("Haunted for H:MM:SS").
**Window management**: pointer-based drag from title bar (setPointerCapture-style with pointermove window listener), z-counter increments on focus + `.inactive` class greys non-active title bars, close/min/restore via taskbar buttons. Taskbar shows one button per open app with title + icon, active button gets diagonal hatch background + pressed border. **Start menu**: vertical "GHOST OS 95" Silkscreen banner rotated 180° on the left, 7 items (Notepad/My Computer/Minesweeper/System/Recycle + divider + Exorcise/Shut Down). Exorcise pauses all hauntings for 45 seconds. Shut Down triggers the BSOD instantly. **Hauntings** (auto-scheduled via 800ms tick):
  - Window jitter (`@keyframes winShake` 0.32s ±4px ±2°) on a random open window every 8-22s, with 40% chance of also sliding it ±60×±40px
  - Ghost drift: 👻/🕯/🪦/💀/🦇/🕸 emoji floats from -3rem off-screen-left to 110vw over 7s with blue glow + sin-arc y-offset, fires every 9-21s
  - BSOD: every 60-100s the screen goes navy with white Silkscreen "Ghost OS" inset header and a 5-line fake error ("A ghost has performed an illegal operation in module GHOST.SYS at 0x6:DEAD..."), 4s auto-dismiss or click/key to close, accompanied by 400ms filtered noise burst + 800→80Hz sawtooth sweep
  - Phantom typing in Notepad every 7-17s
  - Clock haunting every 40-70s: clock display reads 13:66:66 AM / ??:??:?? / 03:33:33 AM / 00:00:00 ?? / 99:99:99 for 3-5 seconds
  - Cursor trail: pointermove drops · • ◦ characters in ghost-cyan that fade upward over 720ms (18% chance per movement, throttled 80ms)
**Audio** (Web Audio synth, mute toggle in system tray): pop (880→440Hz square 80ms) for window open, tap (1200Hz square 30ms) for clicks/phantom typing, whisper (600ms bandpass-noise loop with 5Hz frequency LFO ±200Hz at 900Hz Q=4) for jitter/ghost drift, BSOD audio (400ms lowpass-swept noise + 800→80Hz saw), startup chime (4-note triangle arpeggio G-C-E-G). **Boot sequence**: black screen with green-on-black CRT text typing 9 lines ("GhostBIOS v6.66 © 1995-2026", "Memory test: 13 MB OK", "Detecting ghosts......... 7 found", "Mounting drive GHOST:\\ ... WARNING (corrupted)", etc.) at 180-300ms per line, then fades to desktop and auto-opens Notepad after 2.3s. **Accessibility**: rem-based sizing, ≥4.5:1 contrast on title bars and body text, semantic `<button>` elements for all interactive controls, `role="menu"` + `aria-haspopup` on start, `aria-hidden` toggling on hidden overlays, focus-visible dotted outlines (the period-accurate way), 44px+ touch targets in mobile breakpoint, prefers-reduced-motion kills shake/drift/trail animations + transitions. Pollinations OG (seed 666). Fonts: VT323 + Silkscreen + Special Elite + system Tahoma fallback.

## issues
- The Win95 chrome uses border-color + double box-shadow inset tricks to fake the 4-pixel bevel — looks great on most browsers but rendering varies slightly in Firefox vs Chromium-based. Acceptable.
- Phantom typing appends `<span class="ghost-text">` nodes for each char so the notepad accumulates a lot of DOM over a long session. State persists across opens via `state.notepadText`. Could trim if it gets long, but the file IS supposed to feel haunted.
- BSOD doesn't actually freeze interaction (still drag/click during the 4s). Felt right for sandbox vibes — proper "you must click OK" would frustrate.
- Minesweeper bombs only rearrange on first-click of a session occasionally (18% per reveal), so sometimes a game feels regular. Tune up to 30% if chat wants more chaos.
- Cursor trail relies on pointermove which fires on mouse only on desktop; on touch devices the trail won't appear unless the user drags. Intentional — trail is visual flavor.
- Exorcise pauses ALL hauntings (clock, ghosts, BSOD, jitter, phantom typing, cursor trail) for 45s. After that the schedule resets and they resume normally.
- Some emoji (🖴 disk-pack) may not render on all OSes — fallback to text glyph is acceptable.

## todos
- Sticky-note app where each note is from a different ghost (deceased programmer, lost employee, etc.)
- Solitaire (real implementation, with the cards occasionally flying off)
- Internet Explorer 1.0 with one fake page (geocities-style)
- Paint with a ghost cursor that draws when you don't
- "Properties" dialog when you right-click an icon
- Multi-user login screen at boot with deceased usernames
- Background drag to do a "marquee select"
- Wallpaper picker with bleeding/eldritch options
