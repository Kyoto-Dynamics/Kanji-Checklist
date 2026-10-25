-- Creates the kanji list and each user's progress, with Row Level Security.

-- ---------------------------------------------------------------------------
-- kanji: one row per kanji. Readable by everyone, writable by nobody through
-- the API (the import script uses the secret key, which bypasses RLS).
-- ---------------------------------------------------------------------------

create table public.kanji (
  character text primary key check (char_length(character) = 1),
  jlpt_level smallint not null check (jlpt_level between 1 and 5), -- 5 = N5, 1 = N1
  meanings text[] not null default '{}',
  on_readings text[] not null default '{}',
  kun_readings text[] not null default '{}',
  stroke_count smallint not null check (stroke_count > 0),
  frequency int,
  sort_order int not null -- display order within a level
);

create index kanji_level_order_idx on public.kanji (jlpt_level, sort_order);

alter table public.kanji enable row level security;

create policy "Anyone can read kanji"
  on public.kanji for select
  to anon, authenticated
  using (true);

revoke all on public.kanji from anon, authenticated;
grant select on public.kanji to anon, authenticated;

-- ---------------------------------------------------------------------------
-- user_kanji_progress: one row per user per kanji that is not grey.
-- Setting a kanji back to grey deletes the row.
-- ---------------------------------------------------------------------------

create type public.kanji_status as enum ('learning', 'struggling', 'learnt');

create table public.user_kanji_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  kanji text not null references public.kanji (character),
  status public.kanji_status not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, kanji)
);

alter table public.user_kanji_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_kanji_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own progress"
  on public.user_kanji_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can change their own progress"
  on public.user_kanji_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own progress"
  on public.user_kanji_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.user_kanji_progress from anon, authenticated;
grant select, insert, update, delete on public.user_kanji_progress to authenticated;

-- Keep updated_at current whenever a row changes.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_kanji_progress_set_updated_at
  before update on public.user_kanji_progress
  for each row execute function public.set_updated_at();
