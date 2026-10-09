# Fairylight Lane

Hub street for pochinia's four apps, built on my own initiative on 2026-10-09 (pochinia's brief for the street: "from this idea just go wild"). One snowy night street: Wan-kun's pink house (wan-wan-pup), Bnuy's carrot-roof post hutch (bunny-post), Nero's tall lavender house (nero-house), Mewo's snowy window (window-loaf), Poppo on the light wire. The characters' drawing code is copied from Nero's House (wanHead, mewoHead, bnuy, Nero's head) and Bunny Post (poppo), so if a sibling changes a look, copy it over by hand.

## log
- 2026-10-09 21:05 UTC v1.3 Poppo's Coop: a pigeon house on a pole above Wan's house (coopDraw at CX 36, CY 112, scale 1.25; its round door glows while he's home). Tap it (or the 🐦 Poppo chip, key 6): Poppo flies over from the wire (PO, fly(), poMove(): eased arc, flapping wing, mirrored when flying left) and reads the front page of the Coo-rier: HEADS() builds headlines from what the other apps remember (arguments, treats, the family photo, Mewo's coat/name, mail rounds, lights, bedtime, the party); the card lists 3 of them and links to Bunny Post. He flies back to the wire 30 s after the last tap. Tapping Poppo still gossips wherever he sits (hit box and bubble follow PO).
- 2026-10-09 20:06 UTC v1.2.1 morning: ☀️ (wake up) washes the sky pink-gold for a few seconds (BED.dawn) and the four neighbours say good morning one after another, each opening their curtains.
- 2026-10-09 19:54 UTC v1.2 bedtime: from 22:00 to 6:00 (visitor's own clock) or after tapping the moon / the 🌙 button by the light counter / key Z, the lane sleeps: curtains close in Wan's, Nero's and Mewo's windows (curtain() inside each window's clip), Mewo never judges in her sleep, Bnuy sleeps standing at the door, zzz float from whoever dozes, a soft veil dims the houses but not the bulbs or Poppo, Nero's lamp dims. A knock wakes one house for 9 s with a sleepy line (NIGHT(k)); later knocks in that window get the normal lines. Poppo stays up with night gossip (PPN), idle = snores + Nero whispering. ☀️ wakes everyone (BED.force overrides the clock). Tested headless (phone + desktop), 0 errors.
- 2026-10-09 17:45 UTC v1.1: new lights since your last walk pop one by one (ring + glow + chime) and the first house's neighbour thanks you (THANKS); the lane remembers which bulbs you've seen in 'fairylight-lane' {seen}. pageshow only re-reads on a back/forward restore (e.persisted), the first load is handled once.
- 2026-10-09 17:41 UTC v1: one 400-box canvas. Tap a house (or a name chip, keys 1-4) to knock: the camera zooms in (1.9x, tap the sky or Esc to zoom out), the neighbour answers with a line + fansub subtitle + its own sound, and a card shows that app with "knock and go in →" (a plain link to /<app>/). Tap Poppo (key 5) for gossip, every other one from your own Coo-rier archive (bunny-post-coorier). Tap a bulb for a light chase. Idle: the dog and cat argue across the lane, Poppo coos, Nero calls out.
  - 8 bulbs, 2 per house, lit from what the other apps remember (all apps share one origin): 1 = you went in (lane's own 'fairylight-lane' {been}) or that app's own key exists; 2 = Wan-kun friends with Mewo (wan-wan-pup-friend >= 5), a finished mail round (bunny-post-coorier n), Nero's family photo (new 'nero-house' {photo:1}, written by Nero's House v1.4.1), Mewo in a new coat or name (window-loaf). All 8 = a one-time party (shooting star, everyone talks), saved as done.
  - Mewo's coat (window-loaf coat), the pup's and the bunny's names come from those apps; a heart in both windows once the dog and the cat are friends.

## issues
- calico Mewo has no patches here (plain cream).
- emoji in the chips render as boxes in headless only.

## todos
- a small "🏮 back to the lane" link in each of the four apps?
- a real day look (blue sky, no fairy lights) — probably not, the lane is a night street.
