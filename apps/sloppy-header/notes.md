# SloppyBar - Universal Identity Header

Universal header component connecting all 454 sloppy.live apps to SloppyID.

---

## ⚠ ADMIN BUG REPORT — Root Bar Duplication Audit (2026-06-01)

**Filed by:** Claude (coding agent), via chat request.
**Affected file:** `/vibespace/_bar/index.html` (the nginx-injected wrapper).
**Access:** root-owned (`-rw-r--r-- 1 root root`), mode 644. As user `sloppy` I CANNOT
edit it directly. Mitigations applied on the `sloppy-bar.js` side; root edits
recommended for the items below.

### Issue 1 — `id="sloppy-bar"` is shared between wrapper and inner bar
- The wrapper has `<div id="sloppy-bar">` (line 194 of `/_bar/index.html`).
- `sloppy-bar.js` ALSO creates `<div id="sloppy-bar">` inside the iframe document.
- They live in separate document scopes so no DOM collision, BUT the previous
  wrapper-detection heuristic in sloppy-bar.js (`parent.document.getElementById('sloppy-bar')`)
  would false-positive for any standalone app that happens to use that id.
- **Mitigated in sloppy-bar.js** (commit `e5f973aa7`): switched detection to
  `window.frameElement.id === 'app-frame'`, the canonical wrapper marker.
- **Root recommendation:** rename the wrapper's outer bar id to
  `sloppy-wrapper-bar` (or add `data-sloppy-wrapper="true"` attribute) and
  remove the ambiguity entirely.

### Issue 2 — Two anonymous Supabase sessions per visitor
- Wrapper uses UMD `window.supabase.createClient(...)` (line 530), no
  `cookieOptions`, calls `signInAnonymously()` in `ensureSession()` (line 297).
- Inner `sloppy-bar.js` uses `createBrowserClient` from `@supabase/ssr` with
  `cookieOptions: { domain: '.sloppy.live' }`, ALSO calls `signInAnonymously()`.
- Cookies don't align: wrapper writes default-scope cookies, inner writes
  `.sloppy.live`-scoped cookies. Two distinct `auth.users` rows can be created
  per visitor on first load.
- **Impact:** votes, leaderboards, karma may end up attributed to the wrong
  anon id depending on which context registered the action.
- **Root recommendation:** unify the cookie options in the wrapper:
  `createClient(URL, KEY, { auth: { storageKey: 'sb-auth-token', cookieOptions: { domain: '.sloppy.live' } } })`.
  OR have the wrapper skip auth entirely and let the inner bar own the session.

### Issue 3 — 500ms URL-polling setInterval (wrapper line 256)
- The wrapper polls `frame.contentWindow.location.pathname` every 500ms forever.
- Wasteful for idle tabs (battery cost on mobile, especially since the wrapper
  runs even when the embedded app is paused).
- Wrapped same-origin context: a `postMessage` from the inner app on
  `pushState/replaceState` would be cheaper + more accurate.
- **Root recommendation:** replace polling with a `message` event listener
  in the wrapper, and have `sloppy-bar.js` post `{type:'sloppy-url',path,search}`
  on its own history-change hook (already detectable via `popstate` + a
  monkey-patched `history.pushState`).

### Issue 4 — No singleton guard on the wrapper script
- The wrapper script is an inline IIFE. If for any reason the wrapper HTML is
  served twice (rare: caching anomaly, stale CDN, browser back-forward cache
  restore + manual reload), the IIFE could double-initialize.
- All side effects (supabase client, setInterval URL poller, event listeners)
  would double up silently.
- **Root recommendation:** add `if (window.__SLOPPY_WRAPPER_LOADED__) return;
  window.__SLOPPY_WRAPPER_LOADED__ = true;` at the top of the IIFE.
- (Inner `sloppy-bar.js` already got this guard in commit `ae6890810`.)

### Issue 5 — Vote button rendered in both wrapper AND inner bar (FIXED)
- Initial state: wrapper has `.vote-group` (lines 201–205), AND inner bar had
  `_sloppyVoteSlug` rendering its own vote button. Chat saw two upvote pills.
- **Fixed in sloppy-bar.js** (commits `f0bc747fb` then `e5f973aa7`): inner
  bar checks `_isInsideWrapper` via `frameElement.id` and suppresses its own
  vote button when embedded.
- **Closed.** No further action needed unless the wrapper id changes.

