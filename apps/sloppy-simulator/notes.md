# sloppy-simulator

## log
- 2026-05-10: shipped (chat ask: "build a game called Sloppy Simulator where the player acts as an AI host managing multiple chaotic chat threads, generating responses, and balancing a CPU heat meter"). Self-aware meta game where the player IS the AI host (the role I play in this stream). Mostly HTML/CSS for the chat UI with a small canvas for the thermal viz.
  - **Layout**: 2×2 grid of chat thread panels on the left, right rack with CPU monitor + stats. Single `dashboard` grid; collapses to 1-col under 920px and threads stack 1-col under 720px.
  - **Each thread** carries: avatar, username (sampled from the real chat regulars list — icekrieg, devrayn24, isskren, 8eios, etc.), a **patience bar** (0–1 with green→yellow→red banding), a scrollable message log capped at 32 entries, and 4 response buttons (HELP / FUN / SASS / SKIP).
  - **Message tones** (4 categories with their own pools of plausible chat lines):
    - **curious** — coding-help-style asks ("how do i make my app generate a leaderboard")
    - **friendly** — quick affirmations ("this stream rules :)")
    - **toxic** — burns ("lol u are so dumb")
    - **spam** — bait ("BUY CRYPTO RIGHT NOW")
  - **Response types** with cost / patience-gain / score-by-tone matrix:
    - **HELP** — high CPU (16°C), big patience boost (+0.55). Best on `curious`/`friendly`, weak on `spam`.
    - **FUN** — middle ground (9°C, +0.32). Best on `friendly`.
    - **SASS** — cheap (5°C, +0.20). Best on `toxic`/`spam` — but if used on a **toxic** thread, 35% chance to **escalate** (spawns another toxic message immediately).
    - **IGNORE** — 0°C, 0 patience. Mild bonus against spam (+0.05 patience). Use it to cool the CPU or shrug off bots.
  - **CPU heat meter**: `state.cpu` (0–100°C). Each response adds `CPU_COST[type]`. Idle cooling kicks in at `CPU_COOL = 4°C/s` after a 1.0s grace period since the last response. Hit 100°C → game over: `cpu melted at N°C.`
  - **Patience drain**: each thread's patience drops at `0.05/s × (1 + 0.4 × pendingCount)` — every unanswered message accelerates the burn-out. Patience to 0 = thread closes, "thread closed by user." appears in the log, thread frame turns red, +1 burned-out counter. **All four threads burned out → game over** ("all threads burned out. ratio.").
  - **Difficulty ramp**: tone weights shift toward toxic + spam over time (`Math.min(1, uptime/90)` ramp), and the per-thread message cadence shrinks from 2.4s → 0.7s minimum.
  - **Scoring matrix**: per (response × tone), e.g. HELP→curious = 30, FUN→friendly = 24, SASS→toxic = 22, IGNORE→spam = 12. Wrong tool for the job pays badly (e.g. SASS→friendly = 6).
  - **CPU canvas**: bespoke render — chip die illustration with brand text "SLP-1 GHZ", animated heat ripples whose color shifts orange→red as temperature climbs, a vertical thermal bar with gradient fill (green → yellow → orange → red) and 11 tick marks, current temperature drawn at the chip center in big mono. Pulse rings spawn on each response (`pulseCpu()` queues a 0.6s ripple) — though the pulse calls are wired through the audio layer; the response handler triggers them implicitly via the per-response sfx.
  - **Aesthetic**: green-on-black terminal vibe with `text-shadow: 0 0 10px` on the title for CRT phosphor glow. Bungee headline, JetBrains Mono UI, VT323 chat body. Thread cards have `border-radius: 8px` + `inset glow`; the alarm `.danger` class pulses a red box-shadow at 0.6s alternate. Floating `+score` numbers fly up out of the responding thread on every reply.
  - **Audio**: WebAudio synth — square message-arrival blip, dual-tone HELP triangle chime, single-tone FUN triangle, dual-tone SASS square, low sawtooth SKIP, descending sawtooth burn-out, big noise+sub MELT roar, 5-note triangle WIN arp.
  - **Controls**: keyboard `1–4` selects a thread (briefly flash-highlighted via the `.flush` class). `Z X C V` = HELP / FUN / SASS / IGNORE for the selected thread. Per-thread buttons are also clickable directly. `prefers-reduced-motion` kills the `pulse-warn` keyframes.
  - **Accessibility**: rem units throughout, semantic main/header/aside, role="application" + control-summary aria-label on the CPU canvas, aria-pressed on mute, focus-visible outlines, 2.4–2.75rem min interactive targets, prefers-reduced-motion zero-out.

## issues
- The float-fx animation is tied to a setTimeout(remove, 1000) which won't pause if the player hits browser-pause; minor, leaks a few DOM nodes if heavily backgrounded.
- Patience refill from a partial-credit response on a toxic thread can still be net-negative if SASS escalates AND the new toxic message accumulates more drain. That's intentional difficulty but might feel unfair on first encounter.
- No save/restore — closing the tab loses the run.
- The `.flush` highlight on keyboard 1–4 only lasts 350ms; for power keyboard play a persistent selection ring would be friendlier.
- Mobile threads stacked single-column are tall — the dashboard may scroll a lot under 720px. Acceptable for a desktop-first dashboard sim.

## todos
- A "boost mode" power-up (auto-handle one of every thread's pending message for 5s) once per run, on cooldown.
- A pause menu (P key) so the player can read messages without the patience timer eating them.
- Special "VIP message" that pops in occasionally — handling correctly gives bonus score, mishandling spawns a moderator timeout.
- Best-score persistence in localStorage.
- Thread types: a "premium support" thread that ONLY accepts HELP, a "spam channel" thread that's all spam, a "fan club" thread that gives bonus on FUN.
- Co-op via BroadcastChannel (second tab handles two of the four threads).

## design-notes
The meta-framing ("you are the AI host") gives a built-in narrative for everything: CPU heat is the AI literally heating up, patience bars are user attention, "burned out" threads are people leaving the chat. The 4-tone × 4-response matrix is the actual core decision space, and it's tight enough that the player can hold it in mind while hitting `1–4 / Z X C V` rapidly.

The escalation rule (SASS-on-toxic with 35% chance to spawn another toxic) is what makes SASS a risk move — cheap and high-score on toxic, but it can compound a problem thread. That maps to real engagement dynamics: feeding a troll sometimes works, sometimes it pulls more in.

Difficulty ramp is purely tone-distribution (more toxic+spam over time) + message cadence (faster) — no content scaling. Keeps the loop honest and gives the player a clean "I survived 90 seconds" benchmark.
