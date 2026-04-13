# Laser Sand

Two yellow laser tracers race around your screen dropping falling sand particles.

## log
- 2026-04-13: Removed all sand physics/rendering. Thin laser beams (1.2px core) with long 120-point tails. Tracers on opposite sides. Clean minimal code.
- 2026-04-13: Synced both tracers — same direction (clockwise), tight 3% offset so they chase each other along the same path.
- 2026-04-13: Reduced speed to ~15% multiplier (slow steady crawl), kept strictly yellow, removed color options per user request. Added mode toggle button.
- 2026-04-13: Increased tracer speed 3x+ and longer trails for a constant visible border loop feel.
- 2026-04-13: Initial build. Fullscreen canvas, two parallel laser tracers (clockwise + counter-clockwise) leaving glowing trails. Sand physics simulation on pixel grid — particles fall, slide left/right, pile up naturally. 3 tracer modes: border loop, diagonal bounce, spiral. Click to switch modes, scroll to adjust speed. Sand slowly dissolves at bottom to prevent infinite buildup. Yellow/gold color palette with glow effects. ImageData-based sand rendering for performance.

## features
- Two parallel laser tracers with glow trails
- Falling sand particle simulation (pixel grid)
- Sand physics: fall, slide, pile, settle
- 3 tracer modes (border, diagonal, spiral)
- Click/tap to switch modes
- Scroll to adjust speed
- Sand dissolves at bottom edge
- Fullscreen immersive display
- Resize-safe with sand data preservation
- Touch support

## issues
- Performance may drop on very high-res screens (large pixel grid)
- Sand buildup can get heavy with extended use

## todos
- OG preview PNG
- Color modes (blue, green, rainbow)
- Mouse interaction to push sand
- Multiple sand types (different fall speeds)
- Wind effect
