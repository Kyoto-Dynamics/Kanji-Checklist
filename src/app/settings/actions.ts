"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type DeleteAccountState = { error: string } | null;

// Permanently deletes the signed-in user. Their kanji progress is removed
// automatically by the database (on delete cascade).
export async function deleteAccount(
  _previous: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  if (String(formData.get("confirm") ?? "").trim() !== "DELETE") {
    return { error: "Type DELETE in capital letters to confirm." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) {
    return { error: "You're no longer signed in. Please sign in again and retry." };
  }

  const { error } = await createAdminClient().auth.admin.deleteUser(userId);
  if (error) {
    return { error: "Something went wrong and your account was not deleted. Please try again." };
  }

  // Remove the login cookies from this browser.
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/", "layout");
  redirect("/account-deleted");
}
