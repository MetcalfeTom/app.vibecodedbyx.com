# Kaleidoscope

## log
- 2026-01-05: Initial creation - trippy kaleidoscope with ambient audio

## features
- Kaleidoscope effect with mirrored segments
- Perlin noise-driven organic movement
- Slow-drifting neon patterns
- 6 color palettes (Neon, Pastel, Matrix, Fire, Purple Rain, Mono)
- Adjustable speed and segment count
- Low-fi ambient hum audio
- Web Audio API synthesized drone
- Vignette effect
- Center glow

## audio
- Multiple oscillators creating harmonic drone (A1 harmonics)
- Sine and triangle waves
- Slight detuning for warmth
- LFO frequency modulation
- Filtered noise texture layer
- Smooth fade in/out

## controls
- Sound toggle button
- Speed slider (0.1x to 2x)
- Segment slider (4 to 16)
- Color palette button
- Reset button

## keyboard shortcuts
- Space: Toggle sound
- C: Change color palette
- Arrow Up: Increase speed
- Arrow Down: Decrease speed

## color palettes
1. Neon: Magenta, Cyan, Pink, Purple, Mint
2. Pastel Neon: Soft coral, yellow, blue, pink, azure
3. Matrix: Green shades
4. Fire: Red to yellow gradient
5. Purple Rain: Blue to magenta
6. Monochrome: White to black

## design
- Full screen canvas
- Click to start interaction
- Controls hidden until hover
- Minimal UI aesthetic

## technical
- Canvas 2D rendering
- Perlin noise for organic movement
- Off-screen canvas for segment rendering
- Web Audio API for synthesized audio
- requestAnimationFrame loop

## issues
- None yet

## todos
- Add mouse interaction (follow cursor)
- Add music reactive mode
- Add screenshot/record function
- Add more pattern types
- Add blur/glow intensity control
