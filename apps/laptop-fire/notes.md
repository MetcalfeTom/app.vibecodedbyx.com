# Laptop Fire Fighter

## log
- 2026-09-27: bug pass (the code-review list, tested headless 8/8 desktop + 9/9 at 360×740; the old file fails 5). The countdown tick is tracked (`timerTimeout`) and cleared by endGame/startTimer: a Try Again within a second used to leave the old tick running, so the clock ran at 2× (old: 7 s gone in 3.4 s). The first extinguisher timeout is tracked too. Extinguishers carry `.powerup`, are removed on game over and ignore clicks after it. Level-ups use a `nextLevelAt` threshold (80, then +80×level ≈ 8 laptops a level) via `checkLevel()` after laptops and extinguishers: `score % 80 === 0` was skipped by +30 bonuses and level-scaled points, so most runs stayed stuck at level 1–3. Laptops and extinguishers spawn from y=56 (flame clearance, clear of the 🏆 button). Phone game over card: width calc(100vw − 24px), input min-width 0.
- 2026-09-26: first-visit how-to card (bottom-centre): tap burning laptops, grab the extinguisher, every flame drains health for 45 s. Shows once (localStorage laptop-fire_howto_seen), pointer-events:none, fades on the first tap in the game area or after 12 s.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

## issues

## todos
