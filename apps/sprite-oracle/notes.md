# Sprite Oracle

## log
- 2026-04-20: Created. 32×32 pixel character generator. Seeded mulberry32 PRNG (6-char alphanumeric seed hashed via FNV-1a). 5 archetypes: Hero (humanoid w/ hat/cape/weapon — 4 hat styles, sword or staff), Mage (robed, pointed wizard hat, floating orb staff, optional beard), Robot (boxy chassis, 3 antenna styles, 3 hand/claw styles, eye screen w/ dots), Slime (droplet silhouette from per-row halfwidth array, 2 or 4 eyes, optional mouth/tongue/spots), Beast (4-legged body + side-facing head, 3 ear styles, 3 tail styles, stripe/spot patterns). 8 palettes (gameboy, sunset, forest, ice, neon, rose, dusk, fire) each w/ 6 named roles (outline/skin/body/detail/accent/metal). Symmetric horizontal drawing via `setSym`/`fillRectSym`, post-pass outline fills transparent cells adjacent to filled cells with outline color. UI: 512px hero canvas + 12-thumbnail gallery grid, type/palette filter selects, seed input, PNG download at 512× upscale or native 32×32. Click thumbnail to promote to hero, shift-click to reroll one. Keyboard: Space = reroll all, D = download, R = reroll hero. Silkscreen + VT323 + Share Tech Mono typography, dark indigo/magenta/cyan palette with CRT scanlines.

## issues
- `Sprite.fillRectSym` mirrors x1/x2 individually — always pass x1 <= center; works because normalization happens via `Math.min/max` inside `fillRect`.
- Beast archetype is asymmetric (side-facing) but still uses symmetric Sprite helpers for body rectangles. Works because fillRect (non-sym) is used for head/tail/legs.
- Outline pass only fills orthogonal neighbors; diagonals can still look "floating" but matches classic sprite conventions.

## todos
- Add more archetypes: Ghost, Fairy, Dragon, Warrior, Ninja.
- Palette editor — let users tweak individual color roles.
- Batch download (ZIP of 12 sprites).
- Animated preview — 2-frame idle (bob up/down).
- Share URL with seed + archetype + palette query params.
- Spritesheet export — grid of N sprites as single PNG.

## design
- 32×32 grid, center column at x=15/16 for symmetric drawing (mirror across `size-1-x`).
- Head zone rows 9–16, torso 16–23, legs 23–31. Keeps creatures grounded.
- Outline pass is the secret — raw fills look flat, outline adds the "pixel art hand-drawn" silhouette.
- Palette "metal" role is for weapons, claws, bolts, anything that should read as hard/non-organic.
- Fonts: Silkscreen (headings, pixel authority), VT323 (body/buttons, CRT), Share Tech Mono (tags/labels).
