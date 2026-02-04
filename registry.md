# Universal Capability Schema: Table Ownership Registry

Last updated: 2026-02-04

Tables are organized by **functional capability** — what the data *does* — not which app owns it. Every table has exactly one sovereign app as the authoritative write controller. Other apps may read, but the owner is the single source of truth for writes.

Legend: **R**=Read **W**=Write **U**=Update **D**=Delete **S**=Subscribe(realtime)

---

## Capability Domains

| Prefix | Domain | Description | Tables |
|--------|--------|-------------|--------|
| `identity_` | Identity | Who you are — profiles, credentials, trust | 3 |
| `social_` | Social | How you connect — follows, DMs, groups, mentions | 7 |
| `content_` | Content | What you create — posts, messages, manifestos, docs | 4 |
| `engage_` | Engagement | How you interact — votes, reactions, comments, tags, threads | 16 |
| `engine_` | Engine | System mechanics — karma, badges, reputation | 3 |
| `territory_` | Territory | Spatial control — factions, battles, zones | 4 |
| `collab_` | Collaboration | Real-time co-creation — canvas strokes | 1 |
| `media_` | Media | Streaming and playback — radio | 1 |
| `config_` | Configuration | Hub settings and assets | 2 |
| | | **Total** | **41** |

---

## identity_ (Identity Domain)

Who you are. Profiles, credentials, trust scores, verification badges.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_profiles` | `identity_profiles` | **sloppy-id** | OWNER (R,W,U) | Single source of truth; 21 readers |
| `sloppyid_vault` | `identity_vault` | **sloppy-id** | OWNER (R,W,U) | Non-profile key-value storage |
| `sloppyid_verifications` | `identity_verifications` | **sloppy-id** | OWNER (R,W) | Trust/verification badges |

---

## social_ (Social Domain)

How you connect. Follows, direct messages, group conversations, mentions.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_follows` | `social_follows` | **sloppygram** | OWNER (R,W,D) | Extraction candidate → sloppy-network |
| `sloppygram_mentions` | `social_mentions` | **sloppygram** | CO-OWNER (R,W) | Shared with sloppy-chat |
| `sloppygram_dm_conversations` | `social_dm_conversations` | **sloppy-id** | CO-OWNER (R,U) | Shared with sloppygram |
| `sloppygram_dm_messages` | `social_dm_messages` | **sloppy-id** | CO-OWNER (R,W,S) | Shared with sloppygram |
| `sloppygram_group_conversations` | `social_group_conversations` | **sloppy-groups** | OWNER (R,W,U) | Group metadata |
| `sloppygram_group_members` | `social_group_members` | **sloppy-groups** | OWNER (R,W,D,S) | Membership |
| `sloppygram_group_messages` | `social_group_messages` | **sloppy-groups** | OWNER (R,W,S) | Group messages |

---

## content_ (Content Domain)

