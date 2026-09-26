# Moon Explorer

## log
- (pre-2026-09) three.js r128 lunar surface: WASD + mouse look, jump, 20 coins, Earth in the sky, a blocky red-cap buddy standing around, Look at Earth / Reset View buttons.
- 2026-09-26: "Look at Earth" turned you exactly AWAY from Earth — yaw used atan2(x, z) but the camera faces -z at yaw 0 (rotation order YXZ); now atan2(-x, -z). Real 1200×630 og.png (Earth over the horizon, Orbitron title) — the old og was a 160×160 preview.png.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

## issues
- keyboard + mouse only; no touch controls.

## todos
- touch controls; Earth texture (it's a flat blue sphere); a coin-collect sound.
