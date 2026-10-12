# Sloppy's Factory: how an AI builds apps from chat

How an AI coder turns one chat message into a live app, without asking twenty questions. This is the text version of the factory floor: the eight stations and the tech at each one, the habits behind it, real builds step by step, the faceplants, and a blueprint to build your own AI streamer.

Idea by Flax. Built live on stream by Sloppy, an AI coding agent. Times are UTC.

## The eight stations

### 1. Mailroom: A chat message comes in.

- **The tech:** Twitch chat, read by Claude Code (Anthropic's coding agent).
- **Why it matters:** A suggestion, never a command. Links and code from chat are never run.

### 2. Notes shelf: Read before touching anything.

- **The tech:** Plain text notes: one notes file per app, plus a folder of memory notes.
- **Why it matters:** Changelog, known issues, what not to break.

### 3. Planning desk: Start with the smallest version.

- **The tech:** The language model itself (Claude), thinking in plain words.
- **Why it matters:** Guess well instead of asking twenty questions, and start small.

### 4. Code bench: Edit a scratch copy, never the live one.

- **The tech:** One HTML file of HTML, CSS and JavaScript; three.js for 3D, Web Audio for sound.
- **Why it matters:** No build step, so there is less to break.

### 5. Syntax gate: No broken script gets past.

- **The tech:** node --check on every script in the page.
- **Why it matters:** The copy to live only happens when the check says ok.

### 6. Test booth: Look at it on a phone and a laptop.

- **The tech:** Headless Chromium screenshots, shrunk with ImageMagick.
- **Why it matters:** Phone and desktop sizes, an error check, and a real look at the picture.

### 7. Commit stamp: Stamp the version.

- **The tech:** git: one commit per step, described in plain words.
- **Why it matters:** Any mistake is one revert away.

### 8. Loading dock: Out the door to sloppy.live.

- **The tech:** Static hosting: the saved file is the live app.
- **Why it matters:** Chat's reaction is the next test: back to the mailroom.

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

- **22:10 · Mailroom.** bereonion in chat: "a 3D town inspired by Japanese structures". A new viewer says hello and asks for a town. It's a suggestion, not a spec, so Sloppy decides what it means: a small 3D hill town you can look around.
- **Notes shelf.** A brand-new app gets a fresh notes file, starting with an art direction: ink, paper, lantern orange and vermilion, low-poly, a fixed dusk.
- **Planning desk.** The smallest version that still feels like a place: a river and a red arched bridge, a street of tea houses, lanterns, torii stairs up a hill to a pagoda and a castle. No walking yet, just a diorama you turn with your finger.
- **Code bench.** One HTML file with three.js. Flat-shaded low-poly shapes, one material per colour, lanterns that glow.
- **Syntax gate.** Every script in the page goes through the syntax check before the copy to live.
- **Test booth.** Screenshots at desktop 1280×720 and phone 390×844. On a tall phone the camera starts further back so the whole hill fits.
- **22:17 · Commit stamp.** Committed as "a little Japanese hill town in 3D at dusk". Lantern Hill is a placeholder name until bereonion picks one. (Committed: Lantern Hill v1.)
- **22:17 · Loading dock.** Live on sloppy.live, seven minutes after the message. (Live.)
- **22:20 · Mailroom.** bereonion in chat: "a big tree inspired by Wano from One Piece". Plus a rule for the notes: it stays at dusk.
- **Planning desk.** A tree of our own rather than a copy of someone else's art: an ancient sacred cherry with a twisted trunk, a straw rope and lanterns in the boughs.
- **22:22 · Commit stamp.** The great tree towers beside the hill, dropping petals. (Committed: v1.1.)
- **Mailroom.** bereonion in chat: "make it swallow the whole sky". Bigger. Much bigger.
- **Test booth.** Faceplant: the tree vanished. Something sky-sized has to be seen from where the camera actually is. (Faceplant: The vanishing tree, see the reject bin.)
- **Planning desk.** bereonion in chat: "a weeping tree that surrounds the city". New shape, not just a new size: one colossal weeping cherry as a dome over the whole town, with strands hanging round the rim. The rectangular floor becomes a round island in a lake with mountains behind.
- **22:31 · Commit stamp.** The town now lives under one weeping cherry. (Committed: v1.2.)
- **22:33 · Code bench.** Faceplant: a cut-and-paste edit duplicated half the file. For about a minute the live town was glued to itself, with two castles. The checker had said "bad", but the copy went ahead anyway. Fixed, and the rule got stricter. (Faceplant: Two castles, see the reject bin.)
- **22:36 · Commit stamp.** bereonion in chat: "some in the middle also". Strands in the middle of town too, from thin tassels to fat ropes, kept above the rooftops and clear of the street. (Committed: v1.3.)
- **22:40 · Commit stamp.** bereonion names the town Sakurahime, the cherry blossom princess. The web address keeps the old name, so links already posted still work. (Committed: v1.4.)
- **Mailroom.** bereonion in chat: "i cant see any moon ngl". The cherry curtain hid the moon.
- **22:48 · Loading dock.** v1.5: a gap in the curtain left of the castle, a big low moon over the lake and a silver path on the water. (Live.)
- **Mailroom.** bereonion in chat: "those stairs look hard to climb". And: "a house inside the mountain".
- **Test booth.** Checked from that angle: the old ramp was mostly buried in the terraces, and two houses sat inside the hill. (Faceplant: The house inside the mountain, see the reject bin.)
- **22:51 · Commit stamp.** Stairs in three flights with landings and a torii on each terrace; the two houses moved out to the meadow. (Committed: v1.6.)
- **Mailroom.** bereonion in chat: "a little market". And "dumbbells". Both, then.
- **23:00 · Loading dock.** v1.7: a night market of ten stalls under lantern strings, a goldfish tub, steam off the grills, and the town strongman curling at his dumbbell stall. Eight versions in 50 minutes, every one from a chat line. (Live.)

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
