# Minecraft 3D (block builder)

## log
- (pre-2026-09) three.js r128 voxel world: WASD + mouse look, left click mines, right click places, 6 block types (1-6), invert-colours toggle.
- 2026-09-26: removed the old "Built live at | View All Apps" footer (it sat over the HUD, top-left). Real og.png (floating island, Silkscreen "BLOCK WORLD 3D" overlay; camera angled via the top-level mouseX/mouseY lets in the test copy) — og:image used to point at a missing minecraft-preview.png. Emoji dropped from <title>/og:title (favicon covers it).
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD, hidden h1.
- 2026-09-26: touch controls — stick (bottom-left) to walk, drag the world to look, quick tap mines/builds at the crosshair, ⛏️/🧱 button switches mode, JUMP button; keyboard help panel hidden on touch; one-time touch hint (localStorage minecraft_howto_seen). Desktop fixes: mouse-right used to turn the view LEFT (mouseX sign), camera Euler order now YXZ (no horizon tilt), right-click placing never fired (browsers don't send 'click' for the right button → now mousedown), clicking the inventory/buttons no longer mines a block.

## issues
- touch: tap = act at the crosshair (not under the finger) — like Minecraft PE's crosshair mode. Tested with synthetic Touch events in headless.

## todos
- save the world to localStorage.
