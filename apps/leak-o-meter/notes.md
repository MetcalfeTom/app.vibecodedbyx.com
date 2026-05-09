# leak-o-meter

## log
- 2026-05-09: shipped — visual sim of a memory leak (chat ask: "create a simple app called leak-o-meter that visualizes a simulated memory leak with a growing pile of digital junk"). Two-pane layout: a heap-stage canvas on the left where boxes literally pile up under gravity, a controls + metrics + ticker column on the right. NO REAL JS HEAP IS LEAKED — every "leaked" object is a tiny `{kind, size, x, y, w, h, age, vy}` struct in an array we own; the GC button just empties the array. Educational demo, not actual ballast.
  - **Heap stage** (canvas, ~32rem tall): freshly-allocated boxes drop in from the top with a small horizontal jitter and stack on the floor under cheap gravity + AABB-stack physics. Boxes are sized proportionally to their kB (using sqrt scaling so 0.1 KB and 100 KB don't differ by 30×). When the heap exceeds ~85% of the OOM ceiling, the stage tints crimson and gets brighter as utilization climbs; cross 100% and an "OUT OF MEMORY · process terminated" banner crashes across the middle.
  - **6 leak kinds** with named colors + descriptive text (the canon JS leak patterns):
    - 🟦 **Detached `<div>`** — orphaned by removeChild but still referenced
    - 🟢 **cached JSON** — `JSON.parse(big_response)` held in a closure
    - 🩷 **event listener** — `addEventListener` without remove
    - 🟣 **closure scope** — captured in `setInterval`
    - 🟡 **image buffer** — `new Image().src` bytes
    - 🟠 **console.log row** — devtools holds the ref
    Each kind has a `sizeMul` multiplier so image buffers are 2.2× the average and event listeners are 0.3×, matching real-world ratios. Toggle any kind off to bias what type of junk leaks.
  - **Faucet controls**: allocation rate slider (0–60 allocs/sec, default 8), average object size (0.1–6.4 KB, default 2.5), heap ceiling (64 KB – 4 MB, default 512 KB).
  - **Action buttons**: ▶ Start/Pause leak (toggles the faucet — pressed state turns acid green), 🔧 Plug 50% (drops half the heap as a partial fix), ♻ Force GC (clears everything — visualizes a manual GC pass), ↺ Reset (wipes all state including history).
  - **Live metrics** (4-tile grid): Heap (current KB, color-keyed cyan→amber→crim as utilization climbs), Objects (count), Allocs/s (5-second rolling), Uptime.
  - **Heap chart**: 60-second rolling line graph beneath the stage. Cyan filled-area for current heap, dashed crimson line for the OOM ceiling, dashed amber line for peak observed.
  - **Event ticker**: rolling log of every alloc/free/crash event with timestamp + kind + message. Last 18 visible, capped at 80 entries to bound DOM size. Color-keyed: amber for allocs, acid for frees, crimson for crashes.
  - **Right-edge utilization bar** painted on the stage canvas itself — a vertical thermometer that shows current heap-vs-ceiling % at a glance. Color shifts cyan → amber → crim as you climb.
  - **Aesthetic**: deep navy radial bg, Audiowide title "leak·o·meter" with crimson dots + cyan "meter", VT323 numeric metrics, JetBrains Mono everywhere else, Press Start 2P for tiny labels. Cyan / amber / acid / crimson palette echoing browser-devtools heap-snapshot vibes.
  - **Accessibility**: rem units, semantic html, `role="application"` + descriptive `aria-label` on the heap canvas, `aria-live="polite"` on metrics + ticker, `aria-pressed` on the start/leak toggle + kind toggles, `:focus-visible` outlines, 2.75rem (44px) min interactive targets, skip link, `prefers-reduced-motion` removes toast transitions.

## issues
- The ceiling slider's rendered `0%` and `100%` lines on the chart aren't gridded with their numeric labels yet — you can see the dashed lines but no `512 KB / 100%` text annotations. Cosmetic.
- The stack physics is naive — at very high object counts (>500) boxes can occasionally fuse (overlap-and-stick) instead of restacking cleanly. Visually fine since the "junk pile" look is the goal anyway.
- "Allocs/s" is a 5-second rolling average; if you yank the rate slider from 60 → 0 the metric takes 5s to follow.
- Reset doesn't restart the uptime counter — the timer keeps ticking from the original start. Easy V2.

## todos
- Tooltips on hover over a box: show its kind + size + age + a fake stack-trace link.
- A "leak path" view that draws lines from each kind's "source" (a labeled point at the top — `setInterval`, `removeChild`, etc.) to its boxes, illustrating *how* each kind leaks.
- Comparison mode: 2 stages side by side with different rates, see which one OOMs first.
- An accidental-leak-detective mini-game: leaks happen randomly; player picks the right "fix" button (removeEventListener / clearInterval / WeakRef) before OOM.
- Export the chart as PNG so devs can paste a leak shape into a bug report.
