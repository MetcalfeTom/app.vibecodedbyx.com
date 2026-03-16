# Lava Sim

Realistic 2D lava simulation with fluid physics, heat, and particles.

## log
- 2026-03-16: Initial build. Grid-based cellular automata fluid sim at 4px cell resolution. Lava flows with gravity, spreads diagonally and sideways like real liquid. Heat system: lava spawns white-hot (1.0), cools over time, solidifies into obsidian at 0.05. 4 color temperature stages: white-yellow (>0.75), orange (>0.45), dark red (>0.2), cooling brown. Heat flicker via sin wave. 4 tools: Pour (add lava with adjustable flow rate), Rock (place solid obstacles), Cool (rapidly chill lava into obsidian), Bomb (explosive force that flings lava + destroys rock). Velocity system for bomb physics. 3 particle types: embers (rise from hot surface, gravity + glow), glow particles (subtle heat haze), smoke (rises from solidifying lava, expands + fades). Additive glow pass on hot regions. Rock has procedural texture noise, obsidian has dark sheen. Flow rate and viscosity sliders. Resize-safe (preserves simulation data). Boom sound effect (sawtooth sweep + noise crackle). Touch support. Saira Stencil One + Share Tech Mono typography, dark volcanic palette.

## issues
- None yet

## todos
- Water interaction (steam explosion when lava meets water)
- Lava source blocks that continuously emit
- Gas/bubble pockets that pop at surface
- Temperature readout on hover

## notes
- No database — pure frontend
- Grid: CELL=4px, Uint8Array for cell types, Float32Array for heat + velocity
- Cell types: 0=air, 1=lava, 2=rock, 3=unused, 4=obsidian
- Sim order: bottom-up for gravity, alternating L/R scan to prevent directional bias
- Movement priority: down → diagonal down → sideways (liquid spread)
- Viscosity slider: affects damping (0.15x factor) and spread probability
- Heat: -0.0003/frame base, -0.0005 extra with air above, solidify at <0.05
- Embers: 0.3% chance per hot surface cell per frame, gravity 0.06
- Smoke: 30% chance on solidification, expand radius over lifetime
- Glow pass: additive composite, arc radius = CELL*3*glowFactor, every 2nd cell
- Bomb: radial velocity push (force = 3/dist), 40% rock destruction chance, 40 ember burst
- Pixel buffer: ImageData for fast cell rendering, then canvas overlay for particles
