# Quick Fix Guide

## Run Verification
```bash
bash /vibespace/verify_app_quality.sh
```

## Batch Fix All Issues

### 1. Fix Missing Favicons (2 apps)

**breakout-terminal:**
```bash
# Add after line 6 (after viewport meta tag)
# Suggested emoji: 🧱 (brick for breakout)
```

**pong-terminal:**
```bash
# Add after line 6 (after viewport meta tag)
# Suggested emoji: 🏓 (ping pong paddle)
```

### 2. Fix Missing og:url (7 apps)

Apps needing og:url tag (add after og:image tag):
- aurora-lab
- breakout-terminal
- cosmic-cat-quest-pp
- gemini-puzzle
- golden-game
- pho-game
- pong-terminal

Format: `<meta property="og:url" content="https://app.vibecodedbyx.com/APP_NAME" />`

## Individual App Fixes

### breakout-terminal
Needs:
1. Favicon: `<link rel="icon" href="https://emojicdn.elk.sh/🧱" />`
2. OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/breakout-terminal" />`

### pong-terminal
Needs:
1. Favicon: `<link rel="icon" href="https://emojicdn.elk.sh/🏓" />`
2. OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/pong-terminal" />`

### aurora-lab
Needs:
- OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/aurora-lab" />`

### cosmic-cat-quest-pp
Needs:
- OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/cosmic-cat-quest-pp" />`

### gemini-puzzle
Needs:
- OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/gemini-puzzle" />`

### golden-game
Needs:
- OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/golden-game" />`

### pho-game
Needs:
- OG URL: `<meta property="og:url" content="https://app.vibecodedbyx.com/pho-game" />`

## After Fixing

1. Test in browser
2. Verify with: `bash /vibespace/verify_app_quality.sh`
3. Commit: `git add -A && git commit -m "Fix app quality issues - add missing favicons and og:url tags"`
