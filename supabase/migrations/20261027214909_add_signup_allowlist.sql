-- Invite-only sign-up: new accounts can only be created for emails in
-- signup_allowlist. Existing accounts are not affected. Enforced by a
-- "Before User Created" auth hook, switched on in the Supabase dashboard
-- (Authentication > Auth Hooks). Switch the hook off to open sign-up to everyone.
--
-- Add emails in the Table Editor, never in this file: the repo is public.

create table public.signup_allowlist (
  email text primary key check (email = lower(email)), -- store in lowercase
  note text, -- for example "friend testing the beta"
  added_at timestamptz not null default now()
);

-- Nobody can read or change the allowlist through the website's API.
alter table public.signup_allowlist enable row level security;
revoke all on public.signup_allowlist from anon, authenticated;

-- The Supabase Auth service (supabase_auth_admin) runs the hook and needs to read the list.
grant usage on schema public to supabase_auth_admin;
grant select on public.signup_allowlist to supabase_auth_admin;
create policy "Auth service can read the allowlist"
  on public.signup_allowlist for select
  to supabase_auth_admin
  using (true);

create function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.signup_allowlist
    where email = lower(event->'user'->>'email')
  ) then
    return '{}'::jsonb; -- allowed
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Sign-up is invite-only for now.'
    )
  );
end;
$$;

grant execute on function public.hook_before_user_created to supabase_auth_admin;
revoke execute on function public.hook_before_user_created from authenticated, anon, public;
