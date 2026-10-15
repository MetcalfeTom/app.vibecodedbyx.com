# Flax Cart — notes

For **iamflax** (Flax, they/them). Their ask (2026-10-15 19:15 UTC): "for a team building online meeting as a ice breaker, i want a super mario kart clone for up to 15 racers, online. Same car. Qualifiying and 3 laps, up to 3 tracks. In total 10 minutes. Browserfriendly bestnoossible graphic. Called Flax Cart".

**Our own kart racer, no Nintendo IP**: no Mario names, characters, items (no shells, bananas, mushrooms, stars, question blocks), no copied tracks or music. Everyone drives the same kart; only colour and name differ. No weapons/items: pure racing with boost pads and a drift boost.

## Art direction ("Linen & Flax")
- **Look**: low-poly, flat-shaded vertex colours, everything built in code (no assets). Golden late-afternoon light.
- **Palette**: ink #16213a, linen #f5edd9, straw #f2c14e, flax blue #8fa9f5 / #6f8ff0, clay accent #e4572e, field green #3f7b4c / #5c9444.
- **Sky/mood**: gradient dome (#2c5bb3 top → #8db3e8 → peach horizon #ffd1a0), peach fog (150-1150 m), low sun from the north-west (#ffd7a3), hemisphere fill. ACES tone mapping, exposure 1.05.
- **Camera**: third-person chase, FOV 62 (74 in portrait) + speed/boost kick, distance 6.2 m + speed, smoothed yaw so drifts show the kart's angle.
- **Hero**: one stubby open-wheel kart (side pods, rear wing, helmeted driver). Paint is a per-instance colour on painted parts only (a `paint` vertex attribute masks it), so all 15 colours share one draw call. Linen seat/arms, ink chassis.
- **World layers**: foreground = road (canvas asphalt texture with linen edge lines), red/linen kerbs in corners, blue/linen striped barriers, FLAX CART banners, boost pads (chevrons); midground = flax fields (blue patches + straw stripes) in the infield, windmill, grandstand with a bobbing crowd, trees, hay bales, a lake; background = low-poly mountain ring, clouds, sun disc.
- **Fonts**: Bungee (logo, HUD numbers), Martian Mono (times), Bricolage Grotesque (body).
- **Budget**: phone ≤150 draw calls, ≤300k triangles, one shadow light (1024 map on phones, 2048 desktop high). Adaptive quality drops pixel ratio, shadows and the flax tufts if frame time stays > 24 ms. Software GL (SwiftShader) starts at low quality. `#hq` / `?hq` forces high (used for og.png).

## Log
- v1.0 (2026-10-15 20:44 UTC) solo: Linen Loop track (≈930 m: start straight, climbing sweepers to a crest hairpin, S-curves, lakeside straight, west sweeper). Countdown → qualifying (out lap + one timed flying lap) → grid card sorted by Q time → 3-lap race vs 7 AI karts → results. Drift (hold Space while turning: hop, slide, blue then gold sparks, release = mini boost), boost pads, rocket start (press gas in the last half second), soft wall bounce, respawn on water/far off track/stuck/R. Keyboard, touch (left steer pad, auto-gas, DRIFT/BRAKE/↺), gamepad.

## Issues
- (none reported by players yet)
- Probe notes: in headless SwiftShader the page renders ~1-3 fps, so probes speed up the sim with `TS.v` in a test copy. Emoji don't render in headless, so HUD buttons use inline SVG icons.

## Todos
- Step 2: online rooms for up to 15 (Supabase Realtime broadcast + presence, no tables).
- Step 3: tracks 2 and 3 / 3-track cup, podium with a sympathy trophy for last place.

## Questions for Flax
- (filled in at hand-back)

## Budget (measured in headless Chromium)
- v1.0 desktop 1280x720 race view, low quality (SwiftShader starts at QUAL 0): 29 draw calls, 82k triangles.
- v1.0 phone 390x844 race view: 18 calls, 75k triangles.
- og render 1200x630 at forced high quality (shadows on): 20 calls, 90k triangles. All well under the phone budget (150 calls / 300k).

## Tech notes
- three.js r170 by full URL, no import map. No addons (they import bare 'three'), so geometry merge is hand-written (`merge()`).
- Track = centripetal Catmull-Rom through control points, resampled every ~1 m (`crSample`), rotated so s=0 is the start line. Arrays X/Y/Z, tangent TX/TZ, heading HD, curvature K. `project(x,z,hint)` searches ±30 samples around the hint. d > 0 = right of travel direction.
- Fixed 60 Hz sim with render interpolation. `TS.v` is a time scale (1 in the live game; probes use it in a test copy only).
- Test hooks: the live file only has the marker `/*@TESTHOOK@*/`; `mktest.py` (scratch) injects `window.__FC` and a `__BOT` steering hook into a test copy. Never deploy window.__* objects.
