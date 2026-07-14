# parla · notes

## log
- 2026-07-14: v1.1 (chat asked "is the German update deployed yet?" — it never existed; deployed it within the hour, stream tradition). 🇩🇪 Deutsch as 4th language: 60-word column (proper noun capitalization — Wasser, Straße), LANGS.de col 4, gold accent #b9861e, judge stamps "weiß ich ✓ / nochmal ↩", namespaced parla-de-* storage. normalize() gains ß→ss (strasse≈Straße, heiss≈heiß tested) alongside umlaut-stripping (schon≈schön). 18/18 incl. translation spot-checks + ES regressions.
- 2026-07-14: v1 (chat ask: multi-language vocab flashcards ES/FR/IT, swipeable cards, multiple choice, typing test, clean UI, "no squid" — contract honored, test asserts zero squid occurrences). **Dataset**: 60 core words (nouns/verbs/adjectives/basics), same English keys across all 3 languages, hardcoded 4-column rows. **Three modes**: 🃏 Cards — 3D flip (rotateY faces), pointer-drag swipe w/ rotation + lo sé/otra vez judge stamps (per-language!), right=known (persisted per-lang localStorage), left=again (reinserted at deck END — tested), progress bar + all-time known count, deck-finished summary; arrows/space keyboard, buttons for a11y. ✅ Choice — random direction (to/from EN), 4 unique options via makeChoices (rng-injectable for tests), streak + per-lang best, wrong reveals answer. ⌨️ Typing — EN→target, Enter checks via `checkAnswer`: 'perfect' exact / 'close' = accent-stripped match (NFD strip + œ→oe + apostrophe normalize; still shows proper spelling as a nudge) / wrong shows answer; 10-round scoring + per-lang best. **Language switch** re-themes accent color (ES rust/FR blue/IT green), judge-stamp language, resets all modes; storage keys namespaced parla-<lang>-*. 20/20 tests: dataset shape/uniqueness, accent matrix (café/citta/œuf/aujourd'hui/case-space), choices uniqueness + direction, deck reinsert + persist + language isolation. Fraunces italic + Karla, cream paper w/ tri-color radial hints.

## issues
- Verbs stored with 'to ' prefix in EN — typing EN→target unaffected (we only type target-language); if a reverse-typing mode is added, strip 'to ' on compare.
- FR 'beau/belle', ES 'hermoso/hermosa' — masculine forms only; gender variants accepted only via exact match. Chat's linguists may lobby.

## todos
- Audio pronunciation (SpeechSynthesis lang voices — es-ES/fr-FR/it-IT).
- More decks (numbers, phrases); reverse typing mode; daily streak.
