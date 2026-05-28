# Neon Sand

Falling sand physics sandbox with neon particles and material interactions.

## log
- 2026-03-20: Initial build. 7 materials: Sand (granular, slides), Water (liquid spread), Lava (heavy, ignites, turns water to stone, melts sand), Stone (static), Acid (dissolves non-stone materials), Gas (rises, spreads, flammable), Fire (rises, dies, ignites gas). Pixel grid with 3px scale, Uint8Array grid. Alternating left/right scan for natural spreading. Circular brush with adjustable size (1-12). Glow pass via lighter composite mode. Touch and mouse painting. Chakra Petch + Share Tech Mono typography, pink/dark aesthetic.
- 2026-05-28: Added 4 new materials (WOOD, OIL, SMOKE, ICE) — knocks out the entire wood/oil/smoke/ice todo and broadens the "different coloured grains" palette. **WOOD (8)**: warm-brown static block with grain-noise texture (deterministic checker pattern via `((x*3+y*5)>>1)&7`). Flammable — adjacent FIRE has 4% per-frame ignition chance, adjacent LAVA has 8%. Burning fire occasionally spawns SMOKE above where wood was. **OIL (9)**: dark-amber slow heavy liquid that's LIGHTER than water — when oil sits on water it actively swaps upward each tick so layered water+oil naturally stratify. Highly flammable: adjacent FIRE has 50% ignition chance (vs 30% gas, 4% wood), adjacent LAVA 45%. Treated as a liquid by `isLiquid()` so sand sinks through it. **SMOKE (10)**: dark-grey flickering rising particle, faster decay than gas (1.8% vs 0.2%). Non-flammable. **ICE (11)**: pale cyan static block, melts to WATER on contact with FIRE (18% per adjacent fire) or LAVA (10% from LAVA-side, 18% from ICE-side — bi-directional). Extended `isLiquid` to include OIL; new `isFlammable` helper. LAVA's per-frame side-effect block now also ignites adjacent WOOD/OIL at 4% and melts adjacent ICE at 10%. Fire's spread loop unified into a single neighbour scan branching per neighbour-material. 4 new buttons in the toolbar with hue-matched dot swatches. matColor switch extended with 4 new cases.

## issues
- None yet

## todos
- Temperature system (each cell carries a heat value, transferred to neighbours per tick, fire/lava raise it, ice lowers it; melting/freezing/burning thresholds derived from temperature rather than per-rule random chance)
- Save/load sandboxes (serialize Uint8Array + metadata to localStorage or sharable URL hash)
- Snow material (lighter than sand, slower fall, freezes water on contact)
- Plant/seed material that grows into wood when water+light adjacent
- Per-material density table so all liquids stratify naturally (currently only oil/water is implemented explicitly)

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
