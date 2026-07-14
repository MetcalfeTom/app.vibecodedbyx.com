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
