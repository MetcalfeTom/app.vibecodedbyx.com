# Haunted Toaster — notes

## log
- 2026-08-28 v1.0: initial release. One-button fortune toy: press "consult the toaster" → toaster rumbles (lever drops, dial spins, slots glow amber) → toast pops from a masked slot column with a spooky face → paper fortune slip fades in below with the prophecy (role=status aria-live=polite). 40 playful fortunes + 6 "slightly burnt omen" variants (14% chance: dark toast, frown, smoke wisps instead of ghost). Tiny WebAudio synth (lever clunk, cook ticks, pop blip + noise burst, burnt wobble) with persisted sound toggle (localStorage `haunted-toaster-sound`). Fonts: Amarante (display) + Special Elite (fortune slip) + IBM Plex Mono (UI). Palette: midnight plum kitchen, pastel-teal 50s toaster, amber ember glow, cream slip. Pollinations OG (seed 1031).

## a11y
- WCAG basics per repo convention: rem everywhere (html font-size 100%), semantic main/header/footer/h1/buttons type=button, decorative scene aria-hidden, fortune slip is the single live region, focus-visible 0.22rem outline, ≥2.75rem targets, prefers-reduced-motion kills rumble/wisps/pop transition and shortens cook to 350ms.
- Anti-repeat on fortunes (won't show the same normal fortune twice in a row).

## issues
- (none yet)

## todos
- Could add a "share this fortune" copy button if chat asks.
- Could let premium users pick bread type (bagel/rye) as a cosmetic.
