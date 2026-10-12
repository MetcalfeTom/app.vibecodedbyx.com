# Heidelberg Blocks — notes

iamflax's (Flax) idea, 2026-10-11 23:14 UTC: "a minecraft world of Heidelberg/Germany old bridge in 3d to walk over".
Our own blocky art: never use the Minecraft name, textures or logos in the app.

## log
- v1.0 2026-10-11: first walkable version. Voxel world 256x256x80 built in code (seeded): the Neckar running east-west,
  the Old Bridge (9 arches, piers with pointed cutwaters, low parapets, paved deck), the bridge gate (two white round
  towers with slate helmets + gate house), old-town rows on the south bank, Neuenheim villas on the north bank,
  wooded autumn hills. First-person walking: WASD/arrows, Shift run, Space jump, Q/E turn, pointer lock;
  phones: left-half stick, right-half look, jump button. Swim in the Neckar, swim into a quay wall to climb out.
  Compass tape + place label, golden hour / midday / night button.
- v1.1 2026-10-12: castle ruin on a terrace up the SE hill (gate tower, Dicker Turm, half-ruined Pulverturm with the
  fallen chunk, roofless Ottheinrichsbau shell, wings with slate roofs, moat), two-flight castle stairs from the old
  town; Heiliggeistkirche (steep dark roof, belfry + baroque helmet + gold ball) and the Herkules fountain on the
  Marktplatz; the Bridge Monkey (mini-voxel bronze, rub mirror / fingers / mice with 1-3 when near, luck toasts,
  'hb-luck' in localStorage) + sign; Philosophers' Walk along the Heiligenberg with the Snake Path switchbacks up from
  the bridge (no trees on the valley side so the view stays open); far hills beyond the map edge (8-block skirt).
  Greedy strips: faces merge along their u axis (same tile + flat AO), the block shader repeats tiles with fract() +
  textureGrad and adds the per-block shade from the world position. og.png (1200x630 headless shot of the bridge).
  Fannar's bug fixed: swimming into the map edge (or diagonally into it) climbed forever into the sky. Now the edge is
  a plain wall (blockB 255 never climbs) and swim-climbing stops at street level (P.y < TOWN+.6).
- v1.2 2026-10-12: night fireworks over the Neckar (Flax's idea). Only in the 🌙 night preset (off with
  prefers-reduced-motion): a show of 10-12 shells + a 6-shell finale, then a 14 s pause, repeating. Shells rise from the
  river with ember trails; peony / willow (crackles) / tilted ring / two-colour bursts in warm colours (gold, orange,
  red, amber, warm white) with a white-hot start. Shells are aimed at the stretch of river you are looking at (best of
  7 random spots over the water, 38+ blocks away) so the show is never behind you. Reflections: each particle's mirror
  image, squashed toward the horizon (x .32, rippled water), drawn where the line of sight meets the water, only over
  the river, as short vertical streaks with a shimmer. Two pooled Points clouds (560 each, one ShaderMaterial + a STREAK
  clone), no lights: +2 draw calls at night, no triangles. Best seen from the Neckarwiese by the water.
- v1.3 2026-10-12 01:40: fannar22's bug: swimming into a quay wall or a bridge pier climbed it to street level. Now only
  low banks (the Neckarwiese meadow) can be climbed from the water (climb needs P.y<WATER+1.6 and a free cell at WATER+2
  ahead); 9 stone river steps (buildSteps, 11 steps, 2 wide, cobble treads) against the quays, 6 south + 3 north east of
  the bridge, placed last so they skip spots with a house at the landing; a toast points to the nearest steps after 1 s
  against a tall wall (once per 20 s). Probe hm/hb_steps.js (all 9 flights reach the quay, quays/piers/edges max 10).

## issues
- fannar22 2026-10-11 23:50: rising into the sky at the east/west map edge in the river (fixed v1.1, probe hb_edge.js).
- pathLine drop walls: a one-block drop must not get a parapet (blocked the Snake Path entry from Brückenstraße).

## todos
- red castle glow during the fireworks (the real Schlossbeleuchtung), optional bang sounds after a tap
- Jesuit church, Marstall, Karl Theodor statue on the bridge, castle garden (Hortus Palatinus), Königstuhl funicular
- real phone test of the touch stick + look; real GPU fps

## art direction
- 1 block ≈ 1 m-ish but the bridge is shortened: 9 arches of span 7 + piers of 3 = river 87 blocks wide (z -43..43).
- +x = east, +z = south (camera yaw 0 looks north). Centre line of the bridge is x = 0.5 (cell 0).
- Water surface y=11 (one big transparent plane; terrain hides it), town + bridge deck walking level y=19.
- Golden hour default: sun from the WNW at 10° so the faces you see from the bridge (north + west) are lit.
- Palette: red sandstone (#b8523a ashlar), white plaster towers, slate #46505e helmets, roof tile #bf5130,
  autumn leaves (green + yellow + rust). Fonts: UnifrakturMaguntia (title only) + Pixelify Sans (UI).
- Meshing: 64 chunks of 32x32 columns, face culling + vertex AO, one Lambert material with a 128x64 canvas atlas
  (NearestFilter, NearestMipmapLinear) + an emissive atlas for lit windows at night.

## budget (headless SwiftShader, 1280x720, spawn view)
- v1.0: 432k triangles in the whole world, 216k drawn in the spawn view, 34-35 draw calls; gen 195 ms + mesh 465 ms.

- v1.1: 292k triangles in the whole world (469k before greedy strips). Busiest view = Philosophers' Walk looking
  south at the town: 248k drawn / 69 calls; spawn 181k / 45; castle courtyard looking north 212k / 58.

## testing
- scratch: $SP/hb (index.html + mk.sh injects window.__G/__E into gaunt/sw/hm43/hb). The live file only has a
  /*HOOK*/ marker comment. Probes step G.physics(1/60, G.inp) directly (headless fps is low).
- probes in $SP/hm: hb_walk.js (waypoint bot: castle, Snake Path + Philosophers' Walk, monkey rub), hb_edge.js
  (swim into every map edge + quays, log max y), hb_p5.js (tris/calls from 11 viewpoints), view.sh (any viewpoint).
