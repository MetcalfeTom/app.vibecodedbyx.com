# sloppy-book

## log
- 2026-05-02: Created. **The sloppy social network — late-2000s feed pastiche w/ profile pictures + status updates.** New supabase table `sloppy_book_posts(username, avatar, content, likes, liked_by, user_id, created_at, updated_at)` w/ default RLS (read-all, insert-with-correct-user_id, edit/delete-own). 3-column desktop layout (sidebar / feed / sidebar) collapsing to single column at <880px. **Top bar**: chrome-blue gradient masthead with "sloppy·book" Lexend Mega lockup, search pill (decorative), nav links (Home / Friends / Pokes), live connection indicator (●green=live, gray=connecting, red=offline), and a "me-pill" showing the logged-in profile's avatar + username. **Left sidebar**: large pixel-style avatar tile (initial-letter on a deterministic hue gradient), 3-stat strip (my posts / total feed / online), and an "apps" quicklink card (📷 photos / 📅 events / 📝 notes / 👋 pokes / 🎁 gifts — all hash-anchor placeholders). **Center column**: composer card with a borderless textarea ("what's on your mind?") + 6-emoji mood selector (happy/grumpy/sloppy/cozy/livid/proud) + Share button. Selected mood gets appended to the post body in `[brackets]`. **Feed**: chronological newest-first, cards with circular avatar (initial-letter, hue-deterministic), name + relative timestamp, body text, footer with `👍 like / unlike` toggle (persisted to liked_by[] + likes), `👋 poke` ephemeral cosmetic, and a delete `×` button on own posts. Likes update optimistically + persist via UPDATE. **Realtime**: postgres_changes on INSERT/UPDATE/DELETE so every viewer sees activity instantly without polling. Connection-state badge in the top bar tracks subscribe lifecycle. **Identity**: pulls username/avatar from `sloppygram_profiles` if the visitor has one (single source of truth per the project's unified-profile system); falls back to anonymous-sign-in + `user-XXXX` deterministic name. **First-run seed**: when the table is empty, drops 5 starter posts attributed to `sloppy / inisso / kneady1 / remytwofive / mrmald92` so the feed isn't a ghost town. **Right sidebar**: "friends online" list which is an HONEST mirror — derived from unique posters in the recent feed window rather than a synthetic ghost roster. **Aesthetic**: Facebook-circa-2007 chrome blue (`#3b5998`), white card stack with 1px gray rules + soft drop shadows, Source Sans 3 body, Lexend Mega for the lockup + avatar initials, Newsreader italic accents, tasteful round avatars with hsl-from-name gradients (blue-violet bias). Pollinations OG, 📘 favicon.

## issues
- Anon visitors all share the deterministic `user-XXXX` username generated from their UID prefix. Two anons with similar UIDs could clash visually. Acceptable for now.
- The "friends online" list is a recency mirror, not real presence. For real online state we'd need a presence channel join — easy follow-up.
- Mood emojis are appended to post body as `[mood]` rather than stored as a column. A `mood text` column would let us render with chips. Skipped to keep schema lean.
- Likes counter increments optimistically then writes; under high concurrency two users liking simultaneously could fight on the array. Postgres-side transaction or a like-table normalisation would fix it but for low traffic this is fine.
- Search bar is decorative — no backend filter wired in.
- No image uploads — composer is text-only. Future: storage bucket + drag-drop.
- No edit-in-place — edit RLS is allowed but the UI only supports delete.
- The "apps" quicklinks are placeholders pointing at `#`.

## todos
- Real presence via supabase channel.presenceState (join/leave events) for the right-side online list.
- Mood column + chip rendering instead of [text] suffix.
- Image attachments via supabase storage bucket.
- Photo-grid view (📷 quicklink → photos page).
- Comment threads on posts (sub-table or jsonb column).
- Profile click → drill-down view: bio + their post history + follow button.
- Pokes table (real ephemeral notifications instead of cosmetic toast).
- Gifts (cute crypto-pixel-art exchange via storage bucket).
- Mute & block (per-user filter list).
- Mobile bottom-nav bar.
- Keyboard: Ctrl+Enter to post.
- Twitch-login CTA in the empty state.
