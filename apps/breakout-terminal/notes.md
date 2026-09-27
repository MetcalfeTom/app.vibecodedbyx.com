# BREAKOUT_MATRIX — notes

## log
- 2026-09-27: SOUND. Synth bleeps via WebAudio, no files: paddle, wall tick, brick hit, brick break (climbs a semitone per brick broken before the ball returns to the paddle: `combo`, reset on launch and paddle hit), launch, power-up arpeggio, life lost, level-up arpeggio, game-over fall. SOUND: ON/OFF button next to Share + M key (ignored while typing a name), saved as localStorage `breakoutSound`. Headless: 9 oscillators in 4 s of play, 0 while muted, 0 errors.
- 2026-09-27: bug pass (the code-review list, now tested headless 18/18 at 1280×800 and 390×760; the old file fails 11 of them). The page scrolls again (body was overflow:hidden, so Share and TOP SCORES were cut off on short screens; container uses margin:auto 0 to stay centred when it fits; canvas touch-action:none). Keys typed in the name box are ignored by the game (Space used to restart and lose the form). The LEVEL N banner has a `banner` class that hides INITIALIZE and the old score form, and its timer (`msgTimer`) is cleared by gameOver/startGame so it can't hide the game over panel. startGame hides the form and blurs the focused button. Mouse/touch paddle input scales by canvas.width / rect.width (phones moved the paddle at ~0.6×). Submit: nothing for score 0, button disabled after a save until the next game over (one row per game). Lives show 5 before the first game.
- 2026-09-26: og:image is now an absolute URL (a bare 'og-image.png' isn't resolved by most link-preview crawlers).
- 2025-12-05: Added real `og-image.png` (1200x630 PNG) for rich link previews. Implemented Share button with Web Share API + clipboard fallback. Minor head additions (`description`, `theme-color`, `og:image:width/height`).
- 2025-12-05: Added Supabase leaderboard (`breakout_terminal_scores`) with anonymous auth fallback. In-game submit UI shown on Game Over; Top 10 panel with refresh.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

- 2026-09-26: the start / game-over panel (`#gameMessage`) was `position: fixed` in the middle of the window, so on phones it hung below the playfield; now it lives in a `.stage` wrapper with the canvas and is absolutely centred over it (max-width min(92vw, 520px), tighter padding/fonts under 600 px). Local supabase-config.js cookie domain fixed for app.sloppy.live (see root notes).

## issues
- Server returns `index.html` for missing assets (observed before adding an OG image), so OG crawlers would not see a real image without a file present. Ensure `og-image.png` exists in-app.
- LocalStorage high score key: `breakoutHighScore` — keep stable to avoid resets.

## todos
- Optional Supabase leaderboard (RLS-safe inserts with `user_id`).
 - Add anti-cheat caps (ignore unrealistic scores, e.g., > 1e7) on insert.

## misc
- Share button copies link when `navigator.share` is unavailable; toast auto-hides after 1.5s.
