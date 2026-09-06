# Glimwalk — notes

## log
- 2026-09-06 v1.0 — built per chat: "fictional AR quest prototype with money and relationship goals, opt-in safe zones, evidence-based safety prompts, and no celebrity or surveillance claims." Interpreted as a clearly-fictional simulated-AR toy: canvas "viewfinder" that is explicitly a drawing (no getUserMedia anywhere — probe-enforced by needle scan), a 1000m fictional street walked with buttons/arrow keys, AR-style markers within 60m, interact within 15m. Money track pays "glim" (stated worthless), bond track grows warmth with four invented NPCs (Mrs. Pemberwick, Ossie, Twig, Barnaby Crumb — deliberately nothing like real people). Goals: 40 glim + two friendships at 4+ warmth. Safe zones are OPT-IN per zone with a master "safe zones only" toggle that refuses to engage with zero zones opted (and self-disables if the last zone opts out); held-back quests say why. Safety prompts fire before the first quest and after every 3rd completion; each carries claim + NAMED source + year + evidence-strength label (measured/observational/guidance) + caution, no links — hornet-flight-lab honesty pattern, probe-asserted so later edits can't strip the honesty. "What this never does" card: no camera/mic, no location, no celebrities/real people, no surveillance/tracking claims, localStorage only. Engine is a pure `<script id="engine">` (node: ENGINE OK 41 — includes a full-playthrough check that the fixed quest set can actually reach both goals). Browser probe GLIM OK 30 at 1200/390/320. Fonts: Bricolage Grotesque + Sono, dusk-plum palette with amber HUD.

## issues
- Headless has no emoji font: zone glyphs (📚⛲🏮) render as tofu in screenshots but are aria-hidden decorations; quest glyphs were switched from ⬧/❖ to the universally-covered ◆/♥ for the same reason.

## todos
- Could add a tiny end-of-street vista reward at 1000m.
- A "new night" reset button (seam has reset(); UI button not exposed yet).
- More NPC dialog variety per warmth level.
