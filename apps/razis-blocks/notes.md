# Razis Blocks — notes

iamflax's pitch (2026-10-12): "a cyberpunk version of the game tetris with special boosters like candy crush, game is called razis blocks. Playable on mobile with music."
Credit line "idea by Flax" on the title card. Never use Tetris branding or music; the 4-line clear is called "RAZIS!".

## log
- v1 (2026-10-12): core falling-block game. 10x20 well + 2 hidden rows, 7-bag, SRS rotation + wall kicks (I and JLSTZ tables), hold, 3-piece next queue, ghost, soft/hard drop, 0.5 s lock delay with 15 move resets, DAS 160 ms / ARR 45 ms. Touch: drag sideways = move (one column per 0.85 cell of drag), drag down = soft drop, tap = rotate, flick down = hard drop, swipe up = hold, HOLD button. Keys: arrows/WASD, Z/Ctrl rotate back, Space drop, C/Shift hold, P/Esc pause. Score: 100/300/500/800 x level, combo multiplier 1 + 0.5 x (combo-1), back-to-back 4-line x1.5. Level every 10 lines, gravity 0.85 s x 0.82^(level-1), floor 0.04 s. Rainy neon city background (3 building layers, katakana signs that flicker, rain), glitch slices + magenta flash on clears, particles, shake, hard-drop trail, lock flash. Run-over card with best (localStorage razis-best).

- v2 (2026-10-12 ~23:35): boosters + Flax's controls report.
  - Charged blocks: each clear of 2+ rows marks (rows-1) random stack blocks charged (max 5 on the board; empty board = the next piece carries one). A charged block in a cleared row (or caught in a blast / bomb / laser) blasts 3x3; charges inside a blast chain. Blasted columns then fall (column gravity) and any new full rows clear as CHAIN xN (score x chain).
  - 4-row clear puts a COLOR BOMB (single orb piece) at the front of the queue: it wipes every block of the colour it lands on (floor/prism = most common colour), then all columns fall + cascade. Cells of the target colour pulse while the bomb falls.
  - Energy (0-100) from clears/combos/chains/booms. LASER (Q, costs 40) burns the tallest column, the current piece freezes and resumes after. OVERDRIVE (E, needs 100) = 10 s slow-mo gravity x3 slower, double booster/line points, rain slows, acid border + scanlines.
  - Rainbow piece every 18-27 pieces (first after 10-15): locks as prism cells (colour 8) and pours into up to 8 holes (covered gaps first, then gaps in the fullest rows).
  - Flax 23:21 "hold button does not bring the blocks down": HOLD worked under real CDP touch (it stashes), Flax expected a drop. Added: ⬇ SOFT button (press and hold), ⤓ DROP button (touch devices only, body.touch), finger resting 260 ms on the board below the piece = soft drop (stops at the next spawn), "stash" label under HOLD, shake when hold is already used this turn. Game buttons fire on pointerdown. Flick velocity now measured up to the last move (CDP flick at 0.8 px/ms was missed before).

- v3 (2026-10-12 ~23:50): music + sound.
  - Original synthwave loop in A minor (i-VI-III-VII), all Web Audio oscillators/noise, lookahead scheduler (25 ms tick, 120 ms ahead, 64-step loop). Title: soft pad + triangle + sparse arp at 92 bpm. Playing: kick, saw bass with filter pluck, hats; level 3+ adds snare + 16th hats; level 5+ open hats + a lead hook. Tempo 104 bpm + 4 per level (cap 144); overdrive = 3/4 tempo + lowpass 1200 Hz; pause = quiet + lowpass 600 Hz.
  - Big clears/bomb/laser/game over duck the music. SFX: move, rotate, hold, lock, hard drop, clear (pitch climbs with combo), RAZIS sweep, blast, charge zap, bomb sparkle, colour wipe, laser, overdrive on/off, rainbow pour, level up, nope, game over. Chain: master -> compressor -> limiter (-4 dB, 20:1).
  - Starts on the first pointerdown/key/tap (browser rule); suspends when the tab is hidden. ♪ SOUND ON/OFF button on the title, pause and run-over cards + M key; remembered in localStorage razis-mute.
  - Juice: score punch (scale + acid flash) on clears, acid flash on level up (both off with reduced motion).
  - Tested headless with real CDP taps + an AnalyserNode: context runs after the first tap, every SFX fires without errors, music peak ~0.4, pause/mute/resume restore gain + filter. Not heard by a human yet.
