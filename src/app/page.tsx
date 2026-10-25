import { Suspense } from "react";
import { SupabaseStatus } from "@/components/SupabaseStatus";

const statuses = [
  { label: "Not started", symbol: "○", className: "bg-zinc-200 text-zinc-800" },
  { label: "Learning", symbol: "…", className: "bg-yellow-200 text-yellow-900" },
  { label: "Struggling", symbol: "!", className: "bg-red-200 text-red-900" },
  { label: "Learnt", symbol: "✓", className: "bg-green-200 text-green-900" },
];

const levels = ["N5", "N4", "N3", "N2", "N1"];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-12">
      <header className="flex flex-col gap-3">
        <p lang="ja" className="font-jp text-5xl">
          漢字
        </p>
        <h1 className="text-3xl font-bold">Kanji Checklist</h1>
        <p className="text-lg text-zinc-700">
          Track your kanji progress for every JLPT level, from N5 to N1. Tap a kanji to change its colour.
        </p>
      </header>

      <section aria-labelledby="statuses-heading" className="flex flex-col gap-3">
        <h2 id="statuses-heading" className="text-xl font-semibold">
          Colours
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statuses.map((status) => (
            <li key={status.label} className={`rounded-lg px-3 py-2 font-medium ${status.className}`}>
              <span aria-hidden="true">{status.symbol} </span>
              {status.label}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="levels-heading" className="flex flex-col gap-3">
        <h2 id="levels-heading" className="text-xl font-semibold">
          Levels
        </h2>
        <ul className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <li key={level} className="rounded-lg border border-zinc-300 px-4 py-2 font-medium">
              {level}
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-600">Level pages are coming soon.</p>
      </section>

      <section aria-labelledby="setup-heading" className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4 text-sm">
        <h2 id="setup-heading" className="font-semibold">
          Setup check
        </h2>
        <Suspense fallback={<p>Checking Supabase connection…</p>}>
          <SupabaseStatus />
        </Suspense>
      </section>
    </main>
  );
}
