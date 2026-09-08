# Slop Host — notes

## log
- 2026-09-08 v1.0 — built per two merged chat requests ("continue the notes-host prototype with simulated chat, sarcastic terminal logs, mock viewers, and an interactive visible demo" + "continue building the app-host prototype with notes becoming apps, chat directing builds, simulated viewers, and visible code stream" — same idea minutes apart; nothing named notes-host/app-host existed, so this is the fresh build, said so to chat). A self-parody of the sloppy.live stream: type a note → sarcastic terminal log streams (deterministic per note: parsing→scaffolding→…→"done. allegedly." with snark interjections + a 35%-chance taste-not-found error), a decorative code stream scrolls plausible nonsense, and the note becomes an app card (deterministic name from the note's own words + suffix/emoji/version/pretend-votes via FNV hash → LCG). Cards open REAL interactive mini-demos (5 kinds picked by note hash: bounce/clicker/starfield/wobble/beeper — canvas toys, beeper does WebAudio on click). Chat is 100% FICTIONAL (obviously-fake handles, reaction pool + build suggestions with a "host this idea" button — chat directs builds), viewer count drifts. Honesty structural: parody pill, "chat is fictional / code is theater / demos are real" statements, zero fetch/WebSocket/supabase (probe-enforced), zero anchors. Climate Crisis + VT323 + Chivo Mono. ENGINE 22/22 node + HOST 22/22 at 1200/390/320.

## issues
- LCG first draws streak across nearby seeds — chatMsg warms the generator with two discarded draws (else early chat repeats one idea 3×).
- Demo probes must pick a note whose demo self-animates (clicker/beeper are static until clicked — probe iterates note suffixes until demoFor gives a moving one).

## todos
- More demo kinds (tiny maze, pong-for-one).
- A "raid" event where fictional viewers spike.
