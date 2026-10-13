# Little Stove

A cozy home-cooking game, built phone-first. You grab food from the fridge, chop it on the board, cook it in a pot or pan without burning it, salt it, and serve dinner to someone (roommate, Grandma, the cat…).

## log
- v1 (2026-10-04, ~20:00 UTC): first version for inventorychest764 (Twitch, Europe). Their asks: "woman simulater", "work as woman in kitchen", "as home", "make it mobile app", "yes start". I made it gender-neutral: you're simply the cook.
  - 7 recipes rotate (soup, egg on toast, stir-fry, pasta, cheesy potatoes, rice & beans, mushroom toast).
  - Pot recipes simmer. Pan recipes drain a stir meter: when it's empty, cooking runs ×1.8 and counts as scorching.
  - Cooking only moves while the heat is on (7.5 points/s on a 0..130 scale; above 100 is burnt; the heat shuts off at 130).
  - Serving scores half-stars off for: missing or extra ingredients, whole items that needed cutting, doneness, salt, and scorching.
  - localStorage key little-stove-v1 holds the dinner count and the best stars per recipe (the cookbook).
  - Sounds are made with oscillators; there are no files.
  - The drawings are inline SVG. There are no emoji in the UI because headless and og previews show tofu boxes for them.
  - Test probe: hm/pls.js (soup round → just right → 5 stars).

