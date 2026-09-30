# Imperios (arianmartiz)

Civilization simulator, Spanish-first (ES/EN toggle, `?lang=es|en`). From a Homo sapiens clan around a
campfire (50,000 BC) to the Modern Era (2050). One self-contained index.html, vanilla canvas, no backend.

## Style (chosen)
Hand-painted parchment atlas: ink and watercolour on parchment, IM Fell English + Alegreya Sans.
Prehistory is a moonlit night lit only by campfires; dawn breaks between -12000 and -5000.
Settlements are drawn glyphs that grow each era and differ per path (camp > huts/tents/stilts > ziggurats,
towers, domes > factories > towers).
Alternatives offered to Arian: B) warm 16-bit pixel art, C) low-poly 3D diorama.

## How it works
- 120x120 tile grid, P=5 px per tile, per-pixel warped for a hand-drawn coast. Terrain painted once offscreen.
- 7 civs (Tolteca, Nordico, Qadir, Jade, Velmora, Kuruma, Inti), rebels spawn from secessions.
- Names: "Clan X" (era 0), "Tribu X" (era 1), full empire name after.
- Fire is the first breakthrough (player gets an event card, AI lights at a random sci threshold).
  No era advance without fire.
- Neolithic path choice: farm (river empire), herd (horse nomads), sea (trade). Player picks via card.
- Endings: science (Modern Era), domination (60% of land), score at 2050, fall (can keep watching).
- Year step shrinks over time (yearStep). ERA_SCI tuned so eras land roughly on history.

## Test seams
- `?probe=N&seed=X&trace=1` runs N headless games, JSON in title. Node harness: scratchpad nodeprobe.js.
- `?shot=N&seed=X[&zoom=k][&ev=id][&info][&lang=es]` renders tick N paused; title "READY ..." / "FAIL ...".
- `window.__imp` = {G,ARMY,NAVY,navyFront,tick,boot,renderOwn,fitView,startReplay,endReplay,RP,setLang,draw,tap,cam,sel,SX,SY}.

## log
- v1.0 2026-09-30: first playable. Campfire opening, fire event, 3 paths, 8 eras, wars/alliances/rebels/
  hordes/plagues/trade routes/golden ages/wonders, chronicle, results screen, ES/EN.
  Balance (3 seeds): wars 4-10/game, 0-3 civs fall, ends by science ~1975 or score at 2050.
  Fixed: negative arc radius from fx age (rAF timestamp < fx t0) -> clamp age >= 0.

- v1.1: era title card (big ribbon, year + path milestone: escritura, carros, velas...), chronicle era lines carry
  the milestone, city label collision pass, desktop bar overlap fixed (flex intrinsic width), clean og.png, ?lang=, &clean, &eracard seams.

- v1.2: the people round (Arian: "faltan los habitantes, ahora son grupos").
  Individual villagers with a name and job walk from each visible town (zoom in) to fields, forests, mines, rivers,
  herds and trade partners, work, carry the goods home and re-decide. Tap one: name, job, what they are doing, why.
  Town decisions (decide): job weights from surroundings + hunger (hunt/gather/farm/herd/fish/log/mine/build/trade/migrate).
  Herds of mammoths, bison, deer and horses roam wild land, feed nearby towns, get hunted down; mammoths die out
  after the thaw (-12000, last one gets a chronicle line). Materials on the map (stone, clay, copper, tin, iron, gold,
  coal) with map symbols; eras need them (bronze = copper+tin, iron, medieval = stone, renaissance = gold,
  industrial = coal), imported by trade/allies or bought from far merchants after a delay. HUD shows "Falta X para ...".
  Town cards show food, what people live on and the town's decision; civ card lists materials.
  Night villagers get a warm glow so they read in the campfire era.

- v1.3: settlers visibly walk (3 people with bundles, dashed trail) from the nearest town to a newly founded one;
  a small group marker when zoomed out; tap them: who they are, where they go, why. Tapping a town from the overview
  flies in (tp 14) so its people show; town card lists its inhabitants by name + job as buttons (tap = select person).
  Tapping a town's centre prefers the town over a villager standing on it. Names persist and are unique per town.
  Mammoths stop breeding after the thaw and die out (~-4000 at the latest). New seam `&car`; `__imp` exposes tap/cam/sel/SX/SY.
- v1.4: buildings from materials (townBuild, derived each frame, not stored): bronze/iron forge (copper+tin / iron,
  capital, mining or big towns), potter's kiln (clay; river, capital, builders or clay nearby), water mill (river farm
  towns, era 3+), mint (gold, capital, era 3+), steam works (coal, era 6+), stone ring walls (stone; capital from era 2,
  pop>6 from era 4). Drawn at tp>=4 (forge glow + sparks, kiln/works smoke, turning mill wheel, walls back+front
  around the town). Town card lists buildings with their material dot. Person card has "Necesita" (needText).
