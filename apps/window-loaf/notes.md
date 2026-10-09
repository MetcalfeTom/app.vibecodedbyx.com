# Window Loaf

pochinia's idea (2026-10-09 07:08 UTC, Twitch): "can you make a gif of a cute cat or something?" — ginger, named Mewo.

## log
- v1 (2026-10-09 07:16 UTC): a ginger loaf cat (Mewo) asleep on a snowy windowsill, all drawn on canvas in a 400×400 scene.
  Breathes, the left ear turns to listen, the tail tip flicks, the whiskers twitch. Tap it: one eye opens with a flat lid and a line
  ("…", "five more hours."); three taps in 6 s: both eyes wide, "mrrp!" and a little chirp sound. Tapping elsewhere turns the ear.
  🎞 make a gif: my own GIF89a encoder (50 frames × 8 cs = one 4 s loop, palette from the scene colours + the most used 15-bit bins,
  unchanged pixels transparent with keep-frame disposal, LZW like omggif). 320×320, about 200 kB, made in about 1 s. Sheet with
  the gif, ⬇ save, 📤 share (when the phone can share files), press-and-hold tip.

## issues
- everything that moves on its own must loop every L=4 s (snow falls 1 or 2 window heights per loop, two breaths per loop), or the gif seams.

## todos
- name tag you can change (other visitors' own cats), coat colours (black, grey tabby, calico, white)
- a judging gif, a belly-trap roll-over after many pokes, purr while you hold it
- probe: ImageDecoder in headless decodes the gif frames (s_loaf1.json)
