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

- v1.11 2026-10-13 ~02:50: vehicles (big round step 3). Professor Grübel's Denkmobil: a teal blocky car with a cream roof
  and a book-laden roof rack parked on the Neuenheim road at (-8.5,-49.6); R or the 🚗 #ride button (bottom right, above the
  jump button on phones) gets in/out, drive with WASD/arrows or the touch stick, the jump button becomes the 📯 horn.
  vehTick: accel 4.2, top 11.5, brake 12, reverse 4, steering needs speed; vehFree samples a 1.64 x 3.2 box ('drop' = no
  floor at TOWN-1, 'wall' = solid at TOWN/TOWN+1); glancing hits slide, head-on hits bump back (thunk). It brakes for folk
  ahead (gap ~2.1) and honks once with a bark. Bollards at x -2/0/2, z -44 keep it off the Alte Brücke (toast); the quay
  edge says "The Denkmobil is no boat". Chase camera vehCam() 6.2 behind, pulls in at walls, eases behind after 1.3 s
  without look input (P.lookT). Headlight pool via LANT at night.
  Kapitän Jupp's boat Liselotte runs again: he waits on the north quay (9.5,-45.5); talk = free 66 s tour (BOATR closed
  Catmull-Rom loop: west through the north arch, round the Neckarwiese, back east through the south arch, round by
  Neuenheim, home). Black fade on board/off, the player rides at the bow (look around freely), Jupp at the wheel, 8 narration
  barks (BOATN), boat horn + putter engine. R aboard: at the dock = get off, mid-tour = jump in the Neckar (Mann über Bord!).
  Fixes: speech bubbles of the first five townsfolk closed in the same frame (f.here!==false); Hilde's line updated.
  Probes $SP/hb111/pv2.js + pv3.js (sync G.vehTick/G.boatTick loops: headless runs ~2 fps): route 0 voxel hits, bollard
  front stops at z -44.00, overboard lands in the water, disembark/cancel ok, no errors. Budget philS 264.7k / 85.
  Untested on real phones: driving with the touch stick, #ride button reach. Bergbahn not done (todo).
- v1.12 2026-10-13 ~03:45: Kaffee und Kuchen (big round step 4). Café Sahnehäubchen on the Marktplatz (red-cream
  awning, fraktur sign "KAFFEE · KUCHEN · SEIT 1951", 5 marble tables MTAB around TM (-1.5,66.5), parasols, guests at
  tables: the Webers, students Lena + Can, little Mia (scaled .7) with Frau Albrecht, Dr. Sommer with his newspaper) and the
  Weinstube Neckarblick on the old-town quay (TR (-21.5,46.5), green parasols, candles + string lights, rowers, a date,
  the Stammtisch who talk about Fritz). Walk up to the free chair (markt 2.5,63.5 / wein -15.5,46.5): R or the ☕/🍷
  #ride button = "Take a seat" (camera at seat height, jump hidden on touch). Fanny (Marktplatz, day/golden only) or
  Elke (Weinstube, always) walks over and serves after ~8-12 s: one of 4 cakes (Schwarzwälder Kirsch, Apfelstrudel,
  Bienenstich, Käsekuchen) + coffee, or by time of day Apfelschorle / Radler + Brezel, Riesling + Flammkuchen; bites every
  5.5 s, clink + nom sounds. Try all four cakes = Stammgast toast + sparkle ('hb-cafe' {n,t}), Fanny then greets you
  as a regular. Any movement stands you up. At night the Café closes: chairs upturned on the tables, parasols furled
  (separate mesh nm), the player is stood up with a toast. Tables/chairs = invisible walls CAFE_COL (255 in solidAt at
  TOWN/TOWN+1; chairs only when open). Seated table folk (c_* ids, placeholder m) are talkable, Dr. Sommer's news
  follows the quest state. Place names: 'Marktplatz' + the café name while seated; the quest log shows a café line.
  Probes $SP/hb112/pc.js (sync tick loop: sit, serve, eat, Stammgast, night close, river at night, collision) and
  pb.js (budget): philS unchanged 264.7k / 85, Marktplatz view +6k / +3 calls. Shots s1b-s4.
  Untested on real phones: sitting/standing with the ride button, bubble positions while seated.
