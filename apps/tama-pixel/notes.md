# Tama Pixel SUPER

A pocket pet on an egg-shaped handheld: one-bit LCD, eight icons, three buttons. Rebuilt from scratch on 2026-09-30 for arianmartiz ("un supertamagochi con muchísimas funciones"); the April 2026 build (12x12 sprites, purple device, no saving) is in git history.

## art direction
- **Look**: a real 90s virtual pet. Mint-jelly egg shell with a keyring, dark bezel, greenish LCD with ghost cells, pink A/B/C buttons.
- **Palette**: tangerine halftone page (--bg1 #ff7a3d, --bg2 #ffb03f), shell #39c6ad, bezel #1d2b2e, LCD #b3c49b / ink #1c2616, hot pink #ff4f6d, cream #fff4e0.
- **Type**: Bungee (brand, buttons), DotGothic16 (everything else). On the LCD a hand-made 3x5 pixel font, capitals, no accents.
- **LCD**: 48x32 cells drawn on a 384x256 canvas. Sprites are typed '#' rows in ART; faces are 7x5 overlays at each form's f:[x,y].

## how it plays
- A picks an icon (←/→ too), B uses it (Enter/Space), C goes back or shows the clock (Esc). Icons are tappable; tapping the LCD pats the pet (once per 20 s, happy +¼). In the game, tap the left or right half.
- Egg hatches in 20 s (B warms it faster). Baby → child at 4 min → teen at 15 min → adult at 40 min of life.
- Forms: child Maru (≤1 care mistake as a baby) or Kobu; teen Tobi (≤2) or Gomo; adult Sora (≤3 mistakes and discipline ≥75), Mochi (≤7 and discipline ≥50, or weight ≥40), Brava (≤7, low discipline), Grumo (more).
- Hunger and happy are 4 hearts; energy and discipline 0-100. Poop comes 50-110 s after a meal and every 4-7 min; sickness from poop, hunger and 3+ snacks; medicine takes 2 doses.
- A need left 150 s is a care mistake. Fake calls ("whine") are scolded for discipline +25; scolding for nothing costs a heart.
- Sleep when energy runs out or with the light icon when energy < 60; leave the light on and it's a need. Wakes at full energy.
- Sick 15 min or starving 20 min: the pet flies home and leaves a new egg (gen +1, history on stats page 4). Never while you're away.
- Away time: simulated up to 12 h at half decay, at most 2 care mistakes, sickness/starvation clocks capped so nobody dies offline.
- Saved in localStorage 'tama-pixel-super-v1' (+ '-lang', '-snd'). ES/EN auto from the browser, toggle on the page.
- window.__T exposes P, press, use, step, grow, mode, A, G, J, needNow, play, shopBuy, SHOP for headless probes.
- Hats: HATS rows; a hat's bottom row overlaps the head's top row by 1. Jump pet can push a tall hat off the top of the LCD (clipped, fine).

## log
- v2.3 (2026-09-30): the Park (first in the Play menu): your pet meets up to 6 pets other players had open in the last 3 days, one at a time (walks in, hearts, walks off), plus a cloud, a tree and a bird; the first meeting of a trip gives happy +1 and each meeting goes in the diary. Sharing: table tama_park (form, hat, gen, updated_at; one row per user, select-then-update, no names or text) pushed 6 s after load, on growing, on hat changes and every 5 min. Everything read back is checked against ART/HATS. ?offline or #offline keeps the page off the network: use it for every headless test.
- v2.2 (2026-09-30): Memory game (arrows left/right, the sequence grows by one each round up to 10; 2 coins a round +5 at 5, happy +1 at 4), the pet talks: 15 lines per language when patted (60%) and on its own every 2.5-5 min when content, night 22:00-07:00 local drains energy 2.5x so pets go to bed at night (one 'yawns' line per night). tr() picks at random when a WORDS entry is an array.
- v2.1 (2026-09-30): coins from games (Left-Right: 2 per hit +5 for 3 wins; Jump: 1 per rock +5 at 10), a Shop icon (cake 15, ball 25, bow 30, bunny ears 35, propeller beanie 40, wizard hat 60, crown 80), hats drawn on every form (hatTop finds the head at the sprite's centre), Play opens a game menu (Left-Right, Jump, Ball once bought), Jump game (40 ms loop, 5 px hitbox under the pet's centre, speed 26→44, ends at a hit or 20), cake in the feed menu, a Diary icon opening an HTML diary of the pet's life with renaming (A-Z0-9, 6), 5 icons per row. Coins, items and the diary carry over to the next egg.
- v2.0 (2026-09-30): full rebuild as Tama Pixel SUPER: LCD renderer, 10 forms, 7 faces, 8 icons, feed menu (meal/snack), light/sleep, Left-Right game (5 rounds, 3 wins = happy +1), medicine, flush, 4 stats pages, scold/whine discipline, attention bell, evolution by care, going home + new egg, offline catch-up, WebAudio beeps, Spanish and English, og.png.

## issues
- Percent padding on .toy measured the page width, not the toy's (desktop egg was 600 px tall): sizes now come from --tw.

## todos
- A room upgrade in the shop, more food, a memory game.
- Park: show how many pets visited today; wave or gift a coin to a visitor.
- Adults grow old and retire after a few days, with a hall of fame.
