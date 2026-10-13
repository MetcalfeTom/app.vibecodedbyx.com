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
- v1.4 2026-10-12 01:47: fannar22: past the east/west border the scenery didn't line up along the water (8-block skirt cells
  put the far river 3-4 blocks narrower and stood house walls in it). Skirt cells within 48 blocks of the border and
  RIVER_HALF+22 of the river are now built per block from terrainH (water, quay rows, street, 8-wide house lots with
  roofs, meadow), side faces vs coarse neighbours use the min edge height; stepped quay faces share one normal (no
  stripes); coarse cells beside the river are flat quay, meadow no longer gets houses. Busiest view 258k tris / 69.
- v1.4.1 2026-10-12 01:59: fannar22: the south-east edge still didn't line up. terrainH used a fixed hill line (78) past the
  border while the map used hillS (60 east, ~110 west); now hillS everywhere, so the hills meet at both borders. 258k / 69.
- v1.4.2 2026-10-12 02:08: fannar22: walking along the west border, the backdrop looked hollow (floating slabs on
  stilts). The skirt never drew faces toward the map, so wherever it stood higher than the map's edge you saw under it.
  Now faces toward the map go down to clamp(terrainH) of the map's edge columns (mapMin/mapH). Viewpoint tip: views
  at y=21 on hill cells put the camera underground (looks like hills hanging from the sky) - pick town cells.

