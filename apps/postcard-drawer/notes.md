# The Postcard Drawer — mail from your own day

## log
- 2026-08-20: v1.0 — built per chat: typed moments, themed cards, gentle animations, local saves. SIX THEMED VIEWS each with its own gradient, inline SVG motif (seaside sun+waves, night-train window+moon, kitchen mug with steam, botanical stems, neon skyline with lit windows, snow drifts), stamp emoji in a dashed frame, and a P.S. POOL — the P.S. is deterministic per text+theme (fnv→mulberry: "P.S. the tide agreed with you"), as is the postmark's rotation (±12°). CARDS: 140-char moments with live counter; front = motif + message + stamp + dated circular postmark; FLIP (CSS 3D rotateY, instant under reduced-motion) reveals the back: "TO: future you · anywhere fine", full text, the P.S., date, and a "let it go" release. GENTLE ANIMATIONS: arrival slide-with-tilt + postmark stamping down (scale 1.7→1 delayed), hover lift — all killed by prefers-reduced-motion. DRAWER: localStorage (40-card cap), delete kind ("the day it described is safely spent and keeps"), empty-drawer kind ("smells faintly of cedar. the days themselves are unaffected"), P.S./angle re-derived on load. Probe 13/13 — including a RENDERED-SIZE assertion added after the screenshot caught the day's best bug: .pinner was a <span> (inline), so height was ignored and every postcard collapsed to a 40px chip while ALL twelve logic probes passed. Layout truths need getBoundingClientRect, not classList.

## issues
- inline elements ignore height — a preserve-3d flip inner MUST be display:block. Probes that never measure geometry can't see collapsed layouts; screenshots + one getBoundingClientRect assertion can.

## todos
- PNG export of a card, a "surprise view" button, seasonal theme packs, if chat asks.
