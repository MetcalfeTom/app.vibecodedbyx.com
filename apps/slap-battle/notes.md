# Slap Battle — notes

## log
- 2026-09-27: pick your own fighter (Sakura 🧚‍♀️, Taro 🤠, Neko 🐱, Robo 🤖, Oni 👹) above the rival picker; looks only, same slap for everyone. Saved in localStorage slap_me; names flow into the HUD, banner, 1P button and spoken lines. In 2P, player two stays Yuki.
- 2026-09-26 — **v2 manga makeover** (was a plain two-colour turn game with system font, no og image, and only playable with two people):
  - paper + halftone look, Dela Gothic One + DotGothic16, fighting-game skewed health bars with a white "recent damage" ghost, speed lines + glow behind whoever's turn it is.
  - **1 Player mode**: Yuki is a CPU who slaps at 72–112% of *your* average swipe speed (so it stays close on any device); both 100 hp. 2 Players keeps the old rule: Yuki 120 hp because Sakura always swings first.
  - swipe power = **peak horizontal speed over any 40–90 ms stretch** of the stroke (pointer events, coalesced), not distance ÷ total time — pausing before the flick used to ruin the slap. Damage = speed/340 ±15%, min 2, no cap (kept the old "unlimited scaling" choice).
  - **CRITICAL ×1.5** when you flick 35%+ faster than your own running average (device-fair); CPU crits 10% at random.
  - onomatopoeia burst on the target's cheek (pat. / SLAP! / SMACK!! / KA-POW!!! + katakana), damage and px/s readout, a flying 🫲 hand, screen shake scaled by damage, WebAudio slap (noise + thump) and a K.O. bell.
  - wrong-way / too-short / vertical swipes show a small hint instead of silently doing nothing.
  - K.O. screen with stats (slaps, hardest, criticals), Rematch / Change mode. aria-live announcements, focusable buttons, reduced-motion respected.
  - og.png is a real frozen mid-slap frame (1200×630). Dropped the unused supabase-config include.
- 2026-09-26: Rival picker for 1 Player: Yuki 👸 (matches your energy, 100hp), Kage 🥷 (quick CPU turns, 35% crits, 80hp), Kuma 🐻 (150hp, wild 0.45–1.55× swings, slow), Obaa-chan 👵 (steady 0.98–1.12×, 90hp). Choice saved in localStorage `slap_rival`; 2P always uses Yuki
- 2026-09-27: glow-up (small fixes): (1) the CPU banner said "YUKI WINDS UP…" against every rival, so it now uses the rival's name (KUMA / KAGE / OBAA-CHAN). (2) On phones, big bursts like KA-POW!!! (≈520px wide) were cut off at the screen edge and the katakana went off-screen. `boom()` now shrinks the word to fit the arena and clamps the burst's x so it stays fully visible. Desktop is unchanged. (3) Tapping during the CPU's turn used to do nothing; it now shows a "<rival>'s turn, brace!" hint. hint() also removes any older hint first, so repeated wrong swipes no longer stack. Headless: 0 errors at 400×800 and 1280×800.

## issues
- Old history: keyboard controls were added then removed on purpose (916676da8) — swipe only.
- Headless test font can't join 🧚+♀ (ZWJ) so screenshots show a ♀ box; real devices render one fairy. og.png uses plain 🧚.

## todos
- a shared "hardest slap" board? (would need a plausibility cap — mouse flicks can hit 6000+ px/s)
