# Honeycomb Drift

Asked for by Tatum (2026-10-02 10:21 UTC): "is there a list of 3D equivalents of tesselations?" then "could you make a visualization so people can experience being inside them?"

## Art direction
- Look: neon wire in the dark. Additive-blended edges (core + soft glow, at least 1 px), glass walls that only show at grazing angles, fog to black.
- Palette: near-black #05060c, cream ink #f3ecdf, one hue per cell site (amber, sky, mint, coral, gold, aqua, violet, lilac, lime).
- Camera: first person, fov 75 (88 in portrait), rooms ~2.6 m across.
- Type: Gloock (display serif, museum placard) + Azeret Mono.

## How it works
- Every honeycomb is the Voronoi partition of a periodic point set (lattice vectors A, sites in fractional coords). voronoi() clips a box by the bisector planes of nearby site images; node test: volumes sum to the cell volume, face counts right (cube 6, Kelvin 14, rhombic 12, hex prism 8, elongated 12 = 8 rhombi + 4 hexagons, Weaire-Phelan 2x12 pentagons + 6x14).
- One InstancedMesh per site, a block of translations within FAR + reach of the central cell. The camera wraps back into the central cell (frac coords via the reciprocal rows B); the room key is shifted on wrap so "rooms crossed" doesn't count wraps.
- Edges in the fragment shader: each face is a fan from its centroid, attribute dEdge = 0 on the outer edge and the centre-to-edge distance at the centroid, so the interpolated value is the exact world distance to that edge.
- The current room = nearest site (that's what a Voronoi cell is), passed as uCur; its walls glow.
- Weaire-Phelan here is the flat-walled A15 Voronoi version; the real foam has slightly curved walls.
- Budget: Weaire-Phelan 8 draw calls, 77k triangles; Kelvin 2 calls, 63k.
- Test hook window.__HC (go, step, render, info, look, setDrift). Headless: drive step() by hand.

## log
- v1.1.1 (2026-10-02): the auto preview (800x450) was half placard with the hint on top of it: screens under 620 px tall start with the fact folded (about opens it) and a slimmer placard; the hint sits at 36% height.
- v1.1 (2026-10-02): "save png" button (Tatum: "can you add a button to export the image as a PNG"). Re-renders the view at up to 2x (long side capped at 3000 px), copies the WebGL canvas in the same task (no preserveDrawingBuffer needed), adds a caption (name + cell type) and downloads honeycomb-<name>.png; on touch devices with file sharing it opens the share sheet instead (Save Image on iOS). White flash + status toast.
- v1.0 (2026-10-02): six honeycombs (Kelvin foam, cubes, rhombic dodecahedra, hexagonal prisms, elongated dodecahedra, Weaire-Phelan), drift / drag-look / WASD + space/shift / hold-to-fly on touch, rooms-crossed counter, placard with a fact that folds away after 14 s, reduced motion = no drift or fade.

## todos
- Non-Voronoi honeycombs: tetrahedra + octahedra (alternated cubic), gyrobifastigium, triangular prisms, the 28 uniform ones.
- An outside view: one room spinning, then zoom in.
- Phone tilt to look (DeviceOrientation, needs a permission tap on iOS).
- Adaptive quality if phones struggle (fewer instances, pixel ratio 1).
