# BSP Lab

## log
- 2026-08-05 v1.2 (`f5b3e50`): **skylight in the demo chamber** per chat — 8 new verts trace a jagged sliver in the ceiling plane wound into an 8-edge face (loop builder now handles arbitrary polygon sizes; plane clamped ≤5), marks/leaf/node/model bumped to 7 faces; +light_environment entity ("skylight crack"). Viewer draws a vertical light curtain + floor pool for `BSP.demo` maps only (flag set by demo button via loadBuffer's isDemo param), behind the wireframe. **Incident**: a stray NUL byte appeared in the source (external tooling — same process that touches screenshots?), which makes grep treat the file as BINARY and silently breaks text-anchor patches; if patches mysteriously stop matching, check `tr -d '\0' | wc -c` vs `wc -c` first. Restored NUL→space. Tests 26/26.
- REMINDER: stamp = FEATURE commit hash (not the stamp commit's own) — three sed mismatches today came from forgetting which hash the current stamp holds; grep the actual `const VER` line before sed.
- 2026-08-05 v1.1: **?url= remote loading** per chat — consent-gated (banner shows host, explicit 'fetch it' click required, NEVER auto-fetch), https-only, 64MB cap (content-length + byteLength), 30s abort, CORS failure message points at raw.githubusercontent.com-style hosts. `remoteUrlFromLocation(search)` pure + tested (25 checks total). No default URL shipped — users bring their own host; do NOT add links to game-file mirrors (copyright + external-link policy).
- 2026-08-05 v1.0: new app per chat — "build a v30 BSP parser from the public Valve spec alone, no external files."
  - **Parser** (`parseBSP`, pure over ArrayBuffer): GoldSrc v30 header (int32 version + 15×{int32 off,len} = 124B), all 15 lumps with spec struct sizes inline: PLANES 20B, VERTICES 12B, NODES 24B, TEXINFO 40B, FACES 20B, CLIPNODES 8B, LEAVES 28B (contents histogram −1 empty/−2 solid), MARKSURFACES 2B, EDGES 4B, SURFEDGES int32 (sign = direction), MODELS 64B; ENTITIES = null-terminated text → `parseEntities` kv blocks; TEXTURES = count+offsets → miptex headers {name[16],w,h,offsets[4]}, embedded iff offsets[0]≠0. Bounds-checked lumps; version-mismatch errors name what it probably is (29 = Quake, 19-21 = Source VBSP).
  - **facePolygon**: face → vertex loop via signed surfedges (negative = walk edge b→a).
  - **"No external files"**: `buildDemoBSP()` synthesizes a valid-for-our-parser 1.1KB v30 cube room IN MEMORY (8 verts, 12 edges + reserved edge 0, 6 quad faces w/ shared-edge sign-flip reuse, 6 planes, worldspawn+spawn+light entities, LABCRETE miptex, model, 2 leaves, marksurfaces, node, clipnode). Not claimed engine-loadable — it's a parser exercise target.
  - **Viewer**: 2D-canvas wireframe (all edges, depth-alpha, >24k edges auto-sampled with HUD note), z-up orbit (drag) + wheel zoom + idle spin, entity-origin overlay toggle (cyan dots + classnames). Tabs: LUMPS table / ENTITIES browser (classname list → kv inspector) / TEXTURES (embedded vs WAD badges), live filter.
  - Aesthetic: lambda-orange on dark slab, hazard-stripe bg, Oxanium + IBM Plex Mono.
  - Tests: bsp-test.js — 20 checks: synth→parse roundtrip on every lump, face reconstruction, entity edge cases, truncated/wrong-version/lump-overrun errors. Real-map validation needs chat to drop an actual HL map (crossfire.bsp etc.) — sandbox has none, by design.

## issues
- VIS/LIGHTING lumps are surfaced by size only (no decompression/preview yet).
- Textures: names+dims only, no pixel decoding of embedded miptex (palette after mip data — doable later).

## todos
- Embedded miptex → canvas preview (palette at offsets[3]+w*h/64… + 2-byte pad).
- Face rendering mode (filled polys, painter-sorted) as alternative to wireframe.
- WAD3 parser as sibling feature — chat may ask.
