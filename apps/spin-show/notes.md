# Spin Show

angienimo's (Angie) game show. Tabs: 🎮 Game · 🌀 Chaos · 🏆 Shelf · 🎟️ Prizes.
- 🎮 Game Wheel: default pool 🆕 Minis = Spin Show's OWN small games (Egg Catch, Goose Chase, Stack It, Whack-a-Goose, Pancake Flip, Balloon Pop) played in an arcade overlay; ⭐ Best / 🎮 All still land on other sloppy apps (card with screenshot + PLAY).
- 🌀 CHAOS WHEEL (renamed from Quirky Wheel at Angie's 12:03 ask, use that name everywhere): mostly bonuses for the next run (×2 coins, extra life, slow-mo, disco, golden rush, goose heckler, tiny mode, head start) plus prizes (jackpot, trophy, +25, pet rock, duck, hat, fortune, sneeze, spin again). The only 'catch' is the goose (heckler in-game / steals coins on a solo spin). Bankrupt is retired.
- FLOW (Angie 12:02): Game Wheel picks a mini -> Chaos Wheel lights up and you MUST spin it -> bonus badge -> PLAY. Phones auto-switch to the Chaos tab and back. One free solo Chaos spin per game spin (S.free); a solo bonus is banked (max 3) for the next game.
- Trophy Shelf is its own TAB (Angie 12:01 + 12:17 'I said make the trophy a new tab'): no bottom strip any more.

- VERSION RULE (Angie 13:22): a small v-tag sits in the header next to 'Tonight on the stage' (.sign .ver, set by VER in the helper's patch13). Bump it with EVERY release, even small fixes.

## log
- 2026-10-14 11:50 v1.0 first playable (Angie's ask at 11:27 "spin a wheel of games", 11:32-11:35 quirky wheel, trophies, two wheels). One file, no database. Canvas wheel face drawn once to an offscreen canvas and blitted rotated; rAF only runs while spinning/dragging/flapper moving (no idle loop). Bulbs are 24 CSS spans with a chase animation (delay per bulb), .spinning speeds it up, .won blinks all, .jackpot rainbows. Flick: pointer drag rotates the wheel, release angular velocity sets turns + duration (easeOutQuart initial speed ~ flick speed). Landing = easeOutQuart to target+overshoot then damped cos settle back (sometimes rolls back over a peg = drama). Winner is decided by the final angle (idxAt), never separately. Ticker under each wheel shows the slice under the pointer live. Pegs tick (noise burst + triangle blip, throttled 35 ms) and kick the SVG flapper.
  - Game pools: ⭐ Best (hand-picked real games, FAV in the baked block) default, 🎮 All (genre 'games' from /app-directory/index.json + FAV). Emoji per game baked from each app's emojicdn favicon (bake.py in the helper scratch); name = title before ' — ', ' · ', ': '.
  - Progress in localStorage 'spinshow.v1': coins, spins, trophies [{id,e,n,at}], rocks, ducks, hats, pool, muted. Achievement trophies (ACH) toast + shelf; TROPHY slice gives a random quirky trophy with a spotlight dialog.
  - Phones: the two wheels sit in a horizontal scroll-snap strip (swipe or tabs); desktop >=900px side by side.
- 2026-10-14 12:03 v1.1 quirky trophy art + goose + near-miss (Angie 11:37 + main's two small things). Every trophy is its own hand-drawn inline SVG (ART(id,name,emoji) in the script: thick ink outline, flat fills, shine, engraved plinth; one shared <filter id="wob"> feTurbulence+displacement gives the wobble). Spotlight dialog wiggles the trophy in. Goose slice: a goose waddles off with half your coins (max 30); tap it in time = coins back + 5 + honk; 3 catches = 'Deeply Offended Goose'. Near-miss tease: when JACKPOT neighbours the landing slice the wheel eases to the jackpot edge, teeters ~1.1 s with peg ticks, then tips over (the landing is still chosen first, the tease only changes the path). Real jackpot: rainbow bulbs, screen shake, coin rain, flash (no shake/flash with reduced motion). og.png = desktop headless shot cropped to 1200x630.

- 2026-10-14 12:54 v1.2 Minis + Chaos Wheel flow + Shelf tab + Prize Counter + power-ups (Angie 12:01-12:19).
  - Arcade engine: logical 360x540 canvas, fixed 1/60 step + accumulator, DPR scaling from clientWidth (NOT getBoundingClientRect: the cab pops in with a scale animation and the scaled rect made the canvas blurry), states closed/intro/play/paused/over, 3 s countdown (1 s reduced motion), hearts HUD, pops/particles/shake. Touch drag, mouse, arrows/WASD, Space/Enter/tap = act, Esc pause/resume/close, Tab trap, blur/hidden = pause. Best per game in S.best, coins from score (egg s/3, goose s/2, stack floors).
  - Egg Catch (rotten eggs from L2, gold egg 5, level per 10 caught), Goose Chase (geese turn at a limited rate, bread distracts 5 s, coin per pickup), Stack It (perfect tolerance 5 px, combos grow the block, sky changes with height; extra life = Safety Net).
  - Prize Counter tab: Chaos Ticket 15 (one more solo Chaos spin), skins neon 60 / candy 60 / gold 150 (bulb colours are CSS vars --bulb-on/glow/off, palettes in SKINS), trinkets duck 20 (stackable) globe 35 gnome 45 lava lamp 55 teddy 80 UFO 120 (all tappable on the shelf). Power-ups sold on the intro/game-over card: Extra Life 15, Head Start 20, Golden Rush 12. Re-spin the bonus 10 (only on the flow intro card; restores the bank and re-arms the Chaos Wheel).
  - Newer emoji 🪿🪨🪩🪙 are own SVG icons (emo() for DOM, ICON_IMG drawn on the wheel canvas) so Windows 10 shows no tofu.
  - Old saves migrate via the RAW saved object: ver<2 -> pool 'minis'. 11 new trophies (m:* arcade, p:* shop). og.png refreshed (no Quirky Wheel).
  - Tests: headless desktop 1280x800 + phones 390x844 / 360x640, full flow game->chaos->intro->play->over, re-spin, pause/exit, shop buys, skins, shelf spotlight, reduced motion, migration; 0 JS errors, no horizontal overflow.

- 2026-10-14 13:28 v1.3 version tag + collectible art (Angie 13:22 'trophy artwork look better same with prizes tab'). Trophies: metal gradients (gold/silver/bronze/wood defs tg* in the page's hidden <svg><defs>, shared by every inline trophy), cup rims showing the inside, highlights + glint, wooden plinth with an engraved tier plate (screws) and a ribbon medal; tier = trinkets wood, r:* silver, else from the cup's gradient. Shelf slots get a warm spotlight. Prize Counter: skins are real mini wheels (12 slices, 16 bulbs, pointer; neon glows, candy stripes, gold), the Chaos Ticket is an ADMIT ONE stub, trinkets stand on little wooden ledges. Tested desktop 1280x800 + 390x844: 0 JS errors, no overflow.

- 2026-10-14 13:45 v1.4 six games on the wheel (Angie 13:22 'Put more than 3 games on the wheel'). Whack-a-Goose 🔨 (3x3 holes, golden goose 5, rubber ducks from L2 = don't hit, an escaped goose honks a heart off; arrows hop holes, Space whacks; coins s/2), Pancake Flip 🥞 (flip-o-meter + bubbles, flip each side in the green = +3 / butter +5, raw or burnt = heart, 5 pancakes per level; coins s/3), Balloon Pop 🎈 (escaped balloon = heart, storm-cloud balloons from L2 ZAP you, golden 5; arrows move a crosshair; coins s/3). Engine: pointer taps queue in G.input.taps (cleared every step), keyboard Space pushes a tap at G.aim, arrow presses queue in G.hop (quick taps between frames were lost with edge detection). New trophies m:whack40 Goose Bonker, m:flip60 Short Stack Chef, m:pop60 Pop Star; Tried Them All now needs all 6 (art says ALL 6). Tested desktop 1280x800 + 390x844 with a tap bot: all three score, end, save bests; 6 best cards on the shelf; 0 JS errors.

## issues
- Headless test browser has no colour emoji font: helper's run.sh points FONTCONFIG_FILE at a fonts.conf with twemoji.ttf so screenshots show emoji.

- Shared headless lock: a background `cd dir && python3 -m http.server &` makes $! the subshell, so kill misses the server and the server keeps the inherited flock fd = lock held forever. run.sh now uses `--directory` so $! is python itself.
- 🪿 (Unicode 15) is tofu on the headless twemoji font and on older Windows 10 / Android; the goose art is SVG elsewhere.

- CDP probes: Input.dispatchKeyEvent Enter needs text '\r' to click a focused button; Math.round can return -0, which comes back as None through returnByValue.
- Intro card with 4 bonuses overflows a 390x844 phone (scrolls); max-height 740 hides the bonus descriptions (the badges under the screen still show them).

## todos
- Balance the 3 new minis after Angie plays (Whack escape = heart may be harsh; Balloon Pop spawn rate)
- Tune coin prices after Angie plays (a run gives ~10-40 coins)
- More chaos: upside-down wheel, double or nothing, mystery box
