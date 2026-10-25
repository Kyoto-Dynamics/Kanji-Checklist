-- Lets the secret key (the service_role) read and write both tables. New Supabase
-- projects don't grant this automatically. The import script and account
-- deletion need it. RLS still applies to everyone else.

grant select, insert, update, delete on public.kanji to service_role;
grant select, insert, update, delete on public.user_kanji_progress to service_role;
