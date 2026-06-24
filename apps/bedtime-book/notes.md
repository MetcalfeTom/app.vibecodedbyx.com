# Bedtime Book — notes

## log
- 2026-06-24: Created (chat request: "bedtime story generator with name, animal, and mood — Frank, dog, silly as the demo, cozy night-time book with twinkling stars"). Self-contained, zero deps.
  - **Inputs**: name (text, default "Frank"), animal (9 chips, dog default), mood (chips). Moods lead with the chat-requested trio **silly / sleepy / creepy** then brave/curious/kind/dreamy. "creepy" is bedtime-safe gentle-spooky (friendly ghost named Boo, firefly nightlight) — NOT nightmare fuel.
  - **Story engine**: 5 gentle pages always ending in sleep. Mood-flavoured opener + middle adventure (per-mood ADVENTURES map) + random resolution + fixed goodnight close. PLACES/PROPS/friend pools randomized via pick(). Fresh story each "tell another story".
  - **Twinkling stars**: full-viewport canvas star sky (density ~ area/9000), per-star sine twinkle + sparkle-cross on bright ones, rare shooting star. Plus per-illustration CSS .il-star twinkles + drifting cloud seeded on start.
  - **Illustration**: night-gradient scene per page — moon, hills, big animal emoji (bob anim; switches to snooze + Zzz on the final sleep page), rotating prop emoji. Cozy book page = warm paper gradient, Fraunces serif story text, Caveat page numbers.
  - **Nav**: ← back / turn → buttons + dot indicators + arrow-key page turn. Last page hides "turn", shows "tell another story" (returns to setup).
  - WCAG: rem units, role=radiogroup chips with aria-checked, aria-live story text, focus-visible, prefers-reduced-motion kill-switch, 2.75rem targets, hidden canvas aria-hidden.

## issues
- (none yet)

## todos
- Optional: soft Web Audio lullaby / page-turn sound (muted by default).
- Optional: more animals, save-a-story, read-aloud via SpeechSynthesis.
