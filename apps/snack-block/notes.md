# snack-block · notes

## log
- 2026-05-12: Shipped v1. Minimalist craving-killer. Three task categories — CLEANING (tidying / dishes / mirrors / laundry), MINDFUL (breathing / sensory / journaling / drink water), QUICK-BURST (jumping jacks / push-ups / plank / dance). 15 tasks per category = 45 total in the library. Single-button home → tap "I'M CRAVING" → 3-card pick (one random task from EACH category, color-coded mint/lilac/peach) → tap a card → 2-minute circular SVG timer counts down, ring fades from full to empty in the category's accent color → "you got past it" done screen. localStorage wins counter (snackblock-wins-v1) persists across sessions, surfaced in the header as "wins this session · N". Cream paper bg with 3 radial color glows (peach top-left / lilac top-right / mint bottom) + 11° repeating-linear paper grain at multiply. Title: Fraunces 900 "snack-block" with italic peach "block" half + Caveat strap "kill a craving in two minutes flat". CTA button = chunky 999px-rounded peach pill with 3px ink border + 5px ink shadow that shifts to 7px on hover and 1px on press. Cards are 3-column grid (emoji / body / arrow) with category-tinted gradient backgrounds, 18px rounded corners, matching chunky shadow. Doing-state circular timer is a 200×200 SVG with two concentric r=90 circles — bg in paper-dark, fg stroked with stroke-dasharray = 2π×90 ≈ 565.49 and stroke-dashoffset interpolated each tick. Mobile: full responsive single column. Pollinations OG. Fonts: Fraunces + DM Mono + Caveat.

## issues
- The timer uses setInterval(1000) which can drift if the tab backgrounds. For a 2-minute target the drift is negligible, but if chat reports issues we can switch to Date.now() reconciliation.
- "swap all three" only re-rolls all 3 cards at once; no per-category re-roll (could add later if requested).
- Wins counter never decreases — if user clicks "done early" they still get credit. By design (the goal is making it through 2 minutes WITHOUT snacking, not necessarily finishing the task itself).
- No reminders / nudges / notifications — single-session tool.

## todos
- Streak tracker (consecutive days using the app)
- "real hunger check" — a 20-min later notification (web Push) asking if you're still hungry
- Custom-task library — user can add their own to each category
- Share a "I blocked N snacks" social card via the share API
- Optional ambient soundscapes (rain / cafe / forest) during the 2-min timer
