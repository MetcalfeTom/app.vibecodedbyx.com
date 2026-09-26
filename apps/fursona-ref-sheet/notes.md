# Fursona Ref Sheet Maker

Idea by KaiTheTiger (sloppy.live chat, 2026-09-26): "like a Picrew, but better because you can choose every single color" — one base, choose long/short/medium tails and different ears, drag colors onto it.

## log
- 2026-09-26: v1
  - One hand-drawn SVG anthro base (viewBox 0 -18 360 490), left side drawn once and mirrored with matrix(-1 0 0 1 360 0)
  - Ears: pointy, cat, lynx tufts, round, floppy (drawn in front of head), bunny. Tails: none/short/medium/long/fluffy. Hair: tuft/swoop/none
  - Markings (toggles): ear tips, socks, mask, tail tip — drawn as shapes clipped to the part (clipPath), then the part outline is redrawn on top
  - 7 color regions (main, belly & muzzle, hair, eyes, nose, markings, tail tip); drag a swatch onto a part or onto a palette chip, or tap a swatch (brush) then tap parts; tapping a part/chip without a brush opens the native color picker; custom rainbow swatch
  - Presets: Wolf, Fox, Cat, Bunny, Dog, Raccoon, Lynx; Random (earthy or wild palettes); Undo (Ctrl+Z); autosave in localStorage `fursona_sheet`
  - Copy link: whole sheet in the URL hash (e,t,h,m,c,n,s), validated on load (hex regex + known part keys)
  - Download PNG: 1200×800 canvas — character SVG serialized as an image + name/species/palette drawn with the page fonts (fonts don't load inside an SVG-as-image, so text is drawn on canvas)
  - Fonts: Bagel Fat One + Sometype Mono; sketchbook paper look with tape

## issues
- SVG fills are attributes (not CSS classes) so the serialized SVG exports with colors
- Mobile: grids need minmax(0,1fr) and inputs width:100%, otherwise the page scrolls sideways

## todos
- More bases (side view? chubby/tall body types), more ear/tail shapes (dragon horns, wings, curly husky tail)
- Pads / toe beans, stripes & spots markings, freckles
- Gallery of chat's fursonas (supabase) if chat wants it

## notes
- `window.__ref` exposes S, setColor, render, encode, decode, undo for headless tests
