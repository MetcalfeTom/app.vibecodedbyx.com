# overfed · notes

## log
- 2026-07-30: v1 — chat spec ("clicker fish grows into boss monster when overfed, tank upgrades, boss music from inside the aquarium"). Feed via tap-tank or button → pellets fall, fish chomps (+coins scaling w/ stage+rebuilt). 5 stages (fry→THE MISTAKE), growth CAPPED by tank tier (fishbowl cap1 → public exhibit cap4, coins buy up). Feeding past cap/final form → OVERFEED meter (+glass cracks at 40+), 100 → BOSS: red/spiky/teeth render, quake, bossmode body class, title 'YOU DID THIS', 30s tantrum → endBoss: insurance payout (500+250·rebuilt), fish shrinks to stage 2, rebuilt++ (repeat-offender scaling). BOSS MUSIC: 138bpm bar-scheduled loop (8th-note E-minor saw riff, kick thump beats, alarm lead every 2nd bar, drone every 4th) — ALL audio routed through a 700Hz lowpass w/ 0.4Hz wobble = underwater muffle, the joke chat ordered. Sound default OFF (autoplay policy), unmute button starts loop mid-boss. localStorage persist (boss state not persisted — reload = calm chonk). TESTS 13/13 after two harness fixes: this-binding on handler call, and window.AudioContext vs global.AudioContext (app+browsers read window.*; harness only set global — 6th stub-gap lesson of the week).

## issues
- Boss music interval is wall-clock setInterval; heavy tab throttling may slur bars (acceptable).

## todos
- Multiple fish; feed-frenzy combo; a "do not press" second feed button during boss.
