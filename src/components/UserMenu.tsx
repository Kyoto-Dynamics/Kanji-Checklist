import { signInWithGoogle, signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

const buttonClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

// Shows a sign-in button, or the signed-in user's name with a sign-out button.
export async function UserMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return (
      <form action={signInWithGoogle}>
        <button type="submit" className={buttonClass}>
          Sign in with Google
        </button>
      </form>
    );
  }

  const name: string = claims.user_metadata?.full_name ?? claims.email ?? "you";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <p className="min-w-0 truncate text-sm">
        <span className="sr-only">Signed in as </span>
        {name}
      </p>
      <form action={signOut}>
        <button type="submit" className={buttonClass}>
          Sign out
        </button>
      </form>
    </div>
  );
}
