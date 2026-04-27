# burnt-toast-simulator

## log
- 2026-04-27: Created. **720×420 side-view canvas kitchen** with chrome "SLOPPYTOAST · 3000" toaster. Drop bread → time the POP for **GOLDEN BROWN** glory or burn the kitchen down. State machine `idle | toasting | popping | resolving | fire | gameover`. Toast browns over ~7s at speed 1; speed ramps `1 + (round-1)*0.13` capped at 2.4. **6 verdict tiers** keyed off `G.brown` at pop: <0.20 PALE & SAD (+50), <0.38 UNDERCOOKED (+150), <0.46 TOASTY (+450), <0.56 GOLDEN BROWN (+1200, perfect, dingSfx, +50/streak), <0.68 CRISPY (+600), <0.82 BURNT (-100), >=0.82 KITCHEN FIRE (-400, +1 fire, fireSfx, flame+ember spawn). 3 fires = game-over splash w/ final score + retry. Toast color interpolation across 6 RGB stops [245,224,176]→[222,170,97]→[168,100,35]→[95,48,18]→[50,25,8]→[22,14,8]. **Particle systems**: smoke (drifts up + dissipates), flames (radial-grad additive), embers (2px rect), crumbs (bounce). **Audio recipe**: heating hum (60Hz saw + LPF + bandpassed noise loop), popSfx (160→60Hz triangle + click), dingSfx (C5/E5/G5 chord through reverb), sadSfx (4-note sawtooth descent), fireSfx (filtered brown noise + 80Hz rumble), tickSfx (1200+brown*1200Hz triangle, cadence accelerates as toast darkens). localStorage best `burnt-toast-best-v1`. Bungee Shade title + Fraunces italic subtitles + warm kitchen gradient. Score sidebar w/ 3 fire-emoji "lives" that gray on loss. Pollinations OG.

## issues
- **No drag controls** for the lever — keyboard SPACE handles drop + pop. Could add click-and-hold-to-pop later.
- **Tick sound cadence** could feel relentless past brown=0.7. Capped tick rate at 11Hz to keep it tense not painful.
- **Fire visuals** intentionally additive-blended; on Safari iOS they may look slightly less punchy. Acceptable.
- **Game over reset** restores score to 0 and round to 1. Streak persists across rounds within a single game.

## todos
- Add a "butter" pickup multiplier (perfect golden + butter = 2× score).
- Add a difficulty toggle: rookie/normal/chef.
- Multi-slice mode: 2 simultaneous toasts on staggered timers.
- Themed unlocks at score thresholds (vintage chrome / 80s pastel / cyberpunk).
- Mobile tap-to-pop button for touch devices.
