-- Fix: infinite recursion between competitions <-> competition_families policies
-- (and related family/progress policies that queried those tables under RLS).
-- Run this in the Supabase SQL Editor if you already applied 001.

-- Security-definer helpers bypass RLS, so policies never call each other.

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

-- Recreate policies using helpers only (no cross-table RLS recursion)

drop policy if exists "profiles_select_own_or_family" on public.profiles;
create policy "profiles_select_own_or_family" on public.profiles
  for select using (public.can_read_profile(id));

drop policy if exists "families_select_member_or_by_code" on public.families;
create policy "families_select_member_or_by_code" on public.families
  for select using (
    public.is_family_member(id)
    or created_by = auth.uid()
    or public.families_share_competition(id)
  );

drop policy if exists "family_members_select" on public.family_members;
create policy "family_members_select" on public.family_members
  for select using (
    public.is_family_member(family_id)
    or user_id = auth.uid()
    or public.families_share_competition(family_id)
  );

drop policy if exists "progress_select_family" on public.progress_daily;
create policy "progress_select_family" on public.progress_daily
  for select using (public.can_read_progress_row(user_id, member_id));

drop policy if exists "competitions_select" on public.competitions;
create policy "competitions_select" on public.competitions
  for select using (
    created_by = auth.uid()
    or public.is_family_member(host_family_id)
    or public.user_in_competition(id)
  );

drop policy if exists "competition_families_select" on public.competition_families;
create policy "competition_families_select" on public.competition_families
  for select using (
    public.can_read_competition_family_row(family_id, competition_id)
  );

grant execute on function public.user_in_competition(uuid) to authenticated;
grant execute on function public.families_share_competition(uuid) to authenticated;
grant execute on function public.can_read_competition_family_row(uuid, uuid) to authenticated;
grant execute on function public.can_read_progress_row(uuid, uuid) to authenticated;
grant execute on function public.can_read_profile(uuid) to authenticated;
