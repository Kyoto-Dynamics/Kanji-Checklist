# Kanji Checklist

A free public website where Japanese learners track their kanji progress by JLPT level (N5 to N1). Each signed-in user marks every kanji with a colour:

| Colour | Status value (database) | Meaning |
| --- | --- | --- |
| Grey | `unlearnt` | Not started (default, no row stored) |
| Yellow | `learning` | In progress |
| Red | `struggling` | Struggling with it |
| Green | `learnt` | Learnt |

"Kanji Checklist" is a placeholder name. There is no domain yet.

## About the owner (read this first)

- The owner, Carl, is a product manager with minimal coding experience (a degree about 10 years ago). Carl is learning Japanese at about N4 level and has about 10 hours a week for this project.
- Explain what you are about to do and why in plain language before making changes. Avoid jargon, or define it in one short phrase.
- Work in small steps. Each step should end with something Carl can see working in the browser at http://localhost:3000.
- After each step, tell Carl exactly what to check, and suggest a short commit message.
- Ask before you add a new library, create a new external account or service, or do anything that could cost money. Say what it costs.
- Never run `git push`, deploy, or change the live Supabase database without asking first.
- When a command needs to be run by Carl (for example, pasting SQL into the Supabase dashboard), give exact click-by-click steps.

## Stack

- **Next.js** (App Router) with **TypeScript** and **Tailwind CSS**. Use the `src/` folder.
- **Supabase** for the Postgres database and authentication, via `@supabase/supabase-js` and `@supabase/ssr` (cookie-based sessions for server components).
- **Vercel** for hosting (free Hobby plan for now).
- **npm** as the package manager. Node.js LTS.
- Keep dependencies few. Prefer what Next.js, React, Tailwind and Supabase already provide.

## Commands

- `npm install`: download libraries
- `npm run dev`: run the site locally at http://localhost:3000
- `npm run lint`: check code style
- `npm run build`: production build. Run `lint` and `build` before saying a step is done, and fix any errors.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable (anon) key
- `SUPABASE_SECRET_KEY`: Supabase secret (service role) key. Server-only, used only for account deletion and the data import script. Never prefix with `NEXT_PUBLIC_`, never import it in client components.

Real values live in `.env.local`, which must stay in `.gitignore`. Keep `.env.example` in the repo with the names and empty values.

## Data model

All database changes go in SQL files under `supabase/migrations/` (named `YYYYMMDDHHMMSS_description.sql`) so they are tracked in git. Carl applies them by pasting into the Supabase SQL Editor until we adopt the Supabase CLI.

- `kanji`: one row per kanji. Columns: `character` (text, primary key), `jlpt_level` (smallint 1 to 5, where 5 = N5 and 1 = N1), `meanings` (text[]), `on_readings` (text[]), `kun_readings` (text[]), `stroke_count` (smallint), `frequency` (int, nullable), `sort_order` (int, for display order within a level). Readable by everyone, writable by nobody through the API.
- `user_kanji_progress`: one row per user per kanji that is not grey. Columns: `user_id` (uuid, references `auth.users` with `on delete cascade`), `kanji` (text, references `kanji.character`), `status` (enum `kanji_status`: `learning`, `struggling`, `learnt`), `updated_at` (timestamptz default now()). Primary key `(user_id, kanji)`. Setting a kanji back to grey deletes the row.
- **Row Level Security must be enabled on every table.** Users may select, insert, update and delete only rows where `user_id = auth.uid()`.

## Kanji data and licences

- Kanji details (meanings, readings, stroke count, frequency) come from **KANJIDIC2** by the Electronic Dictionary Research and Development Group (EDRDG), licensed **CC BY-SA 4.0**: https://www.edrdg.org/edrdg/licence.html
- JLPT level lists (N5 to N1) come from **Jonathan Waller's lists** at http://www.tanos.co.uk/jlpt/ (Creative Commons BY). There is no official JLPT kanji list since 2010.
- Import with a script in `scripts/` that reads the source files and produces a SQL seed or upserts via the secret key. Keep the script in the repo so the data can be rebuilt. Do not commit the large raw source files; document where to download them in `scripts/README.md`.
- The site must have a Credits page attributing both sources with links.
- Do not copy data from WaniKani, Jisho, Anki shared decks or similar apps.

## UI and behaviour

- Mobile first, then desktop. English UI. Japanese characters must render with a good CJK font stack (for example `"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`).
- A page per JLPT level showing a grid of kanji tiles, plus a progress summary per level (counts of each colour).
- Tapping a tile cycles grey → yellow → red → green → grey. Save immediately (optimistic update, revert and show a message on error).
- Colour must not be the only signal: also show a small icon or label for each status, for colour-blind users. Meet basic accessibility (keyboard focus, labels, contrast).
- Signed-out visitors can browse the kanji grid but must sign in to save progress.
- Sign-in methods: Google first. Discord and GitHub may be added. No email/password and no Apple login (Apple costs $99/year) unless Carl asks.

## Privacy and compliance

Before public launch the site needs:

- A Privacy Policy page (what is stored: email, name, kanji progress; who processes it: Supabase, Vercel, Google; how to delete it).
- A Terms of Use page (minimum age 13).
- A Delete my account button in Settings that deletes the auth user (server-side, using the secret key) so progress rows cascade-delete.
- A Credits page (see above).
- Later, when ads are added: a cookie consent banner for EU/UK visitors. Login cookies alone do not need one.

Collect the minimum personal data. No analytics or tracking scripts without asking Carl first.

## Cost rules

Carl wants to spend as little as possible. Flag any cost before suggesting it. Known limits:

- Vercel Hobby plan is free but **non-commercial only**. When ads or Patreon income start, the options are Vercel Pro ($20/month) or moving to Cloudflare (free, commercial allowed).
- Supabase free plan: 500 MB database, 50,000 monthly active users, project pauses after 1 week with no activity. Pro is $25/month.
- Claude Code runs on Carl's Claude Pro plan, which has usage limits. Keep sessions focused and avoid re-reading large files unnecessarily.

## Roadmap

Work through these in order. Do not start a later phase without Carl asking.

**Phase 1: Foundations**
1. Scaffold Next.js + TypeScript + Tailwind + ESLint, add Supabase client helpers, `.env.example`, and a simple home page.
2. Google sign-in and sign-out, with a header showing the signed-in user.
3. Database migrations for `kanji` and `user_kanji_progress` with Row Level Security.
4. Kanji import script and seed data for N5 to N1.
5. Level pages with the kanji grid, colour cycling, and progress summary.
6. Settings page with Delete my account; Privacy, Terms and Credits pages.
7. Deploy to Vercel.

**Phase 2: Polish**
- Kanji detail view (meanings, readings, stroke count), filters (show only red, and so on), overall progress dashboard, data export (download my progress).

**Phase 3: Practice**
- Quizzes and practice tests based on the user's yellow and red kanji. Possibly stroke order from KanjiVG (CC BY-SA 3.0).

**Phase 4: Launch and income**
- Custom domain, Patreon link, ads with cookie consent, review hosting plan (see Cost rules).

## Conventions

- TypeScript strict mode. Functional React components. Server components by default; add `"use client"` only where interactivity needs it.
- Use Tailwind classes for styling; no extra UI framework unless Carl agrees.
- Folder names in kebab-case, React components in PascalCase.
- Small, focused commits with clear messages in plain English (for example `Add Google sign-in`).
- Keep `README.md` up to date with setup and run steps written for a beginner.
