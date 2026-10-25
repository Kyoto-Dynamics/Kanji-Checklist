import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account deleted · Kanji Checklist" };

export default function AccountDeletedPage() {
  return (
    <>
      <h1>Your account has been deleted</h1>
      <p>Your account and all your kanji progress have been permanently deleted. Thanks for using Kanji Checklist.</p>
      <p>
        You can still browse the kanji without an account. <Link href="/">Back to the checklist</Link>
      </p>
    </>
  );
}
