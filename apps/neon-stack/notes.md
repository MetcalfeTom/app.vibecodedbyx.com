# Neon Stack

## log
- 2026-03-29: V1 — Addictive stacking game. Moving blocks bounce side to side, tap/click to place. Misaligned parts slice off and fall with physics/rotation. Perfect placement (within 3px) keeps full width, consecutive perfects grow the block and trigger screen flash + particle burst. Speed increases with height. 8-color neon palette cycling through stack. Animated star background with parallax. WebAudio SFX (place, perfect, slice, game over). Screen shake on place/miss. Trail particles on moving block. Height markers every 5 blocks. Local best score in localStorage. Russo One + Share Tech Mono typography, dark space aesthetic.
- 2026-03-29: V2 — Added global leaderboard via Supabase. Save score with name after game over, top 10 display with gold/silver/bronze ranks. Name remembered in localStorage. Graceful fallback if table unavailable.

## features
- Tap/click/space to place blocks
- Blocks shrink when misaligned — sliced pieces fall with rotation
- Perfect placement (3px threshold) preserves width
- Consecutive perfects grow the block (+2px per perfect after 1st)
- Perfect combo counter with color escalation (yellow/cyan/magenta)
- Screen flash + particle burst on perfect
- Speed increases from 2.2 to max 9 px/frame
- 8-color neon palette cycling per block
- Animated starfield background with parallax
- WebAudio SFX for all actions
- Screen shake on placement and game over
- Trail particles behind moving block
- Height markers every 5 blocks
- Local best score (localStorage)
- Global leaderboard (Supabase neon_stack_scores table)
- Save score with player name, top 10 display
- Keyboard (space/enter) and touch support

## issues
- neon_stack_scores table needs to be created in Supabase (columns: id, score, display_name, user_id, created_at)
- Leaderboard shows "unavailable" gracefully until table exists

## todos
- Create neon_stack_scores table in Supabase
- Add sharing (screenshot/score card)
- Combo multiplier scoring (perfect streaks worth more)
- Sound toggle
- Ghost block preview showing where current block will land

## notes
- Perfect threshold: 3px — feels generous but rewarding
- Speed formula: min(2.2 + stack.length * 0.08, 9)
- Block grows by PERFECT_GROW (2px) per consecutive perfect after first, capped at W*0.5
- Supabase config copied from supabase-config-fixed.js pattern
- Module script handles auth + leaderboard, regular script handles game loop
- window._lbSave / window._lbLoad bridge between module and game scripts
