# Kanji import

`import-kanji.mts` fills the `kanji` table in Supabase from three free data sources.
The raw files are not stored in Git. Download them into `scripts/data/` with these exact names:

| File name | What it is | Download from | Licence |
| --- | --- | --- | --- |
| `kanjidic2.xml.gz` | KANJIDIC2: meanings, readings, stroke count, frequency, school grade, radical | http://www.edrdg.org/kanjidic/kanjidic2.xml.gz | CC BY-SA 4.0, EDRDG: https://www.edrdg.org/edrdg/licence.html |
| `kanjivg.xml.gz` | KanjiVG: stroke order drawings | https://github.com/KanjiVG/kanjivg/releases (the `kanjivg-YYYYMMDD.xml.gz` file), rename it | CC BY-SA 3.0, Ulrich Apel: https://kanjivg.tagaini.net |
| `kanji_lists.json` | Jonathan Waller's JLPT N5 to N1 kanji lists | https://raw.githubusercontent.com/ffe4/kanji-lists/HEAD/codegen/kanji_lists.json | Lists: CC BY, Jonathan Waller (http://www.tanos.co.uk/jlpt/). File: MIT, ffe4/kanji-lists |

The JLPT lists come from a copy in the ffe4/kanji-lists project because tanos.co.uk was unreachable in October 2026. The copy matches Waller's published counts: N5 79, N4 166, N3 367, N2 367, N1 1232 (2211 in total).

That copy is missing 19 kanji that clearly belong on the lists (for example 分, a basic N5 kanji). The script adds them with an estimated level, saved with `jlpt_level_estimated = true`. The rule and the list are in `estimatedLevels` in `import-kanji.mts`. If tanos.co.uk comes back, compare against it and replace the estimates with Waller's levels.

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

- `jlpt_level`: 5 = N5 ... 1 = N1. `jlpt_level_estimated` is true for the 19 kanji whose level is our estimate.
- `meanings`: English only. We modify KANJIDIC2's meanings for learners (the CC BY-SA licence allows this; the Credits page must say so): dictionary notes such as "radical (no. N)", "(kokuji)", "Inst." and zodiac hours such as "11PM-1AM" are removed, "10**16" becomes "10^16", and `meaningFixes` in `import-kanji.mts` puts a more useful meaning first for 37 kanji (for example 校 starts with "school", not "exam").
- `on_readings` are in katakana, `kun_readings` in hiragana (two katakana unit names in KANJIDIC2, for 粉 and 志, are dropped). In kun readings a `.` marks where the kana ending (okurigana) starts, for example `た.べる` is written 食べる, and a `-` marks a prefix or suffix reading.
- `sort_order`: within each level, most common kanji first (KANJIDIC2 newspaper frequency rank). Kanji without a rank go last.
- `stroke_paths`: one SVG path per stroke, in stroke order, drawn on a 109 x 109 canvas.
- Romaji is not stored. The website converts the kana when it displays them.
