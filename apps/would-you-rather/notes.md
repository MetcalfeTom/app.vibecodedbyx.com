# would-you-rather (Would You Rather)

## log
- 2026-07-02: shipped (chat ask: "would-you-rather app with a hundred tiny horse question baked in as a preset"). The classic **"fight 100 duck-sized horses vs 1 horse-sized duck"** is question #1 with a gold "★ the classic" badge, plus a persistent "🐴 take me to the tiny horses" jump button on every other question.
  - **40 questions** (`Q = [id, emojiA, textA, emojiB, textB]`, ids verified unique). Order: classic first, rest session-shuffled. Includes stream-flavored ones (debug-write, stream-chat).
  - **Real community percentages** via new Supabase table **`wyr_votes`** (`question_id text, choice int 0|1, user_id`; RLS: read-all / write-own — verified live with a REST probe: authed insert 201, public read OK, cleanup 204). Anonymous sign-in on load; existing own votes prefetched so revisits show results instantly and can't double-vote (one insert per question, `myVotes` map).
  - **Flow**: two big split cards (crimson A vs teal B, rotated gold VS). Pick → both cards lock, yours gets gold outline, loser dims, percent bars slide up from card bottoms with vote counts, verdict line ("you're with the majority (72% agree)" / "bold. only 18% chose your side"), total votes, then **next dilemma →**. Skip button for pre-answer. Keyboard: 1/2 choose, Enter next.
  - **Graceful offline**: if Supabase fails, picks still lock with "(community results unavailable right now)" — no fake numbers.
  - **Aesthetic**: bold poster look — Passion One 900 display + Space Mono, dark plum bg, red-vs-teal duel cards, gold accents.
  - WCAG: buttons everywhere, role=status aria-live verdict, focus-visible gold outlines, focus moves to Next after answering, prefers-reduced-motion kills transitions, stacked single-column ≤720px.
  - Verified: module JS OK (node --check), 40 unique ids, head/OG/favicon, live DB probe green.

## issues
- Percentages fetch all vote rows per question client-side — fine at current scale; if a question crosses ~10k votes, switch to a count RPC or head-count queries.
- One-vote-per-question is enforced client-side (no unique DB index) — a determined user could double-vote via console; acceptable for a party toy.

## todos
- "Submit your own dilemma" (needs moderation gate — maybe approved via chat).
- Share button that renders your pick as an image/copy text.
- Daily featured dilemma.
- Realtime: watch wyr_votes inserts to tick percentages live while looking at results.
