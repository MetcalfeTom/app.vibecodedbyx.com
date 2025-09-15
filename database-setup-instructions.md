# messages table setup instructions

## table creation sql

to create the messages table, run this sql in the supabase dashboard (sql editor):

```sql
-- create messages table
create table if not exists public.messages (
    id bigserial primary key,
    user_id text not null,
    username text not null,
    message text not null,
    created_at timestamptz default now()
);

-- enable row level security
alter table public.messages enable row level security;

-- drop existing policies if they exist (in case of recreation)
drop policy if exists "messages_select_policy" on public.messages;
drop policy if exists "messages_insert_policy" on public.messages;
drop policy if exists "messages_update_policy" on public.messages;
drop policy if exists "messages_delete_policy" on public.messages;

-- policy: anyone can read all messages
create policy "messages_select_policy" on public.messages
    for select using (true);

-- policy: users can only insert their own messages
create policy "messages_insert_policy" on public.messages
    for insert with check (auth.uid()::text = user_id);

-- policy: users can only update their own messages
create policy "messages_update_policy" on public.messages
    for update using (auth.uid()::text = user_id);

-- policy: users can only delete their own messages
create policy "messages_delete_policy" on public.messages
    for delete using (auth.uid()::text = user_id);
```

## table structure

- **id**: bigserial primary key (auto-generated)
- **user_id**: text (required) - stores the user's identifier from auth.uid()
- **username**: text (required) - display name for the user
- **message**: text (required) - the chat message content
- **created_at**: timestamptz (default now()) - timestamp when message was created

## row level security policies

1. **select policy**: anyone can read all messages
2. **insert policy**: users can only insert messages with their own user_id
3. **update policy**: users can only update their own messages
4. **delete policy**: users can only delete their own messages

## verification

after creating the table, open `/vibespace/verify-messages-table.html` in a browser to test that the table works correctly.

## steps to create

1. go to your supabase dashboard
2. navigate to the sql editor
3. paste the sql above
4. run the query
5. verify with the test page

the table will automatically integrate with the existing auth system and user_id will be populated from the authenticated user's id.