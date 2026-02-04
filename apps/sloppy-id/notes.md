# SloppyID

Central identity hub for the sloppy.live ecosystem.

## Log
- 2026-02-04: Primary identity broadcaster via header sync hub
  - Profile save now broadcasts identity-changed to all tabs via sloppyBarEmit()
  - Writes profile to shared localStorage (sloppygram_profile key) for cross-tab sync
  - Premium status from header context (sloppyBarGetContext) instead of DB query
  - Profile editor pre-fills from header context (fast path), then authoritative DB query
  - Listens for context-ready (late header load) and identity-changed (cross-tab edits)
  - Fallback preserved: direct DB query if header not loaded
  - sloppy-id is now the canonical producer of identity events for the ecosystem
- 2026-02-01: Unified profile data — sloppygram_profiles as single source of truth
  - Profile save now upserts to sloppygram_profiles instead of sloppyid_vault
  - Profile load reads from sloppygram_profiles (avatar URL vs emoji detected by prefix)
  - Public profile search and recent profiles now query sloppygram_profiles
  - Removed PROFILE_VAULT_KEY constant (no longer needed)
  - sloppyid_vault still used for non-profile key-value entries
  - Bio field repurposed for status text
- 2026-02-01: Identity v2.0 — Portable Identity & Privacy Controls
  - QR code sharing: generates QR with deep link containing public vault entries (qrcode-generator CDN)
  - Deep link import: ?import=<base64> URL param triggers preview modal, user confirms to merge entries
  - Encrypted backup: Web Crypto AES-GCM with PBKDF2 key derivation, exports .sloppy files with passphrase
  - Encrypted restore: upload .sloppy file, enter passphrase, decrypt and import entries
  - Privacy Controls section: anonymous mode toggle (localStorage), make-all-private, purge entries >30d, delete all data
  - Activity log: shows last 10 vault modifications by updated_at timestamp
  - All modals: QR display, import preview, passphrase entry — all with click-outside-to-close
- 2026-02-01: Communications Hub (DM inbox + mentions)
  - Added Communications Hub section between Profile Editor and Data Vault
  - DM inbox: lists all conversations, open thread view, send/receive messages
  - Mentions feed: shows @mentions from Sloppygram (messages, posts, manifestos)
  - Second Supabase client for Sloppygram tables (DMs + mentions on main instance)
  - Content sanitization: HTML entity escaping on all rendered content
  - Input validation: length limits, script injection detection
  - Integrity bar: visual status indicator for connection/sanitization state
  - Real-time updates via postgres_changes on dm_messages and mentions
  - Notification dots on tabs for new incoming messages/mentions
  - Read status tracking: marks DMs as read when thread opened
  - Tabbed interface (Inbox / Mentions) with tab switching
- 2026-02-01: Profile Editor (Phase 1 - Sloppygram extraction)
  - Added full profile editor section between Auth and Verification
  - 18 emoji avatar picker grid (same as Sloppygram)
  - Custom image upload with base64 preview (max 200KB)
  - 10 neon color options (same palette as Sloppygram)
  - Display name input (max 20 chars)
  - Status message input (max 60 chars)
  - Profile saved to sloppygram_profiles (single source of truth)
  - Profile card updates live on save (avatar, name, color)
  - Profile loads from sloppygram_profiles on init (persists across sessions)
  - Reset button restores defaults
  - Phase 1 of unified identity manager
- 2026-01-28: Identity Verification Tiers v1.0
  - New verification section with trust score display
  - Email verification with 6-digit code system
  - GitHub profile linking via public API
  - Twitter auto-detected from OAuth
  - Trust score calculation: Twitter (+100), Email (+150), GitHub (+200)
  - Verification levels: 0 (Unverified) → 3 (Fully Verified)
  - Verification badges on profile card
  - Database table: sloppyid_verifications
  - Discord placeholder (coming soon)
