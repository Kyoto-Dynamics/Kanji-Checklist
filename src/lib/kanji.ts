import { cacheLife } from "next/cache";
import type { KanjiStatus } from "@/lib/kanji-status";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type LevelKanji = { character: string; meaning: string };

// Supabase returns at most 1000 rows per request, and N1 has more, so read in pages.
const pageSize = 1000;

// The kanji in one JLPT level, in display order. The list rarely changes, so it
// is cached for days instead of being read from the database on every visit.
export async function getLevelKanji(level: number): Promise<LevelKanji[]> {
  "use cache";
  cacheLife("days");

  const supabase = createPublicClient();
  const kanji: LevelKanji[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("kanji")
      .select("character, meanings")
      .eq("jlpt_level", level)
      .order("sort_order")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Could not load kanji: ${error.message}`);
    kanji.push(...data.map((row) => ({ character: row.character, meaning: row.meanings[0] ?? "" })));
    if (data.length < pageSize) return kanji;
  }
}

// Every kanji the signed-in user has coloured, as { character: status }.
// Row Level Security makes sure this only ever returns the user's own rows.
export async function getUserProgress(): Promise<Record<string, KanjiStatus>> {
  const supabase = await createClient();
  const progress: Record<string, KanjiStatus> = {};
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("user_kanji_progress")
      .select("kanji, status")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Could not load your progress: ${error.message}`);
    for (const row of data) progress[row.kanji] = row.status;
    if (data.length < pageSize) return progress;
  }
}