What you create. Posts, chat messages, manifestos, collaborative documents.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_posts` | `content_posts` | **sloppy-feed** | OWNER (R,W,D,S) | Authoritative post CRUD |
| `sloppygram_messages` | `content_messages` | **sloppy-chat** | OWNER (R,W,D,S) | Authoritative chat CRUD |
| `sloppygram_manifestos` | `content_manifestos` | **sloppy-manifestos** | OWNER (R,W,D,S) | Manifesto CRUD |
| `sloppygram_collab_documents` | `content_documents` | **sloppy-collab** | OWNER (R,W,U,D) | Collaborative docs |

---

## engage_ (Engagement Domain)

How you interact with content. Votes, reactions, comments, tags, threads, lineage.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_post_likes` | `engage_post_likes` | **sloppy-feed** | OWNER (R,W,D) | Post voting |
| `sloppygram_post_comments` | `engage_post_comments` | **sloppy-feed** | OWNER (R,W,S) | Post comments |
| `sloppygram_post_reactions` | `engage_post_reactions` | **sloppy-feed** | OWNER (R,W,D) | Post reactions |
| `sloppygram_post_tags` | `engage_post_tags` | **sloppy-feed** | OWNER (R,W) | Post tags |
| `sloppygram_comment_threads` | `engage_comment_threads` | **sloppy-feed** | OWNER (R,W,S) | Thread hierarchy |
| `sloppygram_comment_votes` | `engage_comment_votes` | **sloppy-feed** | OWNER (R,W,D) | Comment voting |
| `sloppygram_message_votes` | `engage_message_votes` | **sloppy-chat** | OWNER (R,W,D) | Message voting |
| `sloppygram_message_reactions` | `engage_message_reactions` | **sloppy-chat** | OWNER (R,W,D) | Message reactions |
| `sloppygram_message_tags` | `engage_message_tags` | **sloppy-chat** | OWNER (R,W) | Message tagging |
| `sloppygram_manifesto_votes` | `engage_manifesto_votes` | **sloppy-manifestos** | OWNER (R,W,D) | Directional voting |
| `sloppygram_manifesto_comments` | `engage_manifesto_comments` | **sloppy-manifestos** | OWNER (R,W) | Manifesto comments |
| `sloppygram_manifesto_reactions` | `engage_manifesto_reactions` | **sloppy-manifestos** | OWNER (R,W,D) | Manifesto reactions |
| `sloppygram_manifesto_tags` | `engage_manifesto_tags` | **sloppy-manifestos** | OWNER (R,W) | Manifesto tags |
| `sloppygram_manifesto_lineage` | `engage_manifesto_lineage` | **sloppy-manifestos** | OWNER (R,W) | Fork/synthesis tracking |
| `sloppygram_doodle_votes` | `engage_doodle_votes` | **sloppygram** | OWNER (R,W,D) | Not yet extracted |
| `sloppygram_doodle_comments` | `engage_doodle_comments` | **sloppygram** | OWNER (R,W,S) | Not yet extracted |

---

## engine_ (Engine Domain)

System mechanics. Karma scoring, badge awarding, reputation tracking.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_karma` | `engine_karma` | **sloppy-quests** | OWNER (R,U) | Strictest write lock in ecosystem |
| `sloppygram_badges` | `engine_badges` | **sloppy-celebrate** | OWNER (R,W) | Badge awarding |
| `sloppygram_reputation` | ~~`engine_reputation`~~ | **DELETE** | ORPHANED | Never written; read-only by sloppy-wallet |

---

## territory_ (Territory Domain)

Spatial control. Factions, membership, warfare, zone ownership.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_factions` | `territory_factions` | **sloppy-factions** | OWNER (R,W,U) | Faction metadata |
| `sloppygram_faction_members` | `territory_members` | **sloppy-factions** | OWNER (R,W,U,D) | Membership CRUD |
| `sloppygram_faction_battles` | `territory_battles` | **sloppy-factions** | OWNER (R,W,S) | Battle execution |
| `sloppygram_territories` | `territory_zones` | **sloppy-factions** | OWNER (R,W,U,S) | Zone control |

---

## collab_ (Collaboration Domain)

Real-time co-creation. Canvas strokes, shared drawing.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_collab_strokes` | `collab_strokes` | **sloppy-canvas** | OWNER (R,W,D) | Stroke data |

---

## media_ (Media Domain)

Streaming and playback. Community radio, playlists.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_radio` | `media_radio` | **sloppy-radio** | OWNER (R,W,U) | Playlist + playback |

---

## config_ (Configuration Domain)

Hub-level settings and shared assets.

| Current Name | Capability Name | Owner | Access | Notes |
|-------------|----------------|-------|--------|-------|
| `sloppygram_global_settings` | `config_settings` | **sloppygram** | OWNER (R,W) | Hub-only config |
| `sloppygram_global_backgrounds` | `config_backgrounds` | **sloppygram** | OWNER (R,W) | Hub-only assets |

---

## Shared Ecosystem Tables (Non-sloppygram)

