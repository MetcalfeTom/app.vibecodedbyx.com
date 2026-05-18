# obj-forge · notes

## log
- 2026-05-18: v1.1 — **clear-image button + hardened drag-drop**. Per chat ask. Image dropzone now wraps in `.dz-wrap` so the loaded state shows a `× clear image` ghost-button beneath the label (its own click stops propagation so it can't accidentally re-open the file picker through the label). Drag handling rewritten with a depth counter (dragenter/leave increment/decrement, only remove the `drag-pulse` highlight at depth 0) — fixes flicker when the cursor crossed the thumbnail img inside the label. New `pickFirstImage(dataTransfer)` walks `files` then `items` and prefers the first image-typed entry, so multi-file drops or weird drag sources still find the image. `isImageFile()` accepts `image/*` mime OR extension match (png/jpe?g/webp/gif/bmp/tiff). 12MB cap + min 4×4 dimension check with toast on failure. File-input gets `value = ''` after change so re-picking the same file fires the listener. Window-level dragover/drop preventDefault (skipping targets inside `.dropzone`) stops accidental drops outside the zone from navigating the tab to the file. Dropzone meta line now also shows file size. Added `.drag-pulse` keyframe for visible drag feedback. Bumped file ~37→~40KB.
- 2026-05-18: v1 — **procedural 3D mesh generator with .obj export + image-to-heightmap**. Single file ~37KB, three.js r128 + OrbitControls from unpkg, inline OBJ writer.
  - **9 shape builders**: Crystal (jagged icosahedron) · Gear (extruded toothed shape with hole) · Rock (fbm-displaced sphere) · Helix (TubeGeometry on CatmullRom helix) · Twist (twisted+tapered box) · Terrain (fbm-displaced plane) · Shroom (capped half-sphere + cylinder via mergeGeometries) · Pod (superellipsoid via parametric sweep with `sgn(x)*|x|^(2/n)` exponent) · **Heightmap** (image upload → canvas-sampled luminance → vertex grid).
  - **Per-shape params** as range sliders (3-4 each) that live-rebuild on input with 30ms debounce. Each shape has its own param state dict so switching back preserves your tweaks.
  - **Heightmap dropzone**: file input + drag-drop, FileReader → Image → drawn to offscreen canvas at chosen resolution (16–256), luminance `(0.299R + 0.587G + 0.114B)/255` becomes Y, X/Z spread across `size` units. Invert toggle as a 0/1 slider. Preserves loaded image in state; shows file thumbnail in the dropzone once loaded. Without image, renders a flat placeholder plane.
  - **Seeded value noise** (`hash3` → trilinear-smooth-lerped `noise3` → 4-5 octave `fbm`) drives rock + terrain so reseed button gives new variants.
  - **OBJ writer**: emits `o name`, vertices (`v x y z`), normals (`vn x y z`), faces (`f a//na b//nb c//nc` with normals if present, else `f a b c`). Handles both indexed and non-indexed BufferGeometry. Drops trailing zeros via `parseFloat(n.toFixed(6))`. Filename = `<shape>-<ISO-timestamp>.obj`.
  - **Scene**: dark navy radial bg, orange key light + cyan fill + faint white rim, 20-unit grid floor at y=-1.5, axis helper. MeshStandardMaterial flatShading=true so faceted shapes read crisp. Wireframe overlay (toggle) adds cyan LineSegments child on the mesh.
  - **Controls**: OrbitControls (damping 0.08), auto-rotate toggle (Y axis 0.005/frame). Keyboard shortcuts: `e` export, `w` wireframe, `r` reset camera, `Space` toggle auto-rotate.
  - **HUD** shows live `verts · tris · ~KB` (file-size estimate `verts*50 + tris*30` bytes). Toast for export/reseed/heightmap-load events.
  - **Aesthetic**: CAD blueprint vibe — JetBrains Mono everywhere, Major Mono Display for the `obj·forge` title, dark navy bg with faint cyan 48px grid lines, orange (#ff7a3d) action accent + cyan (#5ee3ff) data accent. Brutalist sliders with monospace value readouts. 3-col shape picker grid.
  - **WCAG**: semantic main/aside/header/h1-2, role="radiogroup" on shape grid + aria-checked, role="application"+aria-label on canvas, role="status"+aria-live on toast, focus-visible outline 2px cyan, prefers-reduced-motion kills transitions, ≥2.75rem buttons. 760px breakpoint reflows to viewport-on-top + panel-below.
  - **OG image** via Pollinations flux (no `referrer` param per project notes).

## issues
- Image upload stays in memory — bigger images at 256-res take ~50ms to rebuild on each slider drag (acceptable but noticeable).
- Heightmap normals from `computeVertexNormals()` look soft on grayscale gradients; consider edge-aware shading later.
- No texture coordinates emitted in OBJ; Blender will fall back to default UV. Add `vt` + `f a/t/n` triplets later if anyone wants textured exports.
- Smooth-shading flag (vs the current flat) would be nice as a toggle.
- File-size estimate is rough — actual OBJ tends to be smaller after decimal-stripping.

## todos
- Material/MTL companion file with the current color/roughness baked in.
- Cube · Sphere · Torus · Capsule as basic primitives in a separate "basics" row.
- Multi-mesh export (place several shapes, export combined .obj with `o` groups).
- Decimation slider (mesh simplification before export).
- glTF export alongside OBJ.
- Per-vertex color export for terrain (height-based gradient → vertex colors in OBJ extension).
- Save/load preset combos (shape + params) to localStorage.
- Drag-rotate handle inside the viewport so touch users can orbit without OrbitControls touch quirks.
