# Universal Layer Schema: Table Ownership Registry

Last updated: 2026-02-04

All 39 `sloppygram_*` tables mapped to **5 universal layers** — identity, social, economy, gov, world. Every table has exactly one sovereign app as the authoritative write controller.

Legend: **R**=Read **W**=Write **U**=Update **D**=Delete **S**=Subscribe(realtime)

---

## Layer Overview

| Layer | Purpose | Tables | Prefix |
|-------|---------|--------|--------|
| **identity** | Who you are | 1 | `identity_` |
| **social** | How you connect and create | 14 | `social_` |
| **economy** | Value signals and engagement | 15 | `economy_` |
| **gov** | Governance, factions, system rules | 6 | `gov_` |
| **world** | Shared environment and artifacts | 3 | `world_` |
| | | **39** | |

---

## identity (1 table)

Who you are. Profile data, the single source of truth for user representation.

| # | Current Name | Layer Name | Owner | Access |
|---|-------------|-----------|-------|--------|
| 1 | `sloppygram_profiles` | `identity_profiles` | **sloppy-id** | OWNER (R,W,U) |

21 apps read `identity_profiles`. Only sloppy-id writes.

Also governed by sloppy-id but already outside the `sloppygram_*` namespace:
- `sloppyid_vault` → `identity_vault` (non-profile key-value storage)
- `sloppyid_verifications` → `identity_verifications` (trust/verification badges)

---

## social (14 tables)

How you connect, communicate, and create. Follows, DMs, groups, posts, messages, manifestos, comments, threads.

| # | Current Name | Layer Name | Owner | Access |
|---|-------------|-----------|-------|--------|
| 2 | `sloppygram_follows` | `social_follows` | **sloppygram** | OWNER (R,W,D) |
| 3 | `sloppygram_mentions` | `social_mentions` | **sloppygram** | CO-OWNER (R,W) |
| 4 | `sloppygram_dm_conversations` | `social_dm_conversations` | **sloppy-id** | CO-OWNER (R,U) |
| 5 | `sloppygram_dm_messages` | `social_dm_messages` | **sloppy-id** | CO-OWNER (R,W,S) |
| 6 | `sloppygram_group_conversations` | `social_group_conversations` | **sloppy-groups** | OWNER (R,W,U) |
| 7 | `sloppygram_group_members` | `social_group_members` | **sloppy-groups** | OWNER (R,W,D,S) |
| 8 | `sloppygram_group_messages` | `social_group_messages` | **sloppy-groups** | OWNER (R,W,S) |
| 9 | `sloppygram_posts` | `social_posts` | **sloppy-feed** | OWNER (R,W,D,S) |
| 10 | `sloppygram_messages` | `social_messages` | **sloppy-chat** | OWNER (R,W,D,S) |
| 11 | `sloppygram_manifestos` | `social_manifestos` | **sloppy-manifestos** | OWNER (R,W,D,S) |
| 12 | `sloppygram_post_comments` | `social_post_comments` | **sloppy-feed** | OWNER (R,W,S) |
| 13 | `sloppygram_manifesto_comments` | `social_manifesto_comments` | **sloppy-manifestos** | OWNER (R,W) |
| 14 | `sloppygram_comment_threads` | `social_comment_threads` | **sloppy-feed** | OWNER (R,W,S) |
| 15 | `sloppygram_doodle_comments` | `social_doodle_comments` | **sloppygram** | OWNER (R,W,S) |

---

## economy (15 tables)

Value signals and engagement. Karma, badges, votes, reactions, tags, lineage — everything that assigns worth to content.

| # | Current Name | Layer Name | Owner | Access |
|---|-------------|-----------|-------|--------|
| 16 | `sloppygram_karma` | `economy_karma` | **sloppy-quests** | OWNER (R,U) |
| 17 | `sloppygram_badges` | `economy_badges` | **sloppy-celebrate** | OWNER (R,W) |
| 18 | `sloppygram_reputation` | ~~`economy_reputation`~~ | **DELETE** | ORPHANED |
| 19 | `sloppygram_post_likes` | `economy_post_likes` | **sloppy-feed** | OWNER (R,W,D) |
| 20 | `sloppygram_post_reactions` | `economy_post_reactions` | **sloppy-feed** | OWNER (R,W,D) |
| 21 | `sloppygram_post_tags` | `economy_post_tags` | **sloppy-feed** | OWNER (R,W) |
| 22 | `sloppygram_comment_votes` | `economy_comment_votes` | **sloppy-feed** | OWNER (R,W,D) |
| 23 | `sloppygram_message_votes` | `economy_message_votes` | **sloppy-chat** | OWNER (R,W,D) |
| 24 | `sloppygram_message_reactions` | `economy_message_reactions` | **sloppy-chat** | OWNER (R,W,D) |
| 25 | `sloppygram_message_tags` | `economy_message_tags` | **sloppy-chat** | OWNER (R,W) |
| 26 | `sloppygram_manifesto_votes` | `economy_manifesto_votes` | **sloppy-manifestos** | OWNER (R,W,D) |
| 27 | `sloppygram_manifesto_reactions` | `economy_manifesto_reactions` | **sloppy-manifestos** | OWNER (R,W,D) |
| 28 | `sloppygram_manifesto_tags` | `economy_manifesto_tags` | **sloppy-manifestos** | OWNER (R,W) |
| 29 | `sloppygram_manifesto_lineage` | `economy_manifesto_lineage` | **sloppy-manifestos** | OWNER (R,W) |
| 30 | `sloppygram_doodle_votes` | `economy_doodle_votes` | **sloppygram** | OWNER (R,W,D) |

