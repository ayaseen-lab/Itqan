-- Itqan core schema: profiles, families, progress, healthy competitions
-- Apply in Supabase SQL Editor, or: supabase db push

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  daily_goal int not null default 5 check (daily_goal between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Families
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists families_invite_code_idx on public.families (invite_code);

-- Family members (linked account OR child profile managed by parent)
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  display_name text not null,
  role text not null default 'member'
    check (role in ('owner', 'parent', 'child', 'member')),
  is_child boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create index if not exists family_members_family_idx on public.family_members (family_id);
create index if not exists family_members_user_idx on public.family_members (user_id);

-- Daily progress snapshots (for family tracking + competitions)
create table if not exists public.progress_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  member_id uuid references public.family_members (id) on delete cascade,
  day date not null default (timezone('utc', now()))::date,
  verses_read int not null default 0,
  hifz_reviews int not null default 0,
  tests_completed int not null default 0,
  tasbih_count int not null default 0,
  xp int not null default 0,
  updated_at timestamptz not null default now(),
  constraint progress_owner check (user_id is not null or member_id is not null)
);

create unique index if not exists progress_daily_user_day_uidx
  on public.progress_daily (user_id, day)
  where user_id is not null;

create unique index if not exists progress_daily_member_day_uidx
  on public.progress_daily (member_id, day)
  where member_id is not null;