- v1.13 2026-10-13 ~04:55: Geheimnisse (big round step 5, Flax). Nine secrets, found through the talk button (spots are
  FOLK entries with their own verb + icon: Bite / Step into / Pull / Lift / Read): 1 Hexenbiss (iron ring under a bronze
  lion in the gate passage, 34.75,74.5), 2 Rittersprung (knight's boot print in the courtyard, sandstone block 46,47,93),
  3 Perkeos Uhr (clock on the Fasskeller east wall 42.85,C+1.8,88.5: pull = fox tail slaps you, repeatable, Perkeo laughs),
  4 Geheimgang (hatch behind the barrel at x 41-42 z 95-96: Lift from the hall or Push up from below; opens for good,
  'hb-sec'.open; steps down under the hall wall, passage under the courtyard x 41-58 z 95-96 with 3 lamps, out through a
  sally port into the dry moat), 5 Hortus Palatinus (new terrace garden x 68-116 z 77-100, walk level 50 = HG.Y: six
  hedge parterres, gravel allée, fountain at 92.5,89.5, red sandstone retaining walls with ivy, blind arches on the north
  wall; reached by a gate in the outer moat wall at x 66 z 95-96 and a stair trench x 67-74), 6 Elisabethentor (tree-trunk
  pillars at x 75 with the FRIDERICUS V inscription both sides), 7 Goethes Ginkgo (golden tree 73,83 + bronze plaque on a
  post 76,84), 8 Vater Rhein (reclining river god in the grotto in the south wall 92.5,102.6, talks; PATER RHENUS plinth),
  9 Hölderlins Stein (Philosophenweg, picked at build time east of Clara, ~35,-87; emissive plate like Mike's stone).
  Rumours: Lotte, Kowalski, Perkeo (2), Clara and Prof. Grübel drop a hint line while that secret is hidden; the quest log
  shows 'Geheimnisse n/9' + the next rumour. All nine = Geheimrat (toast + sparkle): the fountain + 4 rim jets run and
  Vater Rhein's urn pours (300 points, only visible within 150 of the fountain), water hiss loop. Place names Geheimgang /
  Hortus Palatinus / Burggraben; passage = cave reverb, no birds. New block 'hedge' (noStep). State 'hb-sec' {f,gr,open}.
  NOTE: reserve() of the garden shifted buildTrees' shared rng, so trees east of x~64 changed shape (same positions).
  Mike's stone untouched, not part of the hunt. Probes $SP/hb113/p1.js (route hall->hatch->passage->moat->gate->stair->
  garden both ways with G.physics, all spots, hints, Geheimrat, collision), p2.js (closed hatch from both sides),
  pb.js (budget vs v1.12: philS 253.3k / 85, was 264.7k / 85; garden view 82.6k / 15, fountain 206k / 56), shots sh*.js.
  Untested on real phones: the spots on touch, the hatch from below.
- v1.14 2026-10-13 05:31: phone polish round (no new features). First screen on touch: two fading ghosts
  ("Drag to walk" stick ring bottom-left, "Drag to look" track right) that fade one by one as each thumb is used,
  gone after 40 s, entering the car/boat or a dialog; both used once = 'hb-tut' and later visits get the short hint.
  The talk button glows gold until you meet your first townsperson; the canvas aria-label explains the drag controls.
  HUD: place + Studentenkuss chip in their own row (#prow), quest chip (#qt) can wrap but its distance never splits,
  44 px tall on touch, 📜 icon hidden under 440 px; toast sits under the HUD (--hudb set by a ResizeObserver).
  Talk button stacks above the Bridge Monkey's buttons (rub buttons left-aligned under 560 px so the jump button stays
  clear); talk button hidden while a dialog is open; dialog says "tap to go on" on touch (k-touch/k-desk spans,
  !important so the quest log's J line hides on touch). Shorter touch hints for car/boat/café so they clear the jump
  button. Landscape phones (max-height 500): tighter top/bottom insets, dialog narrower and at the bottom, lifted over
  the rub row. Adaptive sharpness (PRQ/qualTick): 90-frame median > 24 ms steps the pixel ratio down (1.75 -> 1.5 ->
  1.25 -> 1 -> .85 -> .75), checks the next window and steps back + stops if it didn't help (30 fps caps, iOS low
  power), saves the level per devicePixelRatio in 'hb-pr' and retries one step sharper on the next visit.
  Checked in headless at 390x844, 844x390, 800x300 and 1280x800 (no desktop regressions): touch-stick driving
  (accelerates + steers), boat tour, café sit, secrets, quest log. Budget at phone FOV: portrait 207k / 65,
  landscape philS 255k / 88; SwiftShader is fill-bound (PR 1 -> .75 halves the frame). Mike's stone untouched.
  Scratch $SP/hb2 (mk.sh, drv.py CDP driver, audit3.py, drive.py, perf.py; ?touch and ?pr only in the test copy).
  Untested on real phones: real fps + where the adaptive step settles, iOS low power, how the car feels on a thumb.
- 2026-10-13 07:08 (helper): v1.15 Bergbahn designed (route, stations, summit, Frieda + Fernrohr quest), no code
  shipped; stopped for a session restart. Full plan + scratch path under todos. Live index.html unchanged (v1.14).
- v1.15 2026-10-13 08:54 (helper), step 1: DIE BERGBAHN (Flax's Königstuhl funicular). Two crimson-and-cream cars on
  one rope run Kornmarkt -> Schloss -> Königstuhl: car A at u = s on the east branch, car B at L - s on the west, so
  they cross at the Schloss passing loop (M = 43.4, L = 86.8) where both conductors wave. Board with R / the ride
  button at any of the three stops (zones in bergZone); if no car is there the button rings for it. Rider stands in
  the lowest compartment (local -.38,-.24,-1.55) so the end window is the view; physics off while aboard, Get out only
  when stopped. States dwell 9 s at the ends / stop 5 s at the loop, held while you stand at a stop; brakes + bell if
  you stand on the rails ahead of a car; rope hum (engOn) + a two-strike bell. Voxels (bergWorld, after vehWorld):
  gravel bed on red sandstone arches (pier every 6 u) or in a cutting, whole trees felled near the line; Kornmarkt
  stepped platform x 7..8 z 64..69 under a stepped wooden canopy, a passage under the line at z 70..71 (Anselm's
  night round moved from x 7.5 to 10.5); Schloss platform x 8..9 z 95..99 at walk 48 + tunnel x 10..11 onto the castle
  terrace (parapet at x 12 opened); Königstuhl plaza x -25..-8 z 123..131 at walk 68, Gipfelkiosk, telescope pedestal,
  benches, a belt of beeches south of the plaza (bTree: like tree() but allowed up high; hides the map's far edge),
  and a homage TV tower mesh at (-3.5,141.5) with a blinking red lamp at night. Signs on one canvas (Fraktur).
  Meshes: track + props + tower 1 call, 2 cars (folkMat, night glow), signs 1, lamp 1 (night). Place names
  Bergbahn / Bergbahn · Kornmarkt / Bergbahn · Schloss. Budget vs v1.14 (same views): phone spawn 143k/50 -> 161k/54,
  philS 207k/64 -> 225k/68; desktop philS 242k/84 -> 261k/88, Königstuhl looking north 293k/97 (new spot). 0 JS errors
  1280x800 + 390x844 ?touch. Scratch $SP/hb15 (mk.sh test build with hooks, hrun.sh, p/b1-b4.py, p/perf.py).
  Untested on real phones: how the ride feels, whether the rider view through the end window is enough on portrait.
- v1.15 2026-10-13 09:31 (helper), step 2: FRIEDA'S FERNROHR. Frieda Wolkenstein (rust cardigan, apron, green scarf,
  bun, a cup) stands inside the Gipfelkiosk at (-21.5,68,129.5) (FOLK + LIFE, wipe gesture, 3 barks). Her glasses are
  at the optician's: talk to her for an old Groschen (BS.met), then 'Look through the Fernrohr' (FSPOT b_scope). The
  telescope moved from x -15 to x -13 (pedestal set(-13,68,124)) because the Heiliggeistkirche roof hid Fritz from
  there; eye SCO.eye (-12.5,70.1,123.85), first look at the Old Bridge (yaw -.075 pitch -.33). Scope view: 7.5 deg
  across the narrow side, brass vignette + centre ring (#scope/#scopeV/#scopeR), list of 'Frieda's friends' (#scopeL),
  fog 160/640, far 720, LIFE.cull 420 while scoping; look() and inp.turn x.13, no stick (left half aims too), WASD aims,
  yaw clamp +-1.45, pitch -.8..+.3. A friend counts when the body point is within .14*min(W,H) px of the centre with a
  clear voxel line of sight (scopeLos every .25 s) for 600 ms REAL time (performance.now: headless dt is capped).
  Kapitän Jupp, Fritz, Clara (Hilde is indoors). All three -> tell Frieda -> "Ehrenausguck vom Königstuhl" toast,
  burst, chime, she refills an empty water bottle (also later). Free use afterwards. R / ride button 'Step back' / Esc /
  the spot again exits; scopeOff restores yaw/pitch/fog/cull + resize(). BS keys: met, seen{}, done, look, rides.
  Quest log: bergSide() line in #qside. Short landscape (<=500 px high): #scopeL moves top-left and the scope toast sits
  just under the place label at .85rem so it never covers the ring. 0 JS errors 1280x800, 390x844 ?touch, 800x300
  ?touch (p/f1.py full desktop flow, p/f2.py phone flow incl. a left-half drag aim). Scope views are cheaper than walking
  (narrow FOV): phone 152-157k/29-34, desktop 130-155k/26-31 (p/sperf.py).
  Untested: a real thumb aiming at 7.5 deg, sounds, how it reads at night on a real screen.
- v1.16 2026-10-13 10:55 (helper): CAFÉ NERD + Liselotte easier to find + phone thumbs.
  Café Nerd (Flax): a blue house x -40..-33 z 60..68 on the west side of the Marktplatz, across from the
  Heiliggeistkirche (house(-40,60,8,9,4,...) then hollowed): walk-in room x -39..-34 z 61..67, plank floor + ceiling,
  south windows + door x -37..-36 on the lane, east windows onto the Marktplatz. Sign on the south + east faces: canvas,
  the title drawn as our own 5x7 pixel letters (NGLY/nerdTitle: the web font's C read as an O from the lane),
  'Kaffee · Brettspiele · Pixel', a pixel cup + a pink die; chalk KARTE behind the bar. Inside: counter with a pixel
  invader front, stools, shelves of board games, a TV with a pixel game, pendant lamps (NERD_LAMPS light the room in the
  block shader), warm pools on the cobbles at night (NERD_U). People: Nele the barista (static, wipes; pull:1.5 so she
  wins the talk button over the guest on the next stool; nearFolk now ranks by d - pull), Malte the waiter (walker,
  outdoor tables), Ozan (headphones), Jule & Ben (board game), Merve (laptop), outside by day Hartmann & Yusuf (chess)
  and Sophie (comics). Sit at the bar (middle stool, SEATS 'nerd', srv 'nele', pitch -.14): Flat White with a pixel
  heart, Chai Latte + Zimtschnecke, Kakao with dice marshmallows (NDR), 'hb-nerd' {n,t}; all three = Café Nerd
  Stammgast toast + burst. Quest log line nerdSide(); place name 'Café Nerd' inside.
  Liselotte (Flax 10:39 "i miss the captain and boattour"): the tour still worked on live (p/b1.py: Jupp at 9.5,-45.5,
  talk starts it, full loop, home, 0 errors), it was just hard to find. Now a quest log line (boatSide), rounds
  remembered ('hb-boat'), and until your first round Jupp toots the horn every 50 s while you are on the north half of
  the bridge or the north bank (P.z<-12, 6..70 blocks; one toast per visit), plus a white LISELOTTE · Rundfahrt gratis
  board on the boat roof (a little self-lit, +1 draw call).
  Phone thumbs (Flax: "controlling the left trigger is gotten harder"): v1.14 had moved the talk button left of centre
  on narrow phones, right where the left thumb starts the walk stick, so a thumb there talked instead of walking.
  Touch now: talk on the right above the jump button (short landscape: left of jump), ride moves above talk when both
  show and hides during a dialog (it overlapped the dialog box on 390 px). The stick centre follows a thumb that slides past the rim (quick turn-round), small dead zone .12.
  Probes p/n1.py + p/n2.py (drinks to done, Nele talk, stick follow), p/b1.py (live boat), p/b2.py + p/bs.py.
  Untested: a real thumb on the moved buttons, the horn level on real speakers, Café Nerd night light on a real GPU.
- v1.17 2026-10-13 11:27 (helper): DER ALTAN + castle shapes (Flax: "a proper Schlossterrasse looking down on the
  Altstadt and the river", "still not close to original"). buildAltan() runs after the castle stairs: a paved (quay)
  terrace x 13..33 z 65..71 at walk 48 on a tall red wall with blind arches (north + west faces), joined to the strip
  z 72..73 under the north wing (old z 72 parapet removed) and opened at x 33 onto the top of the Schlosstreppe.
  The balustrade is a mesh (altanMesh, 1 draw call, ~3k tris): plinth, slim balusters every .4, handrail at .93,
  pedestals with stone balls every 4 blocks; ALT_COL makes its row (z 65 + x 13) solid at y 48/49 in solidAt so you
  can't climb over. Looking west from it: the Heiliggeistkirche tower, an Altstadt lane straight below, the Brückentor
  and the Neckar; north: bridge + river + Neuenheim. Place name 'Altan · Schlossterrasse'.
  Shapes: the north-west wing is now the Friedrichsbau with two stepped gables over each long wall (gable(), 3 deep into
  the roof); the old 'Friedrichsbau' east of the gate is the Gläserner Saalbau; new Glockenturm at the NE corner
  (x 51..56 z 73..78: square to C+18, then an open octagon with tall arches and a broken crown to C+27).
  Loading line moved above the start card (it covered the card in the 800x450 auto preview).
  Probes p/a1.py (views + walking into the balustrade: stops at z 66.3 / x 14.3), p/a2.py (walk from the stairs onto
  the terrace), p/ld.py. 0 JS errors 1280x800 + 390x844 ?touch.
  Untested: how the balustrade feels on a real phone (the handrail fills the bottom of the view if you look down).
- v1.18 2026-10-13 11:57 (helper): THE PARK IS REACHABLE + DIE SCHEFFELTERRASSE. Flax 11:35 on v1.17: "How to access
  the castle park? It seems unreachable." It was: the gate side of the courtyard (x 25..43 z 81..84) was a closed
  pocket (Friedrichsbau/Saalbau north, Fassbau south, west-wing shell, Ottheinrichsbau shell x 44..50 z 81..91 east),
  the big courtyard (x 44..58 z 92..98 + the lane x 51..58) was only reached up the Bergbahn track and the 1-wide
  ledge z 98, and the garden only by dropping into the moat or the secret passage. Fix: two doorways through the
  Ottheinrichsbau shell (west wall x 44 z 82..84, south wall z 91 x 46..48, trim frames, place name
  'Ottheinrichsbau'), and die Gartenbrücke (buildGBr, GBR x 59..66 z 92..93, side parapets z 91/94, one pier x 61..62)
  from the courtyard beside the Pulverturm over the moat: walk 48 to x 62, 49 at x 63..64, 50 at x 65..66, garden
  parapet (67,50,92..93) removed. Green nameboard over its gateway 'Schlossgarten · Hortus Palatinus ·
  Scheffelterrasse' (gbrSign, canvas text on the box's -z face, so rotation.y=+PI/2 faces west). Quest log line
  '🌳 Schlossgarten: through the castle gate, left through the Ottheinrichsbau ruin, ...' until the garden is found;
  the hortus rumour + Clara's line now point at the bridge; the hortus secret also triggers on the Scheffelterrasse.
  Route search p/bfs.py (no drops > 1): gate -> garden 58 steps (was 180 via the town + Bergbahn track).
  Scheffelterrasse (Flax: "the Schlossgarten park terrace with trees and paths"): SCH x 67..117 z 69..75 walk 50 on a
  tall arched north wall, gravel promenade, lawn strip with 7 big park trees (parkTree, trunks you walk under), 4
  benches facing the town, the old Hortus north wall row z 76 opened so it's one park. One balustrade mesh for Altan +
  Scheffel (balMesh replaces altanMesh); ALT_COL is now a Map cell -> walk level (48 Altan, 50 Scheffel, benches).
  Viktor, Dichter, writes poems on a bench at the west end (69.6,72.5): Scheffel's "Alt Heidelberg, du feine" (1854),
  the Pulverturm blown up in 1693, painters. Probes p/s1.py, p/g1.py (physics walk gate -> garden, touch stick climbs
  the bridge steps), p/bfs.py, p/wmap.py. 0 JS errors 1280x800 + 390x844 ?touch.
- v1.18.1 2026-10-13 12:18 (helper): FOOTPRINT + A CLEAR WAY TO THE PARK (Flax 12:04: "the footprint is on the terrace
  right at the stairs up from old town ... please create a better exit to the park. Atm it is blocked by a band leading
  to the great barrel"). The Rittersprung stone + footprint decal + s_foot spot moved from the courtyard (46,93) to the
  Altan's first terrace stone where the Schlosstreppe arrives (32,47,68; spot 32.5,68.5); the rumour, Kowalski's line and
  the legend text say so. The "band" was the red velvet rope + brass posts along the carpet (x 33.6/37.4, z 81..83.6):
  removed, the carpet still leads to the Fasskeller. Perkeo now waits west of the arch (32.9,84.15), still steps into
  the arch when you carry water. The Ottheinrichsbau doorway is 4 wide (x 44 z 81..84, the whole strip) and two green
  signs (wegSign: same look as the bridge board, optional painted arrow): 'Schlossgarten <- durch den
  Ottheinrichsbau' beside the Fass arch facing the gate, 'Schlossgarten · Hortus Palatinus' over the doorway.
  Probe p/f1.py: physics walk up the stairs onto the footprint + talk (secret found), gate -> garden walk at 1280 and
  390 ?touch, stick walk east from the gate. 0 JS errors both sizes.
- v1.18.2 2026-10-13 12:28 (helper): FLAX'S CREW + LIFE IN THE WEST ALTSTADT (Flax 12:08 + 12:17). The picnic on the
  Neckarwiese (id 'studis', lifeSpot ~(-39.5,-55.5)) is now Max (guitar, the old Jonas look), Marco (the old Aylin look:
  green shirt, pink headphones; he sings: head parts nod on swing channel 1, open mouth, three little note meshes float up
  as kids of the group mesh, hidden under reduced motion), Ramona (blonde, pink top, sits next to Marco) and Josie
  (blonde, teal top). Lena left the picnic (the market still has 'Lena & Can'). croon(): Marco hums three soft made-up
  notes, a random walk on a pentatonic scale, every other strum (never a real tune). Manuel rides a red bike with a
  bread basket on a loop: Hauptstraße x -45.5..-109 (z 71), lane x -109, back street z 84.5, Augustinergasse x -45.5
  (day + golden, speed 3.4, legs pedal on the walk channel, f.bike keeps him facing the road when he stops for you).
  Petra walks to and fro: z 58.5 street x -40.5..-77.5, the lane x -77.5, Hauptstraße to x -104.5 (all times).
  Probe p/c1.py: 240 s tickTown sim (both stay at y 19, all route legs), talk lines, views. 0 JS errors both sizes.
- v1.18.3 2026-10-13 12:34 (helper): MAX'S LOOK (Flax 12:30: "Max is also blonde, no headphones and bright skin tone").
  Max (the guitar) has bright blonde hair (#f2d47c, a fuller top, a fringe and short sides) and fair skin (#fbe2cf).
  The pink headphones are gone from the group: they were on Marco, the only headphones there, and Flax may have read
  them as Max's. Ask Flax if Marco should get them back. 0 JS errors at 1280 and 390.
- v1.19 2026-10-13 13:27 (helper): UNIVERSITÄTSPLATZ + STUDENTENKARZER (Flax 12:08-13:15) + Marco's new look.
  West Altstadt south row, x -94..-48, z 72..95 (uniWorld/uniBuild/uniTick, before wegSign). Universitätsplatz x -94..-72,
  z 72..82: cobbles with a paving grid, the Löwenbrunnen at (-77.5,77.5) (round sandstone basin, pillar, lion mesh on
  top, four water arcs, a pool plane), two benches at x -85. Alte Universität x -71..-59: cream baroque body, red plinth,
  pilasters and cornice, a mansard roof with dormers, a risalit with the door facing the square and an
  "ALTE UNIVERSITÄT" board. Neue Universität x -96..-70, z 88..95: sandstone/ochre block, bay with three doors, gold
  Athena in the niche, "DEM LEBENDIGEN GEIST". Studentenkarzer x -58..-48, z 72..82, door at (-48,77) on the
  Augustinergasse: Herr Riegel the Pedell (id 'riegel', f.fy=TOWN keeps indoor folk on their floor) at his desk,
  a stair at z 74 (steps x -51..-54) up to a corridor (z 74-75) and three cells (A x -57..-56, B -54..-53,
  C -51..-49, 1-wide doors at x -56/-53/-50) with beds, a stove, tables and one candle in cell C.
  The graffiti: kzPaint() one 512x512 canvas atlas, 16 tiles (invented initials and years 1871-1902, a cap and a top
  hat silhouette, shields, sabres, "L + E treu 1897", "3 Tage, 2 Nächte", tallies, "Wasser & Brot", a Pedell
  caricature, names); kzGraffiti() lays quads on every wall and the ceiling of the upper floor and the stairwell.
  kzMat (basic + kzLight in GLSL) and a block-shader zone light the inside by window daylight (KZ_U.x, by time),
  the desk lamp and the candle (KZ_U.y flickers). UNI_COL (Set of x/z/y cells) = furniture collision in solidAt.
  First time upstairs: a toast + localStorage 'hb-karz' (Riegel then has one more line, quest-log line karzSide).
  Petra's route now crosses the square and pauses at the fountain. Josie points to the Karzer.
  Marco (Flax 13:13 "marco same but singing"): wheat-blonde hair #f6df98 with a little quiff (Max is golden #f2d47c
  with a fringe), fair skin, no headphones, still sings.
  Stair fix: no collision on the rail cell x -53 (the head of the stair needs 1.8 of headroom to step up).
  Probes p/u1.py, p/u2.py, p/w3.py (G.physics stepped at 60 Hz: stair up/down, all 3 cells, door in/out).
  0 JS errors at 1280 and 390 ?touch. Not measured: tris for the new views.
- v1.20 2026-10-13 13:35 (helper): TORCH + TONI L BUSKING ON THE ALTE BRÜCKE (Flax 13:15), a tribute to Heidelberg's
  hip-hop pioneers. Group folk 'busk' at (2.35,-29.5), rot -PI/2 (north half of the bridge, back to the east parapet;
  the Studentenkuss is at -21.5, Matthias at +26.5). Torch (olive jacket, cap backwards) and Toni L (red hoodie, beanie)
  each hold a mic to the mouth (bkMic: the default arm is filtered out of person() and replaced by a bent arm), the free
  arm pumps on the gesture channel, heads nod on channel 1 (bkNod tags parts above y 1.45). Floating name tags
  (bkTag sprites, shown within 26 m). A speaker box with a cyan LED that pulses on the beat, an upturned hat with coins
  (one blockyGeo, drawRange = BEAT.coins, saved as localStorage 'hb-hat', 3..14). Crowd of four facing them and nodding:
  a fan filming with a phone, a man, a grandpa in a flat cap, a kid (bkSmall .66). The last talk step drops a coin
  (hatCoin: clink + toast). At night the group gets a soft glow (hbE .26) like Matthias.
  The beat (beatTick, chained on SND.tickMore after accTick): our own two-bar pattern at 94 bpm, all synth, no samples:
  kick with a pitch tail to A/G (the bass), snare on 2 and 4, eighth hats with swing, an open hat, a scratch every 4th
  bar; gain falls off over 34 m. Never real lyrics, melodies or song titles; the talk lines are generic and respectful.
  Probe p/b1.py: talk + coin, BEAT running, tags on. 0 JS errors at 1280 and 390 ?touch.
- v1.21 2026-10-13 13:50 (helper): THE NECKARWIESE COMES ALIVE + DUCKS (Flax 12:16) + TONI L THE FUNKJOKER (Flax 13:43).
  One code block before wegSign (WIESE, wieseBuild after uniBuild, wieseTick after uniTick). It fits the map:
  the meadow is x<-14, z -44..-58 (place name 'Neckarwiese' when x<-14, -59<z<-43, P.y<TOWN+1.5).
  Ducks: 7 birds (mother, 3 ducklings at .72, 3 more at 1.3; drakes have a green head) in 4 InstancedMesh (drake/duck
  body + head), one loop path DUCK_PATH (67 m): paddle along the bank, waddle up the grass to Max's blanket, peck there
  for 7 s (hold at segs[5]), back into the river. Swim .55 m/s, waddle .42 with a roll. Quacks within 9 m (sfxBus).
  Shown only within 95 m of (-40,-48). At night they sit in a row at the water's edge (-42.4+i*.72, -44.45), heads tucked.
  Night: string lights on two poles over the studis, lanterns at three blankets, additive halo sprites; two night-only
  picnics, 'wieseA' Pia & Jonte (-60.5,-56.5) and 'wieseB' Elif, Ben & Noor with a speaker glow (-93.5,-56.5).
  The lit old town in the river: one additive mesh of warm streaks (22-52 m long, fade to the north) below the south bank,
  castle streaks in orange at x 18+, a scrolling stripe texture for the shimmer, fog off, night only.
  Funkjoker: Toni L's first talk line is "Servus! Toni L, the Funkjoker, at your service.", a bark "Servus! The Funkjoker
  is in the house.", his tag reads "Toni L · Funkjoker" (bkTag uses a 512 canvas for text longer than 8 characters).
  Probes p/d1.py + p/d3.py: ducks at the blanket, night picnics, reflections, busk tag + talk. 0 JS errors at 1280 and 390 ?touch.
- v1.22 2026-10-13 13:57 (helper): LANTERNS IN THE SCHLOSSGARTEN AT NIGHT (Flax's queue). GLAMP / glampBuild after wieseBuild,
  glampTick after wieseTick, code before wegSign. Six iron lanterns on every other Scheffelterrasse balustrade post
  (x 71.82 + 8k, z 69.82, on the post tops at Y+1.34) and six on posts along the Hortus walks: the axis to the fountain
  (89.5/95.5, 80.5 and 97.5) and inside the Elisabethentor (76.5, 93.5 and 97.5); the posts are solid (ALT_COL cell -> 50).
  Four draw calls: iron (Lambert), glass (Basic, colour x.18 by day, x.26 golden hour, x1 at night), halos (one Points,
  additive, fog off, within 160 m) and pools of light on the gravel (one additive mesh, within 70 m), night only.
  Probe p/l1.py: views + collision. 0 JS errors at 1280 and 390 ?touch. World tris unchanged (307k; the lamps are ~1.5k).
- 2026-10-13 14:00 UTC v1.22.1: the luck/secret sparks and the Geheimrat fountain jets get a round soft dot texture (roundDot(), a hoisted function so it's safe anywhere in the module); before, these points drew as pale squares up close.
- v1.23 2026-10-13 14:32 (helper): RIDE THE BERGBAHN BY WALKING IN (Max 14:22: "I'd like to be able to enter the cable car and
  travel with it. Currently it simply tells me to get off the rails"). Walk into a car's footprint (bergInside: within 2.9 m
  along the line and .75 m across of that car's own rails, |dy|<2.2) and you board it (bergIn, shared with the button);
  at a stop, walking or pushing the stick (after letting go once, b.rel) steps you out (bergWalkOut -> bergOff).
  The brakes and the 'Off the rails, bitte' toast now fire only for someone ON a car's rails in front of it
  (within 1.4 m across its branch, |dy|<2.2): not on the platform beside it, not under the line at the Kornmarkt passage.
  A hint at the stop ('Step into the car, or press R / tap the Ride button'), and on touch the Bergbahn buttons are big
  (#ride.big, 62 px tall at 390). Probe p/r1.py: walk in -> ride=1, departs, rides to the Schloss, walk out at Kornmarkt,
  brakes on rails 1 / under 0 / platform 0. 0 JS errors at 1280 and 390 ?touch.

- 2026-10-13 14:38 UTC v1.23.1 (Flax 14:37): Max, Marco, Ramona and Josie are NOT students; Ramona and Josie are yoga teachers. Ramona's 'then the library' bark is now 'then sunset yoga', Josie tells you about their sunrise yoga class on the Neckarwiese and tells Max to drop his shoulders. Flax played it through and loved the secret at the Fass.

- 2026-10-13 17:28 UTC v1.24 (helper, fela 16:53 "polish and optimize"): SPEED PASS 1 + freshness guard.
  Freshness guard (script#hbfresh right after #buildstamp, key 'heidelberg-fresh', copied from Peach Pitch): fetches
  the page with cache:'no-cache'; if the server's buildstamp differs it reloads ONCE, but only while the start screen
  shows (#intro not hidden); once walking it does nothing (the fresh copy is then in the cache for next time).
  Tested: walking -> no reload; same stamp -> no reload; newer stamp -> one reload, then stable. BUMP #buildstamp EVERY RELEASE.
  Speed: sky drawn after the town (renderOrder 1, it sits on the far plane) so only uncovered pixels run the sky shader;
  the emissive atlas lookup is skipped while blockMat.emissive is black (day); drawScene()/farcOff(): small props
  (signs, benches, lamps, folk, Studentenkuss, Uni bits...) are hidden for the frame once under ~3 px
  (distance > max(40, r * screenH/2/tan(fov/2)/3)), put back right after render; never during the Fernrohr; world,
  sky, water, clouds and anything with frustumCulled=false skip it; Mike's stone has userData.keep and ALWAYS draws.
  Ducks (4 InstancedMesh) now frustum-culled with one sphere around their loop (were drawn even behind you), garden
  lantern halos/pools too. Mesher merge pass walks only the chunk's face heights. Speech bubbles stay on screen
  (Josie's ran off the right edge at 390 px).
  Numbers (calls, SwiftShader ms): portrait 390x844 max calls 105 -> 90; philS 104 -> 69; summitN 894 -> 317 ms.
  Desktop 1280x720 max 142 -> 134 (bridge); philS 141 -> 117; frame times about 700-1700 -> 430-965 ms.
  Landscape 844x390 philS night 151 -> 100, bridge 141 -> 99, spawn 129 -> 96. Tris unchanged (summitN 320k landscape).
- 2026-10-13 17:39 UTC v1.25 (helper, polish 2): short landscape phones (the bar iframe, ~844x300, media query
  landscape + max-height 360 + min-width 700) put the place name and quest chip side by side under the compass, so the HUD
  ends at 89 px instead of 123. The buskers' name tags no longer overlap seen from the side (Torch's tag a row higher,
  y 2.66 vs Toni L's 2.3). Speech bubble clamp (v1.24) checked at 390x624 + 844x300. Probe $SP/hbpol/p/small.py checks
  HUD overlaps/off-screen at 390x624 + 844x300 (bark, talk, Bergbahn stop, quest log): no overlaps except the
  quest log, which is a panel over the HUD by design. 0 JS errors at 390x624, 844x300, 390x844 and 1280x720.
- 2026-10-13 21:22 UTC v1.26 (helper, Flax 19:27 "back of castle ... looks like a half baked movie set"): the back of
  the castle rebuilt. The terrace runs 3 rows further south (ZS = Z1+3 = 101): a walk along the back (Südterrasse,
  z 98..100) with a wall (parapet z 101), the moat moved with it (floor z 102..106, outer wall z 107). The bare earth
  cliff behind the moat is now walled garden terraces (tops 52/56/60/64 at z 107/111/115/119, red faces with ivy,
  hedge rails, trees on the upper two), walled at both ends (x 11 by the Bergbahn, x 66 flush with the hill).
  The hollow west wing shell is gone: its ground is a real courtyard (Schlosshof, x 13..24, z 81..100) with a well
  (19,90), worn cobbled paths (Bergbahn -> gate, back walk -> Gartenbrücke), a bench by the ivy wall, ivy on the
  Fassbau's west wall, a tunnel portal on the courtyard side and two boards in the tunnel ("Schlosshof" for whoever
  steps off the train, "Bergbahn" on the way back). Statues in niches: 8 electors on the Friedrichsbau's courtyard
  face, 6 on the Ottheinrichsbau's south face (courtMesh, one merged mesh + 2 board planes). The Gläserner Saalbau
  has an arcade on the courtyard side (2 deep, door at the back). Ludwigsbau: a small roofed wing at x 53..58,
  z 97..100 closing the SE corner. Fallen stones + grass inside the Ottheinrichsbau. 5 lanterns (CASTLE_LAMPS, in
  the GLAMP set, lit at night) + a parapet along the garden-bridge side of the SE court. Place names Schlosshof,
  Südterrasse, Gartenterrassen; Burggraben box follows the moat. Walk (p/bfs.py from the platform): courtyard 17
  steps, gate 44 (was 66), Altan 54 (78), garden 76 (76). Budget 1280x720 golden (before -> after, k tris/calls):
  bergExit 147/57 -> 151/60, tunnelOut 209/74 -> 212/76, courtW 137/52 -> 141/53, courtE 259/120 -> 265/125,
  parkEntr 112/30 -> 114/30, aerialSW 272/111 -> 275/114, aerialSE 336/133 -> 340/136. Phone 390x844: tunnelOut
  167k/52, courtyard 207k/51. 0 JS errors at 1280x720 + 390x844, day + night.
- 2026-10-13 21:46 UTC v1.27 (helper, step 2 of Flax's castle run): Old Ansgar + the Kräutergarten. NEWFOLK 'ansgar'
  (night only, speed .9, ping-pong route: gate (33.5,82.5) -> tunnel (16.5,98.5) -> back walk -> stair bridge ->
  his rosemary (38.5,108.5), flags 1/2/3 = arrival barks), 40 years the castle's night watch, separate from Anselm
  (town). His lantern is a Group pivot at the hand (f.lp) that swings with the walk phase; squeak() (new sfx, quiet
  triangle chirp) once a swing within 12 blocks. Barks/talk from main's brief: the squeak is the lantern's fault,
  tourists are weather (loud, sudden, gone by nine), put the phone away and look at the ruin, there is no garden
  (rosemary for his soup). Lit with folk emissive .3. LANT now follows the NEARER watchman (Anselm or Ansgar, < 70).
  Anselm's talk gained a line pointing at Ansgar. Garden: tier 1 behind the moat (top 52, walk 53, z 108..110):
  gravel path z 108 x 23..47, HERB_BEDS (dirt at y 53, x 24-27 thyme, 30-33 + 37-40 rosemary, 43-46 sage), herbMesh
  (board frames, herbs, watering can, stool + soup mug, the hand-painted sign "KEIN KRÄUTERGARTEN / Nichts zu
  sehen. Weitergehen. - A." on the wall, emissive so it reads at night), 2 lanterns in CASTLE_LAMPS ([x,z,dy=5]).
  Stair bridge 'Gartenstiege' x 33..37 (walk 34..36) from the back walk (gap in the z 101 parapet) over the moat,
  1 up per block to the terrace, arched underneath (moat walk still passes under, 3 clear at the ends). FIX: the
  moat's far wall (z 107) only reached y 49 and the v1.26 terrace loop skipped it, so tier 1 showed a dirt step;
  now dressed to 51, trim 52, hedge 53 (a railing). Spot s_herb 'Smell the rosemary' (31.5,108.5); if Ansgar is
  within 16 he answers by toast. Place names Gartenstiege + Kräutergarten (before Gartenterrassen). Walk (bfs):
  garden reachable via the bridge, moat under the arch too. Budget golden 1280x720: tunnelOut 215/76, courtE
  269/127, aerialSW 280/116 (v1.26: 212/76, 265/125, 275/114). Phone 390x844 night: 112k/26 court, 196k/74 beds.
  0 JS errors.
- 2026-10-13 22:11 UTC v1.28 (helper, step 3 of Flax's run): the way to the Karzer (Flax 19:30 couldn't find it).
  kzPosts(): a fingerpost on the Universitätsplatz NE corner (-72.7,73.3; block -73,73 solid via ALT_COL) with one
  arm east "Studentenkarzer / Hauptstraße · Augustinergasse", and a hanging sign on an iron bracket off the Karzer's
  north wall over the Hauptstraße (-47.35, z 71.5..72.9, both faces, readable from both ends, arrows point into the
  Augustinergasse). Arms are wegTex both sides (+z face dir 1, -z face dir -1, ry=atan2(-dz,dx)), emissive .3 so
  they read at night. (A post at the gasse mouth hid half its arm behind the Karzer corner, so it became the hanging
  sign.) Door lamp: a lantern hanging from a wall bracket right of the door (-46.62, T+2.12, 76.3), part of GLAMP
  (lit with the castle lamps, pool at (-45.9,76.6) r 2); glampTick now also shows halo + pool within 70 of (-47,77).
  Quest log karzSide: directions from the lion fountain (up to the Hauptstraße, right, past the Alte Uni, right into
  the Augustinergasse, the door with the lamp); after the visit it hints at the stove cell; after painting it says
  your name is on the wall. Cells: jug, tin cup, boots (A); red student cap + red/white/green sash on a peg (B);
  beer stein on the table + chamber pot under the bed (C). Tiny quest "leave your mark": spot s_kzmark 'Paint the
  bare patch' (cell A only: uniTick sets its .here from P), a plaster patch behind the stove (kzMarkBuild, canvas
  plane at x -56.965, kzMat); painting draws a silhouette in a red cap + "Gast / <date> / 0 Tage", saves
  localStorage 'hb-kzmark' (the date), plays kzBrush (3 bandpassed noise swishes), toast with Riegel shouting from
  downstairs; the spot becomes 'Admire your mark'; Riegel's last line becomes "Somebody painted behind the stove
  ... I saw nothing." Budget desktop night: fountain 296k/140, Hauptstraße 245k/125, door 170k/84; phone 390x844:
  198k/76, 183k/89, 126k/44. 0 JS errors.
- 2026-10-13 22:20 UTC v1.29 (helper, step 4, last of this run): students on the Universitätsplatz, by day + golden
  hour only (generic new folk, NOT Max/Marco/Ramona/Josie): Mira (law, 4th semester) sits on the bench (-84.5,79.5)
  with the red Schönfelder binder and a highlighter; Aylin (medicine) paces Neue Uni door (-82.5,87.2) <-> Alte Uni
  portal (-73.4,77.5) with flashcards, arrival barks; Hannes (physics, first week, beanie, map of "Mannheim") stands
  by the fountain (-74.6,74.4). Quest "Hannes's Ersti list": talk to him -> Q.ersti=1 (saved in hb-quest); the list
  reads existing state: Karzer = KZS.seen, Brückenaffe = any luck rub, Studentenkuss = Q.found.length>0. Quest log
  erstiSide() (appended after karzSide) shows ✓/☐ per item; all three + talk -> Q.ersti=2 + toast. Mira and Aylin
  point at Hannes and react to the list. Probe p/stu.py (reloads with saved state for the finish). Budget day:
  plaza 122k/26 desktop, 105k/20 phone. 0 JS errors.
- 2026-10-14 00:16 UTC v1.30 (helper, Mannheim step 1, for Flax): KAPITÄN JUPP NOW ASKS "where to?" (a choice box
  #jch: 1 = the old Heidelberg round, 2 = down to Mannheim; Esc/walking off closes it). The Mannheim ride: a real
  Heidelberg leg west out of the map (MH_OUT), then the 'Neckarfahrt' trip card (#mhcard: a little river map with
  the castle, the Ladenburg + lock stops and a boat running along it, Jupp's lines about the Schleusen; min 9 s down,
  6 s up, "Skip the ride" button / R key), then a Mannheim arrival leg (w.arrive) to the Anlegestelle. Home is the
  same in reverse (MH_HOME -> card -> MH_BACK -> homeLand at the Heidelberg dock). The whole town lives in
  apps/heidelberg-blocks/mannheim.js, loaded with import() only on the first ride (MH_BASE from location.pathname,
  ?v=130, retry nonce after a failure; a failed load shows an error line on the card and brings you home).
  Mannheim: the Quadrate (rows A-K west + L-U east of the Breite/Kurpfalzstraße, no I; G1 Marktplatz and O1
  Paradeplatz left open), a blue corner sign with the block code at every corner (one mesh), the Planken, the
  Ringe, the Wasserturm with its copper dome + gold figure on the Friedrichsplatz (basin, benches, board), the
  Schloss (a long front mirror-symmetric about the axis: end pavilions, Ehrenhof wings with head pavilions, a
  corps de logis, a middle risalit with giant pilasters, a column portico + balcony over the main door, a
  pediment with blue-white lozenge arms, a Baden flag on the ridge, gate pillars with gold balls), the
  Hauptbahnhof (sandstone front, clock with the real time, MANNHEIM HAUPTBAHNHOF board, hipped hall roof, trains
  behind), the Kurpfalzbrücke, harbour cranes on rails, containers, silos, two moored barges, river steps.
  Separate scene (MH.scene) + own block material mhMat() (no Heidelberg position lighting); Heidelberg's
  vox/colTop/colLow are swapped out and cached (MH.hv/MH.mv). Jupp stands on the Mannheim quay and barks. Font
  ligatures off app-wide (Pixelify's "fi" read as "A"). Probes $SP/mannheim/t1.py (whole trip, slow) + t2.py
  (skips, views, back-leg landing). 0 JS errors phone + desktop.
- 2026-10-14 00:29 UTC v1.31 (helper, Mannheim step 2a, for Flax): CARL BENZ'S 1886 PATENT-MOTORWAGEN on a low stone
  dais on the quay east of the landing (BZ x 20..23, z -77..-72; plain brown plaque "Carl Benz, Mannheim 1886, the
  first car", NO logos/stars): three spoked wheels (big rear pair, small front), tubular frame, tiller + brass
  handle, bench seat, engine + water tank, flat flywheel, chains. It IS the VEH in Mannheim: vehSwap(1) in mhEnter
  parks the Heidelberg Denkmobil in MH.hveh and hands VEH a 'benz' (vmax 4.4, acc 1.7, low putter f0 19/fk 4.2),
  vehSwap(0) in mhLeave restores it (and you step out first). R / the ride button reads 'Drive the Motorwagen' near
  it; it sits .3 up while on the dais; Jupp won't talk while you drive. Two new Jupp barks (first car; Bertha Benz
  drove to Pforzheim in 1888). THE PARADEPLATZ (O1): sandstone round basin, a stone base with four seated bronze
  figures and a tall column with a gold tip, four water jets, four lime trees, four benches. Canvas boards: "fi"
  is a ligature there too -> write 'f\u200Cirst'. Probe t4.py (drive, exit, leave, re-enter) + t5.py (plaque,
  fountain). 0 JS errors phone.
- 2026-10-14 00:39 UTC v1.32 (helper, Mannheim step 2b, for Flax): THE L4 DELIVERY. Herr Grumbach, a grumpy baker
  (white toque, grey moustache), stands at BÄCKEREI GRUMBACH on the Friedrichsring (U1's north front, a striped
  awning + counter with loaves, right across the Ring from the landing). His delivery boy is off with his knee, so
  you carry one Kümmelbrot to Frau Kessler at L4 (north door of L4, by the Schloss; doormat + geranium). 2:00 warm
  (chip '🥖 L4 · 1:42' in #prow), and while you carry it the place label drops the block codes ('Quadrate',
  'Friedrichsring'), so only the corner signs tell you where you are. He explains the system once (A-K west, L-U
  east of the Breite Straße, numbers count away from it). Cold: Kessler still takes it ("I'll toast it"), Grumbach
  hands you a fresh one. Warm: Kessler is impressed, Grumbach pushes a Brezel across the counter ("I have a
  reputation on this Ring"); after that he offers repeat runs with your best time (Q.mhbt). HANNES from the Uniplatz
  stands on the quay (took the S-Bahn), the self-declared Mannheim expert: ask him while you carry the bread and his
  upside-down map sends you north-west (truth: south-east); after a warm delivery he turns the map round ("So it
  WAS a map of Mannheim. That explains Heidelberg."). All Mannheim folk turn to you + bark now (mhTick loops
  MH.folk; MH.mf built once in mhFolk(), positions from w.mhq). Leaving Mannheim drops the bread. Q.mhb 1 tried /
  2 warm / 3 Brezel, Q.mhh map turned. Probe t6.py (whole quest, cold path, leave) phone + desktop, 0 JS errors.
- 2026-10-14 11:14 UTC v1.33 (helper, for Flax): MANNHEIM AT NIGHT. Lit windows vary now (warm curtains, a few
  flickering blue TV windows in the Quadrate, not the Schloss/HBF) via a coordinate-hash set() wrapper in mannheim.js
  (atlas slots 46-48 winCurt/winTv/winTv2, copied from the window tile; layout RNG unchanged). Street lamps (iron in
  props, glass heads in LH mesh, Points halos, additive InstancedMesh light pools on the ground) along the Planken,
  Breite Straße, quay, Ring, Kaiserring, Bismarckstraße, Parkring, the Kurpfalzbrücke, the Bahnhofsvorplatz and 8
  round the Wasserturm (offset pi/8 so none blocks its board). Floodlights without real lights: w.flood zones ->
  mhMat uniforms mhFA/mhFB/mhN, shader adds warm emissive by normal facing (Wasserturm round zone, Schloss + HBF
  box zones facing -z). HBF board + clock brighten at night. w.tick(dt,night) toggles it all. 0 JS errors.

## issues
- Phones see the app inside the nginx bar iframe: about 390x624 portrait, 844x300 landscape. Test 800x300.
- fannar22 2026-10-11 23:50: rising into the sky at the east/west map edge in the river (fixed v1.1, probe hb_edge.js).
- pathLine drop walls: a one-block drop must not get a parapet (blocked the Snake Path entry from Brückenstraße).
- Landscape 800x300: a long toast can sit over the ride/talk buttons for its few seconds (general HUD, not scope).
  v1.25: the HUD is two rows there now (compass, then place + quest chip).
- Castle walkability: run p/bfs.py (route search from the gate, no drops) after any castle change; the courtyard was
  split into closed pockets for days without anyone noticing (fixed v1.18).

## todos
- Flax's queue, what's left, in this order (13:57):
  1. Stückgarten west of the Dicker Turm (castle)
  2. more room round the Großes Fass in the cellar
  3. Jesuit church, Marstall, Karl Theodor statue on the bridge
  4. German dialogue switch
  5. Café Nerd: a board game you can join (and Nele's daily special)
  6. life in the west Altstadt: lit windows at night, a stall or a bench crowd (Manuel + Petra already walk there, v1.18.2)
  (garden lanterns DONE v1.22; Neckarwiese + ducks DONE v1.21; busking DONE v1.20, Funkjoker v1.21; Karzer DONE v1.19)
- Fernrohr ideas: more friends to spot later (Anselm on his night round, Hilde at a window), a postcard of the view
- a second garden terrace (the south wall is one tall cut). v1.26 terraced the hill behind the castle moat; the
  Hortus' own south wall (z 101, up to y 77) and its sandy west end are still one tall cut
- castle: more room round the Großes Fass (the Fassbau x 25..43 z 85..97 is boxed in: FASS lamps, bar row z 84,
  carpet, hatch, clock, Perkeo all hang on those numbers; the south wall could move to z 98 now the back walk is there)
- castle: only terrace 1 (the Kräutergarten, v1.27) has a way in; terraces 2-4 behind it are still for looking at
- Ansgar ideas: he could sit on his stool with soup after his round; a 'don't tell Ansgar' mini quest
- NEXT RUN (main 22:13, for Flax): Karlstor; a busier east and west Altstadt (stalls, a bench crowd, lit windows).
  (Jupp's "cruise or Mannheim?" choice + Mannheim DONE v1.30)
- MANNHEIM NEXT (v1.33+, for Flax; v1.30-v1.32 done the first queue): (1) the Planken as a shopping street: shop
  fronts with awnings + boards on both sides between the Paradeplatz and the Wasserturm, a few window displays, an
  ice-cream parlour; (2) the Jesuitenkirche (A4, west of the Schloss): a pale sandstone baroque front with two
  towers and a green copper dome you can see over the roofs; (3) the Rhine-Neckar confluence west of the Quadrate
  (the Neckar running into a much wider Rhine, Ludwigshafen across the water as a far skyline, a spot to stand at
  the tip), maybe a Jupp option to sail there; (4) night: lit windows + street lamps in the Quadrate, the Wasserturm
  floodlit, the Hauptbahnhof clock glowing [DONE v1.33]; (5) crowds: walkers on the Planken + Breite
  Straße (route folk in MH.folk, reuse walkStep), people on the Paradeplatz benches, a tram on the Planken.
  Questions for Flax: are Herr Grumbach + Frau Kessler good names? Should Hannes come home on the boat with you?
  Faster or slower than 2:00 for the bread?
- MANNHEIM queue (Flax 22:58 + 23:5x, in this order; Benz + Paradeplatz DONE v1.31; Hannes, L4 delivery, baker DONE v1.32): v1.31 Carl Benz's 1886 Patent-Motorwagen on a plinth (plain
  plaque "Carl Benz, Mannheim 1886, the first car", Bertha Benz 1888 line, NO brand logos/stars; drivable slow
  putter if cheap), the Paradeplatz (fountain pyramid monument + trees, where the Planken cross), Hannes from the
  Uniplatz as the self-declared Mannheim expert whose map turns out to be upside down (he already carries a map
  of "Mannheim" since v1.29), a parcel delivery to a block code (e.g. L4) by the corner signs only, before the
  bread goes cold, and a grumpy baker. v1.32+: Planken shops, Jesuitenkirche dome, Rhine-Neckar confluence, night
  lights (Wasserturm is dark at night now), crowds.
- Mannheim layout (mannheim.js): Neckar water z -99..-80, quay promenade z -78..-71 (y TOWN), Ring z -70..-63,
  axis x -14..-7 (block centre -10.5), Planken z 18..23, Kaiserring x 80..87, rows rowZ(r)=-62+14r(+2 from row 6),
  east blocks x0=-6+15(n-1), west x0=-25-15(n-1), Schloss x -85..64 z 84..105, HBF x 70..124 z 114..125,
  Friedrichsplatz x 88..127 z -2..43 (Wasserturm 106.5,20.5). Spawn (4.5,-74.6), Jupp (7.2,-77.4).
  Benz dais x 20..23 z -77..-72; Paradeplatz fountain (-.5,28.5); Grumbach (-.85,-62.75); Kessler (44.5,65.25); Hannes (13.5,-72.6).
- Mannheim: the ride in passes between two tall quay walls (TOWN-WATER = 8); a grassy dike on one bank would
  open it up (cranes need the north quay)
- Ruderboote race under the Alte Brücke (plan only): rent a rowing boat on the Neckarwiese bank, race a rival rower
  (generic name) round buoys under the bridge arches and back; phone = two big oar buttons, desktop = A/D strokes;
  each stroke an impulse + drag, steering from stroke imbalance; timer + best time in localStorage; start from
  Jupp's boat code (boatTick) for the water height and the camera.
- Students: at night Mira/Aylin/Hannes are gone; they could sit on the fountain rim singing, or Hannes could turn
  up in the Karzer after his list is done
- Karzer: the bare patch sits over a random graffiti tile (a silhouette shows round it); an OV entry for face
  '-57,25,78,1' could give it a quieter tile. Player name on the mark instead of 'Gast' if the app ever gets names
- optional firework bang sounds after a tap
- real phone test of the touch stick + look; real GPU fps (v1.14 adaptive sharpness: ask phone users if it looks soft)
- the monkey rub buttons still sit bottom-left on narrow phones (only near the monkey)
- speed ideas left (v1.24/25 pass): mesher emit into growable typed arrays (load ~0.9 s headless); 2D greedy merge
  needs fract() on the v axis in blockMat's map_fragment (uv.y is clamped now); landscape Königstuhl view is ~320k tris (world itself)

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
- v1.15 (Bergbahn): world chunks 304k tris. Phone FOV (390x844): spawn 161k/54, philS 225k/68, Königstuhl north
  243k/79 (busiest). Desktop 1280x800: philS 261k/88, Königstuhl north 293k/97. Probe $SP/hb15/p/perf.py.
- v1.15 step 2 (Fernrohr): +1 Frieda mesh; scope view phone 157k/34 max, desktop 155k/31 (p/sperf.py).
- v1.16 (Café Nerd): views nerdL/nerdIn phone 115-126k/27-33, desktop 153-162k/38-48; max unchanged
  (Königstuhl north phone 250k/86, desktop 299k/103).
- v1.17 (Altan + Glockenturm + gables): +3k tris/+1 call everywhere; Altan views phone 164-182k/42-43, desktop
  212-214k/56-60; max phone 251k/87, desktop 302k/105.
- v1.18 (Scheffelterrasse + Gartenbrücke + Viktor): max phone 257k/88, desktop 307k/105 (Königstuhl north); garden
  view 81k/13 phone, 90k/16 desktop; altan 186k/43 phone, 218k/60 desktop.
- v1.24 (speed pass 1, probe $SP/hbpol/p/perf.py, 11 views x golden/night): portrait 390x844 max 258k/90 calls
  (was 105), desktop 1280x720 max 315k/134 (was 142), landscape 844x390 max 320k/118 (was 151). Tris are the world
  itself (chunks 307k + skirts 69k), the busiest is the Königstuhl north view.
- v1.30 Mannheim (separate scene, 64 chunks, ~135k tris world, gen ~160 ms + mesh ~190 ms headless): phone 390x844
  max 39 calls / 88k (landing, Wasserturm), Schloss views 15-16 / 30-33k; desktop 1280x720 Schloss 29-30 / 53-59k.
- v1.33 Mannheim night (views_n: planken/wt/landing/schloss/hbf/aerial): phone 390x844 max 46 calls / 98k (landing),
  planken 26/53k, wt 15/26k; desktop 1280x720 max 67/140k (landing), aerial 55/113k, planken 41/74k. Day +2 calls/+5k.

## testing
- scratch: $SP/hb (index.html + mk.sh injects window.__G/__E into gaunt/sw/hm43/hb). The live file only has a
  /*HOOK*/ marker comment. Probes step G.physics(1/60, G.inp) directly (headless fps is low).
- probes in $SP/hm: hb_walk.js (waypoint bot: castle, Snake Path + Philosophers' Walk, monkey rub), hb_edge.js
  (swim into every map edge + quays, log max y), hb_p5.js (tris/calls from 11 viewpoints), view.sh (any viewpoint).
- 2026-10-12 14:08 UTC v1.5.1: MIKE'S STONE. Flax asked for "in Memory of Mike - Flax" carved into the arch of the Old Bridge as an everlasting memory. memorialMesh(): a pale sandstone tablet (canvas 340x100, emissiveMap so it reads in the bridge's shade) on the east face over the last arch by the old town (x 4.02, y 18.5, z 40.5), seen from the river and the old-town quay steps at x~16. PERMANENT: keep it through every upgrade and rebuild, never move it out of sight, no hint markers (it's a quiet find). Flax also asked that upgrades never break the town: test every release, roll back if one does.
- 2026-10-12 14:18 UTC v1.5.2: Mike's stone MOVED where Flax wanted it: inside the bridge gate's archway between the two towers, on the west wall of the passage at eye height (x -1.98, y TOWN+1.9, z 53.5, facing +x). Everyone walking into town passes it. Still permanent.
- 2026-10-12 14:24 UTC v1.5.3: Mike's stone in its FINAL spot (Flax: "when the tour starts, you look at the gate and right above the arch, below the 3 windows"): the gate's bridge-facing face, x .5, y TOWN+7, z 49.97, facing -z, 4.4 x 1.3. Visible as a pale tablet from the spawn, readable as you walk up. Don't move it again unless Flax asks.
- 2026-10-12 14:45 UTC v1.5.4: Mike's stone a little smaller (3.2 x .95) and lower, at TOWN+5.5: set into the red brick band right on top of the gate arch, under the two windows (Flax 14:21: "I love it, maybe a little smaller and placed 2 rows down"). Still visible from the spawn. PERMANENT - keep it here through every rebuild unless Flax asks.
