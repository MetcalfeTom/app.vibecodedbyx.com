# Neon Sand

Falling sand physics sandbox with neon particles and material interactions.

## log
- 2026-03-20: Initial build. 7 materials: Sand (granular, slides), Water (liquid spread), Lava (heavy, ignites, turns water to stone, melts sand), Stone (static), Acid (dissolves non-stone materials), Gas (rises, spreads, flammable), Fire (rises, dies, ignites gas). Pixel grid with 3px scale, Uint8Array grid. Alternating left/right scan for natural spreading. Circular brush with adjustable size (1-12). Glow pass via lighter composite mode. Touch and mouse painting. Chakra Petch + Share Tech Mono typography, pink/dark aesthetic.

## issues
- None yet

## todos
- More materials: ice, wood, oil, smoke
- Temperature system
- Save/load sandboxes

## notes
- No database — pure frontend
- Grid is Uint8Array, 3px per cell
- Bottom-to-top simulation for gravity
- Alternating LR scan prevents directional bias
- matColor uses deterministic variation (x*7+y*13) for texture, random for lava/fire flicker
- Lava+Water=Stone, Lava melts sand (1%), Fire+Gas=more Fire, Acid dissolves on contact
- Gas dissipates slowly (0.2%), Fire dies at 8% per frame
- Render: putImageData at 1:1 then drawImage scaled, plus lighter composite glow
- Brush paints with 70% fill density for natural look
