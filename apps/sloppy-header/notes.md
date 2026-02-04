# SloppyBar - Universal Identity Header

Universal header component connecting all 454 sloppy.live apps to SloppyID.

## Log
- 2026-02-04: Phase 1 — Central Sync Hub
  - Added BroadcastChannel('sloppy-sync') for cross-tab event communication across all 481 apps
  - Added enriched userContext object (userId, username, karma, rank, premium, avatar, theme, bio, color, etc.)
  - Added event bus with wildcard '*' support for same-page subscribers
  - Added secureStorage reader (_ssGet) compatible with monolith's XOR+Base64 encoding (key: sl0ppy_2024)
  - Added enrichContextFromLocalStorage() — reads profile + theme from shared localStorage (same origin)
  - Added public API: sloppyBarGetContext, sloppyBarOn, sloppyBarOff, sloppyBarEmit, sloppyBarRefresh
  - Added postMessage bridge for iframe apps (sloppy-sync-emit, sloppy-sync-get-context)
  - Auto-applies theme-changed CSS vars from other tabs
  - Auto-refreshes on identity-changed and karma-changed events
  - File: 975 → 1230 lines (+255 lines)
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

## Sync Hub Architecture
- **BroadcastChannel('sloppy-sync')**: Cross-tab events between all apps loading sloppy-bar.js
- **Event bus**: Same-page event system with `_fireLocal()` dispatch, supports wildcard '*' listeners
- **Context cache**: `userContext` object enriched from DB + shared localStorage
- **secureStorage decode**: Reads monolith's XOR+Base64-encoded localStorage keys (profile, theme)
- **postMessage bridge**: iframe apps can emit events and request context via `window.parent.postMessage`
- **Public API**:
  - `sloppyBarGetContext(cb)` — snapshot of current user context
  - `sloppyBarOn(event, cb)` — subscribe to sync events
  - `sloppyBarOff(event, cb)` — unsubscribe
  - `sloppyBarEmit(event, data)` — broadcast to all tabs + same-page listeners
  - `sloppyBarRefresh(cb)` — force re-fetch from DB + localStorage

## Todos
- Phase 2: Migrate 2-3 pilot apps to consume context from header instead of own DB queries
- Phase 3: Add SharedWorker for persistent background sync
- Phase 4: Ecosystem-wide adoption — eliminate duplicate auth/karma/profile fetches across 481 apps

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
- Two Supabase instances: header uses dtfaplmockmwvgyqxbep, monolith uses yjyxteqzhhmtrgcaekgz. Profile/theme data bridged via shared localStorage (same origin) rather than cross-instance DB queries.
- BroadcastChannel not supported in all contexts (e.g. some WebViews); graceful try/catch fallback to no-op.
