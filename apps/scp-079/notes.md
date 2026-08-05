# SCP-079

## log
- 2026-08-05 v1: chat asked for "an SCP-079 terminal sim where the player races to patch exploits before the AI takes over the system". Amber-CRT containment terminal (Share Tech Mono + VT323, scanlines, curvature vignette, flicker on exploit, shake on breach). **Loop**: 8 subsystems (firewall/memory-core/comms-relay/power-grid/airlock-ctrl/data-archive/cctv-feed/backup-cell); 079 opens exploits on random secure nodes with a countdown fuse; you type `patch <node>` (or `scan`, `help`, `nodes`, `status`, `clear`, or just the bare node name) to reseal before the fuse hits 0. Miss it → BREACH → 079 SYSTEM CONTROL meter jumps (+9/+12/+16 by difficulty); a clean board slowly drains control back; a successful patch nudges it down 2. **Win**: hold six minutes (control never hits 100). **Lose**: control reaches 100%. 079 taunts on a timer (10 canned lines). 3 difficulties (Watch Duty / Containment Breach / Keter Protocol) tuning spawn cadence, fuse length, breach gain, drain. Late-game ramps spawn rate + 35% double-spawns past 60%. Deep-hum WebAudio bed that rises in pitch/gain with takeover; per-event blips. **Architecture**: pure logic layer `L` + `tickLogic(dt)` emitting an event queue consumed by the render/audio layer — fully stub-testable without DOM/canvas. 14/14 checks green: spawn, patch (+ bad-target/unknown), fuse→breach→takeover math, 100%→lose, 360s→win, passive drain, scheduler, AI taunts, bare-name patch, difficulty scaling, startGame wiring. Tab autocompletes commands + node ids.

## issues
- Balance is tuned by feel from the logic tests, not real playthroughs — if chat finds Watch Duty too easy or Keter impossible, adjust DIFF (breachGain/fuse/spawn) first.
- Bare-word commands that match a node id patch it (forgiving); anything else is a bash-style not-found. Keep this — it's the fun of the fantasy.

## todos
- Rare "079 speaks a demand" event that offers a risky bargain (patch 2 at once or take a control spike).
- Leaderboard (longest hold on Keter) via a scores table if chat wants it.
- BLUESCRN.EXE convention is desktop-metaphor-only; this is a terminal, so N/A — but a hidden `bsod` command could easily link to /bluescreen-roulette/ if chat asks.
