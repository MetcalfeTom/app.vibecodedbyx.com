# Sovereign Schema: Table Ownership Registry

Last updated: 2026-02-04

Every table has exactly one sovereign app — the authoritative controller of that table's data. Other apps may read, but the owner is the single source of truth for writes.

Legend: **R**=Read **W**=Write **U**=Update **D**=Delete **S**=Subscribe(realtime)

---

## sloppy-id (Identity Sovereign) — `sloppyid_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_profiles` | `sloppyid_profiles` | **OWNER** (R,W,U) | Single source of truth for identity |
| `sloppyid_vault` | *already named* | **OWNER** (R,W,U) | Non-profile key-value storage |
| `sloppyid_verifications` | *already named* | **OWNER** (R,W) | Trust/verification badges |
| `sloppygram_dm_conversations` | `sloppyid_dm_conversations` | CO-OWNER (R,U) | Shared with sloppygram |
| `sloppygram_dm_messages` | `sloppyid_dm_messages` | CO-OWNER (R,W,S) | Shared with sloppygram |

**21 apps** read profiles (17 ecosystem + 4 standalone). Only sloppy-id writes.

---

## sloppy-feed (Post Sovereign) — `sloppyfeed_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_posts` | `sloppyfeed_posts` | **OWNER** (R,W,D,S) | Authoritative post CRUD |
| `sloppygram_post_likes` | `sloppyfeed_post_likes` | **OWNER** (R,W,D) | Vote management |
| `sloppygram_post_comments` | `sloppyfeed_post_comments` | **OWNER** (R,W,S) | Comment management |
| `sloppygram_post_reactions` | `sloppyfeed_post_reactions` | **OWNER** (R,W,D) | Reaction toggle |
| `sloppygram_post_tags` | `sloppyfeed_post_tags` | **OWNER** (R,W) | Tag creation |
| `sloppygram_comment_threads` | `sloppyfeed_comment_threads` | **OWNER** (R,W,S) | Thread hierarchy |
| `sloppygram_comment_votes` | `sloppyfeed_comment_votes` | **OWNER** (R,W,D) | Comment voting |

---

## sloppy-chat (Message Sovereign) — `sloppychat_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_messages` | `sloppychat_messages` | **OWNER** (R,W,D,S) | Authoritative chat CRUD |
| `sloppygram_message_votes` | `sloppychat_message_votes` | **OWNER** (R,W,D) | Message voting |
| `sloppygram_message_reactions` | `sloppychat_message_reactions` | **OWNER** (R,W,D) | Message reactions |
| `sloppygram_message_tags` | `sloppychat_message_tags` | **OWNER** (R,W) | Message tagging |

---

## sloppy-manifestos (Manifesto Sovereign) — `sloppymanifesto_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_manifestos` | `sloppymanifesto_manifestos` | **OWNER** (R,W,D,S) | Manifesto CRUD |
| `sloppygram_manifesto_votes` | `sloppymanifesto_votes` | **OWNER** (R,W,D) | Directional voting |
| `sloppygram_manifesto_comments` | `sloppymanifesto_comments` | **OWNER** (R,W) | Comment management |
| `sloppygram_manifesto_reactions` | `sloppymanifesto_reactions` | **OWNER** (R,W,D) | Reaction toggle |
| `sloppygram_manifesto_tags` | `sloppymanifesto_tags` | **OWNER** (R,W) | Tag creation |
| `sloppygram_manifesto_lineage` | `sloppymanifesto_lineage` | **OWNER** (R,W) | Fork/synthesis tracking |

---

## sloppy-factions (Territory Sovereign) — `sloppyfaction_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_factions` | `sloppyfaction_factions` | **OWNER** (R,W,U) | Faction metadata |
| `sloppygram_faction_members` | `sloppyfaction_members` | **OWNER** (R,W,U,D) | Membership CRUD |
| `sloppygram_faction_battles` | `sloppyfaction_battles` | **OWNER** (R,W,S) | Battle execution |
| `sloppygram_territories` | `sloppyfaction_territories` | **OWNER** (R,W,U,S) | Territory control |

---

## sloppy-groups (Group Chat Sovereign) — `sloppygroup_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_group_conversations` | `sloppygroup_conversations` | **OWNER** (R,W,U) | Group metadata |
| `sloppygram_group_members` | `sloppygroup_members` | **OWNER** (R,W,D,S) | Membership |
| `sloppygram_group_messages` | `sloppygroup_messages` | **OWNER** (R,W,S) | Group messages |

---

