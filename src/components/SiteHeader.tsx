import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/UserMenu";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 font-bold">
          Kanji Checklist
        </Link>
        <Suspense fallback={null}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