-- Healthy competitions between families
create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  status text not null default 'open'
    check (status in ('open', 'active', 'completed', 'cancelled')),
  created_by uuid not null references public.profiles (id) on delete cascade,
  host_family_id uuid not null references public.families (id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists competitions_invite_code_idx on public.competitions (invite_code);

create table if not exists public.competition_families (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  family_id uuid not null references public.families (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (competition_id, family_id)
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'user'), '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users who signed up before this migration ran
insert into public.profiles (id, email, full_name)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'full_name', split_part(coalesce(email, 'user'), '@', 1))
from auth.users
on conflict (id) do nothing;

-- Helpers
create or replace function public.is_family_member(fid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = fid and user_id = auth.uid()
  );
$$;

create or replace function public.is_family_admin(fid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = fid
      and user_id = auth.uid()
      and role in ('owner', 'parent')
  );
$$;

-- Security-definer helpers (bypass RLS — prevents policy recursion)
create or replace function public.user_in_competition(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.competition_families cf
    join public.family_members fm on fm.family_id = cf.family_id
    where cf.competition_id = cid
      and fm.user_id = auth.uid()
  );
$$;

create or replace function public.families_share_competition(fid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.competition_families cf_me
    join public.family_members me
      on me.family_id = cf_me.family_id and me.user_id = auth.uid()
    join public.competition_families cf_them
      on cf_them.competition_id = cf_me.competition_id
    where cf_them.family_id = fid
  );
$$;

create or replace function public.can_read_competition_family_row(cf_family_id uuid, cf_competition_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_family_member(cf_family_id)
    or public.user_in_competition(cf_competition_id)
    or exists (
      select 1 from public.competitions c
      where c.id = cf_competition_id
        and (c.created_by = auth.uid() or public.is_family_member(c.host_family_id))
    );
$$;

create or replace function public.can_read_progress_row(p_user_id uuid, p_member_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (p_user_id is not null and p_user_id = auth.uid())
    or exists (
      select 1 from public.family_members me
      join public.family_members them on them.family_id = me.family_id
      where me.user_id = auth.uid()
        and (
          (p_user_id is not null and them.user_id = p_user_id)
          or (p_member_id is not null and them.id = p_member_id)
        )
    )
    or exists (
      select 1
      from public.competition_families cf_me
      join public.family_members me
        on me.family_id = cf_me.family_id and me.user_id = auth.uid()
      join public.competition_families cf_them
        on cf_them.competition_id = cf_me.competition_id
      join public.family_members them
        on them.family_id = cf_them.family_id
      where
        (p_user_id is not null and them.user_id = p_user_id)
        or (p_member_id is not null and them.id = p_member_id)
    );
$$;

create or replace function public.can_read_profile(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    pid = auth.uid()
    or exists (
      select 1
      from public.family_members me
      join public.family_members them on them.family_id = me.family_id
      where me.user_id = auth.uid() and them.user_id = pid
    );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.progress_daily enable row level security;
alter table public.competitions enable row level security;
alter table public.competition_families enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_family" on public.profiles;
create policy "profiles_select_own_or_family" on public.profiles
  for select using (public.can_read_profile(id));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- Families
drop policy if exists "families_select_member_or_by_code" on public.families;
create policy "families_select_member_or_by_code" on public.families
  for select using (
    public.is_family_member(id)
    or created_by = auth.uid()
    or public.families_share_competition(id)
  );

drop policy if exists "families_insert_auth" on public.families;
create policy "families_insert_auth" on public.families
  for insert with check (created_by = auth.uid());

drop policy if exists "families_update_admin" on public.families;
create policy "families_update_admin" on public.families
  for update using (public.is_family_admin(id));

-- Family members
drop policy if exists "family_members_select" on public.family_members;
create policy "family_members_select" on public.family_members
  for select using (
    public.is_family_member(family_id)
    or user_id = auth.uid()
    or public.families_share_competition(family_id)
  );

drop policy if exists "family_members_insert" on public.family_members;
create policy "family_members_insert" on public.family_members
  for insert with check (
    user_id = auth.uid()
    or public.is_family_admin(family_id)
  );

drop policy if exists "family_members_update" on public.family_members;
create policy "family_members_update" on public.family_members
  for update using (public.is_family_admin(family_id) or user_id = auth.uid());

drop policy if exists "family_members_delete" on public.family_members;
create policy "family_members_delete" on public.family_members
  for delete using (public.is_family_admin(family_id) or user_id = auth.uid());

-- Progress
drop policy if exists "progress_select_family" on public.progress_daily;
create policy "progress_select_family" on public.progress_daily
  for select using (public.can_read_progress_row(user_id, member_id));

drop policy if exists "progress_upsert_own" on public.progress_daily;
create policy "progress_upsert_own" on public.progress_daily
  for insert with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.family_members
      where id = progress_daily.member_id
        and public.is_family_admin(family_id)
    )
  );

drop policy if exists "progress_update_own" on public.progress_daily;
create policy "progress_update_own" on public.progress_daily
  for update using (
    user_id = auth.uid()
    or exists (
      select 1 from public.family_members
      where id = progress_daily.member_id
        and public.is_family_admin(family_id)
    )
  );

-- Competitions (no direct queries of competition_families under RLS)
drop policy if exists "competitions_select" on public.competitions;
create policy "competitions_select" on public.competitions
  for select using (
    created_by = auth.uid()
    or public.is_family_member(host_family_id)
    or public.user_in_competition(id)
  );

drop policy if exists "competitions_insert" on public.competitions;
create policy "competitions_insert" on public.competitions
  for insert with check (
    created_by = auth.uid()
    and public.is_family_admin(host_family_id)
  );

drop policy if exists "competitions_update" on public.competitions;
create policy "competitions_update" on public.competitions
  for update using (
    created_by = auth.uid()
    or public.is_family_admin(host_family_id)
  );

drop policy if exists "competition_families_select" on public.competition_families;
create policy "competition_families_select" on public.competition_families
  for select using (
    public.can_read_competition_family_row(family_id, competition_id)
  );

drop policy if exists "competition_families_insert" on public.competition_families;
create policy "competition_families_insert" on public.competition_families
  for insert with check (public.is_family_admin(family_id));

-- Allow lookup of family by invite code via RPC (avoids open SELECT on all families)
create or replace function public.join_family_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  fid uuid;
  uname text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id into fid from public.families where invite_code = upper(trim(code));
  if fid is null then
    raise exception 'Invalid family invite code';
  end if;

  if public.is_family_member(fid) then
    return fid;
  end if;

  select full_name into uname from public.profiles where id = auth.uid();

  insert into public.family_members (family_id, user_id, display_name, role, is_child)
  values (fid, auth.uid(), coalesce(uname, 'Member'), 'member', false);

  return fid;
end;
$$;

create or replace function public.join_competition_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  fid uuid;
  st text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id, status into cid, st
  from public.competitions
  where invite_code = upper(trim(code));

  if cid is null then
    raise exception 'Invalid competition invite code';
  end if;

  if st not in ('open', 'active') then
    raise exception 'Competition is not open to join';
  end if;

  select family_id into fid
  from public.family_members
  where user_id = auth.uid() and role in ('owner', 'parent')
  limit 1;

  if fid is null then
    raise exception 'You must be a family owner or parent to join a competition';
  end if;

  insert into public.competition_families (competition_id, family_id)
  values (cid, fid)
  on conflict (competition_id, family_id) do nothing;

  update public.competitions
  set status = 'active'
  where id = cid and status = 'open';

  return cid;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on function public.join_family_by_code(text) to authenticated;
grant execute on function public.join_competition_by_code(text) to authenticated;
grant execute on function public.is_family_member(uuid) to authenticated;
grant execute on function public.is_family_admin(uuid) to authenticated;
grant execute on function public.user_in_competition(uuid) to authenticated;
grant execute on function public.families_share_competition(uuid) to authenticated;
grant execute on function public.can_read_competition_family_row(uuid, uuid) to authenticated;
grant execute on function public.can_read_progress_row(uuid, uuid) to authenticated;
grant execute on function public.can_read_profile(uuid) to authenticated;
