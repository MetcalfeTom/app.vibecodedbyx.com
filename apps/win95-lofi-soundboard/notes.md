log:
- v2: Added public beats publishing with Supabase, upvotes, and in-app loading of shared beats. Exposed simple API on app.js for interop.
- v1: Initial Win95 Lo‑Fi Soundboard with sequencer, mixer, local save/load.

issues:
- Root supabase-config.js is not used here; a local copy is loaded as module to avoid DOM coupling.
- Anonymous auth required to publish/vote; if auth errors, users will see a small error message above the table.

todos:
- Add search/sort (most voted, newest).
- Prevent duplicate votes by adding a DB unique constraint (beat_id, user_id) when tooling permits.
- Add preview audio snippet rendering for share cards.

notes:
- Tables: lofi_beats(id bigserial pk, title text, bpm int, lofi int [0..100], pattern jsonb, user_id uuid, timestamps), lofi_beat_votes(id bigserial pk, beat_id bigint, user_id uuid, timestamps). RLS default (read all, write own).
- Always supply user_id on inserts to pass RLS.

