"use client";

import { useEffect } from "react";
import { clearLocalProgress, getLocalProgress } from "@/lib/local-progress";
import { createClient } from "@/lib/supabase/client";

// After sign-in: copies progress saved in this browser (while signed out) into
// the account, then clears the browser copy. If the account already has a
// colour for a kanji, the account's colour is kept.
export function LocalProgressMerge({ userId }: { userId: string }) {
  useEffect(() => {
    const local = getLocalProgress();
    const rows = Object.entries(local).map(([kanji, status]) => ({ user_id: userId, kanji, status }));
    if (rows.length === 0) return;

    createClient()
      .from("user_kanji_progress")
      .upsert(rows, { onConflict: "user_id,kanji", ignoreDuplicates: true })
      .then(({ error }) => {
        // On failure, keep the browser copy so we can try again next visit.
        if (error) return;
        clearLocalProgress();
        window.location.reload(); // show the merged progress
      });
  }, [userId]);

  return null;
}