---

## gov (6 tables)

Governance, factions, territorial control, and system-level configuration.

| # | Current Name | Layer Name | Owner | Access |
|---|-------------|-----------|-------|--------|
| 31 | `sloppygram_factions` | `gov_factions` | **sloppy-factions** | OWNER (R,W,U) |
| 32 | `sloppygram_faction_members` | `gov_faction_members` | **sloppy-factions** | OWNER (R,W,U,D) |
| 33 | `sloppygram_faction_battles` | `gov_faction_battles` | **sloppy-factions** | OWNER (R,W,S) |
| 34 | `sloppygram_territories` | `gov_territories` | **sloppy-factions** | OWNER (R,W,U,S) |
| 35 | `sloppygram_global_settings` | `gov_settings` | **sloppygram** | OWNER (R,W) |
| 36 | `sloppygram_global_backgrounds` | `gov_backgrounds` | **sloppygram** | OWNER (R,W) |

---

## world (3 tables)

Shared environment and artifacts. Canvas, documents, radio — the collective space.

| # | Current Name | Layer Name | Owner | Access |
|---|-------------|-----------|-------|--------|
| 37 | `sloppygram_collab_strokes` | `world_strokes` | **sloppy-canvas** | OWNER (R,W,D) |
| 38 | `sloppygram_collab_documents` | `world_documents` | **sloppy-collab** | OWNER (R,W,U,D) |
| 39 | `sloppygram_radio` | `world_radio` | **sloppy-radio** | OWNER (R,W,U) |

---

## Shared Ecosystem Tables (Non-sloppygram)

| Table | Layer | Owner | Notes |
|-------|-------|-------|-------|
| `ai_events` | economy | **COLLECTIVE** | 14 apps write (error boundaries) |
| `swarm_delegations` | gov | **swarm-nexus** | Delegation governance |
| `swarm_predictions` | gov | **swarm-nexus** | Prediction markets |
| `swarm_prediction_bets` | gov | **swarm-nexus** | Market bets |
| `swarm_proposals` | gov | **swarm-nexus** | Governance proposals |
| `swarm_proposal_amendments` | gov | **swarm-nexus** | Proposal edits |
| `swarm_proposal_comments` | gov | **swarm-nexus** | Discussion |
| `swarm_votes` | gov | **swarm-nexus** | Voting |
| `protocol_improvements` | economy | **sloppy-protocol** | Improvement tracker |
| `protocol_log` | economy | **sloppy-protocol** | Protocol event log |
| `spectrum_endorsements` | economy | **sloppy-spectrum** | Principle endorsements |
| `app_votes` | economy | **sloppy.live** | App leaderboard |
| `sloppy_analytics` | economy | **sloppy.live** | Site analytics |
| `users` | identity | **supabase auth** | System-managed |

---

## Consumer App Read Access

| App | Tables Read | Layers Touched |
|-----|------------|---------------|
| system-health | 29 tables | identity, social, economy, gov, world |
| karma-feed | 13 tables | social, economy |
| karma-board | 13 tables | identity, social, economy |
| sloppy-discovery | 11 tables | social, economy |
| api | 9 tables | social, economy |
| sloppy-tags | 6 tables | social, economy |
| trust-metrics-dashboard | 6 tables | social, economy |
| sloppy-wallet | 6 tables | identity, economy, gov |
| sloppy-cortex | 3 tables | social |
| search-bridge | 3 tables | social |
| swarm-oracle | 2 tables | identity, economy |
| chat-pulse-monitor | 2 tables | social |
| genealogist | 2 tables | social, economy |
| origins | 2 tables | social |
| sloppy-feedback | 1 table | identity |
| sloppy-header | 1 table | economy |
| sloppy-says | 1 table | social |
| prism-echo | 1 table | social |
| ghost-radar-hub | presence | social |

---

## Governance Notes

- **5 universal layers** spanning **39 tables** across **12 sovereign apps**
- **Distribution**: identity(1) social(14) economy(15) gov(6) world(3)
- **1 table** marked for deletion: `sloppygram_reputation` (orphaned)
- **0 sovereignty violations** as of 2026-02-04
- **2 co-owned tables**: DM conversations/messages (sloppy-id + sloppygram)
- **`identity_profiles`** has the widest read fanout: 21 consumer apps
- **`economy_karma`** has the strictest write lock: only sloppy-quests can update
- Physical rename is deferred — sovereignty enforced by convention + this registry
- Layer names are app-agnostic: ownership can transfer without renaming

## Candidates for Future Extraction

| Current Table | Layer | Target App | Layer Name |
|--------------|-------|-----------|-----------|
| `sloppygram_follows` | social | sloppy-network | `social_follows` |
| `sloppygram_mentions` | social | sloppy-chat | `social_mentions` |
| `sloppygram_doodle_votes` | economy | sloppy-doodle | `economy_doodle_votes` |
| `sloppygram_doodle_comments` | social | sloppy-doodle | `social_doodle_comments` |
| `sloppygram_reputation` | economy | delete | — |
