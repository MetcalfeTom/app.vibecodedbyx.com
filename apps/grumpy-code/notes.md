# Grumpy Code

## log
- 2026-04-17: Added two dedicated topic roasts: `nuxt_hydration` (SSR/hydrate/mismatch triggers) with 8 lines about <ClientOnly>, Date.now() in setup, server/client disagreement; and `node_modules` (node_modules/package-lock/pnpm/bundle size triggers) with 10 lines about is-even, 1.2GB folders, lock file size. Priority above generic `code` bucket so they match first.
- 2026-04-17: Created. Retro phosphor-green CRT terminal with scanlines, vignette, and flicker. Boot sequence + ASCII logo. Local roast engine: topic detection (code/bug/help/love/life/ai/hi/thanks/joke/why/yes/no) with pattern-matched templates, plus openers/verdicts/closers. Echoes a word from user input for personalized snark. Mood system (6 levels: BARELY AWAKE → EERILY CALM) and patience gauge that decays with verbose/interrogative prompts. Slash commands: /help, /mood, /patience, /stats, /self, /clear, /reboot, /about, /theme (5 CRT phosphor themes), /compliment. Typewriter animation, command history (↑/↓), Ctrl+L to clear. Fully offline — no network. VT323 + Major Mono Display typography.

## issues
- Typewriter uses setTimeout so rapid-fire Enter would stack (guarded by `busy` flag).
- Patience passively recovers +1% every 8s of idle — prevents dead-end state where /reboot is the only path.
- No swear filter by design; the roasts are spicy but PG-ish. Watch for kid-unfriendly vibes if livestream audience needs tightening.

## todos
- Optional pollinations.ai integration for dynamic roasts (toggleable) — would want a rate limit + local fallback.
- Hidden konami-style "nice mode" easter egg.
- Save mood/theme to localStorage.
- Fake "logs" directory with /tail /logs.txt showing past judgments.
- Sound effects (keystroke clacks, boot beep).

## design
- Palette: bg #021006, phos #3bff7a, amber #ffbf00, red #ff3b3b
- 5 phosphor themes: green / amber / red / arctic / vaporwave
- CRT: scanline overlay (2px stripe multiply), radial vignette, 3.2s flicker animation
