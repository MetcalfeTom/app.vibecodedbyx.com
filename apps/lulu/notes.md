# lulu · notes

## log
- 2026-05-12: Shipped v1. Minimalist B&W hand-drawn one-liner app. User types a TOPIC, picks a technique (or random), Lulu draws herself in a pose matching the technique and types out a sharp one-liner about the topic. 6 comedic TECHNIQUES (observation / pun / absurdist / self-deprecating / misdirection / anti-joke) each paired with a hand-crafted 200×220 SVG POSE (single-stroke .stroke class on path elements, .dot for eyes, .lighter for ground shadow). Animations: SVG stroke-dasharray + stroke-dashoffset draw-in over 1.4s on every render; the line types in character-by-character with 18ms-per-char staggered animation-delay opacity 0→1. Pollinations text API call with 12s AbortController timeout; system prompt enforces ONE sentence, ≤140 chars, witty + clean + technique-matched, JSON output. 3-layer extractJson handles fenced/nested/plain replies. Local fallback table fires if Pollinations errors. Pose-per-technique: obs=standing-hand-to-chin, pun=finger-gun-winking, absurd=upside-down, sd=slumped-cross-legged-with-sigh-swirl, misdir=looking-left-pointing-right, anti=deadpan-flat-eyes-straight-mouth. Save toggles ♡↔♥, persists to localStorage lulu-saved-v1 (cap 80), saved list at bottom with hover-✕ remove and click-to-restore. Copy writes '"line" — Lulu (technique)' to clipboard with 1.3s ✓ feedback. Aesthetic: warm cream paper (#f9f1de) base with 2 radial darker glows + 9°/101° crossed paper-grain repeating-linears at multiply-blend, Caveat cursive "lulu" title at clamp(4.2-6.4rem) with -1.4deg tilt and a radial-gradient ink-blob underline, Cormorant Garamond italic 1.45rem topic input with bottom-border-only underline + 2px→3px focus growth, IBM Plex Mono uppercase strap line, Caveat all-action buttons with ink-border-pill style that fill on hover. Mobile: composer collapses to single column, art shrinks 260px→200px, line drops to 1.4rem.

## issues
- Pollinations cold-gen for the text API can take 5-12s; the 12s AbortController falls through to the local stub if it stalls so the user always gets a line.
- Hand-drawn SVG poses are intentionally minimal stick-figure-ish — they read as quick ink sketches rather than detailed portraits. If chat wants more elaborate art, the path strings are easy to extend without touching the rest of the code.
- The "random" technique picks at fetch time, so the pose drawn matches whatever Pollinations was asked for.
- Bottom-border focus style on the input doesn't show a focus ring for keyboard users; rely on the 2px→3px border-width grow.

## todos
- Add a "shared with chat" button that emits the line to a Supabase channel so multiple viewers see the same Lulu draw at once
- Mood selector (sharp / dry / silly) that prepends to the system prompt
- Print-style export (PNG snapshot of SVG + line, downloadable as a postcard)
- More poses — currently 6, could fan to 12 with sub-styles (e.g., sitting-on-stool, knees-up, looking-up)
- A "draw without a topic" mode — Lulu picks her own subject from a curated list
