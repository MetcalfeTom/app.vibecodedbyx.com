# BREAKOUT_MATRIX — notes

## log
- 2025-12-05: Added real `og-image.png` (1200x630 PNG) for rich link previews. Implemented Share button with Web Share API + clipboard fallback. Minor head additions (`description`, `theme-color`, `og:image:width/height`).
- 2025-12-05: Added Supabase leaderboard (`breakout_terminal_scores`) with anonymous auth fallback. In-game submit UI shown on Game Over; Top 10 panel with refresh.

## issues
- Server returns `index.html` for missing assets (observed before adding an OG image), so OG crawlers would not see a real image without a file present. Ensure `og-image.png` exists in-app.
- LocalStorage high score key: `breakoutHighScore` — keep stable to avoid resets.

## todos
- Add basic SFX toggle and simple bounce sound.
- Show a visible "PAUSED" ribbon when `P` is pressed.
- Optional Supabase leaderboard (RLS-safe inserts with `user_id`).
 - Add anti-cheat caps (ignore unrealistic scores, e.g., > 1e7) on insert.

## misc
- Share button copies link when `navigator.share` is unavailable; toast auto-hides after 1.5s.
