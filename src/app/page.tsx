import { connection } from "next/server";
import { Suspense } from "react";
import { KanjiGrid } from "@/components/KanjiGrid";
import { LocalProgressMerge } from "@/components/LocalProgressMerge";
import { getLevelKanji, getUserProgress, type LevelKanji } from "@/lib/kanji";
import { type KanjiStatus, statusInfo, statusOrder } from "@/lib/kanji-status";
import { levels } from "@/lib/levels";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Cached, so this doesn't hit the database on every visit.
  const kanjiByLevel = await Promise.all(levels.map((level) => getLevelKanji(level.number)));

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Kanji Checklist</h1>
        <p className="text-zinc-700">
          Every JLPT kanji from N5 to N1, most common first within each level. No account needed: your progress is
          saved as you go.
        </p>
        <p className="text-sm text-zinc-700">
          Tap a kanji to cycle:{" "}
          {statusOrder.map((status, index) => (
            <span key={status}>
              {index > 0 && " → "}
              <span aria-hidden="true">{statusInfo[status].symbol} </span>
              {statusInfo[status].label}
            </span>
          ))}
        </p>
      </header>

      <nav aria-label="Jump to level" className="sticky top-0 z-10 -mx-4 bg-white/95 px-4 py-2 backdrop-blur">
        <ul className="flex gap-2">
          {levels.map((level) => (
            <li key={level.slug} className="flex-1">
              <a
                href={`#${level.slug}`}
                className="block rounded-lg border border-zinc-300 py-2 text-center font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {level.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<LevelSections kanjiByLevel={kanjiByLevel} progress={{}} userId={null} loading />}>
        <SignedInLevelSections kanjiByLevel={kanjiByLevel} />
      </Suspense>
    </main>
  );
}

// Reads the signed-in user (if any) and their progress once, on every visit.
async function SignedInLevelSections({ kanjiByLevel }: { kanjiByLevel: LevelKanji[][] }) {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;
  const progress = userId ? await getUserProgress() : {};

  return (
    <>
      {userId ? (
        <LocalProgressMerge userId={userId} />
      ) : (
        <p className="rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-950">
          Your progress is saved in this browser. Sign in with Google (optional) to keep it on all your devices.
        </p>
      )}
      <LevelSections kanjiByLevel={kanjiByLevel} progress={progress} userId={userId} />
    </>
  );
}

function LevelSections({
  kanjiByLevel,
  progress,
  userId,
  loading = false,
}: {
  kanjiByLevel: LevelKanji[][];
  progress: Record<string, KanjiStatus>;
  userId: string | null;
  loading?: boolean;
}) {
  return levels.map((level, index) => (
    <section key={level.slug} id={level.slug} aria-labelledby={`${level.slug}-heading`} className="scroll-mt-16">
      <h2 id={`${level.slug}-heading`} className="mb-3 flex items-baseline gap-2 text-2xl font-bold">
        JLPT {level.name}
        <span className="text-base font-normal text-zinc-600">{kanjiByLevel[index].length} kanji</span>
      </h2>
      <KanjiGrid
        levelName={level.name}
        kanji={kanjiByLevel[index]}
        initialProgress={progress}
        userId={userId}
        loading={loading}
      />
    </section>
  ));
}
