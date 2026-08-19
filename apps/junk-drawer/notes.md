# Junk Drawer — the organizing puzzle

## log
- 2026-08-19: v1.0 — built per chat. Three drawers (hallway/kitchen/deep, 12 items each with personality: "key to a former home", "pen, lies about working", "pager?? whose???"), 4 labeled trays per drawer. DUAL INPUT, both first-class: HTML5 drag-and-drop (draggable items, dragover highlight, drop) AND a keyboard model — Enter picks up (aria-pressed + label gains "press a number key 1 to 4"), number keys 1-4 drop into trays (kbd chips shown in tray headers), Esc puts back; every action announced via aria-live status. Wrong tray = fumble counted + wobble + "the drawer disagrees" (item stays unsorted); correct = sorted emoji joins the tray. 3 drawers → rank by fumbles (Drawer Whisperer → The Drawer Forgives You). Items are real <button>s (2.75rem), trays labeled "Tray N: ...", HUD + status aria-live. Zero external assets. Probe 14/14 incl. dedicated a11y audit (buttons, labels, live regions, targets, reduced-motion).
- CORRUPTION INCIDENT #5: mid-write CYRILLIC ('категor') inside the favicon data-URI — dodged the CJK sweep. Sweep WIDENED to [一-鿿а-яА-Я] app-wide going forward.

## issues
- none yet.

## todos
- a timed "guests arriving in 60s" mode; a drawer editor where chat submits items; if asked.
