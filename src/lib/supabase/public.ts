import { createClient } from "@supabase/supabase-js";

// Supabase client for public data (like the kanji list) that is the same for
// every visitor. It ignores login cookies, so its results can be cached.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}
