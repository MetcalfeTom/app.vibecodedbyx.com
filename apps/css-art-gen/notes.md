# CSS Art Generator

Type any prompt and get a wacky abstract CSS art masterpiece instead of a real image.

## log
- 2026-03-15: Initial build. Prompt-to-CSS-art generator using seeded RNG (mulberry32 from string hash). Parses words for 3 dimensions: colors (30+ keyword mappings to palettes), shapes (7 types: circle, square, triangle, line, blob, diamond, star), and mood (20 keywords controlling layer count, rotation, skew, animation speed). Generates layered div elements with gradients, blur, mix-blend-modes, clip-paths, border-radius morphing. 5 CSS animations (spin, float, pulse, warp, drift) assigned per mood. Gallery of cards with prompt header, art frame (4:3), art title with museum-style captions, seed hex, regenerate button. Max 10 cards. Random starter prompt on load. Instrument Serif + Space Mono typography, dark background with subtle radial gradients, pink-to-blue gradient accents.

## issues
- None yet

## todos
- Download as image (html2canvas or screenshot API)
- Share prompt links (URL hash)
- Favorite / save gallery to localStorage
- More shape types (hexagon, cross, spiral via conic-gradient)
- Word combination effects (e.g. "fire" + "ice" = split composition)

## notes
- No database — pure frontend
- Seeded RNG: mulberry32 from charCode hash, deterministic per prompt
- Color keywords: 30+ mappings (red, ocean, cosmic, toxic, pastel, etc.)
- Shape keywords: 40+ words mapped to 7 shape types
- Mood keywords: 20 words controlling layers (3-30), speed (0.1-4), rotation, skew
- Default mood: 12 layers, speed 1, rotate on, skew off
- Shapes: absolute positioned divs with %, gradients, clip-paths
- Mix blend modes: normal, multiply, screen, overlay, color-dodge, hard-light
- Blur: 0-15px random per element
- Gallery max: 10 cards, oldest removed
- Regenerate uses text + Date.now() for different seed
