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
- window.__T exposes P, press, use, step, grow, mode, A, G, needNow for headless probes.

## log
- v2.0 (2026-09-30): full rebuild as Tama Pixel SUPER: LCD renderer, 10 forms, 7 faces, 8 icons, feed menu (meal/snack), light/sleep, Left-Right game (5 rounds, 3 wins = happy +1), medicine, flush, 4 stats pages, scold/whine discipline, attention bell, evolution by care, going home + new egg, offline catch-up, WebAudio beeps, Spanish and English, og.png.

## issues
- Percent padding on .toy measured the page width, not the toy's (desktop egg was 600 px tall): sizes now come from --tw.

## todos
- Coins from games and a shop (hats, toys, a bigger room).
- More games (jump rope, memory), a diary of the pet's life, naming it yourself.
- Friends: visit another player's pet (supabase), pet talk via pollinations.
- Adults grow old and retire after a few days, with a hall of fame.
