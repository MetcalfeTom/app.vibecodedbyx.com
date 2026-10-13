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
## issues
- Phones see the app inside the nginx bar iframe: about 390x624 portrait, 844x300 landscape. Test 800x300.
- fannar22 2026-10-11 23:50: rising into the sky at the east/west map edge in the river (fixed v1.1, probe hb_edge.js).
- pathLine drop walls: a one-block drop must not get a parapet (blocked the Snake Path entry from Brückenstraße).
- Landscape 800x300: a long toast can sit over the ride/talk buttons for its few seconds (general HUD, not scope).

## todos
- Fernrohr ideas: more friends to spot later (Anselm on his night round, Hilde at a window), a postcard of the view
- big round (Flax, 2026-10-13) done through v1.13; later: German dialogue switch,
  garden lanterns at night, a second garden terrace (the south wall is one tall cut)
- optional firework bang sounds after a tap
- Jesuit church, Marstall, Karl Theodor statue on the bridge
- real phone test of the touch stick + look; real GPU fps (v1.14 adaptive sharpness: ask phone users if it looks soft)

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

## testing
- scratch: $SP/hb (index.html + mk.sh injects window.__G/__E into gaunt/sw/hm43/hb). The live file only has a
  /*HOOK*/ marker comment. Probes step G.physics(1/60, G.inp) directly (headless fps is low).
- probes in $SP/hm: hb_walk.js (waypoint bot: castle, Snake Path + Philosophers' Walk, monkey rub), hb_edge.js
  (swim into every map edge + quays, log max y), hb_p5.js (tris/calls from 11 viewpoints), view.sh (any viewpoint).
- 2026-10-12 14:08 UTC v1.5.1: MIKE'S STONE. Flax asked for "in Memory of Mike - Flax" carved into the arch of the Old Bridge as an everlasting memory. memorialMesh(): a pale sandstone tablet (canvas 340x100, emissiveMap so it reads in the bridge's shade) on the east face over the last arch by the old town (x 4.02, y 18.5, z 40.5), seen from the river and the old-town quay steps at x~16. PERMANENT: keep it through every upgrade and rebuild, never move it out of sight, no hint markers (it's a quiet find). Flax also asked that upgrades never break the town: test every release, roll back if one does.
- 2026-10-12 14:18 UTC v1.5.2: Mike's stone MOVED where Flax wanted it: inside the bridge gate's archway between the two towers, on the west wall of the passage at eye height (x -1.98, y TOWN+1.9, z 53.5, facing +x). Everyone walking into town passes it. Still permanent.
- 2026-10-12 14:24 UTC v1.5.3: Mike's stone in its FINAL spot (Flax: "when the tour starts, you look at the gate and right above the arch, below the 3 windows"): the gate's bridge-facing face, x .5, y TOWN+7, z 49.97, facing -z, 4.4 x 1.3. Visible as a pale tablet from the spawn, readable as you walk up. Don't move it again unless Flax asks.
- 2026-10-12 14:45 UTC v1.5.4: Mike's stone a little smaller (3.2 x .95) and lower, at TOWN+5.5: set into the red brick band right on top of the gate arch, under the two windows (Flax 14:21: "I love it, maybe a little smaller and placed 2 rows down"). Still visible from the spawn. PERMANENT - keep it here through every rebuild unless Flax asks.
