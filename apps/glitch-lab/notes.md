# Glitch Lab

Interactive glitch art generator — upload images, use webcam, or generate patterns, then corrupt them with scanlines, chromatic aberration, block displacement, noise, and canvas warping.

## log
- 2026-04-12: Initial build. 5 glitch effects with sliders: scanlines (darkening + horizontal line displacement), chromatic aberration (RGB channel offset), block displacement (random rectangular region shifts), canvas displacement (mouse-driven circular warp with spiral distortion), noise injection. 3 source modes: upload image, generate pattern (grid/circles/waves/city), webcam feed. Drag-and-drop image loading. Auto mode compounds glitches over time, periodically baking results into source. Mouse interaction: drag to warp regions. Save as PNG. VHS color bleed overlay at high scan values. Major Mono Display + Inconsolata typography, dark terminal aesthetic with red accent.

## features
- 5 adjustable glitch effects with sliders (0-100)
- Chromatic aberration (RGB channel splitting)
- Scanlines with random horizontal displacement
- Block displacement (rectangular region corruption)
- Canvas displacement (mouse-driven circular warp)
- Noise injection (per-pixel static)
- Upload image, generate pattern, or use webcam
- Drag-and-drop image loading
- Auto mode (compounds glitches over time)
- Save result as PNG
- 4 procedural pattern generators (grid, circles, waves, city)
- VHS color bleed overlay
- Real-time webcam glitching

## issues
- None known

## todos
- Pixel sorting effect (sort rows by brightness)
- Color channel swap
- Solarization effect
- Undo/history stack
- Share to social
- OG preview PNG
