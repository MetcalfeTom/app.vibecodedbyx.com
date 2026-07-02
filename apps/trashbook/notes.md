# trashbook (Trashbook 🦝)

## log
- 2026-07-02: shipped (chat asks: "raccoon social network called Trashbook with profiles for trash preferences" + follow-up "and rival detection").
  - **Tables** (created via MCP, RLS read-all/write-own, probe-verified 201/read/204-cleanup): `trashbook_profiles` (raccoon_name, bio ≤140, prefs jsonb array, dumpster text, avatar_seed int) + `trashbook_paws` (target_user_id) — paw counts derived by aggregating rows, NEVER a counter column (app_votes/feedback lesson).
  - **Profile**: name + 🎲 generator (12×12×12 combos: "Lady Dumpling McTrashface"), home-dumpster field, 140-char bio, **12 trash preferences** (pick ≤5, aria-pressed chips): day-old pizza / dented cans / banana peels / takeout boxes / mystery socks / scratched CDs / curb furniture / cold fries / coffee grounds / used gift wrap / stale bread / anything shiny. One profile per user (existing row → update; insert otherwise; form prefills on revisit).
  - **Procedural avatar**: 16×16 pixel raccoon on canvas, mulberry32-seeded (fur/mask/bg palettes, ear tilt, pupil glint, blush, paws-up pose, firefly). Click avatar or dice to reroll seed; seed persisted.
  - **⚔️ Rival detection**: rivals = raccoons whose prefs overlap YOURS (they want your trash). Top-3 by overlap size with severity labels (petty rival / rival / ARCH-RIVAL ≥4 shared) + the exact shared items ("wants your 🍕 day-old pizza, ✨ anything shiny"). Bonus: **☮ trash soulmate** = first raccoon with zero overlap ("zero competition. beautiful."). Shared prefs also highlighted red on feed cards.
  - **Dumpster feed**: cards (avatar/name/territory/bio/pref chips) with 🐾 paw-of-respect toggle (optimistic, rolls back on error, self-paw blocked with a joke), counts derived from rows. Sort newest / most pawed. Realtime INSERT subscriptions for profiles + paws.
  - **Aesthetic**: night-alley palette (deep blue-gray, trash-green + paw-amber + rival-red), Titan One display + Space Mono. Footer nudges Twitch login for persistence.
  - WCAG: labelled inputs, role=group prefs, aria-pressed toggles, role=status aria-live save status, focus-visible, ≥2.4rem targets, single-column mobile wrap.
  - Verified: module JS OK, correct anon key, live DB probe green (insert/read/paw/cleanup — no leftover rows).

## issues
- Anonymous sessions: profile is tied to the browser session; clearing storage orphans the raccoon (Twitch login via top bar persists it).
- Rival detection is client-side over all profiles — fine until hundreds of raccoons; then paginate.
- prefs jsonb is unvalidated server-side; feed only renders known pref ids (unknown ids escaped + shown raw id), avatars clamp to known palettes.

## todos
- Trash-post feed ("found a whole rotisserie chicken behind the deli").
- Rival "turf war" mini-interaction (petty one-click hiss).
- Filter feed by preference ("show me the sock raccoons").
- Twitch-username display for logged-in raccoons.
