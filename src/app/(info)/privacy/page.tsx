import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy · Kanji Checklist" };

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-zinc-600">Last updated {site.legalLastUpdated}</p>

      <p>
        {site.name} is a free website for tracking your kanji study, run by {site.operator}. We collect as little
        personal data as possible. This page explains what we store, why, who helps us store it, and how to delete
        it.
      </p>

      <h2>What we store</h2>
      <p>You can browse the kanji without an account. If you sign in with Google, we store:</p>
      <ul>
        <li>
          <strong>Your Google account details:</strong> your email address, your name, a link to your Google
          profile picture, and your Google account ID. Google sends these to us when you sign in.
        </li>
        <li>
          <strong>Your kanji progress:</strong> which kanji you have marked as learning, struggling or learnt, and
          when you last changed each one.
        </li>
        <li>
          <strong>Sign-in records:</strong> when your account was created and when you last signed in.
        </li>
      </ul>
      <p>
        We don&apos;t use analytics, advertising or tracking tools, and we don&apos;t sell or share your data with
        anyone except the service providers below.
      </p>

      <h2>Why we store it</h2>
      <p>
        Only to let you sign in and to save your progress so you can see it on any device. We need this data to
        provide the service you sign up for.
      </p>

      <h2>Cookies</h2>
      <p>
        We only use cookies that the site needs to work: login cookies that keep you signed in, and a short-lived
        cookie (deleted after 10 minutes) that returns you to the page you were on after signing in. We don&apos;t
        use advertising or tracking cookies, so there is no cookie banner.
      </p>

      <h2>Who processes your data</h2>
      <ul>
        <li>
          <strong>Supabase</strong> stores your account and progress in its database and handles sign-in.
        </li>
        <li>
          <strong>Vercel</strong> hosts the website. Like any web host, it handles your requests and may keep
          short-term technical logs (such as IP addresses) to run and protect the service.
        </li>
        <li>
          <strong>Google</strong> confirms who you are when you choose &quot;Sign in with Google&quot;. Google&apos;s
          own privacy policy covers your Google account.
        </li>
      </ul>
      <p>These providers may store data on servers outside your country.</p>

      <h2>How long we keep it</h2>
      <p>We keep your account and progress until you delete your account.</p>

      <h2>Deleting your data</h2>
      <p>
        Go to <Link href="/settings">Settings</Link> and use <strong>Delete my account</strong>. This permanently
        deletes your account and all your kanji progress straight away. You can sign up again later, but your old
        progress can&apos;t be recovered.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example in the UK or the EU), you have the right to see the data we hold
        about you, correct it, delete it, or object to how we use it. You can delete everything yourself in
        Settings. For anything else, contact us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. You can also complain to your local data
        protection authority.
      </p>

      <h2>Children</h2>
      <p>
        You must be at least 13 years old to create an account. If you think a child under 13 has created an
        account, contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update the date at the top of this page. If we start collecting new kinds
        of data (for example, if we add advertising), we will say so here before it happens.
      </p>
    </>
  );
}
