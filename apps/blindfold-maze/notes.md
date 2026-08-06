# blindfold-maze

## log
- 2026-08-06: v1 per chat ("can we build an audio-only maze game in the browser?" — yes). **Audio-only maze: navigate a maze you cannot see using 3D positional sound.** Single-file ~28KB, no backend.
  - **Pure logic block** (`[PURE-BEGIN]`/`[PURE-END]` markers): mulberry32 PRNG, iterative recursive-backtracker `genMaze(cols,rows,rng)` (cells with n/e/s/w wall flags), `canMove`/`attemptMove`/`distToWall`/`bfsReachable`. Node harness: 16 checks green (connectivity at all 5 level sizes, seed determinism, wall symmetry, sealed perimeter, blocked/allowed movement, distToWall vs walk, perfect-maze n-1 passage count).
  - **3D audio**: `PannerNode` HRTF + exponential distance model for the exit beacon (2-note triangle chirp every 1.5s, positioned at exit cell); `AudioContext.listener` position/orientation updated on every move/turn (modern `positionX.value` API with `setPosition` fallback). World coords: x=col, z=row, facing vectors from DR/DC.
  - **Sonar ping** (space/tap): 1.9kHz blip, then one echo per relative direction (ahead centred, left −0.85 pan, right +0.85). Echo delay `0.11 + d*0.13s`, gain `0.4*0.68^d` (wall-adjacent d=0 → strong 0.5 at 110ms), pitch and lowpass darken with distance. d = open cells until wall.
  - **Other sounds**: footstep (lowpass noise burst, random pitch), wall thud (85Hz sine + noise), turn swish (bandpass noise panned toward turn), win arpeggio, faint brown-noise room tone so silence never goes fully dead.
  - **Spectator ripples**: fullscreen canvas draws expanding rings per sound event (step grey / bump red / ping+echo cyan / beacon gold, panned to match audio; beacon ring alpha falls with distance). Deliberately reveals nothing of the layout — makes the game watchable on stream. prefers-reduced-motion → static fading rings.
  - **Flow**: levels 6×6 → +2 per level, cap 16×16. Start (0,0) facing east, exit far corner. Win → reveal-map canvas (walls + your path polyline + start/exit dots) + steps/pings/time stats → next level. Seed = f(level) so everyone gets the same maze per level. Best level in localStorage.
  - **Controls**: ↑/W forward, ←/→ turn, ↓/S turn around, Space ping, C captions, M mute, R restart, H via ? button. Touch: swipe up/left/right/down + tap = ping + 4-button pad (shown on coarse pointer).
  - **A11y**: captions on by default (aria-live status pill, 2.6s auto-clear) + always-on sr-only announcer; turning announces facing, ping announces distances ("echo — ahead 3 · left wall · right 1") — the game is fully playable by blind players, which is kind of the point. Semantic main/dialog/status roles, aria-pressed toggles, focus-visible, 2.75rem targets, rem everywhere.
  - **Aesthetic**: near-black void, Italiana wordmark breathing at 7s, IBM Plex Mono UI, gold/cyan/red accent language.

## issues
- HRTF front/back disambiguation is weak with cheap earbuds (classic binaural limitation) — players resolve it by turning, which is intended, but a first-time hint may help.
- Keyboard input is gated only on the start overlay; after winning, movement keys are dead because `G.playing=false` (correct) but C/M still work (also correct). Escape only closes help overlay.
- iOS requires the start-button gesture to unlock audio — covered ("put on the blindfold" button inits AudioContext).

## todos
- A "thing in the maze" that hunts you by your footstep sounds (chat will love/hate this)
- Daily maze (seed from date) + Supabase leaderboard on time/steps
- Doppler / footstep reverb scaled by corridor length ahead for richer spatial feel
- First-person "breath" that quickens near the beacon as a soft hot/cold channel