- v4 (2026-10-13 ~00:10 UTC): How to play popup (Flax 23:50: controls fine now, asked for help on the features) + polish.
  - ? HOW TO PLAY button on the start card and in the pause menu opens #help: goal, PHONE + KEYBOARD controls (phone first on touch devices, keyboard first otherwise), a card per feature with a swatch drawn like the game (charged bolt tile, bomb orb, laser beam, overdrive », rainbow frame, music EQ bars, sound ♪). Closes on ✕, Esc, tap on the backdrop; GOT IT button. Game keys are ignored while it is open.
  - First visit: the first PLAY press opens it once (button reads GOT IT, PLAY and starts the run); localStorage razis-help (store helper = try/catch). Not shown at page load, so the auto preview and og still show the title card.
  - Run-over card: booster tally line (blasts, bombs, lasers, overdrives, rainbows) or a tip if none; ⧉ COPY SCORE copies a plain text line (no link) and falls back to a selectable textarea when the clipboard is blocked (headless shows the fallback).
  - Fixed since v1: .card p outranked .big/.newbest, so the run-over score was drawn small and grey.
  - Title: dropped the one-line controls text (now in the popup); boosters legend stays.
  - Tests: rz5.js (open on first PLAY, backdrop/Esc/✕ close, pause path, keys ignored), tt5.json real touch scroll inside the popup reaches the bottom (#ui has touch-action:none, .hcard sets pan-y), shots at 390x844 (top + scrolled) and 1280x800; rz2 bots unchanged, 0 errors. rz4.js = forced top-out run-over card.

- v5 (2026-10-13 09:44 UTC): ONLINE LEADERBOARD (Flax, chat 09:27: "razi needs a leaderboard").
  - Supabase table `razis_scores` (id bigserial, name text, score int, lines int, level int + auto user_id/created_at/updated_at; default RLS: everyone reads, you write only your own rows; indexes score, user_id). Stored per row: the display name, score, lines, level. Nothing else.
  - Loading: dynamic import of the app's own copy `/razis-blocks/supabase-config-fixed.js` (same file as bracket-link/black-hole-billiards, never edit or print it), falling back to `/supabase-config.js`; default client or supabaseSession().client; 15 s timeouts; a failed load is retried next time (lbMod/lbSess/lbClient, same pattern as bracket-link v2.0).
  - Game over (gameOver -> lbGameOver, wrapped in try/catch): score > 0 is capped (lbCap: whole number, <= 5000 + lines x 200000, <= 99,999,999) and inserted only when it beats your own best since Monday 00:00 UTC (keeps the table small). Then the run-over card shows the board inline: ALL TIME / THIS WEEK tabs, top 10 = best row per player (ties to the earlier run), your row highlighted in acid yellow, your rank with a ⋯ row when you are below 10, a status line (posted + ranks / your weekly best is higher / offline + RETRY).
  - Names: Twitch users show their Twitch name (user_metadata preferred_username, max 25). Anonymous players post as RUNNER-xxx (first 3 chars of the user id) and get a name box on the run-over card until they pick one (max 16, control/zero-width/<> stripped, localStorage `razis-name`); ✎ NAME renames later and updates their own rows. Names are only ever rendered with textContent.
  - Reads are checked too (lbOk: integers, score within lbCap, level == floor(lines/10)+1, non-empty name), so junk rows are skipped.
  - 🏆 TOP 10 button next to BEST on the title card opens #lbov (same panel moved between #lbSlot and #lbHome); ✕ / Esc / backdrop close; game keys ignored while it is open or while typing in the name box.
  - Run-over card now scrolls (max-height 100%) with a sticky AGAIN button, so AGAIN stays on screen on short phones. Fixed: the COPY SCORE fallback textarea was always visible (.shtx display:block beat [hidden]).
  - Tests (fake supabase module, *.supabase.co + jsdelivr blackholed, no real writes): insert payload, weekly-best skip, cap (5e9 at 3 lines -> 605000), score 0 posts nothing, offline + RETRY, module missing, Twitch name, rename + cleaning, HTML name renders as text, junk rows filtered, week tab, keys still move/drop/pause, 0 page errors. Shots 390x844, 375x667, 1280x800.

- v5.1 (2026-10-13 10:02 UTC): name box fix. Flax 09:56 (Galaxy S24): "i cant write on galaxy s24 a name". Reproduced at 384x740 inside a copy of the top-bar iframe: the box sat at the bottom of the run-over card, under the sticky AGAIN and below the card's fold (tap hit nothing), and it came prefilled with RUNNER-xxx + maxlength 16, so only 6 more letters fit. Now: status line, name row and name box come first in the panel (box on screen without scrolling), the box starts empty with your current name as the placeholder (✎ NAME the same), maxlength 24 (saved name still cut to 16) so keyboard composition has room, and the box scrolls itself into view on focus and when the keyboard resizes the page (lbKeep). Android-style typing (keyCode 229 'Unidentified' + insertText) checked: nothing prevented, the game keys stay off while typing, Enter and SAVE both save, controls (tap AGAIN, drag, keys) unchanged.

## issues
- Name box on phones: keep it near the top of the run-over card and empty (placeholder), never under the sticky AGAIN; test inside the top-bar iframe at ~384x740 (gaunt/sw/hm43/razi/bar.html + k2.json).
- Leaderboard scores come from the browser, so they can be faked (and players can update their own rows). Accepted for a client-side game: the client caps scores and skips implausible rows on read, nothing more.
- Flax read HOLD as "hold to drop": keep the stash label + the SOFT/DROP buttons.

## todos
- leaderboard: not yet seen with a real insert, a real Twitch session or on a real phone. Ask Flax how the board feels and whether he wants a daily board or a name shown on the title.
- difficulty: gravity 0.85 s x 0.82^(level-1), floor 0.04 s at level 16; gentler than guideline at 10+. Ask Flax if late levels feel too easy/hard.
- refresh og.png with boosters on the board (still the v1 shot)
- real phone: hear the music on iPhone (silent switch mutes Web Audio), check the popup scroll

## art direction
- Night city in rain: deep indigo sky, magenta halo, cyan accents, acid-yellow for numbers/buttons. Blocks are dark glass tiles with a bright neon border, glow baked into sprites (buildSprites) so the frame stays cheap.
- Fonts: Tektur 900 (title, callouts), Martian Mono (HUD/UI, 100/400/800), DotGothic16 (katakana signs). No Orbitron/Space Grotesk.
- No opacity-0 load fades (the auto preview shoots at load). The title card sits over a demo stack so the preview shows the game.

## testing
- Scratch: $SP/razis (index.html is the source; build_test.py injects window.__RB + a freeze flag into gaunt/sw/hm43/razis/t.html). Live page has only a `/*@@HOOK@@*/` comment.
- Touch: razis/touchrun.sh <page> 390,844 <steps.json> [shot.png] drives real CDP touch events (cdptouch.py: tap/hold/drag/eval). tt3.json = hold/soft/drop/board-hold/tap/drag/flick check.
- Audio: tt4.json (touchrun) with an analyser tap added to the test copy (window.__AUD); first tap must not hit the SOUND button.
- Probe hm/rz2.js: unit tests (blast chain, bomb, laser, rainbow, overdrive) + bots with boosters. hm/rz1.js: greedy bot plays 2x400 pieces + a random bot tops out, then touch (tap/drag/flick/swipe) and key tests. v1: 0 errors, 158 lines per 400 pieces, game over works.
- Leaderboard: $SP/razi (patch.py + lb.js applied to a fresh copy, build.py makes gaunt/sw/hm43/razi/t.html with ./fakedb.js in place of the config, t2.html with no module). run.sh <page> <WxH> <steps.json> [shot] on ports 8931/9391. Probes t1 (main), t3 (rename), t4 (no module), t8 (keys); shots t5/t6/t7.
