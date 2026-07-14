# micro-turk · notes

## log
- 2026-07-14 v1.0: chat "MVP for MTurk — requester task post, worker claim flow, review system, public ledger". Newsprint classifieds aesthetic (Playfair Display 900 masthead "The Micro Turk", Old Standard TT body, Plex Mono numerals, rubber-stamp status chips rotated: OPEN/CLAIMED/PROOF IN/PAID). **RLS-shaped data model** (own-rows-only writes): turk_tasks (requester-owned: title/details/reward/status/requester_name), turk_claims (worker-owned: task_id/submission/status), turk_reviews (requester-owned: verdict/note/reward/worker_user) — workers can never edit a task row, so ALL state derives client-side in taskView(): active claim = earliest un-rejected claim; status = approved?paid : none?open : submission?submitted : claimed. Rejection reopens automatically (next claim becomes active). Balances = 100 start + approved reviews (worker_user +, review.user_id −), computed client-side from ledger. IMPORTANT: tables were first created WITHOUT a primary key (create_table doesn't add id by default!) — deleted + recreated with uuid id PK, client supplies crypto.randomUUID(). Auth via /supabase-config-fixed.js supabaseSession (twitch metadata name else anon-xxxx). Realtime postgres_changes on all 3 tables → 400ms debounced reload. All user text esc()'d. reward clamped 1–50.

## issues
- Reward is honor-system vibecoin — no real escrow; balances can go negative for prolific requesters (intended, it's satire-adjacent).
- prompt()/confirm() used for reject-note + tear-down — fine for MVP, could become inline forms.
- If two workers claim simultaneously, earliest created_at wins as active; the loser's claim silently waits in line (becomes active if the first is rejected). Not communicated explicitly in UI yet.

## todos
- Worker leaderboard (top earners from ledger).
- Inline reject-note form instead of prompt().
- "My work" filter tab; task detail permalink.
- 2026-07-14 v2.0: MTurk rebrand — orange masthead, two-col SVG landing (worker CRT / blue $ pig), 1770 cabinet strip, rainforest disclaimer. v3.0: Marci's Training Hall — 3 evergreen HOUSE tasks (fixed uuids 000…001/2/3, no task rows): label-photo (pollinations seed 1770), sentiment (3 in-card sentences), audio-transcribe (SpeechSynthesis speaks AUDIO_TEXT). All workers claim in parallel; community review (anyone but author, 1 review/claim, self-review guarded); requester_name='HOUSE' flag makes balances() MINT instead of debit. Ledger renders 🏛 the house. TEST GOTCHA: slicing app source into a harness captured `var reviews=[]` which silently shadowed the same-named function param → {} balances; rename harness params away from app globals.