- v1.1 (2026-10-05, ~05:10 UTC): PANCAKES, the first breakfast, with a FLIP (the producer's nudge plus my own pancake riff; nonamenumbe and holaholawedemboys were in chat).
  - Added flour and milk to the fridge.
  - A recipe with flip:true hides the stir meter and shows a 'flip it' button; tapping the pan also flips.
  - Side 1's cook value is saved in S.sideA, then side 2 cooks from 0. Score = (judge(side 1) + judge(side 2)) × 0.6. Never flipping costs 2 stars plus half of side 1's penalty.
  - Salt 0 shows 'no salt', and the hint only nags when salt is short.
  - ?dish=<id> opens straight on a recipe (handy for links and tests).
  - Probe hm/pfl.js: 60/60 → 5 stars, 'golden on both sides'.
- v1.2 (2026-10-05, ~08:15 UTC): TAMAGOYAKI, the rolled omelette (the voice's pick; Tatum cheered it with AYAYA).
  - Added soy sauce to the cupboard. The recipe is 3 eggs + soy sauce, no salt, zone 40-58: the tightest window in the kitchen.
  - flip:true + roll:3 means a 'roll it' button: two rolls, and the third layer is judged at serving. S.sideA/S.side became S.parts (one cook value per finished layer or side).
  - Each layer cooks 15% faster than the one before (the pan heats up). A fattening egg log sits at the back of the pan.
  - Score: each layer's judge × 0.6, plus −1 per missing layer. Probe hm/ptam.js (#serve) rolls at 46 → 5 stars, 'every layer rolled just as it set'.
- v1.3 (2026-10-05, ~16:10 UTC): SIZZLE, procedural cooking sounds (Web Audio, still no files).
  - The audio context starts on the first tap (pointerdown/keydown capture listener → ac()); it suspends when the tab is hidden.
  - A mute button sits in the header (aria-pressed). localStorage key little-stove-sound = 'off' / 'on'. When muted, no context is created at all; muting an existing one ramps the master gain to 0 and then suspends it.
  - Graph: four looping pre-rendered buffers (wet crackle, sparse crackle, burn hiss, low boil), each through a filter and its own gain, into master → compressor. Loop lengths differ (3.3/4.1/3.7/2.9 s) so the mix doesn't audibly repeat. Live one-shots on top: pop() (noise scrap through a bandpass) and bubble() (a sine sliding up).
  - sizzle(dt) runs every frame from loop(). SND.warm eases to 1 while the heat is on (the pan heats up, and cools slower than it heats). damp = how wet/loud: 1 while raw, ~0.3 at the start of the zone, 0.13 at the end, so the sizzle calms as it goes golden. Past zone[1] a dry hiss creeps in; past 100 it's a burning hiss with big pops. Tamagoyaki layers (×1.15) and a stuck stir-fry (×1.5) are louder.
  - splash(k): wet food meeting a hot pan (into the pan, a flip, a new egg layer) = a loud burst that dies over ~1.5 s. Preheating is rewarded with the crackle.
  - Pots: bubbles at 1/s when warming, up to 8/s at the zone, 13/s overdone; boiled dry (>100) they hiss like a pan.
  - Visual twin: .hob.spit shows oil droplets (.spat) spitting off the pan while it's wet and hot, so muted players get the cue too. Hidden under prefers-reduced-motion.
  - Fixed: the food icons floated above the pan (the .stuff offset was made for the pot). .vessel.pan .stuff now sits on the pan surface.
  - Probe: scratch stove/pz.js measures master RMS with an AnalyserNode (stir-fry: hit .082, raw .047, nearly .026, golden ~.012, burnt .055; muted 0, context suspended).
- v1.4 (2026-10-05, ~16:30 UTC): four new dinners from what's already in the fridge, 13 in the rotation now.
  - Fried Rice (pan: rice, egg, onion, soy, no salt), Mac & Cheese (pot: pasta, milk, cheese, butter), Shakshuka (pan: 2 tomatoes, pepper, onion, egg), Mashed Potatoes (pot: 2 potatoes, butter, milk).
  - potColour() tints moved into a TINT map keyed by recipe id.
  - Fixed 'cheese (grateed)'. Things that go in as they are no longer say '(whole)' in the recipe list (it read as 'soy sauce (whole)').
  - Probe stove/pr.js plays all four to mid-zone → 5 stars each.
- v1.5 (2026-10-05, ~16:50 UTC): THE FRIDGE RUNS OUT + the corner shop (the first todo).
  - save.stock (per ingredient, START counts) and save.coins (start 12) live in the same little-stove-v1 key; old saves get START stock and 12 coins.
  - An ingredient is used up when it goes INTO the pot or pan (not when it's put on the board; 'put back' costs nothing). Fridge buttons show a count badge: red at 1, dashed 'out' at 0. Tapping an empty one says 'No eggs left. Pop to the shop.' and shakes it.
  - Hint: if anything tonight still needs is out, it sends you to the shop before 'Grab a …'.
  - Shop button (fridge header) opens dialog#shop. SHOP = { id: [pack size, coins] }. Tonight's needs are listed first. 'Buy what tonight needs' buys the packs for the gap and is never refused: when you're short it goes on the tab (coins go negative, shown as 'you owe the shop N'), so nobody gets stuck.
  - Serving pays +6 grocery money plus a tip of floor(stars) − 2 (the cat tips a purr). Shown in the result dialog (#money).
  - Fixed: an unrolled tamagoyaki said both '2 layers short' and 'every layer rolled just as it set'.
  - Probe stove/psh.js: out-of-stock hint, the tab (2 coins − 1 onion − 3 eggs = −2), earnings → 5, localStorage round trip.
- v1.6 (2026-10-05, ~17:10 UTC): PHONE POLISH (390x844) + swipe to chop (the todo).
  - Phone: the fridge is a horizontal strip, position:sticky to the bottom of the screen (section.area.fridge, inside .kitchen), with a compact coin/shop tile in front. Fridge, board and stove now fit on one phone screen, so no more scrolling down to the fridge and back up to chop for every ingredient. At 390x844 the whole page is 735 px tall; on shorter screens the strip stays pinned.
  - The shelf lists tonight's ingredients first, fixed for the whole dinner (sorting by what's still missing would make tiles jump under your finger).
  - Swipe to chop: every sideways stroke of 26 px over the food is one cut, with a white slash across the board. Taps still work. The board takes pointer capture only after the first swipe cut, otherwise the click of a plain tap lands on the board instead of #item (Chrome sends click to the capturing element). The click that trails a swipe is swallowed (450 ms). .item has touch-action:pan-y so vertical drags still scroll.
  - Touch screens (pointer: coarse) say 'swipe to chop' / 'Swipe across the onion to chop it.'; eggs still say tap to crack. Probes run with a fine pointer, so 'tap to' labels stay the same there.
  - Probe: stove/cdpdrive.py sends real CDP mouse events (2 strokes → 2 cuts, the trailing click doesn't add one, then a plain tap → 3).

- v1.7 (2026-10-07, ~04:25 UTC): THE TABLE SCENE (the 'plating / table scene' todo, Sloppy's pick while chat was quiet).
  - svg#scene at the top of dialog#done: a dusk window, a hanging lamp, a gingham tablecloth and tonight's guest eating your dish. tableScene(who, stars, recipe, burnt) builds it as an SVG string (helpers pth/cir/ell, INK).
  - GUEST has one drawing per WHO entry (skin, shirt, hair behind 'b' and in front 'f', glasses/beard/earrings/freckles flags); the cat is its own drawing that purrs at 4+ stars and turns its head away below that.
  - Faces by tier (5 in heaven, 4 grinning, 3 smiling, 2 not sure + a sweat drop, 1 pulling a face + green tint + stink lines). Hearts float up at 5 stars. Steam rises at 3+, smoke when anything went over 100.
  - dishArt: a bowl for pot dishes (with a spoon), a plate for pan dishes; pancakes are a stack with butter, tamagoyaki a rolled log. The colour comes from TINT.
  - The guest is drawn 1.18x around (150,118) (ZOOM group). The animations (fork/spoon bite x3, rise, heart, purr) all sit under the global reduced-motion rule.
  - aria-label says who is eating what and how they look.
- v1.8 (2026-10-07): every guest has their own lines: SAY[who] = 5 tiers (5, 4+, 3+, 2+, below) x 2 lines, picked by save.dinners. Grandma's 'write this one down', Dad's 'Hi Burnt, I'm Dad', the cat tries to bury it. A new WHO entry needs a SAY entry and a GUEST drawing.
- v1.9 (2026-10-07): guest wishes. From dinner 3, 7 in 10 dinners the guest asks for something (WISH[who], pickWish): no onions/peppers/mushrooms (little brother), easy/no salt (Grandma, cat), extra salty (Dad), extra garlic (neighbour), extra cheese (best friend), crispy (roommate, pan non-flip only), soft (yourself; Mum on pans only). S.r becomes a changed copy, so card, hints, shop list, zone bar and scoring all follow it. Remembering = +2 tip and a 'you remembered' note; forgetting = -½ star. Never garlic/cheese on pancakes; a new WHO entry needs a WISH entry (or none).
- v2.0 (2026-10-07, Sloppy's own while chat was quiet): the oven. Five bakes in the rotation (pot:'oven', temp): Soda Bread (dinner 5), Choc Chip Cookies, Cheesy Pizza, Apple Crumble, Cheese Soufflé; new food sugar, apple, chocolate (START/SHOP/ORDER/ico).
  - Oven temp S.temp: +16°/s with the oven on, -3°/s off; bakes at 6.5 × (temp-70)/(target-70) per s, only once slid in (#flip button = "slide it in", then "peek"). A ding at temperature.
  - Door shut = .meter.fog (blurred fill) and fuzzy words (ovenLook: golden from zone start -7 to end +3). Peek (tap the oven or the button): door open 1.1 s, -30°/s while open, exact meter for 2.4 s.
  - Serving: cold oven (in below 60% / 85% of target) -1 / -½, never slid in -2, soufflé sinks at 2+ peeks (-1). save.oven=1 after the first bake; older saves with 5+ dinners get Soda Bread next.
  - Wishes: no 'add'/extra salt on sweet bakes; crispy also on r.crisp (cookies, pizza). Grab hint says "some flour". bakeArt() draws each bake in the oven window and on the plate.
- v2.1 (2026-10-07, Sloppy's own): 🎂 Birthday Cake (pot oven 180°, deco:true, after shak in RECIPES). Serve opens dialog#deco: frosting swatches (FROST), tap/drag sprinkles on the cake (decoAt via getScreenCTM, max 90), ✨ sprinkle button, 0-12 candles; "bring it out" serves. Two+ kinds of decoration = +2 tip; BDAY/BDSAY lines per guest; 🌬️ blow out the candles at the table (.scene.blown + wisps). No wishes on the cake. Probe: S.decoDone, S.deco={f,sp,n}.
- v2.2 (2026-10-07, Sloppy's pick for Pushed's morning): the oven dial (#dial −/+, 120-260° in 10s, save.dial keeps it between dinners, default 180). The oven heats to S.set and drifts down to it (thermostat); the recipe card shows "bake at X°" (ok when it matches). Baking heat is averaged (S.bkS/S.bkN while cook < 100): over the recipe by 25° = -1 (45° = -1.5, "browned outside before the middle"), under by 25° = -½ ("pale and dense"). The dial wobbles red until it matches and food is on the tray. Probe tip: re-read L.S after every #next (S is a new object per dinner).
- v2.3 (2026-10-13, ~06:05 UTC, helper job for Sloppy): DAY AND NIGHT + a better first 30 seconds.
  - The clock: todAt(n) = { ph:(n+2)%4, day:floor((n+2)/4) } from save.dinners, so no new save field. TOD = morning/afternoon/evening/night; every dish served moves it on. Dinner 1 is day 1, evening (still soup for the roommate).
  - MENU[ph] (recipe ids) and GUESTS[ph] rotate by day: breakfasts in the morning (pancakes, tamagoyaki, egg on toast, shakshuka, mushroom toast), bakes and lunches in the afternoon (soda bread, pasta, cake, soufflé, crumble), dinners in the evening, a snack at night (toast, cookies, mushroom toast, fried rice). Each list starts where a new cook first meets it: soup → egg on toast for the cat → pancakes → Grandma's soda bread (the oven). The cat never gets a sweet bake (swapped for 'yourself'). DISP[ph] gives display names ('Grandma, over for tea', 'the cat, who heard the fridge open'); WHO keys are unchanged, so SAY/WISH/GUEST/BDAY still work. LEAD[ph] = 'This morning you're cooking for…' / 'It's late. A little snack for…'.
  - The header has svg#win (winArt(ph)): a lamp (on in the evening and at night) and a window whose sky, sun/moon, roofs and the neighbours' lights tell the time. The 'dinner N' text became '<b>evening</b> day 1' (screen-reader only on phones). html[data-tod] swaps --wall/--grout/--hi and a body::before light layer (--light: morning sunbeams, afternoon wash, evening amber, night lamp pool + vignette). theme-color follows. The table scene uses the same sky (skyStops), wall (WALLS) and a lamp that's off by day.
  - #next says what's next ('next: breakfast'). ?tod=night starts at that time of day (like ?dish=).
  - Corner shop: todaySpecial() = one thing that normally costs 2+ is a coin cheaper, new every clock-day (#special line in the shop, li.deal). costOf(id) is used by shortList, buy, the aisle buttons and the buy-all total.
  - First dinner only (save.dinners === 0): coach() puts .coach on whatever the hint is about (the fridge tile, the food on the board, into the pot, heat, salt, serve), a soft pulse that moves with each step and is gone from dinner 2. The first hint reads 'Start here: tap the tomato in the fridge.' Reduced motion gets a static outline instead.
  - Wide screens (min-width 60rem): stove | board | fridge in one row (fridge shelf scrolls inside, grid-auto-rows:max-content or the 2.75rem min-height squashes the tiles). At 1280x800 the fridge was below the fold before.
  - Fixed: the oven dial showed on every recipe ([hidden] lost to .dial{display:inline-flex}); the stylesheet now starts with [hidden]{display:none!important}. On phones the heat button takes its own row.
  - Build stamp under the cookbook. __LS gains todAt, todaySpecial, costOf, art.win/art.table (for probes).
  - Probes (scratch hm/lsd*.js): lsd3 plays dinner 1 and logs the coach target per step (tomato → item → add → … → heat → salt → serve), then the schedule for dinners 2-21 (set save.oven=1 first or every dinner from 5 turns into soda bread, the pre-v2.0 catch-up rule). pfl/ptam/oven bread/cake all still 5 stars.
- v2.3.1 (2026-10-13, ~06:07 UTC): a drink at the table that fits the time (drinkArt: orange juice at breakfast, a cup of tea in the afternoon, water at dinner, cocoa at night, a saucer of milk when it's the cat). The last emoji in the UI (blow out, sprinkle, bring it out, the birthday cheer) became inline SVG icons, so nothing shows as tofu.
## issues
- Phone layout: the stove and board sit side by side. The phone media query must stay LAST in the CSS, or the 12rem .hob height wins.
- Phone fridge strip: the sticky selector has to be section.area.fridge, because section.area{ position:relative } outranks .fridge.
- Sound: headless Chromium runs the AudioContext fine (state 'running'), so probes can measure RMS on __LS.snd.master. __LS.AC is the context.

## todos
- Shop ideas: a shopping list you tick off, a fridge that shows what spoils (the daily special is done).
- Tips from the diner (a guest tells you a trick after a good meal?).
- Day/night follow-ups: a real-clock option, a cat-only snack (a saucer of something), morning birdsong / night crickets in the sound mix.

- 2026-10-11 18:00 SEO pass (no version bump): schema.org JSON-LD + 110-155 char description.
