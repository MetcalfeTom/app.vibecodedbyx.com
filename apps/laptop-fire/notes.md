# Laptop Fire Fighter

## log
- 2026-09-26: first-visit how-to card (bottom-centre): tap burning laptops, grab the extinguisher, every flame drains health for 45 s. Shows once (localStorage laptop-fire_howto_seen), pointer-events:none, fades on the first tap in the game area or after 12 s.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

## issues

## todos
- (2026-09-27, found by code reading, untested) timer can double-speed after a fast restart (endGame never clears the startTimer tick); leftover 🧯 extinguisher still clickable on Game Over (+30 after the shown score, so Save stores a different number); level-up uses score % 80 === 0 and gets stuck once +30/1.5x shifts the score (use a nextLevelAt threshold); laptops spawn at y=0 so flames clip and the 🏆 button covers top-right laptops (spawn from ~60px); phone Game Over card may overflow (input min-width 220px).
