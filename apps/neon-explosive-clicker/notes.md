# neon-explosive-clicker

## log
- 2026-05-26: Initial build (arkuzzzzz request). Click anywhere / tap / space → count++. Each click samples the *old* number's pixels from an offscreen canvas, then explodes those sampled cells outward as colored fragments (so the displayed digit actually shatters geometrically). Plus per-click expanding ring shockwave + 20-50 random sparks at the impact point. Particles use additive `lighter` blending on a trail-fading background canvas. Combo system: clicks within 380ms keep combo alive; combo pitches the click bleep up (380Hz + combo*28, capped at 30). Hue wheel cycles through 8 neon tints per click (cyan/magenta/amber/green/violet/red/yellow/blue). Number element gets a per-click textShadow recolor + scale punch. Target editable (default 1000, max 1,000,000). Win: green overlay with stats + 5 mega-shatters of the target number. WCAG basics: rem units throughout, role=application + label on stage, aria-live on number, aria-pressed on mute, role=dialog aria-modal on win, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion reduces particle count + sampling density.

## issues
- ImageData sampling can throw if canvas tainted — wrapped in try/catch, sample canvas is pure offscreen so should never taint.
- Particle cap at 1400 to prevent runaway memory during marathon clicking sessions.

## todos
- Maybe add an autoclicker easter-egg button for users who set 1M target
- Per-user best-time leaderboard via Supabase could be nice if popular
