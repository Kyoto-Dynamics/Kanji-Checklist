// Shared text styling for the Privacy, Terms, Credits and "account deleted" pages.
export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8 leading-7 text-zinc-800 [&_a]:text-blue-700 [&_a]:underline [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-zinc-900 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
      {children}
    </main>
  );
}
