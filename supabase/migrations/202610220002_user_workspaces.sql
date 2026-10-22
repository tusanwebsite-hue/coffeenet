-- Per-user app state: settings, drafts, and saved-item IDs.
create table if not exists public.user_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  drafts jsonb not null default '[]'::jsonb,
  bookmarked_registration_ids text[] not null default '{}',
  favorite_link_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_workspaces enable row level security;
revoke all on table public.user_workspaces from anon, authenticated;
grant select, insert, update on table public.user_workspaces to authenticated;

drop policy if exists "Users can read own workspace" on public.user_workspaces;
create policy "Users can read own workspace"
  on public.user_workspaces for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own workspace" on public.user_workspaces;
create policy "Users can create own workspace"
  on public.user_workspaces for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own workspace" on public.user_workspaces;
create policy "Users can update own workspace"
  on public.user_workspaces for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
