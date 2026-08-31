# Keep Continuity — five post-its for stepping away

## log
- 2026-08-31: v1.0 per a public request ("Keep Continuity as a focused app with five large post-it notes: categorize today, reason to step away, offload, immediate next action when return, and lock environment — use the exact header"). Headers are VERBATIM those five phrases (probe asserts exact strings; Permanent Marker just renders them caps-styled). Five rotated sticky notes (yellow/pink/mint/blue/orange, folded CSS corner, straighten on focus-within) on a slate board; lined textareas (repeating-gradient ruling, background-attachment:local so lines scroll with text); autosave 350ms debounce → localStorage `keep-continuity-v1` {notes:{cat,away,off,next,lock}, touched}; "last touched Xm ago" on load; 🧽 fresh set = two-step arm (4s auto-disarm, tap-away disarms) then wipes + saves. No network, no accounts. Fonts: Permanent Marker + Shantell Sans (deliberately not the Caveat/Kalam of the other paper apps). A11y: labels wired for= to each textarea, role=status aria-live polite, 44px targets, focus-visible, prefers-reduced-motion kills the tilt. Suite (scratchpad kc/tail.html): 19/19 at 320/390/1100 — exact headers, label wiring, autosave + touched stamp, load-restore, two-step wipe + disarm paths, storage cleared, note sizes ≥240-270px, overflow, hit-test, ago(), stamp, zero errors.

## issues
- The request's tail "use the exact header" read as: the five phrases are the headers, verbatim — if chat meant a different literal header string that got truncated in relay, ask them to resend.

## todos
- optional "step away" ritual button: timestamps the pause and dims the board until return, if chat asks.
- print/copy-as-text of all five notes for people who want it on paper.
