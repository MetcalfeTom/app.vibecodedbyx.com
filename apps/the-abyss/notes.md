# the-abyss

## log
- 2026-05-02: Created. **Type something. It vanishes in 5s. Forever.** Single-file ephemeral chat. **Mechanic**: each cast spawns a Cormorant Garamond italic message div near the top of a tall "well" container. CSS keyframe `descend` runs over 5 seconds: appears with blur+slight-up jitter (0-8%), holds in place 8-70%, drifts down 220px and fades to 62% (70%), final descent to 480px with blur(6px) and full transparency (100%). The well has a `mask-image: linear-gradient(black 30%, transparent 95%)` so the bottom half literally dissolves into pure black — messages don't fade where you can see them, they fall INTO the abyss. Belt+suspenders cleanup: `animationend` removes the node, plus a 5500ms `setTimeout` pruner for tab-backgrounded cases. **Realtime**: supabase broadcast channel `the-abyss-broadcast` with `self:false` so your own cast doesn't echo. Every connected client sends `{event:'cast', payload:{text, who:'· anon ·', hue}}` and instantly drops the message into their own well. Presence-tracked online count shown as "N souls" in the top-right meta. Each client picks a random hue from a 8-color palette to tint the "who" label so messages read distinct. Falls back to solo mode if the supabase config can't load — local cast still works, indicator reads "solo · no relay". Per-message horizontal jitter ±60px so simultaneous casts don't stack perfectly. **Aesthetic**: pure black bg with a subtle violet gradient up top + black gradient downward; Cormorant Garamond italic display, Syne Mono for tiny meta labels (live pulse, soul count, hint). 140-char input with hairline underline that brightens on focus, "CAST" outline button. Footer hint reads "nothing here is saved · everything fades · 5 seconds". Pollinations OG, 🕳️ favicon. No backend tables — entirely ephemeral, like a séance.

## issues
- If the user spams casts faster than ~5/sec, the descending messages overlap visually even with the jitter. Fine in practice (cadence is gated by typing speed) but heavy spam looks chaotic.
- The mask-image approach hides messages where they descend below ~95% of the well — works in WebKit + Firefox + Chrome but old Edge might not respect it.
- Presence count includes the user themselves (so "1 soul" shows even when alone).
- No rate limiting — chat could in theory broadcast a message every ms. Browsers + Supabase will throttle in practice.
- Long messages (~140 chars) wrap to multiple lines, which makes the descent animation look mismatched with shorter messages descending faster visually.

## todos
- Anti-spam: per-client throttle (1 cast / sec).
- Show online presence dots that pulse when each user is typing.
- Optional "echo mode" where messages bounce back from the bottom briefly before final fade.
- Audio whisper SFX on each cast (synthesized).
- Variable descent speed: lower-energy whispers fall slower than ALL CAPS shouts.
- Color tint message text by the speaker's hue (currently only the "who" label is tinted).
