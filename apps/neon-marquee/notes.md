# neon-marquee · notes

## log
- 2026-05-19: v1 — **global real-time scrolling message board** with a retro neon billboard aesthetic, per chat ask "Build a simple, real-time global message board where users can post scrolling marquee messages for everyone to see. Use Supabase for the backend sync, and make the UI look like a retro neon billboard". Single-file ~21KB, Supabase Realtime + Postgres backed.
  - **Backend** · new `marquee_messages` table (columns: `text`, `color`, `author`, auto `user_id` + `created_at` + `updated_at`, indexed on `created_at`). Default RLS: anyone reads, only `user_id = auth.uid()` writes. Anonymous auth via `supabase.auth.signInAnonymously()` so any visitor can post without signing up.
  - **Realtime** · Supabase channel `neon-marquee-v1` subscribed to `postgres_changes` (INSERT, public.marquee_messages). Every insert anywhere in the world arrives in every visitor's marquee within ~500ms. Presence tracks unique connected viewers, displayed as live count in the header. Self-INSERTs filtered via `user_id === myUid` to avoid double-rendering after optimistic local add.
  - **Initial load** · fetches the last 15 messages newest-first, reverses, then staggers them into the marquee at 380ms intervals so the board fills naturally instead of dropping a wall of text.
  - **3-lane marquee** · billboard contains 3 horizontally stacked lanes. Each ticker enters from off-screen right and scrolls to off-screen left over ~6-9s based on its text length (`speed = 110-140 px/sec`). Lane selector picks the lane with the smallest `rightEdge` (= most empty on the right side) to avoid overlap. After insertion, a setTimeout marks the lane as "free" again once the new ticker's tail has cleared with a 60px buffer. requestAnimationFrame drives smooth per-frame transforms; when a ticker finishes, it removes itself and the lane reverts to its idle text if empty.
  - **Idle text** · each lane shows "… AWAITING TRANSMISSIONS …" / "… TYPE BELOW TO BROADCAST …" / "… EVERYONE SEES YOUR MESSAGE …" in dim VT323 until the first message arrives, then hides.
  - **Per-message color** · 6-swatch palette (magenta `#ff2e9a`, cyan `#66f5ff`, yellow `#ffd24a`, mint `#7dffd5`, violet `#b870ff`, orange `#ff7e3a`). Each message scrolls in its chosen neon hue with a 3-stop text-shadow glow stack (4px / 12px / 28px). Choice persists to `localStorage['marquee-color']`.
  - **"Mine" badge** · your own messages get an extra 60px outer-glow stack PLUS a gold `★` suffix so you can spot them in the scroll. Other people's messages render with the standard glow.
  - **Author handle** · optional 20-char handle persisted to `localStorage['marquee-author']`. Appended to each ticker as a smaller, dimmer "— handle" suffix in JetBrains Mono. Defaults to "anon" if blank.
  - **Cooldown** · 2-second client-side rate limit between submissions per visitor. Tries to insert too fast → amber toast "slow down".
  - **Optimistic local add** · your message appears in your own marquee instantly with `mine=true`, then the postgres broadcast confirms by arriving for everyone else. Skipping it on the self-roundtrip via `user_id === myUid` prevents a duplicate.
  - **Aesthetic** · deep void `#0a0214` background with magenta/cyan/violet/orange radial glows + a perspective synthwave grid receding to the horizon at the bottom. Billboard frame is a 4px violet border with inset pink glow, outer 8px frame layer, drop shadow, and tiny "bolts" in all 4 corners (grey radial gradient circles). Inside: LED dot-matrix overlay via `radial-gradient` at 4px spacing with `mix-blend-mode: multiply` for the authentic ticker-board look. Title "NEON · MARQUEE" in Monoton with magenta/cyan split + 6-second flicker keyframe (occasional dim frames). Live-on-air pill below with pulsing green dot.
  - **Compose form** · color swatches + 22px VT323 text input + remaining-char count (turns amber under 30, magenta at 0) + 20-char author input + big magenta "⏵ Broadcast" button. Hard 180-char cap.
  - **Status pill** · top-right slide-in toast for "broadcast · live", "slow down", "couldn't load history", "couldn't broadcast globally — message shown locally only" (graceful degradation when offline or RLS rejects).
  - **WCAG basics** · `<header>`/`<form>` semantics, `role="status"` + `aria-live` on toast, aria-label on every swatch, `:focus-visible` cyan outline, prefers-reduced-motion kills title flicker + dot pulse + perspective grid.
  - **Mobile** · billboard + compose width drop to `calc(100vw - 16px)` below 640px, ticker font shrinks to 40px, author input narrows to 80px.
  - **OG image** · Pollinations flux seed 4747, "Retro neon billboard at night with three stacked scrolling message lanes in pink cyan and yellow, Times Square LED ticker, rainy synthwave cityscape background". No `referrer` param per project notes.

## issues
- Lane picker can occasionally overlap if many messages arrive in a burst — the `rightEdge` value resets after the setTimeout regardless of incoming bursts. Not catastrophic; just looks busy.
- The dot-matrix overlay uses a single 4px radial-gradient pattern; on very small screens it can moiré with character glyphs. Could swap to per-lane SVG dots if chat asks.
- 180-char limit is generous for marquee; long messages take 7+ seconds to scroll fully, which can feel slow on mobile.
- No moderation. RLS only enforces "you can delete your own messages", not "admins can purge". If chat gets spammy, an admin-writes-only "is_hidden" flag would be the way.
- No persistence sweep — `marquee_messages` will accumulate forever. A cron deleting rows older than 24h would keep the table healthy.
- Author field accepts unicode — could be abused for zalgo. Could filter to printable ASCII if needed.

## todos
- Reaction buttons that float a "+❤️" emoji over a scrolling message when clicked.
- "Throw a message" mode where you drag the ticker to set a direction/speed.
- Color preview that animates your message in the compose area before sending.
- Volume + a typewriter-tick sound effect (per character) on incoming messages.
- "Mute" toggle that hides handles you don't want to see (locally only).
- Twitch chat → marquee bridge: each chat message auto-broadcasts (with chatter's name as author).
- Pinned message that scrolls on a separate top "scroller" with extra glow.
- Daily "best message" voting + a hall-of-fame archive page.

## design notes
- Going with 3 lanes instead of a single long marquee gives a feeling of "multiple channels at once" — feels more like Times Square than a single ticker.
- Optimistic local add + filter-on-self-roundtrip pattern avoids the flicker where you'd see your own message appear, disappear, then reappear when the broadcast arrives.
- The `pickLane()` heuristic ("smallest rightEdge") works well for bursts; for steady-state traffic it round-robins automatically because tickers clear their lanes at similar rates.
- Used `auth.signInAnonymously()` rather than a custom anonymous flow so we get a real `user_id` for RLS and so the same browser tab can edit/delete its own messages later if we add that feature.
- VT323 + Monoton + JetBrains Mono trio: arcade ticker, neon billboard headline, technical metadata. Avoids the "Inter for everything" trap.
- Pollinations text API not used — this is pure user-typed input.
