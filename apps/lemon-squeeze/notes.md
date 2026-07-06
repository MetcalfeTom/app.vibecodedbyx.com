# Lemon Squeeze — notes

## log
- 2026-07-06: v1 — bright lemon incremental clicker (chat ask incl. green-tipped lemon cursor). **Cursor**: inline SVG data-URI on body (yellow lemon, green tip circle + leaf, 30×30, hotspot 15,15). **Core**: big SVG lemon button (face blinks between two mouth paths, squish keyframe scale(1.09,0.86), 4% crit = ×5 "JUICY!"), fixed-position +N floaters + physics juice drops (rAF, gravity 420, killed by prefers-reduced-motion). **Economy**: grip upgrade (+1/click, base 15 ×1.7) + 6 generators — juicer 0.5/s (30), stand 3/s (220), tree 14/s (1.3k), squeez-o-matic 70/s (9.5k), factory 380/s (64k), lemon planet 2.4k/s (500k) — cost = base×1.15..1.20^owned. Passive tick 100ms, paint throttled 250ms. 8 milestone toasts on total juice. **Save**: localStorage lemon-squeeze-v1, 5s autosave + beforeunload; offline gains at half rate capped 2h w/ welcome-back toast. Wipe button w/ confirm. WebAudio squish (triangle sweep + bandpass noise) + buy arpeggio, mute persisted. Fonts Lilita One + Baloo 2, sunburst repeating-conic bg. WCAG: rem, aria-labels, role=status toast (milestones only, not the counter — no spam), aria-pressed mute, aria-disabled shop rows, focus-visible, 44px targets, reduced-motion. **Tested in headless Chromium harness**: 40 clicks → grip buy (+2/click) → juicer buy → passive 0.5/sec renders → reload restores save; zero console errors.

## issues
- fmt() floored sub-integer rates ("0 / sec" with one juicer) — fixed with 1-decimal formatting under 10.
- aria-live must NOT be on the juice counter (updates 4×/s).

## todos
- Chat may want: golden lemon random event, prestige ("when life gives you lemonade"), leaderboard via Supabase, achievements panel.
