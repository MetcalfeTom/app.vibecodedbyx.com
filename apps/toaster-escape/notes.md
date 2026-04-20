# Toaster Escape

## log
- 2026-04-20: Created. Panic-toast dodge game. Player is a slice of bread with crust body, eyes, arms, legs; runs along a checkered kitchen floor below a retro GRUMBL toaster with pulsing slot glow. Butter pats (yellow with ridge lines + label) and jam blobs (irregular gooey circle with seed specks + drip tail) fall from top at increasing speed/rate. Coffee cup pickups (☕ steam + handle) award +150 pts. Controls: ←/→ run, ↑ hop, Z dash (1.6s CD + 0.18s i-frames), P pause. Lives = 3; each hit triggers splatter particles + screen shake + 100-frame i-frames. Near-misses award +15 score and flash "CLOSE!". Difficulty ramps every 8s (faster falls, faster spawn, chance of double-drop past diff 2.5). High score in localStorage as `toasterEscapeBest`. Web Audio synth SFX: hop (layered square beep), dash (ascending saw sweep), hit (descending saw), coffee (three-step arp), game over (4-note descending). Rubik Mono One + Fraunces + Fredoka + JetBrains Mono typography, toast/butter/jam palette with warm kitchen gradient background, subtle checker floor, sun blob parallax.

## issues
- Difficulty ramp is tuned by feel — may need to nerf double-drop past 2.5.
- Dash i-frames are generous (22 frames); might make dash too safe.
- Jam wobble (35% chance on spawn) combined with drift can occasionally corner the player — intentional but tune if unfair.

## todos
- Additional hazards: syrup pools on floor that slow the player, bagel crumbs that stack, rogue knife that slices horizontally.
- Power-ups: invincibility "crust shield" (brief no-hit), magnet coffee (pull coffee toward you).
- Daily seed leaderboard via Supabase.
- Background music — chill lo-fi breakfast loop.
- Combo scoring for consecutive near-misses without hits.

## design
- Palette: toast #d89c5b, toast-deep #9c6935, butter #ffd85e, butter-deep #caa32f, jam #b32e4d, jam-deep #7a1c34, crust #5c3416, cream #fff3d6, coffee #3a1a12, sky #ffd1a4, floor #b37144.
- Fonts: Rubik Mono One (title + callouts), Fraunces (tagline), Fredoka (UI), JetBrains Mono (HUD chips).
- Frame has a pulsing red "ready" LED top-right.
- Toaster brand: "GRUMBL" in Rubik Mono on a cream strip.
