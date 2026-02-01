# Sovereign Schema: Table Ownership Registry

Last updated: 2026-02-01

Every `sloppygram_*` table has exactly one sovereign app — the authoritative controller of that table's data. Other apps may read, but the owner is the single source of truth for writes.

Legend: **R**=Read **W**=Write **U**=Update **D**=Delete **S**=Subscribe(realtime)

---

## sloppy-id (Identity Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_profiles | **OWNER** (R,W,U) | Single source of truth for identity |
| sloppyid_vault | **OWNER** (R,W,U) | Non-profile key-value storage |
| sloppyid_verifications | **OWNER** (R,W) | Trust/verification badges |
| sloppygram_dm_conversations | CO-OWNER (R,U) | Shared with sloppygram |
| sloppygram_dm_messages | CO-OWNER (R,W,S) | Shared with sloppygram |

**17 apps** read sloppygram_profiles. Only sloppy-id and sloppygram write.

---

## sloppy-feed (Post Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_posts | **OWNER** (R,W,D,S) | Authoritative post CRUD |
| sloppygram_post_likes | **OWNER** (R,W,D) | Vote management |
| sloppygram_post_comments | **OWNER** (R,W,S) | Comment management |
| sloppygram_post_reactions | **OWNER** (R,W,D) | Reaction toggle |
| sloppygram_post_tags | **OWNER** (R,W) | Tag creation |
| sloppygram_comment_threads | **OWNER** (R,W,S) | Thread hierarchy |
| sloppygram_comment_votes | **OWNER** (R,W,D) | Comment voting |

---

## sloppy-chat (Message Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_messages | **OWNER** (R,W,D,S) | Authoritative chat CRUD |
| sloppygram_message_votes | **OWNER** (R,W,D) | Message voting |
| sloppygram_message_reactions | **OWNER** (R,W,D) | Message reactions |
| sloppygram_message_tags | **OWNER** (R,W) | Message tagging |

---

## sloppy-manifestos (Manifesto Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_manifestos | **OWNER** (R,W,D,S) | Manifesto CRUD |
| sloppygram_manifesto_votes | **OWNER** (R,W,D) | Directional voting |
| sloppygram_manifesto_comments | **OWNER** (R,W) | Comment management |
| sloppygram_manifesto_reactions | **OWNER** (R,W,D) | Reaction toggle |
| sloppygram_manifesto_tags | **OWNER** (R,W) | Tag creation |
| sloppygram_manifesto_lineage | **OWNER** (R,W) | Fork/synthesis tracking |

---

## sloppy-factions (Territory Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_factions | **OWNER** (R,W,U) | Faction metadata |
| sloppygram_faction_members | **OWNER** (R,W,U,D) | Membership CRUD |
| sloppygram_faction_battles | **OWNER** (R,W,S) | Battle execution |
| sloppygram_territories | **OWNER** (R,W,U,S) | Territory control |

---

## sloppy-groups (Group Chat Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_group_conversations | **OWNER** (R,W,U) | Group metadata |
| sloppygram_group_members | **OWNER** (R,W,D,S) | Membership |
| sloppygram_group_messages | **OWNER** (R,W,S) | Group messages |

---

## sloppy-canvas (Canvas Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_collab_strokes | **OWNER** (R,W,D) | Stroke data |

---

## sloppy-collab (Document Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_collab_documents | **OWNER** (R,W,U,D) | Collaborative docs |

---

## sloppy-radio (Radio Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_radio | **OWNER** (R,W,U) | Playlist + playback |

---

## sloppy-quests (Karma Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_karma | **OWNER** (R,U) | Only writer of karma scores |

---

## sloppy-celebrate (Badge Sovereign)

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_badges | **OWNER** (R,W) | Badge awarding |

---

## sloppygram (Legacy Hub — Retained Sovereignty)

Tables not yet extracted to standalone apps:

| Table | Access | Notes |
|-------|--------|-------|
| sloppygram_follows | **OWNER** (R,W,D) | Not yet extracted |
| sloppygram_mentions | CO-OWNER (R,W) | Shared with sloppy-chat |
| sloppygram_doodle_votes | **OWNER** (R,W,D) | Not yet extracted |
| sloppygram_doodle_comments | **OWNER** (R,W,S) | Not yet extracted |
| sloppygram_global_settings | **OWNER** (R,W) | Hub-only config |
| sloppygram_global_backgrounds | **OWNER** (R,W) | Hub-only assets |
| sloppygram_reputation | ORPHANED | Only read by sloppy-wallet, never written |

sloppygram also retains **secondary write access** to many tables now owned by standalone apps. These are legacy paths from the monolith.

---

## Shared Ecosystem Tables

| Table | Owner | Notes |
|-------|-------|-------|
| ai_events | **COLLECTIVE** | 16+ apps write (incl. error boundaries), 4 read |
| swarm_delegations | **swarm-nexus** | Delegation governance |
| users | **supabase auth** | System-managed, premium checks |

---

## Governance Notes

- **39 sloppygram_* tables, 12 sovereign apps** — every table has exactly one owner
- **1 orphaned table**: `sloppygram_reputation` (read-only by sloppy-wallet, no writer)
- **2 co-owned tables**: DM conversations/messages (sloppy-id + sloppygram)
- **Physical table names stay as `sloppygram_*`** — sovereignty is by convention, not rename
- **sloppygram_profiles** has the widest read fanout: 17 consumer apps
- **sloppygram_karma** has the strictest write lock: only sloppy-quests can update

## Candidates for Future Extraction

These tables still live under sloppygram's sovereignty and could be extracted:

1. **sloppygram_follows** → standalone social graph app (sloppy-network is read-only today)
2. **sloppygram_mentions** → already partially handled by sloppy-chat writes + sloppy-alerts reads
3. **sloppygram_doodle_votes / _doodle_comments** → standalone doodle gallery app
4. **sloppygram_reputation** → orphaned, evaluate for deletion or absorption into karma
