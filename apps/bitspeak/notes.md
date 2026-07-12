# bitspeak · notes

## log
- 2026-07-12: v1 (chat ask: binary translator, real-time as you type, retro terminal aesthetic, blinking cursor). **Transforms**: TextEncoder per code point → one hoverable group per char (title tip: glyph · U+XXXX · byte count), bytes padded to 8 bits; UTF-8 correct so emoji (4 bytes) and CJK (3 bytes) group visibly. Decode is separator-tolerant (strips all non-01), chunks 8, TextDecoder non-fatal, counts stray bits (<8 leftover warned), flags invalid UTF-8 (� highlighted red). **UX**: live render on input; MODE button swaps text→binary / binary→text and **carries the current output across as the new input** (encode something, flip, it decodes back); spaces toggle; copy w/ clipboard API + execCommand fallback; auto-detect — typing/pasting pure 0s/1s in encode mode surfaces "press MODE to decode"; counters chars/bytes/bits + multi-byte warning. **CRT**: phosphor green on near-black, scanlines (repeating-gradient ::before), vignette ::after, bezel box-shadow stack, 7s flicker keyframe, glow text-shadows, ▮ block cursor blinking 1.06s steps(1) at end of output stream. Tiny 1.8–2.3kHz key blips (28ms throttle, M mutes outside textarea). Reduced-motion kills flicker+blink. VT323 + Share Tech Mono. Node 13/13: H/i bit patterns, spaced/tight join, 6 roundtrip samples (emoji/CJK/newline/accents), 4-byte emoji grouping, separator-tolerant decode, stray-bit count, invalid-UTF-8 flag, looksBinary detection, both render modes. Hook `__bs {toBin,binText,fromBin,looksBinary,setMode,render,out}`.

## issues
- Very large pastes (>100KB) rebuild the whole output innerHTML each keystroke — fine for typing, could chunk/defer if chat pastes a novel.

## todos
- Hex/decimal/octal output modes.
- "Speak" button — beep long/short per bit (annoying, therefore excellent).
- Share via URL hash.
