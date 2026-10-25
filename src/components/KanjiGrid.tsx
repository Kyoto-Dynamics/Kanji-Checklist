"use client";

import { useRef, useState } from "react";
import { signInWithGoogle } from "@/app/auth/actions";
import type { LevelKanji } from "@/lib/kanji";
import { type KanjiStatus, nextStatus, statusInfo, statusOrder } from "@/lib/kanji-status";
import { createClient } from "@/lib/supabase/client";

type Progress = Record<string, KanjiStatus>;

// Wait this long after the last tap before saving, so tapping three times to
// reach green sends one save instead of three.
const saveDelayMs = 500;

function withStatus(progress: Progress, character: string, status: KanjiStatus): Progress {
  const updated = { ...progress };
  if (status === "unlearnt") delete updated[character];
  else updated[character] = status;
  return updated;
}

export function KanjiGrid({
  levelName,
  kanji,
  initialProgress,
  userId,
  loading = false,
}: {
  levelName: string;
  kanji: LevelKanji[];
  initialProgress: Progress;
  userId: string | null;
  loading?: boolean;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [message, setMessage] = useState<"sign-in" | string | null>(null);
  // What the database has, so a failed save can go back to it.
  const saved = useRef(initialProgress);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  // Saves for the same kanji run one after another, so they can't arrive out of order.
  const queues = useRef(new Map<string, Promise<void>>());

  function handleTap(character: string) {
    if (!userId) {
      setMessage("sign-in");
      return;
    }
    const status = nextStatus(progress[character] ?? "unlearnt");
    setProgress((current) => withStatus(current, character, status));
    clearTimeout(timers.current.get(character));
    timers.current.set(
      character,
      setTimeout(() => {
        timers.current.delete(character);
        const previous = queues.current.get(character) ?? Promise.resolve();
        queues.current.set(character, previous.then(() => save(userId, character, status)));
      }, saveDelayMs),
    );
  }

  async function save(user: string, character: string, status: KanjiStatus) {
    const supabase = createClient();
    const table = supabase.from("user_kanji_progress");
    const { error } =
      status === "unlearnt"
        ? await table.delete().eq("user_id", user).eq("kanji", character)
        : await table.upsert({ user_id: user, kanji: character, status }, { onConflict: "user_id,kanji" });

    if (error) {
      // Go back to the saved colour, unless the user has tapped this kanji again since.
      if (!timers.current.has(character)) {
        setProgress((current) =>
          withStatus(current, character, saved.current[character] ?? "unlearnt"),
        );
      }
      setMessage(`Couldn't save ${character}. Check your connection and try again.`);
    } else {
      saved.current = withStatus(saved.current, character, status);
    }
  }

  const counts = Object.fromEntries(statusOrder.map((status) => [status, 0])) as Record<KanjiStatus, number>;
  for (const { character } of kanji) counts[progress[character] ?? "unlearnt"]++;
  const learntPercent = kanji.length ? Math.round((counts.learnt / kanji.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <section aria-label={`${levelName} progress summary`} className="flex flex-col gap-3">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statusOrder.map((status) => (
            <li
              key={status}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 font-medium ${statusInfo[status].className}`}
            >
              <span>
                <span aria-hidden="true">{statusInfo[status].symbol} </span>
                {statusInfo[status].label}
              </span>
              <span className="tabular-nums">{loading ? "–" : counts[status]}</span>
            </li>
          ))}
        </ul>
        <div>
          <div
            role="progressbar"
            aria-label={`${levelName} kanji learnt`}
            aria-valuenow={learntPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-zinc-200"
          >
            <div className="h-full bg-green-600" style={{ width: `${learntPercent}%` }} />
          </div>
          <p className="mt-1 text-sm text-zinc-700">
            {loading ? "Loading your progress…" : `${counts.learnt} of ${kanji.length} learnt (${learntPercent}%)`}
          </p>
        </div>
      </section>

      <div aria-live="polite">
        {message === "sign-in" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm">
            <p>Sign in to save your progress.</p>
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-3 py-1.5 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        ) : message ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            {message}
          </p>
        ) : null}
      </div>

      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {kanji.map(({ character, meaning }) => {
          const info = statusInfo[progress[character] ?? "unlearnt"];
          return (
            <li key={character}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleTap(character)}
                aria-label={`${character}, ${meaning}: ${info.label}`}
                className={`relative flex aspect-square w-full items-center justify-center rounded-lg border-2 font-jp text-3xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait ${info.className}`}
              >
                <span lang="ja">{character}</span>
                <span aria-hidden="true" className="absolute right-1 top-0.5 font-sans text-xs font-bold">
                  {info.symbol}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
