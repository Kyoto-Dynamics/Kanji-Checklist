// Temporary check that .env.local is set up correctly. Remove once sign-in works.
export async function SupabaseStatus() {
  const { ok, message } = await checkConnection();

  return (
    <p className={ok ? "text-green-800" : "text-red-800"}>
      <span aria-hidden="true">{ok ? "✓ " : "✗ "}</span>
      {message}
    </p>
  );
}

async function checkConnection(): Promise<{ ok: boolean; message: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, message: "Not set up yet. Add your keys to .env.local (see README)." };
  }

  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (res.ok) {
      return { ok: true, message: "Connected to Supabase." };
    }
    const check = res.status === 404 ? "URL (it should end in .supabase.co)" : "key";
    return { ok: false, message: `Supabase replied with error ${res.status}. Check the ${check} in .env.local.` };
  } catch {
    return { ok: false, message: "Could not reach Supabase. Check the URL in .env.local." };
  }
}
