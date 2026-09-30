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
- `window.__imp` = {G,ARMY,tick,boot,renderOwn,fitView,setLang,draw,tap,cam,sel,SX,SY}.

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
- Armies on overseas wars (no shared border) don't show; a fleet would be nice.
