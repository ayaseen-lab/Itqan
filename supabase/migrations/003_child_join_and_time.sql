-- Child join via invite code + time-on-site tracking

alter table public.progress_daily
  add column if not exists seconds_active int not null default 0;

-- Join family as child (or adult member). as_child=true → role child.
create or replace function public.join_family_by_code(code text, as_child boolean default false)
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
  values (
    fid,
    auth.uid(),
    coalesce(uname, 'Member'),
    case when as_child then 'child' else 'member' end,
    as_child
  );

  return fid;
end;
$$;

-- Increment active seconds for the signed-in user (today)
create or replace function public.add_active_seconds(secs int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  d date := (timezone('utc', now()))::date;
  existing_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if secs is null or secs <= 0 then
    return;
  end if;
  -- Cap a single flush to 5 minutes to avoid abuse
  secs := least(secs, 300);

  select id into existing_id
  from public.progress_daily
  where user_id = auth.uid() and day = d;

  if existing_id is null then
    insert into public.progress_daily (user_id, day, seconds_active)
    values (auth.uid(), d, secs);
  else
    update public.progress_daily
    set seconds_active = seconds_active + secs,
        updated_at = now()
    where id = existing_id;
  end if;
end;
$$;

grant execute on function public.join_family_by_code(text, boolean) to authenticated;
grant execute on function public.add_active_seconds(int) to authenticated;
