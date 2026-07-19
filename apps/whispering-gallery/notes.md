# whispering-gallery · notes

## log
- 2026-07-19 v1.0: chat "whispering gallery — visitors leave voice notes or text echoes, the next person hears them drift back". SHARED via supabase table gallery_whispers (uuid pk client-supplied, kind text|voice, body = text or base64 data:audio URL, name; read-all/own-writes RLS). Voice: MediaRecorder 6s cap @ opus 24kbps → dataURL, MAX_BODY 150k guard both sides of send; playback through generated 2.8s convolver reverb (wet .7 / dry .35 — dome acoustics). Text whispers drift right→left across a masked dome region (offset via translateX vw animation, 13–22s, random height/duration), voice = amber orbs that drift and PLAY on tap (60% auto-play as they pass once audio unlocked). Drift loop every 5.2s cycles newest-first; realtime INSERT subscription surfaces other visitors whispers live ("a new whisper just entered the dome"). Audio + composer gated behind 🕯 enter button (autoplay law); text drifts even before entry. Empty gallery seeds a single dome-voice line. mkWhisper validates kind/caps/audio prefix. Reduced-motion: whispers render statically inline. Cormorant italic + Space Mono, candlelit stone.

## issues
- Voice rows are chunky (~60-110KB base64) — limit(40) fetch keeps payloads sane; if the table grows huge, add a created_at index fetch window or periodic prune ritual.
- MediaElementSource per playback creates nodes per orb tap — fine at gallery scale.
- Whispers are public + unmoderated beyond caps; the smallprint says the dome repeats what it is given. If chat reports abuse, add a hide-own + report pattern.

## todos
- "Answer a whisper" (threaded echoes) if chat wants conversation.
- Prune ritual: whispers older than N days fade from fetch.
