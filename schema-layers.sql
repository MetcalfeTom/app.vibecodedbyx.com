-- =============================================================================
-- Universal Layer Schema: Rename SQL
-- Generated: 2026-02-04
--
-- 5 layers: identity, social, economy, gov, world
-- 39 sloppygram_* tables → layer-prefixed names
--
-- WARNING: This is a coordinated migration. All 30+ consumer apps must be
-- updated simultaneously. Do NOT run piecemeal. Use a maintenance window.
--
-- Execution order: renames first, then drop orphaned table, then update RLS.
-- =============================================================================

BEGIN;

-- =============================================================================
-- LAYER 1: identity (1 table)
-- =============================================================================

ALTER TABLE sloppygram_profiles RENAME TO identity_profiles;

-- Also rename sloppyid_* tables to match layer convention:
-- ALTER TABLE sloppyid_vault RENAME TO identity_vault;
-- ALTER TABLE sloppyid_verifications RENAME TO identity_verifications;

-- =============================================================================
-- LAYER 2: social (14 tables)
-- =============================================================================

ALTER TABLE sloppygram_follows RENAME TO social_follows;
ALTER TABLE sloppygram_mentions RENAME TO social_mentions;
ALTER TABLE sloppygram_dm_conversations RENAME TO social_dm_conversations;
ALTER TABLE sloppygram_dm_messages RENAME TO social_dm_messages;
ALTER TABLE sloppygram_group_conversations RENAME TO social_group_conversations;
ALTER TABLE sloppygram_group_members RENAME TO social_group_members;
ALTER TABLE sloppygram_group_messages RENAME TO social_group_messages;
ALTER TABLE sloppygram_posts RENAME TO social_posts;
ALTER TABLE sloppygram_messages RENAME TO social_messages;
ALTER TABLE sloppygram_manifestos RENAME TO social_manifestos;
ALTER TABLE sloppygram_post_comments RENAME TO social_post_comments;
ALTER TABLE sloppygram_manifesto_comments RENAME TO social_manifesto_comments;
ALTER TABLE sloppygram_comment_threads RENAME TO social_comment_threads;
ALTER TABLE sloppygram_doodle_comments RENAME TO social_doodle_comments;

-- =============================================================================
-- LAYER 3: economy (15 tables — 14 rename, 1 drop)
-- =============================================================================

ALTER TABLE sloppygram_karma RENAME TO economy_karma;
ALTER TABLE sloppygram_badges RENAME TO economy_badges;
ALTER TABLE sloppygram_post_likes RENAME TO economy_post_likes;
ALTER TABLE sloppygram_post_reactions RENAME TO economy_post_reactions;
ALTER TABLE sloppygram_post_tags RENAME TO economy_post_tags;
ALTER TABLE sloppygram_comment_votes RENAME TO economy_comment_votes;
ALTER TABLE sloppygram_message_votes RENAME TO economy_message_votes;
ALTER TABLE sloppygram_message_reactions RENAME TO economy_message_reactions;
ALTER TABLE sloppygram_message_tags RENAME TO economy_message_tags;
ALTER TABLE sloppygram_manifesto_votes RENAME TO economy_manifesto_votes;
ALTER TABLE sloppygram_manifesto_reactions RENAME TO economy_manifesto_reactions;
ALTER TABLE sloppygram_manifesto_tags RENAME TO economy_manifesto_tags;
ALTER TABLE sloppygram_manifesto_lineage RENAME TO economy_manifesto_lineage;
ALTER TABLE sloppygram_doodle_votes RENAME TO economy_doodle_votes;

-- Orphaned table: never written, read-only by sloppy-wallet
DROP TABLE IF EXISTS sloppygram_reputation;

-- =============================================================================
-- LAYER 4: gov (6 tables)
-- =============================================================================

ALTER TABLE sloppygram_factions RENAME TO gov_factions;
ALTER TABLE sloppygram_faction_members RENAME TO gov_faction_members;
ALTER TABLE sloppygram_faction_battles RENAME TO gov_faction_battles;
ALTER TABLE sloppygram_territories RENAME TO gov_territories;
ALTER TABLE sloppygram_global_settings RENAME TO gov_settings;
ALTER TABLE sloppygram_global_backgrounds RENAME TO gov_backgrounds;

-- =============================================================================
-- LAYER 5: world (3 tables)
-- =============================================================================

ALTER TABLE sloppygram_collab_strokes RENAME TO world_strokes;
ALTER TABLE sloppygram_collab_documents RENAME TO world_documents;
ALTER TABLE sloppygram_radio RENAME TO world_radio;

-- =============================================================================
-- UPDATE RLS POLICIES
-- RLS policies reference table names; after rename they auto-update.
-- But policies with hardcoded table names in CHECK expressions need refresh.
-- =============================================================================

-- Verify all RLS policies are intact after rename:
-- SELECT schemaname, tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- =============================================================================
-- REALTIME SUBSCRIPTIONS
-- Any postgres_changes subscriptions using old table names must be updated
-- in application code BEFORE or DURING this migration.
--
-- Tables with realtime (S flag):
--   social_dm_messages, social_group_members, social_group_messages,
--   social_posts, social_messages, social_manifestos,
--   social_post_comments, social_comment_threads, social_doodle_comments,
--   gov_faction_battles, gov_territories
-- =============================================================================

COMMIT;

-- =============================================================================
-- VERIFICATION QUERIES (run after migration)
-- =============================================================================

-- Count tables per layer:
-- SELECT
--   CASE
--     WHEN tablename LIKE 'identity_%' THEN 'identity'
--     WHEN tablename LIKE 'social_%' THEN 'social'
--     WHEN tablename LIKE 'economy_%' THEN 'economy'
--     WHEN tablename LIKE 'gov_%' THEN 'gov'
--     WHEN tablename LIKE 'world_%' THEN 'world'
--     ELSE 'other'
--   END AS layer,
--   COUNT(*) AS table_count
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- GROUP BY layer
-- ORDER BY layer;

-- Confirm no sloppygram_* tables remain:
-- SELECT tablename FROM pg_tables
-- WHERE schemaname = 'public' AND tablename LIKE 'sloppygram_%';
