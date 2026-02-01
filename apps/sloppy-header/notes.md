# SloppyBar - Universal Identity Header

Universal header component connecting all 454 sloppy.live apps to SloppyID.

## Log
- 2026-02-01: Advanced Teleport Discovery Mode
  - 11 category chips (Games, Creative, Music, Social, Tools, Weird, Sim, Retro, Security, Explore, Sloppy)
  - Weighted random: unvisited apps 10x, old visits 5x, recent visits 1x
  - Discovery panel with modal overlay, category filtering, explorer progress bar
  - Tracks all visited apps in localStorage for discovery %
  - Analytics logs category with each teleport event
- 2026-01-28: Recent Apps Dropdown
  - Apps link now shows dropdown with recent app history
  - Tracks last 8 visited apps in localStorage
  - Shows app icon, name, and time since visit
  - Click outside to close dropdown
  - Links to App Directory at bottom
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
- **Quick Links**: Karma, Vault, Apps (with dropdown), Health
- **Recent Apps Dropdown**: Click Apps to see last 8 visited apps with timestamps
- **Teleport Discovery**: Category-based teleport with weighted random favoring unvisited apps, explorer progress tracking
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
- None currently

## Completed
- ✓ Pilot on 11 apps (system-health, games, social, creative)
- ✓ Blanket deployment to ALL 454 apps
- ✓ Analytics integration (sloppy_analytics table)

## Next Development Phase: HEADER v2.0
**Theme: Intelligent Context & Personalization**

1. **Smart Context Awareness**
   - App-specific quick actions
   - Context-sensitive link suggestions
   - ✓ Recent apps history dropdown
   - Favorites/pinned apps

2. **Personalization**
   - Custom color themes per user
   - Configurable link shortcuts
   - Preferred teleport destinations
   - Activity streak display

3. **Social Features**
   - Friend activity indicator (who's online where)
   - Quick share current app
   - Recent visitors badge
   - Achievement popup notifications

4. **Advanced Teleport**
   - ✓ Category-based teleport (11 categories)
   - ✓ Weighted random (favor unvisited apps)
   - ✓ Discovery mode (progress tracking)
   - Teleport chain challenges

5. **Performance & Reliability**
   - Service worker for offline support
   - Preconnect to likely destinations
   - Lazy-load non-critical features
   - Error boundary with graceful fallback

## Issues
- None yet
