# Glitch Gen

## log
- 2026-04-05: Initial build — neon glitch art generator with 8 real-time canvas effects, 5 source modes + image upload, 6 color palettes, 6 presets, save to PNG. IBM Plex Mono + Anybody typography, dark terminal aesthetic with cyan/pink accents.

## features
- 8 glitch effects: Channel Shift, Scanlines, Pixel Slice, Data Corrupt, RGB Split, Wave Distort, Color Invert, Pixelate
- 5 source generators: Neon Gradient, Geometric Shapes, Color Noise, Pixel Grid, Glitch Text
- Image upload: apply all effects to your own photos
- 6 color palettes: Neon, Vapor, Cyber, Acid, Mono, Blood
- 6 presets: Vaporwave, Cyberpunk, Corrupted, Minimal, Full Chaos, CRT Retro
- 4 sliders: Intensity, Speed, Slice Width, Corruption level
- Save as PNG
- Pause/resume animation
- Force glitch button (⚡)
- Randomize button
- FPS counter
- Responsive layout (side panel on desktop, stacked on mobile)

## issues
- RGB split uses putImageData at offset which can clip edges
- Noise source can be CPU-heavy at high speeds
- Wave distort + RGB split combined can be slow
- Upload resets to source if dropdown changes away and back

## todos
- Add GIF export (frame capture)
- More source types (webcam, URL fetch)
- Layer blending modes between effects
- Undo/redo for effect toggles
- OG image
- Share link with encoded preset params
