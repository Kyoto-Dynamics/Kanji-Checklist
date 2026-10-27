import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Invite only · Kanji Checklist" };

export default function InviteOnlyPage() {
  return (
    <>
      <h1>Sign-up is invite-only for now</h1>
      <p>
        Kanji Checklist is in an early test, so new accounts are by invitation only. Your Google account has not
        been added to Kanji Checklist.
      </p>
      <p>
        You can still use the whole checklist without an account: your progress is saved in this browser.{" "}
        <Link href="/">Back to the checklist</Link>
      </p>
    </>
  );
}