- v1.5: trade routes carry visible caravans (trader + pack donkey, or a sailing boat on sea routes: different land
  component or span>16) whose packs are coloured by the material the other side lacks (cargoOf: needed first, then
  anything the receiver has no mine of, else goods/gold). Tap one: from/to, what it carries, why. Route motion now
  follows wclock (pauses with the game). Walker/caravan max size 16px at close zoom. Seam `&route`.
- v1.6: herd-path civs ride horses from the Bronze Age (herders, hunters, traders on the road; card says "a caballo"),
  herders at work graze a small flock of sheep, one-time hint toast "Toca a una persona..." the first time villagers
  are on screen (localStorage imp_hint, skipped in shot mode). People buttons get a real space for screen readers.
- v1.6.1 fix: `[hidden]{display:none!important}`. Since v1.0 the third event button (.btn display) ignored `hidden`, so
  2-choice events (rebel...) showed a stale "Construir canoas" option; the #need line stayed visible with stale text.
  c.need is recomputed after the era-advance loop.
- v1.7: wonders on the map (my pick from the todos, for Arian). Every wonder now stands on its own tile 1.9-3.5 tiles from
  the capital that raised it (addWonder; G.wonders {n,civ,ct,cn,t,y}), one hand-drawn glyph per era: thunderbird totem,
  stone circle, ziggurat, bronze colossus with a flickering torch, cathedral, ribbed dome, crystal palace with a moving
  glint, radio tower with a blinking light and radio waves. AI peoples build them too (aiWonders: one per era, stab>=40,
  no wars, gold >= cost+15, 2%/tick), ~9-18 per game. Drawn back-to-front with towns, a gold halo when zoomed far out,
  a light hole at night, names at tp>=12. Tap one: whose, when, who holds it now (conquered / ruins), a flavour line.
  Seams `&won` (fly to the newest + card), `&wgal` (all 8 in a row by the player's capital), `&wz=` zoom.
- v1.8: wonder gifts + path stories. WPOW per glyph (totem +stab, stone circle +6% sci, ziggurat +faith +stab, colossus
  +12% gold, cathedral +faith +stab, dome +8% sci, crystal palace +15% gold, radio tower +4% sci +stab) go to whoever holds
  the wonder's city (wonHold: ct.civ, -1 = ruins once the city is gone). Capturing the city takes the wonder (chronicle
  wonTake "X takes the Colossus of Y from Z"). Card row "Otorga/Grants". Player events per path from era 2: farm flood/harv
  (granary = no famine for 60 ticks), herd fair/past (pastA grabs up to 6 border tiles, rel -30), sea isle (colonySpot:
  free coast >=9 tiles from home, other landmass preferred; foundCity + toast) / pir; comet for everyone from era 1.
  Seams `&ev=<id>&evch=A|B&evfly` (choose and fly to the newest city), `&won&wtk` (a conquered wonder).
