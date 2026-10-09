# Window Loaf

pochinia's idea (2026-10-09 07:08 UTC, Twitch): "can you make a gif of a cute cat or something?" — ginger, named Mewo.

## log
- v1.4 (2026-10-09 07:48 UTC): Wan-kun (Wan Wan Pup) lives across the street: pupWin() is the right-hand lit window, a tiny shiba with a red bow pops up and yaps 'wan!' every 16-30 s or on a tap (x 280-326, y 214-266); Mewo's ear turns and she says a tsundere line (WANLINES). Reads localStorage 'wan-wan-pup-friend' (same origin): friends ≥5 → heart in his window + softer lines. GIF stays loop-safe (gifState has no wan).
- v1 (2026-10-09 07:16 UTC): a ginger loaf cat (Mewo) asleep on a snowy windowsill, all drawn on canvas in a 400×400 scene.
  Breathes, the left ear turns to listen, the tail tip flicks, the whiskers twitch. Tap it: one eye opens with a flat lid and a line
  ("…", "five more hours."); three taps in 6 s: both eyes wide, "mrrp!" and a little chirp sound. Tapping elsewhere turns the ear.
  🎞 make a gif: my own GIF89a encoder (50 frames × 8 cs = one 4 s loop, palette from the scene colours + the most used 15-bit bins,
  unchanged pixels transparent with keep-frame disposal, LZW like omggif). 320×320, about 200 kB, made in about 1 s. Sheet with
  the gif, ⬇ save, 📤 share (when the phone can share files), press-and-hold tip.
- v1.1 (2026-10-09 07:17 UTC): pochinia found the moon weird: the crescent was a sky-coloured disc over the moon, a dark blot
  on the glow; now cut out for real on its own canvas (MOON sprite). Five coats (ginger, black, grey tabby, calico with patches, snow
  white) and a name field carved into the sill; kept on the device and in the link (#coat/name); the gif is saved as <name>.gif.
- v1.2 (2026-10-09 07:19 UTC): the gif sheet has 😴 asleep / 👁 judging me; the judging loop opens one eye at 1.2 s with a
  '…' bubble and shuts it before the loop comes round (decoded frames 0/20/28/49 checked). pochinia loves the ear twitch: keep it.
- v1.3 (2026-10-09 07:20 UTC): hold a finger on the cat (or press P) to pet it: a purr (filtered noise, 25 Hz flutter,
  slow in/out), a tiny shiver and hearts. A short tap still pokes, now on release (hold > 0.3 s = petting).

## issues
- everything that moves on its own must loop every L=4 s (snow falls 1 or 2 window heights per loop, two breaths per loop), or the gif seams.

## todos
- name tag you can change (other visitors' own cats), coat colours (black, grey tabby, calico, white)
- a belly-trap roll-over after many pokes; a petting gif with hearts
- probe: ImageDecoder in headless decodes the gif frames (s_loaf1.json)
