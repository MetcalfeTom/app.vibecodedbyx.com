log:
- v1: Initial lo‑fi Win95 soundboard with 6 tracks, 16‑step sequencer, per‑channel volume, master lo‑fi filter, randomizer, and local save/load.

issues:
- Mobile browsers require a user interaction before AudioContext can start; solved by gating playback behind the Start button.
- Some devices throttle setInterval when the tab is backgrounded; acceptable for this lightweight app.
- OG image uses emoji CDN .png; consider adding a custom PNG later for richer previews.

todos:
- Add pattern share links (encode pattern in URL hash).
- Add swing and per‑track pan.
- Add simple bit‑crush or downsampler for extra grit.
- Optional Supabase table to save public patterns by user_id and title.
- Add touch‑hold to paint multiple steps quickly.

notes:
- Instruments are synthesized (no external samples) to avoid licensing issues while evoking classic Win95 tones.
- Keep CSS responsive; grid shrinks labels at smaller breakpoints.

