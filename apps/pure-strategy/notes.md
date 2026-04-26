# Pure Strategy

## log
- 2026-04-26: Carryover + grandmaster AI. Tied rounds no longer split — the contested pot (`prize + carry`) rolls forward to the next round. `state.carryover` accumulates through consecutive ties; reveal banner reads `tie — N pts carry`. Pot indicator `+N carry · pot M` pulses next to the prize label whenever carryover > 0. Last-round ties dissolve the pot (no future round to feed). Ledger shows pot column with `(+carriedIn)` annotation, outcome column reads YOU/THEM/CARRY, flow column shows `→ +N` for ties. **Grandmaster AI** rebuilt: scores each candidate card with `pWin*pot + pTie*tieRollEV - cost`, where `pWin` comes from a logistic approximation of a Gaussian over the *predicted human card*. Predicted card is a regression `bid = scale*pot + offset` learned from history (clamped scale ∈ [0.2, 1.8], offset ∈ [-3, 4]); residual std becomes the spread for the win-prob calc. Carryover is fed into the regressor input so the AI knows fat pots will draw aggressive bids. Extra heuristics: aggression boost when behind, +1-above-predicted bonus, penalty for over-bidding small pots, slight noise to avoid telegraphing. Endgame solver activates with ≤2 prizes left — brute-force minimax pairing including tie carryover propagation.
- 2026-04-26: Created. **GOPS / Goofspiel** — 13-card sealed-bid duel. Both players hold 1–13 (A/2…/J/Q/K), 13 prizes shuffled, each round both bid one card secretly, higher card claims pot. **5 AI modes**: random / match-the-prize / prize+1 / proportional (inverse-distance weighted) / adaptive grandmaster. **Aesthetic**: art-deco card duel on green felt with gold border frame, ❦ ornament dividers, scanline + crosshatch overlay. Palette: bg `#0a1f24/#051418`, felt `#0f3038/#143845`, gold `#d4a754`, ivory `#f3ead2`, you (steel cyan) `#5fc0e0`, them (burnt rose) `#d8543a`, prize gold, tie violet `#9c89b8`. Fonts: Bodoni Moda italic (brand/numerals), Cinzel (small-caps labels), Cormorant Garamond serif (body), IBM Plex Mono (ledger/meta). Layout: score row → arena (3 card play row) → hand → ledger → controls → final overlay.

## issues
- Tie on the final round dissolves the pot (no future round to roll into). Could alternatively split or award by remaining-card-sum tiebreak. Currently dissolves with `pot lost` verdict.
- Endgame minimax assumes the human plays optimally — against weaker humans the AI may sandbag a card it could safely win.

## todos
- Show predicted-bid HUD (debug toggle) so player can see what AI thinks they'll play.
- Add "best 2 of 3" match mode.
- Sound: subtle card-snap on play, chime on win, low knock on loss.
- Cards-remaining indicator showing both hands as 13-cell strip with played cards crossed out.

## design
- Card visuals: 96×140 (60×88 in hand) ivory with corner pips + huge centered glyph. Suit-tinted by owner: prize=gold, you=steel-blue, them=burnt-rose. Face-down = diagonal hatch + central ❖.
- Pot tag: violet pill that pulses when carryover > 0, beside the `prize · ◆` label.
- Slot states: `.win` = gold ring + lift, `.lose` = 0.55 opacity, `.tie` = violet ring.

## code-shape
- Single file, ~880 lines.
- `state` = {youHand, themHand, prizeDeck, currentPrize, youScore, themScore, round, pickedYou, pickedThem, history, aiMode, locked, carryover, carriedRounds}.
- `currentPot()` = `currentPrize + carryover`.
- `aiPick()` switches on `state.aiMode`.
- `grandmasterPick(hand, prize, pot)` — main complex AI; uses `humanProfile()`, `winProbability()`, `tieProbability()`, `solveEndgame()`.
- `humanProfile()` — linear regression on `(pot, humanBid)` history, returns `{scale, offset, spread, n}`.
- `solveEndgame(themHand, youHand, prizes, currentPotValue, carry)` — 2-card brute-force minimax with tie-carry propagation.
- `revealRound()` — face-down → flip → win/tie/lose branching → carryover update → next round queue.
- `render()` — score, pot tag, hand grid, ledger.
