-- Add phone number to profiles (collected at signup)
alter table public.profiles
  add column if not exists phone text;

-- Keep phone in sync when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
        phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
        updated_at = now();
  return new;
end;
$$;
