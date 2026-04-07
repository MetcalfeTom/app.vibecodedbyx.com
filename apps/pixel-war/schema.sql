-- Pixel War schema
-- Run this in Supabase SQL editor to enable persistence.

create table if not exists public.pixel_war_grid (
  x int not null,
  y int not null,
  color text not null,
  user_id uuid not null default auth.uid(),
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (x, y)
);

alter table public.pixel_war_grid enable row level security;

-- Anyone authenticated (incl. anonymous) can read
create policy "pixel_war_grid_select_all"
  on public.pixel_war_grid for select
  using (true);

-- Anyone authenticated can place a pixel; user_id is forced to their own
create policy "pixel_war_grid_insert_own"
  on public.pixel_war_grid for insert
  with check (auth.uid() = user_id);

-- Pixels are overwritable by anyone authenticated (this is the "war" part)
create policy "pixel_war_grid_update_any"
  on public.pixel_war_grid for update
  using (auth.role() = 'authenticated')
  with check (auth.uid() = user_id);

-- Realtime
alter publication supabase_realtime add table public.pixel_war_grid;
