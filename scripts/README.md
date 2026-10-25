# Kanji import

`import-kanji.mts` fills the `kanji` table in Supabase from three free data sources.
The raw files are not stored in Git. Download them into `scripts/data/` with these exact names:

| File name | What it is | Download from | Licence |
| --- | --- | --- | --- |
| `kanjidic2.xml.gz` | KANJIDIC2: meanings, readings, stroke count, frequency, school grade, radical | http://www.edrdg.org/kanjidic/kanjidic2.xml.gz | CC BY-SA 4.0, EDRDG: https://www.edrdg.org/edrdg/licence.html |
| `kanjivg.xml.gz` | KanjiVG: stroke order drawings | https://github.com/KanjiVG/kanjivg/releases (the `kanjivg-YYYYMMDD.xml.gz` file), rename it | CC BY-SA 3.0, Ulrich Apel: https://kanjivg.tagaini.net |
| `kanji_lists.json` | Jonathan Waller's JLPT N5 to N1 kanji lists | https://raw.githubusercontent.com/ffe4/kanji-lists/HEAD/codegen/kanji_lists.json | Lists: CC BY, Jonathan Waller (http://www.tanos.co.uk/jlpt/). File: MIT, ffe4/kanji-lists |

The JLPT lists come from a copy in the ffe4/kanji-lists project because tanos.co.uk was unreachable in October 2026. The copy matches Waller's published counts: N5 79, N4 166, N3 367, N2 367, N1 1232 (2211 in total).

You don't need to unzip the `.gz` files; the script reads them directly.

## Running it

1. Apply all files in `supabase/migrations/` first (see the main README).
2. Check the data without saving anything:

   ```
   npm run import-kanji -- --dry-run
   ```

3. Add `SUPABASE_SECRET_KEY` to `.env.local` (Supabase dashboard: **Project Settings > API Keys**, the secret key starting with `sb_secret_`).
4. Save to Supabase:

   ```
   npm run import-kanji
   ```

It is safe to run again: existing kanji are updated, not duplicated.

## How the data is shaped

- `jlpt_level`: 5 = N5 ... 1 = N1.
- `on_readings` are in katakana, `kun_readings` in hiragana. In kun readings a `.` marks where the kana ending (okurigana) starts, for example `た.べる` is written 食べる, and a `-` marks a prefix or suffix reading.
- `sort_order`: within each level, most common kanji first (KANJIDIC2 newspaper frequency rank). Kanji without a rank go last.
- `stroke_paths`: one SVG path per stroke, in stroke order, drawn on a 109 x 109 canvas.
- Romaji is not stored. The website converts the kana when it displays them.