- v1.5 2026-10-12 ~11:40: Flax asked for characters, dialogue, easter eggs and a German setting (first step; boats, ferry,
  more fireworks and an hour of content are the big build after the weekly reset). Five townsfolk (one merged
  vertex-coloured box mesh each, turn to face you within 9 blocks, F / 💬 button within 3.3 to talk, dialogue box,
  tap/F to go on): Lotte the Stadtführerin with a red umbrella at the Brückentor (quest giver), Perkeo the Hofnarr at
  the top of the castle stairs, Professor Grübel on the Philosophenweg, Kapitän Jupp on the north bank (teases the
  boat tour), Greta selling Brezeln by the Herkules fountain. Studentenkuss hunt: 5 spinning pink chocolates (bridge,
  castle terrace, Schlangenweg, far west Philosophenweg, a river step south-east of the bridge); 'hb-quest' in
  localStorage {found, done, met}; 🍫 n/5 chip under the place name. All five + Lotte = Ehrenstudent + grandShow():
  night falls, 3 waves of 5 shells, a run of 12, a 9-shell finale with a screen-wide golden flash (#wow); Lotte replays
  it after. Place names in German (Alte Brücke, Brückentor, Schloss, Philosophenweg, Schlangenweg, Altstadt,
  Neckarufer, Brückenaffe); dialogue English with German words. Spots come from the built world (spot()), probe
  hm/hb5a.js + hb5b.js (positions + full hunt). The song Flax asked for stays out (lyrics still under copyright).

- v1.6 2026-10-12 ~23:25: town sound (Flax's backlog, the app had no audio). All synthesized with Web Audio, NO music loop
  (the river carries the mood). Starts with the Start click (gesture) and fades in over ~2 s; 🔊/🔇 button under the time
  button + M key, remembered in 'hb-sound' ('0' = off, default on); the context suspends when muted or the tab is hidden.
  River: seamless brown + white noise loops, level by distance to the water's edge (|z-riverZ|-RIVER_HALF, fades over 50 m and
  up the hills). Footsteps one per ~1.7 m (own phase, works with reduced motion): stone/cobbles = bandpassed tick, bridge deck
  (cobble on |x-.5|<3.6, |z|<44.5) = hollow wooden knock (noise + falling triangle 150 Hz), plank/log = wood, gravel = 3 grits,
  grass/dirt = soft, sand, swimming = slow splash; landings after a fall >~1.6 blocks are heavier. Wind = bandpassed noise with
  gusts, from TOWN+10 up to the castle. Slap echo (130 ms delay, feedback .36) in the bridge gate passage and when swimming
  under the arches. Under water the master goes through a 480 Hz lowpass. Night preset: cricket trills + an owl every 30-70 s.
  Church bell at the Heiliggeistkirche belfry: German quarter strikes (1-4) on a small bell + the hour (1-12) on the big bell
  at the visitor's local clock, both ~38 cents flat, the tierce a touch sour; distance + stereo pan from the belfry.
  A cellar reverb send (convolver, 2.3 s) is already wired for the Great Barrel (S.caveLevel). G.SND = the module.

- v1.6.1 2026-10-12 23:38: Flax 23:24 "no sound" (Android Galaxy, tapped, refreshed). Not reproducible headless (context runs there), so
  made it robust: every touchend / pointerup / click / keydown / pointerdown (capture, while started) resumes the context synchronously
  and plays a 1-sample silent buffer until it runs; a "🔊 Tap for sound" pill under the 🔊 button shows while sound is on but the
  context isn't running. Small speakers: the river got a 320-1300 Hz 'flow' band that swells + a louder 2.4 kHz fizz, and day/golden
  hour has sparrow chirps (2.6-4.4 kHz) every 2-8 s, so standing still at the spawn is audible on a phone. Measured at the spawn
  (analyser on the destination): v1.6 -25 dB full / -27 dB above 280 Hz; v1.6.1 -21.6 dB / -21.9 dB, peaks ~-10 dB. Default stays ON
  ('hb-sound' '0' only after muting). No service worker in this app. Probe $SP/hb161 (tap.js analyser tap, drvA.sh, pA/pB1/pB2).

- v1.7 2026-10-13 ~00:00: Perkeo's Great Barrel (Flax's backlog). The castle's south hall became the Fassbau: wing(25,85,43,97,13) +
  buildFass(C): interior x 26..42, z 86..96, cobble floor, barrel vault (C+10 at the walls to C+12, trim ribs every 4 x), door x 34..36 at
  z 85 with a trim arch (the courtyard is now z 80..84; the old gold post at (34,86) is gone). The barrel lies along x 29..39 (staves,
  iron hoops at x 31/34/37, end caps 'cask', radius 3.7 bulging to 4.15, axis C+4.6), sandstone cradles at x 30/38, a gold tap at (40,C+2,91).
  Plank deck at C+8 over x 28..40, z 88..95 with log rails ('rail' block, noStep) open at the stair corner, log posts; stairs x 26..27
  rise south z 87..95 to the deck (stand C+9). New tiles stave/hoop/cask (atlas AH 64 -> 128, slots 32-34). Lighting: the block shader
  swaps sun light for lantern pools inside the hall (vAir=position+normal*.5 in the box; FASS_LAMPS, 8 wall lanterns + one over the
  deck), so it is dim and warm day or night; lanterns + music box = one MeshBasic mesh (+1 draw call). Place names 'Großes Fass' /
  'Auf dem Fass'; first time on the deck toasts the 220,000 litres.
  Perkeo moved from the stairs top to the cellar door (spot 'fass' = 37.5,83.5), with a clipboard; talk() changes when you carry water.
  Water: Q.water 0 none / 1 empty / 2 full in 'hb-quest'. Greta gives a full bottle the first time (action line); refill at the
  Herkules fountain (<3 of -15.5,66.5) or by swimming in the Neckar; drink with G or the 💧 button (top left, only while full):
  gulp sound + P.boost 25 s (x1.3 speed). While you carry it Perkeo slides in front of the door and the door row z=84 x 34..36 is
  solid (FASS.bar in solidAt, only while P.z<83.75) with escalating lines (PK_NO); drink near him = 'just glass, Willkommen'.
  Music box: an original waltz in G, 3/4, 16 bars + a bar's rest (WZ, quarter .42 s), melody +12 as a music-box tine (sine + 3x + 5.4x
  partials, 1.6 s decay) over an oom-pah; gain .32*(1-d/26)^2, x.3 outside the hall, into the cellar reverb too (caveLevel .45 inside).
  Measured on the deck -25 dB RMS (peaks -13), courtyard -36 dB. Birds stay quiet inside. Probe $SP/hb161/p17.js (Greta, wet push stops
  at z 83.70, drink, walk in, stairs to C+9, deck toast, music notes, fountain refill), shots $SP/hb17/v3.png v7.png. World 305k tris.

