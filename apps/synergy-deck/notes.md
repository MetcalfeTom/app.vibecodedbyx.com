# synergy-deck · notes

## log
- 2026-05-18: v1 — **SynergyPoint · cursed corporate quarterly review** per chat ask. Self-contained ~38KB single file. Pre-loaded with 12 slides + the "add blank slide" button that procedurally appends more.
  - **PowerPoint shell** · red titlebar (`#c3401e → #b03a1f` gradient, "P" logo chip), full Ribbon with 10 tabs (File / Home / Insert · ACTIVE / Design / Transitions / Animations / Slide Show / Review / View / ✦ Copilot), ribbon-group buttons (Table / Pictures / Shapes / Icons / WordArt / Chart / Cube / Dissolve / Blinds / Curl / Present), workspace grid (thumbnail sidebar | canvas | notes), orange status bar with slide N/M + "Brad is also editing" + Present button.
  - **Cursed deck (12 pre-loaded slides)**:
    1. **COVER** · 3-tone WordArt "Q4 SYNERGY VELOCITY DEEP-DIVE" in `Impact` with rainbow gradient `-webkit-background-clip:text` + 3px black stroke + 6px drop shadow on green→blue→red gradient bg. Lobster subtitle "'let's circle back' — every Tuesday at 11am". Bottom: "Prepared by: Brad H · Last edited by: Brad H · Reviewed by: Brad H".
    2. **AGENDA** · Impact orange title with white shadow, 8 Comic Neue bullets each with its own emoji marker (✦ ★ ➜ ✓ ◆ ✿ ▶ ☢). Items include "Welcome & introductions (15 min)", "Reading of last quarter's action items (no follow-up)", "Q&A (time permitting, it never permits)".
    3. **MISSION** · purple→orange gradient, mixed-fonts "leverage … synergies … unlock VALUE … customer obsession" with wavy-underline + highlight backgrounds + Caveat italic injection. Footer: "— adapted from the previous 11 mission statements".
    4. **KEY METRICS** · the centerpiece pie chart with conic-gradient slices that add up to **127%** with caption "Total: 127% (within margin of error)". Legend in Comic Neue. Footnote: "Note: percentages are rounded. **Aggressively.**"
    5. **TEAM STRUCTURE (post re-org)** · org chart where every senior box is "Brad H." (VP of Things / Synergy Lead / Velocity Lead / Stakeholders). Bottom row: "You · Reports to all of the above", "Vacant · reposted 14 times", "Karen · has 47 slides", "Intern · no email yet".
    6. **PROJECT TIMELINE · Q4** · 5 overlapping bars (Project ABACUS phase 1 delayed, phase 1 (also), phase 0.5, "Quick win · ongoing since 2019", "Brad's calendar" spanning the entire timeline in amber). Quarter axis below.
    7. **SWOT** · 4-quadrant Impact-headed grid. Threats: "Competitor has fewer Brads", "Marcipopsis is asking questions", "The intern *does* get onboarded".
    8. **BUDGET BREAKDOWN** · Comic Neue table with hard-bordered cells. Off-sites +86%, Consultants (Brad) +143%, Software licences (unused) flat, **Actual product work −14.3% (£14 → £12)**. Total +91%. Source: "Brad's spreadsheet (no formulas, all hard-coded)".
    9. **TEAM-BUILDING HIGHLIGHTS** · 4-emoji grid rotated at slight angles: 🚣 "river day · 4 lost paddles", 🪓 "axe-throwing · 1 incident report", 🍷 "painting + wine · Karen cried", 🎤 "karaoke · Brad sang Numb (twice)". Footer: "net team cohesion impact: complicated".
    10. **ACTION ITEMS** · 6 nested bullets including "Schedule a sync to discuss the syncs (45 min, weekly)", "Form a working group for the working group (co-chairs: Brad & Brad)", "Send a follow-up email titled 'as discussed' (nothing was)".
    11. **Q & A** · massive 220px ❓ + Impact "Q & A" + Caveat note "(time permitting · it does not permit · we are 24 minutes over)".
    12. **THANK YOU!** · animated 18s rainbow gradient bg, 160px WordArt Impact with rainbow text-clip + black stroke, 4 emoji confetti pieces 🎉🎊🕺💃, footer "slides will be circulated by EOD (Friday · of some week)".
  - **Comic Sans coverage** — answer to "does it have enough comic sans yet?" — body bullets, all org-chart boxes, table cells, mission body, agenda, action items, timeline bars, SWOT bullets, team-building captions all use **Comic Neue** (the project's chosen Comic-Sans-alike), with `'Comic Sans MS'` listed as fallback. Display titles use **Impact** with rainbow WordArt gradient + black outline. Subtitles use **Caveat** + **Lobster** + **Permanent Marker** for that "13 different fonts on every slide" cursed aesthetic.
  - **Confidential watermark** · "CONFIDENTIAL — INTERNAL — NOT FOR DISTRIBUTION" diagonal Impact pseudo-element baked into every `.slide`.
  - **Sidebar thumbnails** · 16:9 mini-cards with the slide's gradient bg + Comic Neue title + corner emoji. Active thumb gets a 2px orange ring.
  - **Notes pane** · presenter notes per slide ("If anyone asks about Q3 — REDIRECT", "If anyone notes the percentages add up to 127%, say 'that's the OVER-DELIVERY' and move on", "Skip if any of the following are present: legal, finance, the person who actually owns the project").
  - **Present mode** · F5 or click the orange Present button → fullscreen black overlay with the current slide. Click anywhere or → for next, Esc to exit.
  - **"AutoSave is OFF · Brad will overwrite your changes" toast** · pops every 28s ±jitter + on most slide changes. Includes the "(Save? You don't have permission.)" parenthetical.
  - **Add Blank Slide** · ➕ in the sidebar or ribbon. Each new slide picks a random gradient variant + a random title from `['PLACEHOLDER · do not delete', 'TO BE COVERED VERBALLY', 'this slide intentionally left blank', 'BRAD WILL FILL THIS IN', 'APPENDIX A · additional appendix']` with sub "(no really · do not delete)".
  - **Keyboard** · ← / → / Space to navigate, F5 present, Esc exit.
  - **Window controls** · cosmetic — / □ / ✕ (the ✕ hovers Outlook-red but does nothing per Microsoft tradition).
  - **WCAG** · `aria-live="polite"` on the slide, `role="dialog" aria-modal="true"` on present mode, semantic main/aside/article, focus-visible accents, prefers-reduced-motion kills the rainbow bg animation + slide-in keyframe.
  - **OG image** · Pollinations flux (no `referrer` per project notes).

## issues
- Real low-res 90s clip-art would need actual raster images (not emoji). Emoji read as 'modern flat icons' rather than the classic Microsoft Office clip-art look. Acceptable tradeoff to keep the app self-contained.
- The mobile breakpoint at 720px reflows the workspace and hides the ribbon-actions row — the ribbon tabs are too dense to be usable at phone width.
- Add-Blank-Slide gives the deck unbounded growth (no cap). The pre-loaded 12 are the curated core.
- The "Brad is also editing" indicator is decorative — no actual multiplayer.

## todos
- More cursed pre-loaded slides: "Stack Ranking", "RACI matrix that contradicts itself", "Hourly off-site itinerary 9am-9pm"
- Co-author live-cursor: another fake user named Karen periodically scrolls past with a label
- Theme picker that's actually just 3 different cursed gradient sets
- "Insert chart" button that injects a 127%-pie variant onto the current slide
- Export → cursed PNG of the current slide via canvas
- Pollinations LLM hook to generate a fresh cursed slide from a prompt
- Karaoke easter egg on slide 9 that plays a 4-note "I'll Be Missing You" arpeggio when clicked
