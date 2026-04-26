# Neon Handshake

## log
- 2026-04-26: Created. **TCP 3-way handshake visualizer** where each packet flies between the CLIENT (`10.0.42.7:54281`) and SERVER (`203.0.113.42:443`) as a glowing shooting star with a fading particle trail. **Sequence**: SYN → SYN-ACK → ACK → DATA (GET) → DATA (200 OK) → FIN → FIN-ACK, looping. State machine in `runHandshake()` chains via `step(after, fn)` setTimeout (speed-scaled). Real seq/ack arithmetic: SYN sets `seq=x`, SYN-ACK responds `seq=y, ack=x+1`, ACK sends `seq=x+1, ack=y+1` — header readout in VT323 numerals reflects live values. **Packet sprite**: bowed parabola arc (`-90·sin(k·π)` apex lift), 36-segment fading trail of glow circles, white-pin core inside neon halo (`shadowBlur=28` of flag color), drifting `[FLAG]` label above. **Per-flag palette**: SYN pink `#ff5fa2`, SYN-ACK cyan `#5fc0e0`, ACK lime `#7ec97a`, DATA amber `#f5b362`, FIN/FIN-ACK rose/violet. **Arrival burst** = 18 omnidirectional sparks (40–150 u/s, 0.94 friction, 0.7–1.1s life) + node pulse ring (alpha-fading expanding radial). **Endpoints**: 26-radius rings with crosshair + colored glow, DOM-positioned `.endpoint` labels below show IP / port / state badge (CLOSED → SYN-SENT → SYN-RCVD → ESTABLISHED → FIN-WAIT → CLOSED). **Background**: 220 twinkling stars (HSL hue 200–280 with sin-driven alpha), synthwave perspective grid (cyan horizon line + 14 cubic-eased horizontal lines + 21 magenta vertical perspective lines from VP), CSS scanline overlay (1px every 3px, 0.018 alpha), radial vignette. Dashed connection wire between nodes (`lineDashOffset` animated; brightens lime when ESTABLISHED). **Right log panel** (`.log`) lists all 7 RFC 793 steps with monospace flag codes — `.active` step gets full ink + glow, `.done` steps dim to grey. **Controls** (bottom-center floating): Replay button (re-runs from CLOSED), loop toggle, 0.4×–2.4× speed slider (scales both packet flight + step delays). **Aesthetic**: Major Mono Display brand `neon handshake` (pink HANDSHAKE w/ glow), Audiowide section labels, Share Tech Mono body, VT323 numerals. Palette: deep navy `#03000d → #0a0426` w/ pink+cyan radial glows. Pollinations OG.

## issues
- Packet trails accumulate over the canvas because we don't clear with alpha-fade; each frame uses `clearRect` so trails are explicit segments only. Could add `globalCompositeOperation='lighter'` for true additive bloom but current look is intentional.
- Speed slider scales both packet duration AND step delays via `dt *= speed` and `setTimeout(..., after / speed)` — at extreme speed (>2×) the FIN-WAIT badge transition can feel rushed.
- Endpoints repositioned every frame from `placeEndpoints()` to handle resize cleanly. Slightly wasteful but cheap.

## todos
- Add packet-loss simulation: 5% chance a packet vanishes mid-flight + retransmit timeout.
- Show TCP flags as bitmask (`SYN=0x02`, `ACK=0x10`) in a corner debug pane.
- Optional UDP comparison mode (no handshake — just fire-and-forget).
- Sound: synth chirp on each packet send, lower bell on arrival, success chord on ESTABLISHED.
- TLS handshake mode (ClientHello → ServerHello → Certificate → KeyExchange → Finished).

## design
- Palette: bg `#03000d → #0a0426`, ink `#d8e6ff`, dim `#5a6f9d`, syn `#ff5fa2`, synack `#5fc0e0`, ack `#7ec97a`, data `#f5b362`, fin `#ff7e9a`, accent `#c986e0`.
- Fonts: Major Mono Display (brand), Audiowide (small caps subheads), Share Tech Mono (body), VT323 (numerals).
- Layout: full-viewport canvas, fixed header bar w/ brand + state readout, fixed right log panel, fixed bottom-center control pill, two DOM endpoint labels positioned to flank the canvas nodes.

## code-shape
- Single-file index.html, ~440 lines.
- `seedStars()` / `drawBg(t)` — twinkling starfield + perspective grid floor.
- `placeEndpoints()` — recompute node x/y + DOM label positions on resize.
- `sendPacket(from, to, flag, dur, onArrive)` — push to `packets[]` queue with arrival callback.
- `drawPackets(dt)` — parabola arc tween + trail accumulation + arrival burst + node pulse trigger.
- `drawSparks(dt)` — omnidirectional particle burst with friction decay.
- `drawNode(node)` — ring + crosshair + alpha-fading pulse halo.
- `runHandshake()` — chained `step(after, fn)` calls for SYN/SYN-ACK/ACK/DATA/DATA/FIN/FIN-ACK.
- `tick(now)` — main rAF loop, dt-clamped, bg → wire → packets → sparks → nodes.