Already using functional or app-specific names:

| Table | Capability | Owner | Notes |
|-------|-----------|-------|-------|
| `ai_events` | engine | **COLLECTIVE** | 14 apps write (error boundaries), 4+ read |
| `swarm_delegations` | governance | **swarm-nexus** | Delegation governance |
| `swarm_predictions` | governance | **swarm-nexus** | Prediction markets |
| `swarm_prediction_bets` | governance | **swarm-nexus** | Market bets |
| `swarm_proposals` | governance | **swarm-nexus** | Governance proposals |
| `swarm_proposal_amendments` | governance | **swarm-nexus** | Proposal edits |
| `swarm_proposal_comments` | governance | **swarm-nexus** | Discussion |
| `swarm_votes` | governance | **swarm-nexus** | Voting |
| `protocol_improvements` | engine | **sloppy-protocol** | Improvement tracker |
| `protocol_log` | engine | **sloppy-protocol** | Protocol event log |
| `spectrum_endorsements` | engage | **sloppy-spectrum** | Principle endorsements |
| `app_votes` | engage | **sloppy.live** | App leaderboard |
| `sloppy_analytics` | engine | **sloppy.live** | Site analytics |
| `users` | identity | **supabase auth** | System-managed, premium checks |

---

## Capability Rename Map (Quick Reference)

39 sloppygram_* tables + 2 sloppyid_* = 41 total. 38 rename, 2 already correct, 1 delete:

| # | Current → Capability | Domain | Owner |
|---|---------------------|--------|-------|
| 1 | `sloppygram_profiles` → `identity_profiles` | identity | sloppy-id |
| 2 | `sloppygram_dm_conversations` → `social_dm_conversations` | social | sloppy-id |
| 3 | `sloppygram_dm_messages` → `social_dm_messages` | social | sloppy-id |
| 4 | `sloppygram_follows` → `social_follows` | social | sloppygram |
| 5 | `sloppygram_mentions` → `social_mentions` | social | sloppygram |
| 6 | `sloppygram_group_conversations` → `social_group_conversations` | social | sloppy-groups |
| 7 | `sloppygram_group_members` → `social_group_members` | social | sloppy-groups |
| 8 | `sloppygram_group_messages` → `social_group_messages` | social | sloppy-groups |
| 9 | `sloppygram_posts` → `content_posts` | content | sloppy-feed |
| 10 | `sloppygram_messages` → `content_messages` | content | sloppy-chat |
| 11 | `sloppygram_manifestos` → `content_manifestos` | content | sloppy-manifestos |
| 12 | `sloppygram_collab_documents` → `content_documents` | content | sloppy-collab |
| 13 | `sloppygram_post_likes` → `engage_post_likes` | engage | sloppy-feed |
| 14 | `sloppygram_post_comments` → `engage_post_comments` | engage | sloppy-feed |
| 15 | `sloppygram_post_reactions` → `engage_post_reactions` | engage | sloppy-feed |
| 16 | `sloppygram_post_tags` → `engage_post_tags` | engage | sloppy-feed |
| 17 | `sloppygram_comment_threads` → `engage_comment_threads` | engage | sloppy-feed |
| 18 | `sloppygram_comment_votes` → `engage_comment_votes` | engage | sloppy-feed |
| 19 | `sloppygram_message_votes` → `engage_message_votes` | engage | sloppy-chat |
| 20 | `sloppygram_message_reactions` → `engage_message_reactions` | engage | sloppy-chat |
| 21 | `sloppygram_message_tags` → `engage_message_tags` | engage | sloppy-chat |
| 22 | `sloppygram_manifesto_votes` → `engage_manifesto_votes` | engage | sloppy-manifestos |
| 23 | `sloppygram_manifesto_comments` → `engage_manifesto_comments` | engage | sloppy-manifestos |
| 24 | `sloppygram_manifesto_reactions` → `engage_manifesto_reactions` | engage | sloppy-manifestos |
| 25 | `sloppygram_manifesto_tags` → `engage_manifesto_tags` | engage | sloppy-manifestos |
| 26 | `sloppygram_manifesto_lineage` → `engage_manifesto_lineage` | engage | sloppy-manifestos |
| 27 | `sloppygram_doodle_votes` → `engage_doodle_votes` | engage | sloppygram |
| 28 | `sloppygram_doodle_comments` → `engage_doodle_comments` | engage | sloppygram |
| 29 | `sloppygram_karma` → `engine_karma` | engine | sloppy-quests |
| 30 | `sloppygram_badges` → `engine_badges` | engine | sloppy-celebrate |
| 31 | `sloppygram_reputation` → **DELETE** | engine | orphaned |
| 32 | `sloppygram_factions` → `territory_factions` | territory | sloppy-factions |
| 33 | `sloppygram_faction_members` → `territory_members` | territory | sloppy-factions |
| 34 | `sloppygram_faction_battles` → `territory_battles` | territory | sloppy-factions |
| 35 | `sloppygram_territories` → `territory_zones` | territory | sloppy-factions |
| 36 | `sloppygram_collab_strokes` → `collab_strokes` | collab | sloppy-canvas |
| 37 | `sloppygram_radio` → `media_radio` | media | sloppy-radio |
| 38 | `sloppygram_global_settings` → `config_settings` | config | sloppygram |
| 39 | `sloppygram_global_backgrounds` → `config_backgrounds` | config | sloppygram |

