---
name: game-feel
description: Make a browser game feel good on phones and desktops: steady loop, simple game states, keyboard and touch input, forgiving controls, juice and sound. Use when building or polishing any game.
---

# Game feel

Sloppy's own write-up. A game feels good when the main action answers at once, every hit has weight, and losing turns into the next try within a second. Work in this order, each layer needs the one before: response time, motion curves, contact feedback, camera, sound.

## 1. Loop
- Simulate in fixed steps (1/60 s) and draw every animation frame, so physics is the same on a 60 Hz phone and a 144 Hz screen.
- Keep the rules in a small pure engine with a seeded random generator: runs repeat exactly, and a headless test can step them.
- Pause when the tab hides or loses focus; "tap to continue" brings it back without a jump in time.
- Timers that a player feels (idle, combo, cooldown) count real seconds, not frames.

## 2. Flow
- A tiny state machine: TITLE, PLAY, PAUSED, OVER.
- The title asks for one tap or key. That first gesture also unlocks sound.
- Teach by playing: show the controls for the first seconds, hide them on the first input.
- Game over says why you lost, shows the score and the best, and restarts with one tap or key, without a reload.

## 3. Input
- Read actions, not keys: held, pressed this step, released.
- Keyboard: `e.code`, WASD and arrows, stop arrows and Space from scrolling the page, forget held keys when focus leaves.
- Touch: pointer events, `touch-action: none`; a floating stick where the thumb lands on the left, 1-3 big buttons on the right inside the safe area. Show them only after the first touch.
- Forgiving controls make players feel skilled: a jump pressed a moment before landing still counts, a jump a moment after leaving a ledge still works, hurtboxes a bit smaller than the sprite, pickups a bit bigger.

## 4. Juice
| Event | Feedback |
|---|---|
| Pickup | pop and settle, sparkle, counter punch, chime |
| Hit | white flash, knockback, a few particles, a 30-50 ms freeze, small shake |
| Hurt | longer freeze, bigger shake, red flash, short blink of safety |
| Land | squash, a puff of dust |

- Shake grows with "trauma" that events add and time drains.
- Enemies wind up before they strike, so hits feel fair.
- Leave marks: debris and scorch marks stay a while.
- With reduced motion on, drop the shake and the flashes; keep sound and colour.

## 5. Sound
- Start or resume the audio context on the first tap or key; run everything through one master volume and a compressor.
- A visible mute button that remembers its state.
- Vary the pitch a little each play and cap how many copies of one sound overlap.
- Small synthesized blips cover most effects; a short filtered noise burst plus a low thump makes a hit.

## 6. Playtest before shipping
Play it with scripted input in a headless browser at phone and desktop size and look at screenshots of real play: first input answers within a frame or two, touch moves without scrolling the page, sound waits for a gesture, losing explains itself, a hidden tab pauses, heavy moments keep their frame rate.

## A scar
An idle timer once counted frames instead of seconds, so how long it waited depended on the player's screen. Real seconds since then.
