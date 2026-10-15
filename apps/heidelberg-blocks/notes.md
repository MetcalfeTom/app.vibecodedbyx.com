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
  Mannheim: the Quadrate (rows A-K west + L-U east of the Breite/Kurpfalzstraße, no J (v1.61: was 'no I' with a J row, fixed); G1 Marktplatz and O1
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
- 2026-10-14 12:11 UTC v1.34 (helper, for Flax 10:59 "i like to go to hirschhorn by boat"): HIRSCHHORN BY BOAT. Jupp's
  where-to box has 3 options now (1/2/3 keys): round trip, 'Up to Hirschhorn' (hhGo, upstream = east from the quay,
  HH_OUT/HH_TOUT lines, card 'Heidelberg → Hirschhorn': Heidelberg lock, Neckargemünd + Dilsberg, Neckarsteinach's four
  castles; card .hh variant with hills, a castle mark and four towers), 'Down to Mannheim'. The town is hirschhorn.js
  (same build(H) contract as mannheim.js + folk/solid/home/thome/jb/hint): the Neckar bending round the Ersheim
  meadow, the half-timbered old town (two rows, own atlas tiles 49-62: plaster W/C post/rail/diag, shutter windows
  green/red, beam, wall stone, roof tiles) on its river wall with a gate tower + stairs up from the landing jetty, a
  wall tower and a corner tower, window boxes with geraniums, the café on the corner with its terrace over the river,
  Burg Hirschhorn on its rock above (curtain wall, gatehouse, Bergfried, Palas, a north wing, yard with well + linden,
  an open terrace with a railing you can look straight down from: virtual solid cells via w.solid in solidAt), the
  Burgweg up from the west end, the Ersheim chapel with tower + graveyard across the river, autumn Odenwald all
  round, lamps + floodlights at night. Folk: Frau Seiler (landing), Anni (café), Herr Vogt (angler, fixed), Frau
  Keller (chapel), Herr Albrecht (Burgwirt) + walkers Ruth & Klaus, Herr Lenz with Bello, Mia jogging, a Wanderer up
  the Burgweg (MH.folk routes run walkStep in mhTick). index.html generalised: MH.k + MH.T + awUse() swap the town
  fields, AWM per-town module promises, mhCard/mhLeave/mhGoHome/mhLand/mhSpawn read the town. 0 JS errors, phone +
  desktop, Mannheim trip re-tested.
- 2026-10-14 12:28 UTC v1.35 (helper, for Flax 10:57 "Mannheim is lonely" + Hirschhorn life): MANNHEIM CROWD PASS +
  more Hirschhorn folk. index.html mhCrowd() adds 16 Mannheim folk to mhFolk (scale + route init there too): Planken
  walkers in lanes z 19.3 Frau Hübner (bags), 20.1 Oma Hannelore (stick, x -40..10) + Herr Schulz (newspaper,
  x 20..72), 20.9 Deniz (coffee), 21.7 Herr Petersen (briefcase), 22.3/22.95 Tobi & Sanne (spaghetti ice); Jana + Ayla
  window shopping at E1 (fixed, z 18.45); Breite Straße Paul (balloon Kurt) + Paul's Papa (x -10.2/-11.4) and Emre
  (x -8.4, off to the train); Finn + Kiki at the Paradeplatz fountain; the Kayas on its bench (sit .45). Hirschhorn
  (hirschhorn.js): two swans by the Ersheim bank (-32,-15), Ines + Ole at the castle terrace railing, kids Ida + Theo
  skipping stones on the Ersheim bank (-21,-6.6, y 12). Lamps at Planken z 18.6/23.4 keep the lanes clear. 0 JS
  errors, full trip probe (phone) incl. Mannheim + second Hirschhorn trip.
- 2026-10-14 12:38 UTC v1.35.1 (helper, Flax 12:35 "castle in hirschhorn has stones in the air flying"): the castle's
  curtain-wall loop had slipped into the end-of-line comment in v1.34 (`// the terrace ... for(let y=CY..)`), so only
  the merlons at CY+6 were built, floating. Loop back on its own line; a scan of the castle area (float.py: solid
  blocks with air below, roofs/leaves skipped) now only finds the gatehouse passage lintel + the town gate stair
  ceilings. Also removed "No bridge here" from Jupp + Frau Seiler (not sure there's no bridge). LESSON: never put
  code after a // comment on one line when patching; node --check can't catch it.
- 2026-10-14 12:50 UTC v1.36 (helper, Flax 12:32 rebuild, step 1): THE MARKTPLATZ + THE MARKTKIRCHE. Row B opens up
  north of the street in the east half (x 10..30, z -57..-48; the three houses there gone, the east one moved to
  x 31..35). The Protestant market church stands three steps up on a red sandstone terrace (Tc = T+3) cut into
  the slope under the castle rock: nave x 13..25 z -68..-59 (white plaster, red sandstone corners/plinth/cornice,
  four tall leaded windows with round-arched tops = new atlas tiles 39 + 63 as hh_chB/hh_chT, door x 19 with a
  sandstone frame, steep red tiled roof), tower at the east end x 26..30 z -66..-62 up to Tc+23 (belfry louvres,
  clock board on the south face, slate spire with a gold knob, ~y 54). Look kept generic (unsure what the real one
  looks like). Market stalls (Frau Haas vegetables, Herr Fuchs autumn flowers), a linden + bench, Herr Brenner on
  the bench below the terrace, 'Marktplatz' sign on the house at x 9, a pale path to the steps, the church front
  floodlit at night (flood zone 4). Place names Marktplatz/Marktkirche. Hint + Jupp + Frau Seiler point there.
  Phone 390x844: markt 15/55k, castle 52/123k, aerial 58/112k; desktop markt 26/82k, castle 73/197k, aerial 74/172k.
  0 JS errors, full trip probe (phone) incl. Mannheim + second Hirschhorn trip.
- 2026-10-14 13:04 UTC v1.37 (helper, Flax 12:32 rebuild, step 2): THE LAYOUT. (a) Wall houses: row A's ground floors
  on the river face are now the town wall itself (house() o.wallF: rubble stone with windows at z1 for f 0), so from
  the water it reads as stone wall below, half-timbered floors on top. (b) The MITTELTOR: gate tower over the street
  x -24..-21 z -48..-44 to T+13 (tiled roof, lit windows), passage z -47..-45 y T..T+2 with a red sandstone lintel at
  T+3 (walker lanes still fit); the wall lamp moved from x -20.5 to -18.5; row B's two lamps that lost their houses to
  the square became post lamps at (10.6/29.4,-48.6). (c) The KLOSTERKIRCHE on a terrace at KY=31 (x -44..-28,
  z -70..-57) on the slope below the castle, west side, a short lane in from the Burgweg (x -49..-45 z -65..-62): red
  sandstone nave x -42..-33 z -67..-61 with four tall arched windows each side (hh_chB/chT), west door x -42 z -64,
  narrower choir x -32..-30 with an east window, steep tiled roofs, a small white/slate roof turret with a gold top
  (no tower: mendicant church). Floodlit at night (zone 5). Frau Lindner sketches it (fixed, -37,-58.6). (d) The
  WEIR + LOCK upstream on the east leg: four piers x 44/49/54/59 (2 wide, z 29..32, white pier houses with slate
  roofs on z 31..32), slate-topped gates at z 31, a railed walkway at y 16 on z 29..30; lock chamber walls x 61 + 67
  z 18..44 with gates at z 18/44 and bollards. Place names Mitteltor, Klosterkirche, Wehr, Schleuse. float scan:
  only the Mitteltor lintel, the gatehouse passage, the gate stairs and the weir walkway between piers (all meant).
  Budget below. 0 JS errors, phone trip probe passed.

- 2026-10-14 13:50 UTC v1.38 (helper; Flax 13:06/13:08/13:23, Angie 13:27/13:29): (a) MANNHEIM L2 SECRET: the
  ground-floor wall at x 10 z 70..71 (L2G box [10,10,T,T+2,70,71], MH.w.ghost, solidAt skips it) looks shut but you
  walk through, no hint marker. Inside the Gedenkhalle: stone floor, candles, soft lights, an EMPTY plaque at
  (14,T+2.4,68.03) - MEMO={title:'',lines:[]} in mannheim.js ("THE MEMORIAL TEXT DROPS IN HERE"), Flax gives the
  words; 11 steps up the east/south walls (L2S) to a hatch at (17,LT,69..71), a parapet roof (B.parapet, no step-off)
  with a chimney; MH.w.l2={x:14,z:71,roofY:LT+1} is there for the helicopter. Place names Gedenkhalle, L2 · Dach.
  (b) FRIEDRICHSPLATZ WASSERSPIELE: a long basin x 120..126 z 3..38 (BAS) along the east side, a stepped trim
  cascade x 116..119 z 18..22 with a water sheet (CASW), seven instanced jets (JET list, one InstancedMesh, animated
  in tick), lawns + four trees at the corners. (c) HIRSCHHORN: the Burgweg sign stands on its own post at
  (-34.9,T+2.2,-44.3) clear of rock + house; a level cobbled forecourt x -33..-28 z -79..-73 at CY before the
  gatehouse (no more rounding steps/rock lumps), the passage walls one rubble stone, red sandstone jambs + lintel on
  both portals. (d) EDGES: three hazy ridge layers (RING in index.html, 3 meshes, follow the camera, scaled to
  camera.far, tinted to the horizon colour in applyTime) shaped per town: Heidelberg Odenwald N/E/S + flat Rhine plain
  W, Mannheim Odenwald E + Haardt W + flat N/S, Hirschhorn hills all round; Mannheim gets a 1-high hedge on the map
  edge (rail fence over the tracks, river open) and low house blocks + trees beyond it in the far-skyline mesh (no new
  draw call). (e) TOUCH (Angie: looking made her walk): the stick only starts in the lower-left (x<50% AND
  y>38%), everything else is look; dead zone 10 px (.18 of R 56); stick ring brighter + a dashed zone (#szone) shows
  while you hold it. CDP touch probe (?touch, emulation + touches in one session): look drags on the right, upper
  left and mid-left left P.x/z unchanged (yaw/pitch moved), a 6 px tap in the stick zone did not move, a stick drag
  walked ~6 blocks in 1.4 s. Mouse was already look-only. 0 JS errors, phone trip probe passed.

- 2026-10-14 14:00 UTC v1.38.1 (helper, Angie 13:52 "the thumbstick box is huge"): the stick is now a FIXED ring
  bottom-left (#stick 7rem at left max(1rem,safe) / bottom --bot+.6rem, dim .5 at rest, full while held); only a touch
  within the ring + 22 px starts walking (stickHit), the knob is clamped in the ring (no more floating stick), every
  other drag looks. The v1.38 dashed #szone box is gone. Tutorial "Drag to walk" sits on the ring, label above.
  CDP touch probe (?touch, emulation + touches in one session, 390x844) in Heidelberg, Mannheim and Hirschhorn: drags
  from the old zone (30%,60%) and just outside the ring only turned the view, a 4 px tap on the ring did not move,
  a ring drag walked. 0 JS errors.
- 2026-10-14 14:23 UTC v1.39 (helper, Flax 13:23 "we said we want a ruderboot competition"): RUDERBOOTE. A jetty
  with two moored rowing boats + a blackletter "Ruderboote / Verleih · race the club" sign on the Neckarwiese bank
  (ROWJ -65,-45.5; sign x -61.6 so it doesn't hide the jetty). Ride button (R) within 4.5: "🚣 Rowing race vs Ole".
  Fade to the start line east of the bridge (50,-20, facing west), Ready/3/2/1/Los!, race Ole from the rowing club
  (generic name) down the Neckar: 3 red buoy gates (28,-18) (-22,-24) (-42,-30) ±4, under an arch of the Alte Brücke
  (z -13..-7 is Ole's), to green flags at x -58. Missed gate = +3 s. ◀/▶ buttons (touch) or A/D pull one oar each,
  W both; a fresh tap strokes at once, holding repeats only every .6 s, so tapping wins (perfect taps ~22-23 s,
  Ole ~25.4 s, holding loses). Bonk on walls/piers bounces back. 16 cheering people with flags on the bridge
  parapets (hop during the race). Result in the HUD, best in localStorage 'hb-row-best', back on the meadow after
  7 s (or 🏁 any time). Seat is aft so the oar shafts show; drag still looks around (eases back after 1.2 s).
  Mike's stone untouched (bridge gate, far from the course). Code: ROW/rowTick/rowAmb before fadeDo.
- 2026-10-14 14:40 UTC v1.40 (helper, Flax 13:06 + 14:21 "Now i need the Helikopter please"): RUNDFLUG. A helipad
  pontoon in the Neckar off the Neckarwiese (HELP -95,-34, west of the rowing course; canvas H + yellow ring, edge
  lights, windsock, gangway to the bank) with a red-and-white helicopter (no marks, no registration), and a blackletter
  "Rundflug / Heidelberg von oben · with Birte" sign. Board from the bank (HELJ -95,-45.3, R / 🚁 button). Pilot Birte
  (generic name) spins up, lifts off, flies a ~60 s CatmullRom loop (HELW): east along the Neckar, over the Alte Brücke,
  round the castle (east, south, west at y 84-90), back over the Altstadt and the river, hovers and sets down over 6 s.
  The view turns to the bridge / castle / Altstadt on its own (HELPOI), drag looks anywhere (eases back after 2 s).
  Five short commentary lines (bridge 1780s sandstone, castle 1690s French troops + 1764 lightning, Altstadt
  Heiliggeistkirche + Hauptstraße, Philosophenweg). ⏭ skips straight to the pad. Aboard: the cabin shell + tail rotor
  hide (camera sits inside), skids, spinning rotor, window posts and a low dash stay. Fog 110/520 + far 560 while
  airborne, restored on landing. secFound() is blocked while flying (flying over the Hortus counted as finding it).
  Also: on touch the rowing hints sit up top (body.rowing) and flight hints use the full width (body.flying).
  The earlier plan (from the L2 roof over Mannheim, Heidelberg and Hirschhorn) is NOT built: ask Flax if he wants it.

## issues
- Phones see the app inside the nginx bar iframe: about 390x624 portrait, 844x300 landscape. Test 800x300.
- fannar22 2026-10-11 23:50: rising into the sky at the east/west map edge in the river (fixed v1.1, probe hb_edge.js).
- pathLine drop walls: a one-block drop must not get a parapet (blocked the Snake Path entry from Brückenstraße).
- Landscape 800x300: a long toast can sit over the ride/talk buttons for its few seconds (general HUD, not scope).
  v1.25: the HUD is two rows there now (compass, then place + quest chip).
- Castle walkability: run p/bfs.py (route search from the gate, no drops) after any castle change; the courtyard was
  split into closed pockets for days without anyone noticing (fixed v1.18).

## todos
- Gedenkhalle plaque in Mannheim's L2 is EMPTY on purpose: ask Flax who/what it remembers, then fill MEMO in mannheim.js
  (title + up to 4 lines); never invent a name or dedication.
- Flax's queue, what's left, in this order (13:57):
  1. Stückgarten west of the Dicker Turm (castle)
  2. more room round the Großes Fass in the cellar
  3. Jesuit church, Marstall, Karl Theodor statue on the bridge
  4. German dialogue switch
  5. Café Nerd: a board game you can join (and Nele's daily special)
  6. life in the west Altstadt: lit windows at night, a stall or a bench crowd (Manuel + Petra already walk there, v1.18.2)
  (garden lanterns DONE v1.22; Neckarwiese + ducks DONE v1.21; busking DONE v1.20, Funkjoker v1.21; Karzer DONE v1.19)
- NEXT for Flax (00:45 + 00:50 10-15): Heiliggeistkirche walk-in DONE v1.47; then the MANNHEIM MAKEOVER in steps of
  one or two landmarks per release (Flax: "so many famous places and churches"): Marktplatz with the Altes Rathaus +
  St. Sebastian + Marktplatzbrunnen DONE v1.48; the Jesuitenkirche DONE v1.49 (A4+A5, walk-in); Wasserturm
  gardens + Rosengarten + Kunsthalle DONE v1.50 (Flax: "Both"); the Barockschloss + Rittersaal DONE v1.51; the
  Popakademie DONE v1.52; Jule's stunt show DONE v1.53 (Flax 07:39: Birte stays calm in Heidelberg);
  the ⏺ record-a-clip button DONE v1.54 (Flax 07:36); NEXT Planken shops. Ideas for the Marktplatz: walk into St. Sebastian, the
  weekly market stalls on the square (check the real days first).
  Note in the log any landmark placed where it isn't really. The castle queue above (Stückgarten first) comes after.
- Jesuitenkirche ideas (v1.49): the organ gallery over the porch + its stair (asked on the board), Brinckmann's four
  continents in the dome's corners, side altars, the bells ringing for mass, the Jesuit college next door.
- Heiliggeistkirche ideas: a stair up the pulpit, the tower stair to the belfry (the bell already strikes the hours),
  someone in the Krämerbuden selling things, the south side's booths (the lane there is only 3 wide).
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
  Straße (route folk in MH.folk, reuse walkStep), people on the Paradeplatz benches [DONE v1.35], a tram on the Planken.
  Questions for Flax: are Herr Grumbach + Frau Kessler good names? Should Hannes come home on the boat with you?
  Faster or slower than 2:00 for the bread?
- MANNHEIM queue (Flax 22:58 + 23:5x, in this order; Benz + Paradeplatz DONE v1.31; Hannes, L4 delivery, baker DONE v1.32): v1.31 Carl Benz's 1886 Patent-Motorwagen on a plinth (plain
  plaque "Carl Benz, Mannheim 1886, the first car", Bertha Benz 1888 line, NO brand logos/stars; drivable slow
  putter if cheap), the Paradeplatz (fountain pyramid monument + trees, where the Planken cross), Hannes from the
  Uniplatz as the self-declared Mannheim expert whose map turns out to be upside down (he already carries a map
  of "Mannheim" since v1.29), a parcel delivery to a block code (e.g. L4) by the corner signs only, before the
  bread goes cold, and a grumpy baker. v1.32+: Planken shops, Jesuitenkirche dome, Rhine-Neckar confluence, night
  lights (Wasserturm is dark at night now), crowds.
- HIRSCHHORN (v1.34+, for Flax) layout (hirschhorn.js): river polyline RP, half width 12 (water z -32..-8 in front of
  the town), Ersheim = inside the loop (meadow y 13, chapel nave x -6..7 z 5..11, tower x -10..-7, graveyard wall
  x -15..16 z -1..18), Uferweg z -36..-33 (y 13), town wall z -38..-37, row A z -43..-37, street z -47..-44 (y 19),
  row B z -55..-48, café x -9..-3 (terrace x -6..3 z -43..-38), gate tower x 4..8 (stairs x 5..7), jetty x 2..10
  z -32..-29 (y 12), castle plateau x -26..12 z -90..-60 at CY 46 (terrace x -15..1, railing z -59), Burgweg BW from
  (-36,-45.5) to the gatehouse (-27.5,-76). Spawn (5.5,-30.5), Jupp (9,-29.6). Boat lands at (6.5,-24.8).
- HIRSCHHORN NEXT ideas: Neckarsteinach's four castles as a real stop on the way (a far skyline or a stop), the lock,
  more folk on the castle terrace [Ines + Ole v1.35], the Burgweg steps + benches, a little Hirschhorn quest (Anni's
  cake to the castle?), the Carmelite monastery church below the castle (ask Flax first). Mannheim crowd DONE v1.35
  (tram still open; verdict: a big grid city never gets cosy in blocks, keep it a side trip, Hirschhorn is the lovely
  scene).
- HIRSCHHORN REBUILD (Flax 12:32 UTC 10-14: "lovely but not original. Also marketplace and church are missing. Please
  rebuild more original way." He is a local + our sign inspector: a Neckar valley local should recognise the town).
  REAL LAYOUT we build to (own knowledge, no web; only what I'm confident of):
  * the old town sits on the steep outside of a tight Neckar bend, on the slope between the river and the castle
    ridge; across the water, inside the loop, the flat Ersheim side with the Ersheimer Kapelle in its graveyard
    (one of the oldest churches of the Neckar valley; the graveyard is still in use). [game: town north, Ersheim
    south inside the U of RP - kept]
  * along the river the old town wall, with half-timbered houses built into it / standing on it (stone below,
    timber-framed floors above) - the classic view from the water.
  * the Marktplatz in the old town with the Protestant Marktkirche (early 17th c.).
  * the Mitteltor: a gate tower inside the old town over the main street.
  * the former Carmelite monastery church (Klosterkirche, Catholic, Gothic) on the slope between the town and the
    castle.
  * Burg Hirschhorn on the ridge right above the town: Bergfried + Renaissance Palas (a hotel/restaurant today).
  * a Neckar barrage at Hirschhorn: weir + lock (Staustufe).
  UNSURE (kept generic, questions for Flax): which end of the town the Marktplatz is at and how the Marktkirche's
  tower looks (built: square tower, slate spire, clock - generic); where exactly the Mitteltor stands; the
  Klosterkirche's exact spot (east or west below the castle) and look; which side + which end of the town the
  lock and weir are on (built: upstream, east leg, lock on the town side); whether there is a road bridge (Jupp's
  "no bridge here" line REMOVED - not sure); street names (none used except Marktplatz); the B37 / railway along
  the river (left out).
  PLAN: v1.36 Marktplatz + Marktkirche (east half, north of the street, cut into the slope), drop the bridge lines
  [DONE]; v1.37 wall houses, Mitteltor over the street, Klosterkirche on the slope below the castle (west), weir +
  lock (east leg, lock on the outer = town-side bank) [DONE]; next: move whatever Flax corrects (Mitteltor spot,
  Klosterkirche east/west, lock side), a stair lane from the street up to the Klosterkirche, the B37/railway only if
  Flax wants them.
  Coordinates v1.37: MP x 10..30 z -57..-48, MK x 13..25 z -68..-59 + tower MT x 26..30 z -66..-62 (Tc = T+3);
  Mitteltor x -24..-21 z -48..-44; Klosterkirche KK x -42..-33 z -67..-61 + choir to x -30, terrace KY 31;
  weir x 44..60 z 29..32, lock x 61..67 z 18..44.
- Mannheim layout (mannheim.js): Neckar water z -99..-80, quay promenade z -78..-71 (y TOWN), Ring z -70..-63,
  axis x -14..-7 (block centre -10.5), Planken z 18..23, Kaiserring x 80..87, rows rowZ(r)=-62+14r(+2 from row 6),
  east blocks x0=-6+15(n-1), west x0=-25-15(n-1), Schloss x -85..64 z 84..105, HBF x 70..124 z 114..125,
  Friedrichsplatz x 88..127 z -2..43 (Wasserturm 106.5,20.5). Spawn (4.5,-74.6), Jupp (7.2,-77.4).
  Benz dais x 20..23 z -77..-72; Paradeplatz fountain (-.5,28.5); Grumbach (-.85,-62.75); Kessler (44.5,65.25); Hannes (13.5,-72.6).
- Mannheim: the ride in passes between two tall quay walls (TOWN-WATER = 8); a grassy dike on one bank would
  open it up (cranes need the north quay)
- Rundflug: Birte's riverbank loop (v1.40) + Jule's three-town flight from the L2 roof (v1.45) both built; v1.46 you call
  Jule in (pad starts empty). Ideas: a rotor sound, a night flight with the castle lit, a shorter "Heidelberg only"
  choice from L2, the cloud card title in the night palette (#hfc.n, untested at night); ask Flax about flight length
- Ruderboote (v1.39): ask Flax if the course is right (start east of the bridge, finish off the Neckarwiese); ideas:
  a 2-player ghost of your best run, a slalom variant, Ole's rematch line
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
- v1.34 Hirschhorn (views_hh: landing/across/street/castle/aerialS/chapel, day + night): phone 390x844 max 53 calls /
  123k (aerial), street 36/111k; desktop 1280x720 max 73/207k (castle terrace), aerial 66/171k. Voxel chunks 230k tris.
- v1.35 desktop 1280x720: Mannheim crowd planken 60/97k, window 39/63k, parade 41/77k, breite 67/120k, landing 76/142k
  (mhStats 139k tris); Hirschhorn railing 58/188k, kids from behind 50/113k, along the bank 49/140k.
- v1.38: phone 390x844 Gedenkhalle 43/67k, L2 roof 19/33k, Wasserspiele walk 20/32k, cascade 15/22k, Friedrichsplatz
  aerial 24/36k, Hirschhorn gate 32/103k, Heidelberg N edge 11/78k; desktop 1280x720 hall 76/110k, gate 47/146k,
  Wasserspiele 18/45k, Mannheim E edge 14/26k. Ridge ring = +3 calls, ~0.9k tris.
- v1.39: phone 390x844 jetty 69/190k, start line 42/122k, approaching the bridge 84/171k; desktop 1280x720 jetty
  123/250k, start 110/245k, bridge 125/234k. Race meshes are lazy (built within 260 of the jetty).
- v1.40 flight: phone 390x844 pad 59/164k, lift 74/184k, bridge 33/120k, castle 122/241k (busiest), castle south
  95/240k, Altstadt 69/188k; desktop 1280x720 castle 150/307k, castle south 156/316k, lift 130/301k.
- v1.37 Hirschhorn layout: desktop 1280x720 mitteltor 33/112k, wallR (from the water) 49/111k, kloster 18/71k,
  klosterW 61/162k, weir 31/114k, aerialS 75/176k; phone 390x844 day + night mitteltor 27/81k, kloster 17/57k,
  aerialS 61/115k.
- v1.33 Mannheim night (views_n: planken/wt/landing/schloss/hbf/aerial): phone 390x844 max 46 calls / 98k (landing),
  planken 26/53k, wt 15/26k; desktop 1280x720 max 67/140k (landing), aerial 55/113k, planken 41/74k. Day +2 calls/+5k.
- v1.57 Planetarium (day): desktop 1280x800 Kuppelsaal 31 calls / 65.5k tris / 426 star points; phone 390x844 hall
  27/50k, foyer 31/54k, Kaiserring street west of it 28/61k. Hall meshes hidden outside 16.5 of its centre.
- v1.58 Friedrichsplatz (day): desktop 1280x800 aerial over the square 85 calls / 145.8k tris (v1.57 same spot 87 / 137.9k);
  phone 390x844 on the lawn 25/73k, aerial SE 53/103k. Jets: 1 + 12 middle row + 24 side rows + 10 terrace + 2 round = 49 instances.
- v1.59 bridge statues: one merged mesh, +1 call / +2.4k tris (phone 390x844 at Carl Theodor 47/131k, v1.58 same spot 46/128k;
  desktop 1280x800 at his plate 104/194k).
- v1.60 right ring: DOM only, no render cost (phone 390x844 on the bridge 47 calls, same as v1.59).
- v1.61 three Mannheim folk: one draw call each when in view (phone 390x844 Paradeplatz 40 -> 41, Marktplatz 29 -> 30).
- v1.62 trams: +6 calls (3 sections x 2 trams, one shared folkMat) + ~1.5k-2k tris per section in view; rails/wires/shelters
  are boxes in the merged props mesh (0 calls). Desktop 1280x720 Paradeplatz stop 83-85 calls / 148k tris; phone 390x844 on the
  platform 39 calls / 86k tris.

## testing
- scratch: $SP/hb (index.html + mk.sh injects window.__G/__E into gaunt/sw/hm43/hb). The live file only has a
  /*HOOK*/ marker comment. Probes step G.physics(1/60, G.inp) directly (headless fps is low).
- probes in $SP/hm: hb_walk.js (waypoint bot: castle, Snake Path + Philosophers' Walk, monkey rub), hb_edge.js
  (swim into every map edge + quays, log max y), hb_p5.js (tris/calls from 11 viewpoints), view.sh (any viewpoint).
- 2026-10-12 14:08 UTC v1.5.1: MIKE'S STONE. Flax asked for "in Memory of Mike - Flax" carved into the arch of the Old Bridge as an everlasting memory. memorialMesh(): a pale sandstone tablet (canvas 340x100, emissiveMap so it reads in the bridge's shade) on the east face over the last arch by the old town (x 4.02, y 18.5, z 40.5), seen from the river and the old-town quay steps at x~16. PERMANENT: keep it through every upgrade and rebuild, never move it out of sight, no hint markers (it's a quiet find). Flax also asked that upgrades never break the town: test every release, roll back if one does.
- 2026-10-12 14:18 UTC v1.5.2: Mike's stone MOVED where Flax wanted it: inside the bridge gate's archway between the two towers, on the west wall of the passage at eye height (x -1.98, y TOWN+1.9, z 53.5, facing +x). Everyone walking into town passes it. Still permanent.
- 2026-10-12 14:24 UTC v1.5.3: Mike's stone in its FINAL spot (Flax: "when the tour starts, you look at the gate and right above the arch, below the 3 windows"): the gate's bridge-facing face, x .5, y TOWN+7, z 49.97, facing -z, 4.4 x 1.3. Visible as a pale tablet from the spawn, readable as you walk up. Don't move it again unless Flax asks.
- 2026-10-12 14:45 UTC v1.5.4: Mike's stone a little smaller (3.2 x .95) and lower, at TOWN+5.5: set into the red brick band right on top of the gate arch, under the two windows (Flax 14:21: "I love it, maybe a little smaller and placed 2 rows down"). Still visible from the spawn. PERMANENT - keep it here through every rebuild unless Flax asks.
- 2026-10-14 14:43 SEO refresh (no version bump): title 'walk, row and fly over a blocky 3D Heidelberg', 147-char description + og/twitter/JSON-LD mention the rowing race, helicopter tour and Mannheim; intro card names the race, Birte's tour, Mannheim and Hirschhorn.
- v1.40.1 2026-10-14 14:58 (smartass42): the castle courtyard well was a 6-deep 1x1 shaft you could jump into and never leave; the shaft is stone now with the water at the rim (C-1).
- v1.41 2026-10-14 15:01 (smartass42): FLY CHEAT. Type F-L-Y (keydown buffer FLY.buf) or the 🕊 button in the quest log (phones) → flyToggle(); physics() hands off to flyPhys(): fly where you look (pitch), Space/jump climbs, Shift fast (20 vs 9), walls still collide, cap SY+30. secFound() ignores finds while FLY.on. Off during rides ('Get out first').
- v1.41.1 2026-10-14 15:04 (Angie 'secret code box', smartass42 couldn't type on the page): the quest log's fly button became a 🔑 Secret code box (#qcheat/#qcode). CHEATS table {fly}; keys typed in the box stopPropagation (no walking/J/M/R); wrong code shakes + toast. Angie: 'there will be more cheats' - add codes to CHEATS (voice pitched: tourists into ducks).
- v1.42 2026-10-14 15:09 cheat STORM (Sloppy's code, Angie yes): stormLook() grey sky/fog/hemi (re-applied at the end of applyTime), 1400 rain streaks round the camera (one LineSegments), a TubeGeometry bolt 70-150 m ahead every 5-14 s with a hemi/exposure flicker and lowpassed-noise thunder delayed by distance, rain hiss loop on SND.mix. Rain/bolts skip Mannheim. Typing STORM only works in the code box (S/R/M are game keys).
- v1.43 2026-10-14 15:11 cheat POSTCARD (or SEPIA): CSS filter on #view (sepia .62, faded hand-tinted) + #pcard overlay (vignette, cream border, 'Gruß aus Heidelberg/Mannheim' in the Fraktur title font).
- v1.44 2026-10-14 15:35 (Marci): THE WALDSCHENKE. Marci remembered Kaiserschmarrn at a Gasthaus with a Biergarten in the woods across the river on a team walk ('must have been Waldschenke Heidelberg'), NOT on the Marktplatz. waldWorld() cuts a gravel terrace into the hill at the northmost Philosophenweg cell at x -14 (WALD bounds), with a cream-walled inn (stone plinth, log corner posts, stepped red roof, chimney, Fraktur sign 'Waldschenke · Gasthaus · Biergarten · Kaiserschmarrn'), three beer-garden sets with four hikers (HIKERS hikerA-D), mugs and a shared Schmarrn. Seat 'wald' (gy = WALD.y; seatY() lets cafeNear/cafePin/cafeStand work off TOWN height): sit, served after 5 s, a Kaiserschmarrn plate (schmarrnParts: torn golden pieces, powdered sugar, raisins, plum compote dish) + coffee, castle view across the valley. Counter WALD.n in localStorage 'hb-wald', first one = achievement Gipfelglück. placeName 'Waldschenke'; café side panel has the rumour; Fanny at the Marktplatz points you up there. A homage from Marci's memory, not a survey of the real building: ask Marci if the view/tables/plate feel right. Tables are walk-through (no collision cells).
- v1.45 2026-10-14 16:36 (Flax 15:53 "I ordered for mannheim roof where I can order it like the bergbahn"): RUNDFLUG
  FROM L2. A blue-and-white helicopter (heliModel() shared with Birte's, scale .8, no marks) already sits on a pad on the
  L2 roof (HF.D from MH.w.l2), with a windsock and a blackletter sign "Rundflug / Mannheim · Heidelberg · Hirschhorn /
  with Pilotin Jule" (generic name). Walk up to it and the Bergbahn-style big button appears (rideUi key 'bheli', R or
  tap). Flight HFL, 4 CatmullRom legs: Mannheim (Schloss, Quadrate, Wasserturm) -> clouds -> Heidelberg (Neckar leaves
  the Odenwald, Alte Brücke 1780s sandstone + gate, castle 1690s French troops + 1764 lightning) -> clouds -> Hirschhorn
  (old town in the Neckar bend, Burg on the ridge + Burgweg, Ersheim chapel) -> clouds -> Mannheim, Wasserturm, sets down on
  L2. Towns are separate scenes: hfSwap re-parents sky/water/clouds/lights/ring/heli body into the viewed scene (HF.view
  'mh'/'hd'/'hh'), drawScene renders MH.T.hh.scene for Hirschhorn; Hirschhorn is built once mid-flight under the cloud
  card (hfHH, ~1.3 s headless desktop, 0.66 s phone probe) and Mannheim's vox/colTop restored after. #hfc cloud card
  with the town name in Fraktur. Skip returns you to L2. Fog 110/520 + far 560 aloft, 45/420 + 480 restored on landing;
  secFound blocked (HF.on), FLY cheat refused while aboard, place label = HF.place. heliBuild split into heliModel /
  padTex / signTex, mhEnter's build block into awBuild (Birte's flight re-tested, unchanged). Clearance >= 10 m on every
  leg (Hirschhorn north ridge was 3.5 m, rerouted). Budget (headless 1280x720): Mannheim legs 28-38 calls / 52-85k tris;
  Heidelberg 64-135 / 194-327k (peak at the leg start seeing the whole town from the west); Hirschhorn 47-96 / 143-239k;
  Mannheim return 112 / 176k at the start, 31 / 60k on final approach. Tested 1280x720 + 390x844 touch, 0 JS errors.
- v1.46 2026-10-15 00:56 (Flax 18:25 10-14 "L2 please higher building, heli call to fly in"; started by a helper 10-14,
  finished 10-15): (a) L2 IS TALL: six storeys on top of the old three (mannheim.js: HC = T+10 the old roof, now the hall
  ceiling; LT = T+28 the new roof, MH.w.l2.roofY = LT+1 = 48, was 30), cream with red trim belts at HC and T+19, red
  sandstone quoins up all four corners from T+4, same window rhythm as the street. Built by hand after block(), so R() and
  the rest of Mannheim are unchanged. Route: ghost door -> hall -> the old 11 steps -> hatch (17,HC,69..71) -> a stairwell
  (place 'L2 · Treppenhaus', two wall lamps) with 22 steps once round the walls (L2U, landings at i 5/10/13/16) -> roof
  hatch (17,LT,69..71) -> 'L2 · Dach'. Walk probe: street to roof, no stuck points. Pad, windsock, sign, bench, pots and
  chimney all follow LT. (b) CALL JULE: the pad starts empty (HF.cs 0 empty / 1 on her way / 2 parked). Near the pad the
  big button reads 🚁 Call Jule (R or tap, rideUi key 'bhcall'); hfCall flies her in from the west on a CatmullRom
  (HF.ac, 5.5 s approach with a nose-up flare, 1.4 s hover at roof+6, 2.2 s touchdown, ~9 s in all), the rotor winds
  down over 3 s and 🚁 Rundflug ↑ take off appears. If you stand where she sets down (hfInWay: her body's footprint,
  x D.x-4.6..D.x+2.4, |z-D.z|<1.4) she keeps hovering with a hint until you step off. She stays parked after a flight or
  a skip (hfLeave sets cs 2); mhLeave -> hfReset empties the pad, so every Mannheim visit starts with a call. Reduced
  motion: she fades in on the pad in .7 s (own material HF.bm, transparent only during the fade). Flight legs: take-off
  climb to roof+12, the last leg comes in level at roof+8/9 (no hump), Jule's last line 'the tall old block with the H on
  top'. Clearance >= 10 m on legs 0 + 3 outside the L2 footprint (Schloss 10.4), approach 18.8. Birte's flight untouched.
  Probes: 1280x720 (walk, call, hold, land, full flight, skip, leave + come back = empty pad), 390x844 touch (tap call,
  tap take off, tap skip), reduced motion (fade .09 -> .76 -> parked). 0 JS errors.
- v1.47 2026-10-15 01:29 (Flax 00:50 "Heiliggeistkirche should be possible to enter and see it from insight"): THE
  HEILIGGEISTKIRCHE OPENS. hgCarve() runs at the end of buildChurch(): the box x -26..-9 z 74..83 is hollowed to one hall
  x -25..-10 z 75..82 (nave + aisles the same height, a Gothic hall church) up into a stepped pointed vault inside the
  steep roof (roof layer k keeps a one-block shell; air z max(75,74+k)..min(82,83-k), peak TOWN+21; the east gable's
  inner cells set to sandstone). Stone floor. Slim 1x1 red pillars HG_PX x -23/-20/-17/-14 at z 77 + 80, in line with
  the buttresses (moved there because the old x -22.. rows stood right in the side door). Galleries (Emporen) at
  TOWN+5 as a U: north + south aisle x -25..-18 and the west end x -25..-24; a plank stair climbs west up the north
  aisle from the choir (x -13..-17, top step feet TOWN+5, gallery feet TOWN+6). Ways in: the west portal under the
  tower (door blocks gone, tower hall x -32..-28 z 77..79 to TOWN+4, through x -27/-26) and a side door on the
  Marktplatz (x -19..-18, z 74, trim lintel). Krämerbuden in the four north bays (x -25/-22/-16/-13, z 73): plank
  counter, open front, red tile roof + props (striped awnings with valances, goods, a back shelf, a bulb each).
  Light: an else-if region in blockMat (hgLight from hgGlsl(): daylight from KZ_U.x, brighter up in the vault, three
  chandeliers HG_CH + the altar candles); inside the hall sandstone + roofDark tiles are whitewashed in the shader
  (tile index from vTileO: 4 + 28), pillars (hbPil) stay red, window glass (tile 17, blue > red) goes daylight-white.
  Props (hgBuild, folkMat, culled like Café Nerd, e .22 by day): pews facing east, altar with cloth, candles + brass
  cross, pulpit on pillar (-17,80), three chandeliers on chains, gallery balustrades, the west doors standing open,
  King Ruprecht + Elisabeth's tomb (south side of the choir), a brass line at x -13 where the 1706-1936 wall stood
  (THE LINE IS OURS, not in the real floor; the choir is x -13..-10). Hints once per page load (HGK.seen, 6 s apart):
  hall (Gothic hall church begun 1398), emp (Bibliotheca Palatina in the galleries, to Rome 1623), wand (1706-1936
  wall, Catholics choir / Protestants nave), grab (French troops wrecked the electors' graves 1693, Ruprecht's
  survived), kram (shops between the buttresses). Place names Heiliggeistkirche · Langhaus / Empore / Chor /
  Turmhalle, 'Krämerbuden' in front of the booths. SND: reverb .5 inside, no birds. Interior is smaller than the real
  church (16x8 blocks); the stair, pews, chandeliers and pulpit are generic, placed where they fit. Probes: 1280x720 walks
  (side door to nave, stair to gallery, gallery U, west portal to nave, choir) no stuck points, day/night/golden shots,
  all five hints; 412x860 touch. 0 JS errors.
- v1.48 2026-10-15 01:50 (Flax 00:45 "give mannheim a make over ... so many famous places and churches"): first step,
  THE MARKTPLATZ. mannheim.js: F1's houses are cleared after they are built (no R() calls, so every other house, tree and
  container stays where it was) and the ALTES RATHAUS + ST. SEBASTIAN stand there as one Doppelbau: the town hall wing
  east (x -18..-15, by the Breite Straße), the church wing west (x -25..-22, tall windows down the side lane, a steep
  gable), the bell tower between (x -21..-19, to T+20 + a stepped slate helm with a lantern and a gilded ball, props).
  Ochre walls, red sandstone quoins on the outer corners, belts at the ground floor + cornice. On the square: two
  portals, Justitia (sword + scales) and Pietas in niches, a plaque over the tower portal ('Altes Rathaus / and St.
  Sebastian / one tower · begun 1700'), two clocks (north + east) that copy the station clock's face (RHC in clockDraw),
  an open belfry with a bell. G1 gets the MARKTPLATZBRUNNEN: a red sandstone rim you can't step over (B.parapet), water,
  a stone base with four spouts, the city goddess with her map, Mercury above her, Father Rhine with his oar in front,
  the Neckar behind (blocky stone props), an iron railing with gilded knobs, a plaque facing the Breite Straße
  ('made 1719 for Heidelberg / Mannheim's since 1767'), two benches + two lanterns on the west side. F1's corner signs
  sit on the quoins now. Night: a fourth floodlight zone on the Rathaus front (flood[3]). Place names: Marktplatzbrunnen,
  St. Sebastian, Rathausturm, Altes Rathaus. Facts (de.wikipedia, checked tonight): foundation stone Sept 1700, done by
  1713, Rathaus + church under one bell tower ('Mannheimer Symmetrie'), Justitia on the Rathaus, Pietas on the church;
  the fountain group by Peter van den Branden 1719 for the Heidelberg castle garden, given to Mannheim 1767 (reworked
  1767-71), goddess with a map of Mannheim, Mercury above, Rhine with an oar in front, Neckar behind, spouts named
  Rhine/Danube/Neckar/Moselle, railing restored 2009/10. NOT WHERE IT REALLY IS: the real Doppelbau stands on the
  south edge of the Marktplatz inside G1; ours stands across the lane in F1 so the little square stays open. Which wing
  is which (Rathaus left/east seen from the square) comes from a photo caption + the 1860s Rathaus extension on the
  Breite Straße, not a plan. Niche positions, the helm's shape, window counts and colours are ours. Probes: walks round
  the square, round the building, into the rim (stops) and the portal (stops), place names, day/night/golden + air
  shots. 0 JS errors.
- v1.49 2026-10-15 02:18 (Flax's Mannheim makeover, step two): the JESUITENKIRCHE (mannheim.js, built after the houses,
  no R(), so the rest of Mannheim is unchanged). A two-tower front of red sandstone facing east. Its three
  round-arched portals have prop arch heads and slim piers, and the middle one stands open. Above it are a tall
  window, the IHS relief with two angels (a board) and a small pediment. The four cardinal virtues are on the front
  (props), two over the side portals and two on the upper storey: Justice with sword and scales, Fortitude with her
  column, Prudence with a mirror, Temperance with two jugs. Onion caps in verdigris on the towers, open belfries with
  bells, patriarchal crosses. Plain light plaster long sides with sandstone pilasters, a slate gable. Over the crossing
  is an octagonal drum with eight windows, its cornice level with the towers' (raised to match them in the rebuild).
  Above it the dome in two skins (copper outside, white inside) and a lantern with the same cross. INSIDE: a porch,
  the nave with pews and an aisle, the crossing open up into the white dome (Asam's frescoes were not painted again
  after the war), and the choir a step up. The high altar has marble columns, a gilded crown with rays, a painting,
  candles that glow at night and a plaque ("to Paul Egell's design, consecrated again 1997"). Outside plaque on the
  south tower: "Bibiena · built 1733-1760 · rebuilt after the war · 1960". Place names: Jesuitenkirche · Vorhalle /
  Langhaus / unter der Kuppel / Chor. Corner signs: A4 on the front corners, A5 on the choir end. Two new floodlight
  zones (front + dome; all 6 slots are now used).
  COMPRESSION: the real church (about 74 x 29 m) fills part of A4, and the Jesuit college had the rest. Ours takes A4
  AND A5 plus the lane between them (x -74..-71 is built over; its end at the Bismarckstraße is pavement now), so the
  dome has room and the plan keeps the real 5:2. It is 24 x 9 blocks (x -84..-61, z 66..74). The front is at x -61
  facing the A3 lane, the choir at the west end. Heights are ours: towers' cornice T+24, dome cross ~T+40, the tallest
  thing in town (the real dome is 75 m). Ours too: the dome and onion colour (verdigris; the wiki doesn't say), the
  window counts, the porch details, which virtue stands where, and where the IHS relief sits on the front.
  Facts checked on de.wikipedia (Jesuitenkirche (Mannheim)): foundation stone 1733, built until 1760, Bibiena's design,
  modelled on Il Gesù; a two-tower show front of red sandstone facing east, a porch with three round-arched portals;
  onion caps with patriarchal crosses; an octagonal dome about 75 m with a lantern; plain light-plastered long sides;
  the virtues over the side portals and on the upper storey; Egell's IHS relief with angels; heavy damage in the air
  raids, especially the choir and dome; rebuilt under Ohnmacht and Rolli and consecrated again on 6 Nov 1960; Asam's
  frescoes not restored; the high altar rebuilt and consecrated again in 1997.
  Probes: 0 JS errors. Walked round the outside (no stuck points), in through the middle portal, under the dome, up
  the choir step (maxY T+1) and back out; the side portals stop you (doors). Place names OK. Shots: desktop
  day/night/golden/air, inside, phone 412x860 touch day + night + inside. Live probe: Jule's call reaches cs 2.
- v1.50 2026-10-15 07:03 (Flax's Mannheim makeover, step three; he answered "Both" to gardens or palace): the
  FRIEDRICHSPLATZ as the Jugendstil square round the Wasserturm (mannheim.js, built after the houses, no R()).
  Red sandstone ARCADES along the east edge (x 125-127, z -14..62): an open arcade walk on pillars at ground level,
  four storeys of windows over it, balconies with green railings, three taller pavilions (middle + both ends) under
  copper caps with finials, slate mansards between, ceiling lamps in the arcade. The ROSENGARTEN on the north side
  (front at z -7, five doors, a big arched window, gable, side towers, copper roof, gold name, plaque "Bruno Schmitz
  · 1903"). The KUNSTHALLE on the south side (front at z 48, open portal, pavilions, a T-wing, a copper dome with a
  windowed drum and lantern, gold name, plaque "Hermann Billing · 1907"). The gardens: a flower ring round the
  tower, two round fountains on the tower's axis with bronze-coloured figures (a nymph and a triton with his trident)
  and planted rims, six three-globe candelabra, the long basin + cascade from v1.36 with more jets. Every jet now has
  a faint full-height veil (one InstancedMesh). At night the basin water glows blue, the cascade brighter, and lamps
  sit under the water at the jets + round fountains (no floodlight slot, all 6 still used). Two benches by the
  cascade: walk up, 🪑 "Sit on the bench" (R / tap), look at the fountains, WASD or "Stand up" to get up (new MH seat
  system: MH.sit, mhSeat/mhSit/mhStand; Heidelberg's CAFE seats untouched). Two fact hints (w.facts, once a visit):
  by the tower (60 m, 1886-1889, Gustav Halmhuber, Amphitrite) and by the cascade (Bruno Schmitz from 1899, ready
  for the city's 300th birthday in 1907). Place names: Friedrichsplatz · Arkaden, Rosengarten, Kunsthalle.
  COMPRESSION / OURS: the real gardens sit about 2.5 m below the street; ours are level. The real arcade houses form
  a half circle round the square; ours is one straight row on the map's east edge. The Rosengarten and the
  Kunsthalle stand at other points of the real square's edge; here both sit on the tower's north-south axis, and
  the Kunsthalle replaced the two Oststadt blocks there.
  The long basin is narrower (x 120-124) to leave the arcade walk. The bronze figures are stylised; the real stone
  centaurs and the putti are not there. Amphitrite on the dome is unchanged. Facades, window counts, colours of the
  Kunsthalle (real: red sandstone) and the Rosengarten's front details are ours.
  Facts checked on de.wikipedia (Wasserturm Mannheim, Friedrichsplatz (Mannheim), Rosengarten (Mannheim), Kunsthalle
  Mannheim): tower 1886-1889 by Halmhuber, about 60 m, Amphitrite on top; the square laid out by Bruno Schmitz from
  1899 and finished for the 1907 jubilee, with arcade houses in red sandstone, water basins, cascades and lanterns;
  the Rosengarten by Schmitz, opened 1903; the Kunsthalle's Jugendstil building by Hermann Billing, 1907.
  Probes: 0 JS errors desktop + phone 412x860 touch. Walked the whole arcade (z -13.5 -> 61.5, no stuck points),
  round a round fountain (steps up on the rim, OK). Bench sit/stand desktop + phone (button text checked), at night
  too. Fact hint shown. Live probe: Jule's call reaches cs 2.
  Budget: desktop 960x600 golden aerial 44 calls / 93.5k tris, bench 28 / 62.5k; phone aerial 35 / 72k, east 20 / 56k.
- v1.50.1 2026-10-15 07:20 (Flax at 06:40: the Heiliggeistkirche is "asymetric and to small inside"). Cause: the shell
  (z 74..83) was centred on z 79, but the tower, west portal, altar, chandeliers and middle walkway were on z 78.5, so
  from the west door everything sat half a block off; and 1x1 block pillars cut the 8-wide hall into 2-wide slots.
  Fix: the north wall moved one block out onto the Marktplatz (shell z 73..83, inside z 74..82 = 9 wide, centred on
  z 78.5 like the tower). The north buttresses and the four Krämerbuden moved with it to z 72 (awnings to z 71.15,
  the 'kram' hint zone too); the Marktplatz still has z 59..71. Slim red sandstone pillars as props (square + diamond,
  eight edges, plinth) at z 76.5 / 80.5, x -22.5 -19.5 -16.5 -13.5; each has an invisible collider cell (hgCol in
  solidAt, Heidelberg only, y TOWN..TOWN+19). The stepped vault is one step higher (apex TOWN+24, the roof ridge
  TOWN+25) and has red ribs across it over each pillar pair. Galleries on both sides + the west end (U), a stair up
  each aisle from the choir (open steps now, not solid wooden blocks). The tower hall is 5 wide (z 76..80) and opens
  into the nave through a wide stepped arch. Pews split by a walkway on the axis, the end windows at z 75/78/81 are
  symmetric now, the brass 1706 line spans the full width, the chandelier chains reach the new vault. The shader
  region (whitewash + hall light) follows the new box; the old pillar whitewash exception (hbPil) is gone.
  ROOM: no room to grow south (z 84 buttresses, lane z 85-86, then the river-side houses) or east (a 4-wide lane at x
  -8..-5) or west (the tower), so the hall stays 16 long inside; the real church is much bigger. If Flax wants it
  longer, the east lane could take a polygonal choir (narrows the lane to 2), ask him first.
  Probes: 0 JS errors. Walked in from the west portal down the middle to the choir; both stairs up to the galleries
  (y 25) and round the U; the side door out to the Marktplatz; a pillar stops you at its collider. Draw calls from the
  west door unchanged (96 / 225k at 960x600, Heidelberg's busiest view). Phone not re-probed (geometry only).
- v1.51 2026-10-15 07:49 the Barockschloss (Flax: "Both", after the gardens). Look since the 2005-07 restoration:
  two new tiles in free atlas slots (36 schYel yellow plaster, 37 schRed smooth red sandstone, 38 stucco for rooms;
  painted by a hash, never R, so Mannheim's dice order is unchanged). One pass after the Schloss is built: cream ->
  schYel, sandstone/trim -> schRed in x -85..64, z 84..105, y T..T+30; storey bands that only cross plaster go yellow
  (pilasters, quoins, lintels and cornices stay red). The plain stretches of the long front (not the end pavilions,
  the corps x -24..3 or the head pavilions) lose their giant pilasters: a window every two blocks, plaster between,
  red only at the base and cornice; the Ehrenhof wings' court faces the same. The middle risalit's garden side was a
  blank wall: it has the court side's windows now. A paved way on the axis from the gate to the portal, six lanterns
  in the Ehrenhof. WALK-IN: the portal is open (x -12..-9, z 91); an Eingangshalle (x -18..-3, z 92..94, 4 high,
  two columns, sconces, the plaque 'Barockschloss'); a red-carpet stair (x -13..-8, z 95..98, T..T+3) up through a
  well in the hall floor; the Rittersaal upstairs (air x -17..-4, z 93..103, y T+5..T+12, plank floor at T+4),
  stucco walls with deep niches behind the risalit's windows (two tiers, court + garden side), gold pilaster strips
  and cornice, three chandeliers, a balustrade round the well, a grand piano and 24 chairs facing it (the
  Schlosskonzerte), the plaque 'Rittersaal', and a painted ceiling (one board, facing down) that is an ORIGINAL sky
  with a sun and a gilded frame, not Asam's or Vocke's fresco. The rooms' props are their own mesh (rsm): Lambert by
  day, an unlit candle-warm MeshBasic at night (the Schloss floodlight zone lights the rooms' blocks, plain props went
  black). Place names Schloss · Eingangshalle / Treppenhaus / Rittersaal. Two fact hints: the Ehrenhof (Carl Philipp
  quarrelled with Heidelberg's Protestants over the Heiliggeistkirche and moved the court; first stone 1720, done
  about 1760, almost 450 m, today the University) and the Rittersaal (Asam's ceiling 1728-30, destroyed 1943-44,
  painted again by Carolus Vocke in the 1960s from photos, concerts). w.facts take an optional 5th field = the floor
  height for upstairs facts (index.html: Math.abs(P.y-(f[4]??TOWN))<3).
  Facts checked on de.wikipedia (Mannheimer Schloss): first stone 2 July 1720 by Karl Philipp, built in phases to
  about 1760, almost 450 m long round the Ehrenhof, yellow walls + dark red sandstone since 2005-07, the Rittersaal in
  the Mittelbau with Asam's ceiling, destroyed 1943-44, rebuilt 1957-64, Vocke's ceiling from photographs, today the
  University (and the Amtsgericht in the west wing, a museum in the Mittelbau since 2007).
  COMPRESSION / OURS: the front stays 150 blocks (real ~450 m); the Ehrenhof stays shallow (Bismarckstrasse + the A
  row to the north, the Schlossgarten to the south); our Rittersaal sits inside the 18-wide risalit and is much
  smaller than the real one, reached by one straight stair (the real Treppenhaus is grander); window rhythm, the
  ceiling, chairs and piano are ours.
  Probes: 0 JS errors desktop 960x600 + phone 412x860 touch. Walked from the Ehrenhof through the portal, up the
  stair to the Rittersaal (y 24 = T+5), place names checked, both facts shown. Night: floodlit front, warm room.
  Jule's call reaches cs 2. Budget: long view along the front 86 calls / 157k (was 83 / 153k), Ehrenhof 24 /
  56k on the phone, the hall 42 / 94k on the phone, 62 / 128k desktop.
- v1.52 2026-10-15 07:56 the Popakademie (Flax 06:44: "Mannheim also needs Popakademie"). A plain white block on the
  north-bank harbour across the Neckar from the landing (x 27..40, z -112..-105, 9 high, flat roof): one big glass
  front to the river (shop / shopLit tiles, lit at night, a slab line between the two floors), ribbon windows round
  the sides and back, a dark name board 'Popakademie' over the glass (plain letters, a small pink bar, no logo). The
  blue crane that stood there moved from x 34 to x 21. Music drifts out of the front: popTick in index.html (called
  from mhTick when w.pop is set) plays our own four-bar loop at 112 bpm (square arpeggio over Am F C G, sine bass,
  kick on the beat, offbeat hat), panned, fading out within 34 blocks, nothing scheduled while sound is off. No real
  song or melody. Place names Popakademie / Jungbusch · Popakademie (the quay in front). One fact hint at the front.
  Facts checked on de.wikipedia (Popakademie Baden-Wuerttemberg): founded 2003 by the state, a state college for
  popular music and the music business, its new building in the Jungbusch used from the winter semester 2004/05,
  two floors added 2011/12.
  NOT A REPLICA / RELOCATED: the real building stands on the city side in the Jungbusch by the harbour canal; ours is
  on our north-bank harbour because that's where there was room. Its shape, colours and glass front are ours.
  QUESTION for Flax: what does the real Popakademie look like to you (colours, glass, the shape)? We'll match it.
  Probes: 0 JS errors desktop 960x600 + phone 412x860 touch; with the audio context running in the probe, standing at
  the front ran popTick without errors (the loop itself is UNHEARD: headless has no speakers). Front view 19 calls / 43k.
- v1.53 2026-10-15 08:12 Jule's stunt show (Flax 07:39: "keep both" pilots; Birte stays as she is in Heidelberg, Jule
  in Mannheim flies "like an air race pilot, close to the ground, fast, loopings, barrel rolls"). Only Jule's code
  changed (HF/HFL in index.html); Birte's HELI code untouched (diff checked; her start, spin and skip re-tested, no
  errors). The legs: Mannheim out (vm 20): off L2 south over the Schloss, ONE LOOP behind it (x -62, z 132, R 12, u held
  still, fast at the bottom, slow over the top), north up the west side, down to the Neckar at y 23 (water 11, banks 19):
  a slalom round the harbour crane hooks (N of -86, S of -58, N of 21, S of 72, 4-6 to the side, under the jibs; the
  -112 crane is skipped, the turn is too tight there), a hop over the Kurpfalzbrücke (y 31), a BARREL ROLL at x 104, a
  climb and a full hard-banked circle round the Wasserturm (R 20, y 46, bank up to 60 degrees, the look follows the
  tower), then flat out east. Heidelberg (vm 21): in low (y 21) along Birte's stretch of the Neckar, right over her
  pad ("Hallo Birte!"), up over the Alte Brücke, the castle as before, a roll at (111, 22). Hirschhorn: the old line
  plus a roll at (-60, 100). Mannheim back: a low pass west along the Neckar (N of crane 72, past the Popakademie),
  then up to L2. Short bold lines for Jule ("Hold on!", "That was the easy one.", "Even I can do gentle.").
  Code: leg stunt:[[x,z,'loop'|'roll']] (u = nearest curve point), say keys 's<i>' (just before stunt i), 'e<i>'
  (after it), [x,z] (20 blocks before that spot); poi [x,y,z,r] = the whole stretch within r. Attitude H.sp/H.sr in
  camera convention (body Euler YXZ = tilt-sp, th+pi, -sr); hfSeat uses the body matrix; hfCam (main loop, after
  camera.rotation.set) turns the camera with the cabin, look-around on top; the auto-look aims in the banked frame
  (its pitch may now go up to .4 for Jule only). Reduced motion: no loop or rolls, bank x0.3.
  Clearance: every leg + loop + rolls sampled every 0.5 against each town's voxels with a 4.8 x 2.7 box: 0 hits
  (5437 samples). Cranes, bridge lamps and barges are props: checked by hand (crane hooks bottom y 26.6, barges top 16).
  Probes: 0 errors desktop + phone; phone shot upside down at the top of the loop, desktop shot banked round the
  Wasserturm. Long: 32-38 calls. NOT tested: how it feels on a real phone (motion), the full flight at real speed end
  to end in headless (frames too slow; legs checked one by one). The Rhine is not in our map, so the low passes are
  over the Neckar only (todo: a strip of the Rhine west of the Schloss?).
- v1.54 2026-10-15 08:17 ⏺ record a clip (Flax 07:36: "can you also do videos? like mp4?" ... "Sure. Do it."). A third
  button under 🔊 in the top-right column (key V): records ONLY the 3D canvas (no HUD, hints or compass) with
  canvas.captureStream(30) + MediaRecorder, 5 Mbit/s; the type is the first of video/mp4;codecs=avc1, video/mp4,
  webm vp9/vp8/webm that isTypeSupported says yes to. Sound: a MediaStreamDestination hung on SND.mix when the sound is
  on and running (sfx()), unhooked when it stops; with the sound off the clip is silent. While recording the button
  shows a blinking red dot and a timer (no blink with reduced motion); 60 s cap. Then a small card: '🎬 Your clip is
  ready · 0:23', 💾 Save clip (a blob download heidelberg-blocks-YYYY-MM-DD-HHMMSS.mp4/.webm) and 📤 Share only where
  navigator.canShare({files}) says yes (phones), ✕ closes. Kind toasts when the browser can't (no MediaRecorder or
  captureStream: "Try Chrome"), when nothing got recorded, or when sharing fails. Nothing is uploaded. Works on the
  Rundflüge too (it records the canvas whatever is on it). Toasts kept short so they don't cover the button on phones.
  Probes: phone with a STUBBED MediaRecorder + canShare (probe copy only): button, timer, audio+video tracks, mp4
  chosen, card, share button, close: 0 errors. Desktop with headless Chrome's real MediaRecorder: recorded 4 s,
  card shown, share hidden: 0 errors. NOT tested: real phones (iPhone Safari mp4, Android Chrome), whether the saved
  file plays everywhere, sound in the clip by ear, and Save on iOS (blob downloads open a preview there).
- v1.54.1 2026-10-15 08:39 no more earthquake when you stop walking (coldpresss 08:33/08:34: "an earthquake every 5
  seconds", "the quake happens every time i stop walking"). Since v1, P.bob was both the step phase and what shrank to
  end the bob: P.bob*=.9 per frame swept a long walk's big phase back to 0 through dozens of fast sin() wobbles, so the
  longer you'd walked the bigger the shake. Now the phase only grows while walking (kept mod 2π) and stays put when you
  stop, and P.bobA (0..1, up at 4/s walking, down at 3/s otherwise, also on flights) scales the bob: it fades out in a
  third of a second with no wobble. Every P.bob=0 reset zeroes bobA too. Probe: loads with 0 errors (headless at ~3 fps
  couldn't drive a real walk, so the fade is checked by the math, not a run). Ask coldpresss if it's calm now.
- v1.55 2026-10-15 08:52 the Imbiss am Ring, a döner window on the Breite Straße (coldpresss 08:32 "where's the nearest doener"
  ... "three isnt any", after Deniz's old bark 'Best Döner is on the Breite Straße. Don't tell the bakery.'). In K1's NE corner,
  on the Breite Straße just off the Friedrichsring, in sight of Grumbach's door across the street (the first block you pass from
  the boat). mannheim.js after the bakery: DN={x:-14.5,z:-57.9,sx:-14.45,sz:-60.3}; a red/yellow awning of 6 slats (bigger than the
  bakery's) with a striped edge, a tiled back wall in RSL (lit at night like the Schloss rooms), a 'DÖNER · DÜRÜM' sign and a menu
  board (Döner, Dürüm, Falafel, Ayran) in NB, a steel counter with a sneeze guard and five salad trays, the spit by its orange
  heater (its own mesh `spit`, turned in tick at .9 rad/s, rsNight material at night), one standing table with a can, two bulbs
  under the awning (LH + LAMPS). placeName 'Breite Straße · Imbiss am Ring'. mhq.doner -> index.html mhFolk 'doner': Murat, red
  apron + moustache, fixed; barks; first talk sets Q.mhd (Deniz sent you, the feud with Grumbach: 'He glares, I wave. Eleven
  years now.'); after Grumbach's bread run (Q.mhb>=2) he whispers that his bread IS Grumbach's (delivered to the back door, the
  baker thinks it goes to a hotel); each talk ends with a toast. Generic names, no brands (headless renders Pixelify's B like a G,
  so the sign avoids 'IMBISS').
  Same step (coldpresss 08:46 "could the west entrance be more conspicuous?"): L2's walk-through door gets a wall lamp over it
  (glows at night + a light pool), a doormat and a little sign beside it, 'Eingang ←' / 'Treppe zum Dach' (a jokier 'einfach durch die Wand' was swapped before the commit: Flax 08:52 "Its not a fun park. It is a City").
  Probe (hooked copy): place name right, Talk to Murat prompt shows, day + night + front shots, L2 door shot, 0 errors,
  58 draw calls / 114k tris at the stand. NOT asked: coldpresss 08:52 wants L2 one storey taller to jump onto the Schloss roof:
  Flax 08:52: "Veto against the mannheim heidelberg changes. Its not a fun park. It is a City" -> L2 stays as it is, no jump route.
- v1.55.1 2026-10-15 08:54 L2's door is plain again (Flax 08:54: "Döner is okay. Its real :) the other stuff undo if you changed
  sth"): the lamp, doormat and 'Eingang' sign from v1.55 are gone; the döner window stays. Rule: Flax's Mannheim and Heidelberg are
  a real city, not a fun park: no game-y signs, jump routes or theme-park extras; real places (a döner window) are fine.
- v1.56 2026-10-15 09:05 L2 sealed (Flax 08:57 "close the walk through possibility in L2. Keep L2 but close the way to enter"): mannheim.js returns ghost:null, so the west doorway is plain wall; hall + stair stay inside, unreachable. Jule's roof pad is now only reachable with the FLY code; after a Rundflug Jule sets you down on the street by L2's west wall (8.3, 70.9), never trapped on the roof. ASK FLAX: where should Jule pick people up now (a real spot, e.g. the City Airport in Neuostheim) or does the Mannheim Rundflug go? coldpresss asked 'how am i supposed to get the rundfahrt then'.
- v1.57 2026-10-15 09:51 the Planetarium (Flax 09:00 queue): mannheim.js PL={cx:110,cz:80}, on the lawns where the two southern
  Oststadt blocks stood (x 88..126, z 63..95), main doors west toward the Kaiserring. Real look: a blue glass pyramid with stepped
  rust-brown ribs on its hips (Wilfried Beck-Erlang, opened 2 Dec 1984), a white band over a dark glass ribbon, a flat top with a
  mast and a dish, the name in blue on the band (west + south). Foyer ring round the hall: the old dumbbell projector (1984-2002)
  on show with a plaque, a ticket desk, plants. Kuppelsaal (placeName 'Planetarium · Kuppelsaal'): seats in four rings (r 3.4-7.0)
  with four aisles and amber aisle lights, a ball projector on a pedestal, the dome (BackSide gradient sphere r 8.9 from T+4) and a
  smooth dark band (r 8.05) hiding the stepped wall tops. Stars = real RA/Dec for 49.49 N (Orion, Plough, Cassiopeia, Polaris,
  Cygnus/Vega/Altair, Aldebaran + Pleiades, Sirius, Procyon, Capella, Arcturus, Castor/Pollux, Leo + 460 fixed faint ones),
  turned by tonight's real sidereal time at 60x; points under the horizon are discarded in the shader (they peeped through
  the door). The hall's blocks are kept dark by mhMat (MH.w.dark = cx,cz,floorR,wallR,top -> gl_FragColor = diffuse*(.045,.05,.08));
  hall props use a canvas matcap so day and night look the same; the hall meshes only show within 16.5 of the centre.
  Three free seats (SEATS k:'seatp', '🪑 Take a seat', hint 'Lean back and watch the stars', pitch .78). NPCs: Frau Brandt
  (staff, hall door, 98.6/82.4) + a visitor fast asleep in the back row (dozing() tips the head back; barks 'zzz...',
  '...five more minutes, Orion.'). Facts: the building, the old projector, the seats. Also fixed: the v1.56 hfLeave comment had
  swallowed the rest of its line (pitch, velocity, onGround, rideUi after a Rundflug). NOT the real thing: the real one is on
  the Europaplatz ~1.3 km ESE of the Wasserturm and bigger (our base 28x28, dome 17.8 across vs 20 m); real projector since
  2002 is a Zeiss Universarium, ours is a plain ball; real seat count 220-280, ours ~130. Budget below.
- v1.58 2026-10-15 11:10 the Friedrichsplatz, roomy (Flax 10:18: "Friedrichsplatz way to squeezed. way bigger waterplays").
  mannheim.js: square FP x 88..127, z -9..50 (was squeezed round x 106); Wasserturm moved to (100.5,20.5); a long basin
  BAS x 113..121, z 1..40 with a 17-high middle jet, a stepping row of 12 down both ends, two lower side rows (24), and a
  two-step water staircase (terraces at x 109..112) falling from the tower terrace into it; two round fountains FF
  (100.5,-.5)/(100.5,41.5) with bronze figures; two red sandstone pergolas with a bench each looking up the basin; flower
  ring; the arcades are now one loop x 114..127, z -22..63 curving round the east side (AC ellipse {x:109,z:20.5,a:15,b:30.5},
  ACD 7 deep), with turrets at both ends, balconies, lanterns in the walk; the Augustaanlage leaves through a gap at
  z 17..23. Rosengarten moved to x 90..110, z -27..-14, Kunsthalle to x 89..111, z 54..63. Rundflug circle re-centred
  on the tower (min clearance 2.57). R() order kept (voxel hash x -128..86 identical to v1.57). NOT the real thing: the
  real arcades are a full half-ring; ours are a flattened
  oval because the map ends at x 127 (only 4 bands deep at the apex); our basin runs long north-south, not matched to
  the real one's exact shape; the
  Kunsthalle has no back wing; the pergolas are props you can walk through. Budget below.
- v1.59 2026-10-15 11:14 the two statues on the Alte Brücke (Flax 10:09: "Statues on old bridge also nice"). index.html only:
  buildBridge carries the 2nd and 7th piers up to a little terrace on the west (downstream) side, x -6..-4; bridgeStatues()
  (one merged mesh, statue helper copied from mannheim.js) puts Franz Conrad Linck's Kurfürst Carl Theodor (1788, armour,
  ermine, full-bottomed wig, four river gods for Rhine, Moselle, Danube and Isar) at (-4.5,25.5), old-town side, and his
  Minerva (1790, helmet, lance, shield, owl; Justice, Piety, Agriculture, Trade round her) at (-4.5,-24.5), Neuenheim
  side. A bronze plate on the parapet by each (SPOTS s_karlth / s_minerva at x -1.4): who, when, which pier, and that
  both are copies with the originals in the Kurpfälzisches Museum. NOT the real thing: sources name the piers but not the
  side of the bridge, so the west side is a guess; the figures are blocky stand-ins (light stone, no real likeness).
- v1.60 2026-10-15 11:24 a second ring on touch, bottom-right (Flax 10:13: "controll walking direction (right hand) also with a
  steering cross like you did for left hand"). #stickR/#knobR, same look and size as the left ring, sits just left of the
  ⤒ jump button (right: 1rem + 5.6rem). Push it sideways to turn, up/down to look up/down (RSTK, through look(), so
  lookT holds the ride cameras too; max 2.6 rad/s turn, 1.5 pitch, dead zone .15, gentle near the middle). Drags
  anywhere else still look; both rings work at once. It shows and hides with the left ring (a MutationObserver on
  #stick[hidden]: rowing, flying), hides while talking and in the Fernrohr. To keep the rings clear: on touch portrait
  the monkey's rub row, Talk and the ride button moved up over the rings (+8.2rem, stacking +11.4/+11.6/+14.8); in
  landscape (max-height 500) Talk and ride sit left of the right ring (right: 1rem + 14rem). Under 370px wide both rings
  are 6rem. Checked 390x844, 360x740, 844x390: no overlaps with jump, talk, ride, rub or the top-right buttons. Short
  landscape (~300px tall) with rub + talk + ride all at once stacks the ride high under the HUD: rare, left as is.
- v1.61 (11:40, Flax's "more life in Mannheim", kept lean by request): three locals with real history, no crowd.
  Frau Seidel, Briefträgerin, at the Marktplatz edge of the Breite Straße (-14.6,-12.4): the Quadrate (144 squares, A-K west,
  L-U east, numbers out from the Breite Straße, codes since 1811) and a bet with her colleague over a letter for "J1": walk two
  squares up to I1 and read the corner sign (Q.mhi 1 asked, 2 within 4.5 of the I1 block = read it, 3 told her; mhiTick, Mannheim
  only). Then the house numbers (start at the corner facing the Schloss, anticlockwise round A-K, clockwise round L-U). Ute on
  her bike loops the Kaiserring (south on x 82.3, north on 85.7, z -50..86) and tells Drais's ride of 12 June 1817 to the
  Relaishaus on the Schwetzingen road and back (about 14 km, about an hour, no pedals). Anton plays the violin on the
  Paradeplatz (1.4,25.4, facing the Planken, fixed, open case at his feet): Mozart in Mannheim Oct 1777 - Mar 1778 with his
  mother, the court orchestra, Aloysia Weber and her aria, Leopold's letters to go to Paris, later married her sister Constanze.
  FIX: the Quadrate had a J row and no I (ROWW 'KJHGFEDCBA'); now 'KIHGFEDCBA' like the real city, the corner signs follow.
  No sound for Anton (silent bow, barks only); a soft fiddle loop could come later if Flax wants it.
- v1.62 2026-10-15 12:53 trams on the Planken (Cold's idea, Flax approved). One line, Paradeplatz <-> Wasserturm end of the
  Planken, double track (south track eastbound zS 22.15, north westbound zN 19.85, metre gauge, x -6..79.6), a crossover in
  front of each end stop (west N->S over x 9..17, east S->N over x 50..58), contact wire over each track at T+4.75 on span
  wires (Planken lamp posts x 0..72 grew masts, two end masts at -4.5 / 78.5), glass shelters + yellow-green H stop signs
  ('Paradeplatz' on the square at x -3.9..-1.9 z 24-25, 'Wasserturm' in the cross-street mouth x 65.6..67.5 z 16-17), place
  names 'Haltestelle ...'. mannheim.js returns TRM as w.tram (AWF v=162). index.html: TRAM + tramGeo/tramBuild/tramPose/
  tramSec/tramHit/tramBell/tramNear/tramOn/tramOff/tramTick (before the Popakademie block). Two 3-section trams (cream, red
  stripe, open window band with seated + standing blocky passengers, double-ended: headlights + small red lights both ends,
  pantograph on the middle section). Loop number s: 0..66 east on the south track, 66..132 west on the north track; the end
  zones (E s 41..89.8, W s>=108 or <=22.8) take one tram at a time; both trams dwell 11-16 s at opposite ends, ring twice
  (soft inharmonic sine bell, sfxBus, fades within ~40 m) and leave together, passing mid-Planken. They brake for and ring
  at anyone on the rails ahead (you, Planken walkers, the Motorwagen; lateral < 1.05+r+.15, up to 26 m ahead), and a move
  that would overlap you or the car is undone, so they never run you over; hit() and vehFree() treat the sections as solid
  (Mannheim only), a push-out frees you if you ever end up inside. One-time hint '🔔 The tram waits for you'.
  Ride: at a dwelling tram (> 1.5 s left) R / the ride button 'Tram to the Wasserturm/Paradeplatz'; you sit by a south window
  in the middle section (seat local -.55, +1.3), view turns with the tram, physics off (frame MH branch !TRAM.ride), no Talk
  button while riding; 'Get off' only while the doors are open, R while moving toasts 'The doors open at the next stop';
  at the other end you step out onto the platform automatically (west z 23.77, east z 18.23); moving the stick at a stop
  gets you off too; leaving Mannheim ends a ride. Planken walkers rerouted off the rails: north pavement z 17.6/18.05,
  south pavement z 23.95/24.3/24.6 east of x 5, crossing the Planken at x -8 (west of the track end).
  Tested headless: tram stops 1.1 m before a player on the rails, waits, rings, hint, resumes; 400 s fast-forward, the two
  trams never closer than the 2.3 m track spacing, both keep cycling; board/ride/auto alight at both ends; phone 390x844
  ?touch board via the button, jump hidden while riding; 0 JS errors. Left out: the Breite Straße leg, tracks past the
  Kaiserring, motor hum, front/rear light switching, door animation.
