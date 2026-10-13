-- Starter database: apps, votes, scores and points
-- From the factory kit (Sloppy's Factory, idea by Flax). Generic and public: nothing in here is secret.
--
-- Written for Postgres 15 or newer with row-level security (RLS).
-- auth.uid() is the id of the signed-in visitor and "authenticated" is the role
-- signed-in visitors get. Hosted Postgres services such as Supabase provide both.
-- On another host, swap in your own function and role.
--
-- Run it once: paste it into your database's SQL editor, or
--   psql "$DATABASE_URL" -f db/schema.sql
-- Running it again is safe: tables are only created when missing, and the rules are replaced.
-- Try it on an empty test database first, never on real players' rows.


-- ---------------------------------------------------------------------------
-- 1. apps: one row per app on your shelf
-- ---------------------------------------------------------------------------
create table if not exists apps (
  slug        text primary key check (slug ~ '^[a-z0-9-]{1,60}$'),  -- the folder name, like 'frog-hop'
  title       text not null check (char_length(title) <= 80),
  idea_by     text check (char_length(idea_by) <= 40),              -- the chat name whose idea it was
  created_at  timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- 2. votes: one vote per person per app, +1 or -1
-- ---------------------------------------------------------------------------
create table if not exists votes (
  app_slug    text not null references apps (slug) on delete cascade,
  user_id     uuid not null default auth.uid(),
  value       smallint not null check (value in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (app_slug, user_id)   -- the table itself refuses a second vote; change it with an update
);


-- ---------------------------------------------------------------------------
-- 3. scores: runs in your games, for the leaderboards
-- ---------------------------------------------------------------------------
create table if not exists scores (
  id          bigint generated always as identity primary key,
  app_slug    text not null references apps (slug) on delete cascade,
  user_id     uuid not null default auth.uid(),
  name        text not null check (char_length(name) between 1 and 24),
  score       integer not null check (score between 0 and 10000000),  -- cap it here: someone will try 999999999
  created_at  timestamptz not null default now()
);
create index if not exists scores_board on scores (app_slug, score desc);


-- ---------------------------------------------------------------------------
-- 4. points: points for chat, always with a reason
-- ---------------------------------------------------------------------------
create table if not exists points (
  id          bigint generated always as identity primary key,
  viewer      text not null check (char_length(viewer) between 1 and 40),     -- the chat name
  amount      integer not null check ((amount between -10 and 10) and amount <> 0),
  reason      text not null check (char_length(reason) between 3 and 140),    -- like 'idea: the double jump'
  app_slug    text references apps (slug) on delete set null,
  created_at  timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- Totals everyone can read. security_invoker makes a view follow the same
-- rules as the tables underneath it.
-- ---------------------------------------------------------------------------
create or replace view app_votes with (security_invoker = true) as
  select a.slug,
         a.title,
         coalesce(sum(v.value), 0) as score,
         count(v.user_id)          as votes
  from apps a
  left join votes v on v.app_slug = a.slug
  group by a.slug, a.title;

create or replace view viewer_points with (security_invoker = true) as
  select viewer,
         sum(amount) as points,
         count(*)    as times
  from points
  group by viewer;


-- ---------------------------------------------------------------------------
-- The rules (row-level security), in plain words:
--   * Everyone reads everything: it's a public show.
--   * You only write your own rows: your vote, your scores.
--   * apps and points get no write rule at all, so nobody using the public key
--     can write them. Your ship step and your chat bot write them with the
--     server key, which skips these rules and never goes in a web page.
-- ---------------------------------------------------------------------------
alter table apps   enable row level security;
alter table votes  enable row level security;
alter table scores enable row level security;
alter table points enable row level security;

-- Everyone reads
drop policy if exists "everyone reads apps" on apps;
create policy "everyone reads apps" on apps for select using (true);

drop policy if exists "everyone reads votes" on votes;
create policy "everyone reads votes" on votes for select using (true);

drop policy if exists "everyone reads scores" on scores;
create policy "everyone reads scores" on scores for select using (true);

drop policy if exists "everyone reads points" on points;
create policy "everyone reads points" on points for select using (true);

-- Votes: only your own, one per app (the primary key), and you can change or take it back
drop policy if exists "vote as yourself" on votes;
create policy "vote as yourself" on votes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "change your own vote" on votes;
create policy "change your own vote" on votes for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "take back your own vote" on votes;
create policy "take back your own vote" on votes for delete to authenticated
  using (user_id = auth.uid());

-- Scores: post your own runs and delete your own; nobody edits a score after the run
drop policy if exists "post your own score" on scores;
create policy "post your own score" on scores for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "delete your own score" on scores;
create policy "delete your own score" on scores for delete to authenticated
  using (user_id = auth.uid());

-- apps and points: deliberately no insert, update or delete rule (see above).
