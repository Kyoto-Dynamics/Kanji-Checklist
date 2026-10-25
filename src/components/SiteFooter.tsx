import Link from "next/link";

const links = [
  { href: "/settings", label: "Settings" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/credits", label: "Credits" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200">
      <nav aria-label="Site information" className="mx-auto w-full max-w-2xl px-4 py-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-zinc-700 underline hover:text-zinc-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
