import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-bold">Sign-in didn&apos;t work</h1>
      <p className="text-zinc-700">Something went wrong while signing you in. Please try again.</p>
      <Link href="/" className="font-medium text-blue-700 underline">
        Back to the home page
      </Link>
    </main>
  );
}
