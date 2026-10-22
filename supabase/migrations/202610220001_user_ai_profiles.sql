-- CoffeeNet per-user AI profiles. Safe to apply once; does not alter existing tables.
create table if not exists public.user_ai_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  cafe_name text not null default '',
  phone text not null default '',
  ai_instructions text not null default '',
  preferred_tone text not null default 'رسمی و حرفه‌ای',
  preferred_channel text not null default 'تلگرام',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_ai_profiles enable row level security;

drop policy if exists "Users can read own AI profile" on public.user_ai_profiles;
create policy "Users can read own AI profile"
  on public.user_ai_profiles for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own AI profile" on public.user_ai_profiles;
create policy "Users can insert own AI profile"
  on public.user_ai_profiles for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own AI profile" on public.user_ai_profiles;
create policy "Users can update own AI profile"
  on public.user_ai_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.user_ai_profiles to authenticated;
