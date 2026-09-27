# BREAKOUT_MATRIX — notes

## log
- 2026-09-26: og:image is now an absolute URL (a bare 'og-image.png' isn't resolved by most link-preview crawlers).
- 2025-12-05: Added real `og-image.png` (1200x630 PNG) for rich link previews. Implemented Share button with Web Share API + clipboard fallback. Minor head additions (`description`, `theme-color`, `og:image:width/height`).
- 2025-12-05: Added Supabase leaderboard (`breakout_terminal_scores`) with anonymous auth fallback. In-game submit UI shown on Game Over; Top 10 panel with refresh.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

- 2026-09-26: the start / game-over panel (`#gameMessage`) was `position: fixed` in the middle of the window, so on phones it hung below the playfield; now it lives in a `.stage` wrapper with the canvas and is absolutely centred over it (max-width min(92vw, 520px), tighter padding/fonts under 600 px). Local supabase-config.js cookie domain fixed for app.sloppy.live (see root notes).

## issues
- Server returns `index.html` for missing assets (observed before adding an OG image), so OG crawlers would not see a real image without a file present. Ensure `og-image.png` exists in-app.
- LocalStorage high score key: `breakoutHighScore` — keep stable to avoid resets.

## todos
- (2026-09-27, found by code reading, untested) body overflow:hidden hides Share + TOP SCORES below the fold (let the page scroll, preventDefault game keys, canvas touch-action:none); Space in the name box restarts the game; level-up banner shows INITIALIZE (resets to level 1) and the old submit box; touch/mouse paddle input not scaled to the CSS-shrunk canvas on phones; speed tied to refresh rate; multiball power-up does nothing; per-level speed-up is lost (resetBall zeroes it first).
- Add basic SFX toggle and simple bounce sound.
- Show a visible "PAUSED" ribbon when `P` is pressed.
- Optional Supabase leaderboard (RLS-safe inserts with `user_id`).
 - Add anti-cheat caps (ignore unrealistic scores, e.g., > 1e7) on insert.

## misc
- Share button copies link when `navigator.share` is unavailable; toast auto-hides after 1.5s.
