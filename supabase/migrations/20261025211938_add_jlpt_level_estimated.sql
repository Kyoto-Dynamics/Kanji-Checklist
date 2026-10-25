-- Marks kanji whose JLPT level is our own estimate rather than from Waller's
-- lists (see estimatedLevels in scripts/import-kanji.mts).

alter table public.kanji
  add column jlpt_level_estimated boolean not null default false;
