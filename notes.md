# VibeSpace Notes

## log
- 2025-10-07: SpaceFlight — clustered objects closer (shorter spans and spawn ranges), tightened dust/spark fades, lowered clear radius for denser feel.

## issues
- CDN-based modules (three.js) mean JS console errors only surface in browser; rely on minimal syntax-only diffs for quick tweaks.
- Large single-file apps: careful with 250-line output limits when inspecting; use targeted greps.
 - WebAudio requires a user gesture to start on mobile; always add a Start button to unlock audio.
 - OG tags must include a .png image URL; emojicdn works in a pinch but custom PNGs look better.

## todos
- Add quick sanity page to each app for basic asset checks (script tags, OG image presence, favicon URL).
- Consider a shared checklist snippet to copy into new apps (head/meta/OG/link back to stream) while keeping code isolated per app.
 - Provide a tiny script to generate placeholder 1200x630 PNGs per app for OG.

## common-requests
- “Make it faster/slower”: adjust accel/boost caps and camera lerp.
- “More/less clutter”: tweak spawn ranges, wrap spans, and counts.
- “Make X closer/farther”: reduce/increase dist ranges and clear radius.
- “Mobile controls don’t show”: ensure media queries and button wiring.
