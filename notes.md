# VibeSpace Notes

## log
- 2025-10-07: SpaceFlight — clustered objects closer (shorter spans and spawn ranges), tightened dust/spark fades, lowered clear radius for denser feel.

## issues
- CDN-based modules (three.js) mean JS console errors only surface in browser; rely on minimal syntax-only diffs for quick tweaks.
- Large single-file apps: careful with 250-line output limits when inspecting; use targeted greps.

## todos
- Add quick sanity page to each app for basic asset checks (script tags, OG image presence, favicon URL).
- Consider a shared checklist snippet to copy into new apps (head/meta/OG/link back to stream) while keeping code isolated per app.

## common-requests
- “Make it faster/slower”: adjust accel/boost caps and camera lerp.
- “More/less clutter”: tweak spawn ranges, wrap spans, and counts.
- “Make X closer/farther”: reduce/increase dist ranges and clear radius.
- “Mobile controls don’t show”: ensure media queries and button wiring.

