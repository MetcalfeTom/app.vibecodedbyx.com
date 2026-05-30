# meme-museum

## log
- 2026-05-30: initial build. **Curated meme gallery with upvotable leaderboard**, backed by two new Supabase tables (`meme_museum_memes` + `meme_museum_votes`, both with default RLS — read-all, insert/update/delete-own). Single self-contained HTML (~35KB).
  - **Data layer**: `meme_museum_memes(user_id, title, image_url, caption, curator, created_at)` indexed on `created_at`; `meme_museum_votes(user_id, meme_id, created_at)` indexed on `meme_id` + `(user_id, meme_id)` for vote-lookup speed. Anon-auth via `/supabase-config-fixed.js`. Vote toggle = delete-then-insert (RLS lets users only mutate their own rows). Caption ≤200 char, title ≤80 char, image URL ≤500 char, curator ≤32 char clamped client-side; URL must be http(s) and look-like-image (regex on ext OR known-image-host allowlist with permissive fallback to broken-image graceful state).
  - **Realtime**: subscribes to `postgres_changes` INSERT/DELETE on both tables via `supabase.channel('meme-museum-live')`. New donations appear live without refresh; votes update counts globally in real time.
  - **Sort**: 3 modes — `top` (votes DESC, ties broken by recency, top-3 get gilded "№1/2/3" rank badges + tinted frame glow), `new` (recency DESC), `random` (Fisher-Yates shuffle). Rank badges only render when sort=top AND idx<3 AND count>0.
  - **Voting UX**: optimistic update + revert on error, 600ms client-side debounce, hearts `♡`→`♥` on toggle, button bg flips to crimson when voted. Anonymous users get auto-anon-auth via supabaseSession → first vote works without prompt.
  - **Submission**: red FAB bottom-right + secondary button in toolbar both open same modal (role=dialog aria-modal). 3 fields: image URL (required, validated), title (required ≤80), caption (optional ≤200 with live char count). 8-second client-side rate limit between submissions. Errors render inline in form. Auto-fills `curator` from twitch `user_name` if logged-in.
  - **Aesthetic** — museum gallery vibe: cream wallpaper bg with cross-grain repeating-linear textures + warm radial highlights, top-edge brass rail (CSS-only gradient), Playfair Display 900-italic h1 ("The Meme **&** Museum" with crimson ampersand) + Cormorant Garamond italic subhead + Special Elite typewriter for placards/labels/timestamps. **Each exhibit** = ornate gold-gradient frame (3-stop diagonal gold + inset bevel groove via box-shadow + ✦ corner flourish) wrapping the meme image in 1:1 aspect with crisp inner border, brass placard underneath (3-stop bronze gradient with two screw-dot pseudo-elements + inner highlight + outer drop shadow) showing typewriter "EXH. № 001" tab, Playfair italic title, italic caption in pull-quotes, footer with curator + relative time. Hover scales image subtly + reveals red "remove" link for owner.
  - **Crowned exhibits** (top-3 when sorted by votes): #1 gets gold-gradient rank badge + gold halo glow ring, #2 silver-gradient + silver ring, #3 bronze + bronze ring.
  - **Lightbox**: click any exhibit canvas opens fullscreen meme zoom with thick gold border, ESC or click-outside closes.
  - **Empty state**: "The walls are bare. Be the first donor."
  - **Header counter**: live "X exhibits on display · Y total votes cast" in typewriter font.
  - **A11y** per directive: semantic markup (`<main>`/`<header>`/`<nav>`/`<section>`/`<article>`/`<h1-3>` + `<button type=button>`), aria-pressed on sort tabs + vote buttons, role=dialog aria-modal on submit + lightbox with aria-labelledby, role=status aria-live on toast + sr-only announcer, focus-visible crimson 3px outline, 2.75rem touch targets, prefers-reduced-motion kills modal animation + hover-zoom on image.
  - **Mobile** @600px: 220px grid tracks, smaller frame padding, tighter placard.

## data sources
- meme_museum_memes (created in this app)
- meme_museum_votes (created in this app)

## issues
- Image URL validation is permissive — broken images render the "image unavailable" fallback panel rather than blocking submission
- No image upload (only URL pasting) — to avoid storage costs and moderation burden
- No vote-rigging detection beyond RLS unique constraint should be added: currently `(user_id, meme_id)` is just an INDEX not a UNIQUE constraint — duplicate inserts theoretically possible if client races, though the optimistic state prevents it from being triggered in practice
- Top-N realtime resort can flash briefly when a new vote shifts ranks

## todos
- Add UNIQUE constraint on (user_id, meme_id) at the DB level
- Tag system + tag filter ("#cat-memes", "#brain-rot")
- Daily/weekly featured exhibits
- "Acquired by" header showing curator profile cards
- Comments / quotes panel below each placard
- Hover-to-preview gif autoplay-on-hover only
- Image upload via Supabase storage as a premium feature
- Karma awarded to curators of top-voted exhibits
