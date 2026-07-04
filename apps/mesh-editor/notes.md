# mesh-editor (Mesh Editor)

## log
- 2026-07-04: shipped (chat asks ×2, same request: "simple 3D mesh editor in plain HTML where users place vertices and connect them into faces / vanilla, no libraries"). **ZERO libraries** — hand-rolled software 3D on Canvas 2D (verified: no external <script src>).
  - **Camera**: orbit rig around the origin (yaw/pitch/dist), perspective projection (`proj`: rotate world→camera, `s=FOV/z`). Drag rotates (pitch clamped ±1.35), wheel zooms 2.5–40.
  - **Vertex placement**: `screenToGrid` builds a screen ray in camera space, rotates it back to world with the inverse orbit basis, intersects the Y=0 plane — verified standalone: center-screen ray hits (0,0,0) exactly. Add-vertex mode clicks land points on the grid.
  - **Editing**: select mode multi-selects vertices (screen-space hit-test 14px; shift-click deselects; selection order numbered on the gold rings). **Make face** connects 3 or 4 selected verts (tri/quad, in selection order). Drag a vertex = slide on XZ via the same grid raycast; **shift-drag = height** (screen dy ÷ projection scale); off-grid verts show a dashed drop-stalk to their base. Delete removes selected verts + any face touching them (with index remapping). Undo = 40-deep snapshot stack (Ctrl+Z). Keys 1/2/3 = modes, F = face.
  - **Render**: painter's-sorted faces (centroid depth), flat shading from the world normal (|n·light|, double-sided) in blue HSL, wireframe overlay, blue/gold axis lines in the 11×11 grid, depth-independent vertex dots.
  - **Persistence**: mesh autosaved to localStorage. **Sample** button loads a 9-vert house (cube + pyramid roof, quads + tris). **⬇ .obj export**: real Wavefront OBJ (v/f lines, 1-indexed) via Blob download — opens in Blender.
  - WCAG: toolbar with aria-pressed modes, role=status HUD, focus-visible, keyboard mode switching.
  - Verified: JS syntax OK, zero ext scripts, all ids present, raycast math unit-checked.

## issues
- Painter's algorithm can misorder intersecting/large faces (classic limitation without a z-buffer) — fine for small meshes this tool targets.
- Quads are exported as quads in OBJ (legal); concave or non-planar quads may shade oddly.
- No touch pinch-zoom yet (wheel only); orbit + tap modes work on mobile.

## todos
- Pinch zoom + two-finger orbit on touch.
- Edge-only (2-vert) connections rendered as struts.
- OBJ import (paste).
- Vertex snapping / grid quantize toggle.
