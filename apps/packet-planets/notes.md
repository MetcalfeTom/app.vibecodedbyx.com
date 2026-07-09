# Packet Planets — notes

## log
- 2026-07-09: v1 — planetary delay-line memory sim (chat ask: two orbiting planets, glowing bouncing packets, return-delay slider, starfield + orbital paths). **System**: gold star at barycenter, AZUR (teal, inner, faster) + RUSTE (ringed rust, outer) on dashed elliptical paths (y squashed 0.72), 240 twinkling stars, DPR-aware full-viewport canvas. **Packets**: one CHARACTER each (shown above the glow), launched staggered 260ms from AZUR, chase the MOVING target planet (per-leg speed = launch-distance / (delay/2) so each leg ≈ half the configured round trip regardless of orbital geometry), 14-point fading trail, teal→rust hue by direction, bounce forever. **Return-delay slider** 2–20s applies to future legs. **Memory model**: message → packets; when a packet returns HOME it appends to a PER-MESSAGE reconstruction buffer (mid tag — single shared buffer garbled interleaved messages in v0 testing: rebuilt {1:'HI',2:'HELL'} proved the fix); seq 0 resets its buffer, last seq prints "memory read-out: MSG ✓ intact after N arrivals". Stats: RTT, packets/bits in flight, cycles. PURGE clears ("the void forgets instantly"). Demo 'HELLO VOID' uploads at boot. Audiowide + Space Mono. Verified: 10 demo packets flying, 2s-delay 'HI' full cycle → per-message readout intact, slider updates RTT, zero errors; screenshot shows the packet caravan.

## issues
- Reconstruction assumes per-message in-order arrival — holds because all legs of one message share timing; if chat adds packet-loss/solar-storm chaos, ordering needs seq-sorting.
- Headless time runs ~6× slow (known harness artifact) — arrivals took ~40s wall at 2s delay in tests; real browsers are true-time.

## todos
- Solar storms (packet loss + retransmission), more planets/routing, bandwidth meter, packet inspector on hover, sound pings on arrival.
