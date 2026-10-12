# Sloppy's Factory (apps/sloppys-factory) — notes

Idea by **iamflax (Flax)**, 2026-10-12 20:02 UTC ("Sloppy's Mind", renamed Sloppy's Factory at 20:28): an educational tool + game that shows how an AI coding agent goes from a chat message to a live app. The page carries an "idea by Flax" credit line; the app belongs to the whole chat.

## What it may and may never show
- Public level only: the tools (Claude Code, sandbox + permission mode + safety check, git, headless Chromium, ImageMagick, single-file HTML/CSS/JS, three.js, Web Audio, static hosting, notes files + a memory folder), the order of the steps, and replays built from commit messages + app notes.md files. Short viewer quotes that were in commits/notes are fine with their names.
- NEVER: system prompts, operator/producer notes, configs, keys, setup file paths, raw transcripts, the stream's control machinery, or any idea that the voice and the coder are separate (Sloppy is ONE personality). "Prompts" = the viewer's chat message + Sloppy's own plain-words plan.

## Art direction
- A FACTORY, not a museum (Flax). Cross-section of a factory floor at night: deep bottle-green wall #17241f with panel seams and two warm lamp glows, riveted cream machine plates (#e6dcc3 → #d6caac) with a hazard stripe, safety yellow #f5c518, rust #c2411a number plates, ticket paper #f3ebd7 with ruled lines.
- Fonts: Big Shoulders Display 900 (signage), Atkinson Hyperlegible (body, accessibility), Martian Mono (labels/tickets).
- Station art = inline SVG strings in ART (viewBox 0 0 120 84), flat colours, 2px ink outlines.
- Load motion: transform-only rise/drop (no opacity:0 start; the site's preview shot is taken at load).

## How it works (index.html, one IIFE, no globals)
- ST = the 8 stations (id, name, tag, tool, why). Tiles are buttons that flip in place (aria-pressed, the hidden face gets aria-hidden, a polite live region reads the tech).
- layout(): picks 4 / 2 / 1 columns from the floor width (760 / 500), places tiles serpentine (odd rows right-to-left), then draws the belt as one SVG polyline through anchor points under each row (1 column: a lane on the left). anchorAt[i] = index of station i's point; the crate rides the polyline (rAF, eased); going backwards = lift off + drop in.
- REPLAYS = [{id,name,who,date,span,app,steps:[{t,s:stationId,who,q,p,stamp,live,bad,c}]}]. Ticket on the right ≥1180px, under the floor below that; phones (<700px) dock it as a sticky bottom bar while a replay runs (body.docked, ✕ closes).
- LOOP = the "quality without questions" eight habits with a real example each.

## log
- v1 2026-10-12 23:15 UTC: factory floor with 8 flip-card stations, belt + crate, the Sakurahime replay (25 steps, 22:10-23:00), the quality-without-questions loop, the sandbox floor rule. Tested headless 1280x720, 390x844 (docked replay), 1200x630 (og.png = that shot).

- v1.1 2026-10-12 23:25 UTC: the reject bin (REJ, sorted newest first: house inside the mountain, two castles, vanishing tree, flickering planks, roller-coaster camera, blank realm; what happened / why / the rule it taught + tags) and the SAFETY "days since the last accident" sign in the nav (counts whole days from the newest REJ.when; click = jump to that card). Replay steps with bad:'<rej id>' show a FACEPLANT button that jumps to the card, and the crate does a tumble (.fail) when it arrives.

## issues
- (none reported yet)

## todos
"you're the AI" game; 📖 reading mode + guide.md + build-your-own-AI-streamer blueprint; Mike's stone + lab camera replays; sound; LIVE crate from now.json.
