# bubbletalk (BubbleTalk)

## log
- 2026-08-07: v1 per chat ("WhatsApp-style chat shell with green and blue bubbles plus typing indicators"). Single file, dark messenger aesthetic (Karla + Spline Sans Mono, WhatsApp-adjacent palette with doodle-dot wallpaper), two-pane desktop / stacked mobile with back button.
  - **Bubbles**: green = you (right, tail top-right), blue = them (left), timestamps, tick lifecycle ✓ sent → ✓✓ delivered (700ms) → blue ✓✓ read (when the contact starts typing — probe caught that the read repaint needed an explicit renderChat before showTyping; typing bubble is appended after so it survives).
  - **Typing indicators**: 3-dot bounce bubble + "X is typing…" header status in accent green; duration scales with reply length (900+28/char, 4.2s cap).
  - **The cast** (all local, ELIZA-style keyword rules + fallback pools): Mom 💐 (did you eat), Landlord Gary (rent.), shrimp fan club 🦐 GROUP (Lars/the lamp/rat attorney with per-member name colors, 45% chance of a pile-on second reply from a different member), Scam Likely ☎️ (do-not-redeem lineage), Blizzard 🐺 (corgi-machine crossover, off duty). Greetings on first open.
  - **Threads**: sidebar with avatars, last-message previews, unread badges (replies landing in non-active threads count up, cleared on open), one ambient unprompted ping 25-60s in. localStorage (60 msgs/thread cap) + reset button.
  - **A11y**: rem, role=log aria-live on messages, sr-only announcements (replies/new-message/reset), thread buttons with unread in aria-label, ≥2.75rem targets, focus-visible, reduced-motion stills the dots.
  - Verified: syntax + id cross-check, 19-check probe (keyword rules, fallback identity, typing scale+cap, greeting, tick lifecycle incl. blue-read fix re-probe, typing dots + header status, reply landing, typing cleanup, unread badge, persistence, group greeting), 0 errors.

## issues
- Personas are canned (no AI) — deliberate: instant, free, offline. Pollinations text could power an "AI contact" later.

## todos
- "Sloppy" contact powered by pollinations text API.
- Voice-note bubble parody (waveform that plays a synth mumble).
- Wallpaper picker (doodle/solid/gradient).
- Group mention highlights (@lamp glows).
