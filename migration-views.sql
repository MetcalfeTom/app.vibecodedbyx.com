-- =============================================================================
-- Universal Schema Views: Bridge old sloppygram_* names to new layer names
-- Generated: 2026-02-04
--
-- These views alias the new schema-layers naming convention to the existing
-- physical tables. Apps can gradually migrate to the new names while old
-- names continue to work.
--
-- To apply: paste into Supabase Dashboard > SQL Editor > Run
-- =============================================================================

-- =============================================================================
-- LAYER 1: identity (1 view)
-- =============================================================================

CREATE OR REPLACE VIEW identity_profiles AS
  SELECT * FROM sloppygram_profiles;

-- =============================================================================
-- LAYER 2: social (14 views)
-- =============================================================================

CREATE OR REPLACE VIEW social_follows AS
  SELECT * FROM sloppygram_follows;

CREATE OR REPLACE VIEW social_mentions AS
  SELECT * FROM sloppygram_mentions;

CREATE OR REPLACE VIEW social_dm_conversations AS
  SELECT * FROM sloppygram_dm_conversations;

CREATE OR REPLACE VIEW social_dm_messages AS
  SELECT * FROM sloppygram_dm_messages;

CREATE OR REPLACE VIEW social_group_conversations AS
  SELECT * FROM sloppygram_group_conversations;

CREATE OR REPLACE VIEW social_group_members AS
  SELECT * FROM sloppygram_group_members;

CREATE OR REPLACE VIEW social_group_messages AS
  SELECT * FROM sloppygram_group_messages;

CREATE OR REPLACE VIEW social_posts AS
  SELECT * FROM sloppygram_posts;

CREATE OR REPLACE VIEW social_messages AS
  SELECT * FROM sloppygram_messages;

CREATE OR REPLACE VIEW social_manifestos AS
  SELECT * FROM sloppygram_manifestos;

CREATE OR REPLACE VIEW social_post_comments AS
  SELECT * FROM sloppygram_post_comments;

CREATE OR REPLACE VIEW social_manifesto_comments AS
  SELECT * FROM sloppygram_manifesto_comments;

CREATE OR REPLACE VIEW social_comment_threads AS
  SELECT * FROM sloppygram_comment_threads;

CREATE OR REPLACE VIEW social_doodle_comments AS
  SELECT * FROM sloppygram_doodle_comments;

-- =============================================================================
-- LAYER 3: economy (14 views)
-- =============================================================================

CREATE OR REPLACE VIEW economy_karma AS
  SELECT * FROM sloppygram_karma;

CREATE OR REPLACE VIEW economy_badges AS
  SELECT * FROM sloppygram_badges;

CREATE OR REPLACE VIEW economy_post_likes AS
  SELECT * FROM sloppygram_post_likes;

CREATE OR REPLACE VIEW economy_post_reactions AS
  SELECT * FROM sloppygram_post_reactions;

CREATE OR REPLACE VIEW economy_post_tags AS
  SELECT * FROM sloppygram_post_tags;

CREATE OR REPLACE VIEW economy_comment_votes AS
  SELECT * FROM sloppygram_comment_votes;

CREATE OR REPLACE VIEW economy_message_votes AS
  SELECT * FROM sloppygram_message_votes;

CREATE OR REPLACE VIEW economy_message_reactions AS
  SELECT * FROM sloppygram_message_reactions;

CREATE OR REPLACE VIEW economy_message_tags AS
  SELECT * FROM sloppygram_message_tags;

CREATE OR REPLACE VIEW economy_manifesto_votes AS
  SELECT * FROM sloppygram_manifesto_votes;

CREATE OR REPLACE VIEW economy_manifesto_reactions AS
  SELECT * FROM sloppygram_manifesto_reactions;

CREATE OR REPLACE VIEW economy_manifesto_tags AS
  SELECT * FROM sloppygram_manifesto_tags;

CREATE OR REPLACE VIEW economy_manifesto_lineage AS
  SELECT * FROM sloppygram_manifesto_lineage;

CREATE OR REPLACE VIEW economy_doodle_votes AS
  SELECT * FROM sloppygram_doodle_votes;

-- =============================================================================
-- LAYER 4: gov (6 views)
-- =============================================================================

CREATE OR REPLACE VIEW gov_factions AS
  SELECT * FROM sloppygram_factions;

CREATE OR REPLACE VIEW gov_faction_members AS
  SELECT * FROM sloppygram_faction_members;

CREATE OR REPLACE VIEW gov_faction_battles AS
  SELECT * FROM sloppygram_faction_battles;

CREATE OR REPLACE VIEW gov_territories AS
  SELECT * FROM sloppygram_territories;

CREATE OR REPLACE VIEW gov_settings AS
  SELECT * FROM sloppygram_global_settings;

CREATE OR REPLACE VIEW gov_backgrounds AS
  SELECT * FROM sloppygram_global_backgrounds;

-- =============================================================================
-- LAYER 5: world (3 views)
-- =============================================================================

CREATE OR REPLACE VIEW world_strokes AS
  SELECT * FROM sloppygram_collab_strokes;

CREATE OR REPLACE VIEW world_documents AS
  SELECT * FROM sloppygram_collab_documents;

CREATE OR REPLACE VIEW world_radio AS
  SELECT * FROM sloppygram_radio;

-- =============================================================================
-- SUMMARY: 38 views created
--
-- Layer 1: identity  —  1 view
-- Layer 2: social    — 14 views
-- Layer 3: economy   — 14 views
-- Layer 4: gov       —  6 views
-- Layer 5: world     —  3 views
--
-- NOTE: Views inherit RLS from underlying tables. Writes through views
-- require the underlying table's INSERT/UPDATE/DELETE policies to pass.
-- Some Supabase setups may need INSTEAD OF triggers for writable views.
--
-- MIGRATION PATH:
-- 1. Run this script to create views (non-destructive)
-- 2. New apps use new names (identity_*, social_*, etc.)
-- 3. Gradually update existing apps from sloppygram_* to new names
-- 4. Once all apps migrated: rename tables, drop views
-- =============================================================================
