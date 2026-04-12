# Void Watcher

Cosmic ray visualizer. Neon pixels glitch and flip randomly across a dark grid, simulating bit flips from cosmic radiation.

## log
- 2026-04-12: Initial build. Low-res pixel grid rendered via ImageData with image-rendering:pixelated. Cosmic ray simulation flips random pixels to neon colors that fade back to black over time. 5 visualization modes (Space to cycle): Cosmic (sparse random flips + occasional bursts), Storm (heavy flipping + line glitches), Pulse (expanding rings from center), Rain (falling pixel columns), Chaos (all effects combined + random blocks). 5 color palettes per mode. Click/touch spawns burst. Mouse trail flips pixels. Stats: total flips, rays/sec, entropy ratio. Ambient void drone (beating sine oscillators). Click SFX with pitch mapped to position. Megrim + Martian Mono typography, cyan-on-black void aesthetic.

## features
- Low-res pixel grid with ImageData rendering
- Cosmic ray bit-flip simulation
- 5 visualization modes: Cosmic, Storm, Pulse, Rain, Chaos
- 5 matched color palettes (cyan/magenta, electric blue, warm neon, green/teal, all neon)
- Pixels fade back to black over time (glow decay)
- Click/tap to spawn glitch bursts
- Mouse trail flips pixels on hover
- Line glitches and block glitches in advanced modes
- Expanding ring pulses from center
- Falling pixel rain columns
- Live stats: total flips, rays/sec, entropy ratio
- Ambient void drone (detuned sine beating)
- Position-mapped click SFX
- C key to clear grid
- Space to cycle modes
- Touch support
- Responsive grid sizing

## issues
- None known

## todos
- OG preview PNG
- Sound reactivity mode (microphone input)
- Pixel persistence mode (no fade)
- Screenshot/export feature
