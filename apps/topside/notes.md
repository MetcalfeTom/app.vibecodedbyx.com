# Topside

Top-down extraction raid for Twitch viewer **dandymcgee** ("plz build arc raiders, but free, and with no cheaters", 2026-10-06 06:14 UTC, plus "also, add skunk").
Inspired by the extraction-shooter genre; uses none of Arc Raiders' names, logos, characters or branding. "No cheaters" joke: single-player, the start screen's anti-cheat line reads "0 cheaters detected, the machines cheat".

## log
- v1.0 (2026-10-06): one seeded 84x60-tile map (~3x3 screens): roads, 12 enterable buildings (roofs fade when you step inside), rubble walls, trees, wrecked cars, map-edge rubble. 39ish crates (box / locker / glowing cache) with a hold-to-search ring. Loot with weight + value (scrap, wire, circuit, power cell, optic lens, glowing core), 10-cell backpack, ammo and bandages as instant pickups, Q / tap a pack cell to drop. Machines: spotter drone (hovering, sweeping vision cone, calls the others when it sees you, fires slow bolts), heavy walker (slow, telegraphed slam ring + 3-bolt laser-aimed burst, drops a core), ticker (fast stop-start skitter, crouch + leap bite). Sight cones (raycast, walls block), awareness meter (? then !), hearing from noise rings (walk 70, sprint 270, roll 130, shot 480). Pistol 8-round mag + reserve, auto reload, dodge roll with i-frames. Lifts ALPHA (1:35-2:45) and BRAVO (3:20-4:50) announce 30 s ahead, open with a noise that pulls machines in, stand on the pad 3 s to ride out. Stash in localStorage `topside:v1`, run summary screen. Skunks (dandymcgee): 2 wander the ruins; get within ~58 px, sprint within 150, roll near or shoot within 270 and they turn their back, tail up, spray; 20 s green stink trail, machines smell you from 300 px (tickers 380). Touch: floating left move stick, right aim stick (push past 55% fires, light aim assist), SEARCH (hold) / ROLL / RUN toggle buttons. WebAudio blips, mute (M) remembered.
- v1.1 (2026-10-06): Dottie's trader (title + summary screens). Stash is now credits `stash.cr` (v1 saves migrate items to their value); `stash.items` keeps the lifetime haul. Next-raid kit (armour vest 40, ammo tin +16 up to 3, auto-injector +45 under 25 HP) is consumed at raid start; permanent upgrades `stash.up` (pack +3 x2, 12-round mag, quiet boots 0.6x step noise, heavy rounds 2 dmg). Ambient wind loop during raids, heartbeat under 35 HP.

## issues
- Headless harness has no fine pointer: `(pointer:coarse)` decides the default touch mode; probes call `__T.setTouch(true)`.
- Test seam: `window.__T` (start(seed), freeze, inp(override input), step(n), draw, state, G).

## todos
- Run summary polish, trader to spend the stash on gear, more loot/behaviour, ambient sound.
- Pick an og.png from a better gameplay frame.
