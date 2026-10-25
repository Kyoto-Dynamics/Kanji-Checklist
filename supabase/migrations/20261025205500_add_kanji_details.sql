-- Adds school grade, radical and stroke order to the kanji table.

alter table public.kanji
  -- Japanese school grade: 1 to 6 = elementary, 8 = secondary (other jōyō),
  -- 9 and 10 = name-only (jinmeiyō) kanji. Null if not taught at school.
  add column grade smallint check (grade between 1 and 10),
  -- Classical (Kangxi) radical, as a character, for example 日 or 水.
  add column radical text,
  -- SVG path data for each stroke, in stroke order, on a 109 x 109 canvas.
  -- From KanjiVG. Empty if KanjiVG has no drawing for this kanji.
  add column stroke_paths text[] not null default '{}';