## sloppy-canvas (Canvas Sovereign) — `sloppycanvas_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_collab_strokes` | `sloppycanvas_strokes` | **OWNER** (R,W,D) | Stroke data |

---

## sloppy-collab (Document Sovereign) — `sloppycollab_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_collab_documents` | `sloppycollab_documents` | **OWNER** (R,W,U,D) | Collaborative docs |

---

## sloppy-radio (Radio Sovereign) — `sloppyradio_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_radio` | `sloppyradio_tracks` | **OWNER** (R,W,U) | Playlist + playback |

---

## sloppy-quests (Karma Sovereign) — `sloppyquest_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_karma` | `sloppyquest_karma` | **OWNER** (R,U) | Only writer of karma scores |

---

## sloppy-celebrate (Badge Sovereign) — `sloppycelebrate_*`

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_badges` | `sloppycelebrate_badges` | **OWNER** (R,W) | Badge awarding |

---

## sloppygram (Legacy Hub — Retained) — stays `sloppygram_*`

Tables not yet extracted to standalone apps:

| Current Name | Target Name | Access | Notes |
|-------------|-------------|--------|-------|
| `sloppygram_follows` | `sloppygram_follows` | **OWNER** (R,W,D) | Extraction candidate → sloppy-network |
| `sloppygram_mentions` | `sloppygram_mentions` | CO-OWNER (R,W) | Shared with sloppy-chat |
| `sloppygram_doodle_votes` | `sloppygram_doodle_votes` | **OWNER** (R,W,D) | Extraction candidate → doodle app |
| `sloppygram_doodle_comments` | `sloppygram_doodle_comments` | **OWNER** (R,W,S) | Extraction candidate → doodle app |
| `sloppygram_global_settings` | `sloppygram_global_settings` | **OWNER** (R,W) | Hub-only config |
| `sloppygram_global_backgrounds` | `sloppygram_global_backgrounds` | **OWNER** (R,W) | Hub-only assets |
| `sloppygram_reputation` | **DELETE** | ORPHANED | Never written, read-only by sloppy-wallet |

---

## Shared Ecosystem Tables

| Table | Owner | Notes |
|-------|-------|-------|
| `ai_events` | **COLLECTIVE** | 14 apps write (error boundaries), 4+ read |
| `swarm_delegations` | **swarm-nexus** | Delegation governance |
| `swarm_predictions` | **swarm-nexus** | Prediction markets |
| `swarm_prediction_bets` | **swarm-nexus** | Market bets |
| `swarm_proposals` | **swarm-nexus** | Governance proposals |
| `swarm_proposal_amendments` | **swarm-nexus** | Proposal edits |
| `swarm_proposal_comments` | **swarm-nexus** | Discussion |
| `swarm_votes` | **swarm-nexus** | Voting |
| `protocol_improvements` | **sloppy-protocol** | Improvement tracker |
| `protocol_log` | **sloppy-protocol** | Protocol event log |
| `spectrum_endorsements` | **sloppy-spectrum** | Principle endorsements |
| `app_votes` | **sloppy.live** | App leaderboard |
| `sloppy_analytics` | **sloppy.live** | Site analytics |
| `users` | **supabase auth** | System-managed, premium checks |

---

## Rename Map (Quick Reference)

32 tables to rename, 6 stay, 1 delete:

| # | Current → Target | Owner |
|---|-----------------|-------|
| 1 | `sloppygram_profiles` → `sloppyid_profiles` | sloppy-id |
| 2 | `sloppygram_dm_conversations` → `sloppyid_dm_conversations` | sloppy-id |
| 3 | `sloppygram_dm_messages` → `sloppyid_dm_messages` | sloppy-id |
| 4 | `sloppygram_posts` → `sloppyfeed_posts` | sloppy-feed |
| 5 | `sloppygram_post_likes` → `sloppyfeed_post_likes` | sloppy-feed |
| 6 | `sloppygram_post_comments` → `sloppyfeed_post_comments` | sloppy-feed |
| 7 | `sloppygram_post_reactions` → `sloppyfeed_post_reactions` | sloppy-feed |
| 8 | `sloppygram_post_tags` → `sloppyfeed_post_tags` | sloppy-feed |
| 9 | `sloppygram_comment_threads` → `sloppyfeed_comment_threads` | sloppy-feed |
| 10 | `sloppygram_comment_votes` → `sloppyfeed_comment_votes` | sloppy-feed |
| 11 | `sloppygram_messages` → `sloppychat_messages` | sloppy-chat |
| 12 | `sloppygram_message_votes` → `sloppychat_message_votes` | sloppy-chat |
| 13 | `sloppygram_message_reactions` → `sloppychat_message_reactions` | sloppy-chat |
| 14 | `sloppygram_message_tags` → `sloppychat_message_tags` | sloppy-chat |
| 15 | `sloppygram_manifestos` → `sloppymanifesto_manifestos` | sloppy-manifestos |
| 16 | `sloppygram_manifesto_votes` → `sloppymanifesto_votes` | sloppy-manifestos |
| 17 | `sloppygram_manifesto_comments` → `sloppymanifesto_comments` | sloppy-manifestos |
| 18 | `sloppygram_manifesto_reactions` → `sloppymanifesto_reactions` | sloppy-manifestos |
| 19 | `sloppygram_manifesto_tags` → `sloppymanifesto_tags` | sloppy-manifestos |
| 20 | `sloppygram_manifesto_lineage` → `sloppymanifesto_lineage` | sloppy-manifestos |
| 21 | `sloppygram_factions` → `sloppyfaction_factions` | sloppy-factions |
| 22 | `sloppygram_faction_members` → `sloppyfaction_members` | sloppy-factions |
| 23 | `sloppygram_faction_battles` → `sloppyfaction_battles` | sloppy-factions |
| 24 | `sloppygram_territories` → `sloppyfaction_territories` | sloppy-factions |
| 25 | `sloppygram_group_conversations` → `sloppygroup_conversations` | sloppy-groups |
| 26 | `sloppygram_group_members` → `sloppygroup_members` | sloppy-groups |
| 27 | `sloppygram_group_messages` → `sloppygroup_messages` | sloppy-groups |
| 28 | `sloppygram_collab_strokes` → `sloppycanvas_strokes` | sloppy-canvas |
| 29 | `sloppygram_collab_documents` → `sloppycollab_documents` | sloppy-collab |
| 30 | `sloppygram_radio` → `sloppyradio_tracks` | sloppy-radio |
| 31 | `sloppygram_karma` → `sloppyquest_karma` | sloppy-quests |
| 32 | `sloppygram_badges` → `sloppycelebrate_badges` | sloppy-celebrate |

---

## Consumer App Read Access

Apps outside the sovereign ecosystem that read sloppygram_ tables (read-only, no violations):

| App | Tables Read | Purpose |
|-----|------------|---------|
| system-health | 29 tables | Health monitor |
| karma-feed | 13 tables | Karma-weighted aggregator |
| karma-board | 13 tables | Karma leaderboard |
| sloppy-discovery | 11 tables | Discovery feed |
| api | 9 tables | API docs + explorer |
| sloppy-tags | 6 tables | Tag hierarchy viewer |
| trust-metrics-dashboard | 6 tables | Trust metrics |
| sloppy-wallet | 6 tables | Karma/faction display |
| sloppy-cortex | 3 tables | Sentiment analysis |
| search-bridge | 3 tables | Universal search |
| swarm-oracle | 2 tables | Predictions |
| chat-pulse-monitor | 2 tables | Pulse visualization |
| genealogist | 2 tables | Manifesto lineage tree |
| origins | 2 tables | Timeline |
| sloppy-feedback | 1 table | Username lookup |
| sloppy-header | 1 table | Karma badge |
| sloppy-says | 1 table | Chat game |
| prism-echo | 1 table | Visual echo |
| ghost-radar-hub | presence only | User radar |

---

## Governance Notes

- **39 sloppygram_* tables, 12 sovereign apps** — every table has exactly one owner
- **32 tables** mapped to sovereign-prefixed target names
- **6 tables** stay as `sloppygram_*` (hub-retained, not yet extracted)
- **1 table** marked for deletion: `sloppygram_reputation` (orphaned)
- **0 sovereignty violations** as of 2026-02-04 (sloppy-spectrum + blueprint-portal fixed)
- **2 co-owned tables**: DM conversations/messages (sloppy-id + sloppygram)
- **sloppygram_profiles** has the widest read fanout: 21 consumer apps
- **sloppygram_karma** has the strictest write lock: only sloppy-quests can update
- Physical rename is deferred — sovereignty enforced by convention + this registry

## Candidates for Future Extraction

| Current Table | Target App | Target Name |
|--------------|-----------|-------------|
| `sloppygram_follows` | sloppy-network | `sloppynetwork_follows` |
| `sloppygram_mentions` | sloppy-chat (absorb) | `sloppychat_mentions` |
| `sloppygram_doodle_votes` | sloppy-doodle (new) | `sloppydoodle_votes` |
| `sloppygram_doodle_comments` | sloppy-doodle (new) | `sloppydoodle_comments` |
| `sloppygram_reputation` | delete | — |
