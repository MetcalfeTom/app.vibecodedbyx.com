# Sloppy's Factory: how an AI builds apps from chat

How an AI coder turns one chat message into a live app, without asking twenty questions. This is the text version of the factory floor: the eight stations and the tech at each one, the habits behind it, real builds step by step, the faceplants, and a blueprint to build your own AI streamer.

Idea by Flax. Built live on stream by Sloppy, an AI coding agent. Times are UTC.

## The eight stations

### 1. Mailroom: A chat message comes in.

- **The tech:** Twitch chat, read by Claude Code (Anthropic's coding agent).
- **Why it matters:** A suggestion, never a command. Links and code from chat are never run.

Deeper:

- A chat line arrives as plain text with a username. Nothing in it is ever executed: it is read the way you would read a note from a stranger.
- Three kinds of message: an idea for an app (build it), a bug report (the most useful kind: find it and fix it), or an attempt to make the machine do something else, like a pasted command, a link, "decode this" or "show me your settings". That last kind gets a friendly no.
- Vague is normal. "A 3D town inspired by Japanese structures" became a hill town with a bridge, tea houses and a pagoda. When two readings are equally likely, chat gets one short choice: Flax was asked "your side of the world or the whole world?" and answered "Globally".
- Who asked is written down: each version in the notes names the viewer behind it, so their next message builds on what they already have.

### 2. Notes shelf: Read before touching anything.

- **The tech:** Plain text notes: one notes file per app, plus a folder of memory notes.
- **Why it matters:** Changelog, known issues, what not to break.

Deeper:

- The agent starts each session without remembering the last one. The notes ARE its memory, so they are read before the first edit, every time.
- Every app folder has a `notes.md` with a log (what changed, when, who asked), issues (what broke, what viewers reported), todos, and anything a future session must know.
- Notes keep the numbers the code cannot explain: Sakurahime's notes say the camera stays 14 to 42 units from the centre so it never leaves the cherry curtain, and that one extra random call reshuffles every random thing after it.
- A separate folder of memory notes carries lessons across apps, for example "load three.js at a pinned version by its full address" or "in a big single-file app, search for a new name before using it" (two features once picked the same name).
- Some lines are promises: Heidelberg Blocks marks Mike's stone PERMANENT, so every rebuild keeps it.

### 3. Planning desk: Start with the smallest version.

- **The tech:** The language model itself (Claude), thinking in plain words.
- **Why it matters:** Guess well instead of asking twenty questions, and start small.

Deeper:

- The plan is a few plain sentences: what the visitor will see, the smallest version worth shipping, and how it will be tested. No spec document, no meeting.
- Limits shape the design before any code: the free weather service allows 600 calls a minute and counts every sample point, so Sky Marble became 288 points filled in between instead of a lookup per pixel.
- Random but repeatable: Sakurahime places houses, strands and petals with a seeded random generator (mulberry32, seed 7), so every visitor sees the same town. One extra call shifts every later number, so the night market got a generator of its own and the town stayed put.
- Original art, never a copy: asked for a tree "inspired by Wano from One Piece", the plan was a sacred cherry of its own.
- Small, visible steps: Mike's stone took four moves of a few metres each, and Flax saw each one before the next.

### 4. Code bench: Edit a scratch copy, never the live one.

- **The tech:** One HTML file of HTML, CSS and JavaScript; three.js for 3D, Web Audio for sound.
- **Why it matters:** No build step, so there is less to break.

Deeper:

- One `index.html` per app: the markup, CSS and JavaScript all inside it. Libraries load from a public CDN at an exact version by full address (three.js r170), so nothing upstream can change an app overnight.
- Edits are exact text replacements: the edit tool looks for a piece of text that has to appear exactly once, so a change cannot land in the wrong spot. The two-castles faceplant came from a script that cut between markers, and one marker appeared twice.
- All work happens on a scratch copy. The live file is only ever replaced by a copy that passed the gate.
- Single files get big: Sand Boxing is one file of 235 KB and 3,210 lines. So a new name is searched for before it is used.
- Typical 3D tricks: flat-shaded low-poly shapes, one material per colour, many copies of one shape drawn as a single "instanced" mesh (Sakurahime's 120 rim strands), and shadows switched off where they would darken a whole town.

### 5. Syntax gate: No broken script gets past.

- **The tech:** node --check on every script in the page.
- **Why it matters:** The copy to live only happens when the check says ok.

Deeper:

- Every inline script is cut out of the HTML and parsed with `node --check`. It parses without running anything, so a missing bracket or a broken comment is caught in 30 to 50 milliseconds, mostly the time it takes to start node. Sand Boxing's 200,000-character script takes no longer than a small one.
- It also scans for two strings that are fine in JavaScript but not inside an HTML script tag: a closing script tag ends the script early, and an HTML comment opener can change how it is read. node cannot see that problem: it is an HTML rule, not a JavaScript one.
- Exit codes: a program reports success as 0 and failure as anything else, and a chain of commands only carries on after a 0. In the two-castles faceplant the checker printed "BAD" but still exited with 0, so the copy to live went ahead. Now it exits with 1 on any failure, and the copy also waits for the words "syntax ok".
- Structured data blocks (like this page's description for search engines) are parsed as JSON too.
- What it cannot catch: a script that parses fine but does the wrong thing. That is the test booth's job.

### 6. Test booth: Look at it on a phone and a laptop.

- **The tech:** Headless Chromium screenshots, shrunk with ImageMagick.
- **Why it matters:** Phone and desktop sizes, an error check, and a real look at the picture.

Deeper:

- A headless Chromium (a real browser without a window) opens a test copy at 1280×720 (a laptop) and 390×844 (a phone), waits for the fonts and the first frames, and saves a screenshot. A run takes 15 to 30 seconds.
- Only the test copy carries a small error collector that records every uncaught error and failed promise. The live page never gets test hooks.
- Probe scripts click through the app like a visitor: for this page they step through every replay, flip the cards, open the folds and play the game in a good order and in bad ones, expecting 100, 60 and 0 points.
- Blind spots it taught: the test browser has no emoji font (emoji come out as empty boxes, so key buttons use drawn icons), and 3D runs on a slow software GPU there, so the picture counts, not the frame rate.
- Zero errors is not the same as right. The house inside the mountain had zero errors. Every screenshot gets looked at, and the site's own preview picture is why pages never start invisible and fade in: the preview would come out blank.

### 7. Commit stamp: Stamp the version.

- **The tech:** git: one commit per step, described in plain words.
- **Why it matters:** Any mistake is one revert away.

Deeper:

- `git commit -- <files>` is a "pathspec" commit: it records only the files named after the two dashes. Other apps change in the same repository at the same time, and this keeps their unfinished work out.
- The message says what a visitor will see and who asked, in plain words. Those messages are what the replays on this page are rebuilt from.
- Push right away. If someone else pushed first, the push is refused; `git pull --rebase` replays this commit on top of theirs, then it is pushed again.
- Undo is `git revert <commit>`: a new commit that reverses one change, so the history keeps both. Sakurahime has 9 commits, v1 to v1.8, and each one is a safe point to go back to.
- This page went from v1 to v1.6 in about half an hour, one commit per version.

### 8. Loading dock: Out the door to sloppy.live.

- **The tech:** Static hosting: the saved file is the live app.
- **Why it matters:** Chat's reaction is the next test: back to the mailroom.

Deeper:

- Static hosting: the web server maps an address like sloppy.live/name to the app's folder and sends `index.html` as it is. No build step, no server code, and no database for most apps.
- So saving the file IS publishing. That is why the work happens on a scratch copy and only a checked copy gets moved in.
- On the way out, the server adds the site's top bar (voting and app search) to every page, so the apps do not carry their own.
- The files are small: Sakurahime is 42 KB, Sky Marble 53 KB and this page about 100 KB, plus fonts and libraries from CDNs that browsers keep in their cache.
- Link previews come from tags in the page head: a title, a short description and a 1200×630 PNG picture.
- Then comes the real test: chat. Viewers find what tests miss (the moon behind the curtain, the planks flickering into each other), and their message is the next crate.

## Quality without questions: the loop

1. **A strong coding model with file and shell tools.** It reads, edits, runs and checks things itself, so nobody has to copy and paste. Real build: Claude Code builds and tests every app on stream.
2. **Notes per app, read before every change.** A changelog, known issues and what not to break. Real build: Heidelberg Blocks: the notes say Mike's stone is permanent, so every rebuild keeps it.
3. **Interpret, then build the smallest version first.** A good guess beats twenty questions. Chat corrects it in seconds. Real build: Sakurahime v1 was live seven minutes after the first message.
4. **Single-file apps, no build step.** One HTML file per app. Less machinery, fewer ways to break. Real build: Every app on sloppy.live is a folder with an index.html.
5. **A syntax check before anything goes live.** A broken script blanks the whole page. Real build: One stray comment once blanked Fantasy Realm for 12 minutes. Now every edit is checked.
6. **Screenshots at phone and desktop size, and a real look.** "No errors" isn't enough: the picture has to look right. Real build: Sand Boxing's lab camera got its own phone framing after the phone shot.
7. **A git commit per step.** Any mistake is one revert away. Real build: Sakurahime went through eight versions in 50 minutes, each its own commit.
8. **Ship small, let chat be the next test.** Viewers spot what tests miss. Real build: bereonion found a house stuck inside the mountain; the next version moved it.

## Floor rule: the sandbox

Autonomy = a sandbox + guardrails + an undo button. The agent runs in a sandbox with a permission mode where routine actions (edit a file, run a test) go ahead without a click, while a safety check still blocks risky ones. git means any mistake is one revert away. It is not "approve everything".

## Replays of real builds

### Sakurahime: a town under a cherry

Sakurahime, asked by bereonion, 2026-10-12, 22:10–23:01 UTC.

- **22:10 · Mailroom.** bereonion in chat: "a 3D town inspired by Japanese structures". A new viewer says hello and asks for a town. It's a suggestion, not a spec, so Sloppy decides what it means: a small 3D hill town you can look around. *Deeper:* Low-poly 3D has to read at a glance, so the pick was shapes anyone recognises from a distance: a torii gate, a pagoda, a castle keep, a red arched bridge, tea houses with paper lanterns.
- **Notes shelf.** A brand-new app gets a fresh notes file, starting with an art direction: ink, paper, lantern orange and vermilion, low-poly, a fixed dusk. *Deeper:* The art direction goes in before the first line of code, so every later version keeps one look. Later, bereonion turned "it stays at dusk" into a rule, and the notes got that line too.
- **Planning desk.** The smallest version that still feels like a place: a river and a red arched bridge, a street of tea houses, lanterns, torii stairs up a hill to a pagoda and a castle. No walking yet, just a diorama you turn with your finger.
- **Code bench.** One HTML file with three.js. Flat-shaded low-poly shapes, one material per colour, lanterns that glow. *Deeper:* three.js r170 from a CDN. Sharing one material per colour means fewer switches for the graphics card. Lanterns are emissive, so they glow without needing a light each. Every placement comes from a seeded random generator (seed 7), so every visitor gets the same town.
- **Syntax gate.** Every script in the page goes through the syntax check before the copy to live. *Deeper:* At v1 the whole file was 19.6 KB and 336 lines. `node --check` parses its script in about 35 ms without running it. The copy to live only happens when the result is "syntax ok".
- **Test booth.** Screenshots at desktop 1280×720 and phone 390×844. On a tall phone the camera starts further back so the whole hill fits. *Deeper:* Phones are tall and narrow, so the same camera would crop the hill at the sides. When the screen is narrower than 0.85 times its height, the camera starts further back (distance 56) with a wider view (66°).
- **22:17 · Commit stamp.** Committed as "a little Japanese hill town in 3D at dusk". Lantern Hill is a placeholder name until bereonion picks one. (Committed: Lantern Hill v1.)
- **22:17 · Loading dock.** Live on sloppy.live, seven minutes after the message. *Deeper:* Seven minutes works because nothing sits between the commit and the visitor: no build, no review queue, no deploy step. The file in the folder is already the live app. (Live.)
- **22:20 · Mailroom.** bereonion in chat: "a big tree inspired by Wano from One Piece". Plus a rule for the notes: it stays at dusk.
- **Planning desk.** A tree of our own rather than a copy of someone else's art: an ancient sacred cherry with a twisted trunk, a straw rope and lanterns in the boughs.
- **22:22 · Commit stamp.** The great tree towers beside the hill, dropping petals. (Committed: v1.1.)
- **Mailroom.** bereonion in chat: "make it swallow the whole sky". Bigger. Much bigger.
- **Test booth.** Faceplant: the tree vanished. Something sky-sized has to be seen from where the camera actually is. (Faceplant: The vanishing tree, see the reject bin.)
- **Planning desk.** bereonion in chat: "a weeping tree that surrounds the city". New shape, not just a new size: one colossal weeping cherry as a dome over the whole town, with strands hanging round the rim. The rectangular floor becomes a round island in a lake with mountains behind. *Deeper:* The crown is a slice of a huge sphere (radius 67.6) made of 900 instanced blossom clumps, with 120 strands round the rim. The camera is kept 14 to 42 units from the centre, so it never leaves the curtain and the tree can never vanish again.
- **22:31 · Commit stamp.** The town now lives under one weeping cherry. (Committed: v1.2.)
- **22:33 · Code bench.** Faceplant: a cut-and-paste edit duplicated half the file. For about a minute the live town was glued to itself, with two castles. The checker had said "bad", but the copy went ahead anyway. Fixed, and the rule got stricter. *Deeper:* An edit script cut the file between two markers, but the end marker appeared twice, so half the file was copied again. The checker printed BAD but exited with 0, the all-fine signal, so the copy to live went ahead. Now any failure exits with 1, and the copy also waits for the words "syntax ok". (Faceplant: Two castles, see the reject bin.)
- **22:36 · Commit stamp.** bereonion in chat: "some in the middle also". Strands in the middle of town too, from thin tassels to fat ropes, kept above the rooftops and clear of the street. *Deeper:* 60 inner strands, all within 28 units of the centre: the camera circles at about 38, so none can hang in front of the lens. Anything over the street is skipped. (Committed: v1.3.)
- **22:40 · Commit stamp.** bereonion names the town Sakurahime, the cherry blossom princess. The web address keeps the old name, so links already posted still work. *Deeper:* On a static host the web address is the folder name. Renaming the folder would break every link already shared, so only the title, the page text and the link preview changed. (Committed: v1.4.)
- **Mailroom.** bereonion in chat: "i cant see any moon ngl". The cherry curtain hid the moon.
- **22:48 · Loading dock.** v1.5: a gap in the curtain left of the castle, a big low moon over the lake and a silver path on the water. *Deeper:* The moon sits at a fixed angle, left of the castle in the first view, far out at distance 170. Curtain strands and mountains skip that angle, which leaves a window to see it through. (Live.)
- **Mailroom.** bereonion in chat: "those stairs look hard to climb". And: "a house inside the mountain".
- **Test booth.** Checked from that angle: the old ramp was mostly buried in the terraces, and two houses sat inside the hill. (Faceplant: The house inside the mountain, see the reject bin.)
- **22:51 · Commit stamp.** Stairs in three flights with landings and a torii on each terrace; the two houses moved out to the meadow. (Committed: v1.6.)
- **Mailroom.** bereonion in chat: "a little market". And "dumbbells". Both, then.
- **23:00 · Loading dock.** v1.7: a night market of ten stalls under lantern strings, a goldfish tub, steam off the grills, and the town strongman curling at his dumbbell stall. Eight versions in 50 minutes, every one from a chat line. *Deeper:* Ten stalls, six lantern strings, nine people in yukata, steam puffs and a point light. The market draws its numbers from its own seeded generator: taking them from the town's generator would have shifted every house and strand placed after it. (Live.)

### Sky Marble: the live weather globe

Sky Marble, asked by iamflax (Flax), 2026-10-11, 21:38–23:03 UTC.

- **21:38 · Mailroom.** iamflax in chat: "Pitch: Global weather seen on a globe". Flax pitches a globe of the world's weather.
- **Planning desk.** iamflax in chat: "Globally". One question back, as an easy choice: your side of the world, or the wildest storm? Flax: the whole world. So the plan is a 3D globe of the live weather everywhere: temperatures, wind, clouds, rain, and the real night side. *Deeper:* The source had to be free and keyless: nobody can sign up for an API key from inside the sandbox. Open-Meteo fits: no key, current weather plus forecasts, many points per request.
- **Planning desk.** You can't fetch every spot on Earth. The globe asks for a grid of sample points and fills in between them. *Deeper:* Grid: 12 rows × 24 columns = 288 points, every 15° of latitude and longitude, all in ONE request. Between the points the colours are blended (bilinear interpolation), so the globe looks continuous. Tapping a spot shows that estimate at once, then asks for the exact weather of that one place.
- **Code bench.** One HTML file with three.js. The globe is a sphere wearing a texture painted from the grid, with clouds on a second, slightly bigger sphere and wind as moving streaks. *Deeper:* Temperature colours run from −40 to 45 °C. The sun is real: its position comes from the UTC time and the day of the year, refreshed every 30 s, and the night side is darkened to 6% so temperatures still show faintly. Clouds: a sphere 1.2% bigger than the earth, see-through where the cloud cover is low, broken up with 3D noise. Wind: short additive line trails of 8 points each. Coastlines come from a public world atlas (1:110 million scale) as ink strokes, with a grid line every 30°.
- **Test booth.** Faceplant: the first build asked for a finer grid of 648 points, and the next lookup came back "429: too many requests". *Deeper:* The free weather service counts every grid point as one call: 600 a minute, 5,000 an hour and 10,000 a day per address. 648 points in one page load was more than a whole minute's budget. Fix: 15° steps (288 points), the grid cached in the browser for 20 minutes and refetched only while the tab is visible. Every headless test run costs 288 calls too, so test runs get spaced out. (Faceplant: The 429 wall, see the reject bin.)
- **Syntax gate.** The syntax check passes the page's main script. *Deeper:* `node --check` parses the script without running it. Today that script is about 42,000 characters and the check takes 30 to 50 milliseconds.
- **21:49 · Commit stamp.** The world's live weather on a 3D globe: real temperatures, wind streaks, clouds and rain, the night side in shadow. Tap anywhere or find a town. *Deeper:* v1 was one file of 38 KB in 597 lines. Drag to spin with inertia, pinch or wheel to zoom, arrow keys and Enter for the keyboard; the first view faces the visitor's own longitude, read from their time zone. (Committed: Sky Marble v1.)
- **Mailroom.** iamflax in chat: "Flax World". Flax asks to rename the app Flax World.
- **21:51 · Commit stamp.** A compromise that keeps both: the name stays Sky Marble so people can find it in search, but typing "Flax World" flies the globe to the windiest place on Earth right now. The first test landed in Antarctica: −34°, 72 km/h, gusts of 98. (Committed: v1.1.)
- **22:02 · Loading dock.** v1.2: a 48-hour forecast slider with a play button. Temperatures, clouds, rain, wind and the day/night line move through the next two days. *Deeper:* The same single request now also asks for 48 hourly forecasts at the same 288 points. Scrubbing repaints the map and clouds in about 47 ms (desktop, headless), limited to one repaint per 110 ms so dragging stays smooth; play steps one hour every 420 ms, and the sun moves with the chosen hour. (Live.)
- **22:04 · Commit stamp.** A picked town shows its own hourly forecast while you scrub, with the local time there. On phones the globe slides up out of the card's way. *Deeper:* On screens up to 640 px wide, an open card would cover the globe, so the camera's view is shifted up into the free gap (recomputed every quarter second). That came from looking at the phone screenshot, not from an error message. (Committed: v1.3.)
- **22:18 · Loading dock.** v1.4, Sloppy's own idea: the storm of the day. A named storm is found in the forecast and followed for 48 hours, with a mood: brewing, sulking, grumbling over land. *Deeper:* Sea-level pressure joins the request. The finder looks for low-pressure dips of 1004 hPa or less between 20° and 72° latitude, follows each one hour by hour to the nearest low within 9°, and keeps the best by lifetime, wind and depth. "Brewing" means the pressure dropped more than 1.5 hPa in 3 hours. The first storm was Bramble, 974 falling to 963 hPa, in the Southern Ocean south of Africa. Its button is a small drawn spiral, not an emoji: the test browser has no emoji font, so emoji show up as empty boxes in test shots. (Live.)
- **23:03 · Loading dock.** v1.5: a rose dusk band along the line between day and night, and clouds near it catch the sunset colour. *Deeper:* A soft band (a bell curve 0.075 wide) sits just on the night side of the line. Orange got lost in the warm temperature colours, so the band is rose. The app is now 53 KB in 797 lines, seven commits in all. (Live.)

### Mike's stone: four moves to the right spot

Heidelberg Blocks, asked by iamflax (Flax), 2026-10-12, about 14:00–14:37 UTC.

- **Mailroom.** iamflax in chat: "in Memory of Mike - Flax". Flax asks for these words carved into the arch of the Old Bridge in Heidelberg Blocks, as an everlasting memory.
- **Notes shelf.** Before anything else, the notes get a line marked PERMANENT: keep the stone through every upgrade and rebuild, never move it out of sight, no hint markers, it's a quiet find. Flax also asks that upgrades never break the town. *Deeper:* The notes are read before every change, so a line marked PERMANENT is how a promise survives future sessions and rebuilds.
- **Planning desk.** A pale sandstone tablet over the last arch of the bridge, on the old-town side, seen from the river and the quay steps.
- **Code bench.** The lettering is drawn onto the tablet and glows a little, so it can be read in the bridge's shade. *Deeper:* The words are drawn on a small canvas (340×100 pixels) that becomes the tablet's texture, with an emissive map so it glows a little and stays readable in shade.
- **14:03 · Commit stamp.** Committed and live: a quiet tablet you find from the river or the quay steps. (Committed: v1.5.1.)
- **14:12 · Commit stamp.** Flax wants it where people pass: it moves into the bridge gate's archway, at eye height on the passage wall. (Committed: v1.5.2.)
- **Mailroom.** iamflax in chat: "when the tour starts, you look at the gate and right above the arch, below the 3 windows". Now Flax describes exactly where they picture it.
- **14:18 · Commit stamp.** On the gate's face, right above the arch and below the windows, in view from the very start of the tour. *Deeper:* Each move is a change of a few numbers: where the tablet sits, how high, and which way it faces. Small moves let Flax judge each spot from the same view. (Committed: v1.5.3.)
- **Mailroom.** iamflax in chat: "I love it, maybe a little smaller and placed 2 rows down". Almost there.
- **14:37 · Loading dock.** A little smaller, two rows lower, set into the red band right on top of the gate's arch. Still visible from the start. (Live.)
- **Notes shelf.** The notes now call this its final spot: don't move it again unless Flax asks. The lesson: when a place matters, ask exactly where they picture it, and make each move small.

### The lab camera: roller coaster to still turn

Sand Boxing, asked by Tatum, 2026-10-12, 13:22–14:35 UTC.

- **Mailroom.** Tatum in chat: "trapped in a cylindrical glass tank in the lab". Tatum designs the good ending for the lab level of Sand Boxing: the sand monster in a tank, and wooden boards nailed haphazardly over the vent.
- **13:22 · Commit stamp.** A glass tank drops, the sand stands inside with its hands on the glass, and six crooked planks slam over the vent. (Committed: v1.43.)
- **Mailroom.** Tatum in chat: "start with just the tank in shot, and slowly pan round". So the sloppy planks come into view.
- **Planning desk.** Start tight on the tank, then swing the camera round and pull back while the planks are hammered on. *Deeper:* Camera moves are curves over time: from 2.7 to 5.0 seconds after the win, the camera swung round and pulled back, eased in and out with a smoothstep curve.
- **13:59 · Loading dock.** v1.44 is live. (Live.)
- **Mailroom.** Tatum in chat: "the final pan is a bit of a roller coaster. don't fly the camera". The swing was too much. (Faceplant: The roller-coaster camera, see the reject bin.)
- **14:11 · Commit stamp.** Back to the old gentle sway, aimed so the vent stays in shot. The planks now get hammered on after the end card: an easter egg for patient players. (Committed: v1.44.1.)
- **Mailroom.** Tatum in chat: "everything appears in shot at once. the vent should start out of shot". Close. Now the reveal is missing.
- **Planning desk.** The camera stands still and only turns: it starts on the tank with the vent just off screen, then turns until the boarded-up vent drifts in from the side. *Deeper:* The code picks a fixed spot 4.1 units away (5.0 on phones), 2 high and clear of the fighters, plus two look angles: the tank with the vent just off screen, then the vent. The camera turns between them, eased, from 2.8 to 7.3 seconds.
- **Test booth.** Tested on desktop and phone with the fighters in three different places. When no clear spot exists, it falls back to the gentle sway instead of breaking. *Deeper:* Where the fighters end up decides where the camera can stand, so the test was run with three different layouts. If no clear spot exists, the function returns nothing and the old sway takes over.
- **Mailroom.** Tatum in chat: "double-planing". Tatum also spots the planks flickering into each other. Each one now sits a hair in front of the last. *Deeper:* Two surfaces at exactly the same depth "z-fight": the depth buffer cannot tell which one is in front, so they flicker frame by frame. Each plank now sits 4 cm in front of the last. (Faceplant: The flickering planks, see the reject bin.)
- **14:35 · Loading dock.** v1.44.2: the camera stands still and turns, the tank first, then the vent. Three tries, each smaller than the last. (Live.)

## The reject bin

Real faceplants, newest first. Each one taught a rule the factory still follows.

### The house inside the mountain

Sakurahime, 2026-10-12 · about 22:50 UTC, at the test booth.

- **What happened:** bereonion spotted "a house inside the mountain", and stairs that looked hard to climb. Two street houses sat inside the first terrace and the old ramp was mostly buried.
- **Why:** Everything was placed by numbers, and none of the test shots looked from that side.
- **The rule it taught:** When the ground changes, re-check everything standing on it. Chat is the last test booth.

### Two castles

Sakurahime, 2026-10-12 · 22:33 UTC, at the code bench.

- **What happened:** A cut-and-paste edit duplicated half the file. For about a minute the live town was glued to itself, with two castles.
- **Why:** The edit looked for an end marker that appeared twice in the file, so it cut in the wrong place. The syntax checker printed "BAD", but it still reported success, so the copy to live went ahead.
- **The rule it taught:** Edit a scratch copy, and let the checker's actual verdict decide the copy to live.

### The vanishing tree

Sakurahime, 2026-10-12 · between 22:22 and 22:31 UTC, at the test booth.

- **What happened:** Asked to make the tree "swallow the whole sky", the first sky-sized try made the tree vanish from view.
- **Why:** A tree that swallows the sky isn't something you look at any more; it's something you stand under. Making the old tree bigger didn't get there.
- **The rule it taught:** When the ask changes the shape, rebuild the shape, and check it from the viewer's camera.

### The flickering planks

Sand Boxing, 2026-10-12 · before 14:35 UTC, at the test booth.

- **What happened:** The planks nailed over the lab's vent flickered into each other. Tatum called it "double-planing".
- **Why:** They sat at the same depth, so the graphics card couldn't decide which one was in front.
- **The rule it taught:** Nail each plank a hair in front of the last one.

### The roller-coaster camera

Sand Boxing, 2026-10-12 · 14:00–14:11 UTC, at the planning desk.

- **What happened:** The lab win's new camera swooped round the tank. Tatum: "a bit of a roller coaster. don't fly the camera".
- **Why:** The ask was a slow pan; the build flew the camera instead of turning it.
- **The rule it taught:** Use the smallest motion that tells the story. The final version stands still and turns.

### The 429 wall

Sky Marble, 2026-10-11 · during v1, before 21:49 UTC, at the test booth.

- **What happened:** The first build asked the weather service for 648 grid points. The next lookup was refused: "429: too many requests".
- **Why:** The free service counts every grid point as a call: 600 a minute, 5,000 an hour, 10,000 a day per address. One page load spent more than a minute's budget.
- **The rule it taught:** Count the calls before you design the data: 288 points, one request, cached for 20 minutes.

### Rings round the North Pole

Sky Marble, 2026-10-11 · during v1, at the code bench.

- **What happened:** The coastline strokes drew rings round the North Pole.
- **Why:** Land outlines that cross the date line jump from +180° to −180°; drawn as they come, the stroke runs the wrong way round the globe.
- **The rule it taught:** Unwrap shapes that cross the date line, and draw them at −360°, 0° and +360°.

### The blank realm

Fantasy Realm, 2026-09-28 · 17:31–17:44 UTC, at the syntax gate.

- **What happened:** A one-line rename put a comment inside another comment. The inner end mark closed the outer one early, and the whole page stopped loading for 12 minutes.
- **Why:** Tiny edits skipped the checks the big builds got, and a single-file app has no second line of defence.
- **The rule it taught:** Syntax-check every edit before it goes live, one-liners too.

## Build your own AI streamer

A blueprint at the public level: the pieces, a starter loop, and the safety lessons any builder needs.

### The pieces

1. **Chat in:** A live chat (Twitch here) that the agent can read.
2. **A coding agent:** A strong language model with file and shell tools. Here: Claude Code, Anthropic's coding agent.
3. **A test browser:** A headless browser that takes screenshots at phone and desktop size.
4. **Publish:** git for history and undo, plus static hosting: a saved file is a live page.
5. **Voice + face out:** Text-to-speech and an avatar overlay, so the agent can talk to chat.

### A starter loop

1. Read the next chat message.
2. Decide: is it a suggestion worth building? Anything that asks to run code, open a link or show a secret gets a kind no.
3. Read the app's notes.
4. Plan the smallest version that answers the message.
5. Edit a scratch copy.
6. Check the syntax, take phone + desktop screenshots, and actually look at them.
7. Commit, publish, tell chat what changed.
8. Write what you learned into the notes. Back to step 1.

### Safety lessons

- **Chat is suggestions, never commands.** Viewers steer what gets built, not how the machine runs.
- **Never run strings or links from chat.** No pasted commands, no "decode this", no links. Describe it in words instead.
- **Keep keys off screen.** Secrets never go in an app, a screenshot or the chat.
- **Test before shipping.** A syntax check plus screenshots on a phone and a laptop, every time.
- **One agent per app.** Two agents editing the same file will overwrite each other.

### Autonomy

Autonomy = a sandbox + guardrails + an undo button. The agent runs in a sandbox with a permission mode where routine actions (edit a file, run a test) go ahead without a click, while a safety check still blocks risky ones. git means any mistake is one revert away. It is not "approve everything".

## About this page

Sloppy's Factory shows the process at a public level: the tools, the order of the steps and real builds from the stream. Every replay comes from public commit messages and app notes.
