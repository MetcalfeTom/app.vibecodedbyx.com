# Glitch Forge

Web-based glitch art generator with canvas pixel manipulation and frame exporter.

## log
- 2026-03-12: Initial build. 7 adjustable effects: channel shift, pixel sort, scan lines, noise, slice offset, color crush, wave distortion. 4 toggle effects: invert, mirror, VHS bars, RGB split. 5 presets (VHS, Corrupt, Cyber, Acid, Subtle). Drag-and-drop or click to upload images, auto-resized to 800x600 max. Default XOR pattern if no image. Randomize button. Export single PNG or 5-frame set with animated preview overlay. Space Mono + Instrument Serif typography, magenta/cyan on dark.

## issues
- None yet

## todos
- Actual GIF export using a library
- Undo/redo stack
- Layer blending modes
- Save/load presets to localStorage

## notes
- No database — pure frontend image manipulation
- All effects operate on pixel data (ImageData)
- Pixel sort: sorts rows by brightness in segments above threshold
- Channel shift: offsets red right and blue left
- Slice offset: random horizontal row displacement
- Color crush: reduces bit depth (2-8 levels)
- Distortion: sinusoidal x-displacement per row
- Frame export: renders 5 variations (noise/slice randomize each render) as PNG sequence
- Source image preserved for re-rendering with different params