---

## Consumer App Read Access

Apps outside the sovereign ecosystem that read tables (read-only, no violations):

| App | Tables Read | Domains Touched |
|-----|------------|----------------|
| system-health | 29 tables | identity, content, engage, engine, social, collab, media, config |
| karma-feed | 13 tables | content, engage |
| karma-board | 13 tables | content, engage, social, identity |
| sloppy-discovery | 11 tables | content, engage, social |
| api | 9 tables | content, engage |
| sloppy-tags | 6 tables | content, engage |
| trust-metrics-dashboard | 6 tables | content, engage |
| sloppy-wallet | 6 tables | identity, engine, territory |
| sloppy-cortex | 3 tables | content |
| search-bridge | 3 tables | content |
| swarm-oracle | 2 tables | identity, engine |
| chat-pulse-monitor | 2 tables | content |
| genealogist | 2 tables | content, engage |
| origins | 2 tables | content |
| sloppy-feedback | 1 table | identity |
| sloppy-header | 1 table | engine |
| sloppy-says | 1 table | content |
| prism-echo | 1 table | content |
| ghost-radar-hub | presence | social |

---

## Governance Notes

- **9 capability domains** spanning **41 tables** across **12 sovereign apps**
- **38 tables** mapped to capability-prefixed names
- **2 tables** already correctly named (`sloppyid_vault`, `sloppyid_verifications`)
- **1 table** marked for deletion: `sloppygram_reputation` (orphaned)
- **0 sovereignty violations** as of 2026-02-04
- **2 co-owned tables**: DM conversations/messages (sloppy-id + sloppygram)
- **`identity_profiles`** has the widest read fanout: 21 consumer apps
- **`engine_karma`** has the strictest write lock: only sloppy-quests can update
- Physical rename is deferred — sovereignty enforced by convention + this registry
- Capability prefixes are app-agnostic: if ownership transfers, the name stays stable

## Candidates for Future Extraction

| Current Table | Target App | Capability Name | Domain |
|--------------|-----------|----------------|--------|
| `sloppygram_follows` | sloppy-network | `social_follows` | social |
| `sloppygram_mentions` | sloppy-chat (absorb) | `social_mentions` | social |
| `sloppygram_doodle_votes` | sloppy-doodle (new) | `engage_doodle_votes` | engage |
| `sloppygram_doodle_comments` | sloppy-doodle (new) | `engage_doodle_comments` | engage |
| `sloppygram_reputation` | delete | — | — |
