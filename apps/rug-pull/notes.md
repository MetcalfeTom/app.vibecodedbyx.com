# rug-pull (display: RugPull · SloppyCoin Casino)

## log
- 2026-06-23: initial build. **Fake-crypto multiplayer game.** Mint fake NFTs of CSS loading spinners with fake $SLOP (SloppyCoin), watch floors pump and rug, and lose your balance by memeing too hard. Local-only, no real wallets, nothing on any chain.
  - **$SLOP / SloppyCoin**: start with 1000. Live price (random walk mean-reverting toward $1) shown in the wallet. Portfolio value = sum of NFT floors.
  - **Loading-spinner NFTs**: 7 procedural CSS spinner types (ring/dual/dots/bars/pulse/square/orbit) × 8 color palettes × 5 rarity tiers (common 50% → legendary 2%, weighted roll). Each gen'd with a degen name ("Eternal Throbber #4821"), mint cost scaled by rarity (40-60 base × 1.0-12.0×). Mint shop shows 6, rerollable for free. Minting deducts $SLOP, drops the NFT in your bags, replaces the slot.
  - **Floors pump/dump**: every 2.5s each held NFT's floor drifts ±, scaled by rarity multiplier. Sell anytime for current floor.
  - **MEME ENGINE** (the SloppyCoin-loss mechanic): a big MEME IT button. Each meme posts a degen line ("gm", "wagmi", "few understand"), pumps the $SLOP price a little, gives +3 $SLOP bait — but raises meme heat +14. Heat decays 4/s. **Hit 100% heat → you get MEMED**: lose 25-50% of your balance, your pump collapses (price ×0.5), full-screen "MEMED" rug overlay. Memeing too hard literally drains you.
  - **Random rug pulls**: every 8s, 22% chance a rarity tier "rugs" — all your bags of that tier go to ~4% floor + "RUGGED" overlay. If you hold none of that tier you dodge it (still logged: "X rugged. holders are crying. you dodged it").
  - **Multiplayer**: Supabase realtime broadcast channel `rug-pull-floor-v1` + same-browser BroadcastChannel fallback. Live feed shows everyone's mints/memes/rugs/sells; leaderboard ranks degens by $SLOP (peers broadcast state every 4s, culled after 30s stale). Status dot: green=live, gold=local tabs.
  - **Aesthetic**: degen casino terminal — Bungee RUGPULL title in green/gold, JetBrains Mono numbers, neon green/red/purple/gold/cyan on near-black, candle-less but pump/dump flash animations on wallet values, color-coded feed.
  - **A11y**: rem-everywhere, role=status aria-live wallet, role=log feed, labeled name input, focus-visible, prefers-reduced-motion. Self-contained, inline Supabase (no session persistence), ~38KB.

## issues
- Floor/price math is pure vibes, not a real AMM — by design.
- The 22% rug chance every 8s can feel punishing if you hold many bags; tunable.
- No persistence of bags across reloads (fresh wallet each visit) — could add.

## todos
- Persist $SLOP + bags to localStorage so a session survives reload
- "Stake" mechanic: lock spinners for yield (that occasionally rugs)
- A whale NPC that dumps on the market periodically
- Achievements: first rug, memed 5×, held a legendary through a rug
- Sound: cash register on sell, airhorn on meme, vine-boom on rug
