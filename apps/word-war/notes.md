# Word War

Typing duel game. Player vs AI rival trade blows by racing to finish the same word — typing speed determines damage.

## log
- 2026-04-09: Initial build. DOM-based (non-canvas) duel game with HP bars, shared word prompt, and 4 foe tiers (Scribe 24wpm / Duelist 40 / Hex-Maniac 60 / Qwerty King 85). Damage formula: base 14 × speed multiplier (0.6 + (wpm-20)/50) + streak bonus (+6% per streak, max 60%) + crit ×1.75 at ≥70 wpm or every 5th streak. Foe "types" at its wpm × 5 / 60 cps with variance; partial-block applies ×0.6 incoming damage if player progress > 0.5 when foe finishes. Mistype marks wrong, requires backspace, pushes wordStart back 120ms and cuts foe deadline by 80ms. Word pools keyed by length tier (s/m/l) scale with foe. Combat log with staggered entries, VICTORY/DEFEAT banner. Bricolage Grotesque + Space Mono typography, dark purple + blood-red + ice-blue palette.

## features
- 4 AI foe tiers with escalating WPM and word pools
- Speed-based damage scaling tied to real typing WPM
- Streak multiplier + crit chain
- Partial-block mechanic rewards fast progress even on lost words
- Mistype punishment (backspace required + deadline penalty)
- DOM-based rendering (no canvas) — lightweight and accessible

## issues
- No leaderboard yet
- Foe WPM is simulated via cps interval, not modeled as keystrokes — feels fine but not "fair" in a strict sense
- No mobile soft-keyboard focus handling yet; relies on physical keyboard

## todos
- Supabase leaderboard (best WPM + longest streak + foes defeated)
- Mobile hidden-input bridge for soft keyboard
- Power-ups / special words with bonus effects
- OG preview PNG
