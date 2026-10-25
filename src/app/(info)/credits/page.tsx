import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Credits · Kanji Checklist" };

export default function CreditsPage() {
  return (
    <>
      <h1>Credits</h1>
      <p>{site.name} is built on the generous work of these open data projects. Thank you.</p>

      <h2>KANJIDIC2</h2>
      <p>
        Kanji meanings, readings, stroke counts, frequency ranks, school grades and radicals come from the{" "}
        <a href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC2</a> dictionary file, the property
        of the <a href="https://www.edrdg.org/">Electronic Dictionary Research and Development Group</a> (EDRDG).
        It is used in conformance with the Group&apos;s{" "}
        <a href="https://www.edrdg.org/edrdg/licence.html">licence</a>, under the{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">
          Creative Commons Attribution-ShareAlike 4.0 licence
        </a>
        .
      </p>
      <p>
        <strong>Changes we made:</strong> we adapted the English meanings for learners. We removed dictionary notes
        (such as &quot;radical (no. 1)&quot; and &quot;(kokuji)&quot;) and old zodiac hours, rewrote large numbers
        as powers of ten, moved a more common meaning to the front for 37 kanji, added a few short meanings, and
        removed two katakana unit names that were listed as readings. Our adapted data is shared under the same
        licence, CC BY-SA 4.0.
      </p>

      <h2>JLPT kanji lists</h2>
      <p>
        JLPT levels N5 to N1 come from{" "}
        <a href="http://www.tanos.co.uk/jlpt/">Jonathan Waller&apos;s JLPT Resources</a>, licensed under the{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution licence</a>. We used the
        copy in the <a href="https://github.com/ffe4/kanji-lists">ffe4/kanji-lists</a> project (MIT licence).
      </p>
      <p>
        <strong>Changes we made:</strong> that copy is missing 19 kanji (such as 分). We added them with levels we
        estimated from KANJIDIC2&apos;s old JLPT levels and how common each kanji is. There has been no official JLPT
        kanji list since 2010.
      </p>

      <h2>KanjiVG</h2>
      <p>
        Stroke order data comes from <a href="https://kanjivg.tagaini.net/">KanjiVG</a>, copyright Ulrich Apel,
        licensed under the{" "}
        <a href="https://creativecommons.org/licenses/by-sa/3.0/">
          Creative Commons Attribution-ShareAlike 3.0 licence
        </a>
        .
      </p>

      <h2>Software</h2>
      <p>
        Built with <a href="https://nextjs.org/">Next.js</a>, <a href="https://tailwindcss.com/">Tailwind CSS</a>{" "}
        and <a href="https://supabase.com/">Supabase</a>.
      </p>
    </>
  );
}
