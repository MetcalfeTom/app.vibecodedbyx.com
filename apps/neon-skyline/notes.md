# Neon Skyline

## log
- 2026-03-29: V1 — Procedural pixel art city skyline generator. 4 parallax layers of buildings at different depths, each scrolling at different speeds. Pixel-perfect rendering at 3x scale with image-rendering:pixelated. Buildings have random heights, widths, spires with blinking lights, lit/unlit windows with occasional flicker. 5 color themes (Cyberpunk, Sunset, Ice, Toxic, Vapor). Star field with blink animation, moon with glow. Ground reflection. Click/tap to regenerate city. Speed control (Slow/Med/Fast/Stop). Silkscreen + Share Tech Mono typography.

## features
- 4 parallax scrolling building layers (back to front, increasing speed)
- Procedural building generation: random height/width/spire/window patterns
- Pseudo-random window lighting with occasional flicker
- 5 color themes: Cyberpunk, Sunset, Ice, Toxic, Vapor
- Star field with blink animation
- Moon with radial glow
- Ground reflection effect
- Speed control (4 levels including stop)
- Click anywhere or NEW CITY button to regenerate
- Pixel art rendering at 3x scale
- Stars toggle

## issues
- None currently

## todos
- Add Chicago-specific landmarks (Willis Tower, Hancock, Trump Tower silhouettes)
- Add rain/snow particle effects
- Add shooting stars
- Add car lights on a street layer
- Add flying vehicles/drones

## notes
- Renders at PW=screenWidth/3, PH=screenHeight/3 for pixel art look
- Buildings generated across 3x screen width for seamless scroll looping
- Window lighting uses deterministic pseudo-random (sin-based hash) so windows don't change on redraw
- Each layer has different building height ranges (back=shorter, front=taller)
