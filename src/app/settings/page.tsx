import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { signInWithGoogle } from "@/app/auth/actions";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings · Kanji Checklist" };

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Suspense fallback={<p className="text-zinc-700">Loading…</p>}>
        <AccountSettings />
      </Suspense>
    </main>
  );
}

async function AccountSettings() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-zinc-700">Sign in to see your account settings.</p>
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  const { count } = await supabase
    .from("user_kanji_progress")
    .select("kanji", { count: "exact", head: true });
  const coloured = count ?? 0;

  return (
    <>
      <section aria-labelledby="account-heading" className="flex flex-col gap-3">
        <h2 id="account-heading" className="text-xl font-semibold">
          Your account
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt className="text-zinc-600">Name</dt>
          <dd>{claims.user_metadata?.full_name ?? "–"}</dd>
          <dt className="text-zinc-600">Email</dt>
          <dd className="break-all">{claims.email ?? "–"}</dd>
          <dt className="text-zinc-600">Signed in with</dt>
          <dd>Google</dd>
          <dt className="text-zinc-600">Kanji coloured</dt>
          <dd>{coloured}</dd>
        </dl>
      </section>

      <section
        aria-labelledby="delete-heading"
        className="flex flex-col gap-3 rounded-lg border border-red-300 bg-red-50 p-4"
      >
        <h2 id="delete-heading" className="text-xl font-semibold text-red-900">
          Delete my account
        </h2>
        <p className="text-zinc-800">
          This permanently deletes your account and all your kanji progress ({coloured} kanji coloured). It
          happens straight away and can&apos;t be undone.
        </p>
        <DeleteAccountForm />
      </section>
    </>
  );
}
