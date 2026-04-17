# Neon Sketch

Minimalist sketchpad with glowing neon pencils on a dark canvas.

## log
- 2026-04-17: Initial build. Full-screen dark canvas with 10 neon colors (magenta, cyan, green, yellow, orange, red, blue, purple, pink, white). Glow effect via shadowBlur with bright white core pass. Adjustable brush size (1-30px). Eraser mode. Undo (30 steps). Clear canvas. Save as PNG with black background. Keyboard shortcuts: Ctrl+Z undo, E toggle eraser, [ ] brush size. HiDPI support. Lexend Deca typography, minimal dark toolbar.

## features
- Full-screen dark canvas drawing
- 10 neon colors with glowing effect (shadowBlur + white core)
- Toggle glow on/off
- Adjustable brush size 1-30px
- Eraser mode
- Undo up to 30 steps
- Clear canvas
- Save as PNG (composited on black background)
- Keyboard shortcuts: Ctrl+Z, E, [ ]
- HiDPI/retina support
- Touch drawing support (passive:false for smooth mobile)
- Minimal bottom toolbar

## issues
- Undo stores full canvas as dataURL — memory heavy at large sizes

## todos
- Layer support
- Color picker for custom colors
- Opacity slider
- Shape tools (line, circle, rectangle)
- Share to gallery
