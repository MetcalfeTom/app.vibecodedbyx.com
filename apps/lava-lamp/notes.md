# Neon Lava Lamp

## log
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
- None yet

## todos
- Could add drag interaction for continuous bubble creation
- Could add ambient background music
- Could add more lamp styles
