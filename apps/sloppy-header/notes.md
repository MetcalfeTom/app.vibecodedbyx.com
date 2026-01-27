# SloppyBar - Universal Identity Header

Universal header component connecting all 454 sloppy.live apps to SloppyID.

## Log
- 2026-01-27: Added Random Teleport feature
  - 🌀 Teleport button sends users to random app from 60+ curated picks
  - Excludes current app from selection
  - Fun scale/glow effect on click
  - Spinning icon animation
- 2026-01-27: Initial creation
  - Proposal document with full design spec
  - Working sloppy-bar.js component (~3KB)
  - Demo/documentation page
  - Configurable position, theme, minimized state

## Features
- **Identity Display**: Username + avatar (emoji or Twitter)
- **Karma Badge**: Real-time karma from sloppygram_karma
- **Premium Status**: Crown badge for premium users
- **Quick Links**: Karma, Vault, Apps, Health
- **Random Teleport**: 🌀 button sends to random app from 60+ curated picks
- **Minimizable**: Collapse to single icon
- **Responsive**: Mobile-friendly design
- **Single File**: One script tag integration

## Configuration
```html
<script src="/sloppy-header/sloppy-bar.js"
        data-position="top|bottom"
        data-theme="dark|light"
        data-minimized="true|false"
        data-hide-karma="true|false"
        data-hide-links="true|false">
</script>
```

## Technical Details
- Pure vanilla JS, no dependencies
- Uses existing supabase-config.js or creates own client
- 5-minute cache for user data
- CSS scoped with .sloppy-bar-* prefix
- Z-index: 99999 (above most content)

## Database Reads
- `sloppygram_karma`: karma_total, rank, username
- `users`: purchased_at (premium status)

## Rollout Strategy
1. Phase 1: Test on pilot apps (system-health, neon-tetris, wiki-scout)
2. Phase 2: Add to high-traffic apps (sloppygram, sloppy-id)
3. Phase 3: Gradual rollout to all apps

## Todos
- [ ] Add to pilot apps for testing
- [ ] Create migration script for bulk rollout
- [ ] Add ai_events logging for adoption tracking

## Issues
- None yet
