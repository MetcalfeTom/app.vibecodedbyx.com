# Neon Lava Lamp

## log
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
