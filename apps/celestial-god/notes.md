# Celestial God

A cosmic sandbox where you drag stars, spawn black holes, and watch tiny planets get consumed.

## log
- 2026-03-12: Initial build. Canvas N-body gravity sim with 5 tools (Star, Planet, Black Hole, Nebula, Drag). Stars glow/pulse with rays, planets orbit with trails, black holes have accretion disks + lensing rings + consumption mechanics. Nebula painting with gaussian clouds. Burst particles on consumption. HUD with entity counts. Cormorant Garamond + JetBrains Mono typography, dark cosmic palette.

## issues
- None yet

## todos
- Could add star collision/merger effects
- Sound effects for black hole consumption
- Galaxy formation presets

## notes
- No database — pure frontend sandbox
- 5 tools: Star (click), Planet (click, random velocity), Black Hole (click, shockwave), Nebula (drag paint), Drag (move stars/blackholes)
- Physics: gravitational attraction, black hole consumption (planets + stars), black hole merging
- Stars have glow, pulse, and ray rendering; black holes have gradient event horizon + lensing ring + accretion disk
