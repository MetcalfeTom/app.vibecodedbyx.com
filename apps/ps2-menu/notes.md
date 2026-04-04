# PS2 System Menu

## log
- 2026-04-04: Initial build — PS2 system menu clone with oscillating blue cube field and smoke particles. 560 isometric cubes on a grid with layered sine wave oscillation, 120 volumetric smoke particles with fade lifecycle, dark navy gradient background, scanlines, vignette. Menu bar with Browser/System/Configuration, real clock, version text. Full canvas rendering.

## features
- 28x20 grid of isometric cubes (560 total) with 3-face shading (top/left/right)
- Layered wave oscillation: 3 sine waves with per-cube phase offset based on position
- Cubes sorted by Z-depth for painter's algorithm
- 120 smoke particles with radial gradients, drift, fade-in/hold/fade-out lifecycle
- Pre-filled smoke on load so it doesn't start empty
- Dark navy gradient background matching PS2 aesthetic
- Edge highlights on cube faces with distance-based brightness
- Scanline overlay and vignette
- Interactive menu bar (Browser/System/Configuration)
- Real-time clock display
- Fully responsive

## issues
- Heavy on GPU — 560 cubes + 120 smoke radial gradients per frame
- No audio (PS2 menu had ambient hum + navigation sounds)
- Menu items are cosmetic only — no sub-menus

## todos
- Add ambient drone sound (WebAudio low-frequency oscillator)
- Add navigation sounds on menu hover/click
- Memory card / disc detection animation
- Sub-menu screens for each option
- Performance: could use offscreen canvas for smoke layer
- OG image
