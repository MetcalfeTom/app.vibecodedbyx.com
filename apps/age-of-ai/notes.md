# age-of-ai

## log
- 2026-05-09: **Exponential token-cost scaling** (chat ask: "add the exponential token cost scaling to the Age of AI turret prices"). Each subsequent purchase of the SAME tower type costs `base × 1.4^N` where N is the count already on the board, mirroring the real-world AI procurement-curve where every additional GPU costs more than the last. Implementation:
  - New `costFor(def)` helper computes the live next-purchase price from the current board count of that type.
  - Click-to-place uses `costFor(def)` instead of `def.cost` for both the affordability gate and the deduction.
  - Each placed tower stores `paidCost` so the sell-refund (60%) refunds 60% of what you ACTUALLY paid, not the base list price — selling a late-game H100 you bought for ₣423 returns ₣253, not ₣66.
  - Palette card cost pill now shows the LIVE next-purchase price + a small `× N` hint when the player already has copies (e.g., "264F ×3" means this would be your 3rd copy, costing 264 FLOPS).
  - Different tower types each track their own count independently so going wide (one of each) stays cheap; going deep (six A100s) gets expensive fast.
- 2026-05-09: shipped — GPU-cluster tower defense (chat ask: "create a game called Age of AI where players build GPU clusters to defend against data surges") + 5-room lobby with Supabase presence sync (chat ask: "add a lobby system with five rooms using URL parameters and simple Supabase state syncing"). Pure canvas-2D, no asset files.
  - **Map**: 24×14 grid (40px cells = 960×560 viewport), waypoint-based path that snakes through 4 turns from left to right. Path tiles are non-buildable (dark asphalt with a faint cyan data-stream sheen); grass tiles are buildable (mottled navy with subtle hash-noise).
  - **6 GPU cluster types** with rock-paper-scissors trade-offs:
    - 🟦 **A100** ($50, r=3, dps=8/0.7s) — cheap entry tower
    - 🟢 **H100** ($110, r=3.5, dps=18/0.6s) — flagship balanced
    - 🟪 **TPU pod** ($180, r=5, dps=60/1.6s, slow effect) — sniper, applies 0.35s slow
    - 🩷 **MoE router** ($240, r=2.6, dps=14/0.55s, splash) — 1-tile AoE clears swarms
    - 🟡 **Optical link** ($200, r=3.2, chain) — instant lightning hits 3 enemies, dmg decays 0.7× per hop
    - 🟠 **Cooling fan** ($120, r=2, support) — no damage, but adjacent towers fire 30% faster
  - **5 enemy kinds**: Token (fast/weak), Embedding (medium), Adversarial (very fast), Gradient (slow tank), Hallucination (boss, 1500 HP). Each scales +8% HP per wave.
  - **12 waves** of escalating mixes, ending with the Hallucination boss + a token swarm finale. Cleared waves grant +25 FLOPS bonus.
  - **Mechanics**: click a palette card to select, click a buildable cell to place. Click a placed tower for stats + sell (60% refund). Sniper hits apply slow. Splash damages everyone within 1 tile of impact. Chain finds the 3 nearest unhit enemies within 4 tiles per hop. Cooling fan grants 30% rate to every tower in its 8-neighborhood (stacks: 2 adjacent fans = 60%).
  - **Speed control**: 1× / 2× / 4× / pause cycle (S key). At 4× the physics tick splits into substeps so projectiles don't pop off targets.
  - **Audio**: per-tower fire SFX (square at higher pitch for snipers / lower for splashers), kill arpeggio, build chime, sell descend, leak warning, win fanfare, lose descent. WebAudio synth, no assets. Mute toggle.

  **LOBBY SYSTEM** (chat ask):
  - **5 rooms** selectable via URL `?room=1`..`?room=5`. Switch buttons in the top hud row sync the URL via `history.replaceState` (no reload).
  - **Supabase Realtime presence channel** per room: `age-of-ai-room-<N>`. Each player tracks `{handle, wave, score, lives, ended}` in their channel presence; the channel's `presence sync` event fires on any joiner / leaver / state-update and re-renders the leaderboard.
  - **NO database writes** — the lobby is pure ephemeral broadcast, just like the multi-tab presence pattern in the rest of the project. Doesn't create/touch any tables.
  - **Live leaderboard** below the HUD shows everyone in the room sorted by score with 🥇🥈🥉 medals on the top three, the current player tagged "(you)" in cyan, and color-keyed lives (acid > 10, amber 6-10, crimson ≤ 5). A "[breach]" tag appears next to anyone whose run has ended.
  - **Status pill** in the top-row hud cycles: offline → connecting → live · room N → connection failed.
  - **Handle resolution**: prefers Supabase-auth `preferred_username`, falls back to email-localpart, falls back to a 6-char anon UUID slug. Falls back further to a random `guest-xxxx` if Supabase isn't loaded.
  - **State broadcasts** automatically on every meaningful change: `refreshHud` was wrapped to call `trackLobbyState()` whenever wave / score / lives / ended changes (with a memoization guard so we don't spam track() on idle frames).
  - **Graceful degradation**: lazy `import('/supabase-config-fixed.js')` with a fallback chain. If Supabase is unreachable, status pill reads "offline · solo", the leaderboard hides, and the game plays normally without any errors thrown.

## issues
- The lobby is purely cosmetic — your towers + enemies don't sync between players. Each player runs their own simulation; the leaderboard shows everyone's progress but there's no real co-op or PvP. Real co-op would need authoritative tick syncing, lots more wiring.
- Joining a busy room mid-game shows everyone's snapshot but doesn't replay history — you see their current wave/score, not how they got there.
- URL room switching keeps the game state when you change rooms; you don't get a fresh run unless you also hit reset. Could add an "auto-reset on room switch" option.
- No private rooms / passwords — all 5 rooms are publicly accessible to anyone with the URL.

## todos
- Co-op mode: shared lives pool, shared FLOPS, both players place towers on the same map.
- PvP send-attacks mode: kills push enemies into the opponent's room.
- Persistent leaderboard table (writes to Supabase) so the top score per room survives refresh.
- More tower types: H200 (next-gen flagship), CDN (delays enemies via redirect), Spec-Decode (chance to skip a wave step).
- Tech tree: spend post-wave bonus FLOPS on global upgrades (range, dps, cost reductions).
- Map editor: chat designs the path, exports as JSON for room-of-the-day.

## design-notes
The "data surge" framing made enemy-design easy: each enemy is a recognizable JS/AI concept (token, embedding, gradient, adversarial prompt, hallucination boss) with mechanically-distinct stats. The tower set mirrors the real GPU/accelerator landscape (A100/H100/TPU pod) with a couple of meta-tools (MoE router for splash since MoE literally routes to multiple experts, optical interconnect for chain since NVLink chains GPUs in real life, cooling fan for support since underclocked silicon doesn't matter much without thermals).
