import { createClient } from "@supabase/supabase-js";

// Supabase client with the secret key, which bypasses Row Level Security.
// SERVER ONLY: import this only from server actions or route handlers, never
// from a "use client" component, or the secret key would be sent to browsers.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set.");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
