// Builds the kanji table from the source files in scripts/data/ (see scripts/README.md).
//
//   npm run import-kanji -- --dry-run   check the data and print a summary, save nothing
//   npm run import-kanji                save to Supabase (needs SUPABASE_SECRET_KEY)

import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createClient } from "@supabase/supabase-js";

type KanjiRow = {
  character: string;
  jlpt_level: number;
  meanings: string[];
  on_readings: string[];
  kun_readings: string[];
  stroke_count: number;
  frequency: number | null;
  sort_order: number;
  grade: number | null;
  radical: string | null;
  stroke_paths: string[];
};

const dryRun = process.argv.includes("--dry-run");
const dataDir = new URL("./data/", import.meta.url);

function readText(name: string): string {
  const bytes = readFileSync(new URL(name, dataDir));
  return (name.endsWith(".gz") ? gunzipSync(bytes) : bytes).toString("utf8");
}

function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function allMatches(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].map((match) => decodeXml(match[1]));
}

function firstNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  return match ? Number(match[1]) : null;
}

// 1. JLPT levels from Jonathan Waller's lists: "N5" -> 5, ..., "N1" -> 1.
const lists = JSON.parse(readText("kanji_lists.json"));
const waller: Record<string, string> = lists.JLPT.versions.TANOS.characters;
const levelOf = new Map<string, number>();
for (const [name, characters] of Object.entries(waller)) {
  for (const character of characters) {
    levelOf.set(character, Number(name.slice(1)));
  }
}

// 2. Meanings, readings, stroke count, frequency, grade and radical from KANJIDIC2.
const kanjidic = readText("kanjidic2.xml.gz");
const rows = new Map<string, KanjiRow>();
for (const entry of kanjidic.split("<character>").slice(1)) {
  const character = entry.match(/<literal>(.+?)<\/literal>/)?.[1];
  const jlptLevel = character && levelOf.get(character);
  if (!character || !jlptLevel) continue;

  const radicalNumber = firstNumber(entry, /<rad_value rad_type="classical">(\d+)</);
  rows.set(character, {
    character,
    jlpt_level: jlptLevel,
    // Meanings without an m_lang attribute are English.
    meanings: allMatches(entry, /<meaning>(.+?)<\/meaning>/g),
    on_readings: allMatches(entry, /<reading r_type="ja_on">(.+?)<\/reading>/g),
    kun_readings: allMatches(entry, /<reading r_type="ja_kun">(.+?)<\/reading>/g),
    stroke_count: firstNumber(entry, /<stroke_count>(\d+)</) ?? 0,
    frequency: firstNumber(entry, /<freq>(\d+)</),
    sort_order: 0,
    grade: firstNumber(entry, /<grade>(\d+)</),
    // The Unicode "Kangxi Radicals" block is in radical-number order; NFKC turns
    // each one into the ordinary kanji, for example ⽇ -> 日.
    radical: radicalNumber
      ? String.fromCodePoint(0x2f00 + radicalNumber - 1).normalize("NFKC")
      : null,
    stroke_paths: [],
  });
}

const missing = [...levelOf.keys()].filter((character) => !rows.has(character));
if (missing.length > 0) {
  console.error(`Not found in KANJIDIC2: ${missing.join(" ")}`);
  process.exit(1);
}

// 3. Stroke order from KanjiVG. Each stroke is a <path> numbered -s1, -s2, ...
const kanjivg = readText("kanjivg.xml.gz");
const noStrokes: string[] = [];
const strokeCountDiffers: string[] = [];
for (const row of rows.values()) {
  const hex = row.character.codePointAt(0)!.toString(16).padStart(5, "0");
  const start = kanjivg.indexOf(`<kanji id="kvg:kanji_${hex}">`);
  if (start === -1) {
    noStrokes.push(row.character);
    continue;
  }
  const block = kanjivg.slice(start, kanjivg.indexOf("</kanji>", start));
  const strokes = [...block.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*? d="([^"]+)"/g)]
    .map((match) => ({ number: Number(match[1]), path: match[2] }))
    .sort((a, b) => a.number - b.number);
  row.stroke_paths = strokes.map((stroke) => stroke.path);
  if (strokes.length !== row.stroke_count) strokeCountDiffers.push(row.character);
}

// 4. Within each level, show the most common kanji first (KANJIDIC2 frequency rank,
// where 1 = most common). Kanji without a rank go last, simplest first.
const sorted = [...rows.values()].sort(
  (a, b) =>
    b.jlpt_level - a.jlpt_level ||
    (a.frequency ?? Infinity) - (b.frequency ?? Infinity) ||
    a.stroke_count - b.stroke_count ||
    a.character.codePointAt(0)! - b.character.codePointAt(0)!,
);
let previousLevel = 0;
let position = 0;
for (const row of sorted) {
  position = row.jlpt_level === previousLevel ? position + 1 : 1;
  previousLevel = row.jlpt_level;
  row.sort_order = position;
}

// Summary
for (const level of [5, 4, 3, 2, 1]) {
  const inLevel = sorted.filter((row) => row.jlpt_level === level);
  const first = inLevel.slice(0, 10).map((row) => row.character).join("");
  console.log(`N${level}: ${inLevel.length} kanji, starting ${first}`);
}
console.log(`Total: ${sorted.length} kanji`);
if (noStrokes.length > 0) console.log(`No stroke order in KanjiVG: ${noStrokes.join(" ")}`);
if (strokeCountDiffers.length > 0) {
  console.log(`Stroke count differs between KANJIDIC2 and KanjiVG: ${strokeCountDiffers.join(" ")}`);
}
const { stroke_paths, ...example } = rows.get("日")!;
console.log("Example:", { ...example, stroke_paths: `${stroke_paths.length} strokes` });

if (dryRun) {
  console.log("Dry run: nothing saved.");
  process.exit(0);
}

// 5. Save to Supabase. Upsert means: add new kanji, update existing ones.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local first.");
  process.exit(1);
}
const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

const batchSize = 250;
for (let i = 0; i < sorted.length; i += batchSize) {
  const { error } = await supabase
    .from("kanji")
    .upsert(sorted.slice(i, i + batchSize), { onConflict: "character" });
  if (error) {
    console.error("Saving failed:", error.message);
    process.exit(1);
  }
  console.log(`Saved ${Math.min(i + batchSize, sorted.length)} of ${sorted.length}`);
}
console.log("Done.");
