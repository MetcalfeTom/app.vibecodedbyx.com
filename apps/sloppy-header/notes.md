# SloppyBar - Universal Identity Header

Universal header component connecting all 454 sloppy.live apps to SloppyID.

## Log
- 2026-02-05: Three architectural bridges — Trust + Notifications + Auth Delegation
  - Bridge A: Trust badges in header context
    - New verification query in fetchUserData() (sloppyid_verifications, parallel with karma/premium)
    - New context fields: trustScore, verificationLevel, verifiedProviders[]
    - Trust badge rendered in bar: ✓ (basic), ✓✓ (verified), ✓✓✓ (fully verified) with color tiers
    - Trust scores: Twitter +100, Email +150, GitHub +200 (matches sloppy-id calculation)
    - Propagated through SharedWorker cache → all tabs show badge without DB queries
  - Bridge B: Notification badge relay
    - New context field: unreadCount (DMs + mentions combined)
    - Pulsing red notification dot on Vault link when unread > 0
    - New event: 'unread-changed' { dms, mentions } — broadcast by sloppy-id on DM/mention arrive
    - sloppy-id broadcasts when: real-time insert detected, initial load finds unseen, user clears tabs
    - Auto-handled in both BroadcastChannel and SharedWorker relay paths
  - Bridge C: Auth delegation
    - sloppy-id checks sloppyBarGetContext() auth state before signInAnonymously()
    - If header has auth (shared cookies), skip anonymous sign-in round-trip
    - sloppy-id pulls trust data from header context (avoids redundant sloppyid_verifications query when fresh)
    - Verification changes broadcast via 'verification-changed' event → header refreshes cache
  - New event: 'verification-changed' { trustScore, verificationLevel, verifiedProviders }
  - sloppy-bar.js: 1476 → 1589 lines (+113)
- 2026-02-05: Phase 3 — SharedWorker sync coordinator
  - New file: sloppy-sync-worker.js (~150 lines) — persistent cross-tab cache + event relay
  - Leader election: lowest portId fetches from DB, all other tabs served from worker cache
  - Event relay: broadcasts from any tab forwarded to all others via worker (+ BroadcastChannel fallback)
  - Dedup: fingerprint-based (event+source+timestamp) with 500ms TTL prevents double-fire from worker + BC
  - Heartbeat: 30s keep-alive, 45s stale timeout for port cleanup
  - Graceful degradation: if SharedWorker unavailable (old browsers, WebViews), behavior identical to Phase 1
  - 3-second init timeout: if worker doesn't respond, falls back silently
  - Tab ID: unique per-tab identifier fixes same-app-path BroadcastChannel dedup bug
  - sloppyBarRefresh() temporarily forces DB fetch regardless of leader status, pushes to worker
  - Result: 5 tabs open = 2-3 DB queries instead of 10-15 (leader-only fetching)
  - sloppy-bar.js: 1284 → ~1400 lines (+~120 lines)
- 2026-02-05: Consolidated to single Supabase instance (yjyxteqzhhmtrgcaekgz)
  - Previous header instance (dtfaplmockmwvgyqxbep) was dead/unreachable (DNS failure, HTTP 000)
  - Sync hub was effectively broken — no karma, premium, or username DB queries could execute
  - All required tables (sloppygram_karma, users, sloppygram_profiles, sloppy_analytics) exist on working instance
  - Shared cookie name (sb-auth-token) means header automatically gets same session as all apps
  - Eliminated the two-instance architecture entirely — one instance for the entire ecosystem
- 2026-02-05: Eliminated random guest names from sync hub
  - Removed generateUsername() which created 'Anon' + Math.random() on every page load
  - Username resolution order: Twitter metadata → karma table → sloppygram_profiles → stable Anon_ + userId prefix
  - Added sloppygram_profiles query as fallback (only runs if karma table has no username)
  - Stable fallback: Anon_ + first 6 chars of user ID (deterministic, same across reloads)
  - Previously: new random Anon#### every page load → broadcast to all apps → inconsistent identity
- 2026-02-05: Added auth state to sync hub context API
  - New context fields: isAuthenticated (boolean), authProvider ('twitter' | 'anonymous' | null)
  - New event: 'auth-changed' — broadcasts on login/logout/token refresh with isAuthenticated, authProvider, userId, event
  - syncContext() populates auth fields from currentUser metadata
  - authProvider derived from user_metadata.user_name presence (Twitter) vs anonymous
  - Backwards-compatible: existing apps ignore new fields, new apps can use them
- 2026-02-04: Fixed Supabase client — createBrowserClient with proper cookie domain
  - Switched from createClient (no cookies) to createBrowserClient from @supabase/ssr
  - Cookie domain helper matches supabase-config-fixed.js logic (localhost returns undefined)
  - Fallback to createClient if SSR module unavailable
  - Header uses dtfaplmockmwvgyqxbep instance (different from apps' yjyxteqzhhmtrgcaekgz)
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
- **SharedWorker ('sloppy-sync-worker.js')**: Persistent cross-tab coordinator (Phase 3)
  - Central context cache with 5-min TTL — one DB fetch serves all tabs
  - Leader election: lowest portId wins, re-elects on disconnect
  - Event relay: any tab broadcasts, worker forwards to all others
  - Heartbeat: 30s interval, 45s stale timeout for cleanup
  - Graceful degradation: falls back to BroadcastChannel if unavailable
- **BroadcastChannel('sloppy-sync')**: Cross-tab events (fallback + secondary relay)
- **Event bus**: Same-page event system with `_fireLocal()` dispatch, supports wildcard '*' listeners
- **Dedup layer**: Fingerprint-based (event+source+timestamp) prevents double-fire from worker + BC
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
- Phase 4: Ecosystem-wide adoption — eliminate duplicate auth/karma/profile fetches across 481 apps

## Completed
- ✓ Phase 1: Central Sync Hub (BroadcastChannel + event bus + context cache)
- ✓ Phase 2: Pilot app migrations (sloppy-chat, sloppy-id, sloppy-feed, sloppy-factions)
- ✓ Phase 3: SharedWorker for persistent background sync (leader election, central cache, event relay)

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
- ✓ RESOLVED: Two Supabase instances consolidated to single yjyxteqzhhmtrgcaekgz. Old header instance (dtfaplmockmwvgyqxbep) was dead.
- ✓ RESOLVED: Same-app-path BroadcastChannel dedup bug — tabs with same app path dropped each other's events. Fixed with per-tab `_tabId`.
- BroadcastChannel not supported in all contexts (e.g. some WebViews); graceful try/catch fallback to no-op.
- SharedWorker not supported in all browsers (no Firefox Android, no older iOS). Graceful fallback to BroadcastChannel-only mode.
