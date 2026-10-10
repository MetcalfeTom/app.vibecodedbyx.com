# Order Up!

lightup79's "build me a todo app" (Twitch, 2026-10-10 08:03 UTC, first visit). The stream already had nine to-do apps, so this one is a diner kitchen: tasks are guest-check tickets clipped to a steel rail, done = ring the bell and the ticket flies onto the spike.

## log
- 2026-10-10 08:28 UTC v1.1.1 the spiked tickets sit in front of the nail (.stack z-index 1, count badge 2), so the hook comes up through the stack instead of standing in front of it (Tatum: 'the z ordering of the tickets is wrong').
- 2026-10-10 08:22 UTC v1.1: safety spike (Tatum: "curved into a hook, to prevent painful accidents"): the nail is an inline SVG rod that bends over into a hook with a rounded ball tip; the count badge moved to the spike's left so it doesn't hide the hook.
- 2026-10-10 08:07 UTC v1: kitchen-tile wall, ticket rail (rows of steel bars via a repeating gradient, tickets flex-wrap under them, 2 per row on phones). Type in the GUEST CHECK pad + "fire!" (Enter) to add; RUSH toggles a red-header ticket that jumps to the front. Tap a ticket: dialog (order up / keep it (edit text) / rush / 86 it). The counter bell spikes the first ticket on the rail. ORDER UP! toast, bell chord + paper + thunk (WebAudio, no files). The spike holds a paper stack + count; tap it to pull the last ticket back (undo); "empty the spike" asks twice. Tickets over a day old turn yellow with an AGING stamp, over 3 days STALE. Board: tickets on the rail + spiked today. First visit seeds 3 example tickets. Saved in localStorage 'order-up-v1' {n, rail, spike}. Fonts: Shrikhand / Kalam / Courier Prime. Tested headless 390x844 + 1200x630 (add, rush, bell, dialog 86, spike undo), 0 errors. og.png = a 1200x630 shot.

## issues

## todos
- ask lightup79 what they'd change; ideas: drag tickets along the rail, a "86'd" bin, a closing-time recap (tickets spiked per day), sections (grill / fryer = categories).