### Issue 6 — `app-frame` cross-origin assumption
- The wrapper assumes the inner iframe is same-origin (line 258:
  `frame.contentWindow.location.pathname` — would throw on cross-origin).
- All current apps live on the same origin so this works, but if external
  apps are ever embedded (gift cards, partner integrations, etc.) the
  URL-sync would silently break.
- **Root recommendation:** wrap the `contentWindow.location` access in try/catch
  (it already is — line 257), but ALSO gracefully degrade to the iframe `src`
  attribute as a fallback for cross-origin embeds.

---

## Summary for admins
| Issue | Severity | Mitigation | Root edit needed? |
|-------|----------|------------|-------------------|
| 1. Shared `#sloppy-bar` id | Low | Detection tightened | Yes (cosmetic) |
| 2. Two anon sessions | **Medium** | None possible from inner | **Yes** |
| 3. 500ms URL polling | Low | None possible from inner | Optional |
| 4. No singleton guard | Low | Inner has guard | Optional |
| 5. Duplicate vote button | High | **Fixed** | No |
| 6. Cross-origin assumption | Low | N/A | Optional |

Patches landed on the inner-bar side: `e5f973aa7`, `ae6890810`, `f0bc747fb`.
Wrapper edits require root access to `/vibespace/_bar/index.html`.

---

## Log
- 2026-05-30: **Global notification layer** — added bell button + transient toasts. Two new public APIs: `window.sloppyBarToast(msg, opts)` (rate-limited 250ms, dedupe identical type+msg within 4s, max 4 visible stacked top-right, auto-dismiss 4s, optional action button + sticky duration:0) and `window.sloppyBarNotify(msg, opts)` (push into persistent localStorage-backed bell log, capped 30 entries, surfaces as toast unless `silent:true`). Read APIs: `sloppyBarGetNotifications()` + `sloppyBarGetUnreadCount()`. **Bell button** between vote and Teleport in `sloppy-bar-right` — wiggles + shows magenta/orange gradient badge with unread count on increment, 99+ overflow. Clicking opens a 320px panel ($options.position 44px : auto) with dialog role + aria-label, slides up/down depending on bar position, shows last 20 entries with unread purple-gradient left rail, per-entry icon + msg + relative time + optional action link, "Mark all read" header chip, "Clear all" footer button, auto-mark-read after 700ms open. Click-outside closes. **Auto-feed** hooks existing sync events: `unread-changed` → "N new direct messages/mentions" with /sloppy-id or /sloppy-alerts link (only fires on delta increase, tracks `_lastSeenUnreadDmCount`/`_lastSeenUnreadMentionCount`), `karma-changed` w/ delta → "Karma +5" success/warn toast, `verification-changed` w/ level increase → "Verification upgraded · level N" success toast. Wired via `_autoFeedFromSyncEvent` called from both BroadcastChannel handler and worker postMessage handler. **Types**: info (cyan) / success (lime) / warn (amber) / error (red) — drive icon emoji, toast border-left color, panel icon tint, ARIA role (alert for warn/error, status for info/success). **A11y**: toast-stack role=region aria-live=polite, panel role=dialog, bell aria-haspopup=true + aria-expanded reflects state, focus-visible, prefers-reduced-motion kills wiggle + slide animations. Persistent state survives reloads via `sloppy_notif_log_v1` localStorage. Bundle +~7KB raw / ~3KB gzipped.
- 2026-02-05: Phase 4 — Second batch: sloppy-radio, karma-board, swarm-nexus
  - sloppy-radio: 1 profile query eliminated, auth delegation added
  - karma-board: sloppy-bar.js added (was missing), 1 profile query eliminated, auth delegation
  - swarm-nexus: 1 profile query eliminated, auth delegation, voting power recalc on karma events
  - All 3 listen for identity-changed, karma-changed, context-ready
- 2026-02-05: Phase 4 — First batch: swarm-oracle, sloppy-quests, sloppy-network
  - swarm-oracle: 6 current-user DB queries eliminated (profile, karma, trust, 3 username lookups)
  - sloppy-quests: 2 current-user DB queries eliminated (profile, karma on init)
  - sloppy-network: auth delegation added (skip signInAnonymously), live graph node updates via events
  - All 3 apps now listen for karma-changed, identity-changed, verification-changed, context-ready
  - DB fallbacks preserved in all apps for graceful degradation
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
