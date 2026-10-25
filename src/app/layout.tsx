import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanji Checklist",
  description: "Track your kanji progress for every JLPT level, N5 to N1.",
};

// The site is designed for a white background; this stops browsers from
// automatically darkening it when the device is in dark mode.
export const viewport: Viewport = {
  colorScheme: "only light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
