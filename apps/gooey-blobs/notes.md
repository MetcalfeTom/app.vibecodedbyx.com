# Gooey Blobs

## log
- 2026-03-29: V1 — CSS filter gooey effect. SVG feGaussianBlur (stdDeviation 18) + feColorMatrix (alpha 28/-10) creates metaball merge effect on regular DOM divs. 12 initial blobs with radial gradient fills. Physics: wobble (sine), buoyancy (large blobs sink, small rise), boundary bounce, damping. 6 color themes (lava, ocean, acid, plasma, solar, mono). Tap/click/drag to spawn blobs (max 60). Gravity toggle (lava lamp vs free float). Megrim + Fira Code typography.

## features
- CSS filter gooey effect (SVG blur + color matrix)
- Blobs are regular DOM divs with border-radius 50%
- Radial gradient fills with highlight
- Physics: velocity, wobble, buoyancy, damping, boundary bounce
- Buoyancy: smaller blobs rise, larger sink (lava lamp behavior)
- 6 color themes: Lava, Ocean, Acid, Plasma, Solar, Mono
- Tap/click to spawn new blobs
- Click-drag / touch-drag for rapid spawning
- Max 60 blobs (removes oldest when exceeded)
- Gravity toggle (buoyancy vs free float)
- Clear + respawn button
- Theme cycling recolors existing blobs

## issues
- None currently

## todos
- Blob size slider
- Blur amount control
- Mouse attraction/repulsion mode
- Sound on blob merge (proximity)
- Screenshot/export

## notes
- Key CSS filter: feGaussianBlur stdDeviation=18, feColorMatrix alpha values 28/-10
- This creates the "threshold" effect where blurred circles merge seamlessly
- feComposite atop brings back original colors onto gooey shape
- Blob positions via transform:translate for GPU compositing
- Wobble: independent X/Y sine waves with random frequency/amplitude
- Speed capped at 3px/frame, damping 0.998
- Buoyancy formula: (50 - blobSize) * 0.001 — blobs < 50px rise, > 50px sink
