# Slap Battle — notes

## log
- 2026-09-26 — **v2 manga makeover** (was a plain two-colour turn game with system font, no og image, and only playable with two people):
  - paper + halftone look, Dela Gothic One + DotGothic16, fighting-game skewed health bars with a white "recent damage" ghost, speed lines + glow behind whoever's turn it is.
  - **1 Player mode**: Yuki is a CPU who slaps at 72–112% of *your* average swipe speed (so it stays close on any device); both 100 hp. 2 Players keeps the old rule: Yuki 120 hp because Sakura always swings first.
  - swipe power = **peak horizontal speed over any 40–90 ms stretch** of the stroke (pointer events, coalesced), not distance ÷ total time — pausing before the flick used to ruin the slap. Damage = speed/340 ±15%, min 2, no cap (kept the old "unlimited scaling" choice).
  - **CRITICAL ×1.5** when you flick 35%+ faster than your own running average (device-fair); CPU crits 10% at random.
  - onomatopoeia burst on the target's cheek (pat. / SLAP! / SMACK!! / KA-POW!!! + katakana), damage and px/s readout, a flying 🫲 hand, screen shake scaled by damage, WebAudio slap (noise + thump) and a K.O. bell.
  - wrong-way / too-short / vertical swipes show a small hint instead of silently doing nothing.
  - K.O. screen with stats (slaps, hardest, criticals), Rematch / Change mode. aria-live announcements, focusable buttons, reduced-motion respected.
  - og.png is a real frozen mid-slap frame (1200×630). Dropped the unused supabase-config include.

## issues
- Old history: keyboard controls were added then removed on purpose (916676da8) — swipe only.
- Headless test font can't join 🧚+♀ (ZWJ) so screenshots show a ♀ box; real devices render one fairy. og.png uses plain 🧚.

## todos
- a shared "hardest slap" board? (would need a plausibility cap — mouse flicks can hit 6000+ px/s)
- more fighters to pick from
