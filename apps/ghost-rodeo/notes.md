# Ghost Rodeo

## log
- 2026-04-21: Created. Neon arcade dodge/catch game. Player is a magenta-hatted ghost cowboy drifting across a synthwave arena (perspective pink grid + cyan vanishing-point spokes + distant star dots). Two threats: **lightning horses** spawn from side edges with a 0.9s telegraphed pink strobe line + yellow arrow → charge straight across at 360–560 px/s (scaled by storm), leaving a cyan afterimage tail and firing cyan-glow lightning bolts as they run. **Static shadows** are flickering violet orbs with noisy jagged outlines and tiny glowing eyes that fade out in 5–7s if uncollected. Catch via touch contact (+15) or Space lasso that auto-homes to the nearest shadow within 280px (+25), wavy yellow rope with a glowing loop at the tip. 3-spirit HP; Shift = phase dash with 0.35s i-frames and 1s cooldown + cyan/magenta burst. Combo meter stacks up to ×6, decays after 2.6s. Storm multiplier ramps over time and with caught shadows (1.0× → 3.2×), driving horse spawn rate + speed. HUD: neon Monoton title + pill-style stats. Web Audio synth SFX (lasso whoosh, catch bell triad, dash sawtooth, hit noise burst, horse hoof gallop, descending game-over motif) through a tiny convolution reverb bus. Best score in localStorage. Monoton + Rubik Mono One + VT323 fonts, magenta/cyan/yellow/violet palette on deep navy-black bg with radial glows. Mobile: tap-and-drag to drift toward finger, double-tap to dash.
- Pollinations OG image.

## features
- Telegraph → charge horse pattern (readable dodging, no cheap deaths)
- Auto-aim lasso toward nearest in-range shadow; falls back to facing direction
- Combo multiplier with toast flashes
- Storm ramp difficulty scales spawn rate, shadow frequency, horse speed
- Dash with i-frames + particle burst + cooldown bar
- Ghost trail + horse tail + lightning bolts for motion feel
- Keyboard + touch control parity

## issues
- Horses can sometimes spawn very close together if storm is high; can feel unfair but works as chaos flavor.
- Shadow spawn avoids the ghost at start; on small screens this can briefly stall spawns — OK because shadows overlap naturally.
- Lasso is limited to in-range (280px) targets; if none, it goes into the void harmlessly.

## todos
- Power-ups: slow-mo shadow, bonus multiplier for consecutive lasso catches
- Boss: giant lightning bronco charging in S-curve
- Leaderboard via Supabase
- Alt ghost skins unlocked by score thresholds
- Rope-swing lateral movement when lasso connects