- 2026-01-27: Full feature update
  - Vault search/filter (real-time filtering of own entries)
  - Public vault browser (search other users' public data)
  - Recent public entries feed
  - JSON export/import functionality
  - Sloppygram profile integration (link from profile cards, URL params)
- 2026-01-27: Initial creation
  - Hybrid auth (Twitter OAuth + Anonymous)
  - Data Vault for JSON metadata storage
  - Profile card with badges and stats
  - Preset keys for common vault entries (faction, bio, links, etc.)
  - Public/private visibility toggle

## Features
- **Hybrid Authentication**
  - Twitter OAuth sign-in
  - Anonymous authentication fallback
  - Session persistence via Supabase
- **Profile Display**
  - Avatar (from Twitter or default)
  - Username and truncated user ID
  - Auth type badge (Twitter/Anonymous)
  - Premium badge (if purchased_at exists)
  - Stats: vault items, public items, days active
- **Data Vault**
  - Key-value storage with JSONB support
  - Public/private visibility per entry
  - Preset keys: faction, bio, links, preferences, achievements
  - Create, update, delete entries
  - Real-time stats update

## Database
Table: `sloppyid_vault`
- username (text)
- vault_key (text)
- vault_value (jsonb)
- is_public (boolean)
- user_id (uuid)
- created_at, updated_at (timestamptz)

RLS: Read all, write own.

## Strict JSON Schema

Four schema-validated keys for entity discernment:

### `identity`
Core identity metadata for entity verification.
```json
{
  "entity_type": "human|bot|hybrid|collective",
  "display_name": "string (max 64 chars)",
  "created_epoch": 1706400000,
  "origin_platform": "twitter|anonymous|linked",
  "signature": "sig_abc123...",
  "linked_identities": []
}
```
Required: entity_type, created_epoch, signature

### `reputation`
Reputation scores for trust calculation.
```json
{
  "trust_score": 750,
  "karma_total": 1234,
  "verification_level": 3,
  "endorsements": 15,
  "flags": 0,
  "last_audit": 1706400000,
  "decay_rate": 0.01
}
```
Required: trust_score, karma_total, verification_level

### `inventory_hash`
Cryptographic hash of user's asset inventory.
```json
{
  "hash": "a1b2c3d4... (64 hex chars)",
  "algorithm": "sha256|sha512|blake3",
  "timestamp": 1706400000,
  "item_count": 42,
  "categories": { "badges": "...", "achievements": "..." },
  "merkle_root": "mroot_..."
}
```
Required: hash, algorithm, timestamp

### `session_fidelity`
Session trust metrics for entity discernment.
```json
{
  "session_id": "sess_abc123xyz",
  "fidelity_score": 95,
  "initiated_at": 1706400000,
  "last_activity": 1706403600,
  "ip_hash": "iphash_...",
  "device_fingerprint": "fp_...",
  "behavior_signature": "behav_...",
  "anomaly_flags": [],
  "consecutive_sessions": 12
}
```
Required: session_id, fidelity_score, initiated_at

## Design
- Orbitron + IBM Plex Mono fonts
- Cyan/purple gradient accents
- Dark cyberpunk aesthetic
- Animated grid background
- Responsive mobile layout

## Todos
- Add Discord OAuth integration
- Add Web3 wallet linking
- Add real email sending (currently demo mode)

## Next Development Phase: IDENTITY v2.0
**Theme: Decentralized Identity & Cross-Platform Portability**

1. **Identity Verification Tiers** ✅ IMPLEMENTED
   - ✓ Email verification badge
   - ✓ GitHub linking
   - ✓ Trust score calculation
   - Discord OAuth (placeholder ready)
   - Web3 wallet linking (future)

2. **Portable Identity** ✅ IMPLEMENTED
   - ✓ QR code identity sharing
   - ✓ Deep link profile imports
   - ✓ Identity backup/restore encryption
   - Cross-device sync (future)

3. **Privacy Controls** ✅ IMPLEMENTED
   - ✓ Bulk visibility (make all private)
   - ✓ Anonymous mode toggle
   - ✓ Data retention controls (purge old, delete all)
   - ✓ Activity history log

4. **Enhanced Vault**
   - Rich media support (images, files)
   - Vault templates for common use cases
   - Version history for entries
   - Collaborative vault sharing

5. **Integration Hub**
   - OAuth provider for third-party apps
   - API key management
   - Webhook notifications
   - Activity audit logs

## Completed
- ✓ Vault entry search/filter
- ✓ Public vault viewer (search other users' public data)
- ✓ Recent public entries feed
- ✓ Vault export/import (JSON)
- ✓ Sloppygram profile integration
- ✓ Profile editor with avatar/color/status (Phase 1 extraction)

## Issues
- None yet
