# tetris-deutsch (Tetris Deutsch)

## log
- 2026-06-28: shipped (chat ask: "clean classic Tetris with ghost piece, dark CRT palette, hard drop, German UI text — name it tetris-deutsch").
  - **Engine**: 10×20 grid. 7 tetrominoes as rotation matrices (`SHAPES`), CW rotation via `rotateCW` (transpose+reverse) with a 7-offset wall-kick table (`KICKS`). **7-bag randomizer** (`refillBag` Fisher-Yates) for fair piece distribution. `collides()` checks bounds + locked cells.
  - **Ghost piece**: drops a copy of the current piece down until collision, drawn as a 2px stroked outline in the piece colour (`cellRect(...,ghost=true)`).
  - **Hard drop**: Space — drops to the floor, +2 pts/cell, instant lock. **Soft drop**: ↓ +1 pt/cell. **Lock delay**: 480ms when grounded, reset on move/rotate, capped at 15 resets to prevent stalling.
  - **Scoring**: `[0,40,100,300,1200][n]·(level+1)`; level = `floor(lines/10)`; gravity `max(70, 800-level·68)` ms. Hold piece (C), one swap per drop (`canHold`). Next + Hold mini-canvas previews.
  - **German UI**: `lang="de"`, Punkte/Reihen/Stufe/Nächstes/Halten/Rekord/Steuerung, Spiel starten / Pause / Weiter / Spiel vorbei / Neu starten; line-clear callouts Einfach/Doppel/Dreifach/TETRIS! via aria-live.
  - **CRT aesthetic**: dark phosphor-green palette, scanline `::after` (repeating-linear multiply) + vignette `::before`, neon block highlights/shadows, Press Start 2P title + VT323 body. Best score in localStorage.
  - **Controls**: ← → move, ↑/X rotate, ↓ soft, Space hard, C hold, P pause. Touch button grid on coarse pointers (left/rotate/right, hold/soft/hard, pause).
  - WCAG: role=img on board canvas, role=status aria-live for clears/records, focus-visible on buttons, ≥2.9rem button targets, lang=de.
  - Verified: JS syntax OK; head/og/favicon present.

## issues
- Rotation is simple matrix-rotate + generic kick table (not full SRS) — clean and reliable but T-spins/SRS-exact kicks aren't guaranteed. Fine for "classic".
- No DAS/ARR tuning — relies on browser keydown auto-repeat for held left/right, which can feel slightly steppy. Could add manual DAS later.
- Board canvas is fixed 300×600 scaled by CSS; crisp via image-rendering:pixelated.

## todos
- Manual DAS/ARR for smoother horizontal repeat.
- Line-clear flash/particle animation.
- Supabase highscore leaderboard.
- Optional "Marathon vs Sprint (40 Reihen)" mode.
- Full SRS kick tables for T-spin support.
