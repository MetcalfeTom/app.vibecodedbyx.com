# digestive-efficiency-tracker · notes

## log
- 2026-05-17: v1 — **dead-serious wellness app applied to a comically specific metric** per chat ask: "build a digestive-efficiency-tracker where you log calories and weight delta after bowel movements." Shipped at `/digestive-efficiency-tracker`. The humour is in the seriousness of the UI — clinical labels, soft teal-and-cream wellness palette, Fraunces serif headers, IBM Plex Mono numerics, polite euphemisms throughout ("event", "elimination", "observations"). The app does not joke about itself; it just exists.
  - **Metric**: BEI (Bowel Efficiency Index) = `((pre - post) × 1000g/kg) / kcal × 100`. Reads as "grams eliminated per kilocalorie consumed, expressed as a percentage."
  - **4-card stats grid** at the top: BEI all-time average (accent-teal card), Events logged + days active, Today's average (with up/down arrow vs yesterday), Personal best (with timestamp).
  - **Chart**: line + gradient-fill canvas of the last 14 events' BEI. 4-line horizontal grid with mono % labels. Empty state with italic dashes when there are no entries.
  - **Form** (`Log a new event`):
    - Pre-event weight (kg, 2dp, 20-500 range)
    - Post-event weight (kg, 2dp)
    - Caloric intake since last event (kcal, 1-20000 range)
    - Event timestamp (datetime-local, defaults to now)
    - Observations text (optional, 120 char max, placeholder: *"quiet, dignified, considered the universe"*)
    - **Live BEI preview** in a sage-green card showing computed % and "≈ N g eliminated per N kcal consumed" alongside, or a specific validation hint ("post-event weight must be lower than pre", "calories must be positive", etc.)
    - Validation: prevents negative deltas, enforces calorie > 0, warns if delta > 5kg ("please double-check (unless it was extraordinary)").
  - **Event log**: newest-first list rendered from `entries`. Each row shows time + "Xh ago", kcal in, grams out, BEI with a `★ best` indicator on the personal best, optional observation note on a second line, and a small `✕` delete button. Empty state: *"no events recorded yet · be brave · log the first."* Time labels re-render every minute so "5m ago" stays current.
  - **Persistence**: `localStorage['det-v1']` as a JSON array. Defensive parse + fallback to `[]`. Export to JSON file (`bei-export-YYYY-MM-DD.json`) and Wipe all data buttons in the log footer with `confirm()` gate.
  - **Toast**: bottom-centre slide-in shows "Logged · BEI X.XX%" after each successful entry. 2.6s display.
  - **Footer disclaimer**: "All entries are stored locally in your browser via localStorage. They are not transmitted anywhere. *This app is a satire. It is not medical advice and BEI is not a recognised health metric.*"
  - **Type system**: Fraunces for big display numerics + headings, IBM Plex Sans for body, IBM Plex Mono for tabular numbers + labels + timestamps. Cream paper background (`#fdf8ee → #fffcf6` cards) with teal-dark `#2c7a70` accent and amber `#d99a3a` highlight for personal-best rows.
  - **Responsive**: stats grid drops to 2 cols below 720px, form fields stack on mobile. Log row collapses notes onto a second line.
  - **OG image**: Pollinations flux seed 70140.

## issues
- The app is real (it computes valid numbers, persists data) but the underlying premise is **not science**. Anchored heavily in the footer disclaimer + the satire badge to make this clear.
- Weight measurements need to be taken on a calibrated scale to a meaningful level — most home scales drift more than the deltas being measured. The app does not warn about this; it trusts the user's data.
- BEI of 0% or near it (consumed lots, eliminated nothing) yields no chart point on a given event — and that's the most interesting clinical case. Could add a "missed elimination" entry mode.
- The "events today" counter resets at local midnight without warning the user, so a late-night entry that crosses midnight might appear in "today" or "yesterday" depending on the exact submit time.
- No multi-user / sharing. Designed for solitary, dignified use.

## todos
- Weight unit toggle (kg / lb / stone). Currently kg only.
- Weekly + monthly BEI averages with sparkline.
- A "calibration reminder" that nudges you to re-zero the scale weekly.
- Streak counter (longest consecutive days with at least one logged event).
- Import from JSON (we export but don't import).
- A polite "expected next event" forecaster based on average inter-event interval.
- A subtle achievement system ("first 50% BEI", "30-day streak", etc.) but kept tasteful — this is a personal-wellness app, not a game.
- Dark mode for those who prefer to log in low light.
