# Loose Leaf — paper planner

## log
- 2026-08-18: v1. Single-file paper planner: cream ruled sheet on a desk (red margin, punched holes, washi tape, -0.35° tilt), Caveat + Kalam handwriting. Tasks nest to 3 levels (task → step → substep, depth-capped), homework/work divider tabs with ink-color accents, per-task focus timers (15/25/45 min) that pay out red tally marks (groups of five with the diagonal slash) on the task line. Completion logic: checking a parent cascades down; completing every sub auto-completes ancestors; unchecking a leaf un-completes them. Inline text editing (input swap, Enter/blur saves), delete, empty-state note, footer stats (crossed off / focus sessions), triangle chime on session end with mute toggle. localStorage 'loose-leaf-v1'. Seam window.__LL. WCAG basics: 100% root font, semantic tabs/tablist/dialog, labelled checkboxes, focus-visible, 2.75rem targets, prefers-reduced-motion.
- Suite ll-probe: 24/24 (boot, nesting + depth cap, fraction, cascade both directions, tab filtering + aria-selected, timer open/length/countdown/complete/pause/quit, tally grouping 7=[5,2], edit/delete persistence, HTML-injection safety via input values, a11y spots).
- Design-review fix pre-ship: .lenrow buttons had no font/size styling (UA default, sub-44px) — styled to match.

## issues
- Task text renders in <input value> — inherently injection-safe, but means long text ellipsizes rather than wraps. Acceptable for one-line planner items.
- Emoji buttons (⏱ 🔔 ↳＋) show as tofu in headless probes only; real browsers render them.

## todos
- Reorder (drag or up/down buttons)
- Per-day archive ("yesterday's page" flip)
- Optional custom category tabs
- 2026-08-18 (2): calm chime per chat — replaced the bright C5/E5/G5 triangle arpeggio with a gentle bell: sine-only voices at A3/E4/A4 (each with a quiet octave partial at ~1/4 gain), 0.45s note spacing, 90ms soft attack, 2.6s exponential decay, peak gain 0.045 (was 0.12), all routed through a 1100Hz Q0.4 lowpass. Verified via stubbed AudioContext driven through the REAL session-finish path (7/7: sine-only, lowpass present, peak ≤0.05, spacing ≥0.4s, low register, mute creates zero nodes) + full 24/24 regression. Atomic deploy.
