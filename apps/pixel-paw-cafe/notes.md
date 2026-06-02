# pixel-paw-cafe (display name: The MingMing Cafe)

## log
- 2026-06-02: initial build. Cozy pixel-art tea-serving game. Url stays `/pixel-paw-cafe` for back-compat, display title is **The MingMing Cafe** per chat rename.
  - **Loop**: 3-minute day. Forest critters walk in from the right, take one of 3 counter slots, show a speech bubble with their tea order + optional 🍬sugar / 🥛cream prefs. Player taps the matching tea in the tray to brew (2.4s), optionally toggles sugar/cream on the ready cup, then taps the critter to serve.
  - **8 critters**: silly Fox / sleepy Bear / tiny Bunny are REGULARS (weight 6 each). Hedgehog / Owl / Deer / Raccoon / Squirrel are cameo (weight 1 each). pickCritter() runs weighted random — so the trio of regulars dominate spawns ~6× vs the others.
  - **6 teas**: chamomile, jasmine, peppermint, earl grey, hibiscus, matcha. Each critter has 2 favorite teas chosen per spawn.
  - **Modifiers**: 🍬 sugar + 🥛 cream toggles appear under the tray. Disabled until a cup is brewed. Match the critter's preference for +2 each, both = +3 extra (so a perfect order ≈ +7 over the base pay).
  - **3 cats**: Mochi (cream/orange), Pip (black w/ green eyes), Sage (grey tabby). Wander the counter every 3-7s to random points. Tap to pet — pink halo flashes, +1 purr, +2 coins, hearts pop, 6 spark glyphs.
  - **Pixel sprites**: hand-pixeled 11-13 cell wide critters via `makeSprite(rows, palette)` rasterized once into cached canvases at cellPx=3.
  - **Scene**: pixel-art cafe — sunset window with tiny pine trees on the horizon, brick back wall, wooden floor, 3 hanging lanterns with amber glow, wooden counter with cream top. Steam wisps animate from the ready cup; brewing pot shows progress bar.
  - **Aesthetic**: pastel cream + rose + sage + peach palette. Caveat (cursive) for headers + tea names, Quicksand for body, Silkscreen for tiny pixel labels. Wood-toned border + 2px offset block shadows on every panel.
  - **Day-end**: 3 outcome messages tiered by coin total (≥120 = best night, ≥60 = warm, otherwise quiet). Stats card shows coins / served / purrs.
  - **A11y**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<button type=button>`), aria-live status on HUD, role=dialog on overlays, aria-label on canvas describing controls, focus-visible rose outline, prefers-reduced-motion kills all animations, 2.75rem touch targets. Single self-contained ~36KB HTML, zero deps.

## issues
- Customer animations are pretty static — they just walk in + bob. Could add a "happy" jump when served.
- Tea recipes are 1-tap (matching cup). Could add a multi-ingredient brewing mini-game per tea for depth.
- No audio (yet) — a tiny chime on serve + purr loop on cat pet would help the cozy mood.

## todos
- Web Audio synth: cup clink on serve, pluck arpeggio on perfect order, purr loop on cat pet, soft bell every minute
- Daily progression: 5 days, each unlocking a new tea or a new cat
- "Tip jar" persistent across days
- Pollinations OG image (already added as a placeholder URL)
- Mobile: bigger tap targets for critters on small screens
