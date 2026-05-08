# neon-blackjack

## log
- 2026-05-08: shipped — single-deck blackjack with chip betting + Vegas "stand on all 17" dealer for **latino_supreme_** (chat ask: "create a neon-blackjack app with betting mechanics and a dealer AI" — clarified down to standard Vegas rules during the bundled requests).
  - **Game rules**: 1 fresh shuffled 52-card deck per hand (no shoe persistence — keeps each hand independent and avoids card-counting telemetry), 2 cards each at the deal, dealer's 2nd card hidden until player stands, dealer hits on 16 or below and stands on all 17 (S17 — the more player-friendly variant; H17 not implemented), blackjack pays 3:2, no splits / no insurance / no surrender (V1 keeps the surface tight).
  - **Betting**: 4 chip denominations (1 white, 5 red, 25 green, 100 black-with-gold-rim) clickable to stack onto the betting circle; "clr" rose-dashed chip refunds the pending bet to the bankroll. Bankroll starts at 500, persists in `localStorage['neon-blackjack-v1']` `{bank, wins, losses, muted}`. Reset button at the footer prompts confirmation and restores 500. If bankroll hits 0, the banner surfaces "bankroll empty · reset to play again" — no auto-rescue.
  - **Hand value**: `handTotal(hand)` counts every Ace as 11 first then demotes to 1 as needed to avoid bust; `isSoft(hand)` flags hands with at least one Ace still counted as 11 (cyan total tile when soft, gold when blackjack, rose when bust). Player auto-stands at 21 so the user doesn't have to click STAND on a guaranteed 21. Double down available on first two cards only and only when bankroll covers a second matching bet — takes exactly one card and immediately stands.
  - **Settlement**: 6 outcome paths each with their own banner colour + audio cue + bankroll math: `blackjack` (player 21 from 2 cards, no dealer BJ) pays bet + 1.5× bet (3:2) with a 7-note ascending C-major fanfare; `win` (player higher non-bust) pays 2× bet (1:1); `dealerBust` same payout; `push` (equal totals) returns just the bet with a sine bell ping; `bust` / `lose` / `dealerBJ` forfeit the bet with a 3-note descending sawtooth. Dealer-blackjack on the deal vs player-blackjack triggers an immediate push.
  - **Card visuals**: HTML divs styled as 5×7rem cream cards with red `♥/♦` and ink `♠/♣`, big centred suit pip + small rank/suit corners (top-left + bottom-right rotated 180°). Card backs are blue gradient with diagonal cyan/pink stripe pattern + a centred "21" in Press Start 2P + gold border + gold glow. `dealIn` keyframe slides each card in from the upper-right rotated -22° + fades in over 0.35s. `flipReveal` keyframe rotates the dealer's hidden card around its Y-axis for the reveal moment when the player stands. `prefers-reduced-motion: reduce` no-ops both animations.
  - **Aesthetic**: deep felt-green table (`#0d3a23` → `#082615` radial), gold border with double-shadow + inset glow, Press Start 2P table-marker reading `★ DEALER MUST DRAW TO 16 AND STAND ON 17 ★` + `blackjack pays 3:2 · insurance not offered`. Bricolage Grotesque title with cyan/gold/pink layered shadow, Newsreader italic tagline. HUD strip top of page: `bank · 500` (gold), `bet · 25` (cyan), `w/l · 3/2` (lime), audio toggle. Banner above the player seat shows the current state — "place a bet to begin", "your move · hit · stand · double", or the result line.
  - **Audio**: 7 Web Audio synths (`sndChip` 720Hz square blip with random ±80Hz, `sndDeal` bandpass-noise burst, `sndFlip` noise + 280Hz triangle for the reveal, `sndWin` 4-note triangle arpeggio C5-E5-G5-C6, `sndBlackjack` 7-note ascending C-major fanfare to E6, `sndLose` 3-note descending sawtooth, `sndPush` single 440Hz sine), lazy-init on first user gesture, master gain swappable to 0 by the `♪ on/off` mute pill (state persisted). `prefers-reduced-motion: reduce` doesn't kill audio (it's not motion).
  - **Keyboard**: H hit, S stand, D double, Space/Enter deal, M mute, C clear bet, 1/5/2/0 add chips of 1/5/25/100 (digit keys map to denominations). Suppressed when focus is in a text field.
  - **Accessibility**: rem units, `<header role=banner>`, semantic `<section>` per table region, `aria-live="polite"` on the banner, `aria-label` on every chip + button, `aria-pressed` on the mute toggle, `aria-hidden` on the betting-circle (decorative — value is in the HUD bet pill), focus-visible cyan/gold outlines, ≥2.8rem touch targets on every action button + 3rem on chips, skip link.

## issues
- Single-deck shoe shuffled fresh every hand means card-counting strategies can't work — but it also means the player can't track removed cards across hands. That's intentional for a casual web blackjack; a longer shoe would feel more "real Vegas" but adds bookkeeping complexity that V1 can ship without.
- No splits — pairs of equal rank can't be split into two hands. Adding it requires a parallel hand state, dual betting circles, and per-hand action focus. Reasonable V2 scope.
- No insurance prompt when dealer shows an Ace up. Some players want it; the rule is ~-1.5%-EV side bet so omitting it is mostly a kindness anyway.
- Dealer plays soft 17 as stand (S17). Hardcoded — would need a setting toggle for the H17 variant.
- Bankroll resets to exactly 500 — no "buy in with X" sliding picker.

## todos
- Splits on equal-rank pairs (per-hand action loop + dual betting circles).
- Insurance side bet on dealer-Ace up.
- H17 toggle in a tiny settings popover.
- Hand history strip at the bottom (last 8 hands with W/L/P + bet + outcome).
- Side-by-side multi-hand play (two seats, one player).
- "Buy more chips" interaction — slider for re-buying when bust instead of fixed-500 reset.
- Streak bonuses / achievements for visual reward (e.g. "3 in a row · STREAK +50").
- Optional Pollinations-portrait dealer that reacts on win/loss.
