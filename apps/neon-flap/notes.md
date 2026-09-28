# Neon Flap — the flappier bird

## art direction
- A semi-realistic painted pigeon (grey body, iridescent green-violet neck, orange eye, sunset rim light) in a real dusk skyline photo (`bg.jpg`, pollinations, watermark cropped), flying through dark glass pipes with magenta neon edges. Photo far and soft, everything that can kill you sharp neon.
- Fonts: Monoton (logo, stage banners, SPLAT) + Orbitron (numbers, UI).

## log
- 2026-09-28: **Today's flock** daily board: table `neon_flap_scores` (score, name, flaps, secs, stage, day = UTC date, user_id). Read today's rows, one per player (dedupe by user_id on read), top 5 + your own row. After a run that beats your posted best today (localStorage `neonFlap.posted.<day>`) and passes a sanity check (score ≤ secs×1.6+2), it posts automatically once you have a name (`neonFlap.name`, prefilled from a Twitch login); otherwise a name field + POST shows. Title screen shows today's top pigeon. Offline → quiet message. App-scoped `supabase-config.js` (copy of icy-tower's), loaded by a module that sets `window.__nfDB` and fires `nfdb`. Probe swaps that module for a fake DB.
- 2026-09-28: **v2 full rewrite for varj1** ("a flappier bird", "photorealistic", crash = "explosion", shout "Bacock!" after the Space Quest death). Logical 360 wide, height follows the stage aspect (560–820); fills the whole screen on portrait phones, 9:16 card on desktop. Fixed 1/120 step. Hard-down / lazy-up wing stroke with fanned primaries, squash, puff ring, shed feathers, "flap / FLAP FLAP / FLAPFLAPFLAP" streak text. Stages: 5 pipes wake up (bob + eyes that follow you), 10 pipes grow neon wings and flap on their own physics, 20 flock season (distant birds), 35 everything flaps. Golden feathers between pipes (+1). Crash: slow-mo, shake, flash, 28-feather burst + poof + BACOCK! text and squawk, pigeon tumbles and lands belly-up. Over panel: score, best, flaps this run, all-time flaps, stage reached. Synth SFX, sound toggle (M). Kept localStorage `neonFlapHighScore` so old bests carry over; new keys `neonFlap.flaps`, `neonFlap.snd`. og.png made from game shots.
- 2026-01-02: Initial creation - neon Flappy Bird clone

## tuning (v2)
- gravity 1500, flap vy -440, max fall 760, hitbox r 12 (bird drawn ~1.22x), pipe width 58, caps 16 tall and 5 wider each side.
- ST table: speed 162→192, gap 164→148, spacing 226→198.
- Ceiling clamps (no death), ground kills.

## testing
- Probe: scratchpad gaunt/sw/flap with a bot autopilot (flap when bird.y > next gap centre + 16). `window.__nf` debug hook (state, score, setScore to jump stages, step). Bot clears the winged stage fine.

## issues
- none reported yet

## todos
- (done) crown: when you are today's #1 your pigeon wears a crooked gold crown
- moon that flaps at stage 35 (joke idea from stream)
- bird skins (crow, seagull)
