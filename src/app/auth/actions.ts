"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { returnToCookie } from "@/lib/return-to";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  const referer = requestHeaders.get("referer");
  if (origin && referer?.startsWith(`${origin}/`)) {
    (await cookies()).set(returnToCookie, referer.slice(origin.length), {
      path: "/",
      maxAge: 600,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    redirect("/auth/error");
  }
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
