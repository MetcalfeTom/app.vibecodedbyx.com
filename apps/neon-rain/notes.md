# Neon Rain

Pixel art neon rain generator with cyberpunk cityscape.

## log
- 2026-03-18: Initial build. Pixel-art neon rain over procedurally generated city skyline. 600 raindrops with variable speed/length, wind controlled by mouse/touch position. 6 color palettes (Cyber, Sakura, Acid, Vaporwave, Ember, Ice) cycled on click/tap. Splash particles on impact with ground and building roofs. Puddle reflections at ground level with shimmer. Random lightning flashes. Building windows with random flicker. PX=3 pixel scale. Press Start 2P typography. Hint fades after first interaction.

## issues
- None yet

## todos
- Thunder sound on lightning (WebAudio)
- Neon signs on buildings
- Parallax layers (foreground/background rain)
- Rain intensity slider

## notes
- No database — pure frontend
- PX=3 pixel scale for chunky aesthetic
- 6 palettes define sky, rain colors, splash, city shades, window colors, glow
- Wind tracks mouse X position smoothly
- Buildings procedurally generated on resize
