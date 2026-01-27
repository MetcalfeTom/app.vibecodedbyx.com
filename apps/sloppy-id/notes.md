# SloppyID

Central identity hub for the sloppy.live ecosystem.

## Log
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
- None currently

## Completed
- ✓ Vault entry search/filter
- ✓ Public vault viewer (search other users' public data)
- ✓ Recent public entries feed
- ✓ Vault export/import (JSON)
- ✓ Sloppygram profile integration

## Issues
- None yet
