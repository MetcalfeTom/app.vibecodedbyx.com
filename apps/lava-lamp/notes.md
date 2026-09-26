# Neon Lava Lamp

## log
- 2026-09-26: Classic bottle. `glassHalfWidth(fy)` (neck 50 → belly 94 at 70% → 74 at the base) drives everything: renderer draws only inside it (1px AA edge + darker toward the walls), blob walls (`2·hw − 10`, clamped at 1.4 r since wax draws to ~1.5 r), click hit-test, and the SVG glass outline/shine built at load. Cap and base are SVG cones (`.lamp-back` behind the canvas holds the collar's back half, `.lamp-front` on top). Bulb warmth fixed — the fluid tint was brightest at the top, now brightest just above the bulb. Wax: shadows go toward a deep saturated wax colour (dark = primary × ~0.45), colours drift only 40% toward the glow colour, sheen tinted with the glow colour on the lit side. New og.png.
- 2026-09-26: Smooth wax + layout pass.
  - Wax shading rewritten: the outline still comes from the 1/d² metaball field, but lighting uses a second soft (1 − d²/S²)³ dome field (S = 2.4r) so merged blobs light as one piece — the old "nearest blob" shading drew hard creases/facets where blobs met. Light from the bulb below, glow-tinted sheen, thin edges pick up the glow colour, anti-aliased edge.
  - Colour blend weight is (f²/(d²+f²))² — broad and never zero. A kernel that hits zero at its reach made crisp pale patches (colour flipped to a fallback there).
  - Blob colours computed once per frame (getColor used to run Date.now per pixel per blob).
  - Layout: title / lamp / controls in one column; `fitLamp()` scales the 280×500 lamp into the room left (0.45–1.35×), so the panel never covers the base. WAX/GLOW/FLUID pickers tucked behind a MIX toggle; preset chips are real buttons with aria-pressed; canvas has an aria-label.
  - og.png (1200×630) instead of the emojicdn image.
- 2026-04-08: Three bugs fixed together after vivax_dev feedback:
  1. **Canvas only rendered the top-left quarter.** Root cause: `canvas.width/height` was set to `200*scale` (400×760) with `ctx.scale(2,2)`, but `putImageData` ignores the ctx transform, so a 200×380 ImageData was written into just the top-left of the 400×760 bitmap. Fixed by dropping the scale and making bitmap match logical size.
  2. **Canvas didn't cover the whole lamp container.** Canvas was absolutely positioned at (40,50) with 200×380 inside a 280×500 container, leaving gaps at the rim. Changed canvas to `inset: 0; width: 100%; height: 100%`, bumped bitmap to 280×500, and introduced a fluid inset (FLUID_X=40, FLUID_Y=50, FLUID_W=200, FLUID_H=380). Metaball renderer now writes only inside the fluid inset and leaves the rest transparent (the cap/base overlay hides it). Click/touch handlers remap via a new `canvasToFluid()` helper that also rejects taps outside the fluid region.
  3. **Physics overhaul — blobs stuck to floor & failed to separate.** New thermal gradient (heat absorbs proportional to distance from bottom, cooling proportional to distance from top) so blobs swap temperature smoothly as they travel. Buoyancy 0.085 → 0.11, gravity softened by 0.85×temperature (was 0.5×), damping 0.985 → 0.975 so they decelerate less. Floor clamp now applies an unconditional upward pop-off force (`vy -= 0.08`) and clears positive vy, so a blob can never sit still at the bottom. Ceiling mirrors it. Repulsion reworked with quadratic falloff on overlap (was a linear 1.5× range with tiny force) so touching blobs push hard and far ones barely interact. Lamp profile widened slightly at the base (140 instead of 120) to give clumps room to untangle.
- 2026-04-08: Full customization pass. Replaced the preset-cycling COLORS button with three `<input type="color">` pickers (WAX, GLOW, FLUID) + a horizontal row of 8 preset chips (magenta, cyan, orange, violet, emerald, amber, blood, classic) that auto-fill the pickers. Added a HEAT slider 0-200% (instead of 3-state toggle). Replaced color schemes array with hexToRgb helper + targetColors object driven from inputs. Glassmorphism controls panel (blur backdrop). Metaball renderer gained light-from-below shading (bottom hemisphere of each blob brighter) and a bulb-warmth gradient at the fluid bottom so the whole lamp feels lit from the base. Tuned physics: gravity 0.022, heat force 0.085, damping 0.985, repulsion 0.6. Removed the 10s auto-color-change interval since users now pick their own.
- 2026-01-11: Created high-fidelity neon lava lamp with gooey metaball physics
- 2026-01-18: Added click/touch interaction
  - Click inside lamp creates 2-4 bubbles at position
  - Nearby blobs get pushed away by click force
  - New bubbles burst upward with heat energy
  - Touch support for mobile
  - Hint text shows on load, fades after interaction

## features
- Metaball rendering for smooth gooey blob visuals
- Heat-based buoyancy physics (blobs rise when hot, sink when cool)
- 6 color schemes with smooth transitions
- 8 initial blobs (up to 15 max)
- Blob pulsing and wobble animation
- Blob-to-blob repulsion for organic movement
- Realistic lamp container with cap, glass, and base
- Glass reflection highlights
- Dynamic glow effect matching current color
- Controls: change colors, add blobs, toggle heat intensity
- Auto color change every ~100 seconds (10% chance)
- Mobile and desktop friendly
- Click/tap to create bubbles and push nearby blobs

## issues
- `.control-row{display:flex}` beats the `hidden` attribute — keep the `[hidden]{display:none!important}` rule.
- Headless check: pure-node render of renderMetaballs (stub ctx) is the quickest way to see shading bugs without browser compositing.

## todos
- Could add drag interaction for continuous bubble creation
- Could add ambient background music
- Could add more lamp styles
