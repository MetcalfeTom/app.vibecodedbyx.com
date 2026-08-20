# Stream Jukebox — a now-playing overlay prototype

## log
- 2026-08-20: v1.0 — built per three chat requests landing in sequence (build → add neon+cozy themes → test-then-ship; honored: 15/15 BEFORE any commit). AN HONEST PROTOTYPE: purple "prototype · mock data" badge, footer states "connects to nothing — no Spotify, no Twitch, no network" (probed). MOCK LIBRARY: 10 fictional tracks (Neon Pigeons, Cassette Ghost, DJ Sloppy…) with short demo durations; procedural album art (hash → gradient pair + glyph). OVERLAY CARD: track/artist/requested-by, animated progress + tabular times, 4-bar equalizer (reduced-motion static), aria-live now-playing announcements. PLAYBACK: mock engine with injectable TM.now (pinned first in probes, the standing law) — pause holds the clock exactly, track end autoplays queue head, skip is kind, empty deck "hums, unbothered". REQUESTS: pending inbox → approve (queue №) / pass ("the song will find another night"); manual form + SIMULATED CHAT (seeded fictional viewers, toggle, deterministic simTick). CHAT-SAFE BY CONSTRUCTION: every user string renders via textContent only (probe injects <img onerror> and asserts no element, no window.__pwned, shown as inert text), URLs → "[link removed]", 24-char clamp with ellipsis, zero anchors in lists. QUEUE CONTROLS: bump-to-next, up/down, remove ("dignity intact") — order transitions probed exactly. THEMES per follow-up: glass (default) / ⚡ NEON (teal-on-purple, glowing bar+border) / 🍵 COZY (cream+clay light) — body-class var overrides, radio chips, persisted, probe verifies REAL computed-style differences between themes. Geometry check on the overlay card (postcard lesson). Probe 15/15 first run; both theme screenshots verified pre-ship.

## issues
- none.

## todos
- OBS-crop guide markers, a compact "overlay-only" query param view (?bare-overlay), per-track accent from art hue, if chat asks.
