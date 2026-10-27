import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { returnToCookie } from "@/lib/return-to";
import { createClient } from "@/lib/supabase/server";

// Google (via Supabase) sends the user back here after sign-in, with a one-time
// code. We swap the code for a login session, which is saved in cookies, then
// return the user to the page they signed in from.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const flowId = searchParams.get("sb_flow_id");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );
    if (!error) {
      const cookieStore = await cookies();
      const returnTo = cookieStore.get(returnToCookie)?.value;
      cookieStore.delete(returnToCookie);
      // Only follow paths on this site ("/settings"), never "//other-site.com".
      const path = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  // The sign-up allowlist hook (see supabase/migrations) refused a new account.
  if (searchParams.get("error_description")?.includes("invite-only")) {
    return NextResponse.redirect(`${origin}/invite-only`);
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
