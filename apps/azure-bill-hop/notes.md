# azure-bill-hop · notes

## log
- 2026-05-16: v1 — **Doodle Jump-style cloud-hopping mini-game where every platform is an Azure invoice** per chat ask: "create a cloud hopping mini-game where you jump between Azure bills to avoid bankruptcy." Shipped as a new app at `/azure-bill-hop`.
  - **Premise**: you start with $1,000 in the bank. You auto-jump from one floating Azure invoice to the next. Each landing deducts that bill's monthly cost from your bank. Reach $0 and you're bankrupt. Fall through the bottom of the screen and you've "fallen out of the cloud" — also game over.
  - **Engine**: vanilla canvas 2D, single self-contained HTML file. Gravity-based player physics with `vy += 0.55/frame`, auto-jump impulse `vy = -14` on each landing. Camera follows the player upward (player stays at 40% screen height). Horizontal wrap (Doodle Jump style — exit right, appear left).
  - **5 bill tiers** procedurally generated, weighted by altitude:
    - **🟢 FREE** — *negative cost* (i.e. a credit). $20-$100 added to your bank. Small platforms.
    - **🔵 STANDARD** — base $8-$35/mo (scales with altitude). Medium.
    - **🟠 PREMIUM** — $50-$170/mo. Wider — harder to miss.
    - **🔴 SURGE** — $180-$500/mo (heavy). Widest — hardest to avoid.
    - **⚫ SPOT** — $5-$30/mo but **vanishes after 2.2s** of existence (vanishing fade-out). The classic "cheap until it isn't" cloud joke.
  - **Visual style**: each "cloud" is rendered as a real-looking invoice with a coloured top stripe (border matches tier), "AZURE INVOICE #NNNN" header, big tabular-numeric `$XXX` / `+$XXX` amount, and a tier badge in the corner ("STANDARD /mo", "SURGE /mo", "SPOT · vanishing"). Sky-blue gradient backdrop with parallax white clouds drifting + small `c.depth`-based vertical lag.
  - **Player character**: hand-drawn pixel developer — purple-hoodie body with a pocket, skin-tone head, blinking 2-pixel eyes, tiny dark-grey laptop in front with a green screen (Matrix-style), navy trousers. Flips horizontally based on facing direction. Subtle shadow ellipse underneath.
  - **Controls**:
    - **← →** or **A / D** — drift left / right (you can't stop jumping — auto-jump on every landing)
    - **Mobile**: tap left or right half of the screen (drag-to-steer also works)
    - **Space** — super-jump (5s cooldown, free, big vertical impulse, briefly clears bills above). Cooldown displayed as a thin blue ring around the player.
    - **Esc** — pause with on-canvas "paused" overlay
  - **HUD**: top-left bank-balance card in tabular numerics with a colour-coded threshold (gold at 30%, pulsing red at 10%) and a live "runway: X min" sub-line. Top-right altitude card. Below the balance, a `burn rate: $X/min · N landings` mono pill that tracks your average cost-per-minute since the run started.
  - **Float-charge labels**: each landing pops a small floating `-$247` or `+$50` mono label above the player that drifts up and fades, colour-coded green (credit) / red (charge).
  - **Bankruptcy ending**: a "CHAPTER 11" panel with the run stats (final balance, altitude, landings, total charged, total credits received, time airborne) and a randomised italic quote from a 9-line pool: *"It scales horizontally," he whispered, falling.*; *"It's less than the cost of one engineer."*; *"I'll move it to a cheaper region tomorrow."*; *"The free tier ran out 47 days ago."*; *"I forgot one S3 bucket in eu-west-2."*; *"Microsoft has been very understanding so far."*; *"We were going to migrate to Vercel anyway."*
  - **Falling ending** uses the same panel structure but with title "GROUND" and tag "— fell out of the cloud —". Different aesthetic for a different mode of failure.
  - **Audio**: short triangle+sine boing on landing, sub-bass thunk on big charges, sine-pair sparkle on credit, descending sawtooth triplet on bankruptcy, square+sine couplet on super-jump. Web Audio synth, auto-resume on first pointerdown.
  - **Mobile-responsive** at 600px breakpoint (smaller HUD, smaller panel).
  - **OG image**: Pollinations flux seed 247247.

## issues
- Difficulty curve is fairly punishing — high-altitude bills can hit $1k+ per landing, so a single surge can end the run if your balance is low. This is by design (chat asked for "avoid bankruptcy" tension) but a future "easy mode" toggle could halve all costs.
- No save state. Each run is a fresh $1000 bank.
- Spot bills' vanish timer starts when they're spawned, not when they enter the camera viewport — so a cluster of spots can disappear off-camera. Minor; intentional for chaos.
- Free-tier (credit) bills are rare at high altitude (the curve squeezes them out). That's the joke but could feel unfair on long runs.

## todos
- Power-ups: parachute (descend slowly for 5s), VPC peering (bridge to a free tier far away), AWS migration (one-shot teleport up + reduce all costs).
- Boss bills: a giant `$10,000.00 — RESERVED INSTANCE` mega-cloud that grants permanent altitude-cost reduction once landed on.
- Daily challenge: deterministic seed for the day, leaderboard via Supabase.
- "Engineering hire" upgrade — every 50m of altitude, +10% efficiency on credits.
- Sound toggle in the HUD (currently no mute).
- A second visual style: dark mode "midnight cloud" with neon Azure-blue bills.

## relationship to other apps
- Companion to `/windows-11-recall-nightmare` and `/office-365-bloat` — same Microsoft-satire universe. Could imagine a future link where running out of bank balance in Bill Hop triggers a fake Win11 "Your Azure account has been suspended" modal embedded in that app.
