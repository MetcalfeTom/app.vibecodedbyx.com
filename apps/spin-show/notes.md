# Spin Show

angienimo's (Angie) two-wheel game show. 🎮 Game Wheel lands on a real game from the catalogue (card with screenshot + PLAY). 🎪 Quirky Wheel is a BONUS wheel (Angie: "not really punishment but extra stuff"): coins, jackpot, trophies, disco, pet rock, rubber duck, hats, fortune cookie, sneeze, spin again, and at most ONE bad slice (Bankrupt-ish, takes half, funny + recoverable).

## log
- 2026-10-14 11:50 v1.0 first playable (Angie's ask at 11:27 "spin a wheel of games", 11:32-11:35 quirky wheel, trophies, two wheels). One file, no database. Canvas wheel face drawn once to an offscreen canvas and blitted rotated; rAF only runs while spinning/dragging/flapper moving (no idle loop). Bulbs are 24 CSS spans with a chase animation (delay per bulb), .spinning speeds it up, .won blinks all, .jackpot rainbows. Flick: pointer drag rotates the wheel, release angular velocity sets turns + duration (easeOutQuart initial speed ~ flick speed). Landing = easeOutQuart to target+overshoot then damped cos settle back (sometimes rolls back over a peg = drama). Winner is decided by the final angle (idxAt), never separately. Ticker under each wheel shows the slice under the pointer live. Pegs tick (noise burst + triangle blip, throttled 35 ms) and kick the SVG flapper.
  - Game pools: ⭐ Best (hand-picked real games, FAV in the baked block) default, 🎮 All (genre 'games' from /app-directory/index.json + FAV). Emoji per game baked from each app's emojicdn favicon (bake.py in the helper scratch); name = title before ' — ', ' · ', ': '.
  - Progress in localStorage 'spinshow.v1': coins, spins, trophies [{id,e,n,at}], rocks, ducks, hats, pool, muted. Achievement trophies (ACH) toast + shelf; TROPHY slice gives a random quirky trophy with a spotlight dialog.
  - Phones: the two wheels sit in a horizontal scroll-snap strip (swipe or tabs); desktop >=900px side by side.
- 2026-10-14 12:03 v1.1 quirky trophy art + goose + near-miss (Angie 11:37 + main's two small things). Every trophy is its own hand-drawn inline SVG (ART(id,name,emoji) in the script: thick ink outline, flat fills, shine, engraved plinth; one shared <filter id="wob"> feTurbulence+displacement gives the wobble). Spotlight dialog wiggles the trophy in. Goose slice: a goose waddles off with half your coins (max 30); tap it in time = coins back + 5 + honk; 3 catches = 'Deeply Offended Goose'. Near-miss tease: when JACKPOT neighbours the landing slice the wheel eases to the jackpot edge, teeters ~1.1 s with peg ticks, then tips over (the landing is still chosen first, the tease only changes the path). Real jackpot: rainbow bulbs, screen shake, coin rain, flash (no shake/flash with reduced motion). og.png = desktop headless shot cropped to 1200x630.

## issues
- Headless test browser has no colour emoji font: helper's run.sh points FONTCONFIG_FILE at a fonts.conf with twemoji.ttf so screenshots show emoji.

- Shared headless lock: a background `cd dir && python3 -m http.server &` makes $! the subshell, so kill misses the server and the server keeps the inherited flock fd = lock held forever. run.sh now uses `--directory` so $! is python itself.
- 🪿 (Unicode 15) is tofu on the headless twemoji font and on older Windows 10 / Android; the goose art is SVG elsewhere.

## todos
- Coin shop: spend coins on wheel skins / shelf trinkets
- More quirks: slow-mo next spin, upside-down wheel, double or nothing, mystery box
