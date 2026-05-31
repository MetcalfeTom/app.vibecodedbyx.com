# corner-pet · notes

## log
- 2026-05-13: Shipped v1. Per chat: "minimalist virtual pet that lives in the corner of the screen." Tiny 7rem×7.5rem SVG blob creature pinned to the bottom-right corner by default, with `position: fixed` + transform-based positioning so it stays visible while the page scrolls. **Pet rendering**: inline SVG (~120×130 viewBox) with a `.body-group` element wrapping body/eyes/cheeks/mouth so a single CSS keyframe (`idleBob`, 3.6s ease-in-out, ±4px translateY) animates the whole creature. Body = ellipse with linear-gradient fill, dark ink stroke, white belly highlight ellipse top-left, two pink cheek dots. Eyes are two black ovals with white pinprick pupils that **track the mouse** — each frame computes the pointer angle relative to the pet's screen position and offsets each pupil up to ±1.6px (falloff over 200px distance). Eyelids are two thin rects that animate via `setLidHeight(h)` for blinks (auto-fires every 2.5-6s, 160ms eyelid-down-up cycle) and stay at h=11 while asleep. Mouth path swaps between 6 shapes (happy curve / hungry frown / tired flat / sleeping line / neutral / excited big smile) based on `moodOf()` result. **Personality state machine**: `moodOf()` returns sleeping/hungry/tired/sad/happy/neutral by thresholds on the 3 stats. Body color shifts: mint at default, switches to rose when hungry<25, blue when tired<25, gray when sad<25 — palette stored in COLORS dict with body/stroke/glow per mood. **Stats** (0-100 each, persisted to `localStorage['corner-pet-v1']`):
  - Happy: -0.5/min decay, +4/min while hovered, +6 on feed
  - Hungry (= fullness): -0.3/min, +22 on feed
  - Energy: -0.18/min, +6/min while sleeping
  Stats decay even between visits — on load, elapsed minutes since `lastSeen` are calculated and stats deducted. Long absences (>60min) recover +30 energy as if the pet slept. **Interactions**:
  - **Hover** → speech bubble appears with a mood-appropriate thought + stat pill (3 mini meters in pop-out above the pet)
  - **Click** → feed (+22 hungry, +6 happy, heart particle floats up, `.bounce` keyframe scale 1→1.15 + drop, 6 random feed reactions)
  - **Drag** → pointercapture, follow pointer with `translate(x,y)`. On release, snap to nearest of 4 corners (tl/tr/bl/br) via 0.5s cubic-bezier transition. Suppress click that fires after drag.
  - **Keyboard** (when focused) → Space/Enter to feed
**Sleep**: triggered by local hour (22:00-07:00) OR energy<15. When asleep: eyes lid-down (h=11), animated `z` floats from beside head, mouth flat line, body bob slower (5s period). Feeding while asleep shows "zzz..." instead of waking. **Thoughts pool**: ~38 entries split across 5 mood buckets (OK/happy/hungry/tired/sad) + 8 feed reactions. Auto-fires every 20-45s when not hovering and not sleeping, biased toward firing when mood is significant. **Speech bubble**: cream paper with ink border + 4px ink drop-shadow, Caveat handwritten font, anchored via tail (CSS `::after` rotated square) that flips based on which corner the pet is in (corner-br/bl/tr/tl classes). **Page content** (the actual "app" body): small landing explainer in Fraunces with italic mint accent, Caveat tagline "tiny. lives in the corner. that's the whole thing.", a how-to card with 4 interaction hints, and a stats line at the bottom showing pet name (random pick from 10 cute names on first visit: Blob/Mochi/Pebble/Sprout/Goob/Tofu/Bun/Pip/Mango/Pudding), birth-relative date, and last-fed humanized time. **Aesthetic**: cream paper background with subtle green/rose radial glows + multi-angle linear-noise overlay at multiply blend. The page is intentionally sparse — the pet is the feature. **Accessibility**: rem units, ≥4.5:1 contrast, role=img on pet-wrap with aria-label, tabindex=0 on pet itself + Enter/Space to feed, role=status+aria-live on bubble + stat pill toggles aria-hidden, ≥44px touch target (pet is 112×112px), focus-visible would work but no outline yet since the pet is decorative. prefers-reduced-motion kills all animations + transitions. Pollinations OG (seed 2222). Fonts: Fraunces (variable opsz 144) + Caveat + Space Mono.

## issues
- Pet color tag dropdown — only mint/rose/blue/gold/lilac at random on first spawn, no UI to change. Could add a name+color settings popover.
- Eye-tracking uses lastMouse from window pointermove — on touch-only devices, eyes stay center until first tap.
- Sleep schedule uses local browser time (22:00-07:00) — no way to override. If user keeps the tab open at 3am the pet sleeps for hours and they can't interact (well, they CAN feed it but it ignores them).
- The drag handler computes snap-to-corner from the pet center; very small viewports may put two corners overlapping the main text. Pet stays put if user prefers.
- Stats decay continuously even with the tab in background (not throttled). Decay is gentle enough (~0.5/min happy = full day to fully decay from 100) that this is benign.
- No food variety — feeding is binary. Could add multiple food types (snack/feast/treat) with different stat impacts.
- The page body could feel too sparse to some users — added the how-to card to give context but it's still a "tiny pet in the corner" experience by design.

## todos
- Name & color editor (click stats line to rename / recolor)
- Multiple food types (snack/feast/treat) with cooldowns
- Pet "leaves" if neglected too long → little gone-note
- Tiny mini-games when you click and hold (e.g., follow finger)
- Cross-tab presence via BroadcastChannel so pet visits all tabs
- Daily check-in streak counter
- Wardrobe: hats, bows
- Optional desktop notification: "your pet is hungry"
