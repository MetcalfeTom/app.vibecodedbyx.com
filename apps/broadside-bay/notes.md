# Broadside Bay

Top-down pirate ship battle. Steer a galleon around a 1800x1200 sea and sink enemy vessels with port/starboard broadsides.

## log
- 2026-04-09: Initial build. Single-file canvas game at 720x480 internal resolution, CSS-scaled to fit stage. World is 1800x1200 with camera following the player. Ship physics: angle + velocity + water drag (0.97 damping), bow-thrust acceleration, max-speed clamp, soft world-bounds bounce, rock collisions that deal hull damage proportional to impact speed. Player controls: W/Up thrust, S/Down reverse, A/D or ←/→ turn, Q port broadside, E starboard, SPACE both. Each broadside fires 3 cannons from the relevant side with slight scatter, spawning muzzle flash + smoke particles and applying recoil to the ship. Reload is 130 frames per side with HUD gauges. Three enemy tiers (sloop/brig/frigate) with escalating hp/speed/reload; AI steers to keep the player perpendicular to its bow, fires when aligned within ~20°. Waves: `2 + 0.8*wave` ships per wave, tier rolls up with wave number. Collision model uses circle approximations for ships and balls. Visuals: canvas-drawn pirate galleon with hull, billowing sail (player has skull crossbones on parchment sail), deck, plank lines, cannon ports, gold trim; wave grid with parallax + glint streaks; rocks with foam rings; decorative barrels/planks that drift. HUD: hull/sunk/score/wave top bar, minimap top-right, port/starboard reload gauges bottom-left. Mobile: d-pad + PORT/STAR fire buttons bottom overlay with pointer events. Audio: minimal WebAudio square-wave boom for cannon/hit/sink/hurt (unlocked on first button press). Pirata One + IM Fell DW Pica + Special Elite typography, deep navy + parchment + blood-red + gold palette.

## features
- 3 enemy ship tiers with distinct stats and sprites
- Wave-based progression with scaling tier rolls
- Port/starboard broadsides with independent reload timers
- Ship AI that maneuvers for broadside alignment
- Rock hazards that damage on collision
- Minimap + reload gauges HUD
- Mobile d-pad + fire button overlay
- WebAudio sound effects
- Wake particle trails + muzzle flash + smoke + wood splinters

## issues
- Collision model uses circle approximations — grazes and rear hits can feel slightly off vs. sprite silhouette
- No persistence yet (no leaderboard)
- AI doesn't avoid rocks; can beach itself

## todos
- Supabase leaderboard for high scores
- Boss ship every 5 waves (ship of the line)
- Power-ups: chain shot (disable sails), grape shot (short range wide spread), repair kit
- Storm weather event with lightning and reduced visibility
- Rock avoidance in AI
- Add an OG preview PNG