- v1.8 2026-10-13 ~00:00: the Schlossbeleuchtung (Flax): while a firework show runs (fw.on && fw.wait<=0, also grandShow) the castle
  ruin glows deep red. One uniform hbGlow (GLOW, eased in over ~1.8 s and out over ~2.6 s, flicker .8-1 unless reduced motion) in the
  block shader adds diffuse*vec3(1.55,.3,.08) + a little red emissive inside a soft box (x 7..71, z 66..111, from CASTLE_Y-10 up),
  brighter at the foot of the walls like fire from below. The Fasskeller's own lantern light overrides it inside. No extra draw calls.
  Budget after v1.8 (hb_p5.js, 11 views): busiest philS 262k tris / 78 calls, world 305k tris, __E [].
  Shots $SP/hb18/g0.png (off) / g2.png (on) from the bridge at night.
- v1.8.1 2026-10-13 ~00:35: Flax (00:07): "I am at perkeo but i cant hold anything. Cant find an entry." The cellar door sits in a
  narrow, dim court (x 32..38, z 80..83, reached by the covered passage x 34..36 from z 73) under the hall's eaves, so it read as
  just more wall. Now: a red carpet (new tile carpet 35) from z 80 through the door into the cellar, gold rope posts + red ropes
  either side, two lanterns on brackets beside the arch (props mesh), a barrel-shaped FASSKELLER sign over the arch (canvas,
  MeshBasic alphaTest, +1 draw call), warm light spilling from the doorway + the lanterns (block shader, outside the cellar box
  only), a low lamp just inside (FASS_LAMPS[0]) so the doorway glows. Perkeo's toast fires within 6 blocks (was 3) and points
  the way: "The arch behind me, under the barrel sign: follow the red carpet." Probe $SP/hb181/pwalk.js: 7 starts x full stick +
  45% stick, 2 diagonal straight lines, 40 random starts in the court + alleys, and a BFS walk from the top of the castle stairs
  (34,48,72) all end inside (z 88). A start at (32.2,81.2) only stuck because it overlapped a wall corner (test artefact).

- v1.9 2026-10-13 ~01:40: the town comes alive (Flax: "all resources on Heidelberg", step 1 of the big round). Nine new folk
  with routines + lines: Anselm the Nachtwächter (night only, loop round through the old town, lantern that lights the cobbles
  via a block-shader uniform LANT/hbLan, cow horn + the old hour call at three stops, "Gute Nacht, Hilde!"), Matthias the busker
  on the bridge (accordion Rosi, an original C-major Neckar-Polka with oom-pah, louder as you walk up, a Tusch as his last line),
  Herr Kowalski the tour guide who lost his group of 12 yellow caps (day, walks bridge to Marktplatz waving his flag; the hook
  for the quest step), Herr Brandt + Waldi the dachshund on the south quay (leash, wagging tail, woof), Svenja jogging the north
  promenade (counts laps), Fritz fishing on the north bank (rod + line + bobber, hints at the river Studentenkuss), three
  students on a blanket on the Neckarwiese (Jonas strums a guitar), Clara painting the castle on the Philosophenweg, Oma Hilde
  on a Marktplatz bench with six pigeons that flutter off when you run at them. Old folk got barks too.
  Machinery: per-figure folkMat() (shared program 'hbfolk', uniform hbW = two swing channels: walk + gesture), parts can carry a
  swing tag [dir,pivotY,pivotZ,phase] (|dir|>=5 = gesture channel, GTag), blockyGeo part [9] = rotX; walkers follow route
  [[x,z,pause,flag]] (loop or ping-pong), stop + face you within 3.2, standY() finds the floor under arches; f.when = times of
  day they're out; speech bubble #bark over the nearest within 14 every 5-9.5 s (line-of-sight checked). All synth sounds are
  panned and quiet. Probe $SP/hb19s1/pl1.js (routes have no jumps, 2-min sims per time, every talk list), shots s_*.png.
  Budget: busiest philS 263k tris / 81 calls (was 262k/78), spawn 196k/58, __E []. Untested: real phones, real audio levels.

