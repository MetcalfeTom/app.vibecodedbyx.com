-- =============================================================================
-- Universal Layer Schema: CREATE TABLE Definitions
-- Generated: 2026-02-04
--
-- 5 layers: identity, social, economy, gov, world
-- 38 tables (39 minus sloppygram_reputation which is deleted)
--
-- Every table includes: user_id (uuid), created_at, updated_at
-- RLS default: users can read all rows, write/update/delete own rows
-- =============================================================================

-- =============================================================================
-- LAYER 1: identity (1 table)
-- Who you are. Profile data, single source of truth.
-- Owner: sloppy-id
-- =============================================================================

CREATE TABLE identity_profiles (
  username       text,
  avatar         text,
  bio            text,
  color          text,
  user_id        uuid NOT NULL DEFAULT auth.uid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- LAYER 2: social (14 tables)
-- How you connect, communicate, and create.
-- =============================================================================

-- Owner: sloppygram
CREATE TABLE social_follows (
  follower_username   text,
  followed_username   text,
  follower_id         uuid,
  followed_id         uuid,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_follows_follower ON social_follows (follower_username);
CREATE INDEX idx_social_follows_followed ON social_follows (followed_username);
CREATE INDEX idx_social_follows_follower_id ON social_follows (follower_id);
CREATE INDEX idx_social_follows_followed_id ON social_follows (followed_id);

-- Owner: sloppygram (co-owned with sloppy-chat)
CREATE TABLE social_mentions (
  mentioned_username  text,
  source_type         text,
  source_id           text,
  source_username     text,
  seen                boolean,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_mentions_mentioned ON social_mentions (mentioned_username);
CREATE INDEX idx_social_mentions_type ON social_mentions (source_type);
CREATE INDEX idx_social_mentions_source ON social_mentions (source_username);

-- Owner: sloppy-id (co-owned with sloppygram)
CREATE TABLE social_dm_conversations (
  sender_id              uuid,
  sender_username        text,
  recipient_id           uuid,
  recipient_username     text,
  last_message_at        timestamptz,
  last_message_preview   text,
  user_id                uuid NOT NULL DEFAULT auth.uid(),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_dm_conv_sender ON social_dm_conversations (sender_id);
CREATE INDEX idx_social_dm_conv_recipient ON social_dm_conversations (recipient_id);

-- Owner: sloppy-id (co-owned with sloppygram)
CREATE TABLE social_dm_messages (
  conversation_id   bigint,
  sender_id         uuid,
  sender_username   text,
  recipient_id      uuid,
  content           text,
  image_data        text,
  read_at           timestamptz,
  user_id           uuid NOT NULL DEFAULT auth.uid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_dm_msg_conv ON social_dm_messages (conversation_id);
CREATE INDEX idx_social_dm_msg_sender ON social_dm_messages (sender_id);
CREATE INDEX idx_social_dm_msg_recipient ON social_dm_messages (recipient_id);

-- Owner: sloppy-groups
CREATE TABLE social_group_conversations (
  group_name             text,
  group_icon             text,
  created_by_username    text,
  last_message_at        timestamptz,
  last_message_preview   text,
  user_id                uuid NOT NULL DEFAULT auth.uid(),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-groups
CREATE TABLE social_group_members (
  group_id    bigint,
  username    text,
  role        text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_grp_members_gid ON social_group_members (group_id);
CREATE INDEX idx_social_grp_members_user ON social_group_members (username);

-- Owner: sloppy-groups
CREATE TABLE social_group_messages (
  group_id          bigint,
  sender_username   text,
  content           text,
  image_data        text,
  user_id           uuid NOT NULL DEFAULT auth.uid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_grp_messages_gid ON social_group_messages (group_id);

-- Owner: sloppy-feed
CREATE TABLE social_posts (
  id           bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  username     text,
  avatar       text,
  avatar_url   text,
  caption      text,
  image_url    text,
  image_data   text,
  likes_count  integer,
  user_id      uuid NOT NULL DEFAULT auth.uid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-chat
CREATE TABLE social_messages (
  id             bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  username       text,
  avatar         text,
  avatar_url     text,
  content        text,
  image_data     text,
  drawing_data   text,
  message_type   text,
  user_id        uuid NOT NULL DEFAULT auth.uid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-manifestos
CREATE TABLE social_manifestos (
  id         bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title      text,
  content    text,
  username   text,
  avatar     text,
  upvotes    integer,
  user_id    uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-feed
CREATE TABLE social_post_comments (
  id         bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  post_id    bigint,
  username   text,
  avatar     text,
  content    text,
  user_id    uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_post_comments_pid ON social_post_comments (post_id);

-- Owner: sloppy-manifestos
CREATE TABLE social_manifesto_comments (
  id            bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  manifesto_id  bigint,
  username      text,
  avatar        text,
  content       text,
  user_id       uuid NOT NULL DEFAULT auth.uid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-feed
CREATE TABLE social_comment_threads (
  comment_id         bigint,
  parent_comment_id  bigint,
  comment_type       text,
  post_id            bigint,
  user_id            uuid NOT NULL DEFAULT auth.uid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_social_threads_cid ON social_comment_threads (comment_id);
CREATE INDEX idx_social_threads_parent ON social_comment_threads (parent_comment_id);
CREATE INDEX idx_social_threads_pid ON social_comment_threads (post_id);

-- Owner: sloppygram
CREATE TABLE social_doodle_comments (
  doodle_id          text,
  username           text,
  avatar             text,
  content            text,
  parent_comment_id  bigint,
  user_id            uuid NOT NULL DEFAULT auth.uid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- LAYER 3: economy (14 tables — reputation excluded/deleted)
-- Value signals and engagement.
-- =============================================================================

-- Owner: sloppy-quests
CREATE TABLE economy_karma (
  username            text,
  karma_total         integer,
  karma_content       integer,
  karma_engagement    integer,
  karma_social        integer,
  karma_trust         integer,
  message_count       integer,
  post_count          integer,
  doodle_count        integer,
  manifesto_count     integer,
  upvotes_received    integer,
  downvotes_received  integer,
  reactions_received  integer,
  comments_received   integer,
  streak_days         integer,
  last_activity       timestamptz,
  rank                integer,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_karma_user ON economy_karma (username);
CREATE INDEX idx_economy_karma_total ON economy_karma (karma_total);
CREATE INDEX idx_economy_karma_rank ON economy_karma (rank);

-- Owner: sloppy-celebrate
CREATE TABLE economy_badges (
  username          text,
  badge_id          text,
  badge_name        text,
  badge_emoji       text,
  badge_description text,
  earned_at         timestamptz,
  user_id           uuid NOT NULL DEFAULT auth.uid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_badges_user ON economy_badges (username);
CREATE INDEX idx_economy_badges_bid ON economy_badges (badge_id);

-- Owner: sloppy-feed
CREATE TABLE economy_post_likes (
  post_id     bigint,
  username    text,
  vote_type   integer,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_post_likes_pid ON economy_post_likes (post_id);
CREATE INDEX idx_economy_post_likes_user ON economy_post_likes (username);

-- Owner: sloppy-feed
CREATE TABLE economy_post_reactions (
  id         bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  post_id    bigint,
  emoji      text,
  username   text,
  user_id    uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-feed
CREATE TABLE economy_post_tags (
  id          bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  post_id     bigint,
  tag         text,
  parent_tag  text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-feed
CREATE TABLE economy_comment_votes (
  comment_id      uuid,
  voter_username  text,
  vote_type       integer,
  user_id         uuid NOT NULL DEFAULT auth.uid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_comment_votes_cid ON economy_comment_votes (comment_id);
CREATE INDEX idx_economy_comment_votes_voter ON economy_comment_votes (voter_username);

-- Owner: sloppy-chat
CREATE TABLE economy_message_votes (
  message_id      bigint,
  voter_username  text,
  vote_type       integer,
  user_id         uuid NOT NULL DEFAULT auth.uid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_msg_votes_mid ON economy_message_votes (message_id);
CREATE INDEX idx_economy_msg_votes_voter ON economy_message_votes (voter_username);

-- Owner: sloppy-chat
CREATE TABLE economy_message_reactions (
  message_id  bigint,
  emoji       text,
  username    text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-chat
CREATE TABLE economy_message_tags (
  message_id  bigint,
  tag         text,
  parent_tag  text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_msg_tags_mid ON economy_message_tags (message_id);
CREATE INDEX idx_economy_msg_tags_tag ON economy_message_tags (tag);
CREATE INDEX idx_economy_msg_tags_parent ON economy_message_tags (parent_tag);

-- Owner: sloppy-manifestos
CREATE TABLE economy_manifesto_votes (
  manifesto_id  bigint,
  username      text,
  vote_type     integer,
  user_id       uuid NOT NULL DEFAULT auth.uid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_man_votes_mid ON economy_manifesto_votes (manifesto_id);
CREATE INDEX idx_economy_man_votes_uid ON economy_manifesto_votes (user_id, manifesto_id);

-- Owner: sloppy-manifestos
CREATE TABLE economy_manifesto_reactions (
  id            bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  manifesto_id  bigint,
  emoji         text,
  username      text,
  user_id       uuid NOT NULL DEFAULT auth.uid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-manifestos
CREATE TABLE economy_manifesto_tags (
  id            bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  manifesto_id  bigint,
  tag           text,
  parent_tag    text,
  user_id       uuid NOT NULL DEFAULT auth.uid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-manifestos
CREATE TABLE economy_manifesto_lineage (
  manifesto_id  bigint,
  parent_id     bigint,
  fork_type     text,
  user_id       uuid NOT NULL DEFAULT auth.uid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_lineage_mid ON economy_manifesto_lineage (manifesto_id);
CREATE INDEX idx_economy_lineage_parent ON economy_manifesto_lineage (parent_id);

-- Owner: sloppygram
CREATE TABLE economy_doodle_votes (
  message_id      bigint,
  voter_username  text,
  vote_type       integer,
  user_id         uuid NOT NULL DEFAULT auth.uid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_economy_doodle_votes_mid ON economy_doodle_votes (message_id);
CREATE INDEX idx_economy_doodle_votes_voter ON economy_doodle_votes (voter_username);

-- =============================================================================
-- LAYER 4: gov (6 tables)
-- Governance, factions, territorial control, system configuration.
-- =============================================================================

-- Owner: sloppy-factions
CREATE TABLE gov_factions (
  faction_id       text,
  name             text,
  emoji            text,
  color            text,
  description      text,
  member_count     integer,
  territory_count  integer,
  power_score      integer,
  user_id          uuid NOT NULL DEFAULT auth.uid(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_gov_factions_fid ON gov_factions (faction_id);

-- Owner: sloppy-factions
CREATE TABLE gov_faction_members (
  username            text,
  faction_id          text,
  contribution_score  integer,
  battles_won         integer,
  battles_lost        integer,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_gov_members_user ON gov_faction_members (username);
CREATE INDEX idx_gov_members_fid ON gov_faction_members (faction_id);

-- Owner: sloppy-factions
CREATE TABLE gov_faction_battles (
  attacker_faction    text,
  defender_faction    text,
  territory_id        text,
  attacker_username   text,
  attacker_power      integer,
  defender_power      integer,
  winner_faction      text,
  status              text,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_gov_battles_tid ON gov_faction_battles (territory_id);
CREATE INDEX idx_gov_battles_atk ON gov_faction_battles (attacker_faction);
CREATE INDEX idx_gov_battles_def ON gov_faction_battles (defender_faction);
CREATE INDEX idx_gov_battles_status ON gov_faction_battles (status);

-- Owner: sloppy-factions
CREATE TABLE gov_territories (
  territory_id          text,
  name                  text,
  grid_x                integer,
  grid_y                integer,
  controlling_faction   text,
  defense_power         integer,
  captured_at           timestamptz,
  captured_by           text,
  user_id               uuid NOT NULL DEFAULT auth.uid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_gov_territories_tid ON gov_territories (territory_id);
CREATE INDEX idx_gov_territories_faction ON gov_territories (controlling_faction);

-- Owner: sloppygram
CREATE TABLE gov_settings (
  setting_type   text PRIMARY KEY,
  setting_value  text,
  username       text,
  extra_data     text,
  user_id        uuid NOT NULL DEFAULT auth.uid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppygram
CREATE TABLE gov_backgrounds (
  id          bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  image_data  text,
  username    text,
  name        text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- LAYER 5: world (3 tables)
-- Shared environment and artifacts.
-- =============================================================================

-- Owner: sloppy-canvas
CREATE TABLE world_strokes (
  start_x     integer,
  start_y     integer,
  end_x       integer,
  end_y       integer,
  color       text,
  username    text,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Owner: sloppy-collab
CREATE TABLE world_documents (
  title               text,
  content             text,
  created_by_username text,
  last_edited_by      text,
  last_edited_at      timestamptz,
  is_public           boolean,
  user_id             uuid NOT NULL DEFAULT auth.uid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_world_docs_creator ON world_documents (created_by_username);
CREATE INDEX idx_world_docs_public ON world_documents (is_public);

-- Owner: sloppy-radio
CREATE TABLE world_radio (
  youtube_id  text,
  title       text,
  artist      text,
  duration    integer,
  added_by    text,
  started_at  timestamptz,
  is_playing  boolean,
  user_id     uuid NOT NULL DEFAULT auth.uid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUMMARY
-- =============================================================================
-- Layer 1: identity  —  1 table   (identity_profiles)
-- Layer 2: social    — 14 tables  (follows through doodle_comments)
-- Layer 3: economy   — 14 tables  (karma through doodle_votes; reputation deleted)
-- Layer 4: gov       —  6 tables  (factions through backgrounds)
-- Layer 5: world     —  3 tables  (strokes, documents, radio)
-- Total: 38 tables (39 minus deleted sloppygram_reputation)
-- =============================================================================