- v1.9: armies on the map (my pick for Arian's "más completo"). Sim only stores, never rolls: wd.y0 (start year),
  wd.lw/lk (last clash winner, tiles taken) and wd.ft, a stable front tile (b's land touching a), re-picked after the claims
  with (tick*7+t0*3)%n, so probes are unchanged. Render-side ARMY map: each side marches (1.4 tiles/s of wclock) from its
  nearest town to the front and they clash side-on (side a left/right of the contact by sign(dx)); size from str share and
  manpower (2-9), gear by era (clubs, spears, sword+round shield, men-at-arms kite shield + helmet, musketeers with hats +
  smoke, riflemen), herd civs ride. Standard-bearer with a flag, sparks or smoke, dust, the winner leans forward. Peace =
  they walk home and fade. tp<4.6: a crossed-swords badge with both colours; 4.6-9: a small badge floats over each clash.
  Tap a formation (or badge): named after its home town ("El tercio de Tenoch"), troops, front gains, reserves, a soldier line.
  Seam `&army` (fly to a front, the player's first; `&army=1` opens the card; `&ay=` anchor); shot mode snaps armies to the front.
- v1.10: sieges. warfare() rebuilds G.siege {cityId: {by, t (enemy tile), y (since year, kept while the same besieger holds)}}
  every tick: any town of either side with an enemy tile in its 3x3. No rnd, probes unchanged. Player toast once per new
  siege (12-tick cooldown G.sgT). Render: town smokes and burns; a camp toward the enemy tile (2 tents with pennants, 2 guards,
  an engine by the besieger's era: ram <4, trebuchet 4, cannon 5+), projectile arcs with impact dust + flame. tp<4.6: a dashed
  rotating ring in the besieger's colour. Captures raise the winner's flag over the town (fx 'flag', 3.6 s). City card row
  "Asedio/Siege". Seams `&siege` (fly to a besieged town, player's first; `=1` card), `&flagfx` (flag on the capital, or the
  besieged town with `&siege`). Siege ticks: seed 11 t260 (trebuchet, later cannon), 612 t210, C13 t240 (player's cannons).
- v1.11: fleets (render-side NAVY map, sim untouched). A war gets a sea battle when both sides have a port (isPort: land
  within 2 tiles of SEA; w.coast alone is too strict, most towns sit a tile inland) and it is overseas (no ft), has a sea-path
  people, or both are Middle Ages+. navyFront: closest port pair <= 40 tiles, meeting point on the line nearest the middle with
  open sea there and 12-24 px either way (room for both lines), else a spiral search; skipped when within 5 tiles of the land
  front. Each side sails (2.2 tiles/s of wclock) from the first water on the line out of its port and stops ~2.4 tiles from the
  point; 1-5 ships (str share x manpower, +1 sea path). Ship by era: war canoe with paddlers (1), galley with oars and square
  sail (2-3), cog with castles and a cross sail (4), galleon with 3 masts and gunports (5), ironclad with a funnel (6),
  destroyer with turrets (7). Arrows (fire arrows for cogs) or cannon flash + ball + splash; the side that lost the last clash
  has its rear ship burning. Anchor badge far out / floating over the battle below tp 9. Tap: card "La flota de <port>" (ships,
  course, status, a sailor line). Toast for the player's fleet setting sail. Seams `&fleet` (`=1` card, wz default 8).
  Fleet wars in probes: C13 t235-245 (player vs Jade, galleons vs cogs), 275, 310; I14 t270. NOFL caches "no fleet" per tick.
- v1.12: world history replay (my pick for Arian's "toda la evolución del ser humano"). histSnap() at the end of tick() stores
  {y, own: Int8Array owner copy, ct: flat [tile, civ, era, flags cap|fire], n: chron length} every 2 ticks + at the end
  (G.hist, ~165 snapshots / 2.4 MB a game; no rnd, probes unchanged). startReplay(from) pauses, hides HUD/bar/chronicle
  (body.replay), fits the map above a parchment panel (#replay: era, big year, the headline event, progress bar, close) and
  draw() hands off to drawReplay: renderOwn(snapshot.own) (renderOwn takes an optional owner array; labels from it), civ labels,
  a night pass with the snapshot's campfires (drawNight takes a pts list, nightK takes a year), town dots (capitals ringed),
  a ring where a town is founded and a flag + red ring where one changes hands. Headline: best chronicle line since the last one
  (first to reach an era / first fire / dawn / fall / collapse > wonders, hordes, plagues, rebels, wars > conquests...), at most
  one per 1.2 s. clamp(snapshots*110, 9-28 s), holds the last frame 2.6 s, then restores camera, speed and the results screen.
  Buttons: results "▶ Ver la historia del mundo" (top of the card) and menu "Historia del mundo" (after the game starts).
  Esc / ✕ end it; map taps are ignored during it. Seam `&replay[=0.42]` (a number freezes at that fraction).
- v1.12.1: fleets keep to the water. seaPath (render-side, once per course): straight if the line and a 0.9-tile corridor stay
  at sea, else BFS over sea tiles (open water first: no land in the 8 round, except within 2 tiles of the harbour or the battle;
  then any sea), string-pulled into 1-3 legs. Ships follow s.path (s.wi), re-plot when the front changes or a returning fleet goes
  back to war (F.ret), and sail home along s.back to the harbour mouth (s.hx/hy), not to the town on land. Test: capefind.js
  (A1 t215-230 war 2,6 used to cross an island with 10 land samples; now 0). Formation spread can still brush a tiny island at close zoom.
## issues
- Any element toggled with `hidden` that also gets a CSS display value needs the global [hidden] rule (now in place).
- Walkers are render-side only (WK map, per city id), driven by ct.J / ct.why from the sim. Only drawn when tp>=3.2.
- Probe mode (G.player=0) never declares war for civ 0 unless focus mil.
- Headless screenshots use fallback fonts (fonts host mapped away), real look uses IM Fell.
- rAF `now` can be earlier than performance.now() at fx creation; any time-based radius must clamp.

- Desktop bar: flex-basis does not count toward a flex container's max-content width in Chrome; give buttons an explicit width.

## todos
- AI civs never get path events (player only); maybe let AI roll them silently for chronicle flavour.
- Colonies land on the same continent when no other landmass has free coast; a boat walking there would be nice.
- Sea path is picked less often than farm/herd; watch it.
- AI wars only start from era 3-4 in probes, so clubs/spears armies show up only when the player declares an early war.
- Early fleets (canoes, galleys) only show when the player declares an early war (AI wars start era 3-4).
