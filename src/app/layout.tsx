import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanji Checklist",
  description: "Track your kanji progress for every JLPT level, N5 to N1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
