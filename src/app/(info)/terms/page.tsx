import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use · Kanji Checklist" };

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Use</h1>
      <p className="text-sm text-zinc-600">Last updated {site.legalLastUpdated}</p>

      <p>
        These terms apply when you use {site.name}, a free website run by {site.operator}. By using the site, you
        agree to them.
      </p>

      <h2>Who can use the site</h2>
      <p>
        Anyone can browse the kanji. To create an account and save progress, you must be at least 13 years old.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You sign in with your Google account and are responsible for keeping it secure.</li>
        <li>
          You can delete your account at any time in <Link href="/settings">Settings</Link>. This also deletes your
          progress.
        </li>
        <li>We may suspend or delete accounts that break these terms.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>Please don&apos;t:</p>
      <ul>
        <li>try to access other people&apos;s accounts or data, or break the site&apos;s security;</li>
        <li>overload the site, for example with automated requests or scraping;</li>
        <li>use the site for anything illegal.</li>
      </ul>

      <h2>The kanji data</h2>
      <p>
        The kanji information comes from openly licensed sources and may contain mistakes. JLPT levels are based
        on unofficial lists, because the JLPT has not published an official kanji list since 2010. See the{" "}
        <Link href="/credits">Credits</Link> page for sources and licences.
      </p>

      <h2>No guarantees</h2>
      <p>
        The site is provided free and &quot;as is&quot;. We do our best to keep it running and your progress safe,
        but we can&apos;t promise it will always be available or error-free. We may change, pause or close the
        service. If we plan to close it, we will try to give notice so you can note your progress.
      </p>

      <h2>Liability</h2>
      <p>
        As far as the law allows, we are not liable for any loss arising from your use of the site. Nothing in
        these terms limits rights you have under consumer law that can&apos;t be limited.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. We will change the date at the top of this page when we do. Continuing to use
        the site after a change means you accept the new terms.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p>
    </>
  );
}