- v1.10 2026-10-13 ~02:30: quest log (big round step 2). Five chained quests "Ein Walzer für Hilde":
  1 Die verlorene Gruppe: Kowalski lost 5 tourists in yellow caps (Ingrid by the bridge monkey, Takeshi up at the castle, Maureen
  on the Philosophenweg, Bob waiting for Jupp's boat, Priya halfway up the Snake Path; TOUR entries in FOLK, spotFn + qFree());
  walk within 2.2 and they head back (bark + burst), then they walk behind Kowalski (merged into his mesh, kowGroup()).
  2 Ein neues Lied: Matthias wants a new song: stand 5 s by the music box on the Großes Fass, hum it back; Rosi then alternates
  the polka with the music-box waltz (walz() = WZ on the accordion, accNext()). 3 Für Hilde: she'll dance only with Anselm.
  4 Der Nachtwächter (night): Anselm says yes. 5 Ein Walzer auf der Brücke (night): come within 9 of Matthias and Hilde + Anselm
  dance on the bridge (one merged pair mesh, holding hands, turning in a small circle, LANT lights them) for one waltz (21 s),
  Tusch + grandShow, done. Replay: talk to Matthias at night. Hilde/Anselm are hidden from their usual spots while dancing (f.dances).
  Q fields: qs (quest 0-5), qp (step), qk (met Kowalski), tz (tourist ids). Tracker chip #qt under the place name (📜 text,
  🌙/☀ gate when the quest needs night/day, ▲ arrow turned toward the target + distance), gold ◆ #qmark on the compass,
  tap or J = log #qlog (done ✓, current with the long text, locked ???, the Studentenkuss side quest). Toast moved to top+6.9rem.
  Folk materials got a self-glow uniform hbE (userData.e): Anselm .3, Matthias .22 at night, dancers .45.
  Probe $SP/hb19s1/pq.js runs the whole chain (talkTo + teleports + tickTown) with no errors; shots s_qhud/qgroup/qdance/qlog.
  Budget philS 264k / 83 calls (+2: tourists in view). Untested on a real phone: tracker chip width with long texts.

## issues
- fannar22 2026-10-11 23:50: rising into the sky at the east/west map edge in the river (fixed v1.1, probe hb_edge.js).
- pathLine drop walls: a one-block drop must not get a parapet (blocked the Snake Path entry from Brückenstraße).

## todos
- big round (Flax, 2026-10-13): drivable car + Neckar ferry (+ Bergbahn?), café terraces, secrets
  (Hortus Palatinus); later: German dialogue switch, secret behind the Great Barrel
- optional firework bang sounds after a tap
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
- 2026-10-12 14:08 UTC v1.5.1: MIKE'S STONE. Flax asked for "in Memory of Mike - Flax" carved into the arch of the Old Bridge as an everlasting memory. memorialMesh(): a pale sandstone tablet (canvas 340x100, emissiveMap so it reads in the bridge's shade) on the east face over the last arch by the old town (x 4.02, y 18.5, z 40.5), seen from the river and the old-town quay steps at x~16. PERMANENT: keep it through every upgrade and rebuild, never move it out of sight, no hint markers (it's a quiet find). Flax also asked that upgrades never break the town: test every release, roll back if one does.
- 2026-10-12 14:18 UTC v1.5.2: Mike's stone MOVED where Flax wanted it: inside the bridge gate's archway between the two towers, on the west wall of the passage at eye height (x -1.98, y TOWN+1.9, z 53.5, facing +x). Everyone walking into town passes it. Still permanent.
- 2026-10-12 14:24 UTC v1.5.3: Mike's stone in its FINAL spot (Flax: "when the tour starts, you look at the gate and right above the arch, below the 3 windows"): the gate's bridge-facing face, x .5, y TOWN+7, z 49.97, facing -z, 4.4 x 1.3. Visible as a pale tablet from the spawn, readable as you walk up. Don't move it again unless Flax asks.
- 2026-10-12 14:45 UTC v1.5.4: Mike's stone a little smaller (3.2 x .95) and lower, at TOWN+5.5: set into the red brick band right on top of the gate arch, under the two windows (Flax 14:21: "I love it, maybe a little smaller and placed 2 rows down"). Still visible from the spawn. PERMANENT - keep it here through every rebuild unless Flax asks.
