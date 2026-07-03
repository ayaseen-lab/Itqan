# Itqan × Supabase

## One-time setup

1. Open the [SQL Editor](https://supabase.com/dashboard/project/fjwvivjkuboopijjusuu/sql) for project `fjwvivjkuboopijjusuu`.
2. Paste and run `migrations/001_itqan_core.sql`.
3. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`, `http://localhost:3000/auth/reset-password`
4. **Authentication → Providers → Email**: enable Email. Optionally disable “Confirm email” while testing locally.
5. App env (already in `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fjwvivjkuboopijjusuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_…
```

## Optional CLI

```bash
supabase login
supabase init   # if not already initialized
supabase link --project-ref fjwvivjkuboopijjusuu
supabase db push
```

## Features

| Area | Behaviour |
| --- | --- |
| Register | Name, email, password → `auth.users` + `profiles` |
| Sign in | Email + password |
| Forgot password | Reset email → `/auth/reset-password` |
| Account | `/profile` manage name, daily goal, sign out |
| Family | Create / join by code, add child profiles, log child progress |
| Competition | Invite another family, live scoreboard (progress + tests) |
