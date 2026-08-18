# Neigh or Yay (horse-tinder) — notes

## log
- 2026-08-18 v1.0: swipeable horse dating. 14 hand-written profiles (name/age/breed/bio/
  quirk/4 stats speed·chonk·drama·vibes/pollinations portrait w/ emoji fallback via
  onerror-remove). Pointer-capture drag with rotation + YAY/NEIGH stamps fading in by dx,
  ±110px threshold flings card offscreen; buttons + ArrowLeft/Right too. Match odds =
  0.25 + vibes*0.04 − drama*0.015 ("the horses have standards") → full-screen match
  overlay (role=dialog, focus moved to keep-swiping) + 14 flying hearts/carrots. 5 vibe
  filters (all/smol/absolute-units/fancy/chaos) rebuild the shuffled deck; empty state
  "the pasture is empty" + reopen. Stack renders top 2 cards only (top + .under peek).
  Lilita One + Quicksand, pasture sky-to-grass gradient. 14/14 probe + 430px screenshot.

## issues
- Sandbox screenshots show emoji tofu + no pollinations images (host blackholed) — both
  fine live; probe asserts DOM instead.
- Drag needs touch-action:none on #stack (set) or mobile scroll eats the gesture.

## todos
- Stable view (list of liked horses) if chat wants a second screen.
